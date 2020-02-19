import React from 'react';

/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';
import { useSelector, useStore, useDispatch } from 'react-redux';
import { Container, Draggable } from 'react-smooth-dnd';

function StepFileList() {
  const dispatch = useDispatch();
  const store = useStore();

  const { nowCommit } = useSelector((state) => state.collection);
  const { fileList, title } = useSelector(
    store.select.collection.getStepFileListAndTitle({ commit: nowCommit }),
  );

  function onDrop(res) {
    dispatch.collection.switchFile({ ...res, commit: nowCommit });
  }

  return (
    <div
      css={css`
        background-color: #f7f7fa;
        height: calc(100vh - 64px);
        padding: 48px 16px;
      `}
    >
      <h4
        css={css`
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 1);
          line-height: 24px;
          margin-bottom: 16px;
        `}
      >
        {title}
      </h4>
      <Container
        onDrop={onDrop}
        dragClass="card-ghost"
        dropClass="card-ghost-drop"
        dropPlaceholder={{
          animationDuration: 150,
          showOnTop: true,
          className: 'drop-preview',
        }}
        dropPlaceholderAnimationDuration={200}
      >
        {fileList.map((file) => (
          <Draggable key={file}>
            <div
              key={file}
              css={css`
                max-width: 194px;
                height: 36px;
                background: rgba(255, 255, 255, 1);
                box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.05);
                border-radius: 4px;
                margin-bottom: 8px;
                padding: 8px;
              `}
            >
              <span>{file}</span>
            </div>
          </Draggable>
        ))}
      </Container>
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
