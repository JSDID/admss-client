import { LS_APP_USER } from "./../common/constants/localStorage";
export const setKey = (key: string, value: string) => {
    localStorage.setItem(key, value);
};

type LocalStorageKeys = typeof LS_APP_USER;

export const localStorageClear = (key?: LocalStorageKeys) => {
    if (!key) {
        return localStorage.clear();
    }
    localStorage.removeItem(key);
};

export const getKeyValue = (key: string) => {
    const valueByKey = localStorage.getItem(key);
    if (valueByKey) {
        return JSON.parse(valueByKey);
    }
    return null;
};
