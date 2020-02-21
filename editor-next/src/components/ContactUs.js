import React from 'react';
/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from './IconFont';
import logo from '../assets/images/logo.svg';

const link = css`
  width: 284px;
  height: 40px;
  line-height: 40px;
  background: rgba(255, 255, 255, 1);
  border-radius: 4px;
  border: 1px solid rgba(232, 232, 232, 1);
  display: flex;
  margin-top: 16px;
`;
const icon = css`
  width: 16px;
  height: 16px;
  margin-left: 16px;
  margin-top: 12px;
`;
const labelText = css`
  margin-left: 8px;
  display: inline-block;
  width: 120px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
`;

const arrow = css`
  width: 10px;
  height: 10px;
  margin-top: 14px;
  margin-left: 80px;
`;
const itemsData = [
  {
    id: '1',
    href: 'https://tuture.co/',
    icon: { logo },
    labelText: '图雀社区主站',
  },
  {
    id: '2',
    href: 'https://github.com/tuture-dev/tuture',
    icon: 'icon-github-fill',
    labelText: '写作工具地址',
  },
  {
    id: '3',
    href: 'https://zhuanlan.zhihu.com/tuture',
    icon: 'icon-zhihu-circle-fill',
    labelText: '知乎专栏',
  },
  {
    id: '4',
    href: 'https://tuture.co/images/social/wechat.png',
    icon: 'icon-wechat',
    labelText: '微信公众号',
  },
  {
    id: '5',
    href: 'https://juejin.im/user/5b33414351882574b9694d28',
    icon: 'icon-juejin',
    labelText: '掘金专栏',
  },
  {
    id: '6',
    href: 'https://www.imooc.com/u/8413857/articles',
    icon: 'icon-mukewang',
    labelText: '慕课手记',
  },
];
const item_f = itemsData[0];
itemsData.shift();
const items = itemsData.map((item) => (
  <a
    key={item.id}
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    css={link}
  >
    <IconFont css={icon} type={item.icon} />
    <span css={labelText}>{item.labelText}</span>
    <IconFont css={arrow} type="icon-arrowright" />
  </a>
));

function ContactUs() {
  return (
    <div
      css={css`
        a:first-of-type {
          margin-top: 0px !important;
        }
      `}
    >
      <a
        key={item_f.id}
        href={item_f.href}
        target="_blank"
        rel="noopener noreferrer"
        css={link}
      >
        <img css={icon} src={logo} alt="tuture" />
        <span css={labelText}>{item_f.labelText}</span>
        <IconFont css={arrow} type="icon-arrowright" />
      </a>
      {items}
    </div>
  );
}

export default ContactUs;
