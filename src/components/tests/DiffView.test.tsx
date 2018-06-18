import React from 'react';
import renderer from 'react-test-renderer';

import DiffView from '../DiffView/index';
import { hunk } from './utils/hunData';
import { Hunk } from '../../types/index';

test('Test DiffView render successfully', () => {
  let hunks: Hunk[]  = [];
  Array(10).map(item => hunks.push(hunk));

  const component = renderer.create(
    <DiffView
      hunks={hunks}
      viewType={'unified'}
      key={'jus for fun'}
    />
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
