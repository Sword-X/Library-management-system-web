/**
 * 此文件主要封装 axios 的get、post、delete等方法
 * （后续还可以添加文件的上传、下载、文件的导出等等）
 */

import { axiosInstance as axios } from "./axios"

//get
export function axiosGet(url:any,parameter={}) {
  return axios({  //这里的 axios 就是从 axios.js 中引入的 axiosInstance
    url: url,
    method: 'get',
    params: parameter
  })
}
//post
export function axiosPost(url:any,parameter={username: ''}) {
  // const token = localStorage.getItem("token");
  const token = sessionStorage.getItem("token");
  let username = '';
  if(parameter){
    username = parameter.username;
  }
  // if (url.incudes('login')) {
  //     parameter.username;
  // }
  return axios({
    url: url,
    method:'post' ,
    data: parameter,
    headers: {
      'token': token,
      'Content-Type': "application/json;charset=UTF-8",
      'guest': username != ''?username:''
    }
  })
}
//delete
export function axiosDelete(url:any,parameter={}) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter
  })
}