<template>
  <div>
    <a-layout-sider
      class="h-screen bg-gray-100 shadow-lg"
      width="100"
      collapsed
    >
      <div class="w-full text-center pt-5">
        <img
          class="inline w-6 h-6 m-0 p-0 hover:cursor-pointer"
          alt="Tuture Logo"
          src="../assets/logo.svg"
          @click="onLogoClick"
        />
      </div>
      <a-menu
        class="bg-gray-100 border-none m-auto"
        theme="light"
        mode="inline"
        :selectedKeys="selectedKeys"
        @click="onMenuClick"
      >
        <a-menu-item style="margin-top: 2.5rem" key="1" title="文集目录">
          <Icon type="icon-switcher"></Icon>
        </a-menu-item>
        <a-menu-item style="margin-top: 2.5rem" key="2" title="步骤编排">
          <Icon type="icon-profile"></Icon>
        </a-menu-item>
        <a-menu-item style="margin-top: 2.5rem" key="3" title="文集设置">
          <Icon type="icon-setting"></Icon>
        </a-menu-item>
        <a-menu-item style="margin-top: 2.5rem" key="4" title="联系我们">
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
    onLogoClick() {
      this.setVisible(false);
      this.setChildVisible(false);
      this.$router.push({ name: 'Home' });
    },
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
