(function () {
const {
  STORAGE_KEY,
  UNCATEGORIZED_GROUP_ID,
  addQuickAccess,
  createDefaultState,
  deleteGroup,
  deleteLink,
  loadState,
  moveGroup,
  moveQuickAccess,
  moveLink,
  recordVisit,
  removeQuickAccess,
  resetState,
  saveState,
  upsertGroup,
  upsertLink,
  updateProfile,
  updateWeather,
} = window.SelfDirectionStore;

const SEARCH_ENGINE_STORAGE_KEY = "self-direction-page-search-engine-v1";
const BACKGROUND_IMAGE_STORAGE_KEY = "self-direction-page-background-image-v1";
const THEME_STORAGE_KEY = "self-direction-page-theme-v1";
const LANGUAGE_STORAGE_KEY = "self-direction-page-language-v1";
const SUPPORTED_LANGUAGES = ["en", "zh-CN", "zh-HK", "zh-TW", "ja"];
const LANGUAGE_META = {
  en: { htmlLang: "en" },
  "zh-CN": { htmlLang: "zh-CN" },
  "zh-HK": { htmlLang: "zh-HK" },
  "zh-TW": { htmlLang: "zh-TW" },
  ja: { htmlLang: "ja" },
};
function svgDataUri(markup) {
  return `data:image/svg+xml,${encodeURIComponent(markup)}`;
}

const SEARCH_ENGINE_ICONS = {
  bing: svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="10.8" cy="10.8" r="5.8" fill="none" stroke="#1a73e8" stroke-width="2.2"/>
      <path d="m15.2 15.2 4.2 4.2" fill="none" stroke="#1a73e8" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  `),
  google: svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path fill="#4285f4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.2z"/>
      <path fill="#34a853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.5c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"/>
      <path fill="#fbbc05" d="M6.4 13.8a6 6 0 0 1 0-3.6V7.6H3.1a10 10 0 0 0 0 8.8z"/>
      <path fill="#ea4335" d="M12 6.1c1.5 0 2.8.5 3.8 1.5l2.9-2.9A9.6 9.6 0 0 0 12 2 10 10 0 0 0 3.1 7.6l3.3 2.6c.8-2.3 3-4.1 5.6-4.1z"/>
    </svg>
  `),
  wikipedia: svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect width="24" height="24" rx="6" fill="#f8fafd"/>
      <path fill="#202124" d="M5 7.3h14v1.1h-1.5l-3.4 8.3H13l-2.1-5.2-2.2 5.2H7.6L4.2 8.4H3V7.3h5.2v1.1H6.8l1.8 4.9 1.7-4.1-.3-.8H8.8V7.3h5v1.1h-1.3l1.9 4.9 1.9-4.9H15V7.3z"/>
    </svg>
  `),
};
const TRANSLATIONS = {
  en: {
    "meta.title": "Self Direction Page",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.clear": "Clear",
    "common.delete": "Delete",
    "common.down": "Down",
    "common.edit": "Edit",
    "common.move": "Move",
    "common.search": "Search",
    "common.title": "Title",
    "common.up": "Up",
    "common.url": "URL",
    "home.addGroup": "Add group",
    "home.addGroupHint": "New navigation group",
    "home.addWebsite": "Add website",
    "home.controlRoom": "Open links in a new tab and keep this page as your control room.",
    "home.curatedAccess": "Curated access",
    "home.groupLinks": "Group links",
    "home.groupEmpty": "No websites in this group yet.",
    "home.openGroup": "Open {title} group",
    "home.siteCount": "{count} sites",
    "home.siteCountOne": "1 site",
    "home.yourSpaces": "Your spaces",
    "modal.addGroup": "Add group",
    "modal.addLink": "Add link",
    "modal.addLinkChoice": "Add to {title}",
    "modal.addLinkNew": "Create new website",
    "modal.addLinkNewHint": "Add a brand-new website directly into this group.",
    "modal.addLinkImport": "Import from Uncategorized",
    "modal.addLinkImportHint": "Move one or more uncategorized websites into this group.",
    "modal.editGroup": "Edit group",
    "modal.editLink": "Edit link",
    "modal.importHint": "Select uncategorized websites to move into {title}.",
    "modal.importEmpty": "No uncategorized websites available.",
    "modal.importSelected": "Import selected",
    "modal.moveLink": "Move website",
    "note.eyebrow": "Custom",
    "recent.empty": "No recent visits yet.",
    "recent.eyebrow": "Recent",
    "recent.title": "Visits",
    "quickAccess.add": "Add",
    "quickAccess.available": "Saved websites",
    "quickAccess.edit": "Edit quick access",
    "quickAccess.empty": "No pinned shortcuts yet.",
    "quickAccess.eyebrow": "Quick",
    "quickAccess.full": "Full",
    "quickAccess.modalTitle": "Quick Access",
    "quickAccess.noneSaved": "No saved websites available.",
    "quickAccess.noneSearchMatches": "No matching website found.",
    "quickAccess.noneSelected": "Nothing pinned yet.",
    "quickAccess.searchAria": "Filter saved websites by title",
    "quickAccess.searchPlaceholder": "Search saved websites",
    "quickAccess.selected": "Added",
    "quickAccess.title": "Quick Access",
    "quickAccess.current": "Selected",
    "search.aria": "Choose search engine",
    "search.current": "Current search engine: {engine}",
    "search.directUrl": "Open URL",
    "search.empty": "No matching saved websites.",
    "search.groupMeta": "{group} group",
    "search.saved": "Saved website",
    "search.searchWeb": "Search the web",
    "search.with": "Search with {engine}",
    "settings.background": "Background",
    "settings.backgroundSummary": "Set a custom page background for this browser only.",
    "settings.backup": "Backup",
    "settings.backupSummary": "Move your configuration between browsers or devices.",
    "settings.clearBackground": "Clear background",
    "settings.confirmReset": "Yes, reset everything",
    "settings.danger": "Danger zone",
    "settings.dangerSummary": "Reset all groups, links, notes, and recent visits for this page.",
    "settings.exportJson": "Export JSON",
    "settings.group": "Group",
    "settings.groups": "Groups",
    "settings.groupsDetail": "Rename, reorder, and remove navigation sections. Add new groups from the home page.",
    "settings.groupsEmpty": "No groups yet. Add one from the home page.",
    "settings.groupsSummary": "Create, rename, reorder, and remove navigation sections.",
    "settings.importError": "That file could not be imported. Please choose a valid JSON export.",
    "settings.importJson": "Import JSON",
    "settings.language": "Language",
    "settings.languageHint": "Only built-in interface text changes. Your groups, links, notes, and city names stay as you wrote them.",
    "settings.languageLabel": "Interface language",
    "settings.languageSummary": "Change interface text without changing your custom content.",
    "settings.links": "Links",
    "settings.linksDetail": "Choose a group to manage its websites, or add a new website into Uncategorized.",
    "settings.linksEmpty": "No websites yet. Add your first website here.",
    "settings.linksSummary": "Browse groups and manage websites.",
    "settings.addWebsite": "Add website",
    "settings.noBackground": "No custom background selected.",
    "settings.noteItems": "Note items (one per line)",
    "settings.noteTitle": "Note title",
    "settings.notes": "Notes",
    "settings.notesSummary": "Edit the custom note shown on the home page.",
    "settings.pageSettings": "Page settings",
    "settings.resetPage": "Reset page",
    "settings.resetWarning": "This will restore the default navigation and clear your current page setup.",
    "settings.saveGroup": "Save group",
    "settings.saveLink": "Save link",
    "settings.saveNote": "Save note",
    "settings.title": "Settings",
    "settings.uncategorizedGroup": "Uncategorized",
    "settings.uploadBackground": "Upload background image",
    "settings.closeEditor": "Close editor",
    "status.backgroundDefault": "Using default background.",
    "status.backgroundLarge": "This image is too large to save locally. Try another image.",
    "status.backgroundProcessing": "Processing background image...",
    "status.backgroundSaved": "Custom background saved in this browser.",
    "status.backgroundUnsupported": "This image could not be used as a background.",
    "confirm.deleteGroupMove": "Delete the \"{title}\" group and move its websites to Uncategorized?",
    "confirm.deleteLink": "Delete the \"{title}\" website?",
    "theme.switchToDark": "Switch to dark mode",
    "theme.switchToLight": "Switch to light mode",
    "weather.changeCity": "Change city",
    "weather.error": "Weather update failed",
    "weather.refresh": "Refresh",
    "weather.title": "Weather",
    "weather.unknown": "Updating weather",
    "weather.updatedAt": "Updated {time}",
  },
  "zh-CN": {
    "meta.title": "个人导航页",
    "common.back": "返回",
    "common.cancel": "取消",
    "common.clear": "清除",
    "common.delete": "删除",
    "common.down": "下移",
    "common.edit": "编辑",
    "common.move": "移动",
    "common.search": "搜索",
    "common.title": "标题",
    "common.up": "上移",
    "common.url": "网址",
    "home.addGroup": "添加分类",
    "home.addGroupHint": "新建导航分组",
    "home.addWebsite": "添加网站",
    "home.controlRoom": "在新标签页打开链接，让这里保持为你的控制台。",
    "home.curatedAccess": "快捷入口",
    "home.groupLinks": "分类网站",
    "home.groupEmpty": "这个分类里还没有网站。",
    "home.openGroup": "打开 {title} 分类",
    "home.siteCount": "{count} 个网站",
    "home.siteCountOne": "1 个网站",
    "home.yourSpaces": "你的分组",
    "modal.addGroup": "添加分类",
    "modal.addLink": "添加网站",
    "modal.addLinkChoice": "添加到 {title}",
    "modal.addLinkNew": "新添加网址",
    "modal.addLinkNewHint": "直接在当前分类中新建一个网站。",
    "modal.addLinkImport": "从未分类网址导入",
    "modal.addLinkImportHint": "把一个或多个未分类网站移动到当前分类。",
    "modal.editGroup": "编辑分类",
    "modal.editLink": "编辑网站",
    "modal.importHint": "选择要移动到 {title} 的未分类网站。",
    "modal.importEmpty": "当前没有可导入的未分类网站。",
    "modal.importSelected": "导入所选",
    "modal.moveLink": "移动网站",
    "note.eyebrow": "自定义",
    "recent.empty": "还没有最近访问记录。",
    "recent.eyebrow": "最近",
    "recent.title": "访问",
    "quickAccess.add": "添加",
    "quickAccess.available": "已收藏的网站",
    "quickAccess.edit": "编辑快速访问",
    "quickAccess.empty": "还没有固定入口。",
    "quickAccess.eyebrow": "快捷",
    "quickAccess.full": "已满",
    "quickAccess.modalTitle": "快速访问",
    "quickAccess.noneSaved": "当前没有可添加的收藏网站。",
    "quickAccess.noneSearchMatches": "未找到匹配网站。",
    "quickAccess.noneSelected": "还没有固定入口。",
    "quickAccess.searchAria": "按网站标题筛选收藏网站",
    "quickAccess.searchPlaceholder": "搜索收藏网站",
    "quickAccess.selected": "已添加",
    "quickAccess.title": "快速访问",
    "quickAccess.current": "已添加",
    "search.aria": "选择搜索引擎",
    "search.current": "当前搜索引擎：{engine}",
    "search.directUrl": "打开网址",
    "search.empty": "未找到匹配的已保存网站。",
    "search.groupMeta": "{group} 分组",
    "search.saved": "已保存网站",
    "search.searchWeb": "搜索网页",
    "search.with": "使用 {engine} 搜索，或者输入网址",
    "settings.background": "背景",
    "settings.backgroundSummary": "为当前浏览器设置自定义页面背景。",
    "settings.backup": "备份",
    "settings.backupSummary": "在浏览器或设备之间迁移配置。",
    "settings.clearBackground": "清除背景",
    "settings.confirmReset": "确认重置全部内容",
    "settings.danger": "危险操作",
    "settings.dangerSummary": "重置本页的分组、链接、备注和最近访问。",
    "settings.exportJson": "导出 JSON",
    "settings.group": "分类",
    "settings.groups": "分类",
    "settings.groupsDetail": "重命名、排序和删除导航分类。新增分类请从主页进入。",
    "settings.groupsEmpty": "还没有分类。请从主页添加一个分类。",
    "settings.groupsSummary": "管理导航分类的命名、排序和删除。",
    "settings.importError": "无法导入该文件。请选择有效的 JSON 导出文件。",
    "settings.importJson": "导入 JSON",
    "settings.language": "语言",
    "settings.languageHint": "只会替换内置界面文本。你的分组、链接、备注和城市名会保持原样。",
    "settings.languageLabel": "界面语言",
    "settings.languageSummary": "切换界面文本，不改变自定义内容。",
    "settings.links": "网站",
    "settings.linksDetail": "先选择分类进入对应网站页，或直接新增到未分类。",
    "settings.linksEmpty": "还没有网站。在这里添加你的第一个网站。",
    "settings.linksSummary": "浏览分类并管理网站。",
    "settings.addWebsite": "添加网站",
    "settings.noBackground": "未选择自定义背景。",
    "settings.noteItems": "备注项目（每行一个）",
    "settings.noteTitle": "备注标题",
    "settings.notes": "备注",
    "settings.notesSummary": "编辑主页上显示的自定义备注。",
    "settings.pageSettings": "页面设置",
    "settings.resetPage": "重置页面",
    "settings.resetWarning": "这会恢复默认导航，并清除你当前的页面配置。",
    "settings.saveGroup": "保存分类",
    "settings.saveLink": "保存网站",
    "settings.saveNote": "保存备注",
    "settings.title": "设置",
    "settings.uncategorizedGroup": "未分类",
    "settings.uploadBackground": "上传背景图片",
    "settings.closeEditor": "关闭设置",
    "status.backgroundDefault": "正在使用默认背景。",
    "status.backgroundLarge": "这张图片太大，无法保存到本地。请换一张图片。",
    "status.backgroundProcessing": "正在处理背景图片...",
    "status.backgroundSaved": "自定义背景已保存在当前浏览器。",
    "status.backgroundUnsupported": "这张图片无法作为背景使用。",
    "confirm.deleteGroupMove": "删除“{title}”分类，并把其中的网站移动到未分类？",
    "confirm.deleteLink": "删除“{title}”网站？",
    "theme.switchToDark": "切换到深色模式",
    "theme.switchToLight": "切换到浅色模式",
    "weather.changeCity": "切换城市",
    "weather.error": "天气获取失败",
    "weather.refresh": "刷新",
    "weather.title": "天气",
    "weather.unknown": "天气更新中",
    "weather.updatedAt": "更新于 {time}",
  },
  "zh-HK": {
    "meta.title": "個人導航頁",
    "common.back": "返回",
    "common.cancel": "取消",
    "common.clear": "清除",
    "common.delete": "刪除",
    "common.down": "下移",
    "common.edit": "編輯",
    "common.move": "移動",
    "common.move": "移動",
    "common.search": "搜尋",
    "common.title": "標題",
    "common.up": "上移",
    "common.url": "網址",
    "home.addGroup": "新增分類",
    "home.addGroupHint": "建立導航分組",
    "home.controlRoom": "連結會在新分頁開啟，讓這裏保持為你的控制台。",
    "home.curatedAccess": "快捷入口",
    "home.groupLinks": "分類網站",
    "home.groupEmpty": "這個分類裡還沒有網站。",
    "home.openGroup": "開啟 {title} 分類",
    "home.siteCount": "{count} 個網站",
    "home.siteCountOne": "1 個網站",
    "home.yourSpaces": "你的分組",
    "modal.addGroup": "新增分類",
    "modal.addLink": "新增網站",
    "modal.addLinkChoice": "新增到 {title}",
    "modal.addLinkNew": "新添加網址",
    "modal.addLinkNewHint": "直接在目前分類中新建一個網站。",
    "modal.addLinkImport": "從未分類網站匯入",
    "modal.addLinkImportHint": "把一個或多個未分類網站移動到目前分類。",
    "modal.editGroup": "編輯分類",
    "modal.editLink": "編輯網站",
    "modal.importHint": "選擇要移動到 {title} 的未分類網站。",
    "modal.importEmpty": "目前沒有可匯入的未分類網站。",
    "modal.importSelected": "匯入所選",
    "modal.moveLink": "移動網站",
    "note.eyebrow": "自訂",
    "recent.empty": "尚未有最近訪問紀錄。",
    "recent.eyebrow": "最近",
    "recent.title": "訪問",
    "quickAccess.add": "新增",
    "quickAccess.available": "已收藏的網站",
    "quickAccess.edit": "編輯快速入口",
    "quickAccess.empty": "尚未有固定入口。",
    "quickAccess.eyebrow": "快捷",
    "quickAccess.full": "已滿",
    "quickAccess.modalTitle": "快速入口",
    "quickAccess.noneSaved": "目前沒有可加入的收藏網站。",
    "quickAccess.noneSearchMatches": "找不到符合的網站。",
    "quickAccess.noneSelected": "尚未有固定入口。",
    "quickAccess.searchAria": "按網站名稱篩選收藏網站",
    "quickAccess.searchPlaceholder": "搜尋收藏網站",
    "quickAccess.selected": "已加入",
    "quickAccess.title": "快速入口",
    "quickAccess.current": "已加入",
    "search.aria": "選擇搜尋引擎",
    "search.current": "目前搜尋引擎：{engine}",
    "search.with": "使用 {engine} 搜尋，或輸入網址",
    "settings.background": "背景",
    "settings.backgroundSummary": "只為目前瀏覽器設定自訂頁面背景。",
    "settings.backup": "備份",
    "settings.backupSummary": "在瀏覽器或裝置之間轉移設定。",
    "settings.clearBackground": "清除背景",
    "settings.confirmReset": "確認重置所有內容",
    "settings.danger": "危險操作",
    "settings.dangerSummary": "重置本頁的分類、連結、備註和最近訪問。",
    "settings.exportJson": "匯出 JSON",
    "settings.group": "分類",
    "settings.groups": "分類",
    "settings.groupsDetail": "重新命名、排序和刪除導航分類。新增分類請從主頁進入。",
    "settings.groupsEmpty": "尚未有分類。請從主頁新增分類。",
    "settings.groupsSummary": "管理導航分類的命名、排序和刪除。",
    "settings.importError": "無法匯入此檔案。請選擇有效的 JSON 匯出檔。",
    "settings.importJson": "匯入 JSON",
    "settings.language": "語言",
    "settings.languageHint": "只會替換內建介面文字。你的分類、連結、備註和城市名稱會保持原樣。",
    "settings.languageLabel": "介面語言",
    "settings.languageSummary": "切換介面文字，不改變自訂內容。",
    "settings.links": "網站",
    "settings.linksDetail": "先選擇分類進入對應網站頁，或直接新增到未分類。",
    "settings.linksEmpty": "尚未有網站。請先在這裡新增第一個網站。",
    "settings.linksSummary": "瀏覽分類並管理網站。",
    "settings.addWebsite": "新增網站",
    "settings.noBackground": "未選擇自訂背景。",
    "settings.noteItems": "備註項目（每行一個）",
    "settings.noteTitle": "備註標題",
    "settings.notes": "備註",
    "settings.notesSummary": "編輯主頁上顯示的自訂備註。",
    "settings.pageSettings": "頁面設定",
    "settings.resetPage": "重置頁面",
    "settings.resetWarning": "這會恢復預設導航，並清除你目前的頁面設定。",
    "settings.saveGroup": "儲存分類",
    "settings.saveLink": "儲存網站",
    "settings.saveNote": "儲存備註",
    "settings.title": "設定",
    "settings.uncategorizedGroup": "未分類",
    "settings.uploadBackground": "上載背景圖片",
    "settings.closeEditor": "關閉設定",
    "status.backgroundDefault": "正在使用預設背景。",
    "status.backgroundLarge": "這張圖片太大，無法儲存到本機。請更換圖片。",
    "status.backgroundProcessing": "正在處理背景圖片...",
    "status.backgroundSaved": "自訂背景已儲存在目前瀏覽器。",
    "status.backgroundUnsupported": "這張圖片無法作為背景使用。",
    "confirm.deleteGroupMove": "刪除「{title}」分類，並把其中的網站移到未分類？",
    "confirm.deleteLink": "刪除「{title}」網站？",
    "theme.switchToDark": "切換至深色模式",
    "theme.switchToLight": "切換至淺色模式",
    "weather.changeCity": "切換城市",
    "weather.error": "天氣取得失敗",
    "weather.refresh": "重新整理",
    "weather.title": "天氣",
    "weather.unknown": "天氣更新中",
    "weather.updatedAt": "更新於 {time}",
  },
  "zh-TW": {
    "meta.title": "個人導航頁",
    "common.back": "返回",
    "common.cancel": "取消",
    "common.clear": "清除",
    "common.delete": "刪除",
    "common.down": "下移",
    "common.edit": "編輯",
    "common.search": "搜尋",
    "common.title": "標題",
    "common.up": "上移",
    "common.url": "網址",
    "home.addGroup": "新增分類",
    "home.addGroupHint": "建立導航分組",
    "home.controlRoom": "連結會在新分頁開啟，讓這裡保持為你的控制台。",
    "home.curatedAccess": "快捷入口",
    "home.groupLinks": "分類網站",
    "home.groupEmpty": "這個分類裡還沒有網站。",
    "home.openGroup": "開啟 {title} 分類",
    "home.siteCount": "{count} 個網站",
    "home.siteCountOne": "1 個網站",
    "home.yourSpaces": "你的分組",
    "modal.addGroup": "新增分類",
    "modal.addLink": "新增網站",
    "modal.addLinkChoice": "新增到 {title}",
    "modal.addLinkNew": "新添加網址",
    "modal.addLinkNewHint": "直接在目前分類中新建一個網站。",
    "modal.addLinkImport": "從未分類網站匯入",
    "modal.addLinkImportHint": "把一個或多個未分類網站移動到目前分類。",
    "modal.editGroup": "編輯分類",
    "modal.editLink": "編輯網站",
    "modal.importHint": "選擇要移動到 {title} 的未分類網站。",
    "modal.importEmpty": "目前沒有可匯入的未分類網站。",
    "modal.importSelected": "匯入所選",
    "modal.moveLink": "移動網站",
    "note.eyebrow": "自訂",
    "recent.empty": "尚未有最近造訪紀錄。",
    "recent.eyebrow": "最近",
    "recent.title": "造訪",
    "quickAccess.add": "新增",
    "quickAccess.available": "已收藏的網站",
    "quickAccess.edit": "編輯快速入口",
    "quickAccess.empty": "尚未有固定入口。",
    "quickAccess.eyebrow": "快捷",
    "quickAccess.full": "已滿",
    "quickAccess.modalTitle": "快速入口",
    "quickAccess.noneSaved": "目前沒有可加入的收藏網站。",
    "quickAccess.noneSearchMatches": "找不到符合的網站。",
    "quickAccess.noneSelected": "尚未有固定入口。",
    "quickAccess.searchAria": "按網站名稱篩選收藏網站",
    "quickAccess.searchPlaceholder": "搜尋收藏網站",
    "quickAccess.selected": "已加入",
    "quickAccess.title": "快速入口",
    "quickAccess.current": "已加入",
    "search.aria": "選擇搜尋引擎",
    "search.current": "目前搜尋引擎：{engine}",
    "search.with": "使用 {engine} 搜尋，或輸入網址",
    "settings.background": "背景",
    "settings.backgroundSummary": "只為目前瀏覽器設定自訂頁面背景。",
    "settings.backup": "備份",
    "settings.backupSummary": "在瀏覽器或裝置之間轉移設定。",
    "settings.clearBackground": "清除背景",
    "settings.confirmReset": "確認重置所有內容",
    "settings.danger": "危險操作",
    "settings.dangerSummary": "重置本頁的分類、連結、備註和最近造訪。",
    "settings.exportJson": "匯出 JSON",
    "settings.group": "分類",
    "settings.groups": "分類",
    "settings.groupsDetail": "重新命名、排序和刪除導航分類。新增分類請從首頁進入。",
    "settings.groupsEmpty": "尚未有分類。請從首頁新增分類。",
    "settings.groupsSummary": "管理導航分類的命名、排序和刪除。",
    "settings.importError": "無法匯入此檔案。請選擇有效的 JSON 匯出檔。",
    "settings.importJson": "匯入 JSON",
    "settings.language": "語言",
    "settings.languageHint": "只會替換內建介面文字。你的分類、連結、備註和城市名稱會保持原樣。",
    "settings.languageLabel": "介面語言",
    "settings.languageSummary": "切換介面文字，不改變自訂內容。",
    "settings.links": "網站",
    "settings.linksDetail": "先選擇分類進入對應網站頁，或直接新增到未分類。",
    "settings.linksEmpty": "尚未有網站。請先在這裡新增第一個網站。",
    "settings.linksSummary": "瀏覽分類並管理網站。",
    "settings.addWebsite": "新增網站",
    "settings.noBackground": "未選擇自訂背景。",
    "settings.noteItems": "備註項目（每行一個）",
    "settings.noteTitle": "備註標題",
    "settings.notes": "備註",
    "settings.notesSummary": "編輯首頁上顯示的自訂備註。",
    "settings.pageSettings": "頁面設定",
    "settings.resetPage": "重置頁面",
    "settings.resetWarning": "這會恢復預設導航，並清除你目前的頁面設定。",
    "settings.saveGroup": "儲存分類",
    "settings.saveLink": "儲存網站",
    "settings.saveNote": "儲存備註",
    "settings.title": "設定",
    "settings.uncategorizedGroup": "未分類",
    "settings.uploadBackground": "上傳背景圖片",
    "settings.closeEditor": "關閉設定",
    "status.backgroundDefault": "正在使用預設背景。",
    "status.backgroundLarge": "這張圖片太大，無法儲存到本機。請更換圖片。",
    "status.backgroundProcessing": "正在處理背景圖片...",
    "status.backgroundSaved": "自訂背景已儲存在目前瀏覽器。",
    "status.backgroundUnsupported": "這張圖片無法作為背景使用。",
    "confirm.deleteGroupMove": "刪除「{title}」分類，並把其中的網站移到未分類？",
    "confirm.deleteLink": "刪除「{title}」網站？",
    "theme.switchToDark": "切換至深色模式",
    "theme.switchToLight": "切換至淺色模式",
    "weather.changeCity": "切換城市",
    "weather.error": "天氣取得失敗",
    "weather.refresh": "重新整理",
    "weather.title": "天氣",
    "weather.unknown": "天氣更新中",
    "weather.updatedAt": "更新於 {time}",
  },
  ja: {
    "meta.title": "個人ナビゲーションページ",
    "common.back": "戻る",
    "common.cancel": "キャンセル",
    "common.clear": "クリア",
    "common.delete": "削除",
    "common.down": "下へ",
    "common.edit": "編集",
    "common.move": "移動",
    "common.search": "検索",
    "common.title": "タイトル",
    "common.up": "上へ",
    "common.url": "URL",
    "home.addGroup": "分類を追加",
    "home.addGroupHint": "新しいナビゲーション分類",
    "home.controlRoom": "リンクは新しいタブで開き、このページをコントロールルームとして保ちます。",
    "home.curatedAccess": "クイックアクセス",
    "home.groupLinks": "分類内のサイト",
    "home.groupEmpty": "この分類にはまだサイトがありません。",
    "home.openGroup": "{title} を開く",
    "home.siteCount": "{count} 件のサイト",
    "home.siteCountOne": "1 件のサイト",
    "home.yourSpaces": "あなたの分類",
    "modal.addGroup": "分類を追加",
    "modal.addLink": "サイトを追加",
    "modal.addLinkChoice": "{title} に追加",
    "modal.addLinkNew": "新しく追加",
    "modal.addLinkNewHint": "この分類に新しいサイトを直接追加します。",
    "modal.addLinkImport": "未分類から取り込む",
    "modal.addLinkImportHint": "未分類のサイトを 1 件以上この分類へ移動します。",
    "modal.editGroup": "分類を編集",
    "modal.editLink": "サイトを編集",
    "modal.importHint": "{title} に移動する未分類サイトを選択します。",
    "modal.importEmpty": "取り込める未分類サイトはありません。",
    "modal.importSelected": "選択項目を取り込む",
    "modal.moveLink": "サイトを移動",
    "note.eyebrow": "カスタム",
    "recent.empty": "最近の訪問はまだありません。",
    "recent.eyebrow": "最近",
    "recent.title": "訪問",
    "quickAccess.add": "追加",
    "quickAccess.available": "保存済みサイト",
    "quickAccess.edit": "クイックアクセスを編集",
    "quickAccess.empty": "固定ショートカットはまだありません。",
    "quickAccess.eyebrow": "クイック",
    "quickAccess.full": "上限",
    "quickAccess.modalTitle": "Quick Access",
    "quickAccess.noneSaved": "追加できる保存済みサイトがありません。",
    "quickAccess.noneSelected": "固定ショートカットはまだありません。",
    "quickAccess.selected": "追加済み",
    "quickAccess.title": "Quick Access",
    "quickAccess.current": "追加済み",
    "search.aria": "検索エンジンを選択",
    "search.current": "現在の検索エンジン: {engine}",
    "search.with": "{engine} で検索、または URL を入力",
    "settings.background": "背景",
    "settings.backgroundSummary": "このブラウザだけのカスタム背景を設定します。",
    "settings.backup": "バックアップ",
    "settings.backupSummary": "ブラウザやデバイス間で設定を移動します。",
    "settings.clearBackground": "背景をクリア",
    "settings.confirmReset": "すべてリセットする",
    "settings.danger": "危険な操作",
    "settings.dangerSummary": "このページの分類、リンク、メモ、最近の訪問をリセットします。",
    "settings.exportJson": "JSON をエクスポート",
    "settings.group": "分類",
    "settings.groups": "分類",
    "settings.groupsDetail": "ナビゲーション分類の名前変更、並べ替え、削除を行います。新規分類はホームから追加します。",
    "settings.groupsEmpty": "分類はまだありません。ホームから分類を追加してください。",
    "settings.groupsSummary": "分類の名前変更、並べ替え、削除を管理します。",
    "settings.importError": "このファイルをインポートできません。有効な JSON エクスポートを選択してください。",
    "settings.importJson": "JSON をインポート",
    "settings.language": "言語",
    "settings.languageHint": "組み込みの UI テキストだけを変更します。分類、リンク、メモ、都市名はそのままです。",
    "settings.languageLabel": "表示言語",
    "settings.languageSummary": "カスタム内容を変えずに UI テキストを切り替えます。",
    "settings.links": "サイト",
    "settings.linksDetail": "まずカテゴリを選んでサイト一覧を管理するか、未分類へ新しいサイトを追加します。",
    "settings.linksEmpty": "サイトはまだありません。ここから最初のサイトを追加してください。",
    "settings.linksSummary": "カテゴリを見ながらサイトを管理します。",
    "settings.addWebsite": "サイトを追加",
    "settings.noBackground": "カスタム背景は選択されていません。",
    "settings.noteItems": "メモ項目（1 行に 1 つ）",
    "settings.noteTitle": "メモのタイトル",
    "settings.notes": "メモ",
    "settings.notesSummary": "ホームに表示するカスタムメモを編集します。",
    "settings.pageSettings": "ページ設定",
    "settings.resetPage": "ページをリセット",
    "settings.resetWarning": "既定のナビゲーションに戻し、現在のページ設定を消去します。",
    "settings.saveGroup": "分類を保存",
    "settings.saveLink": "サイトを保存",
    "settings.saveNote": "メモを保存",
    "settings.title": "設定",
    "settings.uncategorizedGroup": "未分類",
    "settings.uploadBackground": "背景画像をアップロード",
    "settings.closeEditor": "設定を閉じる",
    "status.backgroundDefault": "既定の背景を使用しています。",
    "status.backgroundLarge": "この画像は大きすぎてローカルに保存できません。別の画像を試してください。",
    "status.backgroundProcessing": "背景画像を処理しています...",
    "status.backgroundSaved": "カスタム背景をこのブラウザに保存しました。",
    "status.backgroundUnsupported": "この画像は背景として使用できません。",
    "confirm.deleteGroupMove": "「{title}」分類を削除し、中のサイトを未分類へ移動しますか？",
    "confirm.deleteLink": "「{title}」サイトを削除しますか？",
    "theme.switchToDark": "ダークモードに切り替え",
    "theme.switchToLight": "ライトモードに切り替え",
    "weather.changeCity": "都市を切り替え",
    "weather.error": "天気を取得できませんでした",
    "weather.refresh": "更新",
    "weather.title": "天気",
    "weather.unknown": "天気を更新中",
    "weather.updatedAt": "{time} 更新",
  },
};
const SEARCH_ENGINES = {
  bing: {
    label: "Bing",
    iconUrl: SEARCH_ENGINE_ICONS.bing,
    placeholder: "Search with Bing",
    buildUrl(query) {
      return `https://www.bing.com/search?q=${encodeURIComponent(query)}`;
    },
  },
  google: {
    label: "Google",
    iconUrl: SEARCH_ENGINE_ICONS.google,
    placeholder: "Search with Google",
    buildUrl(query) {
      return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    },
  },
  wikipedia: {
    label: "Wikipedia",
    iconUrl: SEARCH_ENGINE_ICONS.wikipedia,
    placeholder: "Search on Wikipedia",
    buildUrl(query) {
      return `https://zh.wikipedia.org/w/index.php?search=${encodeURIComponent(query)}`;
    },
  },
};
const WEATHER_GEOCODE_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const WEATHER_CITY_OPTIONS = [
  { label: "成都", query: "Chengdu" },
  { label: "上海", query: "Shanghai" },
  { label: "北京", query: "Beijing" },
  { label: "东京", query: "Tokyo" },
  { label: "伦敦", query: "London" },
];
const WEATHER_LABELS = {
  0: { day: "晴", night: "晴夜" },
  1: { day: "大致晴朗", night: "少云" },
  2: { day: "局部多云", night: "局部多云" },
  3: { day: "阴", night: "阴" },
  45: { day: "有雾", night: "有雾" },
  48: { day: "雾凇", night: "雾凇" },
  51: { day: "小毛雨", night: "小毛雨" },
  53: { day: "毛雨", night: "毛雨" },
  55: { day: "强毛雨", night: "强毛雨" },
  56: { day: "冻毛雨", night: "冻毛雨" },
  57: { day: "强冻毛雨", night: "强冻毛雨" },
  61: { day: "小雨", night: "小雨" },
  63: { day: "中雨", night: "中雨" },
  65: { day: "大雨", night: "大雨" },
  66: { day: "冻雨", night: "冻雨" },
  67: { day: "强冻雨", night: "强冻雨" },
  71: { day: "小雪", night: "小雪" },
  73: { day: "中雪", night: "中雪" },
  75: { day: "大雪", night: "大雪" },
  77: { day: "雪粒", night: "雪粒" },
  80: { day: "阵雨", night: "阵雨" },
  81: { day: "强阵雨", night: "强阵雨" },
  82: { day: "暴雨阵雨", night: "暴雨阵雨" },
  85: { day: "阵雪", night: "阵雪" },
  86: { day: "强阵雪", night: "强阵雪" },
  95: { day: "雷暴", night: "雷暴" },
  96: { day: "雷暴伴冰雹", night: "雷暴伴冰雹" },
  99: { day: "强雷暴伴冰雹", night: "强雷暴伴冰雹" },
};
const els = {
  pageBackground: document.querySelector("#pageBackground"),
  hero: document.querySelector(".hero"),
  clockDisplay: document.querySelector("#clockDisplay"),
  dateDisplay: document.querySelector("#dateDisplay"),
  searchForm: document.querySelector("#searchForm"),
  searchEngine: document.querySelector("#searchEngine"),
  searchEngineIcon: document.querySelector("#searchEngineIcon"),
  searchInput: document.querySelector("#searchInput"),
  searchSuggestions: document.querySelector("#searchSuggestions"),
  groupGrid: document.querySelector("#groupGrid"),
  homeAddWebsiteButton: document.querySelector("#homeAddWebsiteButton"),
  homeAddGroupButton: document.querySelector("#homeAddGroupButton"),
  weatherWidget: document.querySelector("#weatherWidget"),
  recentList: document.querySelector("#recentList"),
  quickAccessList: document.querySelector("#quickAccessList"),
  quickAccessMenuButton: document.querySelector("#quickAccessMenuButton"),
  noteTitleDisplay: document.querySelector("#noteTitleDisplay"),
  noteList: document.querySelector("#noteList"),
  editToggle: document.querySelector("#editToggle"),
  themeToggle: document.querySelector("#themeToggle"),
  exportButton: document.querySelector("#exportButton"),
  resetButton: document.querySelector("#resetButton"),
  cancelResetButton: document.querySelector("#cancelResetButton"),
  confirmResetButton: document.querySelector("#confirmResetButton"),
  resetConfirmPanel: document.querySelector("#resetConfirmPanel"),
  clearRecentButton: document.querySelector("#clearRecentButton"),
  editorDrawer: document.querySelector("#editorDrawer"),
  drawerBackdrop: document.querySelector("#drawerBackdrop"),
  editorDrawerEyebrow: document.querySelector("#editorDrawerEyebrow"),
  editorDrawerTitle: document.querySelector("#editorDrawerTitle"),
  editorBackButton: document.querySelector("#editorBackButton"),
  closeDrawerButton: document.querySelector("#closeDrawerButton"),
  profileForm: document.querySelector("#profileForm"),
  groupEditorList: document.querySelector("#groupEditorList"),
  linkEditorList: document.querySelector("#linkEditorList"),
  linkGroupEditorList: document.querySelector("#linkGroupEditorList"),
  linkGroupPageTitle: document.querySelector("#linkGroupPageTitle"),
  linkGroupPageCount: document.querySelector("#linkGroupPageCount"),
  addWebsiteButton: document.querySelector("#addWebsiteButton"),
  quickAccessEditorBody: document.querySelector("#quickAccessEditorBody"),
  backgroundImageInput: document.querySelector("#backgroundImageInput"),
  clearBackgroundButton: document.querySelector("#clearBackgroundButton"),
  backgroundImageStatus: document.querySelector("#backgroundImageStatus"),
  backgroundPreview: document.querySelector("#backgroundPreview"),
  languageSelect: document.querySelector("#languageSelect"),
  importInput: document.querySelector("#importInput"),
  groupModal: document.querySelector("#groupModal"),
  groupModalForm: document.querySelector("#groupModalForm"),
  groupModalTitle: document.querySelector("#groupModalTitle"),
  linkModal: document.querySelector("#linkModal"),
  linkModalForm: document.querySelector("#linkModalForm"),
  linkModalTitle: document.querySelector("#linkModalTitle"),
  linkGroupField: document.querySelector("#linkGroupField"),
  groupLinksModal: document.querySelector("#groupLinksModal"),
  groupLinksModalTitle: document.querySelector("#groupLinksModalTitle"),
  groupLinksModalBody: document.querySelector("#groupLinksModalBody"),
  groupAddChoiceBody: document.querySelector("#groupAddChoiceBody"),
  groupAddChoiceTitle: document.querySelector("#groupAddChoiceTitle"),
  uncategorizedImportTitle: document.querySelector("#uncategorizedImportTitle"),
  uncategorizedImportHint: document.querySelector("#uncategorizedImportHint"),
  uncategorizedImportList: document.querySelector("#uncategorizedImportList"),
  confirmUncategorizedImportButton: document.querySelector("#confirmUncategorizedImportButton"),
  quickAccessModal: document.querySelector("#quickAccessModal"),
  quickAccessModalTitle: document.querySelector("#quickAccessModalTitle"),
  quickAccessModalBody: document.querySelector("#quickAccessModalBody"),
};

function stripCustomLinkIcons(baseState) {
  let changed = false;
  const groups = baseState.groups.map((group) => ({
    ...group,
    links: group.links.map((link) => {
      if (!link.icon) return link;
      changed = true;
      return { ...link, icon: "" };
    }),
  }));
  return {
    state: changed ? { ...baseState, groups } : baseState,
    changed,
  };
}

const normalizedState = stripCustomLinkIcons(loadState(window.localStorage));
let state = normalizedState.state;
if (normalizedState.changed) {
  saveState(state, window.localStorage);
}
let drawerOpen = false;
let currentEditorPage = "home";
let activeModalId = "";
let weatherRequestToken = 0;
let weatherCityMenuOpen = false;
let activeGroupViewerId = "";
let activeLinkEditorGroupId = UNCATEGORIZED_GROUP_ID;
let groupAddTargetGroupId = "";
let uncategorizedImportSelection = new Set();
let activeSearchEngine = window.localStorage.getItem(SEARCH_ENGINE_STORAGE_KEY) || "bing";
let customBackgroundImage = window.localStorage.getItem(BACKGROUND_IMAGE_STORAGE_KEY) || "";
let storedThemePreference = window.localStorage.getItem(THEME_STORAGE_KEY) || "system";
let activeLanguage = normalizeLanguage(window.localStorage.getItem(LANGUAGE_STORAGE_KEY) || detectPreferredLanguage());
let backgroundStatusMessage = "";
let backgroundStatusKey = "";
let backgroundStatusTone = "info";
let resetConfirmOpen = false;
let linkModalGroupLocked = false;
let quickAccessSearchQuery = "";
let heroSearchQuery = "";
let searchSuggestionsOpen = false;
let activeSearchSuggestionIndex = -1;
let currentSearchSuggestions = [];

const EDITOR_PAGE_META = {
  home: { eyebrowKey: "settings.title", titleKey: "settings.pageSettings" },
  notes: { eyebrowKey: "settings.title", titleKey: "settings.notes" },
  groups: { eyebrowKey: "settings.title", titleKey: "settings.groups" },
  links: { eyebrowKey: "settings.title", titleKey: "settings.links" },
  linksGroup: { eyebrowKey: "settings.links", titleKey: "settings.links" },
  quickAccess: { eyebrowKey: "settings.title", titleKey: "quickAccess.title" },
  background: { eyebrowKey: "settings.title", titleKey: "settings.background" },
  language: { eyebrowKey: "settings.title", titleKey: "settings.language" },
  backup: { eyebrowKey: "settings.title", titleKey: "settings.backup" },
  danger: { eyebrowKey: "settings.title", titleKey: "settings.danger" },
};

function normalizeLanguage(language) {
  return SUPPORTED_LANGUAGES.includes(language) ? language : "en";
}

function detectPreferredLanguage() {
  const language = (navigator.language || "").toLowerCase();
  if (language.startsWith("zh-hk") || language.startsWith("zh-mo")) return "zh-HK";
  if (language.startsWith("zh-tw")) return "zh-TW";
  if (language.startsWith("zh")) return "zh-CN";
  if (language.startsWith("ja")) return "ja";
  return "en";
}

function t(key, replacements = {}) {
  const template = TRANSLATIONS[activeLanguage]?.[key] ?? TRANSLATIONS.en[key] ?? key;
  return Object.entries(replacements).reduce(
    (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
    template,
  );
}

function normalizeSearchText(value) {
  return String(value || "").trim().toLowerCase();
}

function isProbablyUrl(value) {
  const query = String(value || "").trim();
  if (!query || /\s/.test(query)) return false;
  if (/^https?:\/\//i.test(query)) return true;
  return /^[^\s]+\.[^\s]+/.test(query);
}

function normalizeUrlCandidate(value) {
  const query = String(value || "").trim();
  if (!query) return "";
  return /^https?:\/\//i.test(query) ? query : `https://${query}`;
}

function isInternalGroupId(groupId) {
  return groupId === UNCATEGORIZED_GROUP_ID;
}

function isInternalGroup(group) {
  return isInternalGroupId(group?.id);
}

function getDisplayGroupTitle(group) {
  if (!group) return "";
  return isInternalGroup(group) ? t("settings.uncategorizedGroup") : group.title;
}

function getHomepageGroups() {
  return state.groups.filter((group) => !isInternalGroup(group));
}

function getGroupManagerGroups() {
  return state.groups.filter((group) => !isInternalGroup(group));
}

function getWebsiteManagerGroups() {
  return state.groups;
}

function getActiveLinkEditorGroup() {
  return state.groups.find((group) => group.id === activeLinkEditorGroupId) || state.groups.find((group) => isInternalGroup(group));
}

function getUncategorizedGroup() {
  return state.groups.find((group) => group.id === UNCATEGORIZED_GROUP_ID);
}

function getGroupAddTargetGroup() {
  return state.groups.find((group) => group.id === groupAddTargetGroupId) || null;
}

function findLinkLocation(linkId) {
  for (const group of state.groups) {
    const link = group.links.find((entry) => entry.id === linkId);
    if (link) {
      return { group, link };
    }
  }
  return null;
}

function applyStaticTranslations() {
  document.documentElement.lang = LANGUAGE_META[activeLanguage]?.htmlLang || "en";
  document.title = t("meta.title");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.getAttribute("data-i18n"));
  });
  els.searchEngine?.setAttribute("aria-label", t("search.aria"));
  els.editToggle?.setAttribute("aria-label", t("settings.title"));
  els.closeDrawerButton?.setAttribute("aria-label", t("settings.closeEditor"));
  els.quickAccessMenuButton?.setAttribute("aria-label", t("quickAccess.edit"));
  els.quickAccessMenuButton?.setAttribute("title", t("quickAccess.edit"));
  els.homeAddWebsiteButton?.setAttribute("aria-label", t("home.addWebsite"));
  els.homeAddWebsiteButton?.setAttribute("title", t("home.addWebsite"));
  els.homeAddGroupButton?.setAttribute("aria-label", t("home.addGroup"));
  els.homeAddGroupButton?.setAttribute("title", t("home.addGroup"));
}

function persistLanguage(language) {
  activeLanguage = normalizeLanguage(language);
  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, activeLanguage);
  render();
}

function getResolvedTheme(themePreference = storedThemePreference) {
  if (themePreference === "light" || themePreference === "dark") return themePreference;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function updateThemeToggleUi() {
  if (!els.themeToggle) return;
  const resolvedTheme = getResolvedTheme();
  const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
  const label = nextTheme === "dark" ? t("theme.switchToDark") : t("theme.switchToLight");
  els.themeToggle.setAttribute("aria-label", label);
  els.themeToggle.setAttribute("title", label);
}

function applyTheme(themePreference = storedThemePreference) {
  storedThemePreference = themePreference || "system";
  const resolvedTheme = getResolvedTheme(storedThemePreference);
  document.body.setAttribute("data-theme", resolvedTheme);
  updateThemeToggleUi();
}

function persistThemePreference(themePreference) {
  storedThemePreference = themePreference;
  if (themePreference === "system") {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  } else {
    window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
  }
  applyTheme(themePreference);
}

function persist(nextState) {
  state = saveState(stripCustomLinkIcons(nextState).state, window.localStorage);
  render();
}

function persistWeather(updates) {
  persist(updateWeather(state, updates));
}

function persistSearchEngine(value) {
  activeSearchEngine = SEARCH_ENGINES[value] ? value : "bing";
  window.localStorage.setItem(SEARCH_ENGINE_STORAGE_KEY, activeSearchEngine);
  render();
}

function setBackgroundStatus(messageKey, tone = "info") {
  backgroundStatusKey = messageKey || "";
  backgroundStatusMessage = messageKey ? t(messageKey) : "";
  backgroundStatusTone = tone;
}

function applyCustomBackground() {
  if (customBackgroundImage) {
    const backgroundValue = `url("${customBackgroundImage}")`;
    els.pageBackground.style.backgroundImage = backgroundValue;
    document.body.classList.add("has-custom-background");
  } else {
    els.pageBackground.style.backgroundImage = "";
    document.body.classList.remove("has-custom-background");
  }
}

function persistCustomBackground(dataUrl) {
  try {
    customBackgroundImage = dataUrl || "";
    if (customBackgroundImage) {
      window.localStorage.setItem(BACKGROUND_IMAGE_STORAGE_KEY, customBackgroundImage);
      setBackgroundStatus("status.backgroundSaved");
    } else {
      window.localStorage.removeItem(BACKGROUND_IMAGE_STORAGE_KEY);
      setBackgroundStatus("status.backgroundDefault");
    }
    applyCustomBackground();
    render();
    return true;
  } catch {
    setBackgroundStatus("status.backgroundLarge", "error");
    render();
    return false;
  }
}

function getGreeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 5) return "Good night";
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function formatRelativeTime(timestamp) {
  const delta = Date.now() - timestamp;
  const minutes = Math.round(delta / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

function getWeatherLabel(code, isDay) {
  const entry = WEATHER_LABELS[Number(code)];
  if (!entry) return "天气更新中";
  return Number(isDay) === 0 ? entry.night : entry.day;
}

function formatWeatherTemperature(value) {
  return Number.isFinite(value) ? `${Math.round(value)}°C` : "--";
}

function formatWeatherUpdatedAt(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(activeLanguage, {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

async function fetchJson(url) {
  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    throw new Error(t("weather.error"));
  }
  return response.json();
}

function buildCityQueries(cityName) {
  const queries = [cityName];
  if (/[\u4e00-\u9fff]/.test(cityName) && !/[市州县区盟旗]$/.test(cityName)) {
    queries.push(`${cityName}市`);
  }
  return [...new Set(queries)];
}

function resolveWeatherCityOption(cityName) {
  return WEATHER_CITY_OPTIONS.find(
    (option) => option.label === cityName || option.query === cityName,
  ) || null;
}

function scoreLocation(location, cityName) {
  const featureWeight = {
    PPLC: 1000,
    PPLA: 900,
    PPLA2: 850,
    PPLA3: 800,
    PPLA4: 780,
    PPLG: 760,
    PPL: 700,
  };
  const normalizedInput = cityName.toLowerCase();
  const normalizedName = String(location.name || "").toLowerCase();
  const exactBonus =
    normalizedName === normalizedInput || normalizedName === `${normalizedInput}市` ? 500 : 0;
  const population = Number.isFinite(location.population) ? location.population / 100000 : 0;
  return (featureWeight[location.feature_code] || 0) + exactBonus + population;
}

function pickBestLocation(results, cityName) {
  if (!Array.isArray(results) || !results.length) return null;
  return [...results].sort((left, right) => scoreLocation(right, cityName) - scoreLocation(left, cityName))[0];
}

async function refreshWeather(cityName = state.weather.cityName) {
  const rawCity = String(cityName || "").trim() || state.weather.cityName || "成都";
  const preset = resolveWeatherCityOption(rawCity);
  const nextCity = preset ? preset.label : rawCity;
  const lookupCity = preset ? preset.query : rawCity;
  const requestToken = ++weatherRequestToken;
  persistWeather({ cityName: nextCity, status: "loading", error: "" });

  try {
    const geocodeResponses = await Promise.all(
      buildCityQueries(lookupCity).map((query) =>
        fetchJson(
          `${WEATHER_GEOCODE_URL}?name=${encodeURIComponent(query)}&count=10&language=zh&format=json`,
        ),
      ),
    );
    const location = pickBestLocation(
      geocodeResponses.flatMap((response) => response.results || []),
      lookupCity,
    );
    if (!location) {
      throw new Error(t("weather.error"));
    }

    const forecast = await fetchJson(
      `${WEATHER_FORECAST_URL}?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,weather_code,is_day&timezone=auto&forecast_days=1`,
    );
    if (requestToken !== weatherRequestToken) return;

    const current = forecast.current || {};
    persistWeather({
      cityName: nextCity,
      latitude: location.latitude,
      longitude: location.longitude,
      timezone: forecast.timezone || location.timezone || state.weather.timezone,
      status: "success",
      error: "",
      current: {
        temperature: formatWeatherTemperature(current.temperature_2m),
        summary: getWeatherLabel(current.weather_code, current.is_day),
        updatedAt: formatWeatherUpdatedAt(current.time),
      },
    });
  } catch (error) {
    if (requestToken !== weatherRequestToken) return;
    persistWeather({
      cityName: nextCity,
      status: "error",
      error: error instanceof Error ? error.message : t("weather.error"),
    });
  }
}

function buildInitials(title) {
  const words = String(title || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!words.length) return "•";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function getGroupSymbol(group) {
  const id = String(group?.id || "").trim();
  const title = String(group?.title || "").trim();
  const map = {
    "group-all": "apps",
    "group-daily": "home",
    "group-learning": "school",
    "group-acg": "palette",
    全部: "apps",
    日常: "home",
    学习: "school",
    二次元: "palette",
  };

  return map[id] || map[title] || "apps";
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function parseAccentColor(value) {
  const input = String(value || "").trim();
  const hexMatch = input.match(/^#([\da-f]{3}|[\da-f]{6})$/i);
  if (hexMatch) {
    const hex = hexMatch[1];
    if (hex.length === 3) {
      return {
        r: Number.parseInt(`${hex[0]}${hex[0]}`, 16),
        g: Number.parseInt(`${hex[1]}${hex[1]}`, 16),
        b: Number.parseInt(`${hex[2]}${hex[2]}`, 16),
      };
    }

    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = input.match(/^rgba?\(([^)]+)\)$/i);
  if (rgbMatch) {
    const [r = 95, g = 99, b = 104] = rgbMatch[1]
      .split(",")
      .slice(0, 3)
      .map((channel) => clampChannel(Number.parseFloat(channel)));
    return { r, g, b };
  }

  return { r: 95, g: 99, b: 104 };
}

function mixColor(colorA, colorB, amount) {
  const weight = Math.max(0, Math.min(1, amount));
  return {
    r: clampChannel(colorA.r + (colorB.r - colorA.r) * weight),
    g: clampChannel(colorA.g + (colorB.g - colorA.g) * weight),
    b: clampChannel(colorA.b + (colorB.b - colorA.b) * weight),
  };
}

function toRgba(color, alpha = 1) {
  return `rgba(${clampChannel(color.r)}, ${clampChannel(color.g)}, ${clampChannel(color.b)}, ${alpha})`;
}

function getNeutralColor(name) {
  const palette = {
    white: { r: 255, g: 255, b: 255 },
    black: { r: 0, g: 0, b: 0 },
    slate: { r: 95, g: 99, b: 104 },
    graphite: { r: 56, g: 60, b: 67 },
    ink: { r: 31, g: 31, b: 31 },
    night: { r: 32, g: 33, b: 36 },
    mist: { r: 232, g: 234, b: 237 },
  };
  return palette[name] || palette.slate;
}

function getSoftGroupTone(accentValue) {
  const accent = parseAccentColor(accentValue);
  const resolvedTheme = getResolvedTheme();

  if (resolvedTheme === "dark") {
    const background = mixColor(accent, getNeutralColor("night"), 0.68);
    const foreground = mixColor(accent, getNeutralColor("mist"), 0.42);
    const hoverBackground = mixColor(accent, getNeutralColor("night"), 0.58);
    const hoverForeground = mixColor(accent, getNeutralColor("white"), 0.48);
    return {
      background: toRgba(background, 0.92),
      foreground: toRgba(foreground, 0.98),
      border: toRgba(mixColor(accent, getNeutralColor("mist"), 0.18), 0.2),
      hoverBackground: toRgba(hoverBackground, 0.96),
      hoverForeground: toRgba(hoverForeground, 1),
      hoverBorder: toRgba(mixColor(accent, getNeutralColor("mist"), 0.24), 0.28),
    };
  }

  const background = mixColor(accent, getNeutralColor("white"), 0.84);
  const foreground = mixColor(accent, getNeutralColor("graphite"), 0.24);
  const hoverBackground = mixColor(accent, getNeutralColor("white"), 0.77);
  const hoverForeground = mixColor(accent, getNeutralColor("ink"), 0.18);
  return {
    background: toRgba(background, 0.92),
    foreground: toRgba(foreground, 0.96),
    border: toRgba(mixColor(accent, getNeutralColor("white"), 0.34), 0.72),
    hoverBackground: toRgba(hoverBackground, 0.96),
    hoverForeground: toRgba(hoverForeground, 1),
    hoverBorder: toRgba(mixColor(accent, getNeutralColor("white"), 0.24), 0.82),
  };
}

function getToneStyleVariables(tone) {
  if (!tone || typeof tone !== "object") return "";
  const entries = [
    ["--group-tone-bg", tone.background],
    ["--group-tone-fg", tone.foreground],
    ["--group-tone-border", tone.border],
    ["--group-tone-bg-hover", tone.hoverBackground],
    ["--group-tone-fg-hover", tone.hoverForeground],
    ["--group-tone-border-hover", tone.hoverBorder],
  ].filter(([, value]) => value);

  if (!entries.length) return "";
  return entries.map(([key, value]) => `${key}:${value}`).join(";");
}

function getHostName(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function getFaviconCandidates(url) {
  try {
    const parsedUrl = new URL(url);
    const origin = parsedUrl.origin;
    return [
      `${origin}/favicon.ico`,
      `${origin}/favicon.png`,
      `${origin}/favicon.svg`,
      `${origin}/apple-touch-icon.png`,
      `${origin}/apple-touch-icon-precomposed.png`,
    ];
  } catch {
    return [];
  }
}

function resolveSiteIconId(url) {
  const hostname = getHostName(url);
  if (!hostname) return "generic";
  if (hostname.includes("bilibili.com")) return "bilibili";
  if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "youtube";
  if (hostname.includes("twitch.tv")) return "twitch";
  if (hostname.includes("github.com")) return "github";
  if (hostname.includes("mail.google.com") || hostname.includes("gmail.com")) return "mail";
  if (hostname.includes("drive.google.com")) return "drive";
  if (hostname.includes("docs.google.com")) return "docs";
  if (hostname.includes("google.com")) return "google";
  if (hostname.includes("wikipedia.org")) return "wikipedia";
  if (hostname.includes("developer.mozilla.org")) return "mdn";
  if (hostname.includes("notion.so") || hostname.includes("notion.site")) return "notion";
  if (hostname.includes("figma.com")) return "figma";
  if (hostname.includes("vercel.com")) return "vercel";
  if (hostname.includes("openai.com") || hostname.includes("chatgpt.com")) return "chatgpt";
  if (hostname.includes("discord.com") || hostname.includes("discord.gg")) return "discord";
  if (hostname.includes("reddit.com")) return "reddit";
  if (hostname.includes("steampowered.com") || hostname.includes("steamcommunity.com")) return "steam";
  if (hostname.includes("netflix.com")) return "netflix";
  if (hostname.includes("spotify.com")) return "spotify";
  if (hostname.includes("twitter.com") || hostname.includes("x.com")) return "x";
  if (hostname.includes("instagram.com")) return "instagram";
  if (hostname.includes("facebook.com") || hostname.includes("fb.com")) return "facebook";
  if (hostname.includes("linkedin.com")) return "linkedin";
  if (hostname.includes("pixiv.net")) return "pixiv";
  if (hostname.includes("fanbox.cc")) return "fanbox";
  if (hostname.includes("moegirl.org.cn")) return "moegirl";
  return "generic";
}

function getSiteIconSvg(iconId) {
  const icons = {
    bilibili: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5.3 5.8 6.9M17 5.3l-1.2 1.6" />
        <rect x="4.4" y="7.2" width="15.2" height="10.8" rx="3.2" />
        <path d="M9.3 11.2v3M14.7 11.2v3" />
        <path d="M8.8 15.8c.7.5 1.8.8 3.2.8s2.5-.3 3.2-.8" />
      </svg>
    `,
    youtube: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.2" y="7.2" width="15.6" height="9.6" rx="3.7" />
        <path class="link-icon__svg-fill" d="m10.3 9.9 5 2.1-5 2.1z" />
      </svg>
    `,
    twitch: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.3 5.8h11.1v8.1l-2.7 2.7h-3.3L9 18.9v-2.3H6.3z" />
        <path d="M10 9.4v3.2M13.8 9.4v3.2" />
      </svg>
    `,
    github: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8.6 18.1c-2-.9-3.4-3-3.4-5.5 0-1.5.5-2.8 1.4-3.9l1.3.9 1.4-2 2.7 1 2.7-1 1.4 2 1.3-.9c.9 1.1 1.4 2.4 1.4 3.9 0 2.5-1.4 4.6-3.4 5.5" />
        <path d="M9.5 14.2c.5.4 1.4.7 2.5.7s2-.3 2.5-.7" />
      </svg>
    `,
    google: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.7 10.2h-6.2v3.5h3.5c-.5 1.7-2 2.8-4 2.8a4.5 4.5 0 1 1 3.1-7.8" />
      </svg>
    `,
    mail: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="4.8" y="7" width="14.4" height="10" rx="2.1" />
        <path d="m5.3 8 6.7 5.2L18.7 8" />
      </svg>
    `,
    drive: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9.1 5.8h5.8l5 8.8-2.9 5H7l-2.9-5z" />
        <path d="m9.1 5.8 2.9 8.8M14.9 5.8 12 14.6M4.1 14.6H12l5 5" />
      </svg>
    `,
    docs: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7 5.5h7l3 3v10H7z" />
        <path d="M14 5.5v3h3M9.5 12h5M9.5 15h5" />
      </svg>
    `,
    wikipedia: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5.4 7.2h13.2M7 7.2l3.2 9.6 2.2-6.3 2.2 6.3 2.8-9.6" />
      </svg>
    `,
    mdn: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.8 17.5v-11l4 6.4 4-6.4v11M16 17.5V6.5h3.2" />
      </svg>
    `,
    notion: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5.2" y="5.2" width="13.6" height="13.6" rx="2.2" />
        <path d="M9 16V8l6 8V8" />
      </svg>
    `,
    figma: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M10 5.5h4a2.3 2.3 0 0 1 0 4.6h-4a2.3 2.3 0 1 1 0-4.6z" />
        <path d="M10 10.1h4a2.3 2.3 0 1 1 0 4.6h-4zM10 14.7h2.3V17A2.3 2.3 0 1 1 10 14.7z" />
      </svg>
    `,
    vercel: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 6.2 7.1 12.1H4.9z" />
      </svg>
    `,
    chatgpt: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5.4a3.2 3.2 0 0 1 3.1 2.4 3.2 3.2 0 0 1 2.8 4.8 3.2 3.2 0 0 1-2.8 4.8A3.2 3.2 0 0 1 9 17.4a3.2 3.2 0 0 1-2.8-4.8A3.2 3.2 0 0 1 9 7.8 3.2 3.2 0 0 1 12 5.4z" />
        <path d="M8.8 9.8 12 8l3.2 1.8v3.8L12 15.4l-3.2-1.8z" />
      </svg>
    `,
    discord: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.2 8.2c1.3-.8 3-.9 4.8-.9s3.5.1 4.8.9l1 6.9c-1.6 1.2-3.5 1.7-5.8 1.7s-4.2-.5-5.8-1.7z" />
        <path d="M9.8 12.5h.1M14.1 12.5h.1M9 16l-1.5 2M15 16l1.5 2" />
      </svg>
    `,
    reddit: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="13" r="5.5" />
        <path d="M12 7.5 13.1 5l3.1.8M16.8 9.8l2.1-1.2M7.2 9.8 5.1 8.6M9.7 13h.1M14.2 13h.1M9.8 15.5c.6.5 1.3.8 2.2.8s1.6-.3 2.2-.8" />
      </svg>
    `,
    steam: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="15.5" cy="8.6" r="3.1" />
        <circle cx="8.2" cy="15.5" r="2.4" />
        <path d="M10.1 14.1 13 10.8M6 14.5l-2.1-.8M10.1 16.7l2.5 1.2" />
      </svg>
    `,
    netflix: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M7.5 18.5v-13h3l6 13h-3l-6-13M16.5 5.5v13" />
      </svg>
    `,
    spotify: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M8.2 10.1c2.7-.8 5.1-.6 7.6.8M8.8 12.7c2.1-.5 4.1-.4 6 .7M9.4 15c1.5-.3 3-.2 4.3.5" />
      </svg>
    `,
    x: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.4 6.2 17.6 18M17.6 6.2 6.4 18" />
      </svg>
    `,
    instagram: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5.8" y="5.8" width="12.4" height="12.4" rx="3.6" />
        <circle cx="12" cy="12" r="3" />
        <circle class="link-icon__svg-fill" cx="15.8" cy="8.3" r="0.8" />
      </svg>
    `,
    facebook: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.6 19v-6.1h2.1l.4-2.6h-2.5V8.8c0-.7.3-1.2 1.3-1.2h1.4V5.4c-.7-.1-1.4-.2-2.2-.2-2.2 0-3.7 1.3-3.7 3.5v1.6H8.2v2.6h2.2V19" />
      </svg>
    `,
    linkedin: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5.5" y="5.5" width="13" height="13" rx="2" />
        <path d="M8.8 10.7v4.8M8.8 8.6h.1M12 15.5v-4.8M12 12.4c.6-1.1 3.2-1.5 3.2 1.1v2" />
      </svg>
    `,
    pixiv: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 18V6.2h4.5c2.4 0 4.4 1.9 4.4 4.3s-2 4.3-4.4 4.3H8" />
        <path d="M8 12.6h3.6c2.3 0 4.4 1.7 4.4 4.1V18" />
      </svg>
    `,
    fanbox: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="6.2" y="6.2" width="11.6" height="11.6" rx="2.2" />
        <path d="M9 9h6v6H9z" />
      </svg>
    `,
    moegirl: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 5.4 13.8 9.6l4.6.4-3.5 2.9 1.1 4.5-4-2.4-4 2.4 1.1-4.5-3.5-2.9 4.6-.4z" />
        <circle class="link-icon__svg-fill" cx="16.9" cy="7.3" r="1.1" />
      </svg>
    `,
    generic: `
      <svg class="link-icon__svg" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="7" />
        <path d="M5.5 12h13M12 5.2c1.8 1.9 2.8 4.3 2.8 6.8S13.8 16.9 12 18.8M12 5.2C10.2 7.1 9.2 9.5 9.2 12s1 4.9 2.8 6.8" />
      </svg>
    `,
  };

  return icons[iconId] || icons.generic;
}

function iconMarkup(link, tone = null) {
  const candidates = getFaviconCandidates(link.url);
  const serializedCandidates = escapeHtml(JSON.stringify(candidates));
  const toneStyle = getToneStyleVariables(tone);
  const styleAttribute = toneStyle ? ` style="${escapeHtml(toneStyle)}"` : "";

  if (candidates.length) {
    return `
      <span class="link-icon link-icon--favicon"${styleAttribute}>
        <img
          class="link-icon__image"
          src="${escapeHtml(candidates[0])}"
          alt=""
          loading="lazy"
          decoding="async"
          data-favicon-index="0"
          data-favicon-candidates="${serializedCandidates}"
        />
        ${getSiteIconSvg("generic")}
      </span>
    `;
  }

  return `
    <span class="link-icon link-icon--system link-icon--fallback"${styleAttribute}>
      ${getSiteIconSvg("generic")}
    </span>
  `;
}

function badgeMarkup(icon, background) {
  if (/^(data:image|https?:)/.test(icon)) {
    return `<div class="group-card__badge" style="background:${background}"><img src="${icon}" alt="" /></div>`;
  }

  return `<div class="group-card__badge" style="background:${background}">${escapeHtml(icon || "•")}</div>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderClock() {
  const now = new Date();
  els.clockDisplay.textContent = new Intl.DateTimeFormat(activeLanguage, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(now);
  els.dateDisplay.textContent = new Intl.DateTimeFormat(activeLanguage, {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(now);
}

function renderHero() {
  const engine = SEARCH_ENGINES[activeSearchEngine] || SEARCH_ENGINES.bing;
  els.searchEngine.value = activeSearchEngine;
  els.searchEngine.title = t("search.current", { engine: engine.label });
  els.searchEngineIcon.src = engine.iconUrl;
  els.searchEngineIcon.alt = `${engine.label} icon`;
  els.searchInput.placeholder = t("search.with", { engine: engine.label });
  if (els.searchInput.value !== heroSearchQuery) {
    els.searchInput.value = heroSearchQuery;
  }
  renderSearchSuggestions();
  updateThemeToggleUi();
}

function renderGroups() {
  const groupCards = getHomepageGroups()
    .map((group) => {
      const tone = getSoftGroupTone(group.accent);
      const toneStyle = getToneStyleVariables(tone);
      return `
        <button
          class="group-card group-card--launcher"
          type="button"
          data-group-launch="${escapeHtml(group.id)}"
          aria-label="${escapeHtml(t("home.openGroup", { title: getDisplayGroupTitle(group) }))}"
        >
          <div class="group-card__header">
            <span class="group-card__badge group-card__badge--launcher"${toneStyle ? ` style="${escapeHtml(toneStyle)}"` : ""}>
              <span class="material-symbols-rounded group-card__symbol" aria-hidden="true">
                ${escapeHtml(getGroupSymbol(group))}
              </span>
            </span>
            <span class="group-card__title-wrap">
              <h4 class="group-card__title">${escapeHtml(getDisplayGroupTitle(group))}</h4>
              <span class="group-card__count">${escapeHtml(t(group.links.length === 1 ? "home.siteCountOne" : "home.siteCount", { count: group.links.length }))}</span>
            </span>
            <span class="group-card__open material-symbols-rounded" aria-hidden="true">arrow_forward</span>
          </div>
        </button>
      `;
    })
    .join("");
  els.groupGrid.innerHTML = groupCards;

  renderGroupViewer();
}

function renderGroupViewer() {
  const group = state.groups.find((entry) => entry.id === activeGroupViewerId);
  if (!group) {
    els.groupLinksModalTitle.textContent = t("home.groupLinks");
    els.groupLinksModalBody.innerHTML = `<div class="is-empty">${escapeHtml(t("home.groupEmpty"))}</div>`;
    return;
  }

  els.groupLinksModalTitle.textContent = getDisplayGroupTitle(group);
  const tone = getSoftGroupTone(group.accent);
  els.groupLinksModalBody.innerHTML = `
    <div class="group-links-modal__grid">
      ${
        group.links.length
          ? group.links
              .map(
                (link) => `
                  <a
                    class="group-card__link group-links-modal__link"
                    href="${escapeHtml(link.url)}"
                    target="_blank"
                    rel="noreferrer"
                    data-link-id="${escapeHtml(link.id)}"
                    data-group-id="${escapeHtml(group.id)}"
                  >
                    ${iconMarkup(link, tone)}
                    <span class="group-card__link-text">
                      <strong>${escapeHtml(link.title)}</strong>
                    </span>
                  </a>
                `,
              )
              .join("")
          : `<div class="is-empty">${escapeHtml(t("home.groupEmpty"))}</div>`
      }
      <button
        class="group-links-modal__add"
        type="button"
        data-add-link-group="${escapeHtml(group.id)}"
        aria-label="${escapeHtml(t("modal.addLink"))}"
        title="${escapeHtml(t("modal.addLink"))}"
      >
        <span class="material-symbols-rounded" aria-hidden="true">add_link</span>
      </button>
    </div>
  `;

  hydrateFaviconIcons(els.groupLinksModalBody);
}

function renderGroupAddChoiceModal() {
  const group = getGroupAddTargetGroup();
  if (!group || !els.groupAddChoiceBody) return;

  els.groupAddChoiceTitle.textContent = t("modal.addLinkChoice", { title: getDisplayGroupTitle(group) });
  els.groupAddChoiceBody.innerHTML = `
    <button class="editor-nav-card group-add-choice-card" type="button" data-group-add-choice="new">
      <span class="editor-nav-card__copy">
        <strong>${escapeHtml(t("modal.addLinkNew"))}</strong>
        <span>${escapeHtml(t("modal.addLinkNewHint"))}</span>
      </span>
      <span class="material-symbols-rounded editor-nav-card__icon" aria-hidden="true">chevron_right</span>
    </button>
    <button class="editor-nav-card group-add-choice-card" type="button" data-group-add-choice="import">
      <span class="editor-nav-card__copy">
        <strong>${escapeHtml(t("modal.addLinkImport"))}</strong>
        <span>${escapeHtml(t("modal.addLinkImportHint"))}</span>
      </span>
      <span class="material-symbols-rounded editor-nav-card__icon" aria-hidden="true">chevron_right</span>
    </button>
  `;
}

function renderUncategorizedImportModal() {
  const targetGroup = getGroupAddTargetGroup();
  if (!targetGroup || !els.uncategorizedImportList) return;

  const uncategorizedLinks = getUncategorizedGroup()?.links || [];
  uncategorizedImportSelection = new Set(
    [...uncategorizedImportSelection].filter((linkId) => uncategorizedLinks.some((link) => link.id === linkId)),
  );
  els.uncategorizedImportTitle.textContent = t("modal.addLinkImport");
  els.uncategorizedImportHint.textContent = t("modal.importHint", { title: getDisplayGroupTitle(targetGroup) });
  els.confirmUncategorizedImportButton.disabled = !uncategorizedLinks.length || uncategorizedImportSelection.size === 0;

  if (!uncategorizedLinks.length) {
    els.uncategorizedImportList.innerHTML = `<div class="is-empty">${escapeHtml(t("modal.importEmpty"))}</div>`;
    return;
  }

  els.uncategorizedImportList.innerHTML = uncategorizedLinks
    .map(
      (link) => `
        <label class="group-import-option">
          <span class="group-import-option__main">
            ${iconMarkup(link)}
            <span class="group-import-option__text">
              <strong>${escapeHtml(link.title)}</strong>
            </span>
          </span>
          <input
            class="group-import-option__checkbox"
            type="checkbox"
            value="${escapeHtml(link.id)}"
            data-import-link-id="${escapeHtml(link.id)}"
            ${uncategorizedImportSelection.has(link.id) ? "checked" : ""}
          />
        </label>
      `,
    )
    .join("");

  hydrateFaviconIcons(els.uncategorizedImportList);
}

function hydrateFaviconIcons(root = els.groupGrid) {
  root.querySelectorAll(".link-icon__image").forEach((image) => {
    image.addEventListener("error", () => {
      const candidates = JSON.parse(image.dataset.faviconCandidates || "[]");
      const nextIndex = Number(image.dataset.faviconIndex || 0) + 1;
      if (candidates[nextIndex]) {
        image.dataset.faviconIndex = String(nextIndex);
        image.src = candidates[nextIndex];
        return;
      }

      image.style.display = "none";
      image.parentElement?.classList.add("link-icon--fallback");
    });

    image.addEventListener("load", () => {
      image.style.display = "";
      image.parentElement?.classList.remove("link-icon--fallback");
    });
  });
}

function renderWeather() {
  const weather = state.weather;
  const summary = weather.current.summary || "-";
  const temperature = weather.current.temperature || "--°C";
  const updatedAt = weather.current.updatedAt ? t("weather.updatedAt", { time: weather.current.updatedAt }) : "-";
  const statusMarkup =
    weather.status === "error"
      ? `<p class="weather-widget__status weather-widget__status--error">${escapeHtml(weather.error || t("weather.error"))}</p>`
      : "";
  const cityOptionsMarkup = WEATHER_CITY_OPTIONS.map(
    (option) => `
      <button
        class="weather-widget__city-option${option.label === weather.cityName ? " is-active" : ""}"
        type="button"
        data-weather-action="select-city"
        data-city-name="${escapeHtml(option.label)}"
      >
        ${escapeHtml(option.label)}
      </button>
    `,
  ).join("");

  els.weatherWidget.innerHTML = `
    <div class="weather-widget__header">
      <div>
        <p class="eyebrow">${escapeHtml(t("weather.title"))}</p>
        <h3>${escapeHtml(weather.cityName)}</h3>
      </div>
      <div class="weather-widget__actions">
        <button class="text-button weather-widget__refresh" type="button" data-weather-action="change-city">${escapeHtml(t("weather.changeCity"))}</button>
        <button class="text-button weather-widget__refresh" type="button" data-weather-action="refresh">${escapeHtml(t("weather.refresh"))}</button>
      </div>
    </div>
    <p class="weather-widget__temp">${escapeHtml(temperature)}</p>
    <p class="weather-widget__summary">${escapeHtml(summary)}</p>
    <p class="weather-widget__meta">${escapeHtml(updatedAt)}</p>
    ${statusMarkup}
    ${
      weatherCityMenuOpen
        ? `<div class="weather-widget__city-list">${cityOptionsMarkup}</div>`
        : ""
    }
  `;
}

function renderRecentVisits() {
  if (!state.recentVisits.length) {
    els.recentList.innerHTML = `<div class="is-empty">${escapeHtml(t("recent.empty"))}</div>`;
    return;
  }

  els.recentList.innerHTML = state.recentVisits
    .map((entry) => {
      const matchedLink = state.groups
        .flatMap((group) => group.links)
        .find((link) => link.url === entry.url);

      return `
        <a
          class="recent-entry recent-entry--icon"
          href="${escapeHtml(entry.url)}"
          target="_blank"
          rel="noreferrer"
          aria-label="${escapeHtml(entry.title)}"
          title="${escapeHtml(entry.title)}"
        >
          ${iconMarkup({ title: entry.title, url: entry.url, icon: matchedLink?.icon || "" }, "rgba(255, 255, 255, 0.16)")}
        </a>
      `;
    })
    .join("");
  hydrateFaviconIcons(els.recentList);
}

function getSavedLinks() {
  return state.groups.flatMap((group) =>
    group.links.map((link) => ({
      ...link,
      groupId: group.id,
      groupTitle: getDisplayGroupTitle(group),
    })),
  );
}

function getSearchSuggestions(query) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];

  const matchedLinks = getSavedLinks()
    .filter((link) => {
      const host = (() => {
        try {
          return new URL(link.url).hostname.replace(/^www\./, "");
        } catch {
          return link.url;
        }
      })();
      return [link.title, host, link.groupTitle].some((value) =>
        normalizeSearchText(value).includes(normalizedQuery),
      );
    })
    .slice(0, 4)
    .map((link) => ({
      type: "link",
      id: `${link.groupId}::${link.id}`,
      title: link.title,
      meta: t("search.groupMeta", { group: link.groupTitle }),
      link,
    }));

  const suggestions = [...matchedLinks];
  if (isProbablyUrl(query)) {
    suggestions.push({
      type: "url",
      id: `url::${normalizeUrlCandidate(query)}`,
      title: query.trim(),
      meta: t("search.directUrl"),
      url: normalizeUrlCandidate(query),
    });
  }
  suggestions.push({
    type: "search",
    id: `search::${activeSearchEngine}::${normalizedQuery}`,
    title: query.trim(),
    meta: t("search.searchWeb"),
  });
  return suggestions.slice(0, 6);
}

function executeSearchSuggestion(suggestion) {
  if (!suggestion) return;
  if (suggestion.type === "link") {
    persist(recordVisit(state, { title: suggestion.link.title, url: suggestion.link.url }));
    window.open(suggestion.link.url, "_blank", "noopener,noreferrer");
  } else if (suggestion.type === "url") {
    window.open(suggestion.url, "_blank", "noopener,noreferrer");
  } else {
    const engine = SEARCH_ENGINES[activeSearchEngine] || SEARCH_ENGINES.bing;
    window.open(engine.buildUrl(suggestion.title), "_blank", "noopener,noreferrer");
  }
  heroSearchQuery = "";
  searchSuggestionsOpen = false;
  activeSearchSuggestionIndex = -1;
  currentSearchSuggestions = [];
  renderHero();
}

function renderSearchSuggestions() {
  if (!els.searchSuggestions || !els.searchInput) return;
  currentSearchSuggestions = getSearchSuggestions(heroSearchQuery);
  const shouldShow = searchSuggestionsOpen && heroSearchQuery.trim().length > 0;
  els.searchSuggestions.hidden = !shouldShow;
  if (!shouldShow) {
    els.searchSuggestions.innerHTML = "";
    return;
  }

  if (!currentSearchSuggestions.length) {
    activeSearchSuggestionIndex = -1;
    els.searchSuggestions.innerHTML = `<div class="search-suggestion search-suggestion--empty">${escapeHtml(t("search.empty"))}</div>`;
    return;
  }

  if (activeSearchSuggestionIndex >= currentSearchSuggestions.length) {
    activeSearchSuggestionIndex = currentSearchSuggestions.length - 1;
  }

  els.searchSuggestions.innerHTML = currentSearchSuggestions
    .map((suggestion, index) => {
      const isActive = index === activeSearchSuggestionIndex;
      const icon =
        suggestion.type === "link"
          ? iconMarkup(suggestion.link, "rgba(11, 87, 208, 0.08)")
          : `<span class="link-icon link-icon--system"><span class="material-symbols-rounded" aria-hidden="true">${
              suggestion.type === "url" ? "link" : "search"
            }</span></span>`;
      return `
        <button
          class="search-suggestion${isActive ? " is-active" : ""}"
          type="button"
          data-search-suggestion="${escapeHtml(String(index))}"
        >
          ${icon}
          <span class="search-suggestion__copy">
            <strong>${escapeHtml(suggestion.title)}</strong>
            <span>${escapeHtml(suggestion.meta)}</span>
          </span>
        </button>
      `;
    })
    .join("");

  hydrateFaviconIcons(els.searchSuggestions);
}

function getQuickAccessEntries() {
  const savedLinks = getSavedLinks();
  return state.quickAccess
    .map((entry) =>
      savedLinks.find((link) => link.groupId === entry.groupId && link.id === entry.linkId),
    )
    .filter(Boolean);
}

function normalizeQuickAccessSearch(value) {
  return String(value || "").trim().toLowerCase();
}

function renderEditorActionButton({ icon, label, attrs = "", disabled = false, tone = "" }) {
  const toneClass = tone ? ` editor-action-button--${tone}` : "";
  const disabledAttr = disabled ? " disabled" : "";
  return `
    <button
      class="editor-action-button${toneClass}"
      type="button"
      aria-label="${escapeHtml(label)}"
      title="${escapeHtml(label)}"
      ${attrs}${disabledAttr}
    >
      <span class="material-symbols-rounded" aria-hidden="true">${escapeHtml(icon)}</span>
    </button>
  `;
}

function renderQuickAccess() {
  const entries = getQuickAccessEntries();
  els.quickAccessMenuButton?.setAttribute("aria-label", t("quickAccess.edit"));
  els.quickAccessMenuButton?.setAttribute("title", t("quickAccess.edit"));

  if (!entries.length) {
    els.quickAccessList.innerHTML = `<div class="is-empty">${escapeHtml(t("quickAccess.empty"))}</div>`;
    return;
  }

  els.quickAccessList.innerHTML = entries
    .map(
      (entry) => `
        <a
          class="recent-entry recent-entry--icon"
          href="${escapeHtml(entry.url)}"
          target="_blank"
          rel="noreferrer"
          aria-label="${escapeHtml(entry.title)}"
          title="${escapeHtml(entry.title)}"
        >
          ${iconMarkup(entry, "rgba(255, 255, 255, 0.16)")}
        </a>
      `,
    )
    .join("");
  hydrateFaviconIcons(els.quickAccessList);
}

function openQuickAccessEditor() {
  drawerOpen = true;
  currentEditorPage = "quickAccess";
  resetConfirmOpen = false;
  render();
}

function runQuickAccessAction(action, groupId, linkId) {
  if (!linkId) return;

  if (action === "add" && groupId) {
    persist(addQuickAccess(state, { groupId, linkId }));
  }
  if (action === "remove" && groupId) {
    persist(removeQuickAccess(state, { groupId, linkId }));
  }
  if (action === "move-up") {
    persist(moveQuickAccess(state, linkId, "up"));
  }
  if (action === "move-down") {
    persist(moveQuickAccess(state, linkId, "down"));
  }
}

function bindQuickAccessActions(container) {
  if (!container) return;
  const searchInput = container.querySelector("[data-quick-access-search]");
  if (searchInput) {
    searchInput.addEventListener("input", (event) => {
      quickAccessSearchQuery = String(event.target.value || "");
      const caretStart = typeof event.target.selectionStart === "number" ? event.target.selectionStart : quickAccessSearchQuery.length;
      const caretEnd = typeof event.target.selectionEnd === "number" ? event.target.selectionEnd : quickAccessSearchQuery.length;
      renderQuickAccessEditor({ preserveSearchFocus: true, caretStart, caretEnd });
    });
  }
  container.querySelectorAll("button[data-quick-access-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      runQuickAccessAction(
        button.dataset.quickAccessAction,
        button.dataset.groupId,
        button.dataset.linkId,
      );
    });
  });
}

function getQuickAccessEditorMarkup() {
  const selectedEntries = getQuickAccessEntries();
  const savedLinks = getSavedLinks();
  const normalizedQuery = normalizeQuickAccessSearch(quickAccessSearchQuery);
  const filteredSavedLinks = normalizedQuery
    ? savedLinks.filter((entry) => normalizeQuickAccessSearch(entry.title).includes(normalizedQuery))
    : savedLinks;
  const selectedKeys = new Set(selectedEntries.map((entry) => `${entry.groupId}::${entry.id}`));
  const canAddMore = selectedEntries.length < 5;

  const selectedMarkup = selectedEntries.length
    ? selectedEntries
        .map(
          (entry, index) => `
            <div class="editor-item">
              <div class="editor-item__meta">
                <strong>${escapeHtml(entry.title)}</strong>
                <div>${escapeHtml(entry.groupTitle)} • ${escapeHtml(entry.url)}</div>
              </div>
              <div class="editor-item__actions">
                ${renderEditorActionButton({
                  icon: "arrow_upward_alt",
                  label: t("common.up"),
                  attrs: `data-quick-access-action="move-up" data-group-id="${escapeHtml(entry.groupId)}" data-link-id="${escapeHtml(entry.id)}"`,
                  disabled: index === 0,
                })}
                ${renderEditorActionButton({
                  icon: "arrow_downward_alt",
                  label: t("common.down"),
                  attrs: `data-quick-access-action="move-down" data-group-id="${escapeHtml(entry.groupId)}" data-link-id="${escapeHtml(entry.id)}"`,
                  disabled: index === selectedEntries.length - 1,
                })}
                ${renderEditorActionButton({
                  icon: "delete",
                  label: t("common.delete"),
                  attrs: `data-quick-access-action="remove" data-group-id="${escapeHtml(entry.groupId)}" data-link-id="${escapeHtml(entry.id)}"`,
                  tone: "danger",
                })}
              </div>
            </div>
          `,
        )
        .join("")
    : `<div class="is-empty">${escapeHtml(t("quickAccess.noneSelected"))}</div>`;

  const availableMarkup = savedLinks.length
    ? filteredSavedLinks.length
      ? filteredSavedLinks
        .map((entry) => {
          const key = `${entry.groupId}::${entry.id}`;
          const isAdded = selectedKeys.has(key);
          const isDisabled = isAdded || !canAddMore;
          const label = isAdded ? t("quickAccess.selected") : canAddMore ? t("quickAccess.add") : t("quickAccess.full");
          const icon = isAdded ? "check" : canAddMore ? "add" : "block";
          return `
            <div class="quick-access-candidate">
              <div class="quick-access-candidate__main">
                ${iconMarkup(entry, "rgba(255, 255, 255, 0.16)")}
                <div class="quick-access-candidate__text">
                  <strong>${escapeHtml(entry.title)}</strong>
                </div>
              </div>
              <div class="quick-access-candidate__actions">
                <button
                  class="quick-access-candidate__action"
                  type="button"
                  aria-label="${escapeHtml(label)}"
                  title="${escapeHtml(label)}"
                  data-quick-access-action="add"
                  data-group-id="${escapeHtml(entry.groupId)}"
                  data-link-id="${escapeHtml(entry.id)}"
                  ${isDisabled ? "disabled" : ""}
                >
                  <span class="material-symbols-rounded" aria-hidden="true">${escapeHtml(icon)}</span>
                </button>
              </div>
            </div>
          `;
        })
        .join("")
      : `<div class="is-empty">${escapeHtml(t("quickAccess.noneSearchMatches"))}</div>`
    : `<div class="is-empty">${escapeHtml(t("quickAccess.noneSaved"))}</div>`;

  return `
    <section class="editor-section">
      <div class="editor-section__title-row">
        <div>
          <h3>${escapeHtml(t("quickAccess.current"))}</h3>
        </div>
      </div>
      <div class="editor-list">${selectedMarkup}</div>
    </section>
    <section class="editor-section">
      <div class="editor-section__title-row">
        <div>
          <h3>${escapeHtml(t("quickAccess.available"))}</h3>
        </div>
      </div>
      <div class="quick-access-search">
        <input
          type="search"
          id="quickAccessSearchInput"
          class="quick-access-search__input"
          data-quick-access-search
          value="${escapeHtml(quickAccessSearchQuery)}"
          placeholder="${escapeHtml(t("quickAccess.searchPlaceholder"))}"
          aria-label="${escapeHtml(t("quickAccess.searchAria"))}"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
        />
      </div>
      <div class="editor-list">${availableMarkup}</div>
    </section>
  `;
}

function renderQuickAccessEditor(options = {}) {
  if (!els.quickAccessEditorBody) return;
  els.quickAccessEditorBody.innerHTML = getQuickAccessEditorMarkup();
  hydrateFaviconIcons(els.quickAccessEditorBody);
  bindQuickAccessActions(els.quickAccessEditorBody);
  if (options.preserveSearchFocus) {
    const searchInput = els.quickAccessEditorBody.querySelector("[data-quick-access-search]");
    if (searchInput) {
      searchInput.focus({ preventScroll: true });
      const nextStart = Math.min(options.caretStart ?? quickAccessSearchQuery.length, searchInput.value.length);
      const nextEnd = Math.min(options.caretEnd ?? quickAccessSearchQuery.length, searchInput.value.length);
      searchInput.setSelectionRange(nextStart, nextEnd);
    }
  }
}

function renderQuickAccessModal() {
  if (!els.quickAccessModalBody) return;
  if (els.quickAccessModalTitle) {
    els.quickAccessModalTitle.textContent = t("quickAccess.modalTitle");
  }
  els.quickAccessModalBody.innerHTML = getQuickAccessEditorMarkup();
  hydrateFaviconIcons(els.quickAccessModalBody);
  bindQuickAccessActions(els.quickAccessModalBody);
}

function renderNote() {
  els.noteTitleDisplay.textContent = state.note.title;
  els.noteList.innerHTML = state.note.items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function renderProfileForm() {
  const form = els.profileForm;
  form.elements.noteTitle.value = state.note.title;
  form.elements.noteItems.value = state.note.items.join("\n");
}

function renderBackgroundControls() {
  if (!els.backgroundImageStatus) return;
  els.backgroundImageStatus.textContent =
    (backgroundStatusKey ? t(backgroundStatusKey) : backgroundStatusMessage) ||
    t(customBackgroundImage ? "status.backgroundSaved" : "status.backgroundDefault");
  els.backgroundImageStatus.classList.toggle("is-error", backgroundStatusTone === "error");
  if (els.clearBackgroundButton) {
    els.clearBackgroundButton.disabled = !customBackgroundImage;
  }
  if (els.backgroundPreview) {
    if (customBackgroundImage) {
      els.backgroundPreview.innerHTML = "";
      els.backgroundPreview.style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.24)), url("${customBackgroundImage}")`;
    } else {
      els.backgroundPreview.style.backgroundImage = "";
      els.backgroundPreview.innerHTML = `<span class="background-preview__empty">${escapeHtml(t("settings.noBackground"))}</span>`;
    }
  }
}

function renderGroupEditor() {
  const groups = getGroupManagerGroups();

  if (!groups.length) {
    els.groupEditorList.innerHTML = `<div class="is-empty">${escapeHtml(t("settings.groupsEmpty"))}</div>`;
    return;
  }

  els.groupEditorList.innerHTML = groups
    .map(
      (group, index) => `
        <div class="editor-item">
          <div class="editor-item__meta">
            <strong>${escapeHtml(getDisplayGroupTitle(group))}</strong>
            <div>${escapeHtml(t(group.links.length === 1 ? "home.siteCountOne" : "home.siteCount", { count: group.links.length }))}</div>
          </div>
          <div class="editor-item__actions">
            ${renderEditorActionButton({
              icon: "edit",
              label: t("common.edit"),
              attrs: `data-action="edit-group" data-group-id="${escapeHtml(group.id)}"`,
            })}
            ${renderEditorActionButton({
              icon: "arrow_upward_alt",
              label: t("common.up"),
              attrs: `data-action="move-group-up" data-group-id="${escapeHtml(group.id)}"`,
              disabled: index === 0,
            })}
            ${renderEditorActionButton({
              icon: "arrow_downward_alt",
              label: t("common.down"),
              attrs: `data-action="move-group-down" data-group-id="${escapeHtml(group.id)}"`,
              disabled: index === groups.length - 1,
            })}
            ${renderEditorActionButton({
              icon: "delete",
              label: t("common.delete"),
              attrs: `data-action="delete-group" data-group-id="${escapeHtml(group.id)}"`,
              tone: "danger",
            })}
          </div>
        </div>
      `,
    )
    .join("");
}

function renderLinkEditor() {
  const groups = getWebsiteManagerGroups();

  els.addWebsiteButton?.setAttribute("aria-label", t("settings.addWebsite"));
  els.addWebsiteButton?.setAttribute("title", t("settings.addWebsite"));

  els.linkEditorList.innerHTML = groups
    .map((group) => {
      const tone = getSoftGroupTone(group.accent);
      const toneStyle = getToneStyleVariables(tone);
      const countLabel = t(group.links.length === 1 ? "home.siteCountOne" : "home.siteCount", { count: group.links.length });
      return `
        <button
          class="editor-item link-editor-group-card"
          type="button"
          data-action="open-link-group"
          data-group-id="${escapeHtml(group.id)}"
        >
          <div class="link-editor-group-card__main">
            <span class="group-card__badge link-editor-group-card__badge" style="${escapeHtml(toneStyle)}">
              <span class="material-symbols-rounded group-card__symbol" aria-hidden="true">${escapeHtml(getGroupSymbol(group))}</span>
            </span>
            <div class="editor-item__meta">
              <strong>${escapeHtml(getDisplayGroupTitle(group))}</strong>
              <div>${escapeHtml(countLabel)}</div>
            </div>
          </div>
          <span class="material-symbols-rounded link-editor-group-card__icon" aria-hidden="true">chevron_right</span>
        </button>
      `;
    })
    .join("");
}

function renderLinkEditorGroupPage() {
  const group = getActiveLinkEditorGroup();
  const links = group?.links || [];

  if (els.linkGroupPageTitle) {
    els.linkGroupPageTitle.textContent = getDisplayGroupTitle(group);
  }
  if (els.linkGroupPageCount) {
    els.linkGroupPageCount.textContent = t(links.length === 1 ? "home.siteCountOne" : "home.siteCount", { count: links.length });
  }

  els.linkGroupEditorList.innerHTML = links.length
    ? links
        .map(
          (link) => `
            <div class="link-editor-row link-editor-row--card">
              <div class="link-editor-row__main">
                ${iconMarkup(link)}
                <div class="link-editor-row__text">
                  <strong>${escapeHtml(link.title)}</strong>
                </div>
              </div>
              <div class="link-editor-row__actions">
                ${renderEditorActionButton({
                  icon: "edit",
                  label: t("common.edit"),
                  attrs: `data-action="edit-link" data-group-id="${escapeHtml(group.id)}" data-link-id="${escapeHtml(link.id)}"`,
                })}
                ${renderEditorActionButton({
                  icon: "delete",
                  label: t("common.delete"),
                  attrs: `data-action="delete-link" data-group-id="${escapeHtml(group.id)}" data-link-id="${escapeHtml(link.id)}"`,
                  tone: "danger",
                })}
              </div>
            </div>
          `,
        )
        .join("")
    : `<div class="is-empty">${escapeHtml(t("settings.linksEmpty"))}</div>`;

  hydrateFaviconIcons(els.linkGroupEditorList);
}

function renderLinkGroupOptions(selectedGroupId = "") {
  els.linkModalForm.elements.groupId.innerHTML = state.groups
    .map(
      (group) =>
        `<option value="${escapeHtml(group.id)}" ${group.id === selectedGroupId ? "selected" : ""}>${escapeHtml(getDisplayGroupTitle(group))}</option>`,
    )
    .join("");
}

function renderLanguageControls() {
  if (els.languageSelect) {
    els.languageSelect.value = activeLanguage;
  }
}

function render() {
  applyStaticTranslations();
  renderClock();
  renderHero();
  renderGroups();
  renderWeather();
  renderRecentVisits();
  renderQuickAccess();
  renderQuickAccessEditor();
  renderNote();
  renderProfileForm();
  renderBackgroundControls();
  renderLanguageControls();
  renderGroupEditor();
  renderLinkEditor();
  renderLinkEditorGroupPage();
  renderGroupAddChoiceModal();
  renderUncategorizedImportModal();
  renderEditorDrawer();
}

function openDrawer() {
  drawerOpen = true;
  currentEditorPage = "home";
  activeLinkEditorGroupId = UNCATEGORIZED_GROUP_ID;
  resetConfirmOpen = false;
  render();
}

function closeDrawer() {
  drawerOpen = false;
  currentEditorPage = "home";
  activeLinkEditorGroupId = UNCATEGORIZED_GROUP_ID;
  resetConfirmOpen = false;
  quickAccessSearchQuery = "";
  render();
}

function openEditorPage(page, options = {}) {
  if (!EDITOR_PAGE_META[page]) return;
  if (page === "linksGroup") {
    activeLinkEditorGroupId = options.groupId || activeLinkEditorGroupId || UNCATEGORIZED_GROUP_ID;
  }
  currentEditorPage = page;
  resetConfirmOpen = false;
  render();
}

function renderEditorDrawer() {
  els.editorDrawer.classList.toggle("is-open", drawerOpen);
  els.editorDrawer.setAttribute("aria-hidden", String(!drawerOpen));
  const meta = EDITOR_PAGE_META[currentEditorPage] || EDITOR_PAGE_META.home;
  if (els.editorDrawerEyebrow) {
    els.editorDrawerEyebrow.textContent = t(meta.eyebrowKey);
  }
  if (els.editorDrawerTitle) {
    els.editorDrawerTitle.textContent = currentEditorPage === "linksGroup" ? getDisplayGroupTitle(getActiveLinkEditorGroup()) : t(meta.titleKey);
  }
  if (els.editorBackButton) {
    els.editorBackButton.hidden = currentEditorPage === "home";
  }
  document.querySelectorAll("[data-editor-page]").forEach((pageEl) => {
    const pageId = pageEl.getAttribute("data-editor-page");
    pageEl.hidden = pageId !== currentEditorPage;
  });
  if (els.resetConfirmPanel) {
    els.resetConfirmPanel.hidden = !resetConfirmOpen || currentEditorPage !== "danger";
  }
}

function openModal(modalId) {
  activeModalId = modalId;
  const modal = document.getElementById(modalId);
  if (!modal) return;
  document.querySelectorAll(".modal-shell.is-topmost").forEach((entry) => {
    entry.classList.remove("is-topmost");
  });
  modal.classList.add("is-open");
  modal.classList.add("is-topmost");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.classList.remove("is-topmost");
  modal.setAttribute("aria-hidden", "true");
  if (activeModalId === modalId) {
    activeModalId = "";
  }
  const stillOpen = [...document.querySelectorAll(".modal-shell.is-open")].at(-1);
  if (stillOpen) {
    stillOpen.classList.add("is-topmost");
    activeModalId = stillOpen.id;
  }
}

function resetGroupAddFlow() {
  groupAddTargetGroupId = "";
  uncategorizedImportSelection = new Set();
}

function openGroupAddChoiceModal(groupId) {
  groupAddTargetGroupId = groupId || activeGroupViewerId;
  uncategorizedImportSelection = new Set();
  renderGroupAddChoiceModal();
  openModal("groupAddChoiceModal");
}

function openUncategorizedImportModal() {
  uncategorizedImportSelection = new Set();
  renderUncategorizedImportModal();
  openModal("uncategorizedImportModal");
}

function importSelectedUncategorizedLinks() {
  const targetGroup = getGroupAddTargetGroup();
  if (!targetGroup || uncategorizedImportSelection.size === 0) return;

  let nextState = state;
  for (const linkId of uncategorizedImportSelection) {
    const uncategorizedGroup = nextState.groups.find((group) => group.id === UNCATEGORIZED_GROUP_ID);
    const fullLink = uncategorizedGroup?.links.find((entry) => entry.id === linkId);
    if (!fullLink) continue;
    nextState = upsertLink(nextState, {
      ...fullLink,
      groupId: targetGroup.id,
    });
  }

  resetGroupAddFlow();
  closeModal("uncategorizedImportModal");
  closeModal("groupAddChoiceModal");
  persist(nextState);
}

async function readFileAsDataUrl(file) {
  if (!file) return "";
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image load failed"));
    image.src = source;
  });
}

async function prepareBackgroundImage(file) {
  const source = await readFileAsDataUrl(file);
  const image = await loadImage(source);
  const maxDimension = 2200;
  const scale = Math.min(1, maxDimension / Math.max(image.naturalWidth || 1, image.naturalHeight || 1));
  const width = Math.max(1, Math.round((image.naturalWidth || 1) * scale));
  const height = Math.max(1, Math.round((image.naturalHeight || 1) * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) return source;
  context.drawImage(image, 0, 0, width, height);
  return canvas.toDataURL("image/jpeg", 0.86);
}

function openGroupModal(group) {
  els.groupModalTitle.textContent = t(group ? "modal.editGroup" : "modal.addGroup");
  els.groupModalForm.reset();
  els.groupModalForm.elements.id.value = group?.id || "";
  els.groupModalForm.elements.title.value = group?.title || "";
  openModal("groupModal");
}

function openLinkModal(groupId, link, options = {}) {
  const mode = options.mode || (link ? "edit" : "group-add");
  linkModalGroupLocked = Boolean(options.lockGroup && !link) || mode === "settings-add";
  els.linkModalTitle.textContent = t(
    options.titleKey || (mode === "move" ? "modal.moveLink" : link ? "modal.editLink" : "modal.addLink"),
  );
  els.linkModalForm.reset();
  els.linkModalForm.elements.id.value = link?.id || "";
  renderLinkGroupOptions(groupId || link?.groupId || UNCATEGORIZED_GROUP_ID);
  els.linkModalForm.elements.title.value = link?.title || "";
  els.linkModalForm.elements.url.value = link?.url || "";
  if (els.linkGroupField) {
    els.linkGroupField.classList.toggle("is-disabled", linkModalGroupLocked);
  }
  els.linkModalForm.elements.groupId.disabled = linkModalGroupLocked;
  openModal("linkModal");
}

function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "self-direction-page.json";
  anchor.click();
  URL.revokeObjectURL(url);
}

function handleWeatherWidgetClick(event) {
  const button = event.target.closest("[data-weather-action]");
  if (!button) return;
  const action = button.getAttribute("data-weather-action");
  if (action === "refresh") {
    refreshWeather(state.weather.cityName);
  }
  if (action === "change-city") {
    weatherCityMenuOpen = !weatherCityMenuOpen;
    render();
  }
  if (action === "select-city") {
    const nextCity = button.getAttribute("data-city-name");
    if (!nextCity) return;
    weatherCityMenuOpen = false;
    refreshWeather(nextCity);
  }
}

function handleGroupEditorAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const groupId = button.dataset.groupId;
  const group = state.groups.find((entry) => entry.id === groupId);
  if (!group) return;

  if (action === "edit-group") openGroupModal(group);
  if (action === "move-group-up") persist(moveGroup(state, groupId, "up"));
  if (action === "move-group-down") persist(moveGroup(state, groupId, "down"));
  if (action === "delete-group" && window.confirm(t("confirm.deleteGroupMove", { title: getDisplayGroupTitle(group) }))) {
    persist(deleteGroup(state, groupId));
  }
}

function handleLinkEditorAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  if (action === "open-link-group") {
    openEditorPage("linksGroup", { groupId: button.dataset.groupId });
    return;
  }
  if (action === "add-link-primary") {
    openLinkModal(UNCATEGORIZED_GROUP_ID, null, { mode: "settings-add", lockGroup: true });
    return;
  }
  const groupId = button.dataset.groupId;
  const linkId = button.dataset.linkId;
  const group = state.groups.find((entry) => entry.id === groupId);
  const link = group?.links.find((entry) => entry.id === linkId);
  if (!group || !link) return;

  if (action === "edit-link") openLinkModal(groupId, { ...link, groupId }, { mode: "edit" });
  if (action === "move-link") openLinkModal(groupId, { ...link, groupId }, { mode: "move", titleKey: "modal.moveLink" });
  if (action === "delete-link" && window.confirm(t("confirm.deleteLink", { title: link.title }))) {
    persist(deleteLink(state, groupId, linkId));
  }
}

function handleQuickAccessAction(event) {
  const button = event.target.closest("button[data-quick-access-action]");
  if (!button) return;
  event.preventDefault();
  event.stopPropagation();
  runQuickAccessAction(
    button.dataset.quickAccessAction,
    button.dataset.groupId,
    button.dataset.linkId,
  );
}

function handleShortcutClick(event) {
  const addGroupLauncher = event.target.closest("[data-add-group]");
  if (addGroupLauncher) {
    openGroupModal();
    return;
  }

  const addButton = event.target.closest("[data-add-link-group]");
  if (addButton) {
    event.preventDefault();
    const groupId = addButton.getAttribute("data-add-link-group") || activeGroupViewerId;
    openGroupAddChoiceModal(groupId);
    return;
  }

  const launcher = event.target.closest("[data-group-launch]");
  if (launcher) {
    activeGroupViewerId = launcher.getAttribute("data-group-launch") || "";
    renderGroupViewer();
    openModal("groupLinksModal");
    return;
  }

  const anchor = event.target.closest("a[data-link-id]");
  if (!anchor) return;

  const groupId = anchor.dataset.groupId;
  const linkId = anchor.dataset.linkId;
  const group = state.groups.find((entry) => entry.id === groupId);
  const link = group?.links.find((entry) => entry.id === linkId);
  if (!link) return;

  persist(recordVisit(state, { title: link.title, url: link.url }));
}

els.searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = heroSearchQuery.trim();
  if (!query) return;
  if (currentSearchSuggestions.length && activeSearchSuggestionIndex >= 0) {
    executeSearchSuggestion(currentSearchSuggestions[activeSearchSuggestionIndex]);
    return;
  }
  if (isProbablyUrl(query)) {
    executeSearchSuggestion({
      type: "url",
      title: query,
      url: normalizeUrlCandidate(query),
    });
    return;
  }
  executeSearchSuggestion({
    type: "search",
    title: query,
  });
});

els.searchEngine.addEventListener("change", (event) => {
  persistSearchEngine(event.target.value);
});

els.searchInput?.addEventListener("focus", () => {
  searchSuggestionsOpen = heroSearchQuery.trim().length > 0;
  renderSearchSuggestions();
});

els.searchInput?.addEventListener("input", (event) => {
  heroSearchQuery = String(event.target.value || "");
  searchSuggestionsOpen = heroSearchQuery.trim().length > 0;
  activeSearchSuggestionIndex = -1;
  renderSearchSuggestions();
});

els.searchInput?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    searchSuggestionsOpen = false;
    activeSearchSuggestionIndex = -1;
    renderSearchSuggestions();
    return;
  }
  if (!["ArrowDown", "ArrowUp"].includes(event.key)) return;
  if (!currentSearchSuggestions.length) return;
  event.preventDefault();
  searchSuggestionsOpen = true;
  if (event.key === "ArrowDown") {
    activeSearchSuggestionIndex = Math.min(activeSearchSuggestionIndex + 1, currentSearchSuggestions.length - 1);
  } else {
    activeSearchSuggestionIndex = Math.max(activeSearchSuggestionIndex - 1, 0);
  }
  renderSearchSuggestions();
});

els.searchSuggestions?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-search-suggestion]");
  if (!button) return;
  const index = Number(button.getAttribute("data-search-suggestion"));
  const suggestion = currentSearchSuggestions[index];
  if (!suggestion) return;
  executeSearchSuggestion(suggestion);
});

els.languageSelect?.addEventListener("change", (event) => {
  persistLanguage(event.target.value);
});

els.groupGrid.addEventListener("click", handleShortcutClick);
els.groupLinksModalBody.addEventListener("click", handleShortcutClick);
els.homeAddWebsiteButton?.addEventListener("click", () => {
  openLinkModal(UNCATEGORIZED_GROUP_ID, null, { mode: "settings-add", lockGroup: true });
});
els.homeAddGroupButton?.addEventListener("click", () => {
  openGroupModal();
});
els.addWebsiteButton?.addEventListener("click", () => {
  openLinkModal(UNCATEGORIZED_GROUP_ID, null, { mode: "settings-add", lockGroup: true });
});
els.groupAddChoiceBody?.addEventListener("click", (event) => {
  const button = event.target.closest("[data-group-add-choice]");
  if (!button) return;
  const action = button.getAttribute("data-group-add-choice");
  if (action === "new") {
    const targetGroupId = groupAddTargetGroupId || activeGroupViewerId;
    resetGroupAddFlow();
    closeModal("groupAddChoiceModal");
    openLinkModal(targetGroupId, null, { lockGroup: true, mode: "group-add" });
    return;
  }
  if (action === "import") {
    openUncategorizedImportModal();
  }
});
els.uncategorizedImportList?.addEventListener("change", (event) => {
  const input = event.target.closest("[data-import-link-id]");
  if (!input) return;
  if (input.checked) {
    uncategorizedImportSelection.add(input.value);
  } else {
    uncategorizedImportSelection.delete(input.value);
  }
  renderUncategorizedImportModal();
});
els.confirmUncategorizedImportButton?.addEventListener("click", importSelectedUncategorizedLinks);
els.quickAccessMenuButton?.addEventListener("click", openQuickAccessEditor);
els.quickAccessModalBody?.addEventListener("click", handleQuickAccessAction);
els.quickAccessEditorBody?.addEventListener("click", handleQuickAccessAction);
els.editToggle.addEventListener("click", openDrawer);
els.drawerBackdrop.addEventListener("click", closeDrawer);
els.closeDrawerButton.addEventListener("click", closeDrawer);
els.editorBackButton?.addEventListener("click", () => openEditorPage(currentEditorPage === "linksGroup" ? "links" : "home"));
els.editorDrawer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-editor-nav]");
  if (!button) return;
  const page = button.getAttribute("data-editor-nav");
  if (!page) return;
  openEditorPage(page);
});
els.exportButton.addEventListener("click", exportState);

els.resetButton.addEventListener("click", () => {
  resetConfirmOpen = !resetConfirmOpen;
  render();
});

els.cancelResetButton?.addEventListener("click", () => {
  resetConfirmOpen = false;
  render();
});

els.confirmResetButton?.addEventListener("click", () => {
  state = resetState(window.localStorage);
  resetConfirmOpen = false;
  render();
  refreshWeather(state.weather.cityName);
});

els.clearRecentButton.addEventListener("click", () => {
  persist({ ...state, recentVisits: [] });
});

els.weatherWidget.addEventListener("click", handleWeatherWidgetClick);

els.profileForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(els.profileForm);
  persist(
    updateProfile(state, {
      noteTitle: form.get("noteTitle"),
      noteItems: String(form.get("noteItems") || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    }),
  );
});

els.themeToggle?.addEventListener("click", () => {
  const nextTheme = getResolvedTheme() === "dark" ? "light" : "dark";
  persistThemePreference(nextTheme);
});

els.groupEditorList.addEventListener("click", handleGroupEditorAction);
els.linkEditorList.addEventListener("click", handleLinkEditorAction);
els.linkGroupEditorList?.addEventListener("click", handleLinkEditorAction);
els.backgroundImageInput?.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    setBackgroundStatus("status.backgroundProcessing");
    render();
    const dataUrl = await prepareBackgroundImage(file);
    persistCustomBackground(dataUrl);
  } catch {
    setBackgroundStatus("status.backgroundUnsupported", "error");
    render();
  }
  event.target.value = "";
});
els.clearBackgroundButton?.addEventListener("click", () => {
  persistCustomBackground("");
});

els.groupModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(els.groupModalForm);
  const existingGroup = state.groups.find((group) => group.id === form.get("id"));
  persist(
    upsertGroup(state, {
      id: form.get("id"),
      title: form.get("title"),
      description: existingGroup?.description || "",
      icon: existingGroup?.icon || "",
      accent: existingGroup?.accent || "#1f6d67",
    }),
  );
  closeModal("groupModal");
});

els.linkModalForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(els.linkModalForm);
  const selectedGroupId = els.linkModalForm.elements.groupId.value;
  const existingLinkLocation = form.get("id") ? findLinkLocation(String(form.get("id"))) : null;
  persist(
    upsertLink(state, {
      id: form.get("id"),
      groupId: selectedGroupId,
      title: form.get("title"),
      url: form.get("url"),
      description: existingLinkLocation?.link.description || "",
      icon: existingLinkLocation?.link.icon || "",
    }),
  );
  closeModal("linkModal");
});

els.importInput.addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    const parsed = JSON.parse(text);
    persist(parsed);
    refreshWeather(state.weather.cityName);
    event.target.value = "";
  } catch {
    window.alert(t("settings.importError"));
  }
});

document.querySelectorAll("[data-close-dialog]").forEach((button) => {
  button.addEventListener("click", () => {
    const dialogId = button.getAttribute("data-close-dialog");
    if (dialogId === "groupLinksModal") {
      activeGroupViewerId = "";
      renderGroupViewer();
    }
    if (dialogId === "groupAddChoiceModal") {
      resetGroupAddFlow();
    }
    if (dialogId === "uncategorizedImportModal") {
      uncategorizedImportSelection = new Set();
      renderUncategorizedImportModal();
    }
    closeModal(dialogId);
  });
});

document.addEventListener("click", (event) => {
  if (!els.searchForm?.contains(event.target)) {
    searchSuggestionsOpen = false;
    activeSearchSuggestionIndex = -1;
    renderSearchSuggestions();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && activeModalId) {
    if (activeModalId === "groupAddChoiceModal") {
      resetGroupAddFlow();
    }
    if (activeModalId === "uncategorizedImportModal") {
      uncategorizedImportSelection = new Set();
      renderUncategorizedImportModal();
    }
    closeModal(activeModalId);
  }
});

const systemThemeMedia = window.matchMedia("(prefers-color-scheme: dark)");
systemThemeMedia.addEventListener?.("change", () => {
  if (storedThemePreference === "system") {
    applyTheme("system");
  }
});

setInterval(renderClock, 60000);
applyTheme(storedThemePreference);
applyCustomBackground();
render();
refreshWeather(state.weather.cityName);

if (!window.localStorage.getItem(STORAGE_KEY)) {
  saveState(createDefaultState(), window.localStorage);
}
})();
