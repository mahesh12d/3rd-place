import { User } from "@/lib/types";
import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";

export default function StoriesCarousel() {
  const { data: stories = [], isLoading } = useQuery({
    queryKey: ["/api/stories"],
  });

  if (isLoading) {
    return <StoriesLoading />;
  }

  return (
    <div className="stories-container px-2 py-4 overflow-x-auto flex space-x-4 border-b border-gray-200">
      <YourStory />
      {stories.map((user: User) => (
        <StoryItem key={user.id} user={user} />
      ))}
    </div>
  );
}

function YourStory() {
  return (
    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
      <div className="relative w-16 h-16 rounded-full border border-gray-200 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150" 
          alt="Your profile" 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
          <Plus className="h-3 w-3" />
        </div>
      </div>
      <span className="text-xs font-medium">Your Story</span>
    </div>
  );
}

function StoryItem({ user }: { user: User }) {
  return (
    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
      <div className="relative">
        <div className={`${user.hasUnseenStory ? "story-gradient" : "bg-gray-200"} rounded-full p-[2px]`}>
          <div className="bg-white rounded-full p-[2px]">
            <img 
              src={user.profileImageUrl} 
              alt={`${user.username}'s story`} 
              className="w-16 h-16 rounded-full object-cover"
            />
          </div>
        </div>
      </div>
      <span className="text-xs">{user.username}</span>
    </div>
  );
}

function StoriesLoading() {
  return (
    <div className="stories-container px-2 py-4 overflow-x-auto flex space-x-4 border-b border-gray-200">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="flex flex-col items-center space-y-1 flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gray-200 animate-pulse"></div>
          <div className="w-12 h-3 bg-gray-200 rounded animate-pulse"></div>
        </div>
      ))}
    </div>
  );
}
