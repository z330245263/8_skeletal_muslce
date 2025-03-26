# 骨骼肌：结构与功能 HTML课程

本项目是基于《Exercise Physiology, 12E Theory an Application to Fitness and Performance》教材第八章开发的骨骼肌结构与功能HTML课程。课程设计由浅入深、多模态且具有互动性，适合研究生学习，并且可以在本地轻松打开。

## 课程内容

课程分为六个主要模块，涵盖了骨骼肌结构与功能的各个方面：

1. **骨骼肌概述**：介绍骨骼肌的基本功能、在人体中的分布以及宏观结构
2. **骨骼肌的微观结构**：深入探讨肌纤维的结构，包括肌膜、肌原纤维、肌节结构等
3. **肌肉蛋白质与收缩装置**：详细介绍肌肉收缩的分子基础
4. **神经肌肉接头**：探索运动神经元与肌纤维的连接方式和信号传递
5. **肌纤维类型**：介绍不同类型肌纤维的分类、特性及其与运动表现的关系
6. **肌肉力量的调节**：分析影响肌肉力量的各种因素

此外，课程还包含视频资源、综合测验和研究进展页面，提供全面的学习体验。

## 文件结构

```
skeletal_muscle_html_course/
│
├── index.html                # 课程首页
├── videos.html               # 视频资源页面
├── quiz.html                 # 综合测验页面
├── research.html             # 研究进展页面
│
├── modules/                  # 课程模块目录
│   ├── module1.html          # 骨骼肌概述
│   ├── module2.html          # 骨骼肌的微观结构
│   ├── module3.html          # 肌肉蛋白质与收缩装置
│   ├── module4.html          # 神经肌肉接头
│   ├── module5.html          # 肌纤维类型
│   └── module6.html          # 肌肉力量的调节
│
├── css/                      # 样式表目录
│   └── styles.css            # 主样式表
│
├── js/                       # JavaScript脚本目录
│   ├── main.js               # 主脚本文件
│   └── interactive.js        # 交互功能脚本
│
├── images/                   # 图片资源目录
└── videos/                   # 视频资源目录
```

## 本地使用说明

1. 下载并解压本课程包到您的计算机上
2. 使用浏览器打开`index.html`文件开始浏览课程
   - 在Windows系统中，可以右键点击文件，选择"打开方式" > 选择您的浏览器
   - 在Mac系统中，可以右键点击文件，选择"打开方式" > 选择您的浏览器
3. 通过导航菜单访问不同的课程模块和功能

## GitHub同步指南

### 方法1：使用GitHub网页界面

1. 在GitHub上创建一个新仓库
   - 登录您的GitHub账号
   - 点击右上角的"+"图标，选择"New repository"
   - 填写仓库名称（如"skeletal-muscle-course"）
   - 选择"Public"（公开）
   - 点击"Create repository"

2. 上传文件
   - 在新创建的仓库页面，点击"Add file" > "Upload files"
   - 将解压后的所有文件拖拽到上传区域
   - 点击"Commit changes"

3. 启用GitHub Pages
   - 在仓库页面，点击"Settings" > "Pages"
   - 在"Source"部分，选择"main"分支和"/ (root)"目录
   - 点击"Save"
   - 等待几分钟，您的课程将在显示的URL上可用

### 方法2：使用Git命令行（推荐）

1. 安装Git客户端（如果尚未安装）
   - 从[git-scm.com](https://git-scm.com/downloads)下载并安装

2. 在GitHub上创建一个新仓库（同上）

3. 克隆仓库到本地
   ```bash
   git clone https://github.com/您的用户名/skeletal-muscle-course.git
   ```

4. 复制课程文件
   - 将解压后的所有课程文件复制到克隆的仓库文件夹中

5. 提交并推送更改
   ```bash
   cd skeletal-muscle-course
   git add .
   git commit -m "添加骨骼肌结构与功能课程"
   git push
   ```

6. 启用GitHub Pages（同上）

## 视频内容说明

课程中包含了多个YouTube视频嵌入链接，这些视频在本地浏览时可能显示为"Video unavailable"，这是正常现象。当您将课程部署到GitHub Pages后，这些视频将能够正常显示。

如果您希望在本地也能查看视频，可以：
1. 确保您的计算机连接到互联网
2. 使用现代浏览器（如Chrome、Firefox、Edge等最新版本）
3. 如果仍然无法显示，可以直接访问视频页面中提供的YouTube链接

## 自定义与扩展

您可以根据需要自由修改和扩展课程内容：

- 在`css/styles.css`中修改样式
- 在各HTML文件中更新内容
- 在`js/interactive.js`中添加更多交互功能
- 在`images/`和`videos/`目录中添加更多多媒体资源

## 技术说明

本课程使用纯HTML、CSS和JavaScript开发，不依赖任何外部框架或库，确保最大的兼容性和易用性。

## 参考资料

- Powers, S. K., & Howley, E. T. (2018). Exercise Physiology: Theory and Application to Fitness and Performance (12th ed.). McGraw-Hill Education.

## 许可信息

本课程仅供教育目的使用。所有内容基于《Exercise Physiology, 12E》教材开发，版权归原作者所有。
