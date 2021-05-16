<template>
  <div class="menu">
    <template v-for="(item, index) in items">
      <toolbar-separator
        v-if="item.name === 'separator' && item.visible !== false"
        :key="index"
      ></toolbar-separator>

      <toolbar-button
        v-else-if="item.visible !== false"
        :key="index"
        @click.native="handleClick(item)"
        :active="item.active ? item.active(view.state) : false"
      >
        <custom-tooltip :tooltip="item.tooltip" placement="top">
          <font-awesome-icon
            :icon="item.icon"
            style="color: white;"
          ></font-awesome-icon>
        </custom-tooltip>
      </toolbar-button>
    </template>
  </div>
</template>

<script>
import ToolbarButton from "@/components/ToolbarButton";
import ToolbarSeparator from "@/components/ToolbarSeparator";
import CustomTooltip from "./Tooltip";

export default {
  components: { ToolbarButton, ToolbarSeparator, CustomTooltip },
  props: ["view", "items", "commands"],
  methods: {
    handleClick(item) {
      console.log("item", item, this.commands);
      return item.name && this.commands[item.name](item.attrs);
    },
  },
};
</script>

<style lang="scss" scoped>
.menu {
  display: flex;
}
</style>
