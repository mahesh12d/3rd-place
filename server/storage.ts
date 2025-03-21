import { 
  User, InsertUser, 
  Post, InsertPost,
  Comment, InsertComment,
  Like, InsertLike,
  SavedPost, InsertSavedPost,
  Story, InsertStory
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Post methods
  getPosts(): Promise<Post[]>;
  getPost(id: number): Promise<Post | undefined>;
  getPostsByUserId(userId: number): Promise<Post[]>;
  createPost(post: InsertPost): Promise<Post>;
  
  // Comment methods
  getCommentsByPostId(postId: number, limit?: number): Promise<Comment[]>;
  addComment(comment: InsertComment): Promise<Comment>;
  
  // Like methods
  likePost(postId: number, userId: number): Promise<void>;
  unlikePost(postId: number, userId: number): Promise<void>;
  
  // Save methods
  savePost(postId: number, userId: number): Promise<void>;
  unsavePost(postId: number, userId: number): Promise<void>;
  
  // Story methods
  getStories(): Promise<User[]>;
  createStory(story: InsertStory): Promise<Story>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private posts: Map<number, Post>;
  private comments: Map<number, Comment>;
  private likes: Map<number, Like>;
  private savedPosts: Map<number, SavedPost>;
  private stories: Map<number, Story>;
  
  private userId: number;
  private postId: number;
  private commentId: number;
  private likeId: number;
  private savedPostId: number;
  private storyId: number;

  constructor() {
    this.users = new Map();
    this.posts = new Map();
    this.comments = new Map();
    this.likes = new Map();
    this.savedPosts = new Map();
    this.stories = new Map();
    
    this.userId = 1;
    this.postId = 1;
    this.commentId = 1;
    this.likeId = 1;
    this.savedPostId = 1;
    this.storyId = 1;
    
    // Initialize with sample data
    this.initSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Post methods
  async getPosts(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async getPost(id: number): Promise<Post | undefined> {
    return this.posts.get(id);
  }
  
  async getPostsByUserId(userId: number): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  
  async createPost(insertPost: InsertPost): Promise<Post> {
    const id = this.postId++;
    const createdAt = new Date().toISOString();
    const post: Post = { ...insertPost, id, createdAt };
    this.posts.set(id, post);
    
    // Update user post count
    const user = await this.getUser(insertPost.userId);
    if (user) {
      user.postCount += 1;
      this.users.set(user.id, user);
    }
    
    return post;
  }
  
  // Comment methods
  async getCommentsByPostId(postId: number, limit?: number): Promise<Comment[]> {
    const comments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return limit ? comments.slice(0, limit) : comments;
  }
  
  async addComment(insertComment: InsertComment): Promise<Comment> {
    const id = this.commentId++;
    const createdAt = new Date().toISOString();
    const comment: Comment = { ...insertComment, id, createdAt };
    this.comments.set(id, comment);
    
    // Update post comment count
    const post = await this.getPost(insertComment.postId);
    if (post) {
      post.commentCount += 1;
      this.posts.set(post.id, post);
    }
    
    return comment;
  }
  
  // Like methods
  async likePost(postId: number, userId: number): Promise<void> {
    // Check if already liked
    const alreadyLiked = Array.from(this.likes.values())
      .some(like => like.postId === postId && like.userId === userId);
    
    if (alreadyLiked) {
      return;
    }
    
    const id = this.likeId++;
    const createdAt = new Date().toISOString();
    const like: Like = { id, postId, userId, createdAt };
    this.likes.set(id, like);
    
    // Update post like count
    const post = await this.getPost(postId);
    if (post) {
      post.likeCount += 1;
      this.posts.set(post.id, post);
    }
  }
  
  async unlikePost(postId: number, userId: number): Promise<void> {
    const like = Array.from(this.likes.values())
      .find(like => like.postId === postId && like.userId === userId);
    
    if (!like) {
      return;
    }
    
    this.likes.delete(like.id);
    
    // Update post like count
    const post = await this.getPost(postId);
    if (post && post.likeCount > 0) {
      post.likeCount -= 1;
      this.posts.set(post.id, post);
    }
  }
  
  // Save methods
  async savePost(postId: number, userId: number): Promise<void> {
    // Check if already saved
    const alreadySaved = Array.from(this.savedPosts.values())
      .some(saved => saved.postId === postId && saved.userId === userId);
    
    if (alreadySaved) {
      return;
    }
    
    const id = this.savedPostId++;
    const createdAt = new Date().toISOString();
    const savedPost: SavedPost = { id, postId, userId, createdAt };
    this.savedPosts.set(id, savedPost);
  }
  
  async unsavePost(postId: number, userId: number): Promise<void> {
    const savedPost = Array.from(this.savedPosts.values())
      .find(saved => saved.postId === postId && saved.userId === userId);
    
    if (!savedPost) {
      return;
    }
    
    this.savedPosts.delete(savedPost.id);
  }
  
  // Story methods
  async getStories(): Promise<User[]> {
    // Get all users who have stories
    return Array.from(this.users.values())
      .filter(user => user.hasStory);
  }
  
  async createStory(insertStory: InsertStory): Promise<Story> {
    const id = this.storyId++;
    const createdAt = new Date().toISOString();
    const story: Story = { ...insertStory, id, createdAt };
    this.stories.set(id, story);
    
    // Update user story status
    const user = await this.getUser(insertStory.userId);
    if (user) {
      user.hasStory = true;
      user.hasUnseenStory = true;
      this.users.set(user.id, user);
    }
    
    return story;
  }
  
  // Helper method to initialize sample data
  private initSampleData() {
    // Create users
    const users: InsertUser[] = [
      {
        username: "me",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150",
        hasStory: false,
        hasUnseenStory: false,
        followerCount: 583,
        followingCount: 291,
        postCount: 35,
        bio: "Just living life, one post at a time ✌️",
        displayName: "Your Name",
      },
      {
        username: "emma_s",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150",
        hasStory: true,
        hasUnseenStory: true,
        followerCount: 12567,
        followingCount: 423,
        postCount: 142,
        bio: "Travel enthusiast | Foodie | Photographer",
        displayName: "Emma Smith",
      },
      {
        username: "alex_d",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&h=150",
        hasStory: true,
        hasUnseenStory: true,
        followerCount: 8912,
        followingCount: 765,
        postCount: 98,
        bio: "Nature lover | Hiker | Adventure seeker",
        displayName: "Alex Davis",
      },
      {
        username: "michael",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150",
        hasStory: true,
        hasUnseenStory: true,
        followerCount: 5432,
        followingCount: 321,
        postCount: 67,
        bio: "Fitness junkie | Tech enthusiast",
        displayName: "Michael Johnson",
      },
      {
        username: "sofia_92",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=150&h=150",
        hasStory: true,
        hasUnseenStory: true,
        followerCount: 18765,
        followingCount: 532,
        postCount: 215,
        bio: "Coffee addict | Art lover | Dreamer",
        displayName: "Sofia Garcia",
      },
      {
        username: "david_m",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150",
        hasStory: true,
        hasUnseenStory: true,
        followerCount: 7651,
        followingCount: 432,
        postCount: 87,
        bio: "Photographer | Traveler | Music lover",
        displayName: "David Miller",
      },
      {
        username: "jessica",
        password: "password",
        profileImageUrl: "https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&w=150&h=150",
        hasStory: true,
        hasUnseenStory: true,
        followerCount: 10234,
        followingCount: 567,
        postCount: 123,
        bio: "Fashion | Beauty | Lifestyle",
        displayName: "Jessica Taylor",
      },
    ];
    
    users.forEach(user => {
      const id = this.userId++;
      this.users.set(id, { ...user, id });
    });
    
    // Create posts
    const posts: InsertPost[] = [
      {
        userId: 2, // emma_s
        imageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600",
        caption: "Summer vibes! 🌞 #beachday #summer",
        likeCount: 1245,
        commentCount: 42,
      },
      {
        userId: 3, // alex_d
        imageUrl: "https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&h=600",
        caption: "Morning hikes are the best way to start the day. #nature #mountains",
        likeCount: 2786,
        commentCount: 94,
      },
      {
        userId: 5, // sofia_92
        imageUrl: "https://images.unsplash.com/photo-1552331704-0eee7c4e5cd5?auto=format&fit=crop&w=600&h=600",
        caption: "Coffee and art, perfect combination ☕️ #coffeetime #artwork",
        likeCount: 3456,
        commentCount: 67,
      },
      {
        userId: 4, // michael
        imageUrl: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=600&h=600",
        caption: "City lights 🌆 #cityscape #nightlife",
        likeCount: 1876,
        commentCount: 53,
      },
      {
        userId: 6, // david_m
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&h=600",
        caption: "Perfect weekend getaway 🏕️ #camping #outdoors",
        likeCount: 2341,
        commentCount: 78,
      },
      {
        userId: 7, // jessica
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&h=600",
        caption: "Homemade breakfast is the best way to start the day 🍳 #foodie #breakfast",
        likeCount: 4567,
        commentCount: 102,
      },
    ];
    
    posts.forEach(post => {
      const id = this.postId++;
      const createdAt = new Date().toISOString();
      this.posts.set(id, { ...post, id, createdAt });
    });
    
    // Create comments
    const comments: InsertComment[] = [
      { postId: 1, userId: 3, text: "Looking great! 🔥" },
      { postId: 1, userId: 5, text: "I love this place! Where is it?" },
      { postId: 2, userId: 4, text: "Amazing view!" },
      { postId: 2, userId: 7, text: "I need to go there! Where is this?" },
      { postId: 3, userId: 6, text: "Love the aesthetic!" },
      { postId: 3, userId: 2, text: "That's my favorite cafe too!" },
    ];
    
    comments.forEach(comment => {
      const id = this.commentId++;
      const createdAt = new Date().toISOString();
      this.comments.set(id, { ...comment, id, createdAt });
    });
  }
}

export const storage = new MemStorage();
