<template>
  <portal>
    <div
      :class="{ 'transform-active': active && position.visible }"
      class="inner-wrapper"
      ref="innerWrapper"
      :style="{
        top: `${position.top}px`,
        left: `${position.left}px`,
        '--offset': `${offset}px`,
      }"
    >
      <slot v-if="position.visible"></slot>
    </div>
  </portal>
</template>

<script>
import { ResizeObserver } from '@juggle/resize-observer';
import { Portal } from '@linusborg/vue-simple-portal';

const defaultPosition = {
  left: -1000,
  top: 0,
  offset: 0,
  visible: false,
};

export default {
  props: {
    view: Object,
    active: {
      type: Boolean,
      default: false,
    },
    offset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      size: {
        width: 0,
        height: 0,
      },
      isSelectingText: false,
    };
  },
  components: {
    Portal,
  },
  computed: {
    position() {
      const { selection } = this.view.state;
      const { width: menuWidth, height: menuHeight } = this.size;

      if (!this.active || !menuWidth || !menuHeight || this.isSelectingText) {
        return defaultPosition;
      }

      // based on the start and end of the selection calculate the position at
      // the center top
      const fromPos = this.view.coordsAtPos(selection.$from.pos);
      const toPos = this.view.coordsAtPos(selection.$to.pos);

      // ensure that start < end for the menu to be positioned correctly
      const selectionBounds = {
        top: Math.min(fromPos.top, toPos.top),
        bottom: Math.max(fromPos.bottom, toPos.bottom),
        left: Math.min(fromPos.left, toPos.left),
        right: Math.max(fromPos.right, toPos.right),
      };

      // tables are an oddity, and need their own positioning logic
      const isColSelection =
        selection.isColSelection && selection.isColSelection();
      const isRowSelection =
        selection.isRowSelection && selection.isRowSelection();

      if (isColSelection) {
        const { node: element } = this.view.domAtPos(selection.$from.pos);
        const { width } = element.getBoundingClientRect();
        selectionBounds.top -= 20;
        selectionBounds.right = selectionBounds.left + width;
      }

      if (isRowSelection) {
        selectionBounds.right = selectionBounds.left =
          selectionBounds.left - 18;
      }

      // calcluate the horizontal center of the selection
      const halfSelection =
        Math.abs(selectionBounds.right - selectionBounds.left) / 2;
      const centerOfSelection = selectionBounds.left + halfSelection;

      // position the menu so that it is centered over the selection except in
      // the cases where it would extend off the edge of the screen. In these
      // instances leave a margin
      const margin = 12;
      const left = Math.min(
        window.innerWidth - menuWidth - margin,
        Math.max(margin, centerOfSelection - menuWidth / 2),
      );
      const top = Math.min(
        window.innerHeight - menuHeight - margin,
        Math.max(margin, selectionBounds.top - menuHeight),
      );

      // if the menu has been offset to not extend offscreen then we should adjust
      // the position of the triangle underneath to correctly point to the center
      // of the selection still
      const offset = left - (centerOfSelection - menuWidth / 2);
      return {
        left: Math.round(left + window.scrollX),
        top: Math.round(top + window.scrollY),
        offset: Math.round(offset),
        visible: true,
      };
    },
    resizeObj() {
      return new ResizeObserver((entries) => {
        entries.forEach(({ target }) => {
          if (
            this.size.width !== target.clientWidth ||
            this.size.height !== target.clientHeight
          ) {
            this.size = {
              width: target.clientWidth,
              height: target.clientHeight,
            };
          }
        });
      });
    },
  },
  methods: {
    handleMouseDown() {
      if (!this.active) {
        this.isSelectingText = true;
      }
    },
    handleMouseUp() {
      this.isSelectingText = false;
    },
  },
  mounted() {
    // 注册 mousedown/mouseup
    window.addEventListener('mousedown', this.handleMouseDown);
    window.addEventListener('mouseup', this.handleMouseUp);
  },
  updated() {
    this.resizeObj.observe(this.$refs.innerWrapper);
  },
  beforeDestroy() {
    // 销毁 ResizeObserver
    this.resizeObj.disconnect();

    // 销毁注册的鼠标事件
    window.removeEventListener('mousedown', this.handleMouseDown);
    window.removeEventListener('mouseup', this.handleMouseUp);
  },
};
</script>

<style lang="scss" scoped>
.inner-wrapper {
  will-change: opacity, transform;
  padding: 8px 16px;
  position: absolute;
  z-index: 200;
  opacity: 0;
  background-color: #2f3336;
  border-radius: 4px;
  transform: scale(0.95);
  transition: opacity 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275),
    transform 150ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transition-delay: 150ms;
  line-height: 0;
  height: 40px;
  box-sizing: border-box;
  pointer-events: none;
  white-space: nowrap;

  &::before {
    content: '';
    display: block;
    width: 24px;
    height: 24px;
    transform: translateX(-50%) rotate(45deg);
    background: #2f3336;
    border-radius: 3px;
    z-index: -1;
    position: absolute;
    bottom: -2px;
    left: calc(50% - var(--offset));
  }

  * {
    box-sizing: border-box;
  }

  @media print {
    display: none;
  }
}

.inner-wrapper.transform-active {
  transform: translateY(-6px) scale(1);
  pointer-events: all;
  opacity: 1;
}
</style>
