/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useSelector, useStore, useDispatch } from 'react-redux';
import Highlight, { defaultProps } from 'prism-react-renderer';
import vsDark from 'prism-react-renderer/themes/vsDark';
import { Checkbox } from 'antd';

const diffFileStyle = css`
  color: rgba(0, 0, 0, 0.84);
  display: block;
  /* padding-top: 8px; */
  padding-bottom: 8px;
  background-color: rgb(30, 30, 30);
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

function DiffBlockElement(props) {
  const { attributes, element } = props;
  const { file, commit, hiddenLines = [] } = element;

  const dispatch = useDispatch();
  const store = useStore();
  const diffItem = useSelector(
    store.select.collection.getDiffItemByCommitAndFile({ file, commit }),
  );

  const { codeStr = '', DIFF_ADD = [], DIFF_DEL = [] } = concatCodeStr(
    diffItem,
  );

  const lang = file
    .split('.')
    .pop()
    .toLowerCase();

  function onChange(checkedValues) {
    dispatch.collection.setDiffItemHiddenLines({
      commit,
      file,
      hiddenLines: checkedValues,
    });
  }

  return (
    <div className="diff-file" css={diffFileStyle} {...attributes}>
      <header css={diffFileHeaderStyle}>{file}</header>
      <Highlight
        {...defaultProps}
        code={codeStr}
        language={lang}
        theme={vsDark}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => {
          return (
            <pre className={className} style={style}>
              <Checkbox.Group
                onChange={onChange}
                value={hiddenLines}
                css={css`
                  width: 100%;
                `}
              >
                {tokens.map((line, i) => (
                  <div
                    {...getLineProps({ line, key: i })}
                    css={css`
                      ${DIFF_ADD.includes(i) && codeAdditionStyle}
                      ${DIFF_DEL.includes(i) &&
                        codeDeletionStyle}
                      padding: 0 16px;
                    `}
                  >
                    <Checkbox label={i} value={i} />
                    <span
                      css={css`
                        font-family: dm, Menlo, Monaco, 'Courier New', monospace;
                        font-weight: normal;
                        font-size: 15px;
                        line-height: 23px;
                        letter-spacing: 0px;
                        color: #858585;
                        margin-right: 16px;
                        width: 25px;
                        display: inline-block;
                        text-align: right;
                      `}
                    >
                      {i}
                    </span>
                    {line.map((token, key) => (
                      <span
                        {...getTokenProps({ token, key })}
                        css={css`
                          opacity: ${DIFF_DEL.includes(i) ? 0.3 : 1};
                          font-weight: ${DIFF_ADD.includes(i) ? 700 : 'normal'};
                        `}
                      />
                    ))}
                  </div>
                ))}
              </Checkbox.Group>
            </pre>
          );
        }}
      </Highlight>
      <Global styles={css``} />
    </div>
  );
}

export default DiffBlockElement;
