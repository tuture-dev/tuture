import { Article } from '@tuture/core';

export function getArtcleMetaById(articleId = '', articles: Article[] = []) {
  let targetArticleIndex = 0;
  const targetArticle = articles.filter((article, index) => {
    if (article.id === articleId) {
      targetArticleIndex = index;
      return true;
    }
    return false;
  })[0];

  return {
    articleIndex: targetArticleIndex,
    articleName: targetArticle?.name || '',
  };
}
