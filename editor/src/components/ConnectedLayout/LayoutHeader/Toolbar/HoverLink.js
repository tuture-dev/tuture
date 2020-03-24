import React, { useState, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ReactDOM from 'react-dom';
import { Icon } from 'antd';
import { useEditure } from 'editure-react';
import { LINK } from 'editure-constants';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const Portal = ({ children }) => ReactDOM.createPortal(children, document.body);

const HoverLink = () => {
  const [urlValue, setUrlValue] = useState('');
  const ref = useRef(null);
  const dispatch = useDispatch();
  const editor = useEditure();

  // eslint-disable-next-line
  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return;
    }

    if (!editor.selection || !editor.isMarkActive(LINK)) {
      el.removeAttribute('style');
      return;
    }

    setUrlValue(editor.getLinkData().url);

    const domSelection = window.getSelection();
    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();

    el.style.opacity = 1;
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`;
    el.style.left = `${rect.left +
      window.pageXOffset -
      el.offsetWidth / 2 +
      rect.width / 2}px`;
  });

  const onClickEdit = (e) => {
    e.preventDefault();

    // Hide this component after clicking Edit.
    const el = ref.current;
    el.removeAttribute('style');

    dispatch({ type: 'link/startEdit' });

    const { text, url } = editor.getLinkData();
    if (text) dispatch({ type: 'link/setText', payload: text });
    if (url) dispatch({ type: 'link/setUrl', payload: url });
  };

  const onDeleteLink = (e) => {
    e.preventDefault();
    editor.removeLink();
  };

  return (
    <Portal>
      <div
        ref={ref}
        css={css`
          padding: 8px 7px 6px;
          position: absolute;
          z-index: 1;
          top: 10000px;
          left: -20000px;
          margin-top: -6px;
          opacity: 0;
          border: 1px solid black;
          background-color: #eee;
          border-radius: 4px;
          transition: opacity 0.75s;
        `}
      >
        <a href={urlValue} target="_blank" rel="noopener noreferrer">
          {urlValue}
        </a>
        <span> </span>
        <Icon type="edit" onMouseDown={onClickEdit} />
        <span> </span>
        <Icon type="delete" onMouseDown={onDeleteLink} />
      </div>
    </Portal>
  );
};

export default HoverLink;
