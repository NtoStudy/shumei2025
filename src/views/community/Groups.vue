<template>
  <div class="groups-page">
    <div class="groups-container">
      <!-- 小组创建 -->
      <div class="create-section">
        <div class="create-header">
          <h3 class="section-title">
            <el-icon><Plus /></el-icon>
            创建互助小组
          </h3>
          <p class="section-desc">创建或加入互助小组，与有相似经历的朋友一起成长</p>
        </div>
        
        <div class="create-form">
          <el-form :model="groupForm" label-width="100px">
            <el-form-item label="小组名称">
              <el-input v-model="groupForm.name" placeholder="请输入小组名称" />
            </el-form-item>
            <el-form-item label="小组描述">
              <el-input 
                v-model="groupForm.description" 
                type="textarea" 
                :rows="3"
                placeholder="描述小组的宗旨和讨论话题"
              />
            </el-form-item>
            <el-form-item label="标签">
              <el-input
                v-model="tagInput"
                placeholder="添加标签，用逗号分隔"
                @keyup.enter="addTags"
              />
            </el-form-item>
            <el-form-item label="隐私设置">
              <el-radio-group v-model="groupForm.isPrivate">
                <el-radio :label="false">公开</el-radio>
                <el-radio :label="true">私密</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="createGroup" :loading="creating">
                <el-icon><Plus /></el-icon>
                创建小组
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      
      <!-- 小组列表 -->
      <div class="groups-section">
        <div class="groups-header">
          <h3 class="section-title">
            <el-icon><Grid /></el-icon>
            互助小组
          </h3>
          <div class="groups-actions">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索小组..."
              @input="searchGroups"
              class="search-input"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
        
        <div class="groups-list" v-if="filteredGroups.length > 0">
          <div 
            v-for="group in filteredGroups" 
            :key="group.id"
            class="group-item"
          >
            <div class="group-header">
              <div class="group-info">
                <h4 class="group-name">{{ group.name }}</h4>
                <p class="group-desc">{{ group.description }}</p>
              </div>
              <div class="group-meta">
                <div class="group-stats">
                  <span class="member-count">
                    <el-icon><User /></el-icon>
                    {{ group.members.length }}
                  </span>
                  <span class="post-count">
                    <el-icon><ChatDotRound /></el-icon>
                    {{ group.posts.length }}
                  </span>
                </div>
                <div class="group-privacy">
                  <el-tag :type="group.isPrivate ? 'warning' : 'success'" size="small">
                    {{ group.isPrivate ? '私密' : '公开' }}
                  </el-tag>
                </div>
              </div>
            </div>
            
            <div class="group-tags" v-if="group.tags.length > 0">
              <el-tag
                v-for="tag in group.tags"
                :key="tag"
                size="small"
                class="group-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            
            <div class="group-actions">
              <el-button 
                v-if="!isMember(group.id)"
                type="primary" 
                @click="joinGroup(group.id)"
                size="small"
              >
                <el-icon><Plus /></el-icon>
                加入小组
              </el-button>
              <el-button 
                v-else
                type="success" 
                @click="viewGroup(group.id)"
                size="small"
              >
                <el-icon><View /></el-icon>
                进入小组
              </el-button>
            </div>
          </div>
        </div>
        
        <div class="no-groups" v-else>
          <el-icon class="no-groups-icon"><Grid /></el-icon>
          <p>还没有找到相关小组</p>
          <p>创建第一个小组吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'

const communityStore = useCommunityStore()

// 表单数据
const groupForm = reactive({
  name: '',
  description: '',
  tags: [],
  isPrivate: false
})

const tagInput = ref('')
const searchKeyword = ref('')
const creating = ref(false)

// 小组数据
const groups = ref([
  {
    id: 1,
    name: '考试焦虑互助组',
    description: '分享考试经验，缓解考试焦虑，一起度过考试季',
    tags: ['考试', '焦虑', '学习'],
    members: ['user1', 'user2', 'user3'],
    posts: [],
    isPrivate: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: '失眠互助小组',
    description: '分享改善睡眠的方法，互相鼓励，告别失眠',
    tags: ['失眠', '睡眠', '健康'],
    members: ['user1', 'user4', 'user5'],
    posts: [],
    isPrivate: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: '人际关系讨论组',
    description: '讨论人际交往中的困惑，分享社交技巧',
    tags: ['人际关系', '社交', '沟通'],
    members: ['user2', 'user6'],
    posts: [],
    isPrivate: true,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  }
])

// 计算属性
const filteredGroups = computed(() => {
  if (!searchKeyword.value) return groups.value
  
  return groups.value.filter(group => 
    group.name.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    group.description.toLowerCase().includes(searchKeyword.value.toLowerCase()) ||
    group.tags.some(tag => tag.toLowerCase().includes(searchKeyword.value.toLowerCase()))
  )
})

const addTags = () => {
  if (tagInput.value.trim()) {
    const tags = tagInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    groupForm.tags.push(...tags)
    tagInput.value = ''
  }
}

const createGroup = async () => {
  if (!groupForm.name.trim()) {
    ElMessage.warning('请输入小组名称')
    return
  }
  
  if (!groupForm.description.trim()) {
    ElMessage.warning('请输入小组描述')
    return
  }
  
  creating.value = true
  
  try {
    const groupData = {
      name: groupForm.name,
      description: groupForm.description,
      tags: groupForm.tags,
      isPrivate: groupForm.isPrivate
    }
    
    const newGroup = communityStore.createGroup(groupData)
    
    // 添加到本地显示
    groups.value.unshift({
      id: newGroup.id,
      name: groupForm.name,
      description: groupForm.description,
      tags: groupForm.tags,
      members: ['anonymous'],
      posts: [],
      isPrivate: groupForm.isPrivate,
      createdAt: new Date().toISOString()
    })
    
    // 重置表单
    groupForm.name = ''
    groupForm.description = ''
    groupForm.tags = []
    groupForm.isPrivate = false
    
    ElMessage.success('小组创建成功！')
  } catch (error) {
    ElMessage.error('创建失败，请重试')
  } finally {
    creating.value = false
  }
}

const joinGroup = (groupId) => {
  const group = groups.value.find(g => g.id === groupId)
  if (group) {
    if (!group.members.includes('anonymous')) {
      group.members.push('anonymous')
      ElMessage.success('加入小组成功！')
    } else {
      ElMessage.info('您已经是该小组的成员了')
    }
  }
}

const viewGroup = (groupId) => {
  ElMessage.info('小组详情页面开发中...')
}

const isMember = (groupId) => {
  const group = groups.value.find(g => g.id === groupId)
  return group && group.members.includes('anonymous')
}

const searchGroups = () => {
  // 搜索逻辑已在计算属性中处理
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped lang="scss">
.groups-page {
  padding: 20px 0;
}

.groups-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.create-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #FF6B6B;
  margin-bottom: 10px;
  font-size: 18px;
  font-weight: 600;
}

.section-desc {
  color: #666;
  margin-bottom: 20px;
  font-size: 14px;
}

.create-form {
  .el-form-item {
    margin-bottom: 20px;
  }
}

.groups-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.groups-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  flex-wrap: wrap;
  gap: 15px;
}

.search-input {
  width: 300px;
  
  :deep(.el-input__inner) {
    border-radius: 20px;
  }
}

.groups-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.group-item {
  border: 1px solid #E0E0E0;
  border-radius: 15px;
  padding: 20px;
  background: #FAFAFA;
  transition: all 0.3s;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(255, 107, 107, 0.1);
    transform: translateY(-2px);
  }
}

.group-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  gap: 15px;
}

.group-info {
  flex: 1;
  
  .group-name {
    color: #333;
    font-size: 18px;
    font-weight: 600;
    margin: 0 0 8px 0;
  }
  
  .group-desc {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
  }
}

.group-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
}

.group-stats {
  display: flex;
  gap: 15px;
  
  span {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #666;
    font-size: 12px;
  }
}

.group-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.group-tag {
  background: #FFB6C1;
  color: white;
  border: none;
  font-size: 12px;
}

.group-actions {
  display: flex;
  justify-content: flex-end;
}

.no-groups {
  text-align: center;
  padding: 40px;
  color: #666;
  
  .no-groups-icon {
    font-size: 48px;
    color: #FFB6C1;
    margin-bottom: 15px;
  }
  
  p {
    margin: 5px 0;
  }
}

@media (max-width: 768px) {
  .groups-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-input {
    width: 100%;
  }
  
  .groups-list {
    grid-template-columns: 1fr;
  }
  
  .group-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .group-meta {
    align-items: flex-start;
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
