export type Post = {
  id: number;
  created_at: Date;
  updated_at: Date;
  photo_url: string;
  user_id: number;
  caption: string | null;
  altText: string;
};
