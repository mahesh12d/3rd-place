import { Search, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Shop() {
  return (
    <div className="min-h-screen pb-14 bg-white">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-3 max-w-[600px] mx-auto">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-xl font-semibold">Shop</h1>
          <button>
            <ShoppingBag className="h-6 w-6" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            className="w-full bg-gray-100 pl-10 rounded-lg"
            placeholder="Search shops"
          />
        </div>
      </div>

      <div className="pt-28 px-4 text-center">
        <div className="max-w-xs mx-auto">
          <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-gray-300" />
          <h2 className="text-xl font-semibold mb-2">Shop on Instagram</h2>
          <p className="text-gray-500 mb-6">
            Buy products from brands you love based on what you see in photos and videos.
          </p>
          <p className="text-gray-400 text-sm">
            Shop feature coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
