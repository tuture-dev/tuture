import React from 'react';
import { css } from 'emotion';
import * as F from 'editure-constants';

import StepElement from './Step';
import FileElement from './File';
import ExplainElement from './Explain';
import NoteElement from './Note';
import ImageElement from './Image';
import HrElement from './Hr';
import CodeBlockElement from './CodeBlock';
import DiffBlockElement from './DiffBlock';
import ListItemElement from './ListItem';
import { STEP, FILE, EXPLAIN, DIFF_BLOCK } from '../../../utils/constants';

export default (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case F.BLOCK_QUOTE:
      return (
        <blockquote {...attributes}>
          <div>{children}</div>
        </blockquote>
      );
    case F.LIST_ITEM:
      return <ListItemElement {...props} />;
    case F.BULLETED_LIST:
      return (
        <ul
          {...attributes}
          className={css`
            padding-inline-start: 0;
          `}
        >
          {children}
        </ul>
      );
    case F.NUMBERED_LIST:
      return (
        <ol
          {...attributes}
          className={css`
            padding-inline-start: 0;
          `}
        >
          {children}
        </ol>
      );
    case F.H1:
      return <h1 {...attributes}>{children}</h1>;
    case F.H2:
      return <h2 {...attributes}>{children}</h2>;
    case F.H3:
      return <h3 {...attributes}>{children}</h3>;
    case F.H4:
      return <h4 {...attributes}>{children}</h4>;
    case F.CODE_BLOCK:
      return <CodeBlockElement {...props} />;
    case F.CODE_LINE:
      return <pre {...attributes}>{children}</pre>;
    case F.NOTE:
      return <NoteElement {...props} />;
    case F.IMAGE:
      return <ImageElement {...props} />;
    case F.HR:
      return <HrElement {...props} />;
    case STEP:
      return <StepElement {...props} />;
    case FILE:
      return <FileElement {...props} />;
    case EXPLAIN:
      return <ExplainElement {...props} />;
    case DIFF_BLOCK:
      return <DiffBlockElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
