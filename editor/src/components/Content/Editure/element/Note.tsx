import React, { useState } from 'react';
import { Select } from 'antd';
import { useEditure } from 'editure-react';
import { NOTE } from 'editure-constants';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { levels } from 'utils/note';
import IconFont from 'components/IconFont';
import { IS_MAC } from 'utils/environment';

import { ElementProps } from './index';

const { Option } = Select;

function NoteElement(props: ElementProps) {
  const { attributes, children, element } = props;
  const { level: defaultLevel = 'default' } = element;

  const realLevel = Object.keys(levels).includes(defaultLevel)
    ? defaultLevel
    : 'default';

  const [level, setLevel] = useState(realLevel);
  const editor = useEditure();

  function handleChange(value: string) {
    setLevel(value);
    editor.updateBlock(NOTE, { level: value });
  }

  const baseStyle = css`
    margin: 1em 0;
    padding: 15px;
    padding-top: 5px;
    position: relative;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 0px;
    transition: background-color 1s;
  `;

  const noteStyle = css`
    border-left-color: ${levels[level].border};
    background-color: ${levels[level].background};
  `;

  const suffixIcon = <IconFont type="icon-caret-down" />;

  return (
    <div
      {...attributes}
      css={css`
        ${baseStyle};
        ${noteStyle};
        position: relative;

        &:hover .shortcut-hint {
          opacity: 1;
        }
      `}
    >
      <div contentEditable={false}>
        <Select
          defaultValue={level}
          suffixIcon={suffixIcon}
          onChange={handleChange}
          css={css`
            padding: 2px 0;
            margin: 0.5rem 0;
            width: 100px;
          `}
        >
          {Object.keys(levels).map((levelKey) => {
            const { name } = levels[levelKey];
            const icon = `icon-note-${levelKey}`;
            return (
              <Option key={levelKey} value={levelKey}>
                <IconFont type={icon} />
                <span
                  css={css`
                    font-size: 16px;
                    font-weight: 500;
                    margin-left: 8px;
                  `}
                >
                  {name}
                </span>
              </Option>
            );
          })}
        </Select>
      </div>
      <div
        css={css`
          padding-left: 36px;
          padding-bottom: 0px;
        `}
      >
        {children}
      </div>
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
  );
}

export default NoteElement;
