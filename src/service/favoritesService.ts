import { ref, set, remove, get } from "firebase/database";
import { db } from "./firebase";

export const addFavorite = async (uid: string, psychId: string) => {
  await set(ref(db, `users/${uid}/favorites/${psychId}`), true);
};

export const removeFavorite = async (uid: string, psychId: string) => {
  await remove(ref(db, `users/${uid}/favorites/${psychId}`));
};

export const getFavoritesMap = async (
  uid: string,
): Promise<Record<string, true>> => {
  const snap = await get(ref(db, `users/${uid}/favorites`));
  return snap.exists() ? snap.val() : {};
};
