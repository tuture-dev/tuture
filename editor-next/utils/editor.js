import React, { useMemo } from 'react';
import { createEditor } from 'slate';
import { withReact } from 'slate-react';
import { withHistory } from 'slate-history';
import { defaultPlugins } from 'editure';

import { withImages } from './image';

const plugins = [withReact, withHistory, withImages, ...defaultPlugins];

export const editor = useMemo(
  () => plugins.reduce(
    (augmentedEditor, plugin) => plugin(augmentedEditor),
    createEditor(),
  ),
  [],
);

export const EditorContext = React.createContext(editor);
