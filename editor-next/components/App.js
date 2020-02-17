import { Row, Col } from 'antd';

import Content from './Content';
import StepFileList from './StepFileList';

function App() {
  return (
    <div>
      <Row>
        <Col xs={0} md={0} lg={1}>
          <div className="assistLayout" />
        </Col>
        <Col md={24} lg={19} xl={18}>
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
