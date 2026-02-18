// ==========================================
// COMPONENT: LEFT SIDEBAR
// ==========================================
import React, { useState, useEffect } from 'react';
import { 
  Home, 
  Search, 
  Bell, 
  Mail, 
  User, 
  MoreHorizontal, 
  Feather, 
  LogOut,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from "../assets/post4.jpeg";
import { useAuthStore } from "../store/authStore";
import { getAvatarPath, getSiteImagePath } from '../util/imageKitHelper';
import Image from '../components/Image';
import PostModal from './PostModal';

const LeftSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  
  // Notification state
  const [unreadCount, setUnreadCount] = useState(0);

  // Listen for new notifications
  useEffect(() => {
    const updateCount = () => {
      const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
      const unread = notifications.filter(n => 
        !n.read && n.recipientId === user?._id
      ).length;
      setUnreadCount(unread);
    };

    updateCount();
    window.addEventListener('newNotification', updateCount);
    window.addEventListener('storage', updateCount);

    return () => {
      window.removeEventListener('newNotification', updateCount);
      window.removeEventListener('storage', updateCount);
    };
  }, [user?._id]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Explore', path: '/explore' },
    { icon: Bell, label: 'Notifications', path: '/notification' }, // updated
    { icon: Mail, label: 'Messages', path: '/messages' },
    { icon: User, label: 'Profile', path: `/profile/${user?._id}` },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTweetSubmit = (content, image) => {
    console.log('New tweet:', { content, image });
  };

  return (
    <>
      <header className="hidden sm:flex flex-col w-[88px] xl:w-[275px] h-screen sticky top-0 px-2 xl:px-4 py-4 border-r border-gray-700 items-center xl:items-start z-30">
        {/* Logo */}
        <div className="items-center hidden px-3 mb-4 lg:flex">
          <Link
            to="/"
            className="flex items-center justify-center transition-colors rounded-full hover:bg-gray-900"
          >
            <div>
              <Image
                src={getSiteImagePath("verified.png")}
                className="w-8 h-8"
                alt="adv"
              />
            </div>
            <span className="pl-2 text-lg font-bold sm:text-xl md:text-lg">
              <span className="text-yellow-500">AFRICAN</span>
              <span className="text-yellow-700">SPARKS</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col w-full gap-2">
        {/* // In the render: */}
           {navItems.map((item, idx) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              const isComments = item.label === 'Comments';

              return (
                <Link
                  key={idx}
                  to={item.path}
                  className={`flex items-center gap-4 xl:gap-6 px-3 py-3 rounded-full transition-colors ${
                        active
                          ? 'text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-900'
                      }`}
                    >
                  <div className="relative">
                    <Icon
                        className={`w-7 h-6 ${
                          active ? 'text-white' : 'text-gray-400'
                        }`}
                      />
                    
                    {/* Only show badge on Comments */}
                    {isComments && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-700 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </div>
                  
                  <span className="hidden text-xl font-semibold xl:block">{item.label}</span>
                </Link>
              );
            })}
        </nav>

        {/* Post Button */}
        <div className="mt-4">
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="buttoncol rounded w-12 h-12 xl:w-full xl:h-[42px] xl:px-8 font-bold text-lg shadow-md transition-colors flex items-center justify-center cursor-pointer hover:opacity-90"
          >
            <Feather className="w-7 h-7 xl:mr-2" />
            <span className="hidden xl:block">Post</span>
          </button>
        </div>

        {/* Hero Image */}
        <div className="mt-10 mb-4 mr-20 overflow-hidden border border-gray-800 rounded">
          <img src={Hero} alt="hero" className='w-full rounded' />
        </div>

        {/* User Profile */}
        <div className="relative w-full mt-auto mb-4">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center justify-between w-full px-3 py-3 transition-colors bg-gray-900 rounded-full hover:bg-gray-800"
          >
            <div className="flex items-center gap-3">
              <Image
                src={getAvatarPath(user?.userAvatar)}
                alt="img" 
                className="object-cover w-10 h-10 rounded-full"
              />
              <div className="flex-col items-start hidden xl:flex">
                <span className="text-gray-500 text-[15px]">
                  @{user?.userName || 'username'}
                </span>
              </div>
            </div>
            <MoreHorizontal className="hidden w-4 h-4 text-gray-400 xl:block" />
          </button>

          {/* Logout Dropdown */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-0 z-50 w-full mb-2 overflow-hidden origin-bottom bg-black border border-gray-800 shadow-lg bottom-full rounded-xl"
              >
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full gap-3 px-4 py-3 text-red-500 transition-colors hover:bg-gray-900"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="font-medium">Log out</span>
                  <span className="ml-auto text-sm text-gray-500">
                    @{user?.userName}
                  </span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Post Modal */}
      <PostModal 
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onTweetSubmit={handleTweetSubmit}
      />
    </>
  );
};

export default LeftSidebar;