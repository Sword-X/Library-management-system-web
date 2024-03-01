<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
       <el-form-item label="分类名称">
      <el-input v-model="formInline.name" placeholder="请输入分类名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBookCategoryPage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <div class="bookCategory-css">
      <el-button type="success" @click="openAddBookCategoryDialog">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-bookCategory-dialog @customEvent="handleCustomEvent" ref="addBookCategoryDialog" v-model="dialogFormVisible"/> <!-- @customEvent="handleCustomEvent"监听子组件的自定义事件 -->
    </div>

    <!-- 列表显示区域 -->
    <div>
      <el-table
    v-loading="loading"
    ref="multipleTable"
    :data="bookCategoryTableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"
      align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="分类名称"
      align="center">
    </el-table-column>
    <el-table-column
      prop="description"
      label="描述信息"
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
  import AddBookCategoryDialog from "@/components/AddBookCategoryDialog.vue";
export default {
  data() {
    return {
      loading: true,
      bookCategoryTableData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        bookCategory: '',
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
    // 监听switch滑块组件
    async handleSwitchChange(val1,val2){
      console.log(val1,val2);
      val1.status = val2;
      var data = await this.$axiosPost(ApiConst.bookCategory.save,val1);
          if(data.code){
            Message.success("操作成功！");
          }
    },
      // 监听子组件传值
      handleCustomEvent(flag){
        console.log('监听用户管理子组件传值',flag)
        if(flag){
          this.getBookCategoryPage();
        }
      },
      async deleteByIds(){
        this.$confirm("是否确定删除","提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
            this.multipleSelection.forEach(item => {this.ids.push(item.id)});
          var data = await this.$axiosPost(ApiConst.bookCategory.delete,this.ids);
          console.log('getBookCategoryPage',data);
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
        this.$refs.addBookCategoryDialog.dialogFormVisible = true;
        this.$refs.addBookCategoryDialog.title = "分类编辑";
        // this.$refs.addBookCategoryDialog.bookCategoryNameInput = true;
        this.$refs.addBookCategoryDialog.addBookCategoryForm = Object.assign({},row);
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
          var data = await this.$axiosPost(ApiConst.bookCategory.delete,this.ids);
          console.log('getBookCategoryPage',data);
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

    openAddBookCategoryDialog(){
      this.$refs.addBookCategoryDialog.dialogFormVisible = true;
      this.$refs.addBookCategoryDialog.title = "分类新增";
    },
    // 从服务器获取数据的函数
    fetchData() {
      this.getBookCategoryPage();
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
      this.getBookCategoryPage();
    },
    async getBookCategoryPage() {
      this.loading = true;
        var data = await this.$axiosPost(ApiConst.bookCategory.getPage,this.formInline);
        console.log('getBookCategoryPage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.bookCategoryTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
          this.loading = false;
        }
    }
  },
  components: {
    AddBookCategoryDialog,
  },
};
</script>

<style scoped>
  .search-css {
    display: flex; /* 设置display属性为flex */
    align-items: left; /* 水平居中对齐 */
  }
  .bookCategory-css {
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