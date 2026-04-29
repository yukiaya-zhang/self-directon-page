import test from "node:test";
import assert from "node:assert/strict";

import {
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
  saveState,
  STORAGE_KEY,
  UNCATEGORIZED_GROUP_ID,
  upsertGroup,
  upsertLink,
  updateProfile,
  updateWeather,
} from "../js/store.js";

function createStorage(initial = {}) {
  const state = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
    removeItem(key) {
      state.delete(key);
    },
  };
}

test("loadState falls back to defaults when storage is empty", () => {
  const storage = createStorage();
  const state = loadState(storage);
  const visibleGroups = state.groups.filter((group) => group.id !== UNCATEGORIZED_GROUP_ID);

  assert.equal(state.profile.name, "Alexandre");
  assert.equal(state.groups.length, 4);
  assert.equal(state.groups[0].id, UNCATEGORIZED_GROUP_ID);
  assert.deepEqual(visibleGroups.map((group) => group.title), ["日常", "学习", "二次元"]);
  assert.equal(state.weather.cityName, "成都");
});

test("saveState round-trips through storage", () => {
  const storage = createStorage();
  const initial = createDefaultState();
  initial.profile.name = "Navigator";

  saveState(initial, storage);
  const loaded = loadState(storage);

  assert.equal(JSON.parse(storage.getItem(STORAGE_KEY)).profile.name, "Navigator");
  assert.equal(loaded.profile.name, "Navigator");
});

test("upsertGroup can add and reorder groups", () => {
  let state = createDefaultState();
  state = upsertGroup(state, {
    title: "Admin",
    description: "Back-office tools",
    icon: "A",
    accent: "#222222",
  });

  assert.equal(state.groups.at(-1).title, "Admin");
  const addedId = state.groups.at(-1).id;
  state = moveGroup(state, addedId, "up");
  assert.equal(state.groups.at(-2).id, addedId);
});

test("upsertLink can add, move, and delete links within a group", () => {
  let state = createDefaultState();
  const groupId = state.groups.find((group) => group.id !== UNCATEGORIZED_GROUP_ID).id;
  state = upsertLink(state, {
    groupId,
    title: "GitHub",
    url: "https://github.com/",
    description: "",
    icon: "",
  });
  state = upsertLink(state, {
    groupId,
    title: "Linear",
    url: "https://linear.app/",
    description: "Issue tracking",
    icon: "L",
  });

  const addedLink = state.groups.find((group) => group.id === groupId).links.at(-1);
  assert.equal(addedLink.title, "Linear");

  state = moveLink(state, groupId, addedLink.id, "up");
  assert.equal(state.groups.find((group) => group.id === groupId).links[0].id, addedLink.id);

  state = deleteLink(state, groupId, addedLink.id);
  assert.equal(state.groups.find((group) => group.id === groupId).links.some((link) => link.id === addedLink.id), false);
});

test("upsertLink can reassign an existing website to another group", () => {
  let state = createDefaultState();
  const sourceGroupId = state.groups.find((group) => group.id === "group-daily").id;
  const targetGroupId = state.groups.find((group) => group.id === "group-learning").id;

  state = upsertLink(state, {
    groupId: sourceGroupId,
    title: "GitHub",
    url: "https://github.com/",
  });

  const existingLink = state.groups.find((group) => group.id === sourceGroupId).links[0];
  state = upsertLink(state, {
    id: existingLink.id,
    groupId: targetGroupId,
    title: "GitHub",
    url: "https://github.com/",
  });

  assert.equal(state.groups.find((group) => group.id === sourceGroupId).links.length, 0);
  assert.equal(state.groups.find((group) => group.id === targetGroupId).links[0].id, existingLink.id);
});

test("multiple uncategorized websites can be moved into a target group", () => {
  let state = createDefaultState();
  const uncategorizedGroupId = UNCATEGORIZED_GROUP_ID;
  const targetGroupId = state.groups.find((group) => group.id === "group-learning").id;

  state = upsertLink(state, { groupId: uncategorizedGroupId, title: "GitHub", url: "https://github.com/" });
  state = upsertLink(state, { groupId: uncategorizedGroupId, title: "MDN", url: "https://developer.mozilla.org/" });

  const uncategorizedLinks = state.groups.find((group) => group.id === uncategorizedGroupId).links;
  let nextState = state;
  for (const link of uncategorizedLinks) {
    nextState = upsertLink(nextState, { ...link, groupId: targetGroupId });
  }

  assert.equal(nextState.groups.find((group) => group.id === uncategorizedGroupId).links.length, 0);
  assert.equal(nextState.groups.find((group) => group.id === targetGroupId).links.length, 2);
});

test("moving a website to another group keeps quick access references intact", () => {
  let state = createDefaultState();
  const sourceGroupId = state.groups.find((group) => group.id === "group-daily").id;
  const targetGroupId = state.groups.find((group) => group.id === "group-learning").id;
  state = upsertLink(state, { groupId: sourceGroupId, title: "GitHub", url: "https://github.com/" });
  const linkId = state.groups.find((group) => group.id === sourceGroupId).links[0].id;

  state = addQuickAccess(state, { groupId: sourceGroupId, linkId });
  state = upsertLink(state, { id: linkId, groupId: targetGroupId, title: "GitHub", url: "https://github.com/" });

  assert.deepEqual(state.quickAccess[0], { groupId: targetGroupId, linkId });
});

test("recordVisit keeps recent items unique and capped", () => {
  let state = createDefaultState();
  const group = state.groups[0];

  group.links.forEach((link) => {
    state = recordVisit(state, { title: link.title, url: link.url });
  });
  state = recordVisit(state, { title: "GitHub", url: "https://github.com/" });
  state = recordVisit(state, { title: "Pixiv", url: "https://www.pixiv.net/" });
  state = recordVisit(state, { title: "FANBOX", url: "https://www.fanbox.cc/" });
  state = recordVisit(state, { title: "萌娘百科", url: "https://zh.moegirl.org.cn/" });
  state = recordVisit(state, { title: "Twitch", url: "https://www.twitch.tv/" });

  assert.equal(state.recentVisits.length, 5);
  assert.equal(state.recentVisits[0].title, "Twitch");
  assert.equal(state.recentVisits.filter((entry) => entry.url === "https://github.com/").length, 1);
});

test("quick access only accepts saved links and stays capped", () => {
  let state = createDefaultState();
  state = upsertLink(state, { groupId: state.groups[1].id, title: "bilibili", url: "https://www.bilibili.com/" });
  state = upsertLink(state, { groupId: state.groups[1].id, title: "YouTube", url: "https://www.youtube.com/" });
  state = upsertLink(state, { groupId: state.groups[1].id, title: "Twitch", url: "https://www.twitch.tv/" });
  state = upsertLink(state, { groupId: state.groups[2].id, title: "GitHub", url: "https://github.com/" });
  state = upsertLink(state, { groupId: state.groups[3].id, title: "Pixiv", url: "https://www.pixiv.net/" });
  const savedLinks = state.groups.flatMap((group) =>
    group.links.map((link) => ({ groupId: group.id, linkId: link.id })),
  );

  state = addQuickAccess(state, savedLinks[0]);
  state = addQuickAccess(state, savedLinks[1]);
  state = addQuickAccess(state, savedLinks[2]);
  state = addQuickAccess(state, savedLinks[3]);
  state = addQuickAccess(state, savedLinks[4]);
  state = addQuickAccess(state, savedLinks[0]);
  state = addQuickAccess(state, { groupId: "missing-group", linkId: "missing-link" });

  assert.equal(state.quickAccess.length, 5);
  assert.deepEqual(state.quickAccess[0], savedLinks[0]);
  assert.equal(
    state.quickAccess.filter((entry) => entry.linkId === savedLinks[0].linkId).length,
    1,
  );
});

test("quick access can move, remove, and auto-cleans when source link is deleted", () => {
  let state = createDefaultState();
  state = upsertLink(state, { groupId: state.groups[1].id, title: "bilibili", url: "https://www.bilibili.com/" });
  state = upsertLink(state, { groupId: state.groups[1].id, title: "YouTube", url: "https://www.youtube.com/" });
  const groupId = state.groups[1].id;
  const firstLinkId = state.groups[1].links[0].id;
  const secondLinkId = state.groups[1].links[1].id;

  state = addQuickAccess(state, { groupId, linkId: firstLinkId });
  state = addQuickAccess(state, { groupId, linkId: secondLinkId });
  state = moveQuickAccess(state, secondLinkId, "up");
  assert.equal(state.quickAccess[0].linkId, secondLinkId);

  state = removeQuickAccess(state, { groupId, linkId: secondLinkId });
  assert.equal(state.quickAccess.some((entry) => entry.linkId === secondLinkId), false);

  state = addQuickAccess(state, { groupId, linkId: firstLinkId });
  state = deleteLink(state, groupId, firstLinkId);
  assert.equal(state.quickAccess.some((entry) => entry.linkId === firstLinkId), false);
});

test("updateProfile, updateWeather, and deleteGroup change the expected sections", () => {
  let state = createDefaultState();
  const groupId = state.groups.find((group) => group.id === "group-daily").id;

  state = updateProfile(state, {
    name: "Orbit",
    tagline: "Custom line",
    noteTitle: "Agenda",
    noteItems: ["Write", "Review"],
  });
  state = updateWeather(state, {
    cityName: "成都",
    latitude: 30.67,
    longitude: 104.06,
    status: "success",
    current: {
      temperature: "26°C",
      summary: "多云",
      updatedAt: "2026-04-26 19:30",
    },
  });
  state = deleteGroup(state, groupId);

  assert.equal(state.profile.name, "Orbit");
  assert.equal(state.weather.cityName, "成都");
  assert.equal(state.weather.current.summary, "多云");
  assert.equal(state.note.items.length, 2);
  assert.equal(state.groups.some((group) => group.id === groupId), false);
  assert.equal(state.groups.find((group) => group.id === UNCATEGORIZED_GROUP_ID).links.length, 0);
});

test("deleteGroup moves existing websites into Uncategorized", () => {
  let state = createDefaultState();
  const groupId = state.groups.find((group) => group.id === "group-learning").id;
  state = upsertLink(state, {
    groupId,
    title: "GitHub",
    url: "https://github.com/",
  });

  state = deleteGroup(state, groupId);

  const uncategorizedGroup = state.groups.find((group) => group.id === UNCATEGORIZED_GROUP_ID);
  assert.equal(state.groups.some((group) => group.id === groupId), false);
  assert.equal(uncategorizedGroup.links.some((link) => link.title === "GitHub"), true);
});

test("deleteGroup remaps quick access websites into Uncategorized", () => {
  let state = createDefaultState();
  const groupId = state.groups.find((group) => group.id === "group-learning").id;
  state = upsertLink(state, { groupId, title: "GitHub", url: "https://github.com/" });
  const linkId = state.groups.find((group) => group.id === groupId).links[0].id;

  state = addQuickAccess(state, { groupId, linkId });
  state = deleteGroup(state, groupId);

  assert.deepEqual(state.quickAccess[0], { groupId: UNCATEGORIZED_GROUP_ID, linkId });
});
