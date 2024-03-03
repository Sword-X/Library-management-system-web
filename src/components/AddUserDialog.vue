<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false" :show-close="false">
        <el-form :model="registerUserForm" :rules="registerUserRules" ref="registerUserForm">
        <el-form-item label="用户名：" :label-width="formLabelWidth" prop="username">
        <el-input v-model="registerUserForm.username" placeholder="请输入用户名" :disabled="usernameInput"></el-input>
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
        <el-form-item label="地址：" :label-width="formLabelWidth" prop="address">
        <el-input type="name" v-model="registerUserForm.address" placeholder="请输入地址"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="registerUser('registerUserForm')">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
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
        registerUserForm: {},
        title: "用户新增",
        usernameInput: false,
        formLabelWidth: '100px'
      }
    },
    methods: {
      cancelForm(){
        this.dialogFormVisible = false;
        this.registerUserForm = {};
      },
        handleOpen() {
            this.dialogFormVisible = true; // 打开对话框时设置为true
        },
        handleClose() {
            this.dialogFormVisible = false; // 关闭对话框时设置为false
        },
      registerUser(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.user.save,this.registerUserForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.registerUserForm = {};
              Message.success("操作成功！");
              this.sendMessage2Parent();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      sendMessage2Parent(){
        this.$emit('customEvent',true);
      }
    }
  }

</script>