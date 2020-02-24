import { Tooltip } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from '../IconFont';

const ToolbarIcon = ({ isActive, icon, title }) => (
  <Tooltip title={title} placement="bottom">
    <IconFont
      css={css`
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
