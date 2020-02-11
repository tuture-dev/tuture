import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const color = 'white';

function HomePage() {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <div>
      <div
        css={css`
          padding: 32px;
          background-color: #02bc87;
          font-size: 24px;
          margin-bottom: 20px;
          border-radius: 4px;
          &:hover {
            color: ${color};
          }
        `}>
        The count is {count}
      </div>
      <Button
        type="primary"
        css={css`
          margin-right: 20px;
        `}
        onClick={() => dispatch({ type: 'count/increment', payload: 1 })}>
        increment
      </Button>
      <Button
        onClick={() => dispatch({ type: 'count/incrementAsync', payload: 1 })}>
        incrementAsync
      </Button>
    </div>
  );
}

export default HomePage;
