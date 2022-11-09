import { Comment, CommentLike, Post, PostLike, User } from "@prisma/client";

export interface ArticleLive extends Post {
  comments: {
    author: User;
  }[];
  authors: User[];
}

export interface ArticleHome extends Post {
  authors: {
    name: string;
  }[];
  _count: {
    comments: number;
  };
}

export interface ArticleWithLike extends Post {
  liked: PostLike;
  imported?: boolean;
  disabled?: boolean;
  _count: {
    comments: number;
    likes: number;
  };
  authors: User[];
  comments: {
    author: User;
  }[];
}

export interface ArticleLike extends Post {
  comments: {
    author: User;
  }[];
  authors: User[];
}

export interface CommentWithLike extends Comment {
  liked: CommentLike;
  author: User;

  _count: {
    likes: number;
  };
}

export interface CommentWithChildren extends CommentWithLike {
  children?: CommentWithLike[];
}
