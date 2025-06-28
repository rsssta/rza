const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/files': {
        target: 'http://localhost:8055',  // Directus API 的地址
        changeOrigin: true,              // 修改源地址，解决 CORS 问题
        pathRewrite: { '^/files': '/files' },  // 重写路径，保留 /assets 部分
        secure: false,                   // 如果 Directus 使用 HTTP 而不是 HTTPS，设置为 false
      },
    },
  },
})
