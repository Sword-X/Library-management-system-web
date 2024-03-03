<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
       <el-form-item label="用户名">
      <el-input v-model="formInline.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
      <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="标题">
      <el-input v-model="formInline.logTitle" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="内容">
      <el-input v-model="formInline.logContent" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="访问路径">
      <el-input v-model="formInline.url" placeholder="请输入访问路径"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" @click="getLogPage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <!-- <div class="log-css">
      <el-button type="success" @click="openAddLogDialog">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-log-dialog @customEvent="handleCustomEvent" ref="addLogDialog" v-model="dialogFormVisible"/>
    </div> -->

    <!-- 列表显示区域 -->
    <div>
      <el-table
    v-loading="loading"
    ref="multipleTable"
    :data="logTableData"
    tooltip-effect="dark"
    style="width: 100%">
    <el-table-column
      prop="username"
      label="用户名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="ip"
      label="ip"
      align="center">
    </el-table-column>
    <el-table-column
      prop="url"
      label="访问路径"
      align="center">
    </el-table-column>
    <el-table-column
      prop="logTitle"
      label="日志标题"
      width="500"
      align="center">
    </el-table-column>
    <el-table-column
      prop="logContent"
      label="日志内容"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="记录时间"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    </el-table>
    </div>

    <!-- 分页组件 -->
    <div class="paginationClass">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </div>
  </div>
</template>

<script>
  import ApiConst from '@/serverApi/api';
export default {
  data() {
    return {
      loading: true,
      logTableData: [],
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        // log: '',
        // phone: '',
        // address: ''
      }
    };
  },
  created() {
    // 模拟从服务器获取数据
    this.fetchData();
  },
  methods: {
      dateFormat(dateStr){
      if(dateStr){
        return new Date(dateStr).toLocaleString().replaceAll("/","-");
      }else return '';
      },
    // 从服务器获取数据的函数
    fetchData() {
      this.getLogPage();
    },
    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.updatePaginatedList();
    },
    // 处理页码变化
    handleCurrentChange(val) {
      this.pageNum = val;
      this.updatePaginatedList();
    },
    // 更新分页后的数据列表
    updatePaginatedList() {
      this.formInline.pageNum = this.pageNum;
      this.formInline.pageSize = this.pageSize;
      this.getLogPage();
    },
    async getLogPage() {
      this.loading = true;
        var data = await this.$axiosPost(ApiConst.log.getPage,this.formInline);
        console.log('getLogPage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.logTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
          this.loading = false;
        }
    }
  }
};
</script>

<style scoped>
  .search-css {
    display: flex; /* 设置display属性为flex */
    align-items: left; /* 水平居中对齐 */
  }
  .log-css {
    display: flex; /* 设置display属性为flex */
    align-items: left; /* 水平居中对齐 */
  }
  /* .paginationClass{
    position: fixed;
    bottom: 0;
    height: 40px;
    width: 100%;
    text-align: center;
  } */
</style>