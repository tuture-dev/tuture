import React, { useState, useMemo, useEffect, ReactNode } from 'react';

import { useSelector, useDispatch, useStore } from 'react-redux';
import { Layout, Affix, BackTop } from 'antd';
import { Editure, ReactEditor } from 'editure-react';
import { Node, updateLastSelection } from 'editure';
import { useHistory } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { Store, Dispatch, RootState } from '../../store';
import { initializeEditor } from '../../utils/editor';
import { buttonRefs, ButtonRefsContext } from '../../utils/hotkeys';

import LayoutHeader from './LayoutHeader';
import MainMenu from './MainMenu';
import DrawerComponent from './DrawerComponent';
import ChildrenDrawerComponent from './ChildrenDrawerComponent';

import { Meta } from '../../../../types';

const { Header, Content } = Layout;

function ConnectedLayout(props: { children: ReactNode }) {
  const { children } = props;
  const [timeoutState, setTimeoutState] = useState<number | null>(null);
  const history = useHistory();

  const store = useStore() as Store;
  const { name: pageTitle } = useSelector<RootState, Meta>(
    store.select.collection.nowArticleMeta,
  );
  const value = useSelector((state: RootState) => state.collection.nowSteps);
  const outdatedNotificationClicked = useSelector(
    (state: RootState) => state.collection.outdatedNotificationClicked,
  );

  const editor = useMemo(initializeEditor, []) as ReactEditor;
  const dispatch = useDispatch<Dispatch>();

  useEffect(() => {
    dispatch.diff.fetchDiff();
    dispatch.collection.fetchCollection();
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

  function resetTimeout(id: number | null, newId: any) {
    if (id) {
      clearTimeout(id);
    }

    return newId;
  }

  function onContentChange(val: Node[]) {
    if (editor.selection) {
      updateLastSelection(editor.selection);
    }

    dispatch.collection.setNowSteps(val);

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
    <ButtonRefsContext.Provider value={buttonRefs}>
      <Editure editor={editor} value={value} onChange={onContentChange}>
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
                overflow: auto;
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
