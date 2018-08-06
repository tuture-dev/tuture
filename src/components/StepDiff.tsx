import React from 'react';
import styled from 'styled-components';
import {
  DragDropContext,
  DropResult,
  DragStart,
  Droppable,
  DroppableProvided,
  DroppableStateSnapshot,
  Draggable,
  DraggableProvided,
  DraggableStateSnapshot,
} from 'react-beautiful-dnd';

import ExplainedItem from './ExplainedItem';
import DiffView from './DiffView';
import { ChangedFile, File, DiffItem } from '../types';
import { reorder } from '../utils/common';

interface StepDiffProps {
  diff: ChangedFile[];
  commit: string;
  diffItem: DiffItem | string;
  isEditMode: boolean;
  updateTutureExplain: (
    commit: string,
    diffKey: string,
    name: 'pre' | 'post',
    value: string,
  ) => void;
  updateTutureDiffOrder: (
    commit: string,
    sourceIndex: number,
    destinationIndex: number,
  ) => void;
}

interface StepDiffState {
  needRenderFiles: (File & ChangedFile)[];
}

interface ResObj {
  [index: string]: ChangedFile[] | File[];
}

/* tslint:disable-next-line */
const DiffWrapper = styled.div`
  padding: ${(props: { isEditMode: boolean }) =>
    props.isEditMode ? '24px' : '0px 24px'};
  &:hover {
    box-shadow: ${(props: { isEditMode: boolean }) =>
      props.isEditMode
        ? '0 1px 4px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(0, 0, 0, 0.09)'
        : 'none'};
    transition: box-shadow 100ms;
  }
`;

/* tslint:disable-next-line */
const InnerList = styled.div``;

export default class StepDiff extends React.PureComponent<
  StepDiffProps,
  StepDiffState
> {
  constructor(props: StepDiffProps) {
    super(props);

    const { diff, diffItem } = this.props;
    const needRenderFiles = this.getEndRenderContent(
      diff,
      (diffItem as DiffItem).diff,
    );
    this.state = {
      needRenderFiles,
    };
  }

  extractFileName({ type, oldPath, newPath }: File): string {
    return type === 'delete' ? oldPath : newPath;
  }

  mapArrItemToObjValue = (property: string, arr: any[]): ResObj => {
    const resObj: ResObj = {};

    if (Array.isArray(arr)) {
      arr.map((item) => {
        resObj[item[property]] = item;
      });
    }

    return resObj;
  };

  getEndRenderContent = (diff: ChangedFile[], files: File[]): any[] => {
    // use fileName key map it belongs obj
    const mapedFiles = this.mapArrItemToObjValue('newPath', files);
    const endRenderContent = diff.map((item) => {
      const fileName = item.file;
      return {
        ...item,
        ...mapedFiles[fileName],
      };
    });

    return endRenderContent;
  };

  getRenderedHunks = (file: File & ChangedFile) => {
    if (file.section) {
      const changes = file.hunks[0].changes.slice(
        ...[file.section.start - 1, file.section.end],
      );
      file.hunks[0].changes = changes;
    }
    return file.hunks;
  };

  onDragStart = (initial: DragStart) => {
    console.log('hhhh');
    // Add a little vibration if the browser supports it.
    // Add's a nice little physical feedback
    if (window.navigator.vibrate) {
      window.navigator.vibrate(100);
    }
  };

  onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const needRenderFiles = reorder(
      this.state.needRenderFiles,
      result.source.index,
      result.destination.index,
    );

    const { updateTutureDiffOrder, commit } = this.props;
    updateTutureDiffOrder(
      commit,
      result.source.index,
      result.destination.index,
    );

    this.setState({
      needRenderFiles,
    });
  };

  render() {
    const { needRenderFiles } = this.state;
    const { isEditMode, updateTutureExplain, commit } = this.props;

    const renderList = needRenderFiles.map((file: File & ChangedFile, i) => {
      const fileCopy: File & ChangedFile = JSON.parse(JSON.stringify(file));
      const fileName = this.extractFileName(fileCopy);
      const startLine = fileCopy.section ? fileCopy.section.start : 1;
      return (
        <Draggable key={i} draggableId={file.file} index={i}>
          {(
            dragProvided: DraggableProvided,
            dragSnapshot: DraggableStateSnapshot,
          ) => (
            <DiffWrapper
              isEditMode={isEditMode}
              innerRef={dragProvided.innerRef}
              {...dragProvided.draggableProps}
              {...dragProvided.dragHandleProps}>
              <ExplainedItem
                explain={fileCopy.explain}
                isRoot={false}
                commit={commit}
                diffKey={String(i)}
                updateTutureExplain={updateTutureExplain}
                isEditMode={isEditMode}>
                <article className="diff-file" key={i}>
                  <header className="diff-file-header">{fileName}</header>
                  <main>
                    <DiffView
                      key={i}
                      lang={fileName
                        .split('.')
                        .pop()
                        .toLowerCase()}
                      hunks={this.getRenderedHunks(fileCopy)}
                      startLine={startLine}
                    />
                  </main>
                </article>
              </ExplainedItem>
            </DiffWrapper>
          )}
        </Draggable>
      );
    });

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={this.onDragEnd}>
        <Droppable droppableId="diff" isDropDisabled={!isEditMode}>
          {(
            dropProvided: DroppableProvided,
            dropSnapshot: DroppableStateSnapshot,
          ) => (
            <div>
              <InnerList
                {...dropProvided.droppableProps}
                innerRef={dropProvided.innerRef}>
                {renderList}
                {dropProvided.placeholder}
              </InnerList>
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }
}
