import { useState } from 'react';
import { Select } from 'antd';
import { useSlate } from 'slate-react';
import { CODE_BLOCK } from 'editure-constants';
import { updateBlock } from 'editure';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import IconFont from '../../IconFont';

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

const prismLangArr = [
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

const enumPrismLangToLanguage = {};

const bimapPrismLangandLanguage = (prismLangObj, index) => {
  const language = languages[index];

  enumPrismLangToLanguage[language] = prismLangObj.key;
  prismLangObj.value.forEach((prismLang) => {
    enumPrismLangToLanguage[prismLang] = language;
  });
};

prismLangArr.forEach(bimapPrismLangandLanguage);

const { Option } = Select;

function CodeBlockElement(props) {
  const { element, attributes, children } = props;
  const { lang: defaultLang = 'Plain Text' } = element;

  const [lang, setLang] = useState(defaultLang);
  const editor = useSlate();

  function handleChange(value) {
    setLang(value);
    updateBlock(editor, CODE_BLOCK, { lang: value });
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
      </div>
    </div>
  );
}

export default CodeBlockElement;
