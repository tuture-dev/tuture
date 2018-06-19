import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

import Steps, {
  TutureMenu,
  TutureMenuItem,
  TutureSteps,
} from '../Steps';
import { catalogs, catalogsInfo } from './utils/data';

describe('Steps component/dom/events level behave normally', () => {
  // init every test block need use content
  let selectKey = 0;
  const mockUpdateSelect = jest.fn();

  beforeEach(() => {
    selectKey = 0;
  });

  describe('component-level behave normally', () => {
    test('Snapshot of Steps behave normally', () => {
      const component = renderer.create(
        <Steps
          catalogs={catalogs}
          catalogsInfo={catalogsInfo}
          selectKey={selectKey}
          updateSelect={mockUpdateSelect}
        />
      );

      let tree = component.toJSON();
      expect(tree).toMatchSnapshot();
    });
  });

  describe('dom-level behave normally', () => {
    const wrapper = shallow(
      <Steps
        catalogs={catalogs}
        catalogsInfo={catalogsInfo}
        selectKey={selectKey}
        updateSelect={mockUpdateSelect}
      />
    );
    test('should render related TutureMenu/TutureMenuItem/TutureSteps times', () => {
      expect(wrapper.find(TutureMenu)).toHaveLength(1);
      expect(wrapper.find(TutureMenuItem)).toHaveLength(catalogs.length);
      expect(wrapper.find(TutureSteps)).toHaveLength(1);
    });

    test('initial TutureMenuItems should have related classname', () => {
      expect(wrapper.find(TutureMenuItem).first().hasClass('selected')).toBeTruthy();
      expect(wrapper.find(TutureMenuItem).filter('.selected')).toHaveLength(1);
    });
  });

  describe('events-level behave normally', () => {
    const wrapper = shallow(
      <Steps
        catalogs={catalogs}
        catalogsInfo={catalogsInfo}
        selectKey={selectKey}
        updateSelect={mockUpdateSelect}
      />
    );
    test('When related node clicked, it should trigger updateSelect correctlly', () => {
      const needTestNode = wrapper.find(TutureMenuItem).at(2);
      needTestNode.simulate('click');
      expect(mockUpdateSelect.mock.calls.length).toBe(1);
      expect(mockUpdateSelect.mock.calls[0][0]).toBe(2);
    });
  });
})

