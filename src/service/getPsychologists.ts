import { getDatabase, ref, get } from "firebase/database";
import { app } from "./firebase";
import { Psychologist } from "../types/psychologist";

export const fetchPsychologists = async (): Promise<Psychologist[]> => {
  const db = getDatabase(app);
  const snapshot = await get(ref(db, "psychologists"));

  if (!snapshot.exists()) return [];

  const data = snapshot.val();

  return Object.entries(data).map(([id, value]) => ({
    id,
    ...(value as Omit<Psychologist, "id">),
  }));
};
