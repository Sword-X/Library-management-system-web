<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
       <el-form-item label="角色编码">
      <el-input v-model="formInline.roleCode" placeholder="请输入角色编码"></el-input>
      </el-form-item>
      <el-form-item label="角色名称">
      <el-input v-model="formInline.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRolePage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <div class="menu-css">
      <el-button type="success" @click="openAddRoleDialog">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-role-dialog @customEvent="handleCustomEvent" ref="addRoleDialog" v-model="dialogFormVisible"/> <!-- @customEvent="handleCustomEvent"监听子组件的自定义事件 -->
    </div>

    <!-- 列表显示区域 -->
    <div>
      <el-table
    v-loading="loading"
    ref="multipleTable"
    :data="roleTableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"
      align="center">
    </el-table-column>
    <el-table-column
      prop="roleCode"
      label="角色编码"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="isDefault"
      label="是否为默认角色"
      width="240"
      align="center">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.isDefault"
          :active-value='1'
          :inactive-value='0'
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleSwitchChange(scope.row,scope.row.isDefault)">
        </el-switch>
      </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="240"
      align="center">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="权限配置" align="center">
      <template slot-scope="scope">
        <el-button
        type="primary" plain round
          size="mini"
          @click="getIncludUsers(scope.$index, scope.row)">包含用户</el-button>
        <el-button
        type="primary" plain round
          size="mini"
          @click="assignMenu(scope.$index, scope.row)">分配菜单</el-button>
      </template>
      </el-table-column>
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          :disabled="scope.row.isSafe == 1"
          @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
        <el-button
          size="mini"
          type="danger"
          :disabled="scope.row.isSafe == 1"
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
    <!-- 用户dialog -->
    <el-dialog title="包含用户" :visible.sync="assignUserDialogVisible" width="55%" center :close-on-click-modal="false">
      <div class="search-css">
      <el-form :inline="true" :model="userFormInline" class="demo-form-inline" label-position="left">
        <el-form-item label="姓名">
        <el-input v-model="userFormInline.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="getIncludUsersByParam">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
      <div>
      <el-table
    :data="user"
    tooltip-effect="dark"
    style="width: 100%">
    <el-table-column
      prop="username"
      label="用户名"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      width="120"
      align="center">
    </el-table-column>
    <el-table-column
      prop="phone"
      label="手机号"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址"
      show-overflow-tooltip
      align="center">
    </el-table-column>
    <el-table-column label="操作" width="120"
      align="center">
      <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="deleteIncludUser(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>
      </el-table>
    </div>
    <!-- 用户dialog分页组件 -->
    <div>
    <el-pagination
      align="center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="userPage.pageNum"
      :page-sizes="[10]"
      :page-size="userPage.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="userPage.total">
    </el-pagination>
    </div>
    </el-dialog>
    <!-- 菜单dialog -->
    <el-dialog title="分配菜单" :visible.sync="assignMenuDialogVisible" width="30%" center :close-on-click-modal="false" :show-close="false">
      <el-tree
        ref="tree"
        :data="menuData"
        :show-checkbox=true
        node-key="id"
        :default-checked-keys="checkedMenuIds"
        :props="defaultProps">
      </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveAssignMenu">确 认</el-button>
      <el-button @click="cancelAssignMenu">取 消</el-button>
    </div>
    </el-dialog>
  </div>
</template>

<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
  import AddRoleDialog from "@/components/AddRoleDialog.vue";
export default {
  data() {
    return {
      loading: true,
      //包含用户
      assignUserDialogVisible: false,
      user: {},
      userFormInline: {},
      userPage:{},
      userRow:{},
      // 包含菜单
      menuData: [{
      id: 1,
      label: ''}],
      defaultProps: {
        label: 'menuName'
      },
      row:{},
      assignMenuDialogVisible: false,
      // ----------分隔符---------
      checkedMenuIds:[],
      roleTableData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        role: '',
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
      async handleSwitchChange(row,status){
        console.log(row,status);
        row.isDefault = status;
        var data = await this.$axiosPost(ApiConst.role.updateDeafultRole,row);
        if(data.code){
          Message.success("操作成功！");
          this.fetchData();
        }
      },
    async deleteIncludUser(index,row){
      console.log(row);
      row.roleId = this.userRow.id;
      var data = await this.$axiosPost(ApiConst.role.deleteIncludUser,row);
      if(data.code){
        Message.success("操作成功！");
        this.getIncludUsersByParam();
      }
    },
    //包含用户条件查询
    async getIncludUsersByParam(){
      this.userFormInline.roleId = this.userRow.id;
      var data = await this.$axiosPost(ApiConst.role.getIncludUsers,this.userFormInline);
      console.log('getIncludUsersByParam',data);
        if(data.code){
          // Message.success("操作成功！");
          this.user = data.data.list;
          this.userPage.pageSize = data.data.pageSize;
          this.userPage.pageNum = data.data.pageNum;
          this.userPage.total = data.data.total;
          // this.userRow = row;
        }
    },
    //包含用户
    async getIncludUsers(index,row){
      console.log(row);
      this.userFormInline = {};
      this.userFormInline.roleId = row.id;
      this.assignUserDialogVisible = true;
      var data = await this.$axiosPost(ApiConst.role.getIncludUsers,this.userFormInline);
      console.log('getRolePage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.user = data.data.list;
          this.userPage.pageSize = data.data.pageSize;
          this.userPage.pageNum = data.data.pageNum;
          this.userPage.total = data.data.total;
          this.userRow = row;
        }
    },
    // 取消分配菜单
    cancelAssignMenu(){
      this.menuData = [];
      this.checkedMenuIds = [];
      this.row = {};
      this.assignMenuDialogVisible = false;
    },
    // 分配菜单保存
    async saveAssignMenu(){
      console.log(this.$refs.tree.getCheckedKeys());
      this.checkedMenuIds = this.$refs.tree.getCheckedKeys();
      // if(this.checkedMenuIds && this.checkedMenuIds.length > 0){
        this.row.roleMenuIds = this.checkedMenuIds;
      var data = await this.$axiosPost(ApiConst.role.saveAssignMenu,this.row);
        if(data.code){
          Message.success("操作成功");        
        }
      // }
      this.menuData = [];
      this.checkedMenuIds = [];
      this.row = {};
      this.assignMenuDialogVisible = false;
    },
    // 分配菜单查询
    async assignMenu(index, row){
      var data = await this.$axiosPost(ApiConst.role.getMenuListByRoleId,row.id);
      if(data.code){
          this.assignMenuDialogVisible = true;
          console.log(data,1111111111);
          this.menuData = data.data.menus;
          this.checkedMenuIds = data.data.roleMenuIds;
          this.row = data.data;
      }
    },
    // 监听子组件传值
    handleCustomEvent(flag){
      console.log('监听用户管理子组件传值',flag)
      if(flag){
        this.getRolePage();
      }
    },
    async deleteByIds(){
      this.$confirm("是否确定删除","提示",{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async ()=>{
          this.multipleSelection.forEach(item => {this.ids.push(item.id)});
        var data = await this.$axiosPost(ApiConst.role.delete,this.ids);
        console.log('getRolePage',data);
        if(data.code){
          Message.success("操作成功！");
          this.fetchData();
        }
      }).catch((item)=>{console.log(item)});
    },
      dateFormat(dateStr){
        return new Date(dateStr).toLocaleString().replaceAll("/","-");
      },
      async handleEdit(index, row) {
        this.$refs.addRoleDialog.dialogFormVisible = true;
        this.$refs.addRoleDialog.title = "编辑角色";
        // this.$refs.addRoleDialog.roleRoleInput = true;
        this.$refs.addRoleDialog.addRoleForm = Object.assign({},row);
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
          var data = await this.$axiosPost(ApiConst.role.delete,this.ids);
          console.log('getRolePage',data);
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

    openAddRoleDialog(){
      this.$refs.addRoleDialog.dialogFormVisible = true;
      this.$refs.addRoleDialog.title = "新增角色";
    },
    // 从服务器获取数据的函数
    fetchData() {
      this.getRolePage();
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
      this.getRolePage();
    },
    async getRolePage() {
      this.loading = true;
        var data = await this.$axiosPost(ApiConst.role.getPage,this.formInline);
        console.log('getRolePage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.roleTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
          this.loading = false;
        }
    }
  },
  components: {
    AddRoleDialog,
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