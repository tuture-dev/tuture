import { useState } from 'react';
import LazyLoad from 'react-lazy-load';
import { ReactHeight } from 'react-height';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Node } from 'slate';

const emptyChildrenStyles = css`
  border: 1px solid #ddd;
  position: relative;

  &::before {
    content: '写一点解释...';
    position: absolute;
    bottom: 4px;
    color: #bfbfbf;
  }
`;

function ExplainElement(props) {
  const { attributes, children, element } = props;
  const explainStr = Node.string(element);
  const [height, setHeight] = useState(500);

  return (
    <LazyLoad height={height} offsetTop={1000}>
      <ReactHeight onHeightReady={(h) => setHeight(h)}>
        <div
          {...attributes}
          css={css`
            margin: 3px;
            padding: 3px;
            border: 1px solid white;

            &:hover {
              border: 1px solid #ddd;
            }

            ${!explainStr && emptyChildrenStyles}
          `}
        >
          {children}
        </div>
      </ReactHeight>
    </LazyLoad>
  );
}

export default ExplainElement;
