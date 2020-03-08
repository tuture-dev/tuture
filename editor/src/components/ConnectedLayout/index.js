import { useMemo, useEffect, useState } from 'react';

import { useSelector, useDispatch, useStore } from 'react-redux';
import { Layout, Affix, BackTop } from 'antd';
import { Slate } from 'tuture-slate-react';
import { updateLastSelection } from 'editure';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { initializeEditor } from 'utils/editor';
import { buttonRefs, ButtonRefsContext } from 'utils/hotkeys';

import LayoutHeader from './LayoutHeader';
import MainMenu from './MainMenu';
import DrawerComponent from './DrawerComponent';
import ChildrenDrawerComponent from './ChildrenDrawerComponent';

const { Header, Content } = Layout;

function ConnectedLayout(props) {
  const { children } = props;
  const [timeoutState, setTimeoutState] = useState(null);

  const store = useStore();
  const { name: pageTitle } = useSelector(
    store.select.collection.nowArticleMeta,
  );
  const value = useSelector(store.select.collection.nowArticleContent);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch.diff.fetchDiff();
    dispatch.collection.fetchCollection();
  }, [dispatch]);

  useEffect(() => {
    if (pageTitle) {
      document.title = pageTitle;
    }
  }, [pageTitle]);

  function handleSaveCollection() {
    dispatch.collection.saveCollection();
  }

  function resetTimeout(id, newId) {
    clearTimeout(id);

    return newId;
  }

  function onContentChange(val) {
    dispatch({
      type: 'collection/setArticleContent',
      payload: { fragment: val },
    });

    setTimeoutState(
      resetTimeout(timeoutState, setTimeout(handleSaveCollection, 1000)),
    );
  }

  const editor = useMemo(initializeEditor, []);
  updateLastSelection(editor.selection);

  return (
    <ButtonRefsContext.Provider value={buttonRefs}>
      <Slate editor={editor} value={value} onChange={onContentChange}>
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
      </Slate>
    </ButtonRefsContext.Provider>
  );
}

export default ConnectedLayout;
