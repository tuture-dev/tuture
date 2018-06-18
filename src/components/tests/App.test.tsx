import React from 'react';
import renderer from 'react-test-renderer';

import App from '../App';

test('Test App render successfully', () => {
  const component = renderer.create(
    <App />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
