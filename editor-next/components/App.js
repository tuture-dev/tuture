import { Row, Col } from 'antd';

import Content from './Content';
import StepFileList from './StepFileList';

function App() {
  return (
    <div>
      <Row>
        <Col xs={0} md={0} lg={5}>
          <div className="assistLayout">辅助布局填充</div>
        </Col>
        <Col md={24} lg={19} xl={14}>
          <div className="content">
            <Content />
          </div>
        </Col>
        <Col xs={0} md={0} xl={5}>
          <div className="codeFileList">
            <StepFileList />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default App;
