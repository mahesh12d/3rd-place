import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import StoriesCarousel from "@/components/StoriesCarousel";
import Post from "@/components/Post";
import { Post as PostType, User } from "@/lib/types";

export default function Home() {
  const { data: homeFeed, isLoading } = useQuery({
    queryKey: ["/api/feed"],
  });

  return (
    <div className="min-h-screen pb-14">
      <Header />
      <div className="pt-14">
        <StoriesCarousel />
        
        {isLoading ? (
          <FeedSkeleton />
        ) : (
          <div className="posts-container">
            {homeFeed?.posts?.map((post: PostType) => (
              <Post 
                key={post.id} 
                post={post} 
                user={homeFeed.users.find((u: User) => u.id === post.userId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FeedSkeleton() {
  return (
    <div className="posts-container animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div key={index} className="border-b border-gray-200 pb-4 mb-4">
          <div className="p-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-1">
                <div className="w-24 h-3 bg-gray-200 rounded"></div>
                <div className="w-12 h-2 bg-gray-200 rounded"></div>
              </div>
            </div>
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
          </div>
          
          <div className="w-full bg-gray-200" style={{ aspectRatio: "1 / 1" }}></div>
          
          <div className="p-3">
            <div className="flex justify-between my-2">
              <div className="flex space-x-4">
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
                <div className="w-6 h-6 bg-gray-200 rounded"></div>
              </div>
              <div className="w-6 h-6 bg-gray-200 rounded"></div>
            </div>
            
            <div className="space-y-2">
              <div className="w-32 h-3 bg-gray-200 rounded"></div>
              <div className="w-full h-3 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-3 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
