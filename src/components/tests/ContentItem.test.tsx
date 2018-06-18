import React from 'react';
import renderer from 'react-test-renderer';

import ContentItem from '../ContentItem';
import tutureUtilities from '../../utils/index';
import { Diff } from '../../types/index';
import { diff } from './utils/hunkData';

test('ContentItem render successfully', () => {
  const renderExplain = (explain: string[] | string): React.ReactNode | React.ReactNodeArray => {
    if (tutureUtilities.isArray(explain)) {
      const arrExplain = explain as string[];
      return (
        arrExplain.map((explainItem: string, i: number) =>
          <p key={i}>{explainItem}</p>)
      );
    }

    return <p>{explain}</p>;
  }

  const component = renderer.create(
    <ContentItem
      diff={diff}
      viewType={'unified'}
      commit={'1bd58a3'}
      renderExplain={renderExplain}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
