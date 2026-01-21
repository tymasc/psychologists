import { createContext } from "react";
import { AuthState } from "../types/auth";

export const AuthContext = createContext<AuthState>({
  user: null,
  loading: true,
});
