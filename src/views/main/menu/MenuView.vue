<template>
  <div>
    <!-- 搜索框 -->
    <div class="search-css">
      <el-form :inline="true" :model="formInline" class="demo-form-inline" label-position="left">
       <el-form-item label="菜单名称">
      <el-input v-model="formInline.menuName" placeholder="菜单名称"></el-input>
      </el-form-item>
      <el-form-item label="菜单路径">
      <el-input v-model="formInline.menuUrl" placeholder="请输入菜单路径"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getMenuPage">查询</el-button>
      </el-form-item>
      </el-form>
    </div>
    
    <div class="menu-css">
      <el-button type="success" @click="openAddMenuDialog">新增</el-button>
      <el-button type="mini" @click="deleteByIds">批量删除</el-button>
      <add-menu-dialog @customEvent="handleCustomEvent" ref="addMenuDialog" v-model="dialogFormVisible"/> <!-- @customEvent="handleCustomEvent"监听子组件的自定义事件 -->
    </div>

    <!-- 列表显示区域 -->
    <div>
      <el-table
    ref="multipleTable"
    :data="menuTableData"
    tooltip-effect="dark"
    style="width: 100%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55"
      align="center">
    </el-table-column>
    <el-table-column
      prop="menuName"
      label="菜单名称"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="menuUrl"
      label="菜单路径"
      width="240"
      align="center">
    </el-table-column>
    <el-table-column
      prop="status"
      label="状态"
      width="240"
      align="center">
      <template slot-scope="scope">
        <el-switch
          v-model="scope.row.status"
          :active-value='1'
          :inactive-value='-1'
          active-color="#13ce66"
          inactive-color="#ff4949"
          @change="handleSwitchChange(scope.row, scope.row.status)">
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
    <el-table-column
      prop="appSystemVersion"
      label="系统版本"
      width="240"
      align="center">
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
  import AddMenuDialog from "@/components/AddMenuDialog.vue";
export default {
  data() {
    return {
      menuTableData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      pageNum: 1, // 当前页码
      pageSize: 10, // 每页显示的数量
      total: 0, // 总条目数
      formInline: {
        menu: '',
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
      var data = await this.$axiosPost(ApiConst.menu.save,val1);
          if(data.code){
            Message.success("操作成功！");
          }
    },
      // 监听子组件传值
      handleCustomEvent(flag){
        console.log('监听用户管理子组件传值',flag)
        if(flag){
          this.getMenuPage();
        }
      },
      async deleteByIds(){
        this.$confirm("是否确定删除","提示",{
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(async ()=>{
            this.multipleSelection.forEach(item => {this.ids.push(item.id)});
          var data = await this.$axiosPost(ApiConst.menu.delete,this.ids);
          console.log('getMenuPage',data);
          if(data.code){
            Message.success("操作成功！");
            this.fetchData();
          }
        })
      },
      dateFormat(dateStr){
      if(dateStr){
        return new Date(dateStr).toLocaleString().replaceAll("/","-");
      }else return '';
      },
      async handleEdit(index, row) {
        this.$refs.addMenuDialog.dialogFormVisible = true;
        this.$refs.addMenuDialog.title = "编辑菜单";
        // this.$refs.addMenuDialog.menuNameInput = true;
        this.$refs.addMenuDialog.addMenuForm = Object.assign({},row);
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
          var data = await this.$axiosPost(ApiConst.menu.delete,this.ids);
          console.log('getMenuPage',data);
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

    openAddMenuDialog(){
      this.$refs.addMenuDialog.dialogFormVisible = true;
      this.$refs.addMenuDialog.title = "菜单用户";
    },
    // 从服务器获取数据的函数
    fetchData() {
      this.getMenuPage();
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
      this.getMenuPage();
    },
    async getMenuPage() {
        var data = await this.$axiosPost(ApiConst.menu.getPage,this.formInline);
        console.log('getMenuPage',data);
        if(data.code){
          // Message.success("操作成功！");
          this.menuTableData = data.data.list;
          this.pageSize = data.data.pageSize;
          this.pageNum = data.data.pageNum;
          this.total = data.data.total;
        }
    }
  },
  components: {
    AddMenuDialog,
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