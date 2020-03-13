import React, { useMemo } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { useDispatch } from 'react-redux';
import { useTable } from 'react-table';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import createElement from './create-element';

const codeDeletionStyle = css`
  background-color: #3e3133;
`;

const codeAdditionStyle = css`
  background-color: rgb(53, 59, 69);
`;

const lineNumberCellStyle = css`
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
`;

const diffCodeCellStyle = (isHidden, isCodeAddition, isCodeDeletion) => css`
  white-space: pre;
  padding-right: 32px;
  width: auto;
  display: inline-block;

  opacity: ${isHidden || isCodeDeletion ? 0.3 : 1};
  font-size: 14px;
  font-weight: ${isCodeAddition ? 700 : 'normal'};
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

function getLineChecker({ lines, startingLineNumber, style, lineProps }) {
  return lines.map((_, i) => {
    const number = i + startingLineNumber;

    const { isHidden = false } =
      (typeof lineProps === 'function' ? lineProps(i) : lineProps) || {};

    return (
      <Tooltip placement="left" title={isHidden ? '显示此行' : '隐藏此行'}>
        <span
          key={`line-${i}`}
          className="react-syntax-highlighter-line-number"
          style={typeof style === 'function' ? style(number) : style}
          css={css`
            display: inline-block;
            height: 22px;
          `}
        >
          <Checkbox
            label={i}
            value={i}
            css={css`
              padding-left: 12px;
            `}
          />
        </span>
      </Tooltip>
    );
  });
}

function LineCheckers({
  codeString,
  checkerStyle = {},
  allLines = [],
  showLines = [],
  commit = '',
  file = '',
  lineProps,
}) {
  const dispatch = useDispatch();

  function onChange(hiddenLines) {
    dispatch.collection.setDiffItemHiddenLines({
      commit,
      file,
      hiddenLines,
    });

    dispatch.collection.saveCollection();
  }

  function getHiddenLines(checkedLines, allLines) {
    const hiddenLines = allLines.filter((line) => !checkedLines.includes(line));

    return hiddenLines;
  }

  return (
    <Checkbox.Group
      onChange={(checkedLines) => {
        const hiddenLines = getHiddenLines(checkedLines, allLines);
        onChange(hiddenLines);
      }}
      value={showLines}
      css={css`
        float: left;
        width: 28px;
        margin: 0.5em 0;
      `}
    >
      {getLineChecker({
        lines: codeString.replace(/\n$/, '').split('\n'),
        style: checkerStyle,
        lineProps,
      })}
    </Checkbox.Group>
  );
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
    useInlineStyles = true,
    showLineNumbers = false,
    showLineChecker = false,
    startingLineNumber = 1,
    lineNumberStyle,
    wrapLines,
    allLines,
    showLines,
    commit,
    file,
    lineProps = {},
    renderer,
    PreTag = 'pre',
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

    const lineCheckers = showLineChecker ? (
      <LineCheckers
        codeString={code}
        checkerStyle={lineNumberStyle}
        allLines={allLines}
        showLines={showLines}
        commit={commit}
        file={file}
        lineProps={lineProps}
      />
    ) : (
      [null]
    );

    const defaultPreStyle = style.hljs ||
      style['pre[class*="language-"]'] || {
        backgroundColor: '#fff',
      };
    const preProps = useInlineStyles
      ? Object.assign({}, rest, {
          style: Object.assign({}, defaultPreStyle, customStyle),
        })
      : Object.assign({}, rest, { className: 'hljs' });

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

    console.log('lineNumbers', lineNumbers, renderCodeRows);
    const vanillaData = lineNumbers.map((lineNumber, index) => ({
      lineNumber,
      diffCodeRow: renderCodeRows[index],
    }));

    const columns = useMemo(
      () => [
        {
          Header: 'diffBlock',
          columns: [
            {
              Header: '行号',
              accessor: 'lineNumber',
            },
            {
              Header: '代码块',
              accessor: 'diffCodeRow',
            },
          ],
        },
      ],
      [],
    );

    const data = useMemo(() => vanillaData, []);

    const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
      columns,
      data,
    });

    return (
      <div>
        {lineCheckers}
        <div
          css={css`
            overflow-x: auto;
            padding-bottom: 16px;
          `}
        >
          <PreTag
            {...preProps}
            {...getTableProps()}
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
            <tbody {...getTableBodyProps()}>
              {rows.map((row, rowIndex) => {
                const {
                  isCodeAddition = false,
                  isCodeDeletion = false,
                  isHidden = false,
                } =
                  (typeof lineProps === 'function'
                    ? lineProps(rowIndex)
                    : lineProps) || {};

                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    css={css`
                      white-space: pre;

                      ${isCodeAddition && codeAdditionStyle}
                      ${isCodeDeletion && codeDeletionStyle}
                    `}
                  >
                    {row.cells.map((cell, cellIndex) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          css={
                            cellIndex === 0
                              ? lineNumberCellStyle
                              : diffCodeCellStyle(
                                  isHidden,
                                  isCodeAddition,
                                  isCodeDeletion,
                                )
                          }
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </PreTag>
        </div>
      </div>
    );
  };
}
