import { Play, Heart, MessageCircle, Send, Music } from "lucide-react";

export default function Reels() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed top-0 left-0 right-0 z-10 p-3 max-w-[600px] mx-auto flex justify-between">
        <h1 className="text-xl font-semibold">Reels</h1>
        <button>
          <Play className="h-6 w-6" />
        </button>
      </div>
      
      <div className="h-screen flex items-center justify-center">
        <div className="text-center p-8">
          <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <p className="text-xl font-medium">Reels Coming Soon</p>
          <p className="text-gray-400 mt-2">Check back later for short, entertaining videos</p>
        </div>
      </div>
      
      {/* When implemented, this would be the UI for viewing a reel */}
      <div className="hidden">
        <div className="fixed right-4 bottom-20 flex flex-col items-center space-y-6">
          <button className="flex flex-col items-center">
            <Heart className="h-7 w-7" />
            <span className="text-xs mt-1">24.5K</span>
          </button>
          <button className="flex flex-col items-center">
            <MessageCircle className="h-7 w-7" />
            <span className="text-xs mt-1">128</span>
          </button>
          <button>
            <Send className="h-7 w-7" />
          </button>
        </div>
        
        <div className="fixed left-4 bottom-20 max-w-[70%]">
          <div className="mb-4">
            <div className="flex items-center space-x-2">
              <img 
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150" 
                alt="User" 
                className="w-8 h-8 rounded-full"
              />
              <span className="font-semibold">username</span>
              <button className="border border-white rounded px-2 py-0.5 text-xs ml-2">
                Follow
              </button>
            </div>
          </div>
          
          <p className="mb-4">Caption for this amazing reel #trending</p>
          
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4" />
            <div className="text-sm">Original Sound - Username</div>
          </div>
        </div>
      </div>
    </div>
  );
}
