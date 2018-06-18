import React from 'react';
import renderer from 'react-test-renderer';

import SplitHunk from '../DiffView/SplitHunk';
import { hunk } from './utils/hunkData';

test('SplitHunk render successfully', () => {

  const component = renderer.create(
    <SplitHunk
      hunk={hunk}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
