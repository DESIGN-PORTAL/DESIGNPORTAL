/**
 * 作品管理
 */

const moduleName = 'project';

const { getList, add, edit } = require(`@/services/${moduleName}`);

const mutationSetName = `SET_${moduleName.toUpperCase()}_LIST`;

export default {
  namespaced: true,
  state: () => ({
    list: [],
    total: 0,
    current: null,
    haveNoData: false, // 暂无数据
  }),
  mutations: {
    [mutationSetName](state, data) {
      const { list, total, haveNoData } = data;
      Object.assign(state, {
        list,
        total,
        haveNoData,
      });
    },
  },
  actions: {
    /**
     * 获取列表数据
     * @param {Object} data
     */
    getList({ commit }, data) {
      getList(data)
        .then((res) => {
          console.log('getlist', res);
          const { list, total } = res;
          commit(mutationSetName, {
            list,
            total,
            haveNoData: total === 0,
          });
        })
        .catch((err) => {
          console.log('err', err);
        });
    },
    /**
     * 新增/编辑
     * @param {Object} data
     */
    async save(...args) {
      const data = args[1];
      try {
        if (data.id) {
          await edit(data);
          return { success: true };
        }
        await add(data);
        return { success: true };
      } catch(err) {
        return { success: false, msg: err };
      }
    },
  },
};
