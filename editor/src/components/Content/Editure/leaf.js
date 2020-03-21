import { useDispatch } from 'react-redux';
import { selectLastPoint } from 'editure';
import { useEditure } from 'editure-react';
import { Popover, Popconfirm, Tooltip } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from 'components/IconFont';
import styles from '../Highlight/styles/atom-dark';

function getStyleFromClassNameArr(classNameArr) {
  let style = {};

  classNameArr.forEach((className) => {
    style = { ...style, ...styles[className] };
  });

  return style;
}

const Link = (props) => {
  const { attributes, children, leaf } = props;
  const editor = useEditure();
  const dispatch = useDispatch();

  const iconStyle = css`
    margin: 0 2px;

    &:hover {
      color: #1db777;
      cursor: pointer;
    }
  `;

  const onClickEdit = () => {
    const { text, url } = editor.getLinkData();
    if (text) dispatch({ type: 'link/setText', payload: text });
    if (url) dispatch({ type: 'link/setUrl', payload: url });

    dispatch({ type: 'link/startEdit' });
  };

  const handleDeleteLink = () => {
    selectLastPoint(editor);
    editor.removeLink();
  };

  const content = (
    <div>
      <span>
        <a
          {...attributes}
          href={leaf.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          css={css`
            margin-right: 3px;
          `}
        >
          {leaf.url}
        </a>
      </span>
      <Tooltip title="编辑">
        <IconFont onClick={onClickEdit} css={iconStyle} type="icon-edit" />
      </Tooltip>
      <Tooltip title="删除">
        <Popconfirm title="确认要删除此链接吗？" onConfirm={handleDeleteLink}>
          <IconFont css={iconStyle} type="icon-delete" />
        </Popconfirm>
      </Tooltip>
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

  let highlightProperty = {};

  if (leaf.codeHighlight) {
    highlightProperty.style = getStyleFromClassNameArr(leaf.className);
  }

  return (
    <span {...attributes} {...highlightProperty}>
      {children}
    </span>
  );
};
