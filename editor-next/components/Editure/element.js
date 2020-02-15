import React, { useState } from 'react';
import { css, cx } from 'emotion';
import { updateBlock } from 'editure';
import * as F from 'editure-constants';
import { useSlate, useSelected, useFocused } from 'slate-react';

import { languages, enumPrismLangToLanguage } from '../../utils/code';
import { palette, icons, levels } from '../../utils/note';

const bulletedListStyleType = ['disc', 'circle', 'square'];

const ListItemElement = (props) => {
  const { attributes, children, element } = props;
  const { parent, level, number } = element;

  const bulletedStyle = css`
    margin-left: ${(level || 0) * 2 + 2}em;
    list-style-type: ${bulletedListStyleType[element.level % 3]};
  `;

  const numberedStyle = css`
    ::before {
      content: "${number || 1}.  ";
    }
    margin-left: ${(level || 0) * 2 + 1}em;
    list-style-type: none;
  `;

  return (
    <li
      {...attributes}
      className={parent === F.BULLETED_LIST ? bulletedStyle : numberedStyle}>
      {children}
    </li>
  );
};

const CodeBlockElement = (props) => {
  const { element, attributes, children } = props;
  const { lang: defaultLang = 'Plain Text' } = element;

  const [lang, setLang] = useState(defaultLang);
  const editor = useSlate();

  function handleChange(event) {
    const newLang = event.target.value;
    setLang(newLang);
    updateBlock(editor, F.CODE_BLOCK, { lang: newLang });
  }

  const selectValue = enumPrismLangToLanguage[enumPrismLangToLanguage[lang.toLocaleLowerCase()]];

  return (
    <div
      className={css`
        margin-bottom: 1em;
      `}
      {...attributes}>
      <select
        contentEditable={false}
        value={selectValue}
        onChange={handleChange}>
        {languages.map((language) => (
          <option key={language} value={enumPrismLangToLanguage[language]}>
            {language}
          </option>
        ))}
      </select>
      <div
        className={css`
          margin-top: 5px;
          padding: 10px 20px;
          background-color: #eee;
        `}>
        {children}
      </div>
    </div>
  );
};

const HrElement = ({ attributes, children }) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div
      {...attributes}
      className={css`
        border-bottom: 2px solid #ddd;
        box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
      `}>
      {children}
    </div>
  );
};

const ImageElement = (props) => {
  const { attributes, children, element } = props;
  const selected = useSelected();
  const focused = useFocused();

  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          alt={element.url}
          className={css`
            display: block;
            margin-left: auto;
            margin-right: auto;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  );
};

const NoteElement = (props) => {
  const { attributes, children, element } = props;
  const { level: defaultLevel = 'default' } = element;

  const realLevel = levels.includes(defaultLevel) ? defaultLevel : 'default';

  const [level, setLevel] = useState(realLevel);
  const editor = useSlate();

  function handleChange(event) {
    const newLevel = event.target.value;
    setLevel(newLevel);
    updateBlock(editor, F.NOTE, { level: newLevel });
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
  const iconStyle = level === 'default'
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
};

export default (props) => {
  const { attributes, children, element } = props;

  switch (element.type) {
    case F.BLOCK_QUOTE:
      return (
        <blockquote {...attributes}>
          <div>{children}</div>
        </blockquote>
      );
    case F.LIST_ITEM:
      return <ListItemElement {...props} />;
    case F.BULLETED_LIST:
      return (
        <ul
          {...attributes}
          className={css`
            padding-inline-start: 0;
          `}>
          {children}
        </ul>
      );
    case F.NUMBERED_LIST:
      return (
        <ol
          {...attributes}
          className={css`
            padding-inline-start: 0;
          `}>
          {children}
        </ol>
      );
    case F.H1:
      return <h1 {...attributes}>{children}</h1>;
    case F.H2:
      return <h2 {...attributes}>{children}</h2>;
    case F.H3:
      return <h3 {...attributes}>{children}</h3>;
    case F.H4:
      return <h4 {...attributes}>{children}</h4>;
    case F.CODE_BLOCK:
      return <CodeBlockElement {...props} />;
    case F.CODE_LINE:
      return <pre {...attributes}>{children}</pre>;
    case F.NOTE:
      return <NoteElement {...props} />;
    case F.IMAGE:
      return <ImageElement {...props} />;
    case F.HR:
      return <HrElement {...props} />;
    default:
      return <p {...attributes}>{children}</p>;
  }
};
