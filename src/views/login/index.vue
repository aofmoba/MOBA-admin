<template>
  <div class="container">
    <div class="content">
      <LoginForm />
    </div>
  </div>
</template>

<script lang="ts" setup>
import LoginForm from './components/login-form.vue';
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    height: 100vh;
    background: #F5F6FA;
    overflow: hidden;
    &::before{
      content: '';
      position: absolute;
      left: -130px;
      top: -220px;
      width: 320px;
      height: 325px;
      border-radius: 50%;
      opacity: 0.04;
      border: 80px solid #4458FE;
      pointer-events: none;
    }
    &::after{
      content: '';
      position: absolute;
      right: -250px;
      bottom: 51px;
      width: 240px;
      height: 240px;
      opacity: 0.04;
      border-radius: 50%;
      border: 80px solid #4458FE;
      pointer-events: none;
    }
    .content{
      z-index: 1;
      position: relative;
      width: 740px;
      height: 440px;
      background: #FFFFFF;
      box-shadow: 0px 0px 8px 0px rgba(46,55,127,0.39);
      border-radius: 4px;
    }
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
  }
  @media (max-width: @screen-xs) {
    .container {
      &::before{
        left: -120px;
        top: -180px;
        width: 160px;
        height: 160px;
      }
      .content{
        width: calc(100vw - 20px);
      }
    }
  }
</style>
