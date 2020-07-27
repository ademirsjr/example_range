export const saveSessionStorage = (item, value) =>
  window.sessionStorage.setItem(item, JSON.stringify(value));

export const getSessionStorage = item => {
  const storage =
    window.sessionStorage && JSON.parse(window.sessionStorage.getItem(item));
  const itemStorage = storage || [];

  return itemStorage;
};
