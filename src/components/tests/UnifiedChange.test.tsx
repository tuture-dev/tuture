import React from 'react';
import renderer from 'react-test-renderer';

import UnifiedChange from '../DiffView/UnifiedChange';
import { Change } from '../../types/index';

test('Test UnifiedChange render successfully', () => {
  const change: Change = {
    type: 'insert',
    content: 'I am the coolest one',
    isInsert: true,
    lineNumber: 0,
  };
  const component = renderer.create(
    <UnifiedChange
      change={change}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
