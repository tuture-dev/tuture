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
        <a-input v-model="form.category" placeholder="输入文章分类" />
      </a-form-model-item>
      <a-form-model-item label="标签" class="mb-2" prop="tag">
        <a-input v-model="form.tag" placeholder="输入文章标签" />
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
        <a-button class="mr-4">取消</a-button>
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

export default defineComponent({
  name: 'CreateEditArticle',
  data() {
    return {
      form: {
        cover: '',
        title: '',
        category: '',
        tag: '',
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
    };
  },
  methods: {
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.selectedSteps = targetKeys;
    },
    handleSearch(dir, value) {
      console.log('search:', dir, value);
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert('submit!');
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
