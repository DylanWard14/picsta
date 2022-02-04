export type User = {
  id: number;
  created_at: Date;
  updated_at: Date;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  email: string;
};
