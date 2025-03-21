import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCommentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix with /api
  
  // Get stories
  app.get("/api/stories", async (req: Request, res: Response) => {
    try {
      const stories = await storage.getStories();
      res.json(stories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stories" });
    }
  });

  // Get feed (posts with users)
  app.get("/api/feed", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      const userIds = [...new Set(posts.map(post => post.userId))];
      const users = await Promise.all(
        userIds.map(id => storage.getUser(id))
      );
      
      // Add isLiked and isSaved for frontend
      const postsWithLikes = posts.map(post => ({
        ...post,
        isLiked: false, // In a real app, check if current user liked
        isSaved: false, // In a real app, check if current user saved
      }));
      
      // Get a few comments for each post
      for (const post of postsWithLikes) {
        post.comments = await storage.getCommentsByPostId(post.id, 2);
      }
      
      res.json({
        posts: postsWithLikes,
        users: users.filter(Boolean), // Remove any undefined users
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feed" });
    }
  });

  // Get post by ID
  app.get("/api/posts/:id", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getPost(postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      const user = await storage.getUser(post.userId);
      const comments = await storage.getCommentsByPostId(postId);
      
      res.json({
        post: {
          ...post,
          isLiked: false, // In a real app, check if current user liked
          isSaved: false, // In a real app, check if current user saved
          comments,
        },
        user,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch post" });
    }
  });

  // Like post
  app.post("/api/posts/:id/like", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = 1; // In a real app, get from authenticated user
      
      await storage.likePost(postId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to like post" });
    }
  });

  // Unlike post
  app.delete("/api/posts/:id/like", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = 1; // In a real app, get from authenticated user
      
      await storage.unlikePost(postId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unlike post" });
    }
  });

  // Save post
  app.post("/api/posts/:id/save", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = 1; // In a real app, get from authenticated user
      
      await storage.savePost(postId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to save post" });
    }
  });

  // Unsave post
  app.delete("/api/posts/:id/save", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = 1; // In a real app, get from authenticated user
      
      await storage.unsavePost(postId, userId);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to unsave post" });
    }
  });

  // Add comment to post
  app.post("/api/posts/:id/comments", async (req: Request, res: Response) => {
    try {
      const postId = parseInt(req.params.id);
      const userId = 1; // In a real app, get from authenticated user
      
      const validatedData = insertCommentSchema.parse({
        postId,
        userId,
        text: req.body.text,
      });
      
      const comment = await storage.addComment(validatedData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid comment data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add comment" });
    }
  });

  // Get user profile
  app.get("/api/profile", async (req: Request, res: Response) => {
    try {
      const userId = 1; // In a real app, get from authenticated user
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const posts = await storage.getPostsByUserId(userId);
      
      res.json({
        ...user,
        posts,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Get explore/search page content
  app.get("/api/explore", async (req: Request, res: Response) => {
    try {
      const posts = await storage.getPosts();
      // In a real app, we'd filter or prioritize trending posts
      res.json(posts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch explore content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
