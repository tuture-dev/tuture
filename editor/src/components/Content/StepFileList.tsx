import React, { useState } from 'react';
import { Tooltip } from 'antd';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { Container, Draggable, DropResult } from 'react-smooth-dnd';

import IconFont from 'components/IconFont';
import { Dispatch, RootState, Store } from 'store';
import { CollectionState } from 'models/collection';

type StepFile = { file: string; display: boolean };

function StepFileList() {
  const dispatch = useDispatch<Dispatch>();
  const [timeoutState, setTimeoutState] = useState<number | null>(null);
  const store = useStore() as Store;

  const { nowStepCommit } = useSelector<RootState, CollectionState>(
    (state) => state.collection,
  );
  const { fileList, title } = useSelector<
    RootState,
    { fileList: StepFile[]; title: string }
  >(store.select.collection.getStepFileListAndTitle({ commit: nowStepCommit }));

  function resetTimeout(id: number | null, newId: any) {
    if (id) {
      clearTimeout(id);
    }

    return newId;
  }

  function onDrop(res: DropResult) {
    const { removedIndex, addedIndex } = res;

    if (removedIndex && addedIndex && nowStepCommit) {
      dispatch.collection.switchFile({
        removedIndex,
        addedIndex,
        commit: nowStepCommit,
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
  }

  function onToggleShowFile(file: StepFile) {
    if (nowStepCommit) {
      dispatch.collection.setFileShowStatus({
        commit: nowStepCommit,
        ...file,
        display: !file.display,
      });

      setTimeoutState(
        resetTimeout(
          timeoutState,
          setTimeout(() => {
            dispatch.collection.saveCollection({ showMessage: true });
          }, 1000),
        ),
      );
    }
  }

  return (
    <div
      css={css`
        background-color: #f7f7fa;
        height: calc(100vh - 64px);
        padding: 48px 16px;
        &::-webkit-scrollbar {
          display: none;
        }

        -ms-overflow-style: none; // IE 10+
        overflow: -moz-scrollbars-none; // Firefox
      `}
    >
      <h4
        css={css`
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #595959;
          line-height: 24px;
          margin-bottom: 16px;
        `}
      >
        {title}
      </h4>
      <div
        css={css`
          padding-top: 16px;
          padding-bottom: 48px;
          max-height: calc(100vh - 64px - 70px - 10px);
          overflow-y: auto;

          &::-webkit-scrollbar {
            display: none;
          }

          -ms-overflow-style: none; // IE 10+
          overflow: -moz-scrollbars-none; // Firefox
        `}
      >
        <Container
          onDrop={onDrop}
          dragClass="card-ghost"
          dropClass="card-ghost-drop"
          dropPlaceholder={{
            animationDuration: 150,
            showOnTop: true,
            className: 'drop-preview',
          }}
        >
          {fileList.map((file) => (
            <Draggable key={file.file}>
              <Tooltip title={file.file} placement="left" mouseEnterDelay={0.5}>
                <div
                  key={file.file}
                  css={css`
                    max-width: 100%;
                    height: 36px;
                    background: rgba(255, 255, 255, 1);
                    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
                    border-radius: 4px;
                    margin-bottom: 8px;
                    padding: 8px;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;

                    &:hover {
                      cursor: pointer;
                    }
                  `}
                >
                  <span
                    css={css`
                      color: ${file.display
                        ? 'rgba(0, 0, 0, 0.65)'
                        : '#bfbfbf'};
                      display: inline-block;
                      max-width: calc(100% - 36px);
                      white-space: nowrap;
                      text-overflow: ellipsis;
                      overflow: hidden;
                    `}
                  >
                    {file.file}
                  </span>
                  <span>
                    <IconFont
                      type={file.display ? 'icon-eye' : 'icon-eye-close'}
                      onClick={() => onToggleShowFile(file)}
                      css={css`
                        margin-right: 4px;
                        &:hover {
                          color: #02b875;
                        }
                      `}
                    />
                    <IconFont
                      type="icon-menu"
                      css={css`
                        &:hover {
                          color: #02b875;
                        }
                      `}
                    />
                  </span>
                </div>
              </Tooltip>
            </Draggable>
          ))}
        </Container>
      </div>
      <Global
        styles={css`
          .card-ghost {
            transition: transform 0.18s ease;
            transform: rotateZ(5deg);
          }

          .card-ghost-drop {
            transition: transform 0.18s ease-in-out;
            transform: rotateZ(0deg);
          }

          .drop-preview {
            max-width: 194px;
            background-color: rgba(2, 184, 117, 0.1);
            border: 1px dashed #02b875;
            height: 36px;
          }
        `}
      />
    </div>
  );
}

export default StepFileList;
