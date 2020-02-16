import { Spin } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { App } from '../components';

function HomePage() {
  // const dispatch = useDispatch();

  // const { data, error } = useSWR('/api/getCollectionData', fetcher);
  // let loadStatus = NORMAL;

  // useEffect(() => {
  //   if (!data) {
  //     loadStatus = LOADING;
  //   } else {
  //     dispatch.collection.setCollectionData(data);
  //     loadStatus = LOADING_SUCCESS;
  //   }

  //   if (error) {
  //     loadStatus = LOADING_ERROR;
  //   }
  // }, [data]);

  return (
    <div
      css={css`
        width: 100%;
      `}
    >
      <Spin tip="加载中..." spinning={false}>
        <div
          css={css`
            height: calc(100vh - 64px);
            width: 100%;
          `}
        >
          <App />
        </div>
      </Spin>
    </div>
  );
}

export default HomePage;
