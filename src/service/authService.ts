import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from "firebase/auth";
import { ref, set, update } from "firebase/database";
import { auth, db } from "./firebase";

export const registerUser = async (params: {
  name: string;
  email: string;
  password: string;
}): Promise<User> => {
  const { name, email, password } = params;

  const cred = await createUserWithEmailAndPassword(auth, email, password);

  await updateProfile(cred.user, { displayName: name });

  await set(ref(db, `users/${cred.user.uid}`), {
    name,
    email,
    createdAt: Date.now(),
    favorites: {},
  });

  return cred.user;
};

export const loginUser = async (params: {
  email: string;
  password: string;
}): Promise<User> => {
  const { email, password } = params;
  const cred = await signInWithEmailAndPassword(auth, email, password);

  await update(ref(db, `users/${cred.user.uid}`), {
    email: cred.user.email,
    lastLoginAt: Date.now(),
  });

  return cred.user;
};

export const logoutUser = async () => {
  await signOut(auth);
};
