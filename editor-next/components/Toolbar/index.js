import React from 'react';
import { cx, css } from 'emotion';
import * as F from 'editure-constants';

import Menu from './Menu';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import ImageButton from './ImageButton';
import HrButton from './HrButton';
import NoteButton from './NoteButton';
import LinkButton from './LinkButton';
import HistoryButton from './HistoryButton';

const Toolbar = React.forwardRef(
  ({ className, linkDispatch, ...props }, ref) => {
    const { imageBtnRef, linkBtnRef } = ref;
    return (
      <Menu
        {...props}
        className={cx(
          className,
          css`
            position: relative;
            padding: 1px 18px 17px;
            margin: 0 -20px;
            border-bottom: 2px solid #eee;
            margin-bottom: 20px;
          `,
        )}>
        <HistoryButton icon="undo" status="undo" title="撤销" />
        <HistoryButton icon="redo" status="redo" title="重做" />
        <MarkButton format={F.BOLD} icon="format_bold" title="加粗" />
        <MarkButton format={F.ITALIC} icon="format_italic" title="斜体" />
        <MarkButton
          format={F.UNDERLINE}
          icon="format_underlined"
          title="下划线"
        />
        <MarkButton
          format={F.STRIKETHROUGH}
          icon="format_strikethrough"
          title="删除线"
        />
        <MarkButton format={F.CODE} icon="code" title="内联代码" />
        <LinkButton dispatch={linkDispatch} ref={linkBtnRef} />
        <BlockButton format={F.H1} icon="looks_one" title="一级标题" />
        <BlockButton format={F.H2} icon="looks_two" title="二级标题" />
        <BlockButton format={F.BLOCK_QUOTE} icon="format_quote" title="引用" />
        <BlockButton format={F.CODE_BLOCK} icon="attach_money" title="代码块" />
        <NoteButton />
        <BlockButton
          format={F.NUMBERED_LIST}
          icon="format_list_numbered"
          title="有序列表"
        />
        <BlockButton
          format={F.BULLETED_LIST}
          icon="format_list_bulleted"
          title="无序列表"
        />
        <ImageButton ref={imageBtnRef} />
        <HrButton />
      </Menu>
    );
  },
);

export default Toolbar;
