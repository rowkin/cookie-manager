# Cookie Manager Chrome Extension

Cookie Manager 是企平FE内部封装的 Chrome 浏览器扩展，用于管理和操作网站 Cookie。它提供了直观的用户界面和全面的 Cookie 管理功能。


## 发布信息

- 版本: 1.0.0
- 最低支持的 Chrome 版本: 88+
- 权限要求: 
  - cookies
  - tabs
  - storage
  - activeTab
- 发布状态: 仅供企平FE内部使用

## 功能特点

### 基础功能
- 🔍 实时搜索和过滤 Cookie
- ➕ 添加新的 Cookie
- 🗑️ 删除单个或所有 Cookie
- 📝 编辑现有 Cookie 值
- 📊 显示当前页面 Cookie 总数

### 高级功能
- 📌 固定(Pin)重要 Cookie
  - 自动应用到匹配的域名
  - 支持批量固定/取消固定
  - 显示固定 Cookie 数量
- 💾 导入/导出 Cookie
  - 支持 JSON 格式导出
  - 批量导入 Cookie
- 📋 复制 Cookie
  - 简单格式：name=value 形式
  - 详细 JSON 格式
- 🔄 自动同步
  - 标签页切换时自动应用固定的 Cookie
  - 页面刷新时保持 Cookie 状态

### 界面特性
- 🎨 优雅的渐变背景设计
- 💡 每日双语激励语录
  - 支持多个备选 API 源
  - 自动英文翻译
- 📱 响应式设计
- ✨ 美观的动画效果
  - 操作反馈动画
  - 平滑过渡效果
- 🔔 操作状态通知

## 使用说明

### 基本操作

1. **查看和搜索 Cookie**
   - 点击 "Get Cookies" 获取当前网站的所有 Cookie
   - 使用顶部搜索框实时过滤 Cookie
   - 可查看 Cookie 总数和详细信息

2. **Cookie 管理**
   - 添加：点击 "Add Cookie" 按钮
   - 编辑：点击每行的 "Edit" 按钮
   - 删除：使用 "Delete" 按钮（单个）或 "Delete All" （全部）

3. **固定 Cookie**
   - 点击 "Pin" 按钮固定重要的 Cookie
   - 使用 "Pin All" 批量固定当前页面所有 Cookie
   - 固定的 Cookie 会自动应用到匹配的域名

4. **复制 Cookie**
   - 简单格式：name=value 形式
   - 详细格式：完整的 JSON 格式（包含所有属性）

### 高级功能

1. **导入/导出**
   - 导出：将当前 Cookie 导出为 JSON 文件
   - 导入：从 JSON 文件批量导入 Cookie

2. **自动同步**
   - 切换标签页时自动应用固定的 Cookie
   - 页面刷新后自动保持 Cookie 状态
   - 支持失败重试机制

3. **调试功能**
   - 详细的操作状态反馈
   - 操作结果实时通知
   - 错误信息展示

## 注意事项

1. 修改 Cookie 时请谨慎操作，以免影响网站功能
2. 建议在导出 Cookie 前先确认重要数据
3. 固定 Cookie 功能会影响相关域名下的所有页面
4. 某些网站可能限制 Cookie 操作，此时部分功能可能不可用

## 技术支持

如果您在使用过程中遇到任何问题，或有任何建议，请通过以下方式联系我们：

- 发送邮件到：[jinxianshen58@gmail.com]

## 隐私声明

Cookie Manager 重视用户隐私，我们：
- 不会收集任何个人信息
- 不会上传或存储您的 Cookie 数据
- 所有操作均在本地完成
- 固定的 Cookie 仅保存在浏览器本地存储中

## 版权信息

© 2025 EPFE All Rights Reserved.