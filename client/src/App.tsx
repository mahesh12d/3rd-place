import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import Search from "@/pages/Search";
import Reels from "@/pages/Reels";
import Shop from "@/pages/Shop";
import BottomNav from "@/components/BottomNav";

function Router() {
  const [location] = useLocation();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/profile" component={Profile} />
      <Route path="/search" component={Search} />
      <Route path="/reels" component={Reels} />
      <Route path="/shop" component={Shop} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation();
  const showBottomNav = !location.includes("/not-found");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="bg-white min-h-screen max-w-[600px] mx-auto relative pb-14">
        <Router />
        <Toaster />
        {showBottomNav && <BottomNav />}
      </div>
    </QueryClientProvider>
  );
}

export default App;
