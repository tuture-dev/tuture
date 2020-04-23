import React from 'react';
import { Button, Icon, notification } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export function openOutdatedNotification(onClick: () => void) {
  const key: string = `open${Date.now()}`;
  const btn = (
    <Button type="primary" size="small" onClick={() => notification.close(key)}>
      去处理
    </Button>
  );
  const description = (
    <div>
      <p>在你的步骤列表里面存在过时的步骤，请及时迁移内容或删除这些步骤</p>
      <p
        css={css`
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-top: 16px;
        `}
      >
        <Icon
          type="question-circle"
          style={{ color: '#096dd9' }}
          css={css`
            &:hover {
              cursor: pointer;
              color: #02b875;
            }
          `}
        />
        <a
          href="https://docs.tuture.co/reference/tuture-yml-spec.html#outdated"
          target="_blank"
          rel="noopener noreferrer"
          css={css`
            margin-left: 4px;
          `}
        >
          什么是过时步骤？
        </a>
      </p>
    </div>
  );
  notification.warning({
    message: '过时步骤提醒',
    description,
    btn,
    key,
    duration: null,
    onClick,
  });
}
