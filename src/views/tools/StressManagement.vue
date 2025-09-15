<template>
  <div class="stress-management-page">

    <div class="main-content">
      <div class="content-container">
        <div class="page-header">
          <h1 class="page-title">
            <el-icon><Aim /></el-icon>
            压力管理
          </h1>
          <p class="page-desc">通过科学的方法识别压力源并有效管理日常压力</p>
        </div>
        
        <div class="stress-management-container">
          <!-- 工具选择 -->
          <div class="tool-selector">
            <h3 class="section-title">选择压力管理工具</h3>
            <div class="tool-grid">
              <div 
                v-for="tool in managementTools" 
                :key="tool.id"
                class="tool-card"
                :class="{ active: selectedTool === tool.id }"
                @click="selectTool(tool.id)"
              >
                <div class="tool-icon">
                  <el-icon><component :is="tool.icon" /></el-icon>
                </div>
                <h4 class="tool-name">{{ tool.name }}</h4>
                <p class="tool-desc">{{ tool.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- 时间管理工具 -->
          <div class="tool-content" v-if="selectedTool === 'time-management'">
            <div class="tool-header">
              <h3 class="tool-title">时间管理矩阵</h3>
              <p class="tool-desc">基于紧急性和重要性对任务进行分类，帮助你更有效地分配时间</p>
            </div>
            
            <div class="time-matrix">
              <div class="matrix-grid">
                <div class="matrix-header-row">
                  <div class="matrix-corner"></div>
                  <div class="matrix-header">紧急</div>
                  <div class="matrix-header">不紧急</div>
                </div>
                
                <div class="matrix-row">
                  <div class="matrix-header">重要</div>
                  <div 
                    class="matrix-cell important urgent"
                    @click="selectQuadrant(1)"
                    :class="{ active: selectedQuadrant === 1 }"
                  >
                    <h4>第一象限</h4>
                    <p>立即处理</p>
                    <ul class="task-list">
                      <li v-for="task in quadrantTasks[1]" :key="task.id" class="task-item">
                        <div class="task-content">
                          <el-checkbox v-model="task.completed" @change="updateTaskStatus(task)"></el-checkbox>
                          <span :class="{ completed: task.completed }">{{ task.content }}</span>
                        </div>
                        <el-button type="danger" size="small" @click="removeTask(task.id, 1)" class="delete-btn">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </li>
                    </ul>
                  </div>
                  <div 
                    class="matrix-cell important not-urgent"
                    @click="selectQuadrant(2)"
                    :class="{ active: selectedQuadrant === 2 }"
                  >
                    <h4>第二象限</h4>
                    <p>计划执行</p>
                    <ul class="task-list">
                      <li v-for="task in quadrantTasks[2]" :key="task.id" class="task-item">
                        <div class="task-content">
                          <el-checkbox v-model="task.completed" @change="updateTaskStatus(task)"></el-checkbox>
                          <span :class="{ completed: task.completed }">{{ task.content }}</span>
                        </div>
                        <el-button type="danger" size="small" @click="removeTask(task.id, 2)" class="delete-btn">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div class="matrix-row">
                  <div class="matrix-header">不重要</div>
                  <div 
                    class="matrix-cell not-important urgent"
                    @click="selectQuadrant(3)"
                    :class="{ active: selectedQuadrant === 3 }"
                  >
                    <h4>第三象限</h4>
                    <p>尽量委托</p>
                    <ul class="task-list">
                      <li v-for="task in quadrantTasks[3]" :key="task.id" class="task-item">
                        <div class="task-content">
                          <el-checkbox v-model="task.completed" @change="updateTaskStatus(task)"></el-checkbox>
                          <span :class="{ completed: task.completed }">{{ task.content }}</span>
                        </div>
                        <el-button type="danger" size="small" @click="removeTask(task.id, 3)" class="delete-btn">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </li>
                    </ul>
                  </div>
                  <div 
                    class="matrix-cell not-important not-urgent"
                    @click="selectQuadrant(4)"
                    :class="{ active: selectedQuadrant === 4 }"
                  >
                    <h4>第四象限</h4>
                    <p>考虑删减</p>
                    <ul class="task-list">
                      <li v-for="task in quadrantTasks[4]" :key="task.id" class="task-item">
                        <div class="task-content">
                          <el-checkbox v-model="task.completed" @change="updateTaskStatus(task)"></el-checkbox>
                          <span :class="{ completed: task.completed }">{{ task.content }}</span>
                        </div>
                        <el-button type="danger" size="small" @click="removeTask(task.id, 4)" class="delete-btn">
                          <el-icon><Delete /></el-icon>
                        </el-button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div class="task-input-section" v-if="selectedQuadrant">
                <h4>添加任务到第{{ selectedQuadrant }}象限</h4>
                <div class="task-input">
                  <el-input 
                    v-model="newTaskContent" 
                    placeholder="输入新任务..."
                    @keyup.enter="addTask"
                  ></el-input>
                  <el-button type="primary" @click="addTask" :disabled="!newTaskContent.trim()">
                    添加
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 任务分解工具 -->
          <div class="tool-content" v-if="selectedTool === 'task-breakdown'">
            <div class="tool-header">
              <h3 class="tool-title">任务分解</h3>
              <p class="tool-desc">将大型任务分解为可管理的小步骤，减轻压力并提高完成率</p>
            </div>
            
            <div class="task-breakdown">
              <div class="project-section">
                <h4>项目列表</h4>
                <div class="project-list">
                  <div 
                    v-for="project in projects" 
                    :key="project.id"
                    class="project-item"
                    :class="{ active: selectedProject === project.id }"
                    @click="selectProject(project.id)"
                  >
                    <div class="project-info">
                      <h5>{{ project.name }}</h5>
                      <div class="project-progress">
                        <div class="progress-bar">
                          <div 
                            class="progress-fill" 
                            :style="{ width: `${calculateProjectProgress(project.id)}%` }"
                          ></div>
                        </div>
                        <span>{{ calculateProjectProgress(project.id) }}%</span>
                      </div>
                    </div>
                    <div class="project-actions">
                      <el-button type="danger" size="small" @click.stop="removeProject(project.id)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                </div>
                
                <div class="add-project">
                  <el-input 
                    v-model="newProjectName" 
                    placeholder="新项目名称..."
                    @keyup.enter="addProject"
                  ></el-input>
                  <el-button type="primary" @click="addProject" :disabled="!newProjectName.trim()">
                    添加项目
                  </el-button>
                </div>
              </div>
              
              <div class="subtasks-section" v-if="selectedProject">
                <h4>{{ currentProject ? currentProject.name : '' }} - 子任务</h4>
                <div class="subtasks-list">
                  <div 
                    v-for="subtask in projectSubtasks" 
                    :key="subtask.id"
                    class="subtask-item"
                  >
                    <div class="subtask-content">
                      <el-checkbox v-model="subtask.completed" @change="updateSubtaskStatus(subtask)"></el-checkbox>
                      <span :class="{ completed: subtask.completed }">{{ subtask.content }}</span>
                    </div>
                    <div class="subtask-actions">
                      <el-button type="danger" size="small" @click="removeSubtask(subtask.id)">
                        <el-icon><Delete /></el-icon>
                      </el-button>
                    </div>
                  </div>
                  
                  <div class="no-subtasks" v-if="projectSubtasks.length === 0">
                    <p>暂无子任务，添加一些吧！</p>
                  </div>
                </div>
                
                <div class="add-subtask">
                  <el-input 
                    v-model="newSubtaskContent" 
                    placeholder="新子任务..."
                    @keyup.enter="addSubtask"
                  ></el-input>
                  <el-button type="primary" @click="addSubtask" :disabled="!newSubtaskContent.trim()">
                    添加子任务
                  </el-button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 压力评估工具 -->
          <div class="tool-content" v-if="selectedTool === 'stress-assessment'">
            <div class="tool-header">
              <h3 class="tool-title">压力源识别</h3>
              <p class="tool-desc">识别并记录你的压力来源，帮助你更好地理解和应对压力</p>
            </div>
            
            <div class="stress-assessment">
              <div class="stress-form">
                <h4>记录压力源</h4>
                
                <div class="form-group">
                  <label>压力源描述</label>
                  <el-input 
                    v-model="stressSource.description" 
                    type="textarea" 
                    rows="3"
                    placeholder="描述你感到压力的情境或事件..."
                  ></el-input>
                </div>
                
                <div class="form-group">
                  <label>压力级别 (1-10)</label>
                  <el-slider 
                    v-model="stressSource.level" 
                    :min="1" 
                    :max="10"
                    :format-tooltip="formatStressLevel"
                  ></el-slider>
                </div>
                
                <div class="form-group">
                  <label>压力类别</label>
                  <el-select v-model="stressSource.category" placeholder="选择压力类别">
                    <el-option label="工作/学习" value="work"></el-option>
                    <el-option label="人际关系" value="relationships"></el-option>
                    <el-option label="健康" value="health"></el-option>
                    <el-option label="财务" value="financial"></el-option>
                    <el-option label="时间管理" value="time"></el-option>
                    <el-option label="其他" value="other"></el-option>
                  </el-select>
                </div>
                
                <div class="form-group">
                  <label>应对策略</label>
                  <el-input 
                    v-model="stressSource.coping" 
                    type="textarea" 
                    rows="3"
                    placeholder="你计划如何应对这个压力源？"
                  ></el-input>
                </div>
                
                <div class="form-actions">
                  <el-button type="primary" @click="saveStressSource" :disabled="!isStressSourceValid">
                    保存记录
                  </el-button>
                </div>
              </div>
              
              <div class="stress-records">
                <h4>压力源记录</h4>
                
                <div class="records-list" v-if="stressSources.length > 0">
                  <div 
                    v-for="source in stressSources" 
                    :key="source.id"
                    class="record-item"
                  >
                    <div class="record-header">
                      <div class="record-category" :class="source.category">
                        {{ getCategoryLabel(source.category) }}
                      </div>
                      <div class="record-level" :class="getStressLevelClass(source.level)">
                        压力级别: {{ source.level }}/10
                      </div>
                      <div class="record-date">
                        {{ formatDate(source.date) }}
                      </div>
                    </div>
                    
                    <div class="record-body">
                      <h5>压力源描述</h5>
                      <p>{{ source.description }}</p>
                      
                      <h5>应对策略</h5>
                      <p>{{ source.coping }}</p>
                    </div>
                    
                    <div class="record-actions">
                      <el-button type="danger" size="small" @click="removeStressSource(source.id)">
                        删除记录
                      </el-button>
                    </div>
                  </div>
                </div>
                
                <div class="no-records" v-else>
                  <el-icon class="no-records-icon"><DocumentRemove /></el-icon>
                  <p>暂无压力源记录</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 压力管理工具数据
const managementTools = ref([
  {
    id: 'time-management',
    name: '时间管理矩阵',
    description: '基于紧急性和重要性对任务进行分类，帮助你更有效地分配时间',
    icon: 'Calendar'
  },
  {
    id: 'task-breakdown',
    name: '任务分解',
    description: '将大型任务分解为可管理的小步骤，减轻压力并提高完成率',
    icon: 'List'
  },
  {
    id: 'stress-assessment',
    name: '压力源识别',
    description: '识别并记录你的压力来源，帮助你更好地理解和应对压力',
    icon: 'DocumentRemove'
  }
])

// 工具选择
const selectedTool = ref('')

const selectTool = (toolId) => {
  selectedTool.value = toolId
}

// 时间管理矩阵
const selectedQuadrant = ref(null)
const newTaskContent = ref('')
const quadrantTasks = ref({
  1: [], // 重要且紧急
  2: [], // 重要不紧急
  3: [], // 不重要但紧急
  4: []  // 不重要不紧急
})

// 从本地存储加载任务
const loadTasks = () => {
  try {
    const savedTasks = localStorage.getItem('timeMatrixTasks')
    if (savedTasks) {
      quadrantTasks.value = JSON.parse(savedTasks)
    }
  } catch (error) {
    console.error('加载任务失败:', error)
  }
}

// 保存任务到本地存储
const saveTasks = () => {
  try {
    localStorage.setItem('timeMatrixTasks', JSON.stringify(quadrantTasks.value))
  } catch (error) {
    console.error('保存任务失败:', error)
  }
}

const selectQuadrant = (quadrant) => {
  selectedQuadrant.value = quadrant
}

const addTask = () => {
  if (!newTaskContent.value.trim() || !selectedQuadrant.value) return
  
  const newTask = {
    id: Date.now().toString(),
    content: newTaskContent.value.trim(),
    completed: false,
    createdAt: new Date()
  }
  
  quadrantTasks.value[selectedQuadrant.value].push(newTask)
  newTaskContent.value = ''
  saveTasks()
}

const updateTaskStatus = (task) => {
  saveTasks()
}

const removeTask = (taskId, quadrant) => {
  quadrantTasks.value[quadrant] = quadrantTasks.value[quadrant].filter(task => task.id !== taskId)
  saveTasks()
}

// 任务分解工具
const projects = ref([])
const selectedProject = ref(null)
const newProjectName = ref('')
const newSubtaskContent = ref('')

// 从本地存储加载项目和子任务
const loadProjects = () => {
  try {
    const savedProjects = localStorage.getItem('taskBreakdownProjects')
    if (savedProjects) {
      projects.value = JSON.parse(savedProjects)
    }
  } catch (error) {
    console.error('加载项目失败:', error)
  }
}

// 保存项目到本地存储
const saveProjects = () => {
  try {
    localStorage.setItem('taskBreakdownProjects', JSON.stringify(projects.value))
  } catch (error) {
    console.error('保存项目失败:', error)
  }
}

const currentProject = computed(() => {
  return projects.value.find(project => project.id === selectedProject.value) || null
})

const projectSubtasks = computed(() => {
  if (!currentProject.value) return []
  return currentProject.value.subtasks || []
})

const calculateProjectProgress = (projectId) => {
  const project = projects.value.find(p => p.id === projectId)
  if (!project || !project.subtasks || project.subtasks.length === 0) return 0
  
  const completedTasks = project.subtasks.filter(task => task.completed).length
  return Math.round((completedTasks / project.subtasks.length) * 100)
}

const selectProject = (projectId) => {
  selectedProject.value = projectId
}

const addProject = () => {
  if (!newProjectName.value.trim()) return
  
  const newProject = {
    id: Date.now().toString(),
    name: newProjectName.value.trim(),
    createdAt: new Date(),
    subtasks: []
  }
  
  projects.value.push(newProject)
  newProjectName.value = ''
  selectedProject.value = newProject.id
  saveProjects()
}

const removeProject = (projectId) => {
  projects.value = projects.value.filter(project => project.id !== projectId)
  if (selectedProject.value === projectId) {
    selectedProject.value = projects.value.length > 0 ? projects.value[0].id : null
  }
  saveProjects()
}

const addSubtask = () => {
  if (!newSubtaskContent.value.trim() || !selectedProject.value) return
  
  const newSubtask = {
    id: Date.now().toString(),
    content: newSubtaskContent.value.trim(),
    completed: false,
    createdAt: new Date()
  }
  
  const projectIndex = projects.value.findIndex(p => p.id === selectedProject.value)
  if (projectIndex !== -1) {
    if (!projects.value[projectIndex].subtasks) {
      projects.value[projectIndex].subtasks = []
    }
    projects.value[projectIndex].subtasks.push(newSubtask)
    newSubtaskContent.value = ''
    saveProjects()
  }
}

const updateSubtaskStatus = (subtask) => {
  saveProjects()
}

const removeSubtask = (subtaskId) => {
  const projectIndex = projects.value.findIndex(p => p.id === selectedProject.value)
  if (projectIndex !== -1 && projects.value[projectIndex].subtasks) {
    projects.value[projectIndex].subtasks = projects.value[projectIndex].subtasks.filter(
      task => task.id !== subtaskId
    )
    saveProjects()
  }
}

// 压力评估工具
const stressSource = ref({
  description: '',
  level: 5,
  category: '',
  coping: ''
})

const stressSources = ref([])

// 从本地存储加载压力源记录
const loadStressSources = () => {
  try {
    const savedSources = localStorage.getItem('stressSources')
    if (savedSources) {
      stressSources.value = JSON.parse(savedSources)
    }
  } catch (error) {
    console.error('加载压力源记录失败:', error)
  }
}

// 保存压力源记录到本地存储
const saveStressSources = () => {
  try {
    localStorage.setItem('stressSources', JSON.stringify(stressSources.value))
  } catch (error) {
    console.error('保存压力源记录失败:', error)
  }
}

const isStressSourceValid = computed(() => {
  return (
    stressSource.value.description.trim() !== '' &&
    stressSource.value.category !== '' &&
    stressSource.value.coping.trim() !== ''
  )
})

const formatStressLevel = (val) => {
  const levels = [
    '很低',
    '低',
    '较低',
    '中低',
    '中等',
    '中高',
    '较高',
    '高',
    '很高',
    '极高'
  ]
  return `${val}: ${levels[val - 1]}`
}

const getStressLevelClass = (level) => {
  if (level <= 3) return 'low'
  if (level <= 6) return 'medium'
  return 'high'
}

const getCategoryLabel = (category) => {
  const categories = {
    work: '工作/学习',
    relationships: '人际关系',
    health: '健康',
    financial: '财务',
    time: '时间管理',
    other: '其他'
  }
  return categories[category] || '未分类'
}

const saveStressSource = () => {
  if (!isStressSourceValid.value) return
  
  const newSource = {
    id: Date.now().toString(),
    description: stressSource.value.description.trim(),
    level: stressSource.value.level,
    category: stressSource.value.category,
    coping: stressSource.value.coping.trim(),
    date: new Date()
  }
  
  stressSources.value.unshift(newSource)
  saveStressSources()
  
  // 重置表单
  stressSource.value = {
    description: '',
    level: 5,
    category: '',
    coping: ''
  }
}

const removeStressSource = (sourceId) => {
  stressSources.value = stressSources.value.filter(source => source.id !== sourceId)
  saveStressSources()
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 加载保存的数据
  loadTasks()
  loadProjects()
  loadStressSources()
  
  // 默认选择第一个工具
  if (managementTools.value.length > 0) {
    selectedTool.value = managementTools.value[0].id
  }
})
</script>

<style scoped lang="scss">
.stress-management-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #F0F8FF 0%, #E6F0FF 100%);
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 20px 0;
}

.content-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  
  .page-title {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #4A90E2;
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

.stress-management-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.tool-selector {
  background: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(74, 144, 226, 0.1);
}

.section-title, .tool-title {
  color: #4A90E2;
  margin-bottom: 25px;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
}

.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.tool-card {
  background: #FAFAFA;
  border: 2px solid #E0E0E0;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    border-color: #A0C4FF;
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #4A90E2;
    background: #F0F8FF;
  }
}

.tool-icon {
  color: #4A90E2;
  margin-bottom: 15px;
  
  .el-icon {
    font-size: 32px;
  }
}

.tool-name {
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 10px;
}

.tool-desc {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
}

.tool-content {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(74, 144, 226, 0.1);
}

.tool-header {
  text-align: center;
  margin-bottom: 30px;
}

/* 时间管理矩阵样式 */
.time-matrix {
  margin-top: 30px;
}

.matrix-grid {
  display: grid;
  grid-template-columns: 100px 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  gap: 10px;
  margin-bottom: 30px;
}

.matrix-header-row {
  display: contents;
}

.matrix-corner {
  background: #F5F5F5;
  border-radius: 10px;
}

.matrix-header {
  background: #4A90E2;
  color: white;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border-radius: 10px;
  text-align: center;
}

.matrix-row {
  display: contents;
}

.matrix-cell {
  background: #FAFAFA;
  border-radius: 10px;
  padding: 20px;
  min-height: 200px;
  cursor: pointer;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #4A90E2;
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.2);
  }
  
  h4 {
    color: #333;
    margin-top: 0;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
    margin-top: 0;
    margin-bottom: 15px;
    font-style: italic;
  }
}

.important.urgent {
  background: #FFEBEE;
}

.important.not-urgent {
  background: #E8F5E9;
}

.not-important.urgent {
  background: #FFF8E1;
}

.not-important.not-urgent {
  background: #F5F5F5;
}

.task-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.task-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  &:last-child {
    border-bottom: none;
  }
}

.task-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  
  .completed {
    text-decoration: line-through;
    color: #999;
  }
}

.delete-btn {
  padding: 4px;
  height: auto;
}

.task-input-section {
  background: #F5F5F5;
  padding: 20px;
  border-radius: 10px;
  
  h4 {
    color: #4A90E2;
    margin-top: 0;
    margin-bottom: 15px;
  }
}

.task-input {
  display: flex;
  gap: 10px;
  
  .el-input {
    flex: 1;
  }
}

/* 任务分解工具样式 */
.task-breakdown {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.project-section, .subtasks-section {
  background: #FAFAFA;
  padding: 20px;
  border-radius: 10px;
  
  h4 {
    color: #4A90E2;
    margin-top: 0;
    margin-bottom: 20px;
  }
}

.project-list {
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.project-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
  border: 2px solid transparent;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  &.active {
    border-color: #4A90E2;
    box-shadow: 0 5px 15px rgba(74, 144, 226, 0.2);
  }
  
  h5 {
    margin: 0 0 10px 0;
    color: #333;
  }
}

.project-info {
  flex: 1;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 10px;
  
  .progress-bar {
    flex: 1;
    height: 6px;
    background: #E0E0E0;
    border-radius: 3px;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(135deg, #4A90E2 0%, #A0C4FF 100%);
    transition: width 0.3s ease;
  }
  
  span {
    font-size: 12px;
    color: #666;
    min-width: 40px;
    text-align: right;
  }
}

.add-project, .add-subtask {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  
  .el-input {
    flex: 1;
  }
}

.subtasks-list {
  margin-bottom: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.subtask-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.subtask-content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  
  .completed {
    text-decoration: line-through;
    color: #999;
  }
}

.no-subtasks {
  text-align: center;
  padding: 30px;
  color: #999;
  font-style: italic;
}

/* 压力评估工具样式 */
.stress-assessment {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.stress-form {
  background: #FAFAFA;
  padding: 20px;
  border-radius: 10px;
  
  h4 {
    color: #4A90E2;
    margin-top: 0;
    margin-bottom: 20px;
  }
}

.form-group {
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: #333;
    font-weight: 500;
  }
}

.form-actions {
  margin-top: 30px;
  text-align: right;
}

.stress-records {
  background: #FAFAFA;
  padding: 20px;
  border-radius: 10px;
  
  h4 {
    color: #4A90E2;
    margin-top: 0;
    margin-bottom: 20px;
  }
}

.records-list {
  max-height: 500px;
  overflow-y: auto;
}

.record-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 15px;
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.record-category {
  background: #E0E0E0;
  color: #333;
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  
  &.work {
    background: #BBDEFB;
    color: #1565C0;
  }
  
  &.relationships {
    background: #D1C4E9;
    color: #4527A0;
  }
  
  &.health {
    background: #C8E6C9;
    color: #2E7D32;
  }
  
  &.financial {
    background: #FFECB3;
    color: #FF8F00;
  }
  
  &.time {
    background: #B3E5FC;
    color: #0277BD;
  }
  
  &.other {
    background: #E1BEE7;
    color: #6A1B9A;
  }
}

.record-level {
  padding: 4px 10px;
  border-radius: 15px;
  font-size: 12px;
  
  &.low {
    background: #C8E6C9;
    color: #2E7D32;
  }
  
  &.medium {
    background: #FFECB3;
    color: #FF8F00;
  }
  
  &.high {
    background: #FFCDD2;
    color: #C62828;
  }
}

.record-date {
  color: #999;
  font-size: 12px;
}

.record-body {
  h5 {
    color: #4A90E2;
    margin: 15px 0 5px 0;
    font-size: 14px;
  }
  
  p {
    color: #333;
    margin: 0 0 15px 0;
    line-height: 1.5;
  }
}

.record-actions {
  text-align: right;
  margin-top: 15px;
}

.no-records {
  text-align: center;
  padding: 40px;
  color: #999;
  
  .no-records-icon {
    font-size: 48px;
    color: #A0C4FF;
    margin-bottom: 15px;
  }
  
  p {
    margin: 5px 0;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 24px;
  }
  
  .tool-grid {
    grid-template-columns: 1fr;
  }
  
  .matrix-grid {
    grid-template-columns: 80px 1fr 1fr;
  }
  
  .matrix-cell {
    padding: 15px;
    min-height: 150px;
  }
}
</style>