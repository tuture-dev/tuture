import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import StepList, { TutureMenu, TutureMenuItem, TutureSteps } from '../StepList';
import { commits } from './utils/data';

describe('Steps behave normally on component/dom/events level ', () => {
  // init every test block need use content
  let selectKey = 0;
  const mockUpdateSelect = jest.fn();

  beforeEach(() => {
    selectKey = 0;
  });

  describe('dom-level behave normally', () => {
    const wrapper = shallow(<StepList commits={commits} />);
    test('should render related TutureMenu/TutureMenuItem/TutureSteps times', () => {
      expect(wrapper.find(TutureMenu)).toHaveLength(1);
      expect(wrapper.find(TutureMenuItem)).toHaveLength(commits.length);
      expect(wrapper.find(TutureSteps)).toHaveLength(1);
    });
  });
});
