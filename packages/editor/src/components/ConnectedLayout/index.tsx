import React, { useMemo, useEffect, ReactNode } from 'react';

import { useSelector, useDispatch, useStore } from 'react-redux';
import { Layout, Affix, BackTop } from 'antd';
import { Editure, ReactEditor } from 'editure-react';
import { Node, updateLastSelection } from 'editure';
import { useHistory } from 'react-router-dom';
import { Meta } from '@tuture/core';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Store, Dispatch, RootState } from 'store';
import { initializeEditor } from 'utils/editor';
import { buttonRefs, ButtonRefsContext } from 'utils/hotkeys';
import { useDebouncedSave } from 'utils/hooks';

import { openOutdatedNotification } from './OutdatedNotification';
import LayoutHeader from './LayoutHeader';
import MainMenu from './MainMenu';
import DrawerComponent from './DrawerComponent';
import ChildrenDrawerComponent from './ChildrenDrawerComponent';

const { Header, Content } = Layout;

function ConnectedLayout(props: { children: ReactNode }) {
  const { children } = props;
  const history = useHistory();
  const editor = useMemo(initializeEditor, []) as ReactEditor;

  const store = useStore() as Store;
  const dispatch = useDispatch<Dispatch>();
  const { name: pageTitle } =
    useSelector<RootState, Meta>(store.select.collection.nowArticleMeta) || {};
  const { fragment, outdatedNotificationClicked } = useSelector(
    (state: RootState) => state.collection,
  );

  const outdatedExisted = !!fragment.filter((node) => node.outdated).length;

  useEffect(() => {
    if (outdatedExisted) {
      openOutdatedNotification(() => {
        dispatch.collection.setOutdatedNotificationClicked(true);
      });
    }
  }, [dispatch, outdatedExisted]);

  useEffect(() => {
    dispatch.diff.fetchDiff();
    dispatch.collection.fetchMeta();
    dispatch.collection.fetchArticles();
  }, [dispatch]);

  useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle;
    }
  }, [pageTitle]);

  useEffect(() => {
    if (outdatedNotificationClicked) {
      dispatch.collection.setOutdatedNotificationClicked(false);
      history.push('/toc');
    }
  }, [dispatch, history, outdatedNotificationClicked]);

  const setDirty = useDebouncedSave(['fragment'], 3000, [fragment]);
  function onContentChange(val: Node[]) {
    if (editor.selection) {
      updateLastSelection(editor.selection);
    }

    dispatch.collection.setFragment(val);
    setDirty(true);
  }

  return (
    <ButtonRefsContext.Provider value={buttonRefs}>
      <Editure editor={editor} value={fragment} onChange={onContentChange}>
        <Affix>
          <DrawerComponent />
        </Affix>
        <Affix>
          <ChildrenDrawerComponent />
        </Affix>
        <Layout>
          <Affix style={{ zIndex: 13 }}>
            <MainMenu />
          </Affix>
          <Layout>
            <Header
              css={css`
                background-color: #fff;
                padding: 0;
                border-bottom: 1px solid rgba(232, 232, 232, 1);
                min-width: 1200px;
              `}
            >
              <LayoutHeader />
            </Header>
            <Content
              css={css`
                background: #fff;
                position: relative;
                height: calc(100vh - 64px);
                overflow-y: auto;
              `}
              id="scroll-container"
            >
              {children}
              <BackTop
                css={css`
                  right: 24px;
                `}
              />
            </Content>
          </Layout>
        </Layout>
      </Editure>
    </ButtonRefsContext.Provider>
  );
}

export default ConnectedLayout;
