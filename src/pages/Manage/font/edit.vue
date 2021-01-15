<template>
  <div>
    <AdvanceForm
      :itemStyle="{
        labelCol: { span: 6 },
        wrapperCol: { span: 6 },
      }"
      :fields="fields"
      :form="form"
      :dataSource="current"
      :dispatchName="`${moduleName}/get`"
      :dispatchSaveName="`${moduleName}/save`"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AdvanceForm from '@/components/advanceForm';

const moduleName = 'font';

export default {
  components: {
    AdvanceForm,
  },
  data() {
    return {
      moduleName,
      fields: [
        {
          key: 'name',
          type: 'input',
          label: '名称',
          require: true,
        },
        {
          key: 'file',
          type: 'file',
          label: '字体文件',
          require: true,
          attrs: {
            accept: '.ttf,.otf,.ttc',
          },
        },
        {
          key: 'createUser',
          type: 'input',
          label: '创建人',
        },
        {
          key: 'remark',
          type: 'textarea',
          label: '备注',
        },
      ],
      form: {
        name: '',
        file: '',
        createUser: '',
        remark: '',
      },
    };
  },
  computed: {
    ...mapState({
      current: (state) => state[moduleName].current,
    }),
  },
};
</script>
