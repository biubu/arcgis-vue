/**
 * ArcGIS 地图视图 composable：封装初始化 / 容器守卫 / 组件卸载清理
 */
import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import SceneView from '@arcgis/core/views/SceneView'
import { onMounted, onUnmounted, type Ref } from 'vue'

export interface Map2DOptions {
  basemap?: string
  center?: [number, number]
  zoom?: number
}

export interface Scene3DOptions {
  /** 默认 null（由外部图层提供底图）；外部图层为空时建议传 'satellite' */
  basemap?: string | null
  camera: SceneView['camera']
  environment?: SceneView['environment']
}

/** 视图 + 地图的统一持有与清理 */
function useEsriView<T extends MapView | SceneView>(
  mapdiv: Ref<HTMLDivElement | null>,
  setup: (container: HTMLDivElement) => { view: T; map: Map } | null,
) {
  let view: T | null = null
  let map: Map | null = null

  onMounted(() => {
    if (!mapdiv.value) {
      console.error('[useEsriView] 地图容器未就绪，跳过初始化')
      return
    }
    try {
      const result = setup(mapdiv.value)
      if (!result) return
      view = result.view
      map = result.map
    } catch (error) {
      console.error('Failed to initialize map:', error)
    }
  })

  onUnmounted(() => {
    view?.destroy()
    view = null
    map = null
  })

  const getView = () => view
  const getMap = () => map

  return { getView, getMap }
}

/** 2D 地图视图 */
export function useMapView(mapdiv: Ref<HTMLDivElement | null>, options: Map2DOptions = {}) {
  return useEsriView<MapView>(mapdiv, (container) => {
    const map = new Map({ basemap: options.basemap ?? 'topo-vector' })
    const view = new MapView({
      container,
      map,
      center: options.center ?? [108, 34],
      zoom: options.zoom ?? 5,
    })
    return { view, map }
  })
}

/** 3D 场景视图 */
export function useSceneView(mapdiv: Ref<HTMLDivElement | null>, options: Scene3DOptions) {
  return useEsriView<SceneView>(mapdiv, (container) => {
    const map = new Map({ basemap: options.basemap ?? null, ground: 'world-elevation' })
    const view = new SceneView({
      container,
      map,
      camera: options.camera,
      environment: options.environment ?? {
        atmosphereEnabled: true,
        starsEnabled: true,
      },
    })
    return { view, map }
  })
}
