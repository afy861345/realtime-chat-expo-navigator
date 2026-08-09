import * as SecureStore from "expo-secure-store";

const KEYS = ["user", "token"]; // 👈 add all keys you use

async function set(key, object) {
  try {
    await SecureStore.setItemAsync(key, JSON.stringify(object));
  } catch (error) {
    console.log(error);
  }
}

async function get(key) {
  try {
    const data = await SecureStore.getItemAsync(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function remove(key) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log(error);
  }
}
// WARNING: SecureStore has no clear() method. You must manage keys manually.
async function wipe() {
  try {
    await Promise.all(KEYS.map((key) => SecureStore.deleteItemAsync(key)));
  } catch (error) {
    console.log(error);
  }
}

export default { set, get, remove, wipe };

