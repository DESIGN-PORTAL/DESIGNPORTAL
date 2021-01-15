<template>
  <div class="uploader-wrapper">
    <BUpload v-show="!value" v-bind="$attrs" v-on="$listeners" @change="handleChange">
      <BButton>
        选择文件
      </BButton>
    </BUpload>

    <div class="files" v-if="value">
      <div class="file">
        <span>{{ value.name }}</span>
        <span class="btn-remove" title="移除" @click="handleRemove"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [File, String],
      default: () => {},
    },
  },
  methods: {
    handleChange(e) {
      this.$emit('input', e);
      this.$emit('change', e);
    },
    handleRemove() {
      this.$emit('input', null);
    },
  },
};
</script>

<style lang="less">
.uploader-wrapper {
  position: relative;
  display: flex;
  .files {
    height: 36px;
    display: flex;
    align-items: center;
    .file {
      position: relative;
      .btn-remove {
        position: absolute;
        right: -30px;
        top: 50%;
        width: 18px;
        height: 18px;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 50%;
        cursor: pointer;
        transform: translateY(-50%) rotate(45deg);
        transition: background-color 0.2s ease-in-out;
        &::after, &::before {
          content: '';
          display: block;
          width: 1px;
          height: 1px;
          background-color: #ffffff;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        &::before {
          width: 60%;
        }

        &::after {
          height: 60%;
        }

        &:hover {
          background-color: @color-main;
        }
      }
    }
  }
}
</style>
