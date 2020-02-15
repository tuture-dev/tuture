import { useSelector } from 'react-redux';
import { Drawer } from 'antd';
import { useMediaQuery } from 'react-responsive';

import {
  PAGE_CATAGUE,
  COLLECTION_CATALOGUE,
  COLLECTION_SETTING,
  CONTACT_US,
} from '../utils/constants';

import PageCatalogue from './PageCatalogue';
import CollectionCatalogue from './CollectionCatalogue';
import CollectionSetting from './CollectionSetting';
import ContactUs from './ContactUs';

const mapTypeToTitle = {
  [PAGE_CATAGUE]: '页面目录',
  [COLLECTION_CATALOGUE]: '文集目录',
  [COLLECTION_SETTING]: '文集设置',
  [CONTACT_US]: '联系我们',
};

const mapTypeToComponent = {
  [PAGE_CATAGUE]: <PageCatalogue />,
  [COLLECTION_CATALOGUE]: <CollectionCatalogue />,
  [COLLECTION_SETTING]: <CollectionSetting />,
  [CONTACT_US]: <ContactUs />,
};

function DrawerComponent() {
  const { drawerType, visible } = useSelector((state) => state.drawer);

  const RenderComponent = mapTypeToComponent[drawerType];

  const isLgBreakPoint = useMediaQuery({ query: '(max-width: 992px)' });

  return (
    <Drawer
      title={mapTypeToTitle[drawerType]}
      placement="left"
      width={300}
      mask={false}
      closable={false}
      visible={visible}
      getContainer={false}
      headerStyle={{
        background: '#f7f7fa',
      }}
      drawerStyle={{
        background: '#f7f7fa',
      }}
      style={{
        position: isLgBreakPoint ? 'absolute' : 'static',
        zIndex: isLgBreakPoint ? 1001 : 100,
      }}
    >
      {RenderComponent}
    </Drawer>
  );
}

export default DrawerComponent;
