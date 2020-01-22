//配置别名-
var path = require("path");
function resolve(dir) {
  console.log(__dirname);
  return path.join(__dirname, dir);
}

module.exports = {
  //关闭eslint检测
  lintOnSave: false,
  devServer: {
    overlay: {
      warning: false,
      errors: false
    }
  },
  //配置vue别名
  chainWebpack: config => {
    config.resolve.alias
      .set("assets", resolve("src/assets"))
      .set("components", resolve("./src/components"));
  }
};
