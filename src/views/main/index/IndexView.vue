<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="14">
          <el-alert
            :closable="false"
            center
            :title="'系统通知：'+homeData.systemNotice"
            type="warning"
            effect="dark">
          </el-alert>
    <el-card shadow="hover" style="width: 100%;margin-top: 20px; height: 230px">
      <el-col :span="8">
        <div style="padding: 60px">
          <el-statistic
            group-separator=","
            :value="homeData.yesterdayLoginCount"
            title="昨日登录人次"
          ></el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="padding: 60px">
          <el-statistic title="今日登录人次"
          :value="homeData.todayLoginCount">
          </el-statistic>
        </div>
      </el-col>
      <el-col :span="8">
        <div style="padding: 60px">
          <el-statistic
            group-separator=","
            decimal-separator="."
            :value="(homeData.todayLoginCount-homeData.yesterdayLoginCount)"
            title="增长人次"
          >
          <template slot="prefix">
            <i class="el-icon-s-flag" style="color: red"></i>
          </template>
          <template slot="suffix">
            <i class="el-icon-s-flag" style="color: blue"></i>
          </template>
          </el-statistic>
        </div>
      </el-col>
    </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover" style="width: 100%;">
          <div slot="header" class="clearfix">
            <span>《观书有感》</span><br>
            <span>宋·朱熹</span>
          </div>
          <div style="font-size: 18px;text-align: center; margin-top: 35px;">
            半亩方塘一鉴开
          </div>
          <div style="font-size: 18px;text-align: center;">天光月影共徘徊</div>
          <div style="font-size: 18px;text-align: center;">问渠哪得清如许</div>
          <div style="font-size: 18px;text-align: center;">为有源头活水来</div>
          <div style="margin-top: 35px;"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="14">
        <el-card shadow="hover" style="width: 100%;margin-top: 20px; height: 470px">
        <el-descriptions  title="个人信息" direction="vertical" :column="4" border>
           <template slot="extra">
            <el-button type="primary" size="small" @click="clickEditButt()">修改</el-button>
          </template>
            <el-descriptions-item label="用户名">{{homeData?.user?.username}}</el-descriptions-item>
            <el-descriptions-item label="姓名" :span="2">{{homeData?.user?.name}}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{homeData?.user?.phone}}</el-descriptions-item>
            <el-descriptions-item label="注册时间">
            <el-tag size="small">{{dateFormat(homeData?.user?.createTime)}}</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系地址">{{homeData?.user?.address}}</el-descriptions-item>
        </el-descriptions>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card shadow="hover" style="width: 100%;margin-top: 20px; ">
        <el-table
          :data="homeData.loginHistoryList"
          stripe
          style="width: 100%">
          <el-table-column
            align="center"
            prop="ip"
            label="历史登录ip">
          </el-table-column>
          <el-table-column
            align="center"
            prop="createTime"
            label="历史登录时间">
            <template slot-scope="scope">
              <span>{{dateFormat(scope.row.createTime)}}</span>
            </template>
          </el-table-column>
        </el-table>
        </el-card>
      </el-col>
    </el-row>
      <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false" :show-close="false">
          <el-form :model="registerUserForm" :rules="registerUserRules" ref="registerUserForm">
          <el-form-item label="用户名：" :label-width="formLabelWidth" prop="username">
          <el-input v-model="registerUserForm.username" placeholder="请输入用户名" :disabled="true"></el-input>
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
  </div>
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
        homeData:{},
        // userDialog
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
        title: "用户修改",
        formLabelWidth: '100px'
      };
    },
    mounted(){
      this.getHomeData();
    },
    methods: {
      dateFormat(dateStr){
      if(dateStr){
        return new Date(dateStr).toLocaleString().replaceAll("/","-");
      }else return '';
      },
      registerUser(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.user.save,this.registerUserForm);
            if(data.code){
              this.homeData.user = Object.assign({},this.registerUserForm);
              this.$refs[formName].resetFields();
              this.registerUserForm = {};
              this.dialogFormVisible = false;
              Message.success("操作成功！");
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelForm(){
        this.registerUserForm = {};
        this.dialogFormVisible = false;  
      },
      clickEditButt(){
        this.dialogFormVisible = true;
        this.homeData.user.secondPassword = this.homeData.user.password;
        this.registerUserForm = Object.assign({},this.homeData.user);
        // this.registerUserForm.secondPassword = this.registerUserForm.password;
      },
      async getHomeData(){
        this.loading = true;
        var data = await this.$axiosPost(ApiConst.home.getHomeData);
        console.log('getHomeData',data);
        if(data.code){
          this.homeData = data.data;
          this.loading = false;
        }
      }
    },
  };
</script>

