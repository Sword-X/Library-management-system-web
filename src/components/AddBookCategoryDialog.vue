<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false">
        <el-form :model="addBookCategoryForm" :rules="addBookCategoryRules" ref="addBookCategoryForm">
        <el-form-item label="分类名称：" :label-width="formLabelWidth" prop="name">
        <el-input v-model="addBookCategoryForm.name" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="描述信息：" :label-width="formLabelWidth" prop="description">
        <el-input v-model="addBookCategoryForm.description" placeholder="请输入描述信息"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addBookCategory('addBookCategoryForm')">确 定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
    export default {
    data() {
      return {
        addBookCategoryRules: {
          // bookCategoryUrl: [
          //   { required: true, message: '请输入菜单路径', trigger: 'blur' }
          // ],
          name: [
            { required: true, message: '请输入分类名称', trigger: 'blur' }
          ],
        },
        dialogFormVisible: false,
        addBookCategoryForm: {},
        title: "新增菜单",
        bookCategoryBookCategoryInput: false,
        formLabelWidth: '100px'
      }
    },
    methods: {
        handleOpen() {
            this.dialogFormVisible = true; // 打开对话框时设置为true
        },
        handleClose() {
            this.dialogFormVisible = false; // 关闭对话框时设置为false
        },
      addBookCategory(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.bookCategory.save,this.addBookCategoryForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.addBookCategoryForm = {};
              Message.success("操作成功！");
              this.sendMessage2Parent();
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      sendMessage2Parent(){
        this.$emit('customEvent',true);
      }
    }
  }

</script>