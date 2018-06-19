import React from 'react';
import renderer from 'react-test-renderer';

import UnifiedChange from '../DiffView/UnifiedChange';
import { Change } from '../../types/index';
import { shallow } from 'enzyme';

describe('Steps component/dom/functionality/events level behave normally', () => {
  const change: Change = {
    type: 'insert',
    content: 'I am the coolest one',
    isInsert: true,
    lineNumber: 0,
  };

  describe('component-level behave normally', () => {
    test('UnifiedChange render successfully', () => {
      const component = renderer.create(
        <UnifiedChange
          change={change}
        />
      );
      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('dom-level behave normally', () => {
    const wrapper = shallow(
      <UnifiedChange
        change={change}
      />
    );

    test('should render realted dom node', () => {
      expect(wrapper.find('.diff-line')).toHaveLength(1);
      expect(wrapper.find('.diff-code-insert')).toHaveLength(1);
      expect(wrapper.find('.diff-gutter-insert')).toHaveLength(2);
    });
  });
});
