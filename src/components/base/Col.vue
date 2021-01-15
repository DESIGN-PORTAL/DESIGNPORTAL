<template>
  <div class="col" :class="`col_${span}`">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    span: {
      type: [Number, String],
      default: 24,
    },
  },
};
</script>

<style lang="less">
.col {
  float: left;
  min-height: 1px;
  width: 8.33%;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}
.col_1 {
  width: 4.166666667%;
}
.col_2 {
  width: 8.333333334%;
}
.col_3 {
  width: 12.500000001%;
}
.col_4 {
  width: 16.666666668%;
}
.col_5 {
  width: 20.833333335000003%;
}
.col_6 {
  width: 25.000000002%;
}
.col_7 {
  width: 29.166666669%;
}
.col_8 {
  width: 33.333333336%;
}
.col_9 {
  width: 37.500000003000004%;
}
.col_10 {
  width: 41.666666670000005%;
}
.col_11 {
  width: 45.833333337000006%;
}
.col_12 {
  width: 50.000000004%;
}
.col_13 {
  width: 54.166666671%;
}
.col_14 {
  width: 58.333333338%;
}
.col_15 {
  width: 62.500000005000004%;
}
.col_16 {
  width: 66.666666672%;
}
.col_17 {
  width: 70.833333339%;
}
.col_18 {
  width: 75.00000000600001%;
}
.col_19 {
  width: 79.16666667300001%;
}
.col_20 {
  width: 83.33333334000001%;
}
.col_21 {
  width: 87.50000000700001%;
}
.col_22 {
  width: 91.66666667400001%;
}
.col_23 {
  width: 95.83333334100001%;
}
.col_24 {
  width: 100.000000008%;
}
</style>
