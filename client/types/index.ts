export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    imageUrl?: string;
  };
}

export interface Post {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    imageUrl?: string;
  };
  likes: number;
  commentsCount?: number;
}




export type User = {
  id: string
  username: string
  email: string
  image?: string
}