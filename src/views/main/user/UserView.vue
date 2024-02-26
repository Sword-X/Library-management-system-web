<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
       <el-form-item label="审批人">
      <el-input v-model="formInline.user" placeholder="审批人"></el-input>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="formInline.region" placeholder="活动区域">
          <el-option label="区域一" value="shanghai"></el-option>
          <el-option label="区域二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    </div>
    
    <div class="menu-css">
      <el-button type="success" @click="openAddUserDialog">新增</el-button>
      <add-user-dialog ref="addUserDialog" v-model="dialogFormVisible"/>
    </div>

    <!-- 列表显示区域 -->
    <div v-for="item in paginatedList" :key="item.id">
      <!-- 在这里展示你的列表项，比如： -->
      <p>{{ item.name }}</p>
    </div>

    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems">
    </el-pagination>
  </div>
</template>

<script>
import AddUserDialog from "@/components/AddUserDialog.vue";
// import CommonDialog from '@/components/CommonDialog.vue';
export default {
  data() {
    return {
      dialogFormVisible: false,
      currentPage: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      totalItems: 0, // 总条目数
      allList: [], // 原始数据列表
      paginatedList: [], // 分页后的数据列表
        registerUserForm: {
          username: '',
          password: '',
          secondPassword: '',
          name: '',
          phone: ''
        },
        formLabelWidth: '100px',
        formInline: {
          user: '',
          region: ''
        }
    };
  },
  created() {
    // 模拟从服务器获取数据
    this.fetchData();
  },
  methods: {
    openDialog() {
      this.isShow = true;
    },
    openAddUserDialog(){
      console.log(1111);
      this.$refs.addUserDialog.dialogFormVisible = true;
      this.$refs.addUserDialog.title = "新增用户";
    },
    // 从服务器获取数据的函数
    fetchData() {
      // 这里是模拟数据，实际情况应从API接口获取
      this.allList = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        // ... 更多数据
      ];
      this.totalItems = this.allList.length;
      this.updatePaginatedList();
    },
    // 处理每页显示数量变化
    handleSizeChange(val) {
      this.pageSize = val;
      this.updatePaginatedList();
    },
    // 处理页码变化
    handleCurrentChange(val) {
      this.currentPage = val;
      this.updatePaginatedList();
    },
    // 更新分页后的数据列表
    updatePaginatedList() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = this.currentPage * this.pageSize;
      this.paginatedList = this.allList.slice(start, end);
    },
    onSubmit() {
        console.log('submit!');
    }
  },
  components: {
    AddUserDialog,
    // CommonDialog
  },
};
</script>

<style scoped>
  .search-css {
    display: flex; /* 设置display属性为flex */
    align-items: left; /* 水平居中对齐 */
  }
  .menu-css {
    display: flex; /* 设置display属性为flex */
    align-items: left; /* 水平居中对齐 */
  }
  
</style>