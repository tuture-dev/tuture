/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import DiffFile from './DiffFile';
import Editure from './Editure';

function Step() {
  return (
    <div
      css={css`
        border-top: 1px solid red;
        border-bottom: 1px solid blue;
        margin: 40px 0;
      `}>
      <p
        css={css`
          margin-bottom: 40px;
        `}>
        Step
      </p>
      <div className="commit-pre-explain">
        <Editure />
      </div>
      {['diffFile1', 'diffFile2', 'diffFile3'].map((diffFile) => (
        <div
          key={diffFile}
          css={css`
            margin: 20px 0;
            border-top: 1px solid green;
            border-bottom: 1px solid yellow;
          `}>
          <div className="diffFile-pre-explain">
            <Editure />
          </div>
          <DiffFile diffFile={diffFile} />
          <div className="diffFile-post-explain">
            <Editure />
          </div>
        </div>
      ))}
      <div className="commit-post-explain">
        <Editure />
      </div>
    </div>
  );
}

export default Step;
