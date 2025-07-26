export interface Database {
  users: {
    user_id: string;
    username: string;
    fullname: string;
    email: string;
    image: string;
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
  comments: {
    id: string;
    post_id: string;
    user_id: string;
    content: string;
    is_liked: boolean;
    created_at: string;
  };
}
