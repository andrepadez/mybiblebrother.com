
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Home, MessageSquare } from 'lucide-react';
import AudioPlayer from './AudioPlayer';

const Layout: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen w-full bg-bible-light overflow-x-hidden">
      {/* Fixed Audio Player Header */}
      <header className="fixed top-0 left-0 right-0 bg-bible-skyblue/40 shadow-md z-50">
        <div className="max-w-4xl mx-auto px-4">
          <AudioPlayer />
        </div>
      </header>
      
      {/* Main content */}
      <main className="pt-16">
        <Outlet />
      </main>
      
      {/* Navigation Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-bible-skyblue/70 text-white py-3 px-4 shadow-md z-50 backdrop-blur-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="font-serif text-xl">My Bible Brother</div>
          
          {/* Navigation Links */}
          <nav className="flex space-x-6">
            <Link 
              to="/" 
              className={`flex items-center gap-1 transition-colors ${location.pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'}`}
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>
            <Link 
              to="/talk-to-bible-buddy" 
              className={`flex items-center gap-1 transition-colors ${location.pathname === '/talk-to-bible-buddy' ? 'text-white' : 'text-white/70 hover:text-white'}`}
            >
              <MessageSquare size={18} />
              <span className="hidden sm:inline">Bible Buddy</span>
            </Link>
          </nav>
          
          <div className="text-xs opacity-80 hidden sm:block">
            &copy; {new Date().getFullYear()} My Bible Brother
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
