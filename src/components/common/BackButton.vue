<template>
  <div class="header-actions">
    <el-button @click="goBack" class="back-btn">
      <el-icon><ArrowLeft /></el-icon>
      {{ text }}
    </el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  to: {
    type: String,
    default: '/tools'
  },
  text: {
    type: String,
    default: '返回工具列表'
  }
})

const router = useRouter()

const goBack = () => {
  router.push(props.to)
}
</script>

<style scoped lang="scss">
.header-actions {
  margin-bottom: 20px;
  
  .back-btn {
    color: #666;
    border-color: #E0E0E0;
    
    &:hover {
      color: #FF6B6B;
      border-color: #FF6B6B;
    }
  }
}
</style>
