/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Row, Col, Affix } from 'antd';
import Editure from './Editure';
import PageHeader from './PageHeader';
import StepFileList from './StepFileList';
import PageCatalogue from './PageCatalogue';

const contentStyles = css`
  padding: 48px 60px 64px;

  & .ant-select-selection {
    background: none;
    border: none;
    padding: 2px;
  }

  & .ant-select-selection:active {
    border: none;
    box-shadow: none;
  }

  & .ant-select-selection:focus {
    border: none;
    box-shadow: none;
  }

  & .ant-select-selection-selected-value {
    font-size: 14px;
    font-weight: 400;
  }
`;

function Content() {
  return (
    <Row>
      <Col span={0} lg={5}>
        <Affix target={() => document.getElementById('scroll-container')}>
          <PageCatalogue />
        </Affix>
      </Col>
      <Col span={24} lg={19} xl={14}>
        <div css={contentStyles}>
          <PageHeader />
          <Editure />
        </div>
      </Col>
      <Col span={0} xl={5}>
        <Affix target={() => document.getElementById('scroll-container')}>
          <StepFileList />
        </Affix>
      </Col>
    </Row>
  );
}

export default Content;
