export function setItem(key, data) {
  localStorage.setItem(key, data);
}

export function getItem(key) {
  return localStorage.getItem(key);
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export function clear() {
  localStorage.clear();
}