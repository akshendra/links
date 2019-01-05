/* eslint no-underscore-dangle: 0 */

import {
  Store, set, get, keys, del,
} from 'idb-keyval';


function makeCustom(dbName, storeName) {
  const store = new Store(dbName, storeName);
  let count = 0;

  function setj(obj) {
    count += 1;
    const key = `${Date.now()}_${count}`;
    const stored = Object.assign({
      key,
    }, obj);
    return set(key, JSON.stringify(stored), store).then(() => stored);
  }

  async function values(__keys, parser = v => v) {
    let _keys = __keys;
    if (!_keys) {
      _keys = await keys(store);
    }
    return Promise.all(_keys.map(key => get(key, store).then(parser)));
  }

  return {
    get: key => get(key, store),
    set: (key, value) => set(key, value, store),
    del: key => del(key, store),
    keys: () => keys(store),
    setj,
    updatej: (key, value) => set(key, JSON.stringify(value), store),
    getj: key => get(key, store).then(val => JSON.parse(val)),
    values: _keys => values(_keys),
    valuesj: _keys => values(_keys, JSON.parse),
  };
}


export default {
  links: makeCustom('links-items', 'items'),
  tags: makeCustom('links-tags', 'tags'),
};
