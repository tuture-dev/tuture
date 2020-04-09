import React from 'react';
import { Row, Col } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import ReleasedStepList from './ReleasedStepList';
import ArticleStepList from './ArticleStepList';

function Toc() {
  return (
    <div
      css={css`
        width: 1040px;
        margin: auto;
      `}
    >
      <Row>
        <Col
          span={8}
          css={css`
            box-sizing: border-box;
            padding-left: 12px;
            padding-right: 12px;
          `}
        >
          <ReleasedStepList />
        </Col>
        <Col
          span={16}
          css={css`
            box-sizing: border-box;

            padding-left: 12px;
            padding-right: 12px;
          `}
        >
          <ArticleStepList />
        </Col>
      </Row>
    </div>
  );
}

export default Toc;
