import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Drawer } from 'antd';

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
    dispatch.drawer.setVisible(false);
  };

  return (
    <Drawer
      title={mapTypeToTitle[drawerType]}
      placement="left"
      width={300}
      visible={visible}
      onClose={handleClose}
      style={{
        marginLeft: '60px',
      }}
    >
      <ChildrenDrawerComponent />
      {RenderComponent}
    </Drawer>
  );
}

export default DrawerComponent;
