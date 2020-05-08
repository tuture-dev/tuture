import React, { useState } from 'react';
import { Select } from 'antd';
import { useEditure } from 'editure-react';
import { CODE_BLOCK } from 'editure-constants';
import { useDispatch } from 'react-redux';
import { languages, getValidId } from 'yutang';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from 'components/IconFont';
import { IS_MAC } from 'utils/environment';
import { Dispatch } from 'store';

import { ElementProps } from './index';

const { Option } = Select;

function CodeBlockElement(props: ElementProps) {
  const { element, attributes, children } = props;
  const { lang: defaultLang = 'Plain Text' } = element;
  const dispatch = useDispatch<Dispatch>();

  const [lang, setLang] = useState(defaultLang);
  const editor = useEditure();

  function handleChange(value: string) {
    setLang(value);
    dispatch.slate.setLang(value);

    editor.updateBlock(CODE_BLOCK, { lang: value });
  }

  const suffixIcon = (
    <IconFont type="icon-caret-down" style={{ color: 'white' }} />
  );

  return (
    <div
      {...attributes}
      css={css`
        margin: 1em 0;
        border-radius: 8px;
        background-color: rgb(30, 30, 30);
        position: relative;

        &:hover .shortcut-hint {
          opacity: 1;
        }
      `}
    >
      <div contentEditable={false}>
        <Select
          style={{ width: 120 }}
          value={getValidId(lang)}
          onChange={handleChange}
          placeholder="选择语言"
          suffixIcon={suffixIcon}
          css={css`
            color: white !important;
          `}
        >
          {Object.keys(languages).map((langId) => (
            <Option key={languages[langId].name} value={langId}>
              {languages[langId].name}
            </Option>
          ))}
        </Select>
      </div>
      <div
        css={css`
          padding: 10px 20px;
          overflow-x: auto;
          padding-bottom: 20px;
        `}
      >
        <table
          css={css`
            padding-bottom: 16px;
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;

            & td {
              padding: 0;
              padding-right: 32px;
              border: none;
            }

            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo,
              Courier, monospace;
          `}
        >
          <tbody>{children}</tbody>
        </table>
        <span
          contentEditable={false}
          css={css`
            position: absolute;
            right: 4px;
            bottom: 0px;
            opacity: 0;
            color: rgb(157, 170, 182);
            font-size: 12px;
            font-family: Roboto, sans-serif;
            font-weight: 500;
            line-height: 1.5;
            transition: opacity 0.3s;
          `}
          className="shortcut-hint"
        >
          {IS_MAC ? '按 ⌘+↩ 退出' : '按 ⌃+↩ 退出'}
        </span>
      </div>
    </div>
  );
}

export default CodeBlockElement;
