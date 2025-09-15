<template>
  <div class="simple-layout">
    <router-view />
  </div>
</template>

<script setup>
// 简单布局，无Header和Footer
</script>

<style scoped lang="scss">
.simple-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFF8DC 0%, #F0F8FF 100%);
}
</style>
