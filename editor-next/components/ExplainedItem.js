/** @jsx jsx */
// import { css, jsx } from '@emotion/core';
// import { useDispatch } from 'react-redux';

import Editure from './Editure';

function ExplainedItem(props) {
  // const dispatch = useDispatch();
  const { children, explain = { pre: '', post: '' } } = props;

  const onChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <div>
        <Editure value={explain.pre} onChange={onChange} />
      </div>
      {children}
      <div>
        <Editure value={explain.post} onChange={onChange} />
      </div>
    </div>
  );
}

export default ExplainedItem;
