import React, { useRef } from 'react';
import Modal from 'react-modal';
import { useSlate } from 'slate-react';
import { css } from 'emotion';
import { isMarkActive, insertLink, updateLink, selectLastPoint } from 'editure';
import { LINK } from 'editure-constants';

import {
  updateLinkText,
  updateLinkUrl,
  finishEditLink,
  cancelEditLink,
} from '../../utils/link';

const customStyles = {
  content: {
    width: '400px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const EditLink = ({ link, dispatch }) => {
  const editor = useSlate();
  const ref = useRef(null);
  const { isEditing, text, url } = link;

  const onSubmit = (e) => {
    e.preventDefault();

    // 回到上次编辑的光标位置
    selectLastPoint(editor);

    if (text) {
      if (!isMarkActive(editor, LINK)) {
        insertLink(editor, text, url);
      } else {
        updateLink(editor, text, url);
      }
    }

    dispatch(finishEditLink());
  };

  const onCancel = (e) => {
    e.preventDefault();

    selectLastPoint(editor);
    dispatch(cancelEditLink());
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onSubmit(e);
    }
  };

  return (
    <Modal
      isOpen={isEditing}
      style={customStyles}
      ariaHideApp={false}
      shouldCloseOnEsc
    >
      <p
        className={css`
          margin-top: 8px;
          margin-bottom: 8px;
        `}
      >
        文本
      </p>
      <input
        type="text"
        value={text}
        placeholder="添加描述"
        onKeyDown={onKeyDown}
        onChange={(e) => dispatch(updateLinkText(e.target.value))}
      />
      <p
        className={css`
          margin-top: 8px;
          margin-bottom: 8px;
        `}
      >
        链接
      </p>
      <input
        ref={ref}
        type="text"
        value={url}
        placeholder="链接地址"
        onKeyDown={onKeyDown}
        onChange={(e) => dispatch(updateLinkUrl(e.target.value))}
      />
      <div
        className={css`
          margin-top: 16px;
        `}
      >
        <button
          type="button"
          className={css`
            width: 60px;
          `}
          onClick={onSubmit}
        >
          确定
        </button>
        <span
          className={css`
            display: inline-block;
            width: 32px;
          `}
        >
          {' '}
        </span>
        <button
          type="button"
          className={css`
            width: 60px;
          `}
          onClick={onCancel}
        >
          取消
        </button>
      </div>
    </Modal>
  );
};

export default EditLink;
