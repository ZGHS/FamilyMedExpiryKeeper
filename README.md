# 家庭药品效期管家 (FamilyMedExpiryKeeper)

A desktop application based on Electron to help families manage medicine inventory and expiry reminders.

---

## 功能特性 | Features

- 📦 **药品管理**：添加、编辑、删除药品信息 | **Medicine Management**: Add, edit, and delete medicine information
- ⏰ **效期提醒**：自动提醒即将过期的药品 | **Expiry Reminder**: Automatically remind about expiring medicines
- 🔔 **桌面通知**：到期前自动推送提醒通知 | **Desktop Notifications**: Push notifications before expiry
- 📊 **分类管理**：支持药品分类管理 | **Category Management**: Support medicine categorization
- 💾 **本地存储**：使用 SQLite 数据库本地存储 | **Local Storage**: SQLite database for local storage

---

## 技术栈 | Tech Stack

- **框架**: Electron 28
- **语言**: TypeScript
- **后端**: Express
- **数据库**: SQLite (better-sqlite3)
- **任务调度**: node-schedule

---

## 安装与运行 | Installation & Running

### 前置条件 | Prerequisites

- Node.js >= 18.x
- npm >= 9.x

### 安装依赖 | Install Dependencies

```bash
npm install
```

### 开发模式 | Development

```bash
npm run dev
```

### 生产构建 | Production Build

```bash
# 构建项目 | Build the project
npm run build

# 打包为目录形式 | Pack to directory
npm run pack

# 生成安装包 | Generate installer
npm run dist
```

---

## 项目结构 | Project Structure

```
FamilyMedExpiryKeeper/
├── src/
│   ├── main/           # Electron 主进程 | Electron Main Process
│   │   ├── main.ts     # 入口文件 | Entry file
│   │   ├── notification.ts  # 通知服务 | Notification service
│   │   └── scheduler.ts     # 任务调度 | Task scheduler
│   ├── renderer/       # 渲染进程 | Renderer Process
│   │   ├── index.html
│   │   ├── renderer.ts
│   │   └── styles.css
│   ├── server/         # Express API 服务 | Express API Server
│   │   ├── database/   # 数据库操作 | Database operations
│   │   ├── routes/     # API 路由 | API routes
│   │   └── server.ts
│   └── shared/         # 共享类型定义 | Shared type definitions
│       └── types.ts
├── package.json
├── tsconfig.json
└── electron-builder.yml
```

---

## API 接口 | API Endpoints

服务器运行在 `http://localhost:3000/api` | Server runs at `http://localhost:3000/api`

| 方法 | 路径 | 描述 |
|------|------|------|
| GET | `/health` | 健康检查 | Health check |
| GET | `/medicines` | 获取所有药品列表 | Get all medicines |
| GET | `/medicines/expiring` | 获取7天内即将过期的药品 | Get expiring medicines (within 7 days) |
| GET | `/medicines/:id` | 获取单个药品详情 | Get medicine by ID |
| POST | `/medicines` | 添加新药品 | Add new medicine |
| PUT | `/medicines/:id` | 更新药品信息 | Update medicine |
| DELETE | `/medicines/:id` | 删除药品 | Delete medicine |

详细的 API 文档请参考 | For detailed API documentation, see [api-documentation.md](api-documentation.md)

---

## 使用说明 | Usage

1. 运行应用后，界面会显示当前药品列表 | After running the app, the interface shows the current medicine list
2. 点击添加按钮可以添加新药品 | Click the add button to add new medicine
3. 系统会自动检测即将过期的药品并发送桌面通知 | The system automatically detects expiring medicines and sends desktop notifications
4. 可以编辑或删除已有的药品信息 | Edit or delete existing medicine information

---

## 许可证 | License

MIT License