/**
 * 此文件主要创建 axios 实例，然后添加请求拦截器和响应拦截器
 */
import axios from 'axios'
import { Message } from 'element-ui';
import Router from '@/router/index'
import SM4Utils from '@/utils/SM4Utils';

//请求的服务器的地址
//  const basePath = 'http://localhost:8080'; 
//  const basePath = '/api'; 


// //创建 axios 实例 开发环境
const axiosInstance = axios.create({
  // baseURL: basePath,
  withCredentials: true,  //是否允许跨域
  timeout: 9000
});

//创建 axios 实例部署环境
// const axiosInstance = axios.create({
//   baseURL: basePath,
//   withCredentials: true,  //是否允许跨域
//   timeout: 9000
// });

//添加请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么（可以在这里给头部添加token）
    // console.log("axios请求拦截器的config：",config);
    // if(sessionStorage.getItem("token")){
    //   config.headers.access_token = sessionStorage.getItem("token")
    // }
    const timestamp = new Date().getTime();
    config.headers.timestamp = timestamp;
    console.log("请求拦截器加密前-----------------",config)
    // const value = {'value': SM4Utils.encryptData(JSON.stringify(config.data))}
    // config.data = value;
    config.data = SM4Utils.encryptData(timestamp+"---"+JSON.stringify(config.data));
    console.log("请求拦截器加密后-----------------",config)
    console.log("解密：",SM4Utils.decryptData(config.data));
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log(error)
    return Promise.reject(error);
  }
);
//添加响应拦截器
axiosInstance.interceptors.response.use(
  response => {
    console.log("axios响应拦截器的数据：",response);
    console.log("响应解密：",SM4Utils.decryptData(response.data))
    /**
     * 对响应数据判断:
     *  如果成功返回数据，就通过return把数据返出去
     *  如果请求不成功，就在拦截器这里统一处理（组件的代码就不用关注错误的情况了）
     */
    if(response.status==200){
      response.data = JSON.parse(SM4Utils.decryptData(response.data));
      if(response.data.code == 200){
        return response.data;
      }else {
        handleErrorData(response.data);
      }
      
      // return response;
      // return 123;
    }else{
      console.log("22222222222222");
      handleErrorData(response.data);
    }
    return response;
  },
  error => {
    // 对响应错误做点什么
    // console.log("axios响应拦截器的错误数据：",error);
    // Message.error(error.message);
    console.log("333333333333333")
    debugger
    // return Promise.reject(error);
    if(error.response){
      if(error.request.status == 666){
          Message.error("操作越权");
          localStorage.clear();
          sessionStorage.clear();
          Router.push("/login");
          return {"code": null};
      }
      handleErrorData(error.response.data);
      return error.response;
    }else{
      Message.error("网络出了点小差，请稍后再试。。。");
      return {"code": null};
    }
    
  }
);
//对错误信息的处理函数
function handleErrorData(errMes:any){
  if(errMes.message){
    Message.error(errMes.message);
  }else{
    switch(errMes.status){
      case 401 :
        Message.error("未授权，请重新登录!");
        break;
      case 403 :
        Message.error("拒绝访问");
        break;
      case 404 :
        Message.error("很抱歉，资源未找到!");
        break;
      case 500 :
        Message.error("服务器错误!");
        break;
      case 504 :
        Message.error("网络超时!");
        break;
      case 666 :
        Message.error("网络超时!");
        break;
      default :
        Message.error("服务正在联调中，请稍后!");
        break;
    }
  }
}

export {axiosInstance}