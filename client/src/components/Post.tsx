import { Post as PostType, User } from "@/lib/types";
import { useState, useRef } from "react";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";

interface PostProps {
  post: PostType;
  user: User;
}

export default function Post({ post, user }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [isSaved, setIsSaved] = useState(post.isSaved);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [comment, setComment] = useState("");
  const heartRef = useRef<HTMLDivElement>(null);
  const lastTapTime = useRef<number>(0);

  const likeMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(
        isLiked ? "DELETE" : "POST", 
        `/api/posts/${post.id}/like`, 
        {}
      );
    },
    onSuccess: () => {
      setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
      setIsLiked(!isLiked);
    }
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(
        isSaved ? "DELETE" : "POST", 
        `/api/posts/${post.id}/save`, 
        {}
      );
    },
    onSuccess: () => {
      setIsSaved(!isSaved);
    }
  });

  const commentMutation = useMutation({
    mutationFn: async () => {
      return apiRequest(
        "POST", 
        `/api/posts/${post.id}/comments`, 
        { text: comment }
      );
    },
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: [`/api/posts/${post.id}`] });
    }
  });

  const handleDoubleTap = () => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime.current;
    
    if (tapLength < 300 && tapLength > 0) {
      // Double tap detected
      if (!isLiked) {
        likeMutation.mutate();
        
        // Show heart animation
        if (heartRef.current) {
          heartRef.current.classList.add('active');
          setTimeout(() => {
            if (heartRef.current) {
              heartRef.current.classList.remove('active');
            }
          }, 1000);
        }
      }
    }
    
    lastTapTime.current = currentTime;
  };

  const handleLikeClick = () => {
    likeMutation.mutate();
  };

  const handleSaveClick = () => {
    saveMutation.mutate();
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      commentMutation.mutate();
    }
  };

  const formattedDate = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  return (
    <article className="post border-b border-gray-200 pb-4 mb-4">
      {/* Post header */}
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center space-x-2">
          <div className={`${user.hasStory ? "story-gradient" : "bg-gray-200"} rounded-full p-[2px]`}>
            <div className="bg-white rounded-full p-[1px]">
              <img 
                src={user.profileImageUrl} 
                alt={`${user.username}`} 
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          </div>
          <div>
            <span className="font-semibold text-sm">{user.username}</span>
            <span className="text-xs text-gray-500"> • {formattedDate}</span>
          </div>
        </div>
        <button className="text-lg">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Post image */}
      <div className="relative" onClick={handleDoubleTap}>
        <img 
          src={post.imageUrl} 
          alt="Post" 
          className="w-full object-cover" 
          style={{ aspectRatio: "1 / 1" }}
        />
        <div 
          ref={heartRef}
          className="heart-animation absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-0 text-white text-9xl opacity-0 transition-all duration-300 pointer-events-none"
        >
          <Heart className="h-24 w-24 fill-white" />
        </div>
      </div>

      {/* Post actions */}
      <div className="p-3">
        <div className="flex justify-between mb-2">
          <div className="flex space-x-4">
            <button onClick={handleLikeClick}>
              {isLiked ? (
                <Heart className="h-6 w-6 fill-red-500 text-red-500" />
              ) : (
                <Heart className="h-6 w-6" />
              )}
            </button>
            <button>
              <MessageCircle className="h-6 w-6" />
            </button>
            <button>
              <Send className="h-6 w-6" />
            </button>
          </div>
          <button onClick={handleSaveClick}>
            {isSaved ? (
              <Bookmark className="h-6 w-6 fill-black" />
            ) : (
              <Bookmark className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Likes */}
        <div className="font-semibold text-sm mb-1">
          {likeCount.toLocaleString()} likes
        </div>

        {/* Caption */}
        <div className="text-sm mb-1">
          <span className="font-semibold">{user.username}</span>
          <span> {post.caption}</span>
        </div>

        {/* Comments */}
        {post.commentCount > 0 && (
          <button className="text-gray-500 text-sm mb-1">
            View all {post.commentCount} comments
          </button>
        )}
        
        {post.comments.slice(0, 2).map(comment => {
          const commentUser = { id: 0, username: "", profileImageUrl: "" } as User;
          
          // In a real app, we would fetch the user data for each comment
          // Here I'm assuming we have the user data for simplicity
          return (
            <div key={comment.id} className="text-sm">
              <span className="font-semibold">{comment.userId === user.id ? user.username : "user"}</span>
              <span> {comment.text}</span>
            </div>
          );
        })}

        {/* Comment input */}
        <form onSubmit={handleSubmitComment} className="flex items-center mt-3">
          <div className="flex items-center flex-1">
            <img 
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40" 
              alt="Your profile" 
              className="w-7 h-7 rounded-full mr-2"
            />
            <input
              type="text"
              placeholder="Add a comment..."
              className="w-full bg-transparent text-sm focus:outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
          <button 
            type="submit"
            disabled={!comment.trim()}
            className={`text-blue-500 font-semibold text-sm ${!comment.trim() ? 'opacity-50' : ''}`}
          >
            Post
          </button>
        </form>
      </div>
    </article>
  );
}
