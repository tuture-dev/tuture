import React from 'react';
import { Checkbox, Tooltip } from 'antd';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import createElement from './create-element';

const codeDeletionStyle = css`
  background-color: #3e3133;
`;

const codeAdditionStyle = css`
  background-color: rgb(53, 59, 69);
`;

const newLineRegex = /\n/g;
function getNewLines(str) {
  return str.match(newLineRegex);
}

function getLineNumbers({ lines, startingLineNumber, style }) {
  return lines.map((_, i) => {
    const number = i + startingLineNumber;
    return (
      <span
        key={`line-${i}`}
        className="react-syntax-highlighter-line-number"
        style={typeof style === 'function' ? style(number) : style}
      >
        {`${number}\n`}
      </span>
    );
  });
}

function getLineChecker({ lines, startingLineNumber, style }) {
  return lines.map((_, i) => {
    const number = i + startingLineNumber;
    return (
      <span
        key={`line-${i}`}
        className="react-syntax-highlighter-line-number"
        style={typeof style === 'function' ? style(number) : style}
      >
        <Checkbox
          label={i}
          value={i}
          css={css`
            padding-left: 12px;
          `}
        />
      </span>
    );
  });
}

function createLineElement({ children, className = [] }) {
  const properties = {};
  properties.className = properties.className
    ? className.concat(properties.className)
    : className;
  return {
    type: 'element',
    tagName: 'span',
    properties,
    children,
  };
}

function flattenCodeTree(tree, className = [], newTree = []) {
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.type === 'text') {
      newTree.push(
        createLineElement({
          children: [node],
          className,
        }),
      );
    } else if (node.children) {
      const classNames = className.concat(node.properties.className);
      newTree = newTree.concat(flattenCodeTree(node.children, classNames));
    }
  }
  return newTree;
}

export function wrapLinesInSpan(codeTree, lineProps) {
  const tree = flattenCodeTree(codeTree.value);
  const newTree = [];
  let lastLineBreakIndex = -1;
  let index = 0;
  while (index < tree.length) {
    const node = tree[index];
    const value = node.children[0].value;
    const newLines = getNewLines(value);
    if (newLines) {
      const splitValue = value.split('\n');
      splitValue.forEach((text, i) => {
        const lineNumber = newTree.length + 1;
        const newChild = { type: 'text', value: `${text}\n` };
        if (i === 0) {
          const children = tree.slice(lastLineBreakIndex + 1, index).concat(
            createLineElement({
              children: [newChild],
              className: node.properties.className,
            }),
          );
          newTree.push(createLineElement({ children, lineNumber, lineProps }));
        } else if (i === splitValue.length - 1) {
          const stringChild =
            tree[index + 1] &&
            tree[index + 1].children &&
            tree[index + 1].children[0];
          if (stringChild) {
            const lastLineInPreviousSpan = { type: 'text', value: `${text}` };
            const newElem = createLineElement({
              children: [lastLineInPreviousSpan],
              className: node.properties.className,
            });
            tree.splice(index + 1, 0, newElem);
          } else {
            newTree.push(
              createLineElement({
                children: [newChild],
                lineNumber,
                lineProps,
                className: node.properties.className,
              }),
            );
          }
        } else {
          newTree.push(
            createLineElement({
              children: [newChild],
              lineNumber,
              lineProps,
              className: node.properties.className,
            }),
          );
        }
      });
      lastLineBreakIndex = index;
    }
    index++;
  }
  if (lastLineBreakIndex !== tree.length - 1) {
    const children = tree.slice(lastLineBreakIndex + 1, tree.length);
    if (children && children.length) {
      newTree.push(
        createLineElement({
          children,
          lineNumber: newTree.length + 1,
          lineProps,
        }),
      );
    }
  }
  return newTree;
}

function defaultRenderer({ rows, stylesheet, useInlineStyles }) {
  return rows.map((node, i) =>
    createElement({
      node,
      stylesheet,
      useInlineStyles,
      key: `code-segement${i}`,
    }),
  );
}

export function getCodeTree({
  astGenerator,
  language,
  code,
  defaultCodeValue,
}) {
  if (astGenerator.getLanguage) {
    const hasLanguage = language && astGenerator.getLanguage(language);
    if (language === 'text') {
      return { value: defaultCodeValue, language: 'text' };
    } else if (hasLanguage) {
      return astGenerator.highlight(language, code);
    } else {
      return astGenerator.highlightAuto(code);
    }
  }
  try {
    return language && language !== 'text'
      ? { value: astGenerator.highlight(code, language) }
      : { value: defaultCodeValue };
  } catch (e) {
    return { value: defaultCodeValue };
  }
}

export default function(defaultAstGenerator, defaultStyle) {
  return function SyntaxHighlighter({
    language,
    children,
    style = defaultStyle,
    customStyle = {},
    codeTagProps = { style: style['code[class*="language-"]'] },
    useInlineStyles = true,
    showLineNumbers = false,
    showLineChecker = false,
    startingLineNumber = 1,
    lineNumberStyle,
    wrapLines,
    lineProps = {},
    renderer,
    PreTag = 'pre',
    CodeTag = 'code',
    code = Array.isArray(children) ? children[0] : children,
    astGenerator,
    ...rest
  }) {
    astGenerator = astGenerator || defaultAstGenerator;

    const lineNumbers = showLineNumbers
      ? getLineNumbers({
          lines: code.replace(/\n$/, '').split('\n'),
          style: lineNumberStyle,
          startingLineNumber,
        })
      : [];

    const lineCheckers = showLineChecker
      ? getLineChecker({
          lines: code.replace(/\n$/, '').split('\n'),
          style: lineNumberStyle,
        })
      : [null];

    const defaultPreStyle = style.hljs ||
      style['pre[class*="language-"]'] || {
        backgroundColor: '#fff',
      };
    const preProps = useInlineStyles
      ? Object.assign({}, rest, {
          style: Object.assign({}, defaultPreStyle, customStyle),
        })
      : Object.assign({}, rest, { className: 'hljs' });

    if (!astGenerator) {
      return (
        <PreTag {...preProps}>
          {lineCheckers}
          {lineNumbers}
          <CodeTag {...codeTagProps}>{code}</CodeTag>
        </PreTag>
      );
    }

    /*
     * some custom renderers rely on individual row elements so we need to turn wrapLines on
     * if renderer is provided and wrapLines is undefined
     */
    wrapLines = renderer && wrapLines === undefined ? true : wrapLines;
    renderer = renderer || defaultRenderer;
    const defaultCodeValue = [{ type: 'text', value: code }];
    const codeTree = getCodeTree({
      astGenerator,
      language,
      code,
      defaultCodeValue,
    });
    if (codeTree.language === null) {
      codeTree.value = defaultCodeValue;
    }

    const tree = wrapLines
      ? wrapLinesInSpan(codeTree, lineProps)
      : codeTree.value;

    const renderCodeRows = renderer({
      rows: tree,
      stylesheet: { ...style, paddingRight: '32px' },
      useInlineStyles,
    });

    return (
      <div
        css={css`
          overflow-x: auto;
          padding-bottom: 16px;
        `}
      >
        <PreTag
          {...preProps}
          css={css`
            width: 100%;
            border-spacing: 0;
            border-collapse: collapse;

            & td {
              padding: 0;
              border: none;
            }

            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo,
              Courier, monospace;
          `}
        >
          <tbody>
            {renderCodeRows.map((renderCodeRow, index) => {
              const {
                isCodeAddition = false,
                isCodeDeletion = false,
                isHidden = false,
              } =
                (typeof lineProps === 'function'
                  ? lineProps(index)
                  : lineProps) || {};

              return (
                <tr
                  css={css`
                    white-space: pre;

                    ${isCodeAddition && codeAdditionStyle}
                    ${isCodeDeletion && codeDeletionStyle}
                  `}
                >
                  <Tooltip
                    placement="left"
                    title={isHidden ? '显示此行' : '隐藏此行'}
                  >
                    <td
                      css={css`
                        width: 28px;

                        &:hover {
                          cursor: pointer;
                        }
                      `}
                    >
                      {lineCheckers[index]}
                    </td>
                  </Tooltip>

                  <td
                    css={css`
                      width: 52px;
                      font-family: dm, Menlo, Monaco, 'Courier New', monospace;
                      font-weight: normal;
                      font-size: 12px;
                      letter-spacing: 0px;
                      color: #858585;
                      margin-right: 16px;
                      width: 32px;
                      margin-left: 4px;
                      display: inline-block;
                      text-align: right;
                    `}
                  >
                    {lineNumbers[index]}
                  </td>
                  <td
                    css={css`
                      white-space: pre;
                      padding-right: 32px;
                      width: auto;
                      display: inline-block;

                      opacity: ${isHidden || isCodeDeletion ? 0.3 : 1};
                      filter: blur(${isHidden ? '1.5' : '0'}px);
                      font-size: 14px;
                      font-weight: ${isCodeAddition ? 700 : 'normal'};
                    `}
                  >
                    {renderCodeRow}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </PreTag>
      </div>
    );
  };
}
