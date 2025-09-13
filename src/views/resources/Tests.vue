<template>
  <div class="tests-page">
    <div class="tests-container">
      <!-- 测试列表 -->
      <div class="tests-list">
        <h3 class="section-title">心理测试</h3>
        <p class="section-desc">以下测试基于专业心理量表设计，可帮助你了解自己的心理状态</p>
        
        <el-tabs v-model="activeCategory">
          <el-tab-pane v-for="category in testCategories" :key="category.id" :label="category.name" :name="category.id">
            <div class="tests-grid">
              <div 
                v-for="test in getTestsByCategory(category.id)" 
                :key="test.id"
                class="test-card"
                @click="selectTest(test.id)"
              >
                <div class="test-icon">
                  <el-icon><component :is="test.icon" /></el-icon>
                </div>
                <div class="test-info">
                  <h4 class="test-title">{{ test.title }}</h4>
                  <p class="test-desc">{{ test.description }}</p>
                  <div class="test-meta">
                    <span class="test-questions">{{ test.questionCount }}题</span>
                    <span class="test-time">约{{ test.timeMinutes }}分钟</span>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      
      <!-- 测试详情 -->
      <el-dialog
        v-model="showTestDialog"
        :title="currentTest ? currentTest.title : ''"
        width="80%"
        destroy-on-close
      >
        <div class="test-dialog-content" v-if="currentTest">
          <!-- 测试介绍 -->
          <div v-if="testStage === 'intro'" class="test-intro">
            <div class="test-intro-header">
              <div class="test-icon large">
                <el-icon :size="32"><component :is="currentTest.icon" /></el-icon>
              </div>
              <h3>{{ currentTest.title }}</h3>
            </div>
            
            <div class="test-intro-content">
              <p class="test-full-desc">{{ currentTest.fullDescription }}</p>
              
              <div class="test-info-box">
                <div class="info-item">
                  <el-icon><QuestionFilled /></el-icon>
                  <span>{{ currentTest.questionCount }}个问题</span>
                </div>
                <div class="info-item">
                  <el-icon><Timer /></el-icon>
                  <span>约{{ currentTest.timeMinutes }}分钟</span>
                </div>
                <div class="info-item">
                  <el-icon><InfoFilled /></el-icon>
                  <span>{{ currentTest.source }}</span>
                </div>
              </div>
              
              <div class="test-instructions">
                <h4>测试说明</h4>
                <ul>
                  <li v-for="(instruction, index) in currentTest.instructions" :key="index">
                    {{ instruction }}
                  </li>
                </ul>
              </div>
            </div>
            
            <div class="test-intro-actions">
              <el-button @click="showTestDialog = false">取消</el-button>
              <el-button type="primary" @click="startTest">开始测试</el-button>
            </div>
          </div>
          
          <!-- 测试问题 -->
          <div v-if="testStage === 'questions'" class="test-questions">
            <div class="test-progress">
              <el-progress :percentage="progressPercentage" :format="progressFormat" />
            </div>
            
            <div class="question-container">
              <h4 class="question-text">{{ currentQuestion.text }}</h4>
              
              <div class="answer-options">
                <el-radio-group v-model="currentAnswer">
                  <el-radio 
                    v-for="option in currentQuestion.options" 
                    :key="option.value" 
                    :label="option.value"
                    class="answer-option"
                  >
                    {{ option.text }}
                  </el-radio>
                </el-radio-group>
              </div>
            </div>
            
            <div class="question-actions">
              <el-button @click="prevQuestion" :disabled="currentQuestionIndex === 0">上一题</el-button>
              <el-button type="primary" @click="nextQuestion" :disabled="!currentAnswer">{{ isLastQuestion ? '完成' : '下一题' }}</el-button>
            </div>
          </div>
          
          <!-- 测试结果 -->
          <div v-if="testStage === 'result'" class="test-result">
            <div class="result-header">
              <el-icon class="result-icon" :size="48"><DataAnalysis /></el-icon>
              <h3>测试结果</h3>
            </div>
            
            <div class="result-summary">
              <h4>{{ getResultSummary() }}</h4>
              <p>{{ getResultDescription() }}</p>
            </div>
            
            <div class="result-chart">
              <div ref="resultChart" class="chart"></div>
            </div>
            
            <div class="result-details">
              <h4>详细分析</h4>
              <div class="result-detail-item" v-for="(detail, index) in getResultDetails()" :key="index">
                <h5>{{ detail.title }}</h5>
                <p>{{ detail.content }}</p>
              </div>
            </div>
            
            <div class="result-suggestions">
              <h4>建议</h4>
              <ul>
                <li v-for="(suggestion, index) in getResultSuggestions()" :key="index">
                  {{ suggestion }}
                </li>
              </ul>
            </div>
            
            <div class="result-actions">
              <el-button @click="showTestDialog = false">关闭</el-button>
              <el-button type="primary" @click="saveResult">保存结果</el-button>
              <el-button @click="restartTest">重新测试</el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      
      <!-- 历史测试结果 -->
      <div class="test-history" v-if="testResults.length > 0">
        <h3 class="section-title">历史测试结果</h3>
        
        <el-table :data="testResults" style="width: 100%">
          <el-table-column prop="date" label="日期" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.date) }}
            </template>
          </el-table-column>
          <el-table-column prop="testTitle" label="测试名称" width="180" />
          <el-table-column prop="result" label="结果" />
          <el-table-column label="操作" width="150">
            <template #default="scope">
              <el-button size="small" @click="viewResult(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import * as echarts from 'echarts'
import { 
  QuestionFilled, 
  Timer, 
  InfoFilled, 
  DataAnalysis,
  Aim,
  Lightning,
  MagicStick,
  Sunny
} from '@element-plus/icons-vue'

const router = useRouter()

// 测试分类
const testCategories = [
  { id: 'emotion', name: '情绪测试' },
  { id: 'personality', name: '人格测试' },
  { id: 'stress', name: '压力测试' },
  { id: 'relationship', name: '人际关系' }
]

// 测试数据
const tests = [
  {
    id: 'anxiety',
    title: '焦虑自评量表 (SAS)',
    description: '评估你当前的焦虑水平',
    fullDescription: '焦虑自评量表(Self-Rating Anxiety Scale, SAS)由William WK Zung于1971年编制，用于评定受测者主观感受的焦虑程度，量表共有20个项目，包括主观感受和客观体验。',
    category: 'emotion',
    icon: 'Lightning',
    questionCount: 20,
    timeMinutes: 5,
    source: '基于Zung焦虑自评量表(SAS)',
    instructions: [
      '请根据最近一周的感受回答问题',
      '每个问题选择一个最符合你情况的选项',
      '请尽量诚实回答，没有对错之分'
    ],
    questions: [
      {
        text: '我感到比平常更紧张和焦虑',
        options: [
          { text: '没有或很少时间', value: 1 },
          { text: '小部分时间', value: 2 },
          { text: '相当多时间', value: 3 },
          { text: '绝大部分或全部时间', value: 4 }
        ]
      },
      {
        text: '我无缘无故地感到害怕',
        options: [
          { text: '没有或很少时间', value: 1 },
          { text: '小部分时间', value: 2 },
          { text: '相当多时间', value: 3 },
          { text: '绝大部分或全部时间', value: 4 }
        ]
      },
      {
        text: '我容易心里烦乱或感到惊恐',
        options: [
          { text: '没有或很少时间', value: 1 },
          { text: '小部分时间', value: 2 },
          { text: '相当多时间', value: 3 },
          { text: '绝大部分或全部时间', value: 4 }
        ]
      },
      // 这里省略了其他问题，实际应该有20个问题
    ]
  },
  {
    id: 'depression',
    title: '抑郁自评量表 (SDS)',
    description: '评估你当前的抑郁水平',
    fullDescription: '抑郁自评量表(Self-Rating Depression Scale, SDS)由William WK Zung于1965年编制，用于评定受测者主观感受的抑郁程度，量表共有20个项目。',
    category: 'emotion',
    icon: 'Aim',
    questionCount: 20,
    timeMinutes: 5,
    source: '基于Zung抑郁自评量表(SDS)',
    instructions: [
      '请根据最近一周的感受回答问题',
      '每个问题选择一个最符合你情况的选项',
      '请尽量诚实回答，没有对错之分'
    ],
    questions: [
      {
        text: '我感到情绪沮丧，郁闷',
        options: [
          { text: '没有或很少时间', value: 1 },
          { text: '小部分时间', value: 2 },
          { text: '相当多时间', value: 3 },
          { text: '绝大部分或全部时间', value: 4 }
        ]
      },
      {
        text: '我感到早晨心情最好',
        options: [
          { text: '没有或很少时间', value: 4 },
          { text: '小部分时间', value: 3 },
          { text: '相当多时间', value: 2 },
          { text: '绝大部分或全部时间', value: 1 }
        ]
      },
      {
        text: '我一阵阵地哭出来或觉得想哭',
        options: [
          { text: '没有或很少时间', value: 1 },
          { text: '小部分时间', value: 2 },
          { text: '相当多时间', value: 3 },
          { text: '绝大部分或全部时间', value: 4 }
        ]
      },
      // 这里省略了其他问题，实际应该有20个问题
    ]
  },
  {
    id: 'stress',
    title: '压力知觉量表 (PSS)',
    description: '评估你当前的压力水平',
    fullDescription: '压力知觉量表(Perceived Stress Scale, PSS)由Cohen等人于1983年编制，用于评估个体在过去一个月中对生活中各种情境的压力知觉程度。',
    category: 'stress',
    icon: 'MagicStick',
    questionCount: 14,
    timeMinutes: 4,
    source: '基于Cohen压力知觉量表(PSS)',
    instructions: [
      '请根据过去一个月的感受回答问题',
      '每个问题选择一个最符合你情况的选项',
      '请尽量诚实回答，没有对错之分'
    ],
    questions: [
      {
        text: '在过去的一个月里，你有多少次因为发生了意外而感到心烦意乱？',
        options: [
          { text: '从不', value: 0 },
          { text: '几乎不', value: 1 },
          { text: '有时', value: 2 },
          { text: '经常', value: 3 },
          { text: '很频繁', value: 4 }
        ]
      },
      {
        text: '在过去的一个月里，你有多少次感到无法控制生活中的重要事情？',
        options: [
          { text: '从不', value: 0 },
          { text: '几乎不', value: 1 },
          { text: '有时', value: 2 },
          { text: '经常', value: 3 },
          { text: '很频繁', value: 4 }
        ]
      },
      // 这里省略了其他问题，实际应该有14个问题
    ]
  },
  {
    id: 'personality',
    title: '大五人格特质量表',
    description: '了解你的人格特质',
    fullDescription: '大五人格特质量表基于五因素人格理论，测量开放性、尽责性、外向性、宜人性和神经质这五个维度的人格特质。',
    category: 'personality',
    icon: 'Sunny',
    questionCount: 25,
    timeMinutes: 8,
    source: '基于大五人格特质量表(Big Five)',
    instructions: [
      '请根据你对自己的了解回答问题',
      '每个问题选择一个最符合你情况的选项',
      '请尽量诚实回答，没有对错之分'
    ],
    questions: [
      {
        text: '我是一个喜欢与人交往的人',
        options: [
          { text: '非常不符合', value: 1 },
          { text: '比较不符合', value: 2 },
          { text: '不确定', value: 3 },
          { text: '比较符合', value: 4 },
          { text: '非常符合', value: 5 }
        ]
      },
      {
        text: '我是一个有条理的人',
        options: [
          { text: '非常不符合', value: 1 },
          { text: '比较不符合', value: 2 },
          { text: '不确定', value: 3 },
          { text: '比较符合', value: 4 },
          { text: '非常符合', value: 5 }
        ]
      },
      // 这里省略了其他问题，实际应该有25个问题
    ]
  }
]

// 当前选中的分类
const activeCategory = ref('emotion')

// 根据分类获取测试
const getTestsByCategory = (categoryId) => {
  return tests.filter(test => test.category === categoryId)
}

// 测试对话框控制
const showTestDialog = ref(false)
const currentTest = ref(null)
const testStage = ref('intro') // intro, questions, result

// 选择测试
const selectTest = (testId) => {
  currentTest.value = tests.find(test => test.id === testId)
  testStage.value = 'intro'
  showTestDialog.value = true
}

// 开始测试
const currentQuestionIndex = ref(0)
const currentAnswer = ref(null)
const answers = ref([])

const startTest = () => {
  testStage.value = 'questions'
  currentQuestionIndex.value = 0
  answers.value = Array(currentTest.value.questions.length).fill(null)
  currentAnswer.value = null
}

// 当前问题
const currentQuestion = computed(() => {
  if (!currentTest.value || !currentTest.value.questions) return null
  return currentTest.value.questions[currentQuestionIndex.value]
})

// 是否最后一题
const isLastQuestion = computed(() => {
  if (!currentTest.value || !currentTest.value.questions) return true
  return currentQuestionIndex.value === currentTest.value.questions.length - 1
})

// 进度百分比
const progressPercentage = computed(() => {
  if (!currentTest.value || !currentTest.value.questions) return 0
  return Math.round(((currentQuestionIndex.value + 1) / currentTest.value.questions.length) * 100)
})

const progressFormat = (percentage) => {
  return `${currentQuestionIndex.value + 1}/${currentTest.value.questions.length}`
}

// 上一题
const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    answers.value[currentQuestionIndex.value] = currentAnswer.value
    currentQuestionIndex.value--
    currentAnswer.value = answers.value[currentQuestionIndex.value]
  }
}

// 下一题
const nextQuestion = () => {
  answers.value[currentQuestionIndex.value] = currentAnswer.value
  
  if (isLastQuestion.value) {
    // 完成测试，显示结果
    calculateResult()
    testStage.value = 'result'
  } else {
    // 进入下一题
    currentQuestionIndex.value++
    currentAnswer.value = answers.value[currentQuestionIndex.value]
  }
}

// 计算测试结果
const testScore = ref(0)
const testLevel = ref('')

const calculateResult = () => {
  // 简单示例：计算总分
  const totalScore = answers.value.reduce((sum, answer) => sum + (answer || 0), 0)
  testScore.value = totalScore
  
  // 根据不同测试设置不同的评分标准
  if (currentTest.value.id === 'anxiety') {
    // SAS评分标准
    const standardScore = Math.round(totalScore * 1.25) // SAS需要乘以1.25得到标准分
    testScore.value = standardScore
    
    if (standardScore < 50) {
      testLevel.value = 'normal'
    } else if (standardScore < 60) {
      testLevel.value = 'mild'
    } else if (standardScore < 70) {
      testLevel.value = 'moderate'
    } else {
      testLevel.value = 'severe'
    }
  } else if (currentTest.value.id === 'depression') {
    // SDS评分标准
    const standardScore = Math.round(totalScore * 1.25) // SDS需要乘以1.25得到标准分
    testScore.value = standardScore
    
    if (standardScore < 53) {
      testLevel.value = 'normal'
    } else if (standardScore < 63) {
      testLevel.value = 'mild'
    } else if (standardScore < 73) {
      testLevel.value = 'moderate'
    } else {
      testLevel.value = 'severe'
    }
  } else {
    // 其他测试的评分标准
    // 这里简化处理，实际应根据具体测试设计评分标准
    const maxPossibleScore = currentTest.value.questions.length * 5 // 假设每题最高5分
    const percentage = (totalScore / maxPossibleScore) * 100
    
    if (percentage < 30) {
      testLevel.value = 'low'
    } else if (percentage < 70) {
      testLevel.value = 'medium'
    } else {
      testLevel.value = 'high'
    }
  }
}

// 获取结果摘要
const getResultSummary = () => {
  const testId = currentTest.value.id
  const score = testScore.value
  
  if (testId === 'anxiety') {
    if (testLevel.value === 'normal') {
      return `焦虑水平正常 (${score}分)`
    } else if (testLevel.value === 'mild') {
      return `轻度焦虑 (${score}分)`
    } else if (testLevel.value === 'moderate') {
      return `中度焦虑 (${score}分)`
    } else {
      return `重度焦虑 (${score}分)`
    }
  } else if (testId === 'depression') {
    if (testLevel.value === 'normal') {
      return `抑郁水平正常 (${score}分)`
    } else if (testLevel.value === 'mild') {
      return `轻度抑郁 (${score}分)`
    } else if (testLevel.value === 'moderate') {
      return `中度抑郁 (${score}分)`
    } else {
      return `重度抑郁 (${score}分)`
    }
  } else {
    // 其他测试的结果摘要
    return `测试得分: ${score}分`
  }
}

// 获取结果描述
const getResultDescription = () => {
  const testId = currentTest.value.id
  
  if (testId === 'anxiety') {
    if (testLevel.value === 'normal') {
      return '你的焦虑水平在正常范围内，这表明你能够有效地应对日常生活中的压力和挑战。'
    } else if (testLevel.value === 'mild') {
      return '你有轻度焦虑症状，可能会在某些情况下感到紧张或担忧，但通常不会严重影响日常生活。'
    } else if (testLevel.value === 'moderate') {
      return '你有中度焦虑症状，这可能会对你的日常生活和工作产生一定影响。建议寻求专业帮助。'
    } else {
      return '你有重度焦虑症状，这可能会严重影响你的日常生活和工作。强烈建议尽快寻求专业心理咨询或医疗帮助。'
    }
  } else if (testId === 'depression') {
    if (testLevel.value === 'normal') {
      return '你的抑郁水平在正常范围内，这表明你的情绪状态良好。'
    } else if (testLevel.value === 'mild') {
      return '你有轻度抑郁症状，可能会感到情绪低落，但通常不会严重影响日常生活。'
    } else if (testLevel.value === 'moderate') {
      return '你有中度抑郁症状，这可能会对你的日常生活和工作产生一定影响。建议寻求专业帮助。'
    } else {
      return '你有重度抑郁症状，这可能会严重影响你的日常生活和工作。强烈建议尽快寻求专业心理咨询或医疗帮助。'
    }
  } else {
    // 其他测试的结果描述
    return '这是你的测试结果描述。'
  }
}

// 获取结果详细分析
const getResultDetails = () => {
  const testId = currentTest.value.id
  
  if (testId === 'anxiety') {
    return [
      {
        title: '情绪症状',
        content: '焦虑情绪表现为紧张、担忧、恐惧等负面情绪体验。'
      },
      {
        title: '认知症状',
        content: '焦虑的认知症状包括对威胁的过度关注、灾难化思维等。'
      },
      {
        title: '生理症状',
        content: '焦虑的生理症状包括心跳加速、呼吸急促、肌肉紧张等。'
      },
      {
        title: '行为症状',
        content: '焦虑的行为症状包括回避、安全行为、寻求保证等。'
      }
    ]
  } else if (testId === 'depression') {
    return [
      {
        title: '情绪症状',
        content: '抑郁情绪表现为持续的悲伤、空虚、绝望等负面情绪体验。'
      },
      {
        title: '认知症状',
        content: '抑郁的认知症状包括消极思维、自我批评、注意力和记忆力下降等。'
      },
      {
        title: '生理症状',
        content: '抑郁的生理症状包括睡眠问题、食欲改变、疲劳、精力减退等。'
      },
      {
        title: '行为症状',
        content: '抑郁的行为症状包括社交退缩、活动减少、动作迟缓等。'
      }
    ]
  } else {
    // 其他测试的结果详细分析
    return [
      {
        title: '分析1',
        content: '这是测试结果的详细分析1。'
      },
      {
        title: '分析2',
        content: '这是测试结果的详细分析2。'
      }
    ]
  }
}

// 获取结果建议
const getResultSuggestions = () => {
  const testId = currentTest.value.id
  
  if (testId === 'anxiety') {
    if (testLevel.value === 'normal') {
      return [
        '继续保持健康的生活方式和积极的心态',
        '定期进行放松训练，如深呼吸、冥想等',
        '保持规律的运动习惯',
        '培养良好的社交关系'
      ]
    } else if (testLevel.value === 'mild') {
      return [
        '学习并实践放松技巧，如深呼吸、渐进性肌肉放松等',
        '尝试正念冥想，提高对当下的觉察',
        '适当增加体育锻炼，有助于缓解焦虑',
        '保持规律的作息时间',
        '减少咖啡因和酒精的摄入'
      ]
    } else {
      return [
        '建议寻求专业心理咨询师或精神科医生的帮助',
        '学习认知行为疗法(CBT)的技巧来应对焦虑',
        '建立支持系统，与亲友分享你的感受',
        '避免使用酒精或药物来缓解焦虑',
        '保持健康的生活方式，包括规律作息、均衡饮食和适当运动'
      ]
    }
  } else if (testId === 'depression') {
    if (testLevel.value === 'normal') {
      return [
        '继续保持健康的生活方式和积极的心态',
        '培养兴趣爱好，增加生活乐趣',
        '保持良好的社交关系',
        '定期进行自我反思和情绪调节'
      ]
    } else if (testLevel.value === 'mild') {
      return [
        '增加日常活动和社交互动',
        '制定并坚持日常计划和目标',
        '学习积极思维技巧',
        '保持规律的作息时间和健康饮食',
        '适当增加体育锻炼，有助于改善情绪'
      ]
    } else {
      return [
        '强烈建议寻求专业心理咨询师或精神科医生的帮助',
        '学习认知行为疗法(CBT)的技巧来应对抑郁',
        '建立支持系统，与亲友分享你的感受',
        '避免重大生活决策，直到情绪状态改善',
        '保持健康的生活方式，包括规律作息、均衡饮食和适当运动'
      ]
    }
  } else {
    // 其他测试的结果建议
    return [
      '这是测试结果的建议1',
      '这是测试结果的建议2',
      '这是测试结果的建议3'
    ]
  }
}

// 结果图表
let resultChart = null

const initResultChart = () => {
  if (!document.getElementById('resultChart')) return
  
  const chartDom = document.getElementById('resultChart')
  resultChart = echarts.init(chartDom)
  
  const testId = currentTest.value.id
  let option = {}
  
  if (testId === 'anxiety' || testId === 'depression') {
    // 焦虑或抑郁测试的仪表盘图表
    option = {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 100,
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: 30,
            color: [
              [0.5, '#91cc75'],
              [0.7, '#fac858'],
              [0.9, '#ee6666'],
              [1, '#73c0de']
            ]
          }
        },
        pointer: {
          icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
          length: '12%',
          width: 20,
          offsetCenter: [0, '-60%'],
          itemStyle: {
            color: 'auto'
          }
        },
        axisTick: {
          length: 12,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        },
        splitLine: {
          length: 20,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        },
        axisLabel: {
          color: '#464646',
          fontSize: 20,
          distance: -60,
          formatter: function (value) {
            if (value === 0) {
              return '正常';
            } else if (value === 50) {
              return '轻度';
            } else if (value === 75) {
              return '中度';
            } else if (value === 100) {
              return '重度';
            }
            return '';
          }
        },
        title: {
          offsetCenter: [0, '-20%'],
          fontSize: 20
        },
        detail: {
          fontSize: 30,
          offsetCenter: [0, '0%'],
          valueAnimation: true,
          formatter: function (value) {
            return Math.round(value) + '分';
          },
          color: 'auto'
        },
        data: [{
          value: testScore.value,
          name: testId === 'anxiety' ? '焦虑水平' : '抑郁水平'
        }]
      }]
    };
  } else {
    // 其他测试的雷达图
    option = {
      radar: {
        indicator: [
          { name: '维度1', max: 100 },
          { name: '维度2', max: 100 },
          { name: '维度3', max: 100 },
          { name: '维度4', max: 100 },
          { name: '维度5', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: [{
          value: [80, 50, 60, 70, 90],
          name: '测试结果'
        }]
      }]
    };
  }
  
  resultChart.setOption(option);
}

// 监听结果阶段，初始化图表
watch(() => testStage.value, (newVal) => {
  if (newVal === 'result') {
    nextTick(() => {
      initResultChart()
    })
  }
})

// 保存结果
const testResults = ref([])

const saveResult = () => {
  const result = {
    id: Date.now().toString(),
    testId: currentTest.value.id,
    testTitle: currentTest.value.title,
    date: new Date(),
    score: testScore.value,
    level: testLevel.value,
    result: getResultSummary(),
    description: getResultDescription(),
    suggestions: getResultSuggestions()
  }
  
  testResults.value.unshift(result)
  showTestDialog.value = false
  
  // 显示保存成功提示
  ElMessage({
    message: '测试结果已保存',
    type: 'success'
  })
}

// 重新测试
const restartTest = () => {
  testStage.value = 'intro'
}

// 查看历史结果
const viewResult = (result) => {
  currentTest.value = tests.find(test => test.id === result.testId)
  testScore.value = result.score
  testLevel.value = result.level
  testStage.value = 'result'
  showTestDialog.value = true
}

// 格式化日期
const formatDate = (date) => {
  const d = new Date(date)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

// 窗口大小变化时重新调整图表大小
onMounted(() => {
  window.addEventListener('resize', () => {
    if (resultChart) {
      resultChart.resize()
    }
  })
})
</script>

<style scoped lang="scss">
.tests-page {
  padding: 2rem 0;
}

.tests-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.section-title {
  font-size: 1.5rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.section-desc {
  color: #718096;
  margin-bottom: 1.5rem;
}

.tests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.test-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
  
  .test-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background-color: #ebf8ff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
    
    .el-icon {
      font-size: 24px;
      color: #3498db;
    }
    
    &.large {
      width: 80px;
      height: 80px;
      
      .el-icon {
        font-size: 40px;
      }
    }
  }
  
  .test-info {
    flex: 1;
  }
  
  .test-title {
    font-size: 1.2rem;
    color: #2d3748;
    margin-bottom: 0.5rem;
  }
  
  .test-desc {
    color: #718096;
    margin-bottom: 1rem;
    font-size: 0.9rem;
  }
  
  .test-meta {
    display: flex;
    gap: 1rem;
    font-size: 0.8rem;
    color: #a0aec0;
  }
}

.test-dialog-content {
  padding: 1rem;
}

.test-intro {
  .test-intro-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    
    h3 {
      font-size: 1.5rem;
      color: #2d3748;
      margin-top: 1rem;
    }
  }
  
  .test-full-desc {
    color: #4a5568;
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }
  
  .test-info-box {
    display: flex;
    justify-content: space-around;
    background-color: #f7fafc;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    
    .info-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      
      .el-icon {
        color: #3498db;
      }
    }
  }
  
  .test-instructions {
    background-color: #ebf8ff;
    padding: 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    
    h4 {
      color: #2b6cb0;
      margin-bottom: 0.5rem;
    }
    
    ul {
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #4a5568;
      }
    }
  }
  
  .test-intro-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
  }
}

.test-questions {
  .test-progress {
    margin-bottom: 2rem;
  }
  
  .question-container {
    background-color: #f7fafc;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    
    .question-text {
      font-size: 1.2rem;
      color: #2d3748;
      margin-bottom: 1.5rem;
    }
    
    .answer-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .answer-option {
        margin-left: 0;
        padding: 0.5rem;
        width: 100%;
        transition: background-color 0.3s;
        border-radius: 4px;
        
        &:hover {
          background-color: #edf2f7;
        }
      }
    }
  }
  
  .question-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }
}

.test-result {
  .result-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 2rem;
    
    .result-icon {
      color: #3498db;
      margin-bottom: 1rem;
    }
    
    h3 {
      font-size: 1.5rem;
      color: #2d3748;
    }
  }
  
  .result-summary {
    text-align: center;
    margin-bottom: 2rem;
    
    h4 {
      font-size: 1.3rem;
      color: #2d3748;
      margin-bottom: 0.5rem;
    }
    
    p {
      color: #4a5568;
      line-height: 1.6;
    }
  }
  
  .result-chart {
    height: 300px;
    margin-bottom: 2rem;
    
    .chart {
      width: 100%;
      height: 100%;
    }
  }
  
  .result-details {
    background-color: #f7fafc;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    
    h4 {
      font-size: 1.2rem;
      color: #2d3748;
      margin-bottom: 1rem;
    }
    
    .result-detail-item {
      margin-bottom: 1rem;
      
      h5 {
        font-size: 1rem;
        color: #4a5568;
        margin-bottom: 0.3rem;
      }
      
      p {
        color: #718096;
      }
    }
  }
  
  .result-suggestions {
    background-color: #ebf8ff;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
    
    h4 {
      font-size: 1.2rem;
      color: #2b6cb0;
      margin-bottom: 1rem;
    }
    
    ul {
      padding-left: 1.5rem;
      
      li {
        margin-bottom: 0.5rem;
        color: #4a5568;
      }
    }
  }
  
  .result-actions {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
  }
}

.test-history {
  margin-top: 3rem;
}
</style>