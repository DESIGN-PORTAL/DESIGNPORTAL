export default {
  methods: {
    handleEdit(id) {
      this.$router.push(`${this.moduleName}/${id}`);
    },
    formatTime(dateTime, format = 'yyyy-MM-dd hh:mm:ss') {
      if (!dateTime) return;
      if (typeof dateTime === 'string') {
        dateTime = new Date(dateTime).getTime();
      } else {
        dateTime = new Date(dateTime).getTime();
      }
      let re = /-?\d+/;
      let m = re.exec(dateTime);
      let d = new Date(parseInt(m[0]));
      let o = {
        'M+': d.getMonth() + 1,
        'd+': d.getDate(),
        'h+': d.getHours(),
        'm+': d.getMinutes(),
        's+': d.getSeconds(),
        'q+': Math.floor((d.getMonth() + 3) / 3),
        S: d.getMilliseconds(),
      };
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (d.getFullYear() + '').substr(4 - RegExp.$1.length));
      }
      for (let k in o) {
        if (new RegExp('(' + k + ')').test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
        }
      }
      return format;
    },
  },
};
