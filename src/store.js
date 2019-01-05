/* eslint no-param-reassign: 0 */

import Vue from 'vue';
import Vuex from 'vuex';
import idb from './helpers/idb';

Vue.use(Vuex);

function buildKeyMap(array, key = obj => obj.key, value = obj => obj) {
  return array.reduce((map, obj) => {
    map[key(obj)] = value(obj);
    return map;
  }, {});
}

function isValidURL(string) {
  const res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  if (res == null) { return false; }
  return true;
}

function stripQuery(u) {
  if (!u || isValidURL(u) === false) {
    return 'null';
  }
  const url = new URL(u);
  const stripped = `${url.origin}${url.pathname}`;
  return stripped;
}

export default new Vuex.Store({
  state: {
    status: 'initializing',
    error: null,
    links: [],
    urlMap: {},
    linkIdMap: {},
    allTags: {},
  },

  getters: {
    isUrlPresent: state => url => state.urlMap[stripQuery(url)] || false,
  },

  mutations: {
    changeStatus(state, newStatus) {
      state.status = newStatus;
    },
    markErrored(state, error) {
      state.status = 'errored';
      state.error = error;
    },
    setLinks(state, links) {
      state.links = links;
      state.linkIdMap = buildKeyMap(links, obj => obj.key);
      state.urlMap = buildKeyMap(links, obj => stripQuery(obj.url), obj => Boolean(obj));
      state.allTags = links.reduce((acc, link) => {
        link.tags.forEach((tag) => {
          acc[tag] = tag;
        });
        return acc;
      }, {});
    },
    addLink(state, link) {
      state.links.push(link);
      state.linkIdMap[link.key] = link;
      state.urlMap[stripQuery(link.url)] = link;
      link.tags.forEach((tag) => {
        state.allTags[tag] = tag;
      });
    },
    removeLink(state, linkId) {
      const item = state.linkIdMap[linkId];
      state.links = state.links.filter(_l => _l.key !== linkId);
      state.urlMap[stripQuery(item.url)] = false;
      delete state.linkIdMap[linkId];
    },
    updateLink(state, newLink) {
      let index = -1;
      for (let i = 0; i < state.links.length; i += 1) {
        const link = state.links[i];
        console.log('link', i, link);
        if (link.key === newLink.key) {
          index = i;
          break;
        }
      }

      if (index !== -1) {
        const oldLink = state.state.links[index];
        state.urlMap[stripQuery(oldLink.url)] = false;
        delete state.linkIdMap[oldLink.key];
        Vue.set(state.links, index, newLink);
        state.urlMap[stripQuery(newLink.url)] = true;
        state.linkIdMap[newLink.key] = newLink;
      }
    },
  },

  actions: {
    loadLinks({ commit }) {
      commit('changeStatus', 'loading');
      return Promise.all([
        idb.links.valuesj(),
        // idb.tags.valuesj(),
      ]).then(([links]) => {
        commit('setLinks', links);
        // commit('setTags', tags);
        commit('changeStatus', 'loaded');
      }).catch((ex) => {
        console.error(ex);
        commit('markErrored', ex.message);
      });
    },

    addLink({ commit }, link) {
      return idb.links.setj(link).then((stored) => {
        commit('addLink', stored);
      }).catch((ex) => {
        console.error(ex);
        commit('markErrored', ex.message);
      });
    },

    updateLink({ commit }, link) {
      return idb.links.updatej(link.key, link)
        .then((stored) => {
          commit('updateLink', stored);
        }).catch((ex) => {
          console.error(ex);
          commit('markErrored', ex.message);
        });
    },

    removeLink({ commit }, linkId) {
      return idb.links.del(linkId).then(() => {
        commit('removeLink', linkId);
      }).catch((ex) => {
        console.error(ex);
        commit('markErrored', ex.message);
      });
    },
  },
});
