/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import classnames from 'classnames';
import { useSelector, useStore } from 'react-redux';

let nowLineNumber = 0;
let nextAddCount = 0;

const diffFileStyle = css`
  color: rgba(0, 0, 0, 0.84);
  display: block;
  /* padding-top: 8px; */
  padding-bottom: 10px;
  background-color: rgba(0, 0, 0, 0.05);
  margin: 32px 0;
`;

const diffFileHeaderStyle = css`
  font-family: 'Roboto Mono', Courier, monospace;
  font-size: 14px;
  background-color: #00bc87;
  color: rgba(255, 255, 255, 1);
  text-align: left;
  padding: 8px 0px 8px 20px;
  margin-bottom: 16px;
  position: relative;
`;

const diffStyle = css`
  table-layout: fixed;
  border-collapse: collapse;
  overflow: auto;
  width: 100%;

  td {
    vertical-align: top;
  }
`;

function DiffFile(props) {
  const { diffFile, commit } = props;
  const { file } = diffFile;

  const store = useStore();
  const diffItem = useSelector(
    store.select.collection.getDiffItemByCommitAndFile({ file, commit }),
  );

  // function renderLineNumber(lineNumber) {
  //   return (
  //     <td
  //       css={css`
  //         width: 8px;
  //         padding: 0 16px;
  //         color: rgba(0, 0, 0, 0.24);
  //         &:empty:before {
  //           content: ${lineNumber};
  //         }
  //       `}
  //     />
  //   );
  // }

  function renderRow(change, isAllInsert, i) {
    const { type, content } = change;
    const lang = diffFile.file
      .split('.')
      .pop()
      .toLowerCase();

    // const lineNumberClassName = classnames('diff-gutter', {
    //   [`diff-gutter-${type}`]: !isAllInsert,
    // });
    const codeClassName = classnames('diff-code', {
      [`diff-code-${type}`]: !isAllInsert,
    });

    // {this.renderLineNumber(lineNumberClassName, i + 1)}

    // handle render code content
    let code = content;

    if (content !== 'normal' && content.length === 1) {
      code = content.replace(/[+-]/, ' ');
    } else if (content !== 'normal' && content.length > 1) {
      code = content.slice(1);
    }

    return (
      <tr
        className="diff-line"
        key={`change${i}`}
        css={css`
          line-height: 31px;
          font-family: 'Roboto Mono', Courier, monospace;
        `}
      >
        <td
          className={classnames('diff-code', { [codeClassName]: true })}
          css={css`
            padding: 0 20px;
            overflow: auto;
          `}
        >
          <pre>
            <code className={lang}>{code}</code>
          </pre>
        </td>
      </tr>
    );
  }

  function judgeAllRowInsertState(changes = [], key) {
    // these lines of code are for display correct line number
    if (key === 0) {
      nowLineNumber = 0;
    } else {
      nowLineNumber += nextAddCount;
    }
    nextAddCount = changes.length;

    let isAllInsert = true;
    changes.map((change) => {
      const { type } = change;
      if (type !== 'add') {
        isAllInsert = false;
      }

      return change;
    });
    return changes.map((change, i) => {
      return renderRow(change, isAllInsert, nowLineNumber + i);
    });
  }

  return (
    <div className="diff-file" css={diffFileStyle}>
      <header css={diffFileHeaderStyle}>{file}</header>
      <table css={diffStyle}>
        <tbody>
          {diffItem.chunks.map((chunk, index) => {
            if (index !== diffItem.chunks.length - 1) {
              return (
                <>
                  {judgeAllRowInsertState(chunk.changes, index)}
                  {judgeAllRowInsertState(
                    [
                      {
                        type: 'normal',
                        content: ' ...',
                        normal: true,
                      },
                    ],
                    index,
                  )}
                </>
              );
            }

            return judgeAllRowInsertState(chunk.changes, index);
          })}
        </tbody>
      </table>
      <Global
        styles={css`
          .diff-gutter-add {
            background-color: rgba(0, 0, 0, 0.07);
          }

          .diff-gutter-del {
            background-color: rgba(0, 0, 0, 0.021);
          }

          .diff-code-add {
            font-weight: 700;
            background-color: rgba(0, 0, 0, 0.07);
          }

          .diff-code-del {
            opacity: 0.3;
            background-color: rgba(0, 0, 0, 0.07);
          }

          code,
          pre {
            line-height: 1.8;
            text-align: left;
            white-space: pre-wrap;
            word-wrap: break-word;
            word-break: break-all;
            font-family: 'Roboto Mono', Monaco, Menlo, 'Courier New', Courier,
              monospace;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.84);
          }

          /* Code blocks */
          pre {
            margin: 0;
          }

          /* Inline code */
          :not(pre) > code {
            padding: 0.1em;
            border-radius: 0.3em;
            white-space: normal;
          }
        `}
      />
    </div>
  );
}

export default DiffFile;
