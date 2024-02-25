<template>
  <div class="login-container">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px" class="login-form">
      <h1 class="title">图书管理系统</h1>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
       <el-button class="login-button" type="primary" @click="submitForm('ruleForm')">登录</el-button>
       <el-button type="primary" @click="dialogFormVisible = true">注册</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="用户注册" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false">
    <el-form :model="registerUserForm" :rules="registerUserRules" ref="registerUserForm">
        <el-form-item label="用户名：" :label-width="formLabelWidth" prop="username">
        <el-input v-model="registerUserForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码：" :label-width="formLabelWidth" prop="password">
        <el-input type="password" v-model="registerUserForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" :label-width="formLabelWidth" prop="secondPassword">
        <el-input type="password" v-model="registerUserForm.secondPassword" placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
        <el-input type="name" v-model="registerUserForm.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
        <el-input type="name" v-model="registerUserForm.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="registerUser('registerUserForm')">确 定</el-button>
      <el-button @click="dialogFormVisible = false">取 消</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  import router from '@/router';
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
  export default {
    data() {
      var validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.registerUserForm.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      var validatePhone = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入手机号'));
        } else {
          const reg = /^1[3-9]\d{9}$/;
          if(!reg.test(value)){
            callback(new Error('请输入正确的手机号'));
          }
          callback();
        }
      };
      return {
        ruleForm: {
          username: '',
          password: '',
          
        },
        rules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ]
        },
        registerUserRules: {
          username: [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          secondPassword: [
            // { required: true, message: '请再次输入密码', trigger: 'blur' },
            { validator: validatePass2, trigger: 'blur'}
          ],
          name: [
            { required: true, message: '请输入姓名', trigger: 'blur' }
          ],
          phone: [
            // { required: true, message: '请输入手机号', trigger: 'blur' },
            { validator: validatePhone, trigger: 'blur'}
          ]
        },
        dialogFormVisible: false,
        registerUserForm: {
          username: '',
          password: '',
          secondPassword: '',
          name: '',
          phone: ''
        },
        formLabelWidth: '100px'
      }
    },
    methods: {
      submitForm(formName) {
        console.log(formName);
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.user.login,this.ruleForm);
            console.log(data);
            if(data.code){
              Message.success("操作成功！");
              this.$router.push("/main");
            }
            // if(data.status == 200){
            //   this.$router.push("/main");
            // }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      registerUser(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.user.save,this.registerUserForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              Message.success("操作成功！")
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
 
.login-form {
  width: 350px;
  padding: 40px;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
 
.title {
  text-align: center;
  margin-bottom: 20px;
}

 .login-button {
  margin-left: -70px;
  width: 70px;
}
</style>