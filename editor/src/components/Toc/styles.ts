/** @jsx jsx */
import { css, jsx } from '@emotion/core';

export const headerStyle = css`
  border-bottom: 1px solid #eeeeee;
  padding-bottom: 16px;
`;

export const assistInfoStyle = css`
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 20px;
  margin-top: 8px;
`;

export const containerStyle = css`
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(232, 232, 232, 1);
  padding-top: 32px;
  padding-bottom: 32px;
`;

export const listItemActionStyle = css`
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(140, 140, 140, 1);
  line-height: 22px;
`;

export const listItemStyle = css`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  background: rgba(247, 247, 250, 1);
  border-radius: 2px;
  border: 1px solid rgba(232, 232, 232, 1);
  padding-left: 16px;
  padding-right: 24px;
  margin-bottom: 16px;

  &:hover {
    cursor: pointer;
  }

  &:hover .list-item-action {
    visibility: visible;
  }
`;

export const activeListItemStyle = css`
  border: 1px solid #999999;
`;
