import { useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: trendingPosts, isLoading } = useQuery({
    queryKey: ["/api/explore"],
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would trigger a search query here
  };

  return (
    <div className="min-h-screen pb-14 bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white p-3 max-w-[600px] mx-auto">
        <form onSubmit={handleSearch} className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="w-full bg-gray-100 pl-10 rounded-lg"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="pt-16 px-1">
        {isLoading ? (
          <ExploreSkeleton />
        ) : (
          <div className="grid grid-cols-3 gap-1">
            {trendingPosts?.map((post: any) => (
              <div key={post.id} className="aspect-square bg-gray-100">
                <img 
                  src={post.imageUrl} 
                  alt="Post" 
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ExploreSkeleton() {
  return (
    <div className="grid grid-cols-3 gap-1 animate-pulse">
      {[...Array(15)].map((_, index) => (
        <div 
          key={index} 
          className="aspect-square bg-gray-200"
        ></div>
      ))}
    </div>
  );
}
