import React, { useCallback, useContext } from 'react';
import { Slate, Editable } from 'slate-react';
import { updateLastSelection } from 'editure';

import Leaf from './leaf';
import Element from './element';
import createHotKeysHandler from './hotkeys';
import { createDropListener } from '../../utils/image';
import { EditorContext } from '../../utils/editor';

function Editure({
  value, onChange, placeholder, readOnly = false,
}) {
  const editor = useContext(EditorContext);
  const renderElement = useCallback(Element, []);
  const renderLeaf = useCallback(Leaf, []);

  // Refs for controlling buttons.
  const buttonRefs = {
    imageBtnRef: React.createRef(),
    linkBtnRef: React.createRef(),
  };

  const hotKeyHandler = createHotKeysHandler(editor, buttonRefs);

  // const [linkStatus, linkDispatch] = useReducer(linkReducer, {
  //   isEditing: false,
  //   text: '',
  //   url: '',
  // });

  updateLastSelection(editor.selection);

  return (
    <Slate editor={editor} value={value} onChange={onChange}>
      <Editable
        placeholder={placeholder}
        readOnly={readOnly}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={hotKeyHandler}
        onCopy={(e) => {
          e.clipboardData.setData('application/x-editure-fragment', true);
        }}
        onDrop={createDropListener(editor)}
        autoFocus
      />
    </Slate>
  );
}

export default Editure;
