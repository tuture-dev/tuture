import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Spin } from 'antd';
import useSWR from 'swr';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import fetcher from '../utils/fetcher';
import {
  NORMAL,
  LOADING,
  LOADING_SUCCESS,
  LOADING_ERROR,
} from '../utils/constants';

import { App } from '../components';

function HomePage() {
  const dispatch = useDispatch();

  const { data, error } = useSWR('/api/getTutorialData', fetcher);
  let loadStatus = NORMAL;

  useEffect(() => {
    if (!data) {
      loadStatus = LOADING;
    } else {
      dispatch.tutorial.setTutorialData(data);
      loadStatus = LOADING_SUCCESS;
    }

    if (error) {
      loadStatus = LOADING_ERROR;
    }
  }, [data]);

  return (
    <div
      css={css`
        width: 100%;
      `}>
      <Spin tip="加载中..." spinning={loadStatus === LOADING}>
        <div
          css={css`
            height: calc(100vh - 64px);
            width: 100%;
          `}>
          <App />
        </div>
      </Spin>
    </div>
  );
}

export default HomePage;
