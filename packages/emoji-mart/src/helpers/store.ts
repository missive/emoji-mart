function getIDB() {
    try {
        if (typeof indexedDB !== 'undefined') {
            return indexedDB;
        }
        if (typeof webkitIndexedDB !== 'undefined') {
            return webkitIndexedDB;
        }
        if (typeof mozIndexedDB !== 'undefined') {
            return mozIndexedDB;
        }
        if (typeof OIndexedDB !== 'undefined') {
            return OIndexedDB;
        }
        if (typeof msIndexedDB !== 'undefined') {
            return msIndexedDB;
        }
      return;
    } catch (e) {
        return;
    }
  
}

var idb = getIDB();

function getStore(callback, error) {
  const db = idb.open("emoji-mart-db");
  db.onupgradeneeded = function () {
    db.result.createObjectStore("emoji-store");
  };
  db.onsuccess = ({ target: { result } }) => {
    const store = result
      .transaction("emoji-store", "readwrite")
      .objectStore("emoji-store");
    callback(store);
  };
  db.onerror = error;
}
function runStoreCommand(command: string, args, success) {
  getStore((store) => {
    const request = store[command](...args);
    request.onsuccess = success;
    request.onerror = function () {
      throw "Error running emoji-mart command: " + command;
    };
  });
}
function set(key: string, value: string) {
  try {
    runStoreCommand("put", JSON.stringify(value, null, 4), `emoji-mart.${key}`);
  } catch (error) {}
}
function get(key: string): any {
  try {
    return runStoreCommand("get", `emoji-mart.${key}`, function ({ target: { result } }) {
      return JSON.parse(result);
    });
  } catch (error) {}
}

export default { set, get };
