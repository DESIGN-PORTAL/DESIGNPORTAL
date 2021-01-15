<template>
  <div class="row">
    <slot></slot>
  </div>
</template>

<style lang="less" scoped>
.row:before,
.row:after {
  content: '';
  display: block;
  height: 0;
  width: 0;
  visibility: hidden;
  clear: both;
}
</style>
