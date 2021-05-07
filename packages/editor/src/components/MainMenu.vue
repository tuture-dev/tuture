<template>
  <div>
    <a-layout-sider width="100" collapsed>
      <div>logo</div>
      <a-menu
        theme="light"
        mode="inline"
        :selectedKeys="selectedKeys"
        @click="onMenuClick"
      >
        <a-menu-item key="1" title="文集目录">
          <Icon type="icon-switcher"></Icon>
        </a-menu-item>
        <a-menu-item key="2" title="步骤编排">
          <Icon type="icon-profile"></Icon>
        </a-menu-item>
        <a-menu-item key="3" title="文集设置">
          <Icon type="icon-setting"></Icon>
        </a-menu-item>
        <a-menu-item key="4" title="联系我们">
          <Icon type="icon-contacts"></Icon>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
import { mapMutations, mapState } from 'vuex';

import Icon from '@/components/common/Icon.vue';

const mapKeyToDrawerType = {
  '1': 'CollectionCatalogue',
  '3': 'CollectionSetting',
  '4': 'ContactUs',
};

export default defineComponent({
  name: 'MainMenu',
  components: {
    Icon,
  },
  computed: {
    ...mapState('drawer', [
      'visible',
      'childVisible',
      'drawerType',
      'selectedKeys',
    ]),
  },
  methods: {
    ...mapMutations('drawer', [
      'setVisible',
      'setChildVisible',
      'setDrawerType',
      'setSelectedKeys',
    ]),
    onMenuClick({ key }) {
      if (key === '2') {
        this.setVisible(false);
        this.setSelectedKeys([key]);
        this.$router.push({ name: 'Toc' });
        return;
      }

      const drawerType = mapKeyToDrawerType[key];

      if (!this.visible) {
        this.setVisible(true);
        this.setDrawerType(drawerType);
        this.setSelectedKeys([key]);
      } else {
        if (drawerType === this.drawerType) {
          // 重复点击当前已经打开的抽屉
          this.setVisible(false);
          this.setSelectedKeys([]);
        } else {
          this.setDrawerType(drawerType);
          this.setSelectedKeys([key]);
        }
      }

      if (this.childVisible) {
        this.setChildVisible(false);
      }
    },
  },
});
</script>

<style scoped></style>
