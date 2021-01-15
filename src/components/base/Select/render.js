export default {
  name: 'SelectRender',
  functional: true,
  props: {
    data: Object,
    render: Function,
    index: Number,
  },
  render: (h, ctx) => {
    const params = {
      data: ctx.props.data,
      index: ctx.props.index,
    };

    console.log('render', params);
    return ctx.props.render(h, params);
  },
};
