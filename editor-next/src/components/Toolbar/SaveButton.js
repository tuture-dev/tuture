import React from 'react';

import Button from './Button';
import ToolbarIcon from './ToolbarIcon';

const SaveButton = () => {
  return (
    <Button>
      <ToolbarIcon icon="icon-save" title="保存" />
    </Button>
  );
};

export default SaveButton;
