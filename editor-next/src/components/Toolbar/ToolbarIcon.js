import React from 'react';
import { css } from 'emotion';
import { Tooltip } from 'antd';

import IconFont from '../IconFont';

const ToolbarIcon = ({ isActive, icon, title }) => (
  <Tooltip title={title} placement="bottom">
    <IconFont
      className={css`
        padding: 8px;
        color: black;
        margin: 0 1px;
        border-radius: 5px;
        transition: background-color 0.5s;
        background-color: ${isActive ? '#e8e8e8' : 'white'};

        &:hover {
          background-color: #e8e8e8;
        }
      `}
      type={icon}
    />
  </Tooltip>
);

export default ToolbarIcon;
