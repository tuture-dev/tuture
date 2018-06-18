import React from 'react';
import renderer from 'react-test-renderer';

import Hunk from '../DiffView/Hunk';
import { hunk } from './utils/hunkData';

test('Hunk render successfully', () => {
  const component = renderer.create(
    <Hunk
      hunk={hunk}
      viewType={'unified'}
      key={'jus for fun'}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
