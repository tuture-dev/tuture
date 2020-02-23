import * as F from 'editure-constants';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import Menu from './Menu';
import EditLink from './EditLink';
import SplitLine from './SplitLine';
import SaveButton from './SaveButton';
import MarkButton from './MarkButton';
import BlockButton from './BlockButton';
import ImageButton from './ImageButton';
import HrButton from './HrButton';
import NoteButton from './NoteButton';
import LinkButton from './LinkButton';
import HistoryButton from './HistoryButton';
import SelectContentType from './SelectContentType';

const Toolbar = (props) => {
  return (
    <Menu
      {...props}
      css={css`
        position: relative;

        & .ant-select-selection {
          background: none;
          border: none;
          padding: 2px;
        }

        & .ant-select-selection:active {
          border: none;
          box-shadow: none;
        }

        & .ant-select-selection:focus {
          border: none;
          box-shadow: none;
        }

        & .ant-select-selection-selected-value {
          font-size: 14px;
          font-weight: 400;
        }
      `}
    >
      <EditLink />

      <SaveButton />
      <HistoryButton status="undo" icon="icon-undo" title="撤销" />
      <HistoryButton status="redo" icon="icon-redo" title="重做" />

      <SplitLine />

      <SelectContentType />

      <SplitLine />

      <MarkButton format={F.BOLD} icon="icon-bold" title="加粗" />
      <MarkButton format={F.ITALIC} icon="icon-italic" title="斜体" />
      <MarkButton format={F.UNDERLINE} icon="icon-underline" title="下划线" />
      <MarkButton
        format={F.STRIKETHROUGH}
        icon="icon-strikethrough"
        title="删除线"
      />
      <MarkButton format={F.CODE} icon="icon-code" title="内联代码" />

      <SplitLine />

      <BlockButton
        format={F.NUMBERED_LIST}
        icon="icon-orderedlist"
        title="有序列表"
      />
      <BlockButton
        format={F.BULLETED_LIST}
        icon="icon-unorderedlist"
        title="无序列表"
      />

      <SplitLine />

      <BlockButton
        format={F.CODE_BLOCK}
        icon="icon-codelibrary"
        title="代码块"
      />
      <NoteButton />
      <ImageButton />

      <SplitLine />

      <LinkButton />
      <BlockButton format={F.BLOCK_QUOTE} icon="icon-blockquote" title="引用" />
      <HrButton />
    </Menu>
  );
};

export default Toolbar;
