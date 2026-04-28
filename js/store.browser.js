(function () {
  const STORAGE_KEY = "self-direction-page-state-v2";
  const MAX_RECENT = 5;
  const MAX_QUICK_ACCESS = 5;

  function createDefaultState() {
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
        {
          id: "group-daily",
          title: "日常",
          description: "",
          icon: "",
          accent: "#1f6d67",
          links: [],
        },
        {
          id: "group-learning",
          title: "学习",
          description: "",
          icon: "",
          accent: "#6b7353",
          links: [],
        },
        {
          id: "group-acg",
          title: "二次元",
          description: "",
          icon: "",
          accent: "#c17747",
          links: [],
        },
      ],
    };
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function sanitizeText(value, fallback) {
    return typeof value === "string" && value.trim() ? value.trim() : fallback || "";
  }

  function makeId(prefix) {
    return `${prefix || "id"}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function normalizeLink(link) {
    return {
      id: sanitizeText(link && link.id, makeId("link")),
      title: sanitizeText(link && link.title, "Untitled link"),
      url: sanitizeText(link && link.url, "https://example.com"),
      description: sanitizeText(link && link.description, ""),
      icon: sanitizeText(link && link.icon, "•"),
    };
  }

  function normalizeGroup(group) {
    return {
      id: sanitizeText(group && group.id, makeId("group")),
      title: sanitizeText(group && group.title, "Untitled group"),
      description: sanitizeText(group && group.description, ""),
      icon: sanitizeText(group && group.icon, "•"),
      accent: sanitizeText(group && group.accent, "#1f6d67"),
      links: Array.isArray(group && group.links) ? group.links.map(normalizeLink) : [],
    };
  }

  function normalizeQuickAccessEntry(entry) {
    return {
      groupId: sanitizeText(entry && entry.groupId, ""),
      linkId: sanitizeText(entry && entry.linkId, ""),
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
        temperature: sanitizeText(input.current && input.current.temperature, ""),
        summary: sanitizeText(input.current && input.current.summary, ""),
        updatedAt: sanitizeText(input.current && input.current.updatedAt, ""),
      },
    };
  }

  function normalizeState(input) {
    const defaults = createDefaultState();
    const state = input && typeof input === "object" ? input : {};
    const groups =
      Array.isArray(state.groups) && state.groups.length
        ? state.groups.map(normalizeGroup)
        : defaults.groups.map(normalizeGroup);

    return {
      profile: {
        name: sanitizeText(state.profile && state.profile.name, defaults.profile.name),
        tagline: sanitizeText(state.profile && state.profile.tagline, defaults.profile.tagline),
        searchPlaceholder: sanitizeText(
          state.profile && state.profile.searchPlaceholder,
          defaults.profile.searchPlaceholder,
        ),
      },
      weather: normalizeWeather(state.weather, defaults.weather),
      note: {
        title: sanitizeText(state.note && state.note.title, defaults.note.title),
        items: Array.isArray(state.note && state.note.items) && state.note.items.length
          ? state.note.items.map((item) => sanitizeText(item, "")).filter(Boolean)
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
      quickAccess: normalizeQuickAccess(state.quickAccess, groups),
      groups,
    };
  }

  function loadState(storage) {
    try {
      const raw = storage && storage.getItem ? storage.getItem(STORAGE_KEY) : null;
      if (!raw) {
        return normalizeState(createDefaultState());
      }

      return normalizeState(JSON.parse(raw));
    } catch (error) {
      return normalizeState(createDefaultState());
    }
  }

  function saveState(state, storage) {
    const normalized = normalizeState(state);
    if (storage && storage.setItem) {
      storage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    }
    return normalized;
  }

  function resetState(storage) {
    if (storage && storage.removeItem) {
      storage.removeItem(STORAGE_KEY);
    }
    return normalizeState(createDefaultState());
  }

  function updateProfile(state, updates) {
    const next = clone(state);
    next.profile = {
      ...next.profile,
      name: sanitizeText(updates && updates.name, next.profile.name),
      tagline: sanitizeText(updates && updates.tagline, next.profile.tagline),
      searchPlaceholder: sanitizeText(
        updates && updates.searchPlaceholder,
        next.profile.searchPlaceholder,
      ),
    };
    next.note = {
      title: sanitizeText(updates && updates.noteTitle, next.note.title),
      items: Array.isArray(updates && updates.noteItems) && updates.noteItems.length
        ? updates.noteItems.map((item) => sanitizeText(item, "")).filter(Boolean)
        : next.note.items,
    };
    return normalizeState(next);
  }

  function addQuickAccess(state, payload) {
    const next = clone(state);
    const groupId = sanitizeText(payload && payload.groupId, "");
    const linkId = sanitizeText(payload && payload.linkId, "");
    if (!groupId || !linkId) return normalizeState(next);
    if (!hasSavedLink(next.groups, groupId, linkId)) return normalizeState(next);
    if ((next.quickAccess || []).some((entry) => entry.groupId === groupId && entry.linkId === linkId)) {
      return normalizeState(next);
    }

    next.quickAccess = [...(next.quickAccess || []), { groupId, linkId }];
    return normalizeState(next);
  }

  function removeQuickAccess(state, payload) {
    const next = clone(state);
    const groupId = sanitizeText(payload && payload.groupId, "");
    const linkId = sanitizeText(payload && payload.linkId, "");
    next.quickAccess = (next.quickAccess || []).filter(
      (entry) => !(entry.groupId === groupId && entry.linkId === linkId),
    );
    return normalizeState(next);
  }

  function moveQuickAccess(state, linkId, direction) {
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

  function updateWeather(state, updates) {
    const next = clone(state);
    next.weather = {
      ...next.weather,
      ...updates,
      current: {
        ...next.weather.current,
        ...((updates && updates.current) || {}),
      },
    };
    return normalizeState(next);
  }

  function upsertGroup(state, groupInput) {
    const next = clone(state);
    const normalized = normalizeGroup(groupInput);
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

  function deleteGroup(state, groupId) {
    const next = clone(state);
    next.groups = next.groups.filter((group) => group.id !== groupId);
    return normalizeState(next);
  }

  function moveGroup(state, groupId, direction) {
    const next = clone(state);
    const index = next.groups.findIndex((group) => group.id === groupId);
    if (index < 0) return normalizeState(next);

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= next.groups.length) return normalizeState(next);

    const current = next.groups[index];
    next.groups[index] = next.groups[targetIndex];
    next.groups[targetIndex] = current;
    return normalizeState(next);
  }

  function upsertLink(state, linkInput) {
    const next = clone(state);
    const group = next.groups.find((entry) => entry.id === linkInput.groupId);
    if (!group) return normalizeState(next);

    const normalized = normalizeLink(linkInput);
    const index = group.links.findIndex((link) => link.id === normalized.id);

    if (index >= 0) {
      group.links[index] = normalized;
    } else {
      group.links.push(normalized);
    }

    return normalizeState(next);
  }

  function deleteLink(state, groupId, linkId) {
    const next = clone(state);
    const group = next.groups.find((entry) => entry.id === groupId);
    if (!group) return normalizeState(next);

    group.links = group.links.filter((link) => link.id !== linkId);
    return normalizeState(next);
  }

  function moveLink(state, groupId, linkId, direction) {
    const next = clone(state);
    const group = next.groups.find((entry) => entry.id === groupId);
    if (!group) return normalizeState(next);

    const index = group.links.findIndex((link) => link.id === linkId);
    if (index < 0) return normalizeState(next);

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= group.links.length) return normalizeState(next);

    const current = group.links[index];
    group.links[index] = group.links[targetIndex];
    group.links[targetIndex] = current;
    return normalizeState(next);
  }

  function recordVisit(state, payload) {
    const next = clone(state);
    const title = sanitizeText(payload && payload.title, "Visited link");
    const url = sanitizeText(payload && payload.url, "https://example.com");
    next.recentVisits = [
      { title, url, visitedAt: Date.now() },
      ...next.recentVisits.filter((entry) => entry.url !== url),
    ].slice(0, MAX_RECENT);

    return normalizeState(next);
  }

  window.SelfDirectionStore = {
    STORAGE_KEY,
    createDefaultState,
    normalizeState,
    loadState,
    saveState,
    resetState,
    updateProfile,
    addQuickAccess,
    removeQuickAccess,
    moveQuickAccess,
    updateWeather,
    upsertGroup,
    deleteGroup,
    moveGroup,
    upsertLink,
    deleteLink,
    moveLink,
    recordVisit,
  };
})();
