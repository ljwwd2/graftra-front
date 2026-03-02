/**
 * 本地图标索引
 * 图标已下载到 src/assets/icons/ 目录
 */

export interface IconInfo {
  name: string
  src: string
  score?: string
}

// ========== 匹配结果图标 ===========

export const matchResultsIcons: IconInfo[] = [
  { name: 'house', src: '/src/assets/icons/match_house_512.png', score: '98%' },
  { name: 'user', src: '/src/assets/icons/match_user_512.png', score: '95%' },
  { name: 'edit', src: '/src/assets/icons/match_edit_512.png', score: '92%' },
  { name: 'check', src: '/src/assets/icons/match_check_512.png', score: '89%' },
  { name: 'gift', src: '/src/assets/icons/match_gift_512.png', score: '87%' },
  { name: 'arrow', src: '/src/assets/icons/match_arrow_512.png', score: '85%' }
]

// ========== 图标库图标 ==========

export const libraryIcons: IconInfo[] = [
  { name: 'rocket', src: '/src/assets/icons/lib_rocket_512.png' },
  { name: 'cog', src: '/src/assets/icons/lib_cog_512.png' },
  { name: 'cloud', src: '/src/assets/icons/lib_cloud_512.png' },
  { name: 'database', src: '/src/assets/icons/lib_database_512.png' },
  { name: 'shield', src: '/src/assets/icons/lib_shield_512.png' },
  { name: 'chart', src: '/src/assets/icons/lib_chart_512.png' }
]

// ========== 导出 ==========

export const allIcons = {
  match: matchResultsIcons,
  library: libraryIcons
}

// ========== 辅助函数 ==========

/**
 * 根据名称获取匹配结果图标
 */
export function getMatchIconByName(name: string): IconInfo | undefined {
  return matchResultsIcons.find(icon => icon.name === name)
}

/**
 * 根据名称获取图标库图标
 */
export function getLibraryIconByName(name: string): IconInfo | undefined {
  return libraryIcons.find(icon => icon.name === name)
}

/**
 * 搜索匹配结果图标
 */
export function searchMatchIcons(keyword: string): IconInfo[] {
  return matchResultsIcons.filter(icon =>
    icon.name.toLowerCase().includes(keyword.toLowerCase())
  )
}

/**
 * 搜索图标库图标
 */
export function searchLibraryIcons(keyword: string): IconInfo[] {
  return libraryIcons.filter(icon =>
    icon.name.toLowerCase().includes(keyword.toLowerCase())
  )
}
