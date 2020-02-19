import React from 'react';
import { css } from 'emotion';
import { useSelected, useFocused } from 'slate-react';

function HrElement({ attributes, children }) {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      {...attributes}
      className={css`
        border-bottom: 2px solid #ddd;
        box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
      `}
    >
      {children}
    </div>
  );
}

export default HrElement;
