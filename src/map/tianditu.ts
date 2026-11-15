/**
 * 天地图 WMTS 底图工具
 * Key 免费申请：https://console.tianditu.gov.cn（.env 中配置 VITE_TIANDITU_KEY）
 */
import WebTileLayer from '@arcgis/core/layers/WebTileLayer'

const SUBDOMAINS = ['0', '1', '2', '3', '4', '5', '6', '7']

export interface TiandituLayerOptions {
  /** 影像(img) / 矢量(vec) 等底图图层 */
  base: string
  /** 中文注记层（cva=影像注记 / cvw=矢量注记），不传则不添加 */
  annotation?: string
}

export function getTiandituKey(): string | undefined {
  const key = import.meta.env.VITE_TIANDITU_KEY as string | undefined
  return key ? key.trim() || undefined : undefined
}

function tileUrl(layer: string, key: string): string {
  return `https://t{subDomain}.tianditu.gov.cn/${layer}_w/wmts?tk=${key}&layer=${layer}&style=default&tilematrixset=w&service=wmts&request=GetTile&version=1.0.0&format=tiles&TileMatrix={level}&TileRow={row}&TileCol={col}`
}

/** 构建天地图图层（底图在前，注记在后），无 Key 时返回 null */
export function createTiandituLayers(options: TiandituLayerOptions): WebTileLayer[] {
  const key = getTiandituKey()
  if (!key) {
    console.warn('天地图 Key 未配置，使用 ArcGIS 默认底图。请在 .env 中设置 VITE_TIANDITU_KEY')
    return []
  }

  const layers: WebTileLayer[] = [
    new WebTileLayer({
      urlTemplate: tileUrl(options.base, key),
      subDomains: SUBDOMAINS,
      title: '天地图底图',
    }),
  ]

  if (options.annotation) {
    layers.push(
      new WebTileLayer({
        urlTemplate: tileUrl(options.annotation, key),
        subDomains: SUBDOMAINS,
        title: '天地图中文地名标注',
      }),
    )
  }

  return layers
}
