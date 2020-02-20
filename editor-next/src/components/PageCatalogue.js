import React from 'react';
import { Anchor } from 'antd';
import { useDispatch, useSelector, useStore } from 'react-redux';

/** @jsx jsx */
import { css, jsx } from '@emotion/core';

const { Link } = Anchor;

function getNowArticleCatalogueArr(nowArticleCatalogue) {
  return nowArticleCatalogue.filter((item) => item.commit);
}

function getCommit(link, nowArticleCatalogueArr) {
  let commit = '';
  nowArticleCatalogueArr
    .filter((item) => item.id === link)
    .map((item) => (commit = item.commit));

  return commit;
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
  const nowArticleCatalogueArr = getNowArticleCatalogueArr(nowArticleCatalogue);

  function onChange(link) {
    const commit = getCommit(link.slice(1), nowArticleCatalogueArr);

    if (link && commit) {
      dispatch.collection.setNowStepCommit(commit);
    }
  }

  console.log('nowArticleCatalogue', nowArticleCatalogue);

  return (
    <div
      css={css`
        margin-left: 4px;
      `}
    >
      <Anchor
        css={css`
          background: transparent;
        `}
        targetOffset={64}
        getContainer={() => document.getElementById('scroll-container')}
        onChange={onChange}
      >
        {nowArticleCatalogue.map((item) => (
          <Link
            key={item.id}
            href={`#${item.id}`}
            title={item.title}
            css={css`
              padding-left: ${getHeadingDepth(item.type) * 16}px;
            `}
          />
        ))}
      </Anchor>
    </div>
  );
}

export default PageCatalogue;
