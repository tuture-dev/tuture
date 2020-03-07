import { useState } from 'react';
import { Select } from 'antd';
import { useSlate } from 'slate-react';
import { updateBlock } from 'editure';
import { NOTE } from 'editure-constants';

import { levels } from 'utils/note';
import IconFont from 'components/IconFont';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Option } = Select;

function NoteElement(props) {
  const { attributes, children, element } = props;
  const { level: defaultLevel = 'default' } = element;

  const realLevel = Object.keys(levels).includes(defaultLevel)
    ? defaultLevel
    : 'default';

  const [level, setLevel] = useState(realLevel);
  const editor = useSlate();

  function handleChange(value) {
    setLevel(value);
    updateBlock(editor, NOTE, { level: value });
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
        `}
      >
        {children}
      </div>
    </div>
  );
}

export default NoteElement;
