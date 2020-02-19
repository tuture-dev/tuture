import React from 'react';

function StepElement(props) {
  const { attributes, children, element } = props;

  return (
    <div {...attributes}>
      <h2 id={element.commit}>{element.name}</h2>
      {children}
    </div>
  );
}

export default StepElement;
