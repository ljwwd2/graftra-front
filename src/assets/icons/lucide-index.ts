/**
 * Lucide 图标本地图标索引
 * 所有 SVG 图标已下载到 src/assets/icons/lucide/ 目录
 */

// 导航栏图标
const navIcons = {
  hexagon: 'src/assets/icons/lucide/lucide_hexagon.svg',
  user: 'src/assets/icons/lucide/lucide_user.svg',
  arrowRight: 'src/assets/icons/lucide/lucide_arrow-right.svg',
}

// 文档相关图标
const docsIcons = {
  chevronDown: 'src/assets/icons/lucide/lucide_chevron-down.svg',
  bookOpen: 'src/assets/icons/lucide/lucide_book-open.svg',
  graduationCap: 'src/assets/icons/lucide/lucide_graduation-cap.svg',
  messageCircle: 'src/assets/icons/lucide/lucide_message-circle.svg',
  helpCircle: 'src/assets/icons/lucide/lucide_help-circle.svg',
  clock: 'src/assets/icons/lucide/lucide_clock.svg',
  rss: 'src/assets/icons/lucide/lucide_rss.svg',
  github: 'src/assets/icons/lucide/lucide_github.svg',
}

// 社区相关图标
const communityIcons = {
  building2: 'src/assets/icons/lucide/lucide_building-2.svg',
  briefcase: 'src/assets/icons/lucide/lucide_briefcase.svg',
  contact: 'src/assets/icons/lucide/lucide_contact.svg',
}

// 通用功能图标
const commonIcons = {
  arrowDown: 'src/assets/icons/lucide/lucide_arrow-down.svg',
  home: 'src/assets/icons/lucide/lucide_home.svg',
  mousePointer2: 'src/assets/icons/lucide/lucide_mouse-pointer-2.svg',
  fileText: 'src/assets/icons/lucide/lucide_file-text.svg',
  gift: 'src/assets/icons/lucide/lucide_gift.svg',
  palette: 'src/assets/icons/lucide/lucide_palette.svg',
  zap: 'src/assets/icons/lucide/lucide_zap.svg',
  wand2: 'src/assets/icons/lucide/lucide_wand-2.svg',
  users: 'src/assets/icons/lucide/lucide_users.svg',
  download: 'src/assets/icons/lucide/lucide_download.svg',
  check: 'src/assets/icons/lucide/lucide_check.svg',
  x: 'src/assets/icons/lucide/lucide_x.svg',
  loader2: 'src/assets/icons/lucide/lucide_loader-2.svg',
  lightbulb: 'src/assets/icons/lucide/lucide_lightbulb.svg',
  checkCircle: 'src/assets/icons/lucide/lucide_check-circle.svg',
  alertCircle: 'src/assets/icons/lucide/lucide_alert-circle.svg',
  shieldCheck: 'src/assets/icons/lucide/lucide_shield-check.svg',
  shield: 'src/assets/icons/lucide/lucide_shield.svg',
  sparkles: 'src/assets/icons/lucide/lucide_sparkles.svg',
  playCircle: 'src/assets/icons/lucide/lucide_play-circle.svg',
  type: 'src/assets/icons/lucide/lucide_type.svg',
  qrCode: 'src/assets/icons/qrcode_icon.svg',
}

// 用户账户相关图标
const accountIcons = {
  eye: 'src/assets/icons/lucide/lucide_eye.svg',
  eyeOff: 'src/assets/icons/lucide/lucide_eye-off.svg',
  lock: 'src/assets/icons/lucide/lucide_lock.svg',
  chevronRight: 'src/assets/icons/lucide/lucide_chevron-right.svg',
  settings: 'src/assets/icons/lucide/lucide_settings.svg',
  logOut: 'src/assets/icons/lucide/lucide_log-out.svg',
  menu: 'src/assets/icons/lucide/lucide_menu.svg',
  arrowLeft: 'src/assets/icons/lucide/lucide_arrow-left.svg',
}

// 应用相关图标
const appIcons = {
  fileUp: 'src/assets/icons/lucide/lucide_file-up.svg',
  uploadCloud: 'src/assets/icons/lucide/lucide_upload-cloud.svg',
  layers: 'src/assets/icons/lucide/lucide_layers.svg',
  repeat: 'src/assets/icons/lucide/lucide_repeat.svg',
  search: 'src/assets/icons/lucide/lucide_search.svg',
  hexagon: 'src/assets/icons/lucide/lucide_hexagon2.svg',
  home: 'src/assets/icons/lucide/lucide_home2.svg',
}

// 所有图标分类导出
export const iconAssets = {
  nav: navIcons,
  docs: docsIcons,
  community: communityIcons,
  common: commonIcons,
  account: accountIcons,
  app: appIcons,
}

// 获取图标的 HTML 代码
export function getIconHtml(iconName, width = 24, height = 24, className = '') {
  const svgPath = {
    // Nav
    hexagon: navIcons.hexagon,
    user: navIcons.user,
    arrowRight: navIcons.arrowRight,

    // Docs
    chevronDown: docsIcons.chevronDown,
    bookOpen: docsIcons.bookOpen,
    graduationCap: docsIcons.graduationCap,
    messageCircle: docsIcons.messageCircle,
    helpCircle: docsIcons.helpCircle,
    clock: docsIcons.clock,
    rss: docsIcons.rss,
    github: docsIcons.github,

    // Community
    building2: communityIcons.building2,
    briefcase: communityIcons.briefcase,
    contact: communityIcons.contact,

    // Common
    arrowDown: commonIcons.arrowDown,
    home: commonIcons.home,
    mousePointer2: commonIcons.mousePointer2,
    fileText: commonIcons.fileText,
    gift: commonIcons.gift,
    palette: commonIcons.palette,
    zap: commonIcons.zap,
    wand2: commonIcons.wand2,
    users: commonIcons.users,
    download: commonIcons.download,
    check: commonIcons.check,
    x: commonIcons.x,
    loader2: commonIcons.loader2,
    lightbulb: commonIcons.lightbulb,
    checkCircle: commonIcons.checkCircle,
    alertCircle: commonIcons.alertCircle,
    shieldCheck: commonIcons.shieldCheck,
    shield: commonIcons.shield,
    sparkles: commonIcons.sparkles,
    playCircle: commonIcons.playCircle,
    type: commonIcons.type,

    // Account
    eye: accountIcons.eye,
    eyeOff: accountIcons.eyeOff,
    lock: accountIcons.lock,
    chevronRight: accountIcons.chevronRight,
    settings: accountIcons.settings,
    logOut: accountIcons.logOut,
    menu: accountIcons.menu,
    arrowLeft: accountIcons.arrowLeft,

    // App
    fileUp: appIcons.fileUp,
    uploadCloud: appIcons.uploadCloud,
    layers: appIcons.layers,
    repeat: appIcons.repeat,
    search: appIcons.search,
    qrCode: commonIcons.qrCode,
  }[iconName]

  if (!svgPath) {
    console.warn(`Icon "${iconName}" not found`)
    return ''
  }

  return `<img src="${svgPath}" width="${width}" height="${height}" class="${className}" alt="${iconName}" />`
}
