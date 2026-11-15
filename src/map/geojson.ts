/** 最小化的行政区划 GeoJSON 类型定义（DataV areas_v3 格式） */

export type GeoJSONPosition = [number, number] | [number, number, number]

export interface GeoJSONPolygon {
  type: 'Polygon'
  coordinates: GeoJSONPosition[][]
}

export interface GeoJSONMultiPolygon {
  type: 'MultiPolygon'
  coordinates: GeoJSONPosition[][][]
}

export type GeoJSONPolygonGeometry = GeoJSONPolygon | GeoJSONMultiPolygon

export interface GeoJSONFeature {
  type: 'Feature'
  geometry: GeoJSONPolygonGeometry
  properties: Record<string, unknown>
}

export interface GeoJSONFeatureCollection {
  type: 'FeatureCollection'
  features: GeoJSONFeature[]
}

/** 将 Polygon / MultiPolygon 的 rings 拉平为 ArcGIS 可用的二维 ring 数组 */
export function flattenPolygonRings(geometry: GeoJSONPolygonGeometry): GeoJSONPosition[][] {
  return geometry.type === 'MultiPolygon' ? geometry.coordinates.flat(1) : geometry.coordinates
}
