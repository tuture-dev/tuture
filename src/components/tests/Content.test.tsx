import React from 'react';
import renderer from 'react-test-renderer';

import Content from '../Content';
import tutureUtilities from '../../utils/index';
import { Step } from '../../types/index';
import { diff } from './utils/hunkData';

test('Content render successfully', () => {
  const content = {
    name: 'my first commit',
    commit: '1bd58a3',
    explain: 'tuture is cool ? yes! absolutly',
    diff: diff,
  };

  let viewType = 'unified';
  const changeViewType = (): void => {
    viewType = viewType === 'unified' ? 'split' : 'unified';
  };

  const component = renderer.create(
    <Content
      key={'content'}
      content={content}
      viewType={'unified'}
      changeViewType={changeViewType}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
