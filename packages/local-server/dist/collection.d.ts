import { Collection } from '@tuture/core';
export declare const collectionPath: string;
export declare const collectionCheckpoint: string;
export declare const collectionVcsPath: string;
/**
 * Load collection.
 */
export declare function loadCollection(): Collection;
/**
 * Save the entire collection back to workspace.
 */
export declare function saveCollection(collection: Collection): void;
export declare function saveCheckpoint(): void;
export declare function hasCollectionChangedSinceCheckpoint(): boolean;
//# sourceMappingURL=collection.d.ts.map