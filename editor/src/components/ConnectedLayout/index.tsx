import React, { useState, useMemo, useEffect } from 'react';

import { useSelector, useDispatch, useStore } from 'react-redux';
import { Layout, Affix, BackTop } from 'antd';
import { Editure, ReactEditor } from 'editure-react';
import { updateLastSelection } from 'editure';
import { useHistory } from 'react-router-dom';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { initializeEditor } from '../../utils/editor';
import { buttonRefs, ButtonRefsContext } from '../../utils/hotkeys';

import LayoutHeader from './LayoutHeader';
import MainMenu from './MainMenu';
import DrawerComponent from './DrawerComponent';
import ChildrenDrawerComponent from './ChildrenDrawerComponent';

const { Header, Content } = Layout;

function ConnectedLayout(props: any) {
  const { children } = props;
  const [timeoutState, setTimeoutState] = useState(null);
  const history = useHistory();

  const store: any = useStore();
  const { name: pageTitle } = useSelector(
    store.select.collection.nowArticleMeta,
  );
  const value = useSelector((state: any) => state.collection.nowSteps);
  const outdatedNotificationClicked = useSelector(
    (state: any) => state.collection.outdatedNotificationClicked,
  );

  const dispatch: any = useDispatch();

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
  }, [outdatedNotificationClicked]);

  function resetTimeout(id: any, newId: any) {
    clearTimeout(id);

    return newId;
  }

  function onContentChange(val: any) {
    dispatch.collection.setNowSteps({ fragment: val });

    setTimeoutState(
      resetTimeout(
        timeoutState,
        setTimeout(() => {
          dispatch.collection.saveCollection();
        }, 1000),
      ),
    );
  }

  const editor = useMemo(initializeEditor, []) as ReactEditor;
  updateLastSelection(editor.selection);

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
