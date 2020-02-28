/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useSelector, useStore, useDispatch } from 'react-redux';
import Highlight, { defaultProps } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import { Checkbox } from 'antd';

const diffFileStyle = css`
  color: rgba(0, 0, 0, 0.84);
  display: block;
  padding-top: 8px;
  background-color: rgb(30, 30, 30);
  border-radius: 8px;
  margin-bottom: 10px;
`;

const diffFileHeaderStyle = css`
  font-family: 'Roboto Mono', Courier, monospace;
  font-size: 14px;
  background-color: rgb(17, 21, 24);
  color: rgba(255, 255, 255, 1);
  border-bottom: 1px solid rgb(17, 21, 24);
  box-shadow: #000000 0 6px 6px -6px;
  text-align: left;
  padding: 8px 0px 8px 16px;
  margin-bottom: 8px;
  border-radius: 8px;
  position: relative;
`;

const codeDeletionStyle = css`
  background-color: #3e3133;
`;

const codeAdditionStyle = css`
  background-color: rgb(53, 59, 69);
`;

function concatCodeStr(diffItem) {
  let codeStr = '';
  const DIFF_ADD = [];
  const DIFF_DEL = [];

  diffItem.chunks.map((chunk, chunkIndex) => {
    chunk.changes.map((change, index) => {
      const { content } = change;

      if (/[+]/.test(content)) {
        DIFF_ADD.push(index);
      } else if (/[-]/.test(content)) {
        DIFF_DEL.push(index);
      }

      // handle render code content
      let code = content;

      if (content !== 'normal' && content.length === 1) {
        code = content.replace(/[+-]/, ' ');
      } else if (content !== 'normal' && content.length > 1) {
        code = content.slice(1);
      }

      if (
        chunkIndex === diffItem.chunks.length - 1 &&
        index === chunk.changes.length - 1
      ) {
        codeStr += code;
      } else {
        codeStr += `${code}\n`;
      }

      return change;
    });

    return chunk;
  });

  return { codeStr, DIFF_ADD, DIFF_DEL };
}

function getHiddenLines(checkedLines, allLines) {
  const hiddenLines = allLines.filter((line) => !checkedLines.includes(line));

  return hiddenLines;
}

function getShowLines(hiddenLines, allLines) {
  const showLines = allLines.filter((line) => !hiddenLines.includes(line));

  return showLines;
}

function DiffBlockElement(props) {
  const { attributes, element } = props;
  const { file, commit, hiddenLines = [] } = element;

  const dispatch = useDispatch();
  const store = useStore();
  const diffItem = useSelector(
    store.select.diff.getDiffItemByCommitAndFile({ file, commit }),
  );

  const { codeStr = '', DIFF_ADD = [], DIFF_DEL = [] } = concatCodeStr(
    diffItem,
  );

  const lang = file
    .split('.')
    .pop()
    .toLowerCase();

  const isHidden = (i) => hiddenLines.includes(i);
  const isCodeAddition = (i) => !diffItem.new && DIFF_ADD.includes(i);
  const isCodeDeletion = (i) => !diffItem.new && DIFF_DEL.includes(i);

  function onChange(hiddenLines) {
    dispatch.collection.setDiffItemHiddenLines({
      commit,
      file,
      hiddenLines,
    });
  }

  return (
    <div {...attributes} className="diff-file" css={diffFileStyle}>
      <header css={diffFileHeaderStyle}>{file}</header>
      <Highlight
        {...defaultProps}
        code={codeStr}
        language={lang}
        theme={vsDark}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          const allLines = tokens.map((_, index) => index);
          const showLines = getShowLines(hiddenLines, allLines);

          return (
            <Checkbox.Group
              onChange={(checkedLines) => {
                const hiddenLines = getHiddenLines(checkedLines, allLines);
                onChange(hiddenLines);
              }}
              value={showLines}
              css={css`
                width: 100%;
              `}
            >
              <div
                css={css`
                  overflow-x: auto;
                  padding-bottom: 16px;
                `}
              >
                <table
                  className={className}
                  style={style}
                  css={css`
                    padding-bottom: 16px;
                    width: 100%;
                    border-spacing: 0;
                    border-collapse: collapse;

                    & td {
                      padding: 0;
                      border: none;
                    }

                    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono',
                      Menlo, Courier, monospace;
                  `}
                >
                  {tokens.map((line, i) => (
                    <tr
                      {...getLineProps({ line, key: i })}
                      css={css`
                        ${isCodeAddition(i) && codeAdditionStyle}
                        ${isCodeDeletion(i) &&
                          codeDeletionStyle}
                  white-space: pre;
                        width: auto;
                      `}
                    >
                      <td style={{ width: '28px' }}>
                        <Checkbox
                          label={i}
                          value={i}
                          css={css`
                            padding-left: 12px;
                          `}
                        />
                      </td>
                      <td style={{ width: '52px' }}>
                        <span
                          css={css`
                            font-family: dm, Menlo, Monaco, 'Courier New',
                              monospace;
                            font-weight: normal;
                            font-size: 12px;
                            line-height: 23px;
                            letter-spacing: 0px;
                            color: #858585;
                            margin-right: 16px;
                            width: 32px;
                            margin-left: 4px;
                            display: inline-block;
                            text-align: right;
                          `}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td
                        css={css`
                          white-space: pre;
                          display: block;
                        `}
                      >
                        <span
                          css={css`
                            width: auto;
                          `}
                        >
                          {line.map((token, key) => (
                            <span
                              {...getTokenProps({ token, key })}
                              css={css`
                                opacity: ${isHidden(i) || isCodeDeletion(i)
                                  ? 0.3
                                  : 1};
                                filter: blur(${isHidden(i) ? '1.5' : '0'}px);
                                font-size: 14px;
                                font-weight: ${isCodeAddition(i)
                                  ? 700
                                  : 'normal'};
                              `}
                            />
                          ))}
                        </span>
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
            </Checkbox.Group>
          );
        }}
      </Highlight>
      <Global styles={css``} />
    </div>
  );
}

export default DiffBlockElement;
