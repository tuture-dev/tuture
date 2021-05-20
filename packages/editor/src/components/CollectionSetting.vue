<template>
  <div class="px-8">
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="文集封面" class="mb-5" prop="cover">
        <a-button class="flex justify-center items-center">
          <a-icon type="upload" />
          上传封面
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="文集标题" class="mb-5" prop="name">
        <a-input v-model="form.name" placeholder="标题" />
      </a-form-model-item>
      <a-form-model-item label="分类" class="mb-5" prop="categories">
        <a-select
          mode="tags"
          :default-value="form.categories"
          placeholder="请输入分类"
          @change="handleCategoryChange"
        >
          <a-select-option v-for="i in 0" :key="(i + 9).toString(36) + i">
            {{ (i + 9).toString(36) + i }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="标签" class="mb-5" prop="topics">
        <a-select
          mode="tags"
          :default-value="form.topics"
          placeholder="请输入标签"
          @change="handleTopicChange"
        >
          <a-select-option v-for="i in 0" :key="(i + 9).toString(36) + i">
            {{ (i + 9).toString(36) + i }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="文集描述" class="mb-5" prop="description">
        <a-textarea v-model="form.description" :rows="4"></a-textarea>
      </a-form-model-item>
      <a-form-model-item class="mb-5">
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
  name: 'CollectionSetting',
  created() {
    console.log(this.$store.state.collection.meta);
    this.form = this.$store.state.collection.meta;
  },
  data() {
    return {
      form: {
        cover: '',
        name: '',
        description: '',
        id: '',
        created: '',
        topics: [],
        categories: [],
      },
      rules: {
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
      },
    };
  },
  methods: {
    ...mapMutations('drawer', ['setVisible']),
    ...mapMutations('collection', ['setMeta']),
    handleCategoryChange(value) {
      this.form.categories = value;
    },
    handleTopicChange(value) {
      this.form.topics = value;
    },
    onCancel() {
      this.setVisible(false);
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.setMeta(this.form);
          this.setVisible(false);
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
