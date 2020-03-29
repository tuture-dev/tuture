import React, { useState } from 'react';
import { Select } from 'antd';
import { useEditure } from 'editure-react';
import { CODE_BLOCK } from 'editure-constants';
import { useDispatch } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from 'components/IconFont';
import { IS_MAC } from 'utils/getOS';
import { Dispatch } from 'store';

import { ElementProps } from './index';

const languages = [
  'Plain Text',
  'Bash',
  'Basic',
  'C',
  'C++',
  'C#',
  'CSS',
  'Dart',
  'Diff',
  'Django',
  'Dockerfile',
  'Erlang',
  'Git',
  'Go',
  'GraphQL',
  'Groovy',
  'HTML',
  'HTTP',
  'Java',
  'JavaScript',
  'Jinja2',
  'JSON',
  'JSX',
  'Kotlin',
  'Less',
  'Makefile',
  'Markdown',
  'MATLAB',
  'Nginx',
  'Objective-C',
  'Pascal',
  'Perl',
  'PHP',
  'PowerShell',
  'Protobuf',
  'Python',
  'R',
  'Ruby',
  'Rust',
  'Scala',
  'Shell',
  'SQL',
  'PL/SQL',
  'Swift',
  'TSX',
  'TypeScript',
  'VB.net',
  'Velocity',
  'XML',
  'YAML',
  'LaTeX',
  'Tcl',
  'Verilog',
  'Lua',
];

type PrismLangRecord = {
  key: string;
  value: string[];
};

const prismLangArr: PrismLangRecord[] = [
  { key: 'text', value: ['text'] },
  { key: 'bash', value: ['bash', 'shell'] },
  { key: 'basic', value: ['basic'] },
  { key: 'c', value: ['c'] },
  { key: 'cpp', value: ['cpp'] },
  { key: 'csharp', value: ['csharp', 'cs', 'dotnet'] },
  { key: 'css', value: ['css'] },
  { key: 'dart', value: ['dart'] },
  { key: 'diff', value: ['diff'] },
  { key: 'django', value: ['django'] },
  { key: 'dockerfile', value: ['dockerfile', 'docker'] },
  { key: 'erlang', value: ['erlang'] },
  { key: 'git', value: ['git'] },
  { key: 'go', value: ['go'] },
  { key: 'graphql', value: ['graphql'] },
  { key: 'groovy', value: ['groovy'] },
  { key: 'html', value: ['html', 'xml', 'svg', 'markup', 'mathml'] },
  { key: 'http', value: ['http'] },
  { key: 'java', value: ['java'] },
  { key: 'javascript', value: ['javascript', 'js'] },
  { key: 'jinja2', value: ['jinja2'] },
  { key: 'json', value: ['json'] },
  { key: 'jsx', value: ['jsx'] },
  { key: 'kotlin', value: ['kotlin'] },
  { key: 'less', value: ['less'] },
  { key: 'makefile', value: ['makefile'] },
  { key: 'markdown', value: ['markdown', 'md'] },
  { key: 'matlab', value: ['matlab'] },
  { key: 'nginx', value: ['nginx'] },
  { key: 'objectivec', value: ['objectivec'] },
  { key: 'pascal', value: ['pascal', 'objectpascal'] },
  { key: 'perl', value: ['perl'] },
  { key: 'php', value: ['php'] },
  { key: 'powershell', value: ['powershell'] },
  { key: 'protobuf', value: ['protobuf'] },
  { key: 'python', value: ['python', 'py'] },
  { key: 'r', value: ['r'] },
  { key: 'ruby', value: ['ruby', 'rb'] },
  { key: 'rust', value: ['rust'] },
  { key: 'scala', value: ['scala'] },
  { key: 'shell', value: ['shell'] },
  { key: 'sql', value: ['sql'] },
  { key: 'plsql', value: ['plsql'] },
  { key: 'swift', value: ['swift'] },
  { key: 'tsx', value: ['tsx'] },
  { key: 'typescript', value: ['typescript', 'ts'] },
  { key: 'vbnet', value: ['vbnet'] },
  { key: 'velocity', value: ['velocity'] },
  { key: 'xml', value: ['xml'] },
  { key: 'yaml', value: ['yaml', 'yml'] },
  { key: 'latex', value: ['latex', 'tex', 'context'] },
  { key: 'tcl', value: ['tcl'] },
  { key: 'verilog', value: ['verilog'] },
  { key: 'lua', value: ['lua'] },
];

const enumPrismLangToLanguage: Record<string, string> = {};

const bimapPrismLangandLanguage = (
  prismLangObj: PrismLangRecord,
  index: number,
) => {
  const language = languages[index];

  enumPrismLangToLanguage[language] = prismLangObj.key;
  prismLangObj.value.forEach((prismLang) => {
    enumPrismLangToLanguage[prismLang] = language;
  });
};

prismLangArr.forEach(bimapPrismLangandLanguage);

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

  const selectValue =
    enumPrismLangToLanguage[enumPrismLangToLanguage[lang.toLocaleLowerCase()]];

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
          value={selectValue}
          onChange={handleChange}
          placeholder="选择语言"
          suffixIcon={suffixIcon}
          css={css`
            color: white !important;
          `}
        >
          {languages.map((language) => (
            <Option key={language} value={enumPrismLangToLanguage[language]}>
              {language}
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
