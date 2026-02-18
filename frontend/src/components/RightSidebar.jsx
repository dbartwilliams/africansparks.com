import React from 'react';
import { Search } from 'lucide-react';
import Hero from "../assets/post1.jpeg";
import { useLatestUsers } from '../tanstack/queries/usersQueries';
import { useToggleConnect } from '../tanstack/queries/usersQueries';
import { useAuthStore } from '../store/authStore';
import { getAvatarPath } from '../util/imageKitHelper';
import Image from "../components/Image";
import { Link } from 'react-router-dom';

const SuggestionItem = ({ user }) => {
  const { user: currentUser } = useAuthStore();
  const toggleConnect = useToggleConnect(user._id);

  // Check if current user is in this user's connections
  const isConnected = user.connections?.some(
    c => c._id === currentUser?._id || c === currentUser?._id
  );

  const handleConnect = (e) => {
    e.stopPropagation(); // Prevent navigation if you add click handler
    if (toggleConnect.isPending) return;
    toggleConnect.mutate();
  };

  const displayName = `${user.firstName} ${user.lastName}`;
  const handle = `@${user.userName}`;
  // const avatar = getAvatarPath(user.userAvatar);

  // const isAuthor = user?._id === user.authorId;

  return (
    <div className="flex items-center justify-between px-4 py-3 transition-colors cursor-pointer hover:bg-gray-800">
      <div className="flex items-center gap-3 overflow-hidden">
      
      <Link 
          to=""
          onClick={(e) => e.stopPropagation()} // Prevent spark card click
        >
       
      <Image
          src={getAvatarPath(user.userAvatar)}
          alt="Author"
          className="object-cover w-12 h-12 rounded-full shrink-0" 
        />
         </Link>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-[15px] truncate hover:underline text-white">
            {displayName}
          </span>
          <span className="text-gray-500 text-[15px] truncate">{handle}</span>
        </div>
      </div>
      <button
        onClick={handleConnect}
        disabled={toggleConnect.isPending}
        className={`font-bold text-sm rounded px-4 py-1.5 transition-colors shrink-0 ${
          isConnected
            ? 'bg-gray-700 text-white hover:bg-gray-600'      // Connected
            : 'bg-[#5eeccc] text-black hover:bg-[#1be415]'    // Not connected
        }`}
      >
        {toggleConnect.isPending ? '...' : isConnected ? 'Connected' : 'Connect'}
      </button>
    </div>
  );
};

const RightSidebar = () => {
  const { data: users, isLoading, isError } = useLatestUsers(2);

  return (
    <aside className="hidden lg:block w-[350px] pl-8 py-2">
      <div className="sticky top-2">
        {/* Search */}
        <div className="relative mb-4 group">
          <div className="absolute top-3.5 left-4 text-gray-500 group-focus-within:text-blue-500">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full py-3 pl-12 pr-4 text-white placeholder-gray-500 transition-colors rounded-full outline-none focus:ring-1 focus:ring-blue-500 focus:bg-black"
          />
        </div>

        {/* Trending */}
        <div className="mb-4 overflow-hidden border border-gray-800 rounded-2xl">
          <img src={Hero} alt="hero" className='w-full rounded-xl' />
        </div>

        {/* Who to follow */}
        <div className="overflow-hidden border border-gray-800 rounded-2xl">
          <h2 className="px-4 py-3 text-xl font-bold text-white">Connect with:-</h2>
          
          {isLoading && (
            <div className="px-4 py-3 text-gray-500">Loading...</div>
          )}
          
          {isError && (
            <div className="px-4 py-3 text-red-500">Failed to load users</div>
          )}
          
          {users?.map((user) => (
            <SuggestionItem key={user._id} user={user} />
          ))}
          
          <div className="px-4 py-4 hover:bg-gray-800 cursor-pointer text-[#5eeccc] text-[15px]">
            Show more
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 px-4 flex flex-wrap gap-x-3 gap-y-1 text-[15px] text-gray-500">
          <Link to="/privacy"className="hover:underline">Terms</Link>
          <Link to="/privacy"className="hover:underline">Privacy</Link>
          <Link to="/privacy"className="hover:underline">Cookies</Link>
          <span>© 2026 VOA.</span>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
