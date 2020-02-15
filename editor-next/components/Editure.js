/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Input } from 'antd';
import { useDispatch } from 'react-redux';

import {
  STEP_PRE_EXPLAIN,
  STEP_POST_EXPLAIN,
  DIFF_PRE_EXPLAIN,
  DIFF_POST_EXPLAIN,
} from '../utils/constants';

const { TextArea } = Input;

function Editure(props) {
  const dispatch = useDispatch();

  const { commit, type, content = '', file = '' } = props;

  function onChange(e) {
    if ([STEP_PRE_EXPLAIN, STEP_POST_EXPLAIN].includes(type)) {
      dispatch.collection.setStepExplain({
        commit,
        content: e.target.value,
        type,
      });
    } else if ([DIFF_PRE_EXPLAIN, DIFF_POST_EXPLAIN].includes(type)) {
      dispatch.collection.setDiffFileExplain({
        commit,
        content: e.target.value,
        type,
        file,
      });
    }
  }

  return (
    <TextArea
      placeholder="无描述"
      value={content}
      autoSize
      onChange={onChange}
      css={css`
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        margin-bottom: 16px;
        resize: none;
      `}
    />
  );
}

export default Editure;
