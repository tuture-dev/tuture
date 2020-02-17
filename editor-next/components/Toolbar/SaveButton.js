import React from 'react';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const SaveButton = () => {
  return (
    <Button title="保存">
      <ToolbarIcon icon="icon-save" />
    </Button>
  );
};

export default SaveButton;
