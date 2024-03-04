<template>
  <div>
    <el-container>
      <AsideView/>
      <el-container>
      <el-header >
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple" style="text-align: left; font-size: 40px">{{tableData.appName}} </div></el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light" style="text-align: right; font-size: 18px">
              {{tableData.name}} 
              <el-button type="danger" icon="el-icon-warning-outline" size="mini" circle @click="logoutUser()"></el-button>
            </div>
          </el-col>
        </el-row>
      </el-header>
      <el-main><router-view/></el-main>
    </el-container>
  </el-container>
  </div>
</template>


<style>
  .el-header {
    background-color: #7cdf84;
    color: #333;
    line-height: 60px;
  }
  
  .el-aside {
    color: #333;
    height: 100vh;
  }

  .el-menu {
    /* height: 100vh; */
    height: 100%;
  }
</style>

<script>
  import AsideView from './AsideView';
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: sessionStorage.getItem("name"),
        // appName: "222",
        appName: localStorage.getItem("appName"),
        // username: localStorage.getItem("username"),
        // address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: item
      }
    },
    components: {
      AsideView
    },
    methods: {
      async logoutUser(){
        console.log("退出登录。。。",ApiConst.user.logout,localStorage.getItem("username"));
        debugger
        var data = await this.$axiosPost(ApiConst.user.logout);
        if(data.code){
          localStorage.clear();
          sessionStorage.clear();
          Message.success("退出成功！");
          this.$router.push("/login");
        }
      }
    }
  };
</script>