<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
      <el-form-item label="书名" >
      <el-input style="width: 150px" v-model="formInline.bookName" placeholder="请输入书名"></el-input>
      </el-form-item>
      <el-form-item label="作者" >
      <el-input style="width: 150px" v-model="formInline.author" placeholder="请输入作者"></el-input>
      </el-form-item>
      <el-form-item  label="借阅人" >
      <el-input style="width: 150px" v-model="formInline.userName" placeholder="请输入借阅者姓名"></el-input>
      </el-form-item>
      <el-form-item label="状态" >
      <el-input style="width: 150px" v-model="formInline.status" placeholder="借阅中"></el-input>
      </el-form-item>
      <el-form-item label="分类" >
      <el-input style="width: 150px" v-model="formInline.categoryId" placeholder="请输入分类"></el-input>
      </el-form-item>
      <el-form-item label="标签" >
      <el-input style="width: 150px" v-model="formInline.tag" placeholder="请输入标签"></el-input>
      </el-form-item>
      <el-form-item label="出版社" >
      <el-input style="width: 150px" v-model="formInline.publisher" placeholder="请输入出版社名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getBorrowPage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <!-- <div class="borrow-css">
      <el-button type="success" @click="openAddBorrowDiaborrow">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-borrow-diaborrow @customEvent="handleCustomEvent" ref="addBorrowDiaborrow" v-model="diaborrowFormVisible"/>
    </div> -->

    <!-- 列表显示区域 -->
    <div>
      <el-table
    v-loading="loading"
    ref="multipleTable"
    :data="borrowTableData"
    tooltip-effect="dark"
    style="width: 100%">
    <el-table-column
      prop="bookName"
      label="书名"
      align="center">
    </el-table-column>
    <el-table-column
      prop="author"
      label="作者"
      align="center">
    </el-table-column>
    <el-table-column
      prop="userName"
      label="借阅人"
      align="center">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      align="center">
    </el-table-column>
    <el-table-column
      prop="borrowTime"
      label="借阅时间"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.borrowTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="dueTime"
      label="应还时间"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.dueTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="returnTime"
      label="实际归还时间"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.returnTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作"
      align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="warning"
          :disabled="false"
          @click="handleEdit(scope.$index, scope.row)">还书</el-button>
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
      borrowTableData: [],
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        // borrow: '',
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
      this.getBorrowPage();
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
      this.getBorrowPage();
    },
    async getBorrowPage() {
        this.loading = true;
        var data = await this.$axiosPost(ApiConst.borrow.getPage,this.formInline);
        console.log('getBorrowPage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.borrowTableData = data.data.list;
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
  .borrow-css {
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