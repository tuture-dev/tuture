<template>
  <div class="px-8">
    <a-form-model ref="form" :model="form" :rules="rules">
      <a-form-model-item label="封面" class="mb-2" prop="cover">
        <a-button class="flex justify-center items-center">
          <a-icon type="upload" />
          上传封面
        </a-button>
      </a-form-model-item>
      <a-form-model-item label="标题" class="mb-2" prop="name">
        <a-input v-model="form.name" placeholder="标题" />
      </a-form-model-item>
      <a-form-model-item label="分类" class="mb-2" prop="categorie">
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
      <a-form-model-item label="标签" class="mb-2" prop="topics">
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
import { mapState, mapMutations, mapGetters } from 'vuex';

export default defineComponent({
  name: 'CreateEditArticle',
  computed: {
    ...mapState('collection', ['articles']),
    ...mapState('collection', ['editArticleId']),
    ...mapGetters('collection', ['getArticleById']),
    article() {
      return this.getArticleById(this.nowArticleId) || {};
    },
  },
  created() {
    this.childDrawerType = this.$store.state.drawer.childDrawerType;
    this.form =
      this.childDrawerType === 'edit'
        ? this.getArticleById(this.editArticleId)
        : this.form;
  },
  data() {
    return {
      childDrawerType: '',
      form: {
        id: '',
        cover: '',
        name: '',
        categories: [],
        topics: [],
      },
      rules: {
        name: [{ required: true, message: '请输入标题', trigger: 'blur' }],
        // steps: [
        //   { required: true, message: '请合理选择步骤编排', trigger: 'blur' },
        // ],
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
    ...mapMutations('drawer', ['setChildVisible']),
    ...mapMutations('collection', ['addArticle', 'modifyArticle']),
    handleChange(targetKeys, direction, moveKeys) {
      console.log(targetKeys, direction, moveKeys);
      this.selectedSteps = targetKeys;
    },
    handleSearch(dir, value) {
      console.log('search:', dir, value);
    },
    handleCategoryChange(value) {
      this.form.categories = value;
    },
    handleTopicChange(value) {
      this.form.topics = value;
    },
    onCancel() {
      this.setChildVisible(false);
    },
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          alert('submit!');
          this.childDrawerType === 'edit'
            ? this.modifyArticle(this.form)
            : this.addArticle(this.form);
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
