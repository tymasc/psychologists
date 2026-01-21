export interface User {
  name: string;
  avatarUrl: string;
}

export interface HeaderProps {
  user: User | null;
  logout: () => void;
}
