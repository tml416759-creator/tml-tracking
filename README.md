# 中泰专线物流查询系统

一个为泰国曼谷跨境物流站点设计的快递单号追踪系统。

## ✨ 功能

### 客户端（客户查询）
- 客户输入快递单号查询 4 种状态：
  1. 📦 广州仓已签收
  2. 🏬 快递已到达仓库（曼谷）
  3. 🚚 已送达
  4. ✅ 已签收
- 显示当前状态、时间和送达地址
- 未查询到时显示客服联系方式

### 管理端（站点管理）
- **隐藏入口**：`Ctrl+Shift+A` 快捷键 或 URL `?admin=1`
- **4 个核心功能**：
  - 📋 包裹管理：列表、搜索、状态筛选、导出
  - 📥 批量录入：从诺动条码软件粘贴单号 → 批量更新
  - 🚚 批量更新：按广州仓签收日期 → 批量更新到"已到达仓库"
  - ➕ 新增/更新：手动录入或修改单个包裹
  - ⚙️ 系统设置：修改 PIN、客服联系方式
- **数据云端存储**：Cloudflare KV
- **每日自动备份**：凌晨 3 点 (UTC+7)

## 🚀 部署到 Cloudflare Pages

### 1. 注册 Cloudflare 账号
- 访问 https://dash.cloudflare.com/sign-up
- 用 `tml416759@gmail.com` 注册
- 验证邮箱

### 2. 创建 KV 命名空间
1. 登录 Cloudflare Dashboard
2. 左侧菜单 → `Workers & Pages` → `KV`
3. 点击 `Create a namespace`
4. 名称：`tml-tracking-kv`
5. 创建后复制 ID（类似 `abc123def456...`）

### 3. 创建 Pages 项目
1. `Workers & Pages` → `Create` → `Pages` → `Upload assets`
2. 项目名：`tml-tracking`
3. 先跳过上传，我们用 Git 连接

### 4. 上传代码到 GitHub
（详见 DEPLOY.md）

### 5. 配置 Pages 项目
- Build command: 留空
- Build output directory: `public`
- 环境变量: 无需设置

### 6. 绑定 KV
1. Pages 项目 → Settings → Functions → KV namespace bindings
2. Variable name: `TRACKING_KV`
3. KV namespace: 选择刚创建的 `tml-tracking-kv`

### 7. 部署
点击 `Save and Deploy`，等待 1-2 分钟

### 8. 访问
- 临时地址：`https://tml-tracking.pages.dev`
- 客户查询：`https://tml-tracking.pages.dev/`
- 后台登录：`https://tml-tracking.pages.dev/?admin=1`（按 Ctrl+Shift+A）

## 🔐 默认凭据

- **管理员 PIN**: `2022`
- 首次登录后请在「系统设置」中修改

## 💰 成本

- Cloudflare Pages: **免费**
- Cloudflare KV: **免费**（10万次读取/天，足够使用）
- 域名 `tml-tracking.com`: **~¥70/年**（在 Namecheap 购买）
- **总成本：首年约 ¥70，续费同价**

## 📞 客服

联系客服纸飞机: @tmlkd / @TMLkd8888
