import React, { useState } from 'react';
import LazyLoad from 'react-lazy-load';
import { ReactHeight } from 'react-height';

function StepTitle(props) {
  const { attributes, children, element } = props;
  const [height, setHeight] = useState(28);

  return (
    <LazyLoad height={height} offsetTop={1000}>
      <ReactHeight onHeightReady={(h) => setHeight(h)}>
        <h2 {...attributes} id={element.id}>
          {children}
        </h2>
      </ReactHeight>
    </LazyLoad>
  );
}

export default StepTitle;
