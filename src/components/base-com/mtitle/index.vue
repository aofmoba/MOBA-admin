<template>
  <div class="mtitle">
    <div class="flex-items">
      <div class="line"></div>
      <div class="font-title mcolor-1">{{ title }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
    title: {
      type:  String,
      default() {
        return '';
      },
    },
});
</script>

<style scoped lang="less">
  .mtitle{
    padding:0 30px;
    line-height: 25px;
    &>div{
      padding: 20px 0;
      border-bottom: 1px solid #DAE0F2;
    }
    .line{
      width: 4px;
      height: 21px;
      margin-right: 10px;
      background: #D8D8D8 linear-gradient(45deg, #4F8AFF 0%, #4B5EFF 100%);
      border-radius: 2px;
    }
  }
</style>
