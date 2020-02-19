import React from 'react';

function StepElement(props) {
  const { attributes, children } = props;

  return <div {...attributes}>{children}</div>;
}

export default StepElement;
