# 家庭药品效期管家 - PC端 实施计划

## 一、项目初始化

### 1.1 创建项目结构
```
FamilyMedExpiryKeeper/
├── src/
│   ├── main/                 # Electron主进程
│   │   ├── main.ts           # 入口文件
│   │   ├── scheduler.ts      # 定时任务管理
│   │   └── notification.ts   # 系统通知
│   ├── renderer/             # Electron渲染进程
│   │   ├── index.html       # 大屏页面
│   │   ├── renderer.ts      # 渲染进程逻辑
│   │   └── styles.css       # 样式
│   ├── server/               # Express API服务
│   │   ├── server.ts        # HTTP服务器
│   │   ├── routes/
│   │   │   └── medicines.ts # 药品路由
│   │   └── database/
│   │       ├── db.ts        # SQLite连接
│   │       └── medicines.ts # 药品数据访问
│   └── shared/              # 共享类型
│       └── types.ts         # TypeScript类型定义
├── package.json
├── tsconfig.json
├── electron-builder.yml
└── .gitignore
```

### 1.2 初始化项目配置

**package.json** - 依赖安装：
- electron
- typescript
- express
- better-sqlite3
- node-schedule
- electron-builder (打包)
- @types/* (类型定义)

**tsconfig.json** - TypeScript配置：
- target: ES2020
- module: commonjs
- outDir: dist
- strict: true

## 二、核心功能实现

### 2.1 数据库设计 (SQLite)

**medicines 表**：
| 字段 | 类型 | 描述 |
|------|------|------|
| id | INTEGER | 主键自增 |
| name | TEXT | 药品名称 |
| expiry_date | TEXT | 有效期 (YYYY-MM-DD) |
| category | TEXT | 分类 |
| quantity | INTEGER | 数量 |
| remark | TEXT | 备注 |
| created_at | TEXT | 创建时间 |
| updated_at | TEXT | 更新时间 |

### 2.2 Express HTTP API

**POST /api/medicines** - 接收药品录入
- 请求体: `{ name, expiry_date, category, quantity, remark }`
- 响应: `{ success: true, data: medicine }`

**GET /api/medicines** - 获取所有药品
- 响应: `{ success: true, data: medicines[] }`

**PUT /api/medicines/:id** - 更新药品
- 请求体: `{ name?, expiry_date?, category?, quantity?, remark? }`
- 响应: `{ success: true, data: medicine }`

**DELETE /api/medicines/:id** - 删除药品
- 响应: `{ success: true }`

**GET /api/medicines/expiring** - 获取即将过期药品(≤7天)
- 响应: `{ success: true, data: medicines[] }`

### 2.3 定时任务 (node-schedule)

- 每天09:00执行效期检查
- 查询距今≤7天过期的药品
- 调用系统通知提醒

### 2.4 Electron主进程

- 创建BrowserWindow显示大屏页面
- 启动Express服务器监听3000端口
- 管理定时任务生命周期
- 处理系统通知

### 2.5 大屏展示页面

**功能**：
- 药品列表展示（表格形式）
- 过期药品：红色背景标识
- 即将过期(≤7天)：橙色标识
- 正常药品：绿色标识
- 新增/编辑/删除药品表单
- 刷新数据按钮

**布局**：
- 顶部标题栏
- 操作按钮区（新增、刷新）
- 药品统计卡片（总数、过期、即将过期、正常）
- 药品列表表格

## 三、实现步骤

### Step 1: 项目初始化
- [ ] 创建目录结构
- [ ] 初始化package.json
- [ ] 安装依赖
- [ ] 配置tsconfig.json

### Step 2: 数据库层
- [ ] 实现db.ts (SQLite连接)
- [ ] 实现medicines.ts (数据访问)
- [ ] 创建数据库表

### Step 3: API服务层
- [ ] 实现server.ts (Express服务器)
- [ ] 实现medicines路由
- [ ] 测试API接口

### Step 4: Electron主进程
- [ ] 实现main.ts (Electron入口)
- [ ] 实现notification.ts (系统通知)
- [ ] 实现scheduler.ts (定时任务)
- [ ] 配置BrowserWindow

### Step 5: 渲染进程/大屏页面
- [ ] 创建index.html
- [ ] 创建styles.css
- [ ] 实现renderer.ts (页面逻辑)
- [ ] 实现与Express API的通信

### Step 6: 系统集成与测试
- [ ] 集成测试 (主进程+API+渲染)
- [ ] 验证定时任务
- [ ] 验证系统通知

### Step 7: 打包构建
- [ ] 配置electron-builder
- [ ] 构建可执行文件
- [ ] 验证打包结果

## 四、技术要点

### 4.1 Electron + Express 集成
- Express监听在主进程
- 渲染进程通过HTTP与API通信
- 使用`localhost:3000`内网地址

### 4.2 better-sqlite3 使用
```typescript
const db = new Database('medicine.db');
db.exec(CREATE_TABLE_SQL);
```

### 4.3 node-schedule 使用
```typescript
schedule.scheduleJob('0 9 * * *', () => {
  checkExpiringMedicines();
});
```

### 4.4 Electron Notification
```typescript
new Notification({
  title: '药品效期提醒',
  body: '有N个药品即将过期'
}).show();
```

## 五、验收标准

1. ✅ Electron应用能正常启动
2. ✅ Express API能正常响应 (POST/GET/PUT/DELETE)
3. ✅ SQLite数据库正确存储药品数据
4. ✅ 大屏页面正确展示药品列表
5. ✅ 过期药品显示红色标识
6. ✅ 即将过期药品显示橙色标识
7. ✅ 定时任务能正确执行
8. ✅ 系统通知能正常弹出
9. ✅ 可打包为可执行文件
