import React, { useState } from 'react';
import { useSlate } from 'slate-react';
import { css, cx } from 'emotion';
import { updateBlock } from 'editure';
import { NOTE } from 'editure-constants';

const levels = ['default', 'primary', 'success', 'info', 'warning', 'danger'];

const palette = {
  default: { border: '#777', background: '#f7f7f7' },
  primary: { border: '#6f42c1', background: '#f5f0fa' },
  success: { border: '#5cb85c', background: '#eff8f0' },
  info: { border: '#428bca', background: '#eef7fa' },
  warning: { border: '#f0ad4e', background: '#fdf8ea' },
  danger: { border: '#d9534f', background: '#fcf1f2' },
};

const icons = {
  primary: { content: '\f055', color: '#6f42c1' },
  success: { content: '\f058', color: '#5cb85c' },
  info: { content: '\f05a', color: '#428bca' },
  warning: { content: '\f056', color: '#f0ad4e' },
  danger: { content: '\f056', color: '#d9534f' },
};

function NoteElement(props) {
  const { attributes, children, element } = props;
  const { level: defaultLevel = 'default' } = element;

  const realLevel = levels.includes(defaultLevel) ? defaultLevel : 'default';

  const [level, setLevel] = useState(realLevel);
  const editor = useSlate();

  function handleChange(event) {
    const newLevel = event.target.value;
    setLevel(newLevel);
    updateBlock(editor, NOTE, { level: newLevel });
  }

  const baseStyle = css`
    margin: 1em 0;
    padding: 15px;
    padding-top: 5px;
    padding-left: 45px;
    position: relative;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 0px;
    &::before {
      font-family: 'FontAwesome';
      font-size: larger;
      left: 15px;
      position: absolute;
      top: 13px;
    }
  `;
  const noteStyle = css`
    border-left-color: ${palette[level].border};
    background-color: ${palette[level].background};
  `;
  const iconStyle =
    level === 'default'
      ? ''
      : css`
    &::before {
      content: "${icons[level].content}";
      color: ${icons[level].color};
    }
  `;

  return (
    <div {...attributes} className={cx(baseStyle, noteStyle, iconStyle)}>
      <select contentEditable={false} value={level} onChange={handleChange}>
        {levels.map((elem) => (
          <option key={elem} value={elem}>
            {elem}
          </option>
        ))}
      </select>
      <div>{children}</div>
    </div>
  );
}

export default NoteElement;
