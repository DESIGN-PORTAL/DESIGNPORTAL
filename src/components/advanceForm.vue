<template>
  <div class="component-advance-form">
    <Form @submit="handleSubmit">
      <template v-for="field in fields">
        <FormItem :key="field.key" v-bind="Object.assign({}, itemStyle, field)">
          <component
            :is="typeMap[field.type]"
            :placeholder="field.label"
            v-model="form[field.key]"
            v-bind="field.attrs"
            v-on="field.listeners"
          />
        </FormItem>
      </template>

      <BRow>
        <BCol :span="(itemStyle.labelCol && itemStyle.labelCol.span) || 6"></BCol>
        <BCol :span="(itemStyle.wrapperCol && itemStyle.wrapperCol.span) || 8">
          <BButton htmlType="submit" type="primary">保存</BButton>
          <BButton style="margin-left: 20px" @click="handleReset">重置</BButton>
        </BCol>
      </BRow>
    </Form>
  </div>
</template>

<script>
import Form from './form';
import FormItem from './form/formItem';
import Uploader from './form/uploader';

export default {
  components: {
    Form,
    FormItem,
    Uploader,
  },
  props: {
    payload: {
      type: Object,
      default: () => {},
    },
    /**
     * 字段集合
     */
    fields: {
      type: Array,
      default: () => [],
    },
    /**
     * 表单对象
     */
    form: {
      type: Object,
      default: () => {},
    },
    itemStyle: {
      type: Object,
      default: () => {
        return {};
      },
    },
    /**
     * 数据源
     */
    dataSource: {
      type: Array,
      default: () => [],
    },
    /**
     * vuex action名称
     */
    dispatchName: {
      type: String,
      default: '',
    },
    /**
     * vuex action名称
     */
    dispatchSaveName: {
      type: String,
      default: '',
    },
  },
  computed: {
    typeMap() {
      return {
        select: 'BSelect',
        input: 'BInput',
        checkbox: 'BCheckbox',
        file: 'Uploader',
        textarea: 'BTextarea',
      };
    },
  },
  created() {
    this.id = this.$route.params.id;

    if (this.id !== 'add') {
      this.$store.dispatch(this.dispatchName);
    }
  },
  methods: {
    handleSubmit() {
      let hasFile = false;
      const formData = new FormData();
      for (let item in this.form) {
        if (this.form[item] instanceof File) {
          hasFile = true;
        }
        formData.append(item, this.form[item]);
      }
      this.$store.dispatch(this.dispatchSaveName, hasFile ? formData : this.form).then(res => {
        if (res.success) {
          this.$router.go(-1);
          return this.$message('保存成功');
        }
        this.$message(res.msg);
      });
    },
    handleReset() {
      for (const key in this.form) {
        this.form[key] = '';
      }
    },
  },
};
</script>

<style lang="less">
.component-advance-form {
  background-color: #ffffff;
  padding: 20px;
  min-height: 500px;
}
</style>
