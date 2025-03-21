import { Bell, MessageSquare, Plus } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 bg-white border-b border-gray-200 p-2 max-w-[600px] mx-auto">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold italic pl-2">Instagram</div>
        <div className="flex space-x-5 pr-2">
          <button className="focus:outline-none">
            <Plus className="h-6 w-6" />
          </button>
          <button className="focus:outline-none">
            <Bell className="h-6 w-6" />
          </button>
          <button className="focus:outline-none">
            <MessageSquare className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
