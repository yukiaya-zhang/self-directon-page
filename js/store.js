export const STORAGE_KEY = "self-direction-page-state-v2";
export const UNCATEGORIZED_GROUP_ID = "group-uncategorized";
const MAX_RECENT = 5;
const MAX_QUICK_ACCESS = 5;

const GROUP_ICON_KEYWORDS = {
  "group-daily": "home",
  "group-learning": "school",
  "group-acg": "palette",
  "group-uncategorized": "folder",
  日常: "home",
  学习: "school",
  二次元: "palette",
  工作: "work",
  编程: "code",
  阅读: "menu_book",
  音乐: "music_note",
  影视: "movie",
  旅行: "travel_explore",
  购物: "shopping_bag",
  美食: "restaurant",
  健身: "fitness_center",
  语言: "language",
  科学: "science",
  收藏: "favorite",
  常用: "star",
  工具: "dashboard",
  设计: "brush",
  网络: "public",
  链接: "link",
  创作: "palette",
  游戏: "sports_esports",
};

function createUncategorizedGroup() {
  return {
    id: UNCATEGORIZED_GROUP_ID,
    title: "未分类",
    description: "",
    icon: "folder",
    accent: "#81858d",
    links: [],
  };
}

export function createDefaultState() {
  return {
    profile: {
      name: "Alexandre",
      tagline: "Focus on progress, not perfection. Build a day with fewer clicks and more momentum.",
      searchPlaceholder: "Search the web or jump into your day",
    },
    weather: {
      cityName: "成都",
      latitude: null,
      longitude: null,
      timezone: "Asia/Shanghai",
      status: "idle",
      error: "",
      current: {
        temperature: "",
        summary: "",
        updatedAt: "",
      },
    },
    note: {
      title: "Today's focus",
      items: [
        "Ship the highest leverage task first.",
        "Protect deep work before meetings.",
        "Leave the page better than you found it.",
      ],
    },
    recentVisits: [],
    quickAccess: [],
    groups: [
      createUncategorizedGroup(),
      {
        id: "group-daily",
        title: "日常",
        description: "",
        icon: "home",
        accent: "#1f6d67",
        links: [],
      },
      {
        id: "group-learning",
        title: "学习",
        description: "",
        icon: "school",
        accent: "#6b7353",
        links: [],
      },
      {
        id: "group-acg",
        title: "二次元",
        description: "",
        icon: "palette",
        accent: "#c17747",
        links: [],
      },
    ],
  };
}

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sanitizeText(value, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function inferGroupIcon(groupLike) {
  const explicitIcon = sanitizeText(groupLike?.icon, "");
  if (explicitIcon) return explicitIcon;

  const id = sanitizeText(groupLike?.id, "");
  const title = sanitizeText(groupLike?.title, "");
  const normalizedTitle = title.toLowerCase();

  if (GROUP_ICON_KEYWORDS[id]) return GROUP_ICON_KEYWORDS[id];
  if (GROUP_ICON_KEYWORDS[title]) return GROUP_ICON_KEYWORDS[title];
  if (normalizedTitle.includes("home")) return "home";
  if (normalizedTitle.includes("study") || normalizedTitle.includes("learn")) return "school";
  if (normalizedTitle.includes("code") || normalizedTitle.includes("dev")) return "code";
  if (normalizedTitle.includes("design") || normalizedTitle.includes("art")) return "brush";
  if (normalizedTitle.includes("work")) return "work";
  if (normalizedTitle.includes("tool")) return "dashboard";
  if (normalizedTitle.includes("game")) return "sports_esports";
  if (normalizedTitle.includes("music")) return "music_note";
  if (normalizedTitle.includes("movie") || normalizedTitle.includes("video")) return "movie";
  if (normalizedTitle.includes("travel")) return "travel_explore";
  if (normalizedTitle.includes("shop")) return "shopping_bag";
  if (normalizedTitle.includes("food")) return "restaurant";
  if (normalizedTitle.includes("fit")) return "fitness_center";
  if (normalizedTitle.includes("lang")) return "language";
  if (normalizedTitle.includes("science")) return "science";
  if (normalizedTitle.includes("mind")) return "psychology";
  if (normalizedTitle.includes("favorite")) return "favorite";
  if (normalizedTitle.includes("star")) return "star";
  if (normalizedTitle.includes("link")) return "link";
  if (normalizedTitle.includes("web")) return "public";
  return "folder";
}

function makeId(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeLink(link) {
  return {
    id: sanitizeText(link?.id, makeId("link")),
    title: sanitizeText(link?.title, "Untitled link"),
    url: sanitizeText(link?.url, "https://example.com"),
    description: sanitizeText(link?.description, ""),
    icon: sanitizeText(link?.icon, "•"),
  };
}

function normalizeGroup(group) {
  return {
    id: sanitizeText(group?.id, makeId("group")),
    title: sanitizeText(group?.title, "Untitled group"),
    description: sanitizeText(group?.description, ""),
    icon: inferGroupIcon(group),
    accent: sanitizeText(group?.accent, "#1f6d67"),
    links: Array.isArray(group?.links) ? group.links.map(normalizeLink) : [],
  };
}

function ensureUncategorizedGroup(groups) {
  const existing = Array.isArray(groups)
    ? groups.find((group) => group.id === UNCATEGORIZED_GROUP_ID)
    : null;
  const uncategorized = normalizeGroup(existing || createUncategorizedGroup());
  uncategorized.id = UNCATEGORIZED_GROUP_ID;
  uncategorized.title = "未分类";
  uncategorized.description = "";
  uncategorized.icon = "folder";
  uncategorized.accent = createUncategorizedGroup().accent;

  return [
    uncategorized,
    ...(Array.isArray(groups) ? groups.filter((group) => group.id !== UNCATEGORIZED_GROUP_ID) : []),
  ];
}

function normalizeQuickAccessEntry(entry) {
  return {
    groupId: sanitizeText(entry?.groupId),
    linkId: sanitizeText(entry?.linkId),
  };
}

function buildLinkLookup(groups) {
  return new Set(
    groups.flatMap((group) => group.links.map((link) => `${group.id}::${link.id}`)),
  );
}

function normalizeQuickAccess(entries, groups) {
  if (!Array.isArray(entries)) return [];
  const lookup = buildLinkLookup(groups);
  const seen = new Set();

  return entries
    .filter((entry) => entry && typeof entry === "object")
    .map(normalizeQuickAccessEntry)
    .filter((entry) => entry.groupId && entry.linkId)
    .filter((entry) => lookup.has(`${entry.groupId}::${entry.linkId}`))
    .filter((entry) => {
      const key = `${entry.groupId}::${entry.linkId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_QUICK_ACCESS);
}

function hasSavedLink(groups, groupId, linkId) {
  return groups.some(
    (group) => group.id === groupId && group.links.some((link) => link.id === linkId),
  );
}

function findGroup(groups, groupId) {
  return groups.find((group) => group.id === groupId);
}

function findLinkLocation(groups, linkId) {
  for (const group of groups) {
    const index = group.links.findIndex((link) => link.id === linkId);
    if (index >= 0) {
      return { group, index, link: group.links[index] };
    }
  }
  return null;
}

function remapQuickAccessGroup(entries, linkIds, nextGroupId) {
  const linkIdSet = new Set(linkIds);
  return (entries || []).map((entry) =>
    linkIdSet.has(entry.linkId) ? { ...entry, groupId: nextGroupId } : entry,
  );
}

function normalizeWeather(weather, defaults) {
  const input = weather && typeof weather === "object" ? weather : {};
  const allowedStatus = new Set(["idle", "loading", "success", "error"]);

  return {
    cityName: sanitizeText(input.cityName, defaults.cityName),
    latitude: Number.isFinite(input.latitude) ? input.latitude : defaults.latitude,
    longitude: Number.isFinite(input.longitude) ? input.longitude : defaults.longitude,
    timezone: sanitizeText(input.timezone, defaults.timezone),
    status: allowedStatus.has(input.status) ? input.status : defaults.status,
    error: sanitizeText(input.error, ""),
    current: {
      temperature: sanitizeText(input.current?.temperature, ""),
      summary: sanitizeText(input.current?.summary, ""),
      updatedAt: sanitizeText(input.current?.updatedAt, ""),
    },
  };
}

export function normalizeState(input) {
  const defaults = createDefaultState();
  const state = input && typeof input === "object" ? input : {};
  const groups =
    Array.isArray(state.groups) && state.groups.length
      ? state.groups.map(normalizeGroup)
      : defaults.groups.map(normalizeGroup);
  const groupsWithUncategorized = ensureUncategorizedGroup(groups);

  return {
    profile: {
      name: sanitizeText(state.profile?.name, defaults.profile.name),
      tagline: sanitizeText(state.profile?.tagline, defaults.profile.tagline),
      searchPlaceholder: sanitizeText(
        state.profile?.searchPlaceholder,
        defaults.profile.searchPlaceholder,
      ),
    },
    weather: normalizeWeather(state.weather, defaults.weather),
    note: {
      title: sanitizeText(state.note?.title, defaults.note.title),
      items: Array.isArray(state.note?.items) && state.note.items.length
        ? state.note.items.map((item) => sanitizeText(item)).filter(Boolean)
        : clone(defaults.note.items),
    },
    recentVisits: Array.isArray(state.recentVisits)
      ? state.recentVisits
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            title: sanitizeText(item.title, "Visited link"),
            url: sanitizeText(item.url, "https://example.com"),
            visitedAt: Number.isFinite(item.visitedAt) ? item.visitedAt : Date.now(),
          }))
          .slice(0, MAX_RECENT)
      : [],
    quickAccess: normalizeQuickAccess(state.quickAccess, groupsWithUncategorized),
    groups: groupsWithUncategorized,
  };
}

export function loadState(storage) {
  try {
    const raw = storage?.getItem?.(STORAGE_KEY);
    if (!raw) {
      return normalizeState(createDefaultState());
    }

    return normalizeState(JSON.parse(raw));
  } catch {
    return normalizeState(createDefaultState());
  }
}

export function saveState(state, storage) {
  const normalized = normalizeState(state);
  storage?.setItem?.(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
}

export function resetState(storage) {
  storage?.removeItem?.(STORAGE_KEY);
  return normalizeState(createDefaultState());
}

export function updateProfile(state, updates) {
  const next = clone(state);
  next.profile = {
    ...next.profile,
    name: sanitizeText(updates?.name, next.profile.name),
    tagline: sanitizeText(updates?.tagline, next.profile.tagline),
    searchPlaceholder: sanitizeText(updates?.searchPlaceholder, next.profile.searchPlaceholder),
  };
  next.note = {
    title: sanitizeText(updates?.noteTitle, next.note.title),
    items: Array.isArray(updates?.noteItems) && updates.noteItems.length
      ? updates.noteItems.map((item) => sanitizeText(item)).filter(Boolean)
      : next.note.items,
  };
  return normalizeState(next);
}

export function addQuickAccess(state, payload) {
  const next = clone(state);
  const groupId = sanitizeText(payload?.groupId);
  const linkId = sanitizeText(payload?.linkId);
  if (!groupId || !linkId) return normalizeState(next);
  if (!hasSavedLink(next.groups, groupId, linkId)) return normalizeState(next);
  if (next.quickAccess.some((entry) => entry.groupId === groupId && entry.linkId === linkId)) {
    return normalizeState(next);
  }

  next.quickAccess = [...(next.quickAccess || []), { groupId, linkId }];
  return normalizeState(next);
}

export function removeQuickAccess(state, payload) {
  const next = clone(state);
  const groupId = sanitizeText(payload?.groupId);
  const linkId = sanitizeText(payload?.linkId);
  next.quickAccess = (next.quickAccess || []).filter(
    (entry) => !(entry.groupId === groupId && entry.linkId === linkId),
  );
  return normalizeState(next);
}

export function moveQuickAccess(state, linkId, direction) {
  const next = clone(state);
  const index = (next.quickAccess || []).findIndex((entry) => entry.linkId === linkId);
  if (index < 0) return normalizeState(next);

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= next.quickAccess.length) return normalizeState(next);

  [next.quickAccess[index], next.quickAccess[targetIndex]] = [
    next.quickAccess[targetIndex],
    next.quickAccess[index],
  ];
  return normalizeState(next);
}

export function updateWeather(state, updates) {
  const next = clone(state);
  next.weather = {
    ...next.weather,
    ...updates,
    current: {
      ...next.weather.current,
      ...(updates?.current || {}),
    },
  };
  return normalizeState(next);
}

export function upsertGroup(state, groupInput) {
  const next = clone(state);
  const normalized = normalizeGroup(groupInput);
  if (normalized.id === UNCATEGORIZED_GROUP_ID) return normalizeState(next);
  const index = next.groups.findIndex((group) => group.id === normalized.id);

  if (index >= 0) {
    next.groups[index] = {
      ...next.groups[index],
      ...normalized,
      links: next.groups[index].links,
    };
  } else {
    next.groups.push(normalized);
  }

  return normalizeState(next);
}

export function deleteGroup(state, groupId) {
  const next = clone(state);
  if (groupId === UNCATEGORIZED_GROUP_ID) return normalizeState(next);
  const removedGroup = findGroup(next.groups, groupId);
  if (!removedGroup) return normalizeState(next);
  const movedLinkIds = removedGroup.links.map((link) => link.id);
  const uncategorizedGroup = findGroup(next.groups, UNCATEGORIZED_GROUP_ID);
  if (uncategorizedGroup) {
    uncategorizedGroup.links = [...uncategorizedGroup.links, ...removedGroup.links];
  }
  next.quickAccess = remapQuickAccessGroup(next.quickAccess, movedLinkIds, UNCATEGORIZED_GROUP_ID);
  next.groups = next.groups.filter((group) => group.id !== groupId);
  return normalizeState(next);
}

export function moveGroup(state, groupId, direction) {
  const next = clone(state);
  const index = next.groups.findIndex((group) => group.id === groupId);
  if (index < 0) return normalizeState(next);

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= next.groups.length) return normalizeState(next);

  [next.groups[index], next.groups[targetIndex]] = [next.groups[targetIndex], next.groups[index]];
  return normalizeState(next);
}

export function upsertLink(state, linkInput) {
  const next = clone(state);
  const normalized = normalizeLink(linkInput);
  const group = findGroup(next.groups, linkInput.groupId);
  if (!group) return normalizeState(next);
  const existingLocation = findLinkLocation(next.groups, normalized.id);
  const sourceGroupId = existingLocation?.group.id || "";
  if (existingLocation) {
    existingLocation.group.links.splice(existingLocation.index, 1);
  }
  const index = group.links.findIndex((link) => link.id === normalized.id);

  if (index >= 0) {
    group.links[index] = normalized;
  } else {
    group.links.push(normalized);
  }
  if (sourceGroupId && sourceGroupId !== group.id) {
    next.quickAccess = remapQuickAccessGroup(next.quickAccess, [normalized.id], group.id);
  }

  return normalizeState(next);
}

export function deleteLink(state, groupId, linkId) {
  const next = clone(state);
  const group = next.groups.find((entry) => entry.id === groupId);
  if (!group) return normalizeState(next);

  group.links = group.links.filter((link) => link.id !== linkId);
  return normalizeState(next);
}

export function moveLink(state, groupId, linkId, direction) {
  const next = clone(state);
  const group = next.groups.find((entry) => entry.id === groupId);
  if (!group) return normalizeState(next);

  const index = group.links.findIndex((link) => link.id === linkId);
  if (index < 0) return normalizeState(next);

  const targetIndex = direction === "up" ? index - 1 : index + 1;
  if (targetIndex < 0 || targetIndex >= group.links.length) return normalizeState(next);

  [group.links[index], group.links[targetIndex]] = [group.links[targetIndex], group.links[index]];
  return normalizeState(next);
}

export function recordVisit(state, payload) {
  const next = clone(state);
  const title = sanitizeText(payload?.title, "Visited link");
  const url = sanitizeText(payload?.url, "https://example.com");
  next.recentVisits = [
    { title, url, visitedAt: Date.now() },
    ...next.recentVisits.filter((entry) => entry.url !== url),
  ].slice(0, MAX_RECENT);

  return normalizeState(next);
}
