export interface Database {
  users: {
    user_id: string;
    username: string;
    fullname: string;
    email: string;
    image: string;
    bio: string;
    created_at: string;
  };
  posts: {
    post_id: string;
    user_id: string;
    title: string;
    description: string;
    image: string;
    created_at: string;
  };
}
