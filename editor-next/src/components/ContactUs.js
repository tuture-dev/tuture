import React from 'react';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

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
  width: 24px;
  height: 24px;
  margin-left: 16px;
  margin-top: 8px;
`;
const labelText = css`
  margin-left: 8px;
  display: inline-block;
  width: 84px;
  color: black;
`;

const arrow = css`
  width: 10px;
  height: 10px;
  margin-top: 14px;
  margin-left: 125px;
`;
const itemsData = [
  {
    id: '1',
    href: 'https://tuture.co/',
    icon: '/images/contact_us/tuture.png',
    labelText: '图雀社区主站',
  },
  {
    id: '2',
    href: 'https://github.com/tuture-dev/tuture',
    icon: '/images/contact_us/github.png',
    labelText: '写作工具地址',
  },
  {
    id: '3',
    href: 'https://zhuanlan.zhihu.com/tuture',
    icon: '/images/contact_us/zhihu.png',
    labelText: '知乎专栏',
  },
  {
    id: '4',
    href: 'https://tuture.co/images/social/wechat.png',
    icon: '/images/contact_us/we_chat.png',
    labelText: '微信公众号',
  },
  {
    id: '5',
    href: 'https://juejin.im/user/5b33414351882574b9694d28',
    icon: '/images/contact_us/juejin.png',
    labelText: '掘金专栏',
  },
  {
    id: '6',
    href: 'https://www.imooc.com/u/8413857/articles',
    icon: '/images/contact_us/imooc.png',
    labelText: '慕课手记',
  },
];
const items = itemsData.map((item) => (
  <a
    key={item.id}
    href={item.href}
    target="_blank"
    rel="noopener noreferrer"
    css={link}
  >
    <img css={icon} src={item.icon} alt="tuture" />
    <span css={labelText}>{item.labelText}</span>
    <img css={arrow} src="/images/contact_us/arrowright.png" alt="arrow" />
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
      {items}
    </div>
  );
}

export default ContactUs;
