# 呼吸练习和正念冥想页面布局修复方案

## 问题分析
呼吸练习和正念冥想页面存在严重的缩进问题，导致布局显示异常。主要问题包括：
1. template内容缩进不一致
2. 嵌套元素缩进层级错误
3. 在重构过程中没有保持正确的代码格式

## 解决方案

### 方法1：手动修复缩进（推荐）
使用IDE的格式化功能：
1. 打开 `src/views/tools/Breathing.vue`
2. 选中全部代码 (Ctrl+A)
3. 使用格式化快捷键 (Shift+Alt+F 或 Ctrl+Shift+P -> Format Document)
4. 保存文件

对 `src/views/tools/Meditation.vue` 执行相同操作。

### 方法2：确保正确的HTML结构
确保每个页面的基本结构如下：

```vue
<template>
  <div class="tool-page">
    <div class="page-header">
      <BackButton />
      <h1 class="page-title">
        <el-icon><Icon /></el-icon>
        工具名称
      </h1>
      <p class="page-desc">工具描述</p>
    </div>
    
    <div class="tool-container">
      <!-- 工具内容 -->
    </div>
  </div>
</template>
```

### 方法3：重新创建文件
如果格式化无法解决问题，建议：
1. 备份原文件的script和style部分
2. 重新创建template部分
3. 确保正确的2空格缩进

## 当前状态
- ✅ 已修复主要的template结构问题
- 🔄 需要完整的代码格式化
- ✅ BackButton组件已正确添加

## 测试验证
修复后请测试：
1. 页面是否正确渲染
2. 返回按钮是否工作
3. 工具功能是否正常
4. 样式是否正确应用
