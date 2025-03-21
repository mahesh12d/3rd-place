import { useQuery } from "@tanstack/react-query";
import { Settings, Grid, Bookmark, Tag } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Post as PostType, User } from "@/lib/types";

export default function Profile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/profile"],
  });

  return (
    <div className="min-h-screen pb-14 bg-white">
      <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-3 max-w-[600px] mx-auto">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">yourusername</div>
          <div className="flex space-x-5">
            <button>
              <Settings className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <div className="pt-14 px-4">
        {isLoading ? (
          <ProfileSkeleton />
        ) : (
          <>
            <div className="flex items-center py-4">
              <div className="mr-8">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150"
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              </div>
              <div className="flex space-x-4">
                <div className="text-center">
                  <div className="font-semibold">{profile?.postCount || 0}</div>
                  <div className="text-sm text-gray-500">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{profile?.followerCount || 0}</div>
                  <div className="text-sm text-gray-500">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{profile?.followingCount || 0}</div>
                  <div className="text-sm text-gray-500">Following</div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="font-semibold">{profile?.displayName || "User"}</div>
              <div className="text-sm">{profile?.bio || "No bio yet"}</div>
            </div>

            <button className="w-full bg-gray-100 py-1.5 rounded font-semibold text-sm mb-4">
              Edit Profile
            </button>

            <Tabs defaultValue="posts" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="posts">
                  <Grid className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="saved">
                  <Bookmark className="h-5 w-5" />
                </TabsTrigger>
                <TabsTrigger value="tagged">
                  <Tag className="h-5 w-5" />
                </TabsTrigger>
              </TabsList>
              <TabsContent value="posts" className="mt-2">
                <div className="grid grid-cols-3 gap-1">
                  {profile?.posts?.map((post: PostType) => (
                    <div key={post.id} className="aspect-square bg-gray-100">
                      <img 
                        src={post.imageUrl} 
                        alt="Post" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
                {(!profile?.posts || profile.posts.length === 0) && (
                  <div className="text-center py-10 text-gray-500">
                    No posts yet
                  </div>
                )}
              </TabsContent>
              <TabsContent value="saved" className="mt-2">
                <div className="text-center py-10 text-gray-500">
                  Only you can see what you've saved
                </div>
              </TabsContent>
              <TabsContent value="tagged" className="mt-2">
                <div className="text-center py-10 text-gray-500">
                  No photos with you
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center py-4">
        <div className="mr-8">
          <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
        </div>
        <div className="flex space-x-4">
          <div className="text-center">
            <div className="w-10 h-4 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="w-14 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="text-center">
            <div className="w-10 h-4 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="w-14 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="text-center">
            <div className="w-10 h-4 bg-gray-200 rounded mx-auto mb-1"></div>
            <div className="w-14 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="w-32 h-4 bg-gray-200 rounded"></div>
        <div className="w-48 h-3 bg-gray-200 rounded"></div>
      </div>

      <div className="w-full h-8 bg-gray-200 rounded mb-4"></div>
    </div>
  );
}
