<template>
  <div class="treehole-page">
    <div class="treehole-container">
      <!-- 发布区域 -->
      <div class="post-section">
        <div class="post-header">
          <h3 class="section-title">
            <el-icon><Edit /></el-icon>
            分享你的心情
          </h3>
          <p class="section-desc">匿名分享，获得温暖的支持和理解</p>
        </div>
        
        <div class="post-form">
          <el-input
            v-model="postContent"
            type="textarea"
            :rows="4"
            placeholder="写下你此刻的感受，分享你的心情..."
            maxlength="500"
            show-word-limit
            class="content-input"
          />
          
          <div class="post-actions">
            <div class="tag-input">
              <el-input
                v-model="tagInput"
                placeholder="添加标签（可选）"
                @keyup.enter="addTag"
                size="small"
              >
                <template #append>
                  <el-button @click="addTag" size="small">添加</el-button>
                </template>
              </el-input>
            </div>
            
            <div class="selected-tags" v-if="selectedTags.length > 0">
              <el-tag
                v-for="tag in selectedTags"
                :key="tag"
                closable
                @close="removeTag(tag)"
                class="post-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            
            <div class="submit-actions">
              <el-button @click="clearForm" class="clear-btn">
                <el-icon><Refresh /></el-icon>
                清空
              </el-button>
              <el-button 
                type="primary" 
                @click="submitPost"
                :loading="submitting"
                :disabled="!postContent.trim()"
                class="submit-btn"
              >
                <el-icon><Send /></el-icon>
                发布
              </el-button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 树洞动态 -->
      <div class="posts-section">
        <div class="posts-header">
          <h3 class="section-title">
            <el-icon><ChatDotRound /></el-icon>
            树洞动态
          </h3>
          <div class="posts-actions">
            <el-button @click="refreshPosts" class="refresh-btn">
              <el-icon><Refresh /></el-icon>
              刷新
            </el-button>
          </div>
        </div>
        
        <div class="posts-list" v-if="posts.length > 0">
          <div 
            v-for="post in posts" 
            :key="post.id"
            class="post-item"
          >
            <div class="post-header">
              <div class="post-author">
                <el-avatar :size="32" :src="post.author.avatar">
                  <el-icon><User /></el-icon>
                </el-avatar>
                <div class="author-info">
                  <span class="author-name">{{ post.author.nickname }}</span>
                  <span class="post-time">{{ formatTime(post.timestamp) }}</span>
                </div>
              </div>
              <div class="post-actions">
                <el-button 
                  type="text" 
                  @click="likePost(post.id)"
                  :class="{ liked: post.isLiked }"
                  class="action-btn"
                >
                  <el-icon><Heart /></el-icon>
                  {{ post.likes }}
                </el-button>
                <el-button 
                  type="text" 
                  @click="toggleComments(post.id)"
                  class="action-btn"
                >
                  <el-icon><ChatDotRound /></el-icon>
                  {{ post.comments.length }}
                </el-button>
              </div>
            </div>
            
            <div class="post-content">
              <p>{{ post.content }}</p>
            </div>
            
            <div class="post-tags" v-if="post.tags.length > 0">
              <el-tag
                v-for="tag in post.tags"
                :key="tag"
                size="small"
                class="content-tag"
              >
                {{ tag }}
              </el-tag>
            </div>
            
            <!-- 评论区域 -->
            <div class="comments-section" v-if="post.showComments">
              <div class="comment-form">
                <el-input
                  v-model="commentInputs[post.id]"
                  placeholder="写下你的温暖留言..."
                  @keyup.enter="submitComment(post.id)"
                  class="comment-input"
                >
                  <template #append>
                    <el-button @click="submitComment(post.id)" type="primary">发送</el-button>
                  </template>
                </el-input>
              </div>
              
              <div class="comments-list" v-if="post.comments.length > 0">
                <div 
                  v-for="comment in post.comments" 
                  :key="comment.id"
                  class="comment-item"
                >
                  <div class="comment-author">
                    <el-avatar :size="24" :src="comment.author.avatar">
                      <el-icon><User /></el-icon>
                    </el-avatar>
                    <span class="comment-name">{{ comment.author.nickname }}</span>
                    <span class="comment-time">{{ formatTime(comment.timestamp) }}</span>
                  </div>
                  <div class="comment-content">
                    <p>{{ comment.content }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="no-posts" v-else>
          <el-icon class="no-posts-icon"><ChatDotRound /></el-icon>
          <p>还没有任何分享</p>
          <p>成为第一个分享心情的人吧！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCommunityStore } from '@/stores/community'
import { ElMessage } from 'element-plus'

const communityStore = useCommunityStore()

// 表单数据
const postContent = ref('')
const tagInput = ref('')
const selectedTags = ref([])
const submitting = ref(false)

// 评论输入
const commentInputs = reactive({})

// 帖子数据
const posts = ref([
  {
    id: 1,
    author: {
      nickname: '匿名用户',
      avatar: '/default-avatar.png',
      level: 1
    },
    content: '最近总是失眠，压力好大...',
    tags: ['失眠', '压力'],
    likes: 5,
    comments: [
      {
        id: 1,
        author: {
          nickname: '温暖的朋友',
          avatar: '/default-avatar.png'
        },
        content: '抱抱你，一切都会好起来的！',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      }
    ],
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    showComments: false,
    isLiked: false
  },
  {
    id: 2,
    author: {
      nickname: '匿名用户',
      avatar: '/default-avatar.png',
      level: 2
    },
    content: '今天心情不错，和朋友们一起度过了愉快的时光！',
    tags: ['开心', '朋友'],
    likes: 8,
    comments: [],
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    showComments: false,
    isLiked: false
  }
])

const addTag = () => {
  if (tagInput.value.trim() && !selectedTags.value.includes(tagInput.value.trim())) {
    selectedTags.value.push(tagInput.value.trim())
    tagInput.value = ''
  }
}

const removeTag = (tag) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  }
}

const clearForm = () => {
  postContent.value = ''
  selectedTags.value = []
  tagInput.value = ''
}

const submitPost = async () => {
  if (!postContent.value.trim()) {
    ElMessage.warning('请输入内容')
    return
  }
  
  submitting.value = true
  
  try {
    const postData = {
      content: postContent.value,
      tags: selectedTags.value,
      isAnonymous: true
    }
    
    communityStore.addPost(postData)
    
    // 添加到本地显示
    const newPost = {
      id: Date.now(),
      author: {
        nickname: '匿名用户',
        avatar: '/default-avatar.png',
        level: 1
      },
      content: postContent.value,
      tags: selectedTags.value,
      likes: 0,
      comments: [],
      timestamp: new Date().toISOString(),
      showComments: false,
      isLiked: false
    }
    
    posts.value.unshift(newPost)
    
    ElMessage.success('发布成功！')
    clearForm()
  } catch (error) {
    ElMessage.error('发布失败，请重试')
  } finally {
    submitting.value = false
  }
}

const likePost = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    if (post.isLiked) {
      post.likes--
      post.isLiked = false
    } else {
      post.likes++
      post.isLiked = true
    }
  }
}

const toggleComments = (postId) => {
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    post.showComments = !post.showComments
  }
}

const submitComment = (postId) => {
  const commentContent = commentInputs[postId]
  if (!commentContent || !commentContent.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }
  
  const post = posts.value.find(p => p.id === postId)
  if (post) {
    const newComment = {
      id: Date.now(),
      author: {
        nickname: '匿名用户',
        avatar: '/default-avatar.png'
      },
      content: commentContent,
      timestamp: new Date().toISOString()
    }
    
    post.comments.push(newComment)
    commentInputs[postId] = ''
    
    ElMessage.success('评论成功！')
  }
}

const refreshPosts = () => {
  ElMessage.success('刷新成功！')
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 7) return `${days}天前`
  
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  // 页面加载时的初始化逻辑
})
</script>

<style scoped lang="scss">
.treehole-page {
  padding: 20px 0;
}

.treehole-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.post-section {
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

.post-form {
  .content-input {
    margin-bottom: 20px;
    
    :deep(.el-textarea__inner) {
      border-radius: 10px;
      border-color: #E0E0E0;
      
      &:focus {
        border-color: #FF6B6B;
      }
    }
  }
}

.post-actions {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.tag-input {
  width: 300px;
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.post-tag {
  background: #FFB6C1;
  color: white;
  border: none;
}

.submit-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
}

.clear-btn {
  color: #666;
  border-color: #E0E0E0;
  
  &:hover {
    color: #FF6B6B;
    border-color: #FF6B6B;
  }
}

.submit-btn {
  background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
  border: none;
  padding: 10px 20px;
  font-weight: 600;
  
  &:hover {
    background: linear-gradient(135deg, #FF5252 0%, #FF7979 100%);
  }
}

.posts-section {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.1);
}

.posts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.refresh-btn {
  color: #FF6B6B;
  border-color: #FF6B6B;
  
  &:hover {
    background: #FF6B6B;
    color: white;
  }
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.post-item {
  border: 1px solid #E0E0E0;
  border-radius: 15px;
  padding: 20px;
  background: #FAFAFA;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.post-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.author-info {
  display: flex;
  flex-direction: column;
  
  .author-name {
    font-weight: 600;
    color: #333;
    font-size: 14px;
  }
  
  .post-time {
    color: #999;
    font-size: 12px;
  }
}

.post-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  color: #666;
  
  &:hover {
    color: #FF6B6B;
  }
  
  &.liked {
    color: #FF6B6B;
  }
}

.post-content {
  margin-bottom: 15px;
  
  p {
    color: #333;
    line-height: 1.6;
    margin: 0;
  }
}

.post-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 15px;
}

.content-tag {
  background: #FFB6C1;
  color: white;
  border: none;
  font-size: 12px;
}

.comments-section {
  border-top: 1px solid #E0E0E0;
  padding-top: 15px;
}

.comment-form {
  margin-bottom: 15px;
}

.comment-input {
  :deep(.el-input-group__append) {
    background: #FF6B6B;
    border-color: #FF6B6B;
  }
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.comment-item {
  padding: 10px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #FFB6C1;
}

.comment-author {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 5px;
  
  .comment-name {
    font-weight: 600;
    color: #333;
    font-size: 12px;
  }
  
  .comment-time {
    color: #999;
    font-size: 11px;
  }
}

.comment-content {
  p {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    margin: 0;
  }
}

.no-posts {
  text-align: center;
  padding: 40px;
  color: #666;
  
  .no-posts-icon {
    font-size: 48px;
    color: #FFB6C1;
    margin-bottom: 15px;
  }
  
  p {
    margin: 5px 0;
  }
}

@media (max-width: 768px) {
  .post-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .tag-input {
    width: 100%;
  }
  
  .submit-actions {
    flex-direction: column;
  }
  
  .posts-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
}
</style>
