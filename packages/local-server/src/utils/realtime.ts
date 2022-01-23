import http from 'http';
import debug from 'debug';
import { WebSocket, WebSocketServer } from 'ws';
import * as Y from 'yjs';
import { LeveldbPersistence } from 'y-leveldb';
import * as syncProtocol from 'y-protocols/sync';
import * as awarenessProtocol from 'y-protocols/awareness';
import { encoding, decoding, mutex, map } from 'lib0';

import { getDocDir } from './doc.js';

const d = debug('tuture:local-server:realtime');

const wsReadyStateConnecting = 0;
const wsReadyStateOpen = 1;
const wsReadyStateClosing = 2; // eslint-disable-line
const wsReadyStateClosed = 3; // eslint-disable-line

const messageSync = 0;
const messageAwareness = 1;
// const messageAuth = 2

// disable gc when using snapshots!
const gcEnabled = process.env.GC !== 'false' && process.env.GC !== '0';

class Persistence {
  provider: LeveldbPersistence;

  constructor(docName: string) {
    this.provider = new LeveldbPersistence(getDocDir(docName));
  }

  async bindState(docName: string, ydoc: Y.Doc) {
    const persistedYdoc = await this.provider.getYDoc(docName);
    const newUpdates = Y.encodeStateAsUpdate(ydoc);
    this.provider.storeUpdate(docName, newUpdates);
    Y.applyUpdate(ydoc, Y.encodeStateAsUpdate(persistedYdoc));
    ydoc.on('update', (update: Uint8Array) => {
      this.provider.storeUpdate(docName, update);
    });
  }

  async writeState(docName: string, ydoc: Y.Doc) {}
}

export const docs = new Map<string, WSSharedDoc>();

const updateHandler = (update: Uint8Array, origin: any, doc: WSSharedDoc) => {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint(encoder, messageSync);
  syncProtocol.writeUpdate(encoder, update);
  const message = encoding.toUint8Array(encoder);
  doc.conns.forEach((_, conn) => send(doc, conn, message));
};

type change = {
  added: number[];
  updated: number[];
  removed: number[];
};

class WSSharedDoc extends Y.Doc {
  name: string;
  mux: mutex.mutex;
  conns: Map<WebSocket, Set<number>>;
  awareness: awarenessProtocol.Awareness;
  persistence: Persistence;

  /**
   * @param {string} name
   */
  constructor(name: string) {
    super({ gc: gcEnabled });
    this.name = name;
    this.mux = mutex.createMutex();
    this.conns = new Map<WebSocket, Set<number>>();

    this.awareness = new awarenessProtocol.Awareness(this);
    this.awareness.setLocalState(null);

    const awarenessChangeHandler = (change: change, conn: WebSocket) => {
      const { added, updated, removed } = change;
      const changedClients = added.concat(updated, removed);
      if (conn !== null) {
        const connControlledIDs = /** @type {Set<number>} */ this.conns.get(
          conn,
        );
        if (connControlledIDs !== undefined) {
          added.forEach((clientID) => {
            connControlledIDs.add(clientID);
          });
          removed.forEach((clientID) => {
            connControlledIDs.delete(clientID);
          });
        }
      }
      // broadcast awareness update
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients),
      );
      const buff = encoding.toUint8Array(encoder);
      this.conns.forEach((_, c) => {
        send(this, c, buff);
      });
    };
    this.awareness.on('update', awarenessChangeHandler);
    this.on('update', updateHandler);

    this.persistence = new Persistence(name);
  }
}

/**
 * Gets a Y.Doc by name, whether in memory or on disk
 *
 * @param {string} docId - the id of the Y.Doc to find or create
 * @param {boolean} gc - whether to allow gc on the doc (applies only when created)
 * @return {WSSharedDoc}
 */
export const getYDoc = (docId: string, gc = true): WSSharedDoc =>
  map.setIfUndefined(docs, docId, () => {
    const doc = new WSSharedDoc(docId);
    doc.gc = gc;
    doc.persistence.bindState(docId, doc);
    docs.set(docId, doc);
    return doc;
  });

const messageListener = (
  conn: WebSocket,
  doc: WSSharedDoc,
  message: Uint8Array,
) => {
  const encoder = encoding.createEncoder();
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);
  switch (messageType) {
    case messageSync:
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.readSyncMessage(decoder, encoder, doc, null);
      if (encoding.length(encoder) > 1) {
        send(doc, conn, encoding.toUint8Array(encoder));
      }
      break;
    case messageAwareness: {
      awarenessProtocol.applyAwarenessUpdate(
        doc.awareness,
        decoding.readVarUint8Array(decoder),
        conn,
      );
      break;
    }
  }
};

const closeConn = (doc: WSSharedDoc, conn: WebSocket) => {
  if (doc.conns.has(conn)) {
    doc.conns.delete(conn);
    const controlledIds = doc.conns.get(conn);
    if (!controlledIds) return;
    awarenessProtocol.removeAwarenessStates(
      doc.awareness,
      Array.from(controlledIds),
      null,
    );
    if (doc.conns.size === 0) {
      // if persisted, we store state and destroy ydocument
      doc.persistence.writeState(doc.name, doc).then(() => {
        doc.destroy();
      });
      docs.delete(doc.name);
    }
  }
  conn.close();
};

const send = (doc: WSSharedDoc, conn: WebSocket, m: Uint8Array) => {
  if (
    conn.readyState !== wsReadyStateConnecting &&
    conn.readyState !== wsReadyStateOpen
  ) {
    closeConn(doc, conn);
  }
  try {
    conn.send(
      m,
      /** @param {any} err */ (err) => {
        err != null && closeConn(doc, conn);
      },
    );
  } catch (e) {
    closeConn(doc, conn);
  }
};

const pingTimeout = 30000;

function setupWSConnection(
  conn: WebSocket,
  req: http.IncomingMessage,
  { docId = req.url!.slice(1).split('?')[0], gc = true } = {},
) {
  d('setup ws connection for doc id: %s, gc: %s', docId, gc);

  conn.binaryType = 'arraybuffer';
  // get doc, initialize if it does not exist yet
  const doc = getYDoc(docId, gc);
  doc.conns.set(conn, new Set());
  // listen and reply to events
  conn.on('message', (message: ArrayBuffer) =>
    messageListener(conn, doc, new Uint8Array(message)),
  );

  // Check if connection is still alive
  let pongReceived = true;
  const pingInterval = setInterval(() => {
    if (!pongReceived) {
      if (doc.conns.has(conn)) {
        closeConn(doc, conn);
      }
      clearInterval(pingInterval);
    } else if (doc.conns.has(conn)) {
      pongReceived = false;
      try {
        conn.ping();
      } catch (e) {
        closeConn(doc, conn);
        clearInterval(pingInterval);
      }
    }
  }, pingTimeout);
  conn.on('close', () => {
    closeConn(doc, conn);
    clearInterval(pingInterval);
  });
  conn.on('pong', () => {
    pongReceived = true;
  });
  // put the following in a variables in a block so the interval handlers don't keep in in
  // scope
  {
    // send sync step 1
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, doc);
    send(doc, conn, encoding.toUint8Array(encoder));
    const awarenessStates = doc.awareness.getStates();
    if (awarenessStates.size > 0) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAwareness);
      encoding.writeVarUint8Array(
        encoder,
        awarenessProtocol.encodeAwarenessUpdate(
          doc.awareness,
          Array.from(awarenessStates.keys()),
        ),
      );
      send(doc, conn, encoding.toUint8Array(encoder));
    }
  }
}

export function configureRealtimeCollab(server: http.Server) {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (conn, req) =>
    setupWSConnection(conn, req, {
      gc: req.url!.slice(1) !== 'prosemirror-versions',
    }),
  );
}
