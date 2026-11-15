# ArcGIS Vue

Vue 3 + TypeScript + Vite + `@arcgis/core`（ESM 方式，无需 esri-loader / webpack）。

## 功能

- **2D 地图**（`/`）：基于 `MapView` 的二维底图浏览
- **3D 飞行动画**（`/flight-3d`）：`SceneView` 三维场景，北京 → 上海飞行动画、行政区划高亮（呼吸灯脉冲效果）

## 快速开始

```bash
pnpm install
pnpm dev      # 启动开发服务器 http://localhost:5173
pnpm build    # 类型检查 + 生产构建
pnpm preview  # 预览构建产物
pnpm lint     # ESLint 检查
pnpm format   # Prettier 格式化
```

要求 Node.js ≥ 22。

## 环境变量

复制 `.env` 并配置（免费申请：https://console.tianditu.gov.cn）：

```ini
VITE_TIANDITU_KEY=你的天地图Key
```

- 配置后：3D 页面加载天地图影像底图 + 中文地名注记；建议在天地图控制台绑定部署域名
- 未配置时：3D 页面回退到 ArcGIS 卫星底图

## 技术栈

| 依赖 | 用途 |
| --- | --- |
| Vue 3.5 + vue-router 5 | UI 框架与路由（视图级懒加载） |
| @arcgis/core 5.x | ArcGIS Maps SDK（本地 ESM 引入，主题样式与 SDK 版本一致，勿用 CDN 旧版 CSS） |
| Vite 8 | 构建工具，ArcGIS SDK 按模块拆 chunk + gzip/brotli 预压缩 |
| ESLint 9 + Prettier | 代码规范（flat config） |

## 项目结构

```
src/
├── composables/useEsriView.ts   # 地图/场景视图初始化与销毁的 composable
├── map/geojson.ts               # 行政区划 GeoJSON 类型与工具
├── map/tianditu.ts              # 天地图 WMTS 底图图层构建
├── views/Map2D.vue              # 2D 地图页
├── views/Map3D.vue              # 3D 场景页（飞行/高亮）
├── router/index.ts              # 路由
└── main.ts                      # 入口（含 ArcGIS 主题 CSS 导入）
```

### 鸣谢

感谢 [JetBrains](https://www.jetbrains.com/?from=arcgis-vue) 对该项目的大力支持，特别感谢。

<img src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" alt="JetBrains 徽标（主要） logo." style="width: 200px;">
