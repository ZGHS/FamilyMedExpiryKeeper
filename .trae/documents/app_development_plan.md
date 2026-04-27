# 家庭药品效期管家 - App端开发计划

## 1. 项目概述

本项目旨在开发一个移动端应用，用于快速扫描药品条形码并将药品信息（包括有效期）发送到PC端管家系统。应用采用React Native框架开发，支持iOS和Android平台。

## 2. 技术栈

- **开发语言**: TypeScript
- **核心框架**: React Native
- **扫码库**: react-native-camera
- **网络请求**: Fetch API
- **状态管理**: React Context API (轻量级)

## 3. 项目初始化

### 3.1 创建React Native项目

使用React Native CLI创建项目，配置TypeScript支持：

```bash
npx react-native init FamilyMedExpiryKeeper --template react-native-template-typescript
cd FamilyMedExpiryKeeper
```

### 3.2 安装核心依赖

```bash
# 安装相机库
npm install react-native-camera

# 安装导航库
npm install @react-navigation/native @react-navigation/stack

# 安装UI组件库（可选）
npm install react-native-paper

# 安装日期选择器
npm install @react-native-community/datetimepicker

# 安装权限相关库
npm install react-native-permissions
```

### 3.3 配置权限

#### iOS配置

在 `Info.plist` 文件中添加相机权限：

```xml
<key>NSCameraUsageDescription</key>
<string>需要使用相机扫描药品条形码</string>
```

#### Android配置

在 `AndroidManifest.xml` 文件中添加相机权限：

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## 4. 核心功能实现

### 4.1 主界面布局

- 扫码按钮
- 手动录入按钮
- 配置PC端地址按钮

### 4.2 扫码功能

- 使用react-native-camera实现条形码扫描
- 扫描成功后自动填充药品信息
- 提供手动修改界面

### 4.3 手动录入界面

- 药品名称输入框
- 有效期截止日选择器
- 批号输入框
- 数量输入框

### 4.4 网络请求功能

- 配置PC端内网IP和端口
- 使用Fetch发送POST请求
- 显示发送进度和结果

### 4.5 配置界面

- IP地址输入框
- 端口输入框
- 保存配置

## 5. 数据结构

### 5.1 药品信息数据结构

```typescript
interface MedicineInfo {
  name: string;        // 药品名称
  expiryDate: string;  // 有效期截止日 (YYYY-MM-DD)
  batchNumber: string; // 批号
  quantity: number;    // 数量
  barcode?: string;    // 条形码（可选）
}
```

### 5.2 配置数据结构

```typescript
interface Config {
  serverIp: string;    // PC端IP地址
  serverPort: string;  // PC端端口
}
```

## 6. 页面结构

1. **主页面** (`HomeScreen`)
   - 扫码按钮
   - 手动录入按钮
   - 配置按钮

2. **扫码页面** (`ScanScreen`)
   - 相机预览
   - 扫描框
   - 扫描结果处理

3. **信息确认页面** (`ConfirmScreen`)
   - 药品信息展示
   - 编辑功能
   - 发送按钮

4. **手动录入页面** (`ManualInputScreen`)
   - 表单输入
   - 日期选择器
   - 发送按钮

5. **配置页面** (`ConfigScreen`)
   - IP和端口配置
   - 保存按钮

6. **结果页面** (`ResultScreen`)
   - 发送结果展示
   - 重试按钮
   - 返回首页按钮

## 7. 实现步骤

1. **项目初始化**
   - 创建React Native项目
   - 安装依赖
   - 配置权限

2. **基础架构搭建**
   - 导航系统配置
   - 状态管理设置
   - 基础组件开发

3. **核心功能开发**
   - 扫码功能实现
   - 手动录入界面实现
   - 网络请求功能实现
   - 配置界面实现

4. **UI优化**
   - 界面美观度提升
   - 交互体验优化
   - 错误处理和提示

5. **测试**
   - 功能测试
   - 性能测试
   - 兼容性测试

## 8. 风险评估

1. **权限问题**
   - 风险：用户可能拒绝相机权限
   - 应对：提供权限申请引导，无权限时提示用户手动开启

2. **网络连接问题**
   - 风险：内网连接失败
   - 应对：添加网络连接检测，提供详细的错误提示

3. **扫码识别问题**
   - 风险：条形码识别失败
   - 应对：提供手动录入选项，优化扫码界面和提示

4. **兼容性问题**
   - 风险：不同设备和系统版本的兼容性
   - 应对：测试主流设备，提供降级方案

## 9. 开发时间估计

- 项目初始化：1天
- 核心功能开发：3天
- UI优化：1天
- 测试：1天

## 10. 预期成果

- 功能完整的移动端应用
- 支持iOS和Android平台
- 扫码速度快（识别延迟<1秒）
- 操作简单直观
- 纯内网通信，数据安全

## 11. 后续优化方向

- 添加批量扫描功能
- 支持更多类型的条形码
- 优化扫码识别率
- 添加药品图片拍摄功能
- 实现离线缓存（可选）