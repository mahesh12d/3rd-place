export interface User {
  id: number;
  username: string;
  profileImageUrl: string;
  hasStory: boolean;
  hasUnseenStory: boolean;
}

export interface Story {
  id: number;
  userId: number;
  imageUrl: string;
  createdAt: string;
}

export interface Post {
  id: number;
  userId: number;
  imageUrl: string;
  caption: string;
  likeCount: number;
  commentCount: number;
  comments: Comment[];
  createdAt: string;
  isLiked: boolean;
  isSaved: boolean;
}

export interface Comment {
  id: number;
  userId: number;
  postId: number;
  text: string;
  createdAt: string;
}
