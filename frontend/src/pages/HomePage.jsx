import React from 'react'
import { Outlet } from 'react-router-dom';
import LeftSidebar from "../components/LeftSidebar"
import RightSidebar from "../components/RightSidebar"
import { 
  Home, 
  Search, 
  Bell, 
  Mail,
} from 'lucide-react';

const HomePage = () => {
	return (
	  <div className="min-h-screen font-sans text-gray-100">
		<div className="flex justify-center min-h-screen">
		  
		  {/* Left Sidebar - FIXED WIDTH */}
		  <div className="hidden sm:block w-[88px] xl:w-[275px] flex-shrink-0">
			<LeftSidebar />
		  </div>
  
		  {/* Middle Content - YOUR SETTLED WIDTH */}
		  <main className="w-full sm:w-auto lg:w-[500px] xl:w-[550px] border-x border-gray-800 min-h-screen flex-shrink-0">
			<Outlet />
		  </main>
  
		  {/* Right Sidebar - FIXED WIDTH + sticky */}
		  <div className="hidden lg:block w-[300px] xl:w-[350px] flex-shrink-0">
		  <div className="sticky top-0 h-screen overflow-y-auto scrollbar-hide">
			  <RightSidebar />
			</div>
		  </div>


			{/* Mobile Bottom Nav */}
			<div className="fixed bottom-0 z-50 flex justify-around w-full py-3 bg-black border-t border-gray-800 sm:hidden">
			<Home className="w-6 h-6" />
			<Search className="w-6 h-6" />
			<Bell className="w-6 h-6" />
			<Mail className="w-6 h-6" />
			</div>
  
		</div>
	  </div>
	);
  };

export default HomePage;