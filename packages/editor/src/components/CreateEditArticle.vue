<template>
  <div class="px-8">
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="封面" class="mb-2" prop="cover">
        <a-button class="flex justify-center items-center">
          <a-icon type="upload" />
          上传封面
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="标题" class="mb-2" prop="title">
        <a-input v-model="form.title" placeholder="标题" />
      </a-form-model-item>
      <a-form-model-item label="分类" class="mb-2" prop="category">
        <a-tag
          v-for="(item, index) in form.category"
          :key="item"
          :color="color[index % 7]"
          closable
          @close="handleCloseTag('category', item)"
        >
          {{ item }}
        </a-tag>
        <a-input
          v-if="inputVisible.category"
          ref="category"
          type="text"
          size="small"
          :style="{ width: '78px' }"
          :value="inputValue.category"
          @change="(e) => handleInputChange('category', e)"
          @keyup.enter="handleInputConfirm('category')"
        />
        <a-tag
          v-else
          style="background: #fff; borderStyle: dashed;"
          @click="showInput('category')"
        >
          <a-icon type="plus" /> 请输入分类
        </a-tag>
      </a-form-model-item>
      <a-form-model-item label="标签" class="mb-2" prop="tag">
        <a-tag
          v-for="(item, index) in form.tag"
          :key="item"
          :color="color[index % 7]"
          closable
          @close="() => handleCloseTag('tag', item)"
        >
          {{ item }}
        </a-tag>
        <a-input
          v-if="inputVisible.tag"
          ref="tag"
          type="text"
          size="small"
          :style="{ width: '78px' }"
          :value="inputValue.tag"
          @change="(e) => handleInputChange('tag', e)"
          @keyup.enter="handleInputConfirm('tag')"
        />
        <a-tag
          v-else
          style="background: #fff; borderStyle: dashed;"
          @click="showInput('tag')"
        >
          <a-icon type="plus" /> 请输入标签
        </a-tag>
      </a-form-model-item>
      <a-form-model-item label="选择步骤" class="mb-2" prop="steps">
        <a-transfer
          :data-source="steps"
          :operations="['选择', '释放']"
          :titles="['所有步骤', '已选步骤']"
          :list-style="{
            width: '310px',
            height: '280px',
          }"
          show-search
          :target-keys="selectedSteps"
          :render="(item) => item.title"
          @change="handleChange"
          @search="handleSearch"
        />
      </a-form-model-item>
      <a-form-model-item class="mb-2">
        <a-button class="mr-4" @click="onCancel">取消</a-button>
        <a-button
          class="bg-green-500 border-green-500 text-white"
          type="primary"
          @click="onSubmit"
          >确认</a-button
        >
      </a-form-model-item>
    </a-form-model>
  </div>
</template>

<script setup>
import { defineComponent } from 'vue-demi';
import { mapMutations } from 'vuex';

export default defineComponent({
  name: 'CreateEditArticle',
  data() {
    return {
      inputVisible: {
        category: false,
        tag: false,
      },
      inputValue: {
        category: '',
        tag: '',
      },
      form: {
        cover: '',
        title: '',
        category: ['前端', 'React', '进阶'],
        tag: ['Jest', 'React', 'Enzyme'],
        steps: {},
      },
      rules: {
        title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        steps: [
          { required: true, message: '请合理选择步骤编排', trigger: 'blur' },
        ],
      },
      steps: [
        {
          key: '0',
          title: '初识jest单元数据',
        },
        {
          key: '1',
          title: '初识Enzyme：编写第一个react组件',
        },
        {
          key: '2',
          title: '测试更复杂的组件',
        },
        {
          key: '3',
          title: '测试组件的Props',
        },
      ],
      selectedSteps: [],
      color: ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'],
    };
  },
  methods: {
    ...mapMutations('drawer', ['setChildVisible']),
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.selectedSteps = targetKeys;
    },
    handleSearch(dir, value) {
      console.log('search:', dir, value);
    },
    handleCloseTag(tag, removedTag) {
      console.log(removedTag);
      this.form[tag] = this.form[tag].filter((tag) => tag !== removedTag);
      console.log(this.form[tag]);
    },
    handleInputChange(tag, e) {
      this.inputValue[tag] = e.target.value;
    },
    showInput(tag) {
      this.inputVisible[tag] = true;
      this.$nextTick(function() {
        this.$refs[tag].focus();
      });
    },
    handleInputConfirm(tag) {
      const inputValue = this.inputValue[tag];
      if (inputValue && this.form[tag].indexOf(inputValue) === -1) {
        this.form[tag] = [...this.form[tag], inputValue];
      }
      this.inputValue[tag] = '';
      this.inputVisible[tag] = false;
    },
    onCancel() {
      this.setChildVisible(false);
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert('submit!');
          this.setChildVisible(false);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
  },
});
</script>

<style scoped></style>
