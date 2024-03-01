<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
        <el-form-item label="接口路径">
      <el-input v-model="formInline.apiUrl" placeholder="请输入接口路径"></el-input>
      </el-form-item>
       <el-form-item label="接口信息">
      <el-input v-model="formInline.apiInfo" placeholder="请输入接口信息"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getApiPage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <div class="api-css">
      <el-button type="success" @click="openAddApiDialog">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-api-dialog @customEvent="handleCustomEvent" ref="addApiDialog" v-model="dialogFormVisible"/> <!-- @customEvent="handleCustomEvent"监听子组件的自定义事件 -->
    </div>

    <!-- 列表显示区域 -->
    <div>
      <el-table
    v-loading="loading"
    ref="multipleTable"
    :data="apiTableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"
      align="center">
    </el-table-column>
    <el-table-column
      prop="apiUrl"
      label="接口路径"
      align="center">
    </el-table-column>
    <el-table-column
      prop="apiInfo"
      label="接口信息"
      align="center">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作"
      align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
  import { Message } from 'element-ui';
  import AddApiDialog from "@/components/AddApiDialog.vue";
export default {
  data() {
    return {
      loading: true,
      apiTableData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        api: '',
        phone: '',
        address: ''
      }
    };
  },
  created() {
    // 模拟从服务器获取数据
    this.fetchData();
  },
  methods: {
      // 监听子组件传值
      handleCustomEvent(flag){
        console.log('监听用户管理子组件传值',flag)
        if(flag){
          this.getApiPage();
        }
      },
      async deleteByIds(){
        this.$confirm("是否确定删除","提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
            this.multipleSelection.forEach(item => {this.ids.push(item.id)});
          var data = await this.$axiosPost(ApiConst.api.delete,this.ids);
          console.log('getApiPage',data);
          if(data.code){
            Message.success("操作成功！");
            this.fetchData();
          }
        }).catch((item)=>{console.log(item)});
      },
      dateFormat(dateStr){
      if(dateStr){
        return new Date(dateStr).toLocaleString().replaceAll("/","-");
      }else return '';
      },
      async handleEdit(index, row) {
        this.$refs.addApiDialog.dialogFormVisible = true;
        this.$refs.addApiDialog.title = "接口编辑";
        // this.$refs.addApiDialog.apiNameInput = true;
        this.$refs.addApiDialog.addApiForm = Object.assign({},row);
        console.log(index, row);
      },
      async handleDelete(index, row) {
        this.$confirm("是否确定删除","提示",{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          this.ids = [];
          this.ids.push(row.id);
          var data = await this.$axiosPost(ApiConst.api.delete,this.ids);
          console.log('getApiPage',data);
          if(data.code){
            Message.success("操作成功！");
            this.fetchData();
          }
        }).catch((item)=>{console.log(item)});
      },
    handleSelectionChange(val) {
        this.multipleSelection = val;
        console.log(this.multipleSelection);
    },

    openAddApiDialog(){
      this.$refs.addApiDialog.dialogFormVisible = true;
      this.$refs.addApiDialog.title = "新增接口";
    },
    // 从服务器获取数据的函数
    fetchData() {
      this.getApiPage();
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
      this.getApiPage();
    },
    async getApiPage() {
        this.loading = true;
        var data = await this.$axiosPost(ApiConst.api.getPage,this.formInline);
        console.log('getApiPage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.apiTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
          this.loading = false;
        }
    }
  },
  components: {
    AddApiDialog,
  },
};
</script>

<style scoped>
  .search-css {
    display: flex; /* 设置display属性为flex */
    align-items: left; /* 水平居中对齐 */
  }
  .api-css {
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