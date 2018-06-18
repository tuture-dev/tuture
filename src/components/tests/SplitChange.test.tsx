import React from 'react';
import renderer from 'react-test-renderer';

import SplitChange from '../DiffView/SplitChange';
import { Change } from '../../types/index';

test('SplitChange render successfully', () => {
  const oldChange: Change = {
    type: 'isdelete',
    content: 'I am the coolest one',
    isInsert: true,
    lineNumber: 0,
  };
  const newChange: Change = {
    type: 'isinsert',
    content: 'Come and play it',
    isInsert: true,
    lineNumber: 1,
  };
  const component = renderer.create(
    <SplitChange
      oldChange={oldChange}
      newChange={newChange}
      key={'test'}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
