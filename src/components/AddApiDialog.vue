<template>
    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="25%" center :close-on-click-modal="false" :show-close="false">
        <el-form :model="addApiForm" :rules="addApiRules" ref="addApiForm">
          <el-form-item label="接口路径：" :label-width="formLabelWidth" prop="apiUrl">
        <el-input v-model="addApiForm.apiUrl" placeholder="请输入接口路径"></el-input>
        </el-form-item>
        <el-form-item label="接口信息：" :label-width="formLabelWidth" prop="apiInfo">
        <el-input v-model="addApiForm.apiInfo" placeholder="请输入接口信息"></el-input>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addApi('addApiForm')">确 定</el-button>
        <el-button @click="cancelForm">取 消</el-button>
        </div>
    </el-dialog>
</template>

<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
    export default {
    data() {
      return {
        addApiRules: {
          apiUrl: [
            { required: true, message: '请输入接口路径', trigger: 'blur' }
          ],
          apiInfo: [
            { required: true, message: '请输入接口信息', trigger: 'blur' }
          ],
        },
        dialogFormVisible: false,
        addApiForm: {},
        title: "新增接口",
        apiApiInput: false,
        formLabelWidth: '100px'
      }
    },
    methods: {
      cancelForm(){
        this.dialogFormVisible = false;
        this.addApiForm = {};
      },
        handleOpen() {
            this.dialogFormVisible = true; // 打开对话框时设置为true
        },
        handleClose() {
            this.dialogFormVisible = false; // 关闭对话框时设置为false
        },
      addApi(formName){
        this.$refs[formName].validate(async (valid) => {
          if (valid) {
            var data = await this.$axiosPost(ApiConst.api.save,this.addApiForm);
            if(data.code){
              this.$refs[formName].resetFields();
              this.dialogFormVisible = false;
              this.addApiForm = {};
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