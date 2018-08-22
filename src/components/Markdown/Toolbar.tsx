import React from 'react';
import styled from 'styled-components';

import { ToolButton } from './common';
import { spliceStr, insertStr } from './utils';
import { rem } from '../../utils/common';

import Icon from '../common/Icon';

type ToolType =
  | 'b'
  | 'i'
  | 'h'
  | 'list'
  | 'numbered list'
  | 'blockquotes'
  | 'link'
  | 'img'
  | 'code'
  | 'block code';

interface ToolProps {
  source: string;
  contentRef: HTMLTextAreaElement;
  cursorPosition?: number;
  updateContent: (content: string) => void;
  changePosition: (position: number) => void;
  handleCursor: (position?: number, textarea?: HTMLTextAreaElement) => void;
}

interface ToolState {
  tooltipOpacity: string;
}

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: rowReverse;
  border-bottom: none;
  height: 28px;
  padding-top: 8px;
  line-height: 32px;
`;

const ToolButtonWrapper = styled.div`
  margin-left: ${rem(40)}rem;
  @media (max-width: 1300px) {
    margin-left: ${rem(20)}rem;
  }
`;

export default class Toolbar extends React.Component<ToolProps, ToolState> {
  constructor(props: ToolProps) {
    super(props);
    this.state = {
      tooltipOpacity: '0',
    };
  }

  isAtBeginning = (content: string, selectionStart: number) =>
    selectionStart === 0 || content.slice(0, selectionStart).endsWith('\n');

  isAtEnding = (content: string, selectionEnd: number) =>
    selectionEnd === content.length ||
    content.slice(selectionEnd, content.length).indexOf('\n') === 0;

  changeState = (source: string, position?: number) => {
    const { updateContent, changePosition } = this.props;
    updateContent(source);

    if (position) {
      changePosition(position);
    }
  };

  insertContent = (
    content?: string,
    typeStr?: string,
    insertPos?: number,
    cursorPos?: number,
  ) => {
    const updatedContent = insertStr(content, typeStr, insertPos);
    this.changeState(updatedContent, cursorPos);
  };

  spliceContent = (
    content?: string,
    typeStr?: string,
    startPos?: number,
    endPos?: number,
    cursorPos?: number,
  ) => {
    const source = spliceStr(content, typeStr, startPos, endPos);
    this.changeState(source, cursorPos);
  };

  handleToolbarClick = (toolType: ToolType) => {
    const { source, contentRef } = this.props;

    if (!contentRef) {
      return;
    }
    const textarea = contentRef;
    const content = source || '';
    const selectedContent = content.slice(
      textarea.selectionStart,
      textarea.selectionEnd,
    );
    let resultContent = '';
    switch (toolType) {
      case 'b': {
        selectedContent
          ? this.spliceContent(
              content,
              '**',
              textarea.selectionStart,
              textarea.selectionEnd,
              textarea.selectionStart + selectedContent.length + 2,
            )
          : this.insertContent(
              content,
              '****',
              textarea.selectionStart,
              content.slice(0, textarea.selectionStart).length + 2,
            );
        break;
      }
      case 'i': {
        selectedContent
          ? this.spliceContent(
              content,
              '*',
              textarea.selectionStart,
              textarea.selectionEnd,
              textarea.selectionStart + selectedContent.length + 1,
            )
          : this.insertContent(
              content,
              '**',
              textarea.selectionStart,
              content.slice(0, textarea.selectionStart).length + 2,
            );
        break;
      }
      case 'h': {
        const isContentEnd = !content || content.endsWith('\n');
        this.insertContent(
          content,
          isContentEnd ? '#### ' : '\n#### ',
          textarea.selectionStart,
          content.slice(0, textarea.selectionStart).length + 6,
        );
        break;
      }
      case 'list':
        if (selectedContent) {
          let resultContent: string = '';
          const listItems = selectedContent.split('\n');
          listItems.map((item) => {
            if (item) {
              resultContent += `- ${item}\n`;
            }
          });
          const source = content
            .slice(0, textarea.selectionStart)
            .concat(
              this.isAtBeginning(content, textarea.selectionStart) ? '' : '\n',
              resultContent,
              this.isAtEnding(content, textarea.selectionEnd) ? '' : '\n',
              content.slice(textarea.selectionEnd, content.length),
            );
          this.changeState(source);
        } else {
          const isContentEnd = !content || content.endsWith('\n');
          this.insertContent(
            content,
            isContentEnd ? '- ' : '\n- ',
            textarea.selectionStart,
            content.slice(0, textarea.selectionStart).length + 3,
          );
        }
        break;
      case 'numbered list':
        if (selectedContent) {
          let resultContent: string = '';
          const listItems = selectedContent.split('\n');
          listItems.map((item, index) => {
            if (item) {
              resultContent += `${index + 1}. ${item}\n`;
            }
          });
          const source = content
            .slice(0, textarea.selectionStart)
            .concat(
              this.isAtBeginning(content, textarea.selectionStart)
                ? ''
                : '\n\n',
              resultContent,
              this.isAtEnding(content, textarea.selectionEnd) ? '' : '\n',
              content.slice(textarea.selectionEnd, content.length),
            );
          this.changeState(source);
        } else {
          const isContentEnd = !content || content.endsWith('\n');
          this.insertContent(
            content,
            isContentEnd ? '1. ' : '\n1. ',
            textarea.selectionStart,
            content.slice(0, textarea.selectionStart).length + 4,
          );
        }
        break;
      case 'blockquotes':
        if (selectedContent) {
          let resultContent: string;
          if (
            textarea.selectionStart === 0 ||
            selectedContent.indexOf('\n') === 0
          ) {
            resultContent = '';
          } else {
            resultContent = '\n';
          }
          const listItems = selectedContent.split('\n');
          listItems.map((item, index) => {
            if (item) {
              resultContent += `> ${item}\n`;
            }
          });
          const source = content
            .slice(0, textarea.selectionStart)
            .concat(
              this.isAtBeginning(content, textarea.selectionStart) ? '' : '\n',
              resultContent,
              this.isAtEnding(content, textarea.selectionEnd) ? '' : '\n',
              content.slice(textarea.selectionEnd, content.length),
            );
          this.changeState(source);
        } else {
          const isContentEnd = !content || content.endsWith('\n');
          this.insertContent(
            content,
            isContentEnd ? '> ' : '\n> ',
            textarea.selectionStart,
            content.slice(0, textarea.selectionStart).length + 3,
          );
        }

        break;
      case 'code': {
        selectedContent
          ? this.spliceContent(
              content,
              '`',
              textarea.selectionStart,
              textarea.selectionEnd,
              textarea.selectionStart + selectedContent.length + 1,
            )
          : this.insertContent(
              content,
              '``',
              textarea.selectionStart,
              content.slice(0, textarea.selectionStart).length + 1,
            );
        break;
      }
      case 'block code': {
        const isContentEnd = !content || content.endsWith('\n');
        const basicCursorPosition = content.slice(0, textarea.selectionStart)
          .length;
        selectedContent
          ? this.spliceContent(
              content,
              '\n```\n',
              textarea.selectionStart,
              textarea.selectionEnd,
              textarea.selectionStart + selectedContent.length + 5,
            )
          : this.insertContent(
              content,
              isContentEnd ? '```\n\n```' : '\n```\n\n```',
              textarea.selectionStart,
              isContentEnd ? basicCursorPosition + 4 : basicCursorPosition + 5,
            );
        break;
      }
      case 'link':
        if (selectedContent) {
          resultContent = `${content.slice(
            0,
            textarea.selectionStart,
          )}[${selectedContent}]()${content.slice(
            textarea.selectionEnd,
            content.length,
          )}`;
          this.changeState(
            resultContent,
            textarea.selectionStart + selectedContent.length + 3,
          );
        } else {
          this.insertContent(
            content,
            '[](url)',
            textarea.selectionStart,
            content.slice(0, textarea.selectionStart).length + 1,
          );
        }
        break;
      default:
        break;
    }
  };

  render() {
    const toolArr = [
      [
        {
          type: 'b',
          value: 'icon-bold',
          children: <b>B</b>,
          style: {
            width: '13px',
            height: '14px',
          },
          note: '加粗',
        },
        {
          type: 'i',
          value: 'icon-italic',
          style: {
            width: '5px',
            height: '12px',
          },
          children: <i>I</i>,
          note: '斜体',
        },
        {
          type: 'h',
          value: 'icon-heading',
          style: {
            width: '15px',
            height: '14px',
          },
          note: '标题',
        },
      ],
      [
        {
          type: 'link',
          value: 'icon-link',
          style: {
            width: '17px',
            height: '15.21px',
          },
          note: '链接',
        },
        {
          type: 'blockquotes',
          value: 'icon-blockquote',
          style: {
            width: '17px',
            height: '15px',
          },
          note: '引用',
        },
        {
          type: 'code',
          value: 'icon-code',
          style: {
            width: '20px',
            height: '15px',
          },
          note: '代码',
        },
        {
          type: 'block code',
          value: 'icon-block-code',
          style: {
            width: '18px',
            height: '18px',
          },
          note: '代码块',
        },
      ],
      [
        {
          type: 'list',
          value: 'icon-unordered-list',
          style: {
            width: '19px',
            height: '15.83px',
          },
          note: '无序列表',
        },
        {
          type: 'numbered list',
          value: 'icon-ordered-list',
          style: {
            width: '18px',
            height: '15.92px',
          },
          note: '有序列表',
        },
      ],
    ];

    return (
      <ToolbarWrapper>
        {toolArr.map((tool, index) => (
          <ToolButtonWrapper key={index}>
            {tool.map((toolItem, toolItemIndex) => (
              <ToolButton
                key={toolItemIndex}
                onClick={() =>
                  this.handleToolbarClick(toolItem.type as ToolType)
                }>
                <Icon
                  name={toolItem.value}
                  customStyle={{ ...toolItem.style, fill: '#00b887' }}
                />
              </ToolButton>
            ))}
            {index === 2 && this.props.children}
          </ToolButtonWrapper>
        ))}
      </ToolbarWrapper>
    );
  }
}
