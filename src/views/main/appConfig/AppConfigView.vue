<template>
  <div>
    <div class="update-css" >
      <el-button type="primary" @click="saveAppConfig">修改</el-button>
    </div>
    <div style="margin: 20px; width: 30%" >
    <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign" :rules="formLabelAlignRules" ref="formLabelAlign">
    <el-form-item label="应用名称">
      <el-input v-model="formLabelAlign.appName"></el-input>
    </el-form-item>
    <el-form-item label="应用版本">
      <el-input v-model="formLabelAlign.appVersion"></el-input>
    </el-form-item>
    <el-form-item label="出借天数">
      <el-input-number min="1" max="45" size="small" v-model="formLabelAlign.borrowDay"></el-input-number>
    </el-form-item>
    <el-form-item label="通知公告">
      <el-input
        type="textarea"
        placeholder="请输入公告内容"
        v-model="formLabelAlign.extend1"
        maxlength="100"
        show-word-limit
        rows="3"
      >
      </el-input>
    </el-form-item>
    <el-form-item label="应用描述">
      <el-input
        type="textarea"
        placeholder="请输入描述内容"
        v-model="formLabelAlign.appDescription"
        maxlength="1000"
        show-word-limit
        rows="8"
      >
      </el-input>
    </el-form-item>
    </el-form>
    </div>
  </div>
</template>


<script>
  import ApiConst from '@/serverApi/api';
  import { Message } from 'element-ui';
  export default {
    data() {
      return {
        loading: true,
        formLabelAlignRules: {
          extend1: [
            { max: 100, message: '不能超过100个字符', trigger: 'blur' }
          ],
          appDescription: [
            { max: 1000, message: '不能超过1000个字符', trigger: 'blur' }
          ],
        },
        labelPosition: 'right',
        formLabelAlign: {}
      };
    },
    created(){
      this.getAppConfig();
    },
    methods: {
      async saveAppConfig(){
        console.log(this.formLabelAlign);
        var data = await this.$axiosPost(ApiConst.appConfig.save,this.formLabelAlign);
        console.log('saveAppConfig',data);
        if(data.code){
           Message.success("操作成功！");
        }
      },
      async getAppConfig(){
        this.loading = true;
        var data = await this.$axiosPost(ApiConst.appConfig.get);
        console.log('getAppConfig',data);
        if(data.code){
          // Message.success("操作成功！");
          this.formLabelAlign = data.data;
          this.loading = false;
        }
      }
    }
  }
 
</script>
<style scoped>
.update-css {
   display: flex; /* 设置display属性为flex */
   align-items: left; /* 水平居中对齐 */
   margin-left: 30px;
}
</style>