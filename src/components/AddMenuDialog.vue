<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="35%" center :close-on-click-modal="false">
        <el-form :model="addMenuForm" :rules="addMenuRules" ref="addMenuForm">
        <el-form-item label="菜单名称：" :label-width="formLabelWidth" prop="menuName">
        <el-input v-model="addMenuForm.menuName" placeholder="请输入菜单名称" :disabled="menuNameInput"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径：" :label-width="formLabelWidth" prop="menuUrl">
        <el-input v-model="addMenuForm.menuUrl" placeholder="请输入菜单路径"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMenu('addMenuForm')">确 定</el-button>
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
        addMenuRules: {
          menuUrl: [
            { required: true, message: '请输入菜单路径', trigger: 'blur' }
          ],
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
        },
        dialogFormVisible: false,
        addMenuForm: {
          id: '',
          menuUrl: '',
          menuName: ''
        },
        title: "新增菜单",
        menuMenuInput: false,
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
      addMenu(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.menu.save,this.addMenuForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
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