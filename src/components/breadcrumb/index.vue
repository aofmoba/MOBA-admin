<template>
  <a-breadcrumb class="container-breadcrumb" style="font-size: 16px;">
    <template #separator>
      <icon-right />
    </template>
    <a-breadcrumb-item v-for="item,i in items" :key="item">
      <router-link v-if="i < path.length" :to="path[i]">{{ item }}</router-link>
      <span v-else>{{ item }}</span>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { PropType } from 'vue';

  defineProps({
    items: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
    path: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      }
    },
  });

</script>

<style scoped lang="less">
  .container-breadcrumb {
    height: 22px;
    margin-bottom: 20px;
    :deep(.arco-breadcrumb-item) {
      line-height: 22px;
      a{
        color: #6A74A5;
        font-weight: 500;
      }
      &:last-child {
        color: #3A3F63;
        font-weight: bold;
      }
    }
  }
</style>
