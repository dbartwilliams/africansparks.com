import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import RightPanel from './RightPanel';

const MainLayout = () => {
  return (
    <div className="flex min-h-screen bg-black text-white">
      {/* Left Sidebar - Fixed */}
      <div className="w-20 xl:w-64 fixed h-screen border-r border-gray-800">
        <Sidebar />
      </div>

      {/* Middle Content - Outlet swaps here */}
      <main className="flex-1 ml-20 xl:ml-64 min-h-screen border-r border-gray-800">
        <Outlet />
      </main>

      {/* Right Panel - Fixed */}
      <div className="hidden lg:block w-80 fixed right-0 h-screen">
        <RightPanel />
      </div>
    </div>
  );
};

export default MainLayout;