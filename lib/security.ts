import AsyncStorage from "@react-native-async-storage/async-storage";

const PIN_KEY = "witness_pin";
const LAST_UNLOCK_KEY = "last_unlock_at";

export async function getPin() {
  return AsyncStorage.getItem(PIN_KEY);
}

export async function setPin(pin: string) {
  await AsyncStorage.setItem(PIN_KEY, pin);
}

export async function verifyPin(input: string) {
  const saved = await getPin();
  return saved === input;
}

export async function setLastUnlock() {
  await AsyncStorage.setItem(LAST_UNLOCK_KEY, Date.now().toString());
}

export async function isLocked(timeoutMs: number) {
  const last = await AsyncStorage.getItem(LAST_UNLOCK_KEY);
  if (!last) return true;
  return Date.now() - Number(last) > timeoutMs;
}

export async function resetPin() {
  await AsyncStorage.multiRemove(["witness_pin", "last_unlock_at"]);
}
