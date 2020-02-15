/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';

import DiffFile from './DiffFile';
import Editure from './Editure';
import {
  STEP_PRE_EXPLAIN,
  STEP_POST_EXPLAIN,
  DIFF_PRE_EXPLAIN,
  DIFF_POST_EXPLAIN,
} from '../utils/constants';

function Step(props) {
  const dispatch = useDispatch();

  const { step } = props;

  return (
    <div
      css={css`
        margin: 40px 0;
      `}
    >
      <Input
        placeholder="无标题"
        value={step.name}
        onChange={(e) =>
          dispatch.collection.setStepTitle({
            commit: step.commit,
            value: e.target.value,
          })
        }
        css={css`
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 32px;
          margin-bottom: 16px;
        `}
      />

      <div className="commit-pre-explain">
        <Editure
          commit={step.commit}
          type={STEP_PRE_EXPLAIN}
          content={step?.explain?.pre}
        />
      </div>
      {step.diff
        .filter((diffFile) => diffFile.display)
        .map((diffFile) => (
          <div
            key={diffFile.file}
            css={css`
              margin: 20px 0;
            `}
          >
            <div className="diffFile-pre-explain">
              <Editure
                commit={step.commit}
                file={diffFile.file}
                type={DIFF_PRE_EXPLAIN}
                content={diffFile?.explain?.pre}
              />
            </div>
            <DiffFile diffFile={diffFile} commit={step.commit} />
            <div className="diffFile-post-explain">
              <Editure
                commit={step.commit}
                file={diffFile.file}
                type={DIFF_POST_EXPLAIN}
                content={diffFile?.explain?.post}
              />
            </div>
          </div>
        ))}
      <div className="commit-post-explain">
        <Editure
          commit={step.commit}
          type={STEP_POST_EXPLAIN}
          content={step?.explain?.post}
        />
      </div>
    </div>
  );
}

export default Step;
