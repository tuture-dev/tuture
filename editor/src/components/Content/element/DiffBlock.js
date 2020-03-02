/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import SyntaxHighlighter from '../../Highlight';

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

function concatCodeStr(diffItem) {
  let codeStr = '';
  const DIFF_ADD = [];
  const DIFF_DEL = [];
  let allLines = [];

  diffItem.chunks.forEach((chunk, chunkIndex) => {
    chunk.changes.forEach((change, index) => {
      const { type, content } = change;
      allLines = allLines.concat(index);

      if (type === 'add') {
        DIFF_ADD.push(index);
      } else if (type === 'del') {
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
    });
  });

  return { codeStr, DIFF_ADD, DIFF_DEL, allLines };
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

  const {
    codeStr = '',
    DIFF_ADD = [],
    DIFF_DEL = [],
    allLines = [],
  } = concatCodeStr(diffItem);

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

    dispatch.collection.saveCollection();
  }

  const showLines = getShowLines(hiddenLines, allLines);

  return (
    <div {...attributes} className="diff-file" css={diffFileStyle}>
      <header css={diffFileHeaderStyle}>{file}</header>
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
        <SyntaxHighlighter
          language={lang === 'vue' ? 'html' : lang}
          PreTag="table"
          CodeTag="tr"
          showLineNumbers
          showLineChecker
          wrapLines
          lineProps={(lineNum) => {
            return {
              isCodeAddition: isCodeAddition(lineNum),
              isHidden: isHidden(lineNum),
              isCodeDeletion: isCodeDeletion(lineNum),
            };
          }}
        >
          {codeStr}
        </SyntaxHighlighter>
      </Checkbox.Group>
    </div>
  );
}

export default DiffBlockElement;
