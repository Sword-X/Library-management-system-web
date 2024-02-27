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
    ref="multipleTable"
    :data="roleTableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      prop="roleCode"
      label="角色编码"
      width="240">
    </el-table-column>
    <el-table-column
      prop="roleName"
      label="角色名称"
      width="240">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="创建时间"
      width="240">
      <template slot-scope="scope">
          <span>{{dateFormat(scope.row.createTime) }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" >
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
  import AddRoleDialog from "@/components/AddRoleDialog.vue";
export default {
  data() {
    return {
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
      })
    },
      dateFormat(dateStr){
        return new Date(dateStr).toLocaleString().replaceAll("/","-");
      },
      async handleEdit(index, row) {
        this.$refs.addRoleDialog.dialogFormVisible = true;
        this.$refs.addRoleDialog.title = "编辑角色";
        this.$refs.addRoleDialog.roleRoleInput = true;
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
        })
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
        var data = await this.$axiosPost(ApiConst.role.getPage,this.formInline);
        console.log('getRolePage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.roleTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
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