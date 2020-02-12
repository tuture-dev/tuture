import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor';
import MarkdownItTocDoneRight from 'markdown-it-toc-done-right';
import { Remarkable } from 'remarkable';
import toc from 'markdown-toc';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

// const md = MarkdownIt({
//   html: false,
//   xhtmlOut: true,
//   typographer: true,
// })
//   .use(MarkdownItAnchor, {
//     permalink: true,
//     permalinkBefore: true,
//     permalinkSymbol: '§',
//   })
//   .use(MarkdownItTocDoneRight);

const md = new Remarkable();

const markdownValue = `
# XXXX接口文档_v1.0.0
一些说明

***
# 接口规范
***

## Request Header
请求头域内容
>
#### Host: http://test.example.com/v1
#### Content-Type: application/json
#### Date: UTC时间
#### Authorization: 授权验证
#### Token: 身份验证
#### Cookie: 缓存

## Response Header
响应头域内容
>
#### Set-Cookie: 缓存

## Error message format
错误信息格式
>
code|message
----|---------------
401 |权限不足或授权信息错误
403 |当前身份过期，服务器拒绝请求
404 |访问Url未找到或页面已移除
500 |缺失请求参数或服务器内部错误

***
# 账户
***

## 注册
用户注册
>
#### HttpMethod: POST
#### Url: /account/login
#### Request:
param       |type       |nullable   |description
------------|-----------|-----------|-----------
email       |str        |false      |用户邮箱
name        |str(,20)   |false      |用户名
password    |str(6,16)  |false      |用户的密码
invite_code |int(6)     |true       |邀请码
#### Response:
param|type|description
-|-|-
result|bool|是否成功
desc|str|有用的描述信息
id|int|用户id
token|str|token
一些补充

## 登录
用户登录
>
#### HttpMethod: POST
#### Url: /account/login
#### Request:
param       |type       |nullable   |description
------------|-----------|-----------|-----------
accout      |str        |false      |账户名或登录邮箱
password    |str(6,16)  |false      |用户的密码
#### Response:
param|type|description
-|-|-
result|bool|是否成功
desc|str|有用的描述信息
id|int|用户id
token|str|token
一些补充

## 登出
用户注销

> `;

function render(str, options) {
  return new Remarkable().use(toc.plugin(options)).render(str);
}

function Markdown(props) {
  console.log('str', props.res);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
      `}>
      <div
        css={css`
          width: 400px;
        `}
        dangerouslySetInnerHTML={{ __html: md.render(markdownValue) }}></div>
    </div>
  );
}

Markdown.getInitialProps = async () => {
  const res = render(markdownValue);

  return {
    res,
  };
};

export default Markdown;
