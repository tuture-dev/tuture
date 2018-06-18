import React from 'react';
import renderer from 'react-test-renderer';

import Steps from '../Steps';
import { catalogs, catalogsInfo } from './utils/data';

test('Test Steps render successfully', () => {
  let selectKey = 0;
  const updateSelect = (key: number) => {
    selectKey = key;
  };

  const component = renderer.create(
    <Steps
      catalogs={catalogs}
      catalogsInfo={catalogsInfo}
      selectKey={selectKey}
      updateSelect={updateSelect}
    />
  );

  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
