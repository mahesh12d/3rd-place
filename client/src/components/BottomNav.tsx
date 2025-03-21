import { Home, Search, PlayCircle, ShoppingBag, User } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 max-w-[600px] mx-auto z-10">
      <div className="flex justify-between px-6">
        <Link href="/">
          <a className="p-2 focus:outline-none">
            {isActive("/") ? (
              <Home className="h-6 w-6 fill-black" />
            ) : (
              <Home className="h-6 w-6" />
            )}
          </a>
        </Link>
        <Link href="/search">
          <a className="p-2 focus:outline-none">
            {isActive("/search") ? (
              <Search className="h-6 w-6 fill-black" />
            ) : (
              <Search className="h-6 w-6" />
            )}
          </a>
        </Link>
        <Link href="/reels">
          <a className="p-2 focus:outline-none">
            {isActive("/reels") ? (
              <PlayCircle className="h-6 w-6 fill-black" />
            ) : (
              <PlayCircle className="h-6 w-6" />
            )}
          </a>
        </Link>
        <Link href="/shop">
          <a className="p-2 focus:outline-none">
            {isActive("/shop") ? (
              <ShoppingBag className="h-6 w-6 fill-black" />
            ) : (
              <ShoppingBag className="h-6 w-6" />
            )}
          </a>
        </Link>
        <Link href="/profile">
          <a className="p-2 focus:outline-none">
            {isActive("/profile") ? (
              <div className="border-2 border-black rounded-full p-0.5">
                <img 
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40" 
                  alt="Profile" 
                  className="w-5 h-5 rounded-full object-cover"
                />
              </div>
            ) : (
              <img 
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=40&h=40" 
                alt="Profile" 
                className="w-6 h-6 rounded-full object-cover"
              />
            )}
          </a>
        </Link>
      </div>
    </nav>
  );
}
