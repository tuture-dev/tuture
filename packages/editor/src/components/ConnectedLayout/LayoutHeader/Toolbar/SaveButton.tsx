import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';

import { ButtonRefsContext } from 'utils/hotkeys';
import { Dispatch } from 'store';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const SaveButton = () => {
  const dispatch = useDispatch<Dispatch>();
  const { saveBtnRef: ref } = useContext(ButtonRefsContext);

  const onClick = () => {
    dispatch.collection.save({ showMessage: true });
  };

  return (
    <Button handleClick={onClick} ref={ref}>
      <ToolbarIcon icon="icon-save" title="保存" />
    </Button>
  );
};

export default SaveButton;
