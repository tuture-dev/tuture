/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Node } from 'editure';

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

  return (
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
  );
}

export default ExplainElement;
