/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';

import ExplainedItem from './ExplainedItem';
import DiffFile from './DiffFile';

function Step(props) {
  const dispatch = useDispatch();

  const { step } = props;

  return (
    <div
      css={css`
        margin: 40px 0;
      `}>
      <Input
        placeholder="无标题"
        value={step.name}
        onChange={(e) => dispatch.collection.setStepTitle({
          commit: step.commit,
          value: e.target.value,
        })}
        css={css`
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 32px;
          margin-bottom: 16px;
        `}
      />
      <ExplainedItem explain={step?.explain}>
        {step.diff.map((diffFile) => (
          <ExplainedItem explain={diffFile?.explain}>
            <DiffFile diffFile={diffFile} />
          </ExplainedItem>
        ))}
      </ExplainedItem>
    </div>
  );
}

export default Step;
