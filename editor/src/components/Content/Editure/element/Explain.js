/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Node } from 'tuture-slate';

import {
  STEP_START,
  STEP_END,
  FILE_START,
  FILE_END,
} from '../../../../utils/constants';

const mapExplainTypeToContent = (explainType) => {
  switch (explainType) {
    case STEP_START: {
      return '撰写此步骤的前置解释';
    }

    case STEP_END: {
      return '撰写此步骤的后置解释';
    }

    case FILE_START: {
      return '撰写如下文件的前置解释';
    }

    case FILE_END: {
      return '撰写如上文件的后置解释';
    }

    default: {
      return '撰写一点解释';
    }
  }
};

const mapExplainTypeToBorder = (explainType) => {
  switch (explainType) {
    case FILE_START: {
      return css`
        border-bottom: none;
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      `;
    }

    case FILE_END: {
      return css`
        border-top: none;
        border-top-right-radius: 0;
        border-top-left-radius: 0;
      `;
    }

    default: {
      return null;
    }
  }
};

const emptyChildrenStyles = (explainType) => css`
  border: 1px solid #ddd;
  border-radius: 2px;
  position: relative;

  ${mapExplainTypeToBorder(explainType)}

  &::before {
    content: '${mapExplainTypeToContent(explainType)}';
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

        ${!explainStr && emptyChildrenStyles(element?.flag)}
      `}
    >
      {children}
    </div>
  );
}

export default ExplainElement;
