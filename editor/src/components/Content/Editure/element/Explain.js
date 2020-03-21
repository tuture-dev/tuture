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
      return '解释一下为什么提交这一步骤代码';
    }

    case STEP_END: {
      return '总结一下为什么要提交这一步骤代码';
    }

    case FILE_START: {
      return '解释一下为什么要编写如下代码';
    }

    case FILE_END: {
      return '总结一下为什么要编写如上代码';
    }

    default: {
      return '撰写一点解释';
    }
  }
};

const emptyChildrenStyles = (explainType) => css`
  border: 1px solid #ddd;
  position: relative;

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
        border: 1px solid white;

        &:hover {
          border: 1px solid #ddd;
        }

        ${!explainStr && emptyChildrenStyles(element?.flag)}
      `}
    >
      {children}
    </div>
  );
}

export default ExplainElement;
