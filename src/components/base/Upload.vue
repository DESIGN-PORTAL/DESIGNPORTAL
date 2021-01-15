<template>
  <div class="component-upload" @drop="handleDrop" @dragenter="handleDrageenter" @dragover="handleDragover">
    <input ref="file" type="file" :accept="accept" @change="handleChange" />
    <div class="slot" @click="handleClick">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    /**
     * 可以上传的类型
     */
    accept: {
      type: String,
      default: '',
    },
    /**
     * 转url 传true change事件返回本地url
     */
    toUrl: {
      type: Boolean,
      default: false,
    },
    /**
     * 文件大小限制
     */
    limit: {
      type: Number,
      default: 10,
    },
    /**
     * 文件处理方法
     */
    fileHandler: {
      type: Function,
      default: null,
    },
    /**
     * 上传方法 vuex action
     */
    dispatchName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {};
  },
  computed: {
    fileTypes() {
      return this.accept.split(',');
    },
  },
  methods: {
    handleChange(e) {
      this.handleFile(e.currentTarget.files[0]);
      this.$refs.file.value = '';
    },
    handleDrop(e) {
      e.preventDefault();
      if (!e.dataTransfer.files.length) return;
      this.handleFile(e.dataTransfer.files[0]);
    },
    handleDrageenter(e) {
      e.stopPropagation();
      e.preventDefault();
    },
    handleDragover(e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    },
    async handleFile(file) {
      console.log('file', file);
      const nameSplit = file.name.split('.');
      const fileType = nameSplit[nameSplit.length - 1];

      let fileTypeExist = false;

      for (let type of this.fileTypes) {
        if (type.indexOf(fileType) > -1 || type.indexOf(fileType.toLowerCase()) > -1) fileTypeExist = true;
      }

      if (!fileTypeExist) return this.$message({ type: 'error', message: '不支持的文件类型' });

      // 文件大小限制
      const fileSizeLimit = 1024 * 1024 * this.limit;
      if (file.size > fileSizeLimit) return this.$message({ type: 'error', message: `只能上传${this.limit}M以内的文件!` });

      if (this.dispatchName) return this.upload(file);

      this.$emit('change', this.toUrl ? window.URL.createObjectURL(file) : file);
    },
    /**
     * 上传文件
     */
    upload(file) {
      if (!this.fileHandler) {
        this.$store
          .dispatch(this.dispatchName, file)
          .then((res) => {
            this.$emit('uploaded', res);
          })
          .catch((err) => {
            this.$emit('failed', err);
          });
        return;
      }

      this.fileHandler(file).then((newFile) => {
        this.$store
          .dispatch(this.dispatchName, newFile)
          .then((res) => {
            this.$emit('uploaded', res);
          })
          .catch((err) => {
            this.$emit('failed', err);
          });
      });
    },
    handleClick() {
      this.$refs.file.click();
    },
  },
};
</script>

<style lang="less">
.component-upload {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  width: auto;
  height: auto;
  display: inline-block;
  > input {
    cursor: pointer;
    position: absolute;
    width: 800%;
    height: 800%;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    opacity: 0;
  }
  .slot {
    position: relative;
    z-index: 2;
  }
}
</style>
