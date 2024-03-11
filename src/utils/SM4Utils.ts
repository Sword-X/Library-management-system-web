import SM4 from "gm-crypt";
// const SM4 = require('gm-crypt').sm4;

const SECRET_IV = 'hkjfdh13vcvd701b';
const SECRET_KEY = 'gdfkh98fbs621bh1';

const sm4 = new SM4.sm4({
    key: SECRET_KEY, // key值要与后端的一致，后端解密是根据这个key
    mode: 'cbc', // 加密的方式有两种，ecb和cbc两种，也是看后端如何定义的，cbc的话下面还要加一个iv的参数，ecb不用
    iv: SECRET_IV, // iv是cbc模式的第二个参数，也需要跟后端配置的一致 iv是initialization vector的意思，就是加密的初始化矢量，初始化加密函数的变量，也叫初始向量
    cipherType: 'base64',
});


export function encryptData(data:any) {
    if(data){
        // data = CryptoJS.enc.Utf8.parse(data);
        // const encrypted = CryptoJS.AES.encrypt(data,SECRET_KEY,{
        //     iv: SECRET_IV,
        // })
        // return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        return sm4.encrypt(data,SECRET_KEY);
    }
}

export function decryptData(data:any) {
    if(data){
        // data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Base64.parse(data));
        // const decrypted = CryptoJS.AES.decrypt(data,SECRET_KEY,{
        //     iv: SECRET_IV,
        // })
        // return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
        return sm4.decrypt(data,SECRET_KEY);
    }
}

export default {encryptData,decryptData};