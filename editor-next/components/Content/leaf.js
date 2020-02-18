import React from 'react';
import { useDispatch } from 'react-redux';
import { useSlate } from 'slate-react';
import { css } from 'emotion';
import { Popover, Popconfirm } from 'antd';
import { getLinkData, removeLink } from 'editure';

import IconFont from '../IconFont';

const Link = (props) => {
  const { attributes, children, leaf } = props;
  const editor = useSlate();
  const dispatch = useDispatch();

  const iconStyle = css`
    margin: 0 2px;

    &:hover {
      color: #1db777;
      cursor: pointer;
    }
  `;

  const onClickEdit = () => {
    const { text, url } = getLinkData(editor);
    if (text) dispatch.link.setText(text);
    if (url) dispatch.link.setUrl(url);

    dispatch.link.startEdit();
  };

  const handleDeleteLink = () => {
    removeLink(editor);
  };

  const content = (
    <div>
      <span>
        <a
          {...attributes}
          href={leaf.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={css`
            margin-right: 3px;
          `}
        >
          {leaf.url}
        </a>
      </span>
      <IconFont onClick={onClickEdit} className={iconStyle} type="icon-edit" />
      <Popconfirm title="确认要删除此链接吗？" onConfirm={handleDeleteLink}>
        <IconFont className={iconStyle} type="icon-delete" />
      </Popconfirm>
    </div>
  );

  return (
    <Popover content={content} trigger="click">
      <a {...attributes} href={leaf.url || '#'}>
        {children}
      </a>
    </Popover>
  );
};

export default (props) => {
  const { attributes, leaf } = props;
  let { children } = props;

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikethrough) {
    children = (
      <span style={{ textDecoration: 'line-through' }}>{children}</span>
    );
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.link) {
    children = <Link {...props}>{children}</Link>;
  }

  return (
    <span {...attributes} className={leaf.prismToken ? leaf.className : ''}>
      {children}
    </span>
  );
};
