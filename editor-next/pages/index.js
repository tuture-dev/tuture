import { useDispatch, useSelector } from 'react-redux';
import { Layout, Menu, Icon } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function HomePage() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return <div>Hello World</div>;
}

export default HomePage;
