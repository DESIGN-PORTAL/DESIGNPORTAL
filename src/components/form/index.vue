<template>
  <form ref="form" @submit="handleSubmit">
    <slot />
  </form>
</template>

<script>
export default {
  // props: {
  //   ruler: {
  //     type: Array,
  //     default: () => [],
  //   },
  // },
  methods: {
    handleSubmit(e) {
      e.preventDefault();

      let validPass = true;
      this.$slots.default.forEach((slot) => {
        if (slot.componentOptions.tag === 'FormItem') {
          if (!slot.componentInstance.validate()) {
            validPass = false;
          }
        }
      });
      // console.log('submit', this.$slots)

      if (validPass) this.$emit('submit');
    },
  },
};
</script>
