<template>
  <el-dialog :visible="show" @close="$emit('update:show', false)">
    <!-- 这里放置对话框内容 -->
    11111
  </el-dialog>
</template>
 
<script>
export default {
  props: ['show'],
};
</script>