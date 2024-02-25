<template>
  <div>
    <el-container>
      <AsideView/>
      <el-container>
      <el-header >
        <el-row>
          <el-col :span="12"><div class="grid-content bg-purple" style="text-align: left; font-size: 40px">图书管理系统</div></el-col>
          <el-col :span="12"><div class="grid-content bg-purple-light" style="text-align: right; font-size: 12px">王小虎</div></el-col>
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

  export default {
    data() {
      const item = {
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      };
      return {
        tableData: Array(20).fill(item)
      }
    },
    components: {
      AsideView
    }
  };
</script>