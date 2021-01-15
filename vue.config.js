const path = require('path');

module.exports = {
	runtimeCompiler: true,
	devServer: {
		proxy: {
			'/api': {
					target: 'http://127.0.0.1:7001',
					changeOrigin: true,
					pathRewrite: {
							'^/api': '/'
					},
			},
		},
	},
	// less全局变量引用
	pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "./src/assets/css/var.less")],
    },
  },
};
