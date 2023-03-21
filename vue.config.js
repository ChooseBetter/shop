const {defineConfig} = require("@vue/cli-service");
const path = require("path");

module.exports = defineConfig({
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      // 哪些文件自动引入，使用绝对路径
      patterns: [
        path.join(__dirname, "./src/assets/styles/variables.less"),
        path.join(__dirname, "./src/assets/styles/mixins.less"),
      ],
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule("images")
      .test(/\.(jpg|png|gif)$/)
      .set("parser", {
        dataUrlCondition: {
          maxSize: 10 * 1024,
        },
      });
  },
  devServer: {
    historyApiFallback: true,
    allowedHosts: "all",
  },
  configureWebpack: {
    externals: {
      qc: "QC",
    },
  },
});
