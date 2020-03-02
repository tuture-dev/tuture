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
      <HistoryButton action="undo" icon="icon-undo" />
      <HistoryButton action="redo" icon="icon-redo" />

      <SplitLine />

      <SelectContentType />

      <SplitLine />

      <MarkButton format={F.BOLD} icon="icon-bold" />
      <MarkButton format={F.ITALIC} icon="icon-italic" />
      <MarkButton format={F.UNDERLINE} icon="icon-underline" />
      <MarkButton format={F.STRIKETHROUGH} icon="icon-strikethrough" />
      <MarkButton format={F.CODE} icon="icon-code" />

      <SplitLine />

      <BlockButton format={F.NUMBERED_LIST} icon="icon-orderedlist" />
      <BlockButton format={F.BULLETED_LIST} icon="icon-unorderedlist" />

      <SplitLine />

      <BlockButton format={F.CODE_BLOCK} icon="icon-codelibrary" />
      <NoteButton />
      <ImageButton />

      <SplitLine />

      <LinkButton />
      <BlockButton format={F.BLOCK_QUOTE} icon="icon-blockquote" />
      <HrButton />
    </Menu>
  );
};

export default Toolbar;
