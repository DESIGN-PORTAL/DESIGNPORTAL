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

const moduleName = 'music';


// 格式化时间
function SecondToDate(msd) {
  let time = msd
  if (null != time && '' != time) {
    return `${Math.floor(time / 60)}分${time % 60}秒`;
  }
  return time
}

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
          label: '音乐文件',
          require: true,
          attrs: {
            accept: '.mp3',
          },
          listeners: {
            change: this.handleFileChange,
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
        duration: 0,
      },
    };
  },
  computed: {
    ...mapState({
      current: state => state[moduleName].current,
    }),
  },
  methods: {
    // 音乐时间
    handleFileChange(file) {
      console.log('listeners', file)

      if (!this.form.name) {
        this.form.name = file.name;
      }
      //获取录音时长
      const url = URL.createObjectURL(file);
      //经测试，发现audio也可获取视频的时长
      const audioElement = new Audio(url);
      this.form.duration = '444'
      audioElement.addEventListener('loadedmetadata', () => {
        this.form.duration = SecondToDate(+(audioElement.duration).toFixed(0));
      })
    },
  },
}
</script>