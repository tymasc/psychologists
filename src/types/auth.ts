import { User } from "firebase/auth";

export type Props = {
  onSuccess: () => void;
};

export type FormValuesRegister = {
  name: string;
  email: string;
  password: string;
};

export type FormValuesLogin = {
  email: string;
  password: string;
};

export type AuthState = {
  user: User | null;
  loading: boolean;
};