import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer, Affix } from 'antd';

import {
  COLLECTION_CATALOGUE,
  COLLECTION_SETTING,
  CONTACT_US,
} from '../utils/constants';

import ChildrenDrawerComponent from './ChildrenDrawerComponent';
import CollectionCatalogue from './CollectionCatalogue';
import CollectionSetting from './CollectionSetting';
import ContactUs from './ContactUs';

const mapTypeToTitle = {
  [COLLECTION_CATALOGUE]: '文集目录',
  [COLLECTION_SETTING]: '文集设置',
  [CONTACT_US]: '联系我们',
};

const mapTypeToComponent = {
  [COLLECTION_CATALOGUE]: <CollectionCatalogue />,
  [COLLECTION_SETTING]: <CollectionSetting />,
  [CONTACT_US]: <ContactUs />,
};

function DrawerComponent() {
  const dispatch = useDispatch();
  const { drawerType, visible } = useSelector((state) => state.drawer);

  const RenderComponent = mapTypeToComponent[drawerType];

  const handleClose = () => {
    dispatch({ type: 'drawer/setVisible', payload: false });
    dispatch({ type: 'drawer/setSelectedKeys', payload: [] });
  };

  return (
    <Drawer
      id="drawer"
      title={mapTypeToTitle[drawerType]}
      placement="left"
      width={300}
      visible={visible}
      onClose={handleClose}
      headerStyle={{
        background: '#F7F7FA',
      }}
      drawerStyle={{
        background: '#F7F7FA',
      }}
      zIndex={1005}
      style={{ marginLeft: '80px' }}
    >
      <Affix>
        <ChildrenDrawerComponent />
      </Affix>
      {RenderComponent}
    </Drawer>
  );
}

export default DrawerComponent;
