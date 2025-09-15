<template>
  <div class="page-header">
    <h1 class="page-title">
      <el-icon v-if="icon"><component :is="icon" /></el-icon>
      {{ title }}
    </h1>
    <p class="page-desc" v-if="description">{{ description }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: [String, Object],
    default: null
  }
})
</script>

<style scoped lang="scss">
.page-header {
  text-align: center;
  margin-bottom: 30px;
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #FF6B6B;
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 10px;
  }
  
  .page-desc {
    color: #666;
    font-size: 16px;
    margin: 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
}
</style>
