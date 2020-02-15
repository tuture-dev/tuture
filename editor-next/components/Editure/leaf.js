import React from 'react';

export default ({ attributes, children, leaf }) => {
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
    children = (
      <a {...attributes} href={leaf.url || '#'}>
        {children}
      </a>
    );
  }

  return (
    <span {...attributes} className={leaf.prismToken ? leaf.className : ''}>
      {children}
    </span>
  );
};
