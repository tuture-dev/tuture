import React, { useState } from 'react';

// @ts-ignore
import LazyLoad from 'react-lazy-load';
import { useDispatch } from 'react-redux';
import { Checkbox } from 'antd';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import parseDiff from 'parse-diff';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useSelector, useStore } from 'react-redux';
import { flattenHiddenLines, unflattenHiddenLines } from 'utils/hiddenLines';
import { Dispatch, Store, RootState } from 'store';

import SyntaxHighlighter from '../../Highlight';
import { ElementProps } from './index';

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

const loadingAnimation = css`
  background: linear-gradient(270deg, #111, #fff);
  background-size: 400% 400%;
  margin-top: 1em;
  border-radius: 8px;

  animation: AnimationName 3s ease infinite;

  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

function concatCodeStr(diffItem: parseDiff.File) {
  let codeStr = '';
  const DIFF_ADD: number[] = [];
  const DIFF_DEL: number[] = [];
  let allLines: number[] = [];

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

function Placeholder() {
  return <div></div>;
}

function DiffBlockElement(props: ElementProps) {
  const { attributes, element, children } = props;
  const { file, commit, hiddenLines = [] } = element;

  const [loading, setLoading] = useState(true);
  const [timeoutState, setTimeoutState] = useState<number | null>(null);
  const dispatch = useDispatch<Dispatch>();

  const store = useStore() as Store;
  const diffItem = useSelector<RootState, parseDiff.File>(
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

  const flatHiddenLines = flattenHiddenLines(hiddenLines);
  const showLines = allLines.filter((line) => !flatHiddenLines.includes(line));
  const height = 22 * allLines.length + 100;

  const isHidden = (i: number) => flatHiddenLines.includes(i);
  const isCodeAddition = (i: number) => !diffItem.new && DIFF_ADD.includes(i);
  const isCodeDeletion = (i: number) => !diffItem.new && DIFF_DEL.includes(i);

  function resetTimeout(id: number | null, newId: any) {
    if (id) {
      clearTimeout(id);
    }

    return newId;
  }

  function onChange(checkedLines: CheckboxValueType[]) {
    const hiddenLines = allLines.filter((line) => !checkedLines.includes(line));

    dispatch.collection.setDiffItemHiddenLines({
      commit,
      file,
      hiddenLines: unflattenHiddenLines(hiddenLines),
    });

    setTimeoutState(
      resetTimeout(
        timeoutState,
        setTimeout(() => {
          dispatch.collection.saveCollection();
        }, 1000),
      ),
    );
  }

  return (
    <div {...attributes} contentEditable={false}>
      {allLines.length === 0 ? (
        <Placeholder />
      ) : (
        <div
          css={css`
            height: ${height};
            ${loading && loadingAnimation}
          `}
        >
          <LazyLoad
            height={height}
            offsetVertical={2000}
            onContentVisible={() => setLoading(false)}
          >
            <div className="diff-file" css={diffFileStyle}>
              <header css={diffFileHeaderStyle}>{file}</header>
              <Checkbox.Group
                onChange={onChange}
                value={showLines}
                css={css`
                  width: 100%;
                `}
              >
                <SyntaxHighlighter
                  code={codeStr}
                  language={lang === 'vue' ? 'html' : lang}
                  PreTag="table"
                  CodeTag="tr"
                  showLineNumbers
                  showLineChecker
                  wrapLines
                  commit={commit}
                  file={file}
                  lineProps={(lineNum: number) => {
                    return {
                      isCodeAddition: isCodeAddition(lineNum),
                      isHidden: isHidden(lineNum),
                      isCodeDeletion: isCodeDeletion(lineNum),
                    };
                  }}
                />
              </Checkbox.Group>
            </div>
          </LazyLoad>
        </div>
      )}
      {children}
    </div>
  );
}

export default React.memo(DiffBlockElement);
