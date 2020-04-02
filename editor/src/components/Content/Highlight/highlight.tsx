import React, { useMemo } from 'react';
import { Checkbox, Tooltip } from 'antd';
import { useTable } from 'react-table';
import refractor, { RefractorNode, AST } from 'refractor';

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

const diffCodeCellStyle = (
  isHidden: boolean,
  isCodeAddition: boolean,
  isCodeDeletion: boolean,
) => css`
  white-space: pre;
  padding-right: 32px;
  width: auto;
  display: inline-block;

  opacity: ${isHidden || isCodeDeletion ? 0.3 : 1};
  font-size: 14px;
  font-weight: ${isCodeAddition ? 700 : 'normal'};
`;

const newLineRegex = /\n/g;
function getNewLines(str: string) {
  return str.match(newLineRegex);
}

function getLineNumbers(props: {
  code: string;
  startingLineNumber: number;
  style?: Function | { [attr: string]: any };
}) {
  const { code, startingLineNumber = 0, style = {} } = props;

  return code
    .replace(/\n$/, '')
    .split('\n')
    .map((_, i) => {
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

function getLineChecker(props: {
  lines: string[];
  startingLineNumber?: number;
  style?: Function | { [attr: string]: any };
  lineProps?: LineProps;
}) {
  const { lines, startingLineNumber = 0, style = {}, lineProps = {} } = props;

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

function createLineElement(props: {
  children: RefractorNode[];
  className?: string[];
}): AST.Element {
  const { children, className = [] } = props;
  const properties: AST.Properties = {};
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

function flattenCodeTree(
  tree: RefractorNode[],
  className: string[] = [],
  newTree: RefractorNode[] = [],
) {
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
      const classNames = className.concat(node.properties.className!);
      newTree = newTree.concat(flattenCodeTree(node.children, classNames));
    }
  }
  return newTree;
}

export function wrapLinesInSpan(
  codeTree: RefractorNode[],
  lineProps?: LineProps,
) {
  const tree = flattenCodeTree(codeTree);
  const newTree = [];
  let lastLineBreakIndex = -1;
  let index = 0;

  while (index < tree.length) {
    const node = tree[index] as AST.Element;
    const value = (node.children[0] as AST.Text).value;
    const newLines = getNewLines(value);

    if (newLines) {
      const splitValue = value.split('\n');

      splitValue.forEach((text, i) => {
        const newChild: AST.Text = { type: 'text', value: `${text}\n` };

        if (i === 0) {
          const children = tree.slice(lastLineBreakIndex + 1, index).concat(
            createLineElement({
              children: [newChild],
              className: node.properties.className,
            }),
          );
          newTree.push(createLineElement({ children }));
        } else if (i === splitValue.length - 1) {
          const stringChild = (tree[index + 1] as AST.Element)?.children[0];

          if (stringChild) {
            const lastLineInPreviousSpan: AST.Text = {
              type: 'text',
              value: `${text}`,
            };
            const newElem = createLineElement({
              children: [lastLineInPreviousSpan],
              className: node.properties.className,
            });
            tree.splice(index + 1, 0, newElem);
          } else {
            newTree.push(
              createLineElement({
                children: [newChild],
                className: node.properties.className,
              }),
            );
          }
        } else {
          newTree.push(
            createLineElement({
              children: [newChild],
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
      newTree.push(createLineElement({ children }));
    }
  }

  return newTree;
}

type RendererProps = {
  rows: RefractorNode[];
  stylesheet: { [attr: string]: any };
  useInlineStyles: boolean;
};

function defaultRenderer(props: RendererProps) {
  const { rows, stylesheet, useInlineStyles } = props;

  return rows.map((node, i) =>
    createElement({
      node,
      stylesheet,
      useInlineStyles,
      key: `code-segement${i}`,
    }),
  );
}

export function getCodeTree(code: string, language: string = 'text') {
  const defaultCodeValue: AST.Text[] = [{ type: 'text', value: code }];

  try {
    return language && language !== 'text'
      ? refractor.highlight(code, language)
      : defaultCodeValue;
  } catch (e) {
    return defaultCodeValue;
  }
}

type LineTagPropsFunction = (lineNumber: number) => { [attr: string]: any };

type LineProps = LineTagPropsFunction | { [attr: string]: any };

export interface SyntaxHighlighterProps {
  code: string;
  language?: string;
  style?: any;
  astGenerator?: typeof refractor;
  PreTag?: string;
  customStyle?: any;
  wrapLines: boolean;
  lineProps?: LineProps;
  useInlineStyles?: boolean;
  showLineNumbers?: boolean;
  startingLineNumber?: number;
  lineNumberStyle?: any;
  renderer?: (props: RendererProps) => (string | JSX.Element)[];
  [rest: string]: any;
}

export default function(
  defaultAstGenerator: typeof refractor,
  defaultStyle: any,
) {
  return function SyntaxHighlighter({
    code,
    language,
    style = defaultStyle,
    customStyle = {},
    useInlineStyles = true,
    showLineNumbers = false,
    showLineChecker = false,
    startingLineNumber = 1,
    lineNumberStyle,
    wrapLines,
    lineProps = {},
    renderer = defaultRenderer,
    PreTag = 'pre',
    astGenerator = defaultAstGenerator,
    ...rest
  }: SyntaxHighlighterProps) {
    const lineNumbers = showLineNumbers
      ? getLineNumbers({ code, startingLineNumber, style: lineNumberStyle })
      : [];

    const lineCheckers = showLineChecker
      ? getLineChecker({
          lines: code.replace(/\n$/, '').split('\n'),
          lineProps,
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

    /*
     * some custom renderers rely on individual row elements so we need to turn wrapLines on
     * if renderer is provided and wrapLines is undefined
     */
    wrapLines = renderer && wrapLines === undefined ? true : wrapLines;
    const codeTree = getCodeTree(code, language);
    const tree = wrapLines ? wrapLinesInSpan(codeTree, lineProps) : codeTree;

    const renderCodeRows = renderer({
      rows: tree,
      stylesheet: { ...style, paddingRight: '32px' },
      useInlineStyles,
    });

    const vanillaData = lineNumbers.map((lineNumber, index) => ({
      lineNumber,
      diffCodeRow: renderCodeRows[index],
      lineChecker: lineCheckers[index],
    }));

    const columns = useMemo(
      () => [
        {
          Header: 'diffBlock',
          columns: [
            {
              Header: 'Diff 选中/可见',
              accessor: 'lineChecker',
            },
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

    const data = useMemo(() => vanillaData, [vanillaData]);

    const { getTableProps, getTableBodyProps, rows, prepareRow } = useTable({
      columns,
      data,
    });

    return (
      <div>
        <div
          css={css`
            overflow-x: auto;
            padding-bottom: 16px;
          `}
        >
          // @ts-ignore
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

                const styleMap = [
                  { width: '28px' },
                  lineNumberCellStyle,
                  diffCodeCellStyle(isHidden, isCodeAddition, isCodeDeletion),
                ];

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
                        <td {...cell.getCellProps()} css={styleMap[cellIndex]}>
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
