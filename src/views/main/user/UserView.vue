<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
       <el-form-item label="姓名">
      <el-input v-model="formInline.name" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
      <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="地址">
      <el-input v-model="formInline.address" placeholder="请输入地址"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getUserPage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <div class="menu-css">
      <el-button type="success" @click="openAddUserDialog">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-user-dialog @customEvent="handleCustomEvent" ref="addUserDialog" v-model="dialogFormVisible"/> <!-- @customEvent="handleCustomEvent"监听子组件的自定义事件 -->
    </div>

    <!-- 列表显示区域 -->
    <div>
      <el-table
    v-loading="loading"
    ref="multipleTable"
    :data="userTableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"
      align="center">
    </el-table-column>
    <el-table-column
      prop="username"
      label="用户名"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="lastLoginTime"
      label="上次登陆时间"
      width="240"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.lastLoginTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip
      align="center">
    </el-table-column>
        <el-table-column label="权限配置" align="center">
      <template slot-scope="scope">
        <el-button
        type="primary" plain round
          size="mini"
          @click="assignRole(scope.$index, scope.row)">分配角色</el-button>
      </template>
      </el-table-column>
    <el-table-column label="操作" width="150"
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
    <el-dialog title="分配角色" :visible.sync="assignRoleDialogVisible" width="30%" center :close-on-click-modal="false" :show-close="false">
      <el-tree
        ref="tree"
        :data="roleData"
        :show-checkbox=true
        node-key="id"
        :default-checked-keys="checkedRoleIds"
        :props="defaultProps">
      </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveAssignRole">确 认</el-button>
      <el-button @click="cancelAssignRole">取 消</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
  import AddUserDialog from "@/components/AddUserDialog.vue";
export default {
  data() {
    return {
      checkedRoleIds: [],
      loading: true,
      roleData: [{
      id: 1,
      label: ''}],
      defaultProps: {
        label: 'roleName'
      },
      row:{},
      assignRoleDialogVisible: false,
      // -------分隔符-------
      userTableData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        user: '',
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
    // 取消分配角色
    cancelAssignRole(){
      this.roleData = [];
      this.checkedRoleIds = [];
      this.row = {};
      this.assignRoleDialogVisible = false;
    },
    // 分配角色保存
    async saveAssignRole(){
      console.log(this.$refs.tree.getCheckedKeys());
      this.checkedRoleIds = this.$refs.tree.getCheckedKeys();
      // if(this.checkedRoleIds && this.checkedRoleIds.length > 0){
        if(this.checkedRoleIds && this.checkedRoleIds.length > 1){
          Message.error("sorry，只能选择一个角色！");
          return;
        }
        this.row.userRoleIds = this.checkedRoleIds;
        var data = await this.$axiosPost(ApiConst.user.saveAssignRole,this.row);
        if(data.code){
          localStorage.setItem("roleCode",data.data.roleCode);
          Message.success("操作成功");  
        }
      // }
      this.roleData = [];
      this.checkedRoleIds = [];
      this.row = {};
      this.assignRoleDialogVisible = false;
    },
    // 分配角色查询
    async assignRole(index, row){
      var data = await this.$axiosPost(ApiConst.user.getRoleListByUserId,row.id);
      if(data.code){
          this.assignRoleDialogVisible = true;
          this.roleData = data.data.roles;
          this.checkedRoleIds = data.data.userRoleIds;
          this.row = data.data;
      }
    },
      // 监听子组件传值
      handleCustomEvent(flag){
        console.log('监听用户管理子组件传值',flag)
        if(flag){
          this.getUserPage();
        }
      },
      async deleteByIds(){
        this.$confirm("是否确定删除","提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
            this.multipleSelection.forEach(item => {this.ids.push(item.id)});
          var data = await this.$axiosPost(ApiConst.user.delete,this.ids);
          console.log('getUserPage',data);
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
        this.$refs.addUserDialog.dialogFormVisible = true;
        this.$refs.addUserDialog.title = "编辑用户";
        this.$refs.addUserDialog.usernameInput = true;
        row.secondPassword = row.password;
        this.$refs.addUserDialog.registerUserForm = Object.assign({},row);
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
          var data = await this.$axiosPost(ApiConst.user.delete,this.ids);
          console.log('getUserPage',data);
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

    openAddUserDialog(){
      this.$refs.addUserDialog.dialogFormVisible = true;
      this.$refs.addUserDialog.usernameInput = false;
      this.$refs.addUserDialog.title = "新增用户";
    },
    // 从服务器获取数据的函数
    fetchData() {
      this.getUserPage();
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
      this.getUserPage();
    },
    async getUserPage() {
      this.loading = true;
        var data = await this.$axiosPost(ApiConst.user.getPage,this.formInline);
        console.log('getUserPage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.userTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
          this.loading = false;
        }
    }
  },
  components: {
    AddUserDialog,
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
  /* .paginationClass{
    position: fixed;
    bottom: 0;
    height: 40px;
    width: 100%;
    text-align: center;
  } */
</style>