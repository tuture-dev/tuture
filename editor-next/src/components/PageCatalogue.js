import React from 'react';
import { Anchor, Divider } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Link } = Anchor;

function getCommit(linkId, catalogue) {
  const index = catalogue.map(({ id }) => id).indexOf(linkId);

  for (let i = index; i >= 0; i--) {
    if (catalogue[i].commit) {
      return catalogue[i].commit;
    }
  }

  return null;
}

function getHeadingDepth(type) {
  switch (type) {
    case 'heading-two':
      return 1;
    case 'heading-three':
      return 2;
    case 'heading-four':
      return 3;
    case 'heading-five':
      return 4;
    case 'heading-six':
      return 5;
    default:
      return 1;
  }
}

function PageCatalogue() {
  const dispatch = useDispatch();
  const store = useStore();
  const nowArticleCatalogue = useSelector(
    store.select.collection.nowArticleCatalogue,
  );

  function onChange(link) {
    const commit = getCommit(link.slice(1), nowArticleCatalogue);

    if (link && commit) {
      dispatch({ type: 'collection/setNowStepCommit', payload: { commit } });
    }
  }

  return (
    <div
      css={css`
        padding-top: 40px;
        padding-left: 8px;
        padding-right: 8px;
        height: calc(100vh - 64px);
        background-color: #f7f7fa;
      `}
    >
      <div
        css={css`
          padding-left: 16px;
          padding-right: 16px;
        `}
      >
        <h4
          css={css`
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #595959;
            line-height: 24px;
            margin-bottom: 4px;
          `}
        >
          大纲
        </h4>

        <Divider
          css={css`
            margin: 16px 0;
          `}
        />
      </div>
      <Anchor
        css={css`
          background: transparent;

          & .ant-anchor-ink::before {
            background: transparent;
          }
        `}
        targetOffset={64}
        onChange={onChange}
        affix={false}
      >
        {nowArticleCatalogue.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            title={item.title}
            css={css`
              padding-left: ${getHeadingDepth(item.type) * 16}px;

              & > a {
                color: ${getHeadingDepth(item.type) === 1
                  ? 'rgba(0,0 ,0, 1)'
                  : 'rgba(0, 0, 0, .65)'};
              }
            `}
          />
        ))}
      </Anchor>
    </div>
  );
}

export default PageCatalogue;
