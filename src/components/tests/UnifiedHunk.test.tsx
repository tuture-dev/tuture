import React from 'react';
import renderer from 'react-test-renderer';

import UnifiedHunk from '../DiffView/UnifiedHunk';
import { hunk } from './utils/hunData';

test('Test UnifiedHunk render successfully', () => {
  const component = renderer.create(
    <UnifiedHunk
      hunk={hunk}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
