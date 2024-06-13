const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: "/dist/",
  transpileDependencies: true,
  devServer:{
    port: 8081,
    open: true,
    proxy: {  
      '/api': {
        target: `http://localhost:8080`, //路径指向本地主机地址及端口号。这里别忘了加http
        ws: true, 
        changeOrigin: true,
        pathRewrite:{
            '^/api': '' //路径转发代理。这里意味着用"/api"来代替"/json"
        }
      }
    }
  }
})
