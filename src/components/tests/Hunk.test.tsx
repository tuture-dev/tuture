import React from 'react';
import renderer from 'react-test-renderer';

import Hunk from '../DiffView/Hunk';
import { hunk } from './utils/hunData';

test('Test Hunk render successfully', () => {
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
