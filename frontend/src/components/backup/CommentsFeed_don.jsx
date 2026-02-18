import { useState, useMemo } from 'react';
// import CommentCard from './CommentCard'; 
import { useAuthStore } from '../store/authStore';
import { useShowAllVerdicts } from '../tanstack/queries/verdictQueries'; 

const VerdictFeed = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('all');

  // Fetch all verdicts for the logged-in user
  const { data: verdicts, isLoading, isError } = useShowAllVerdicts();

  // Filter verdicts by tab
  const filteredVerdicts = useMemo(() => {
    if (!verdicts) return [];

    if (activeTab === 'all') return verdicts;

    return verdicts.filter(v => v.type === activeTab);
  }, [verdicts, activeTab]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-gray-800 backdrop-blur-md bg-black/80">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-600">
          <h2 className="text-xl font-bold text-white">Verdicts</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-600">
          {['all', 'like', 'respark', 'comment', 'follow'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-center font-medium transition-colors relative hover:bg-gray-900/50 ${
                activeTab === tab ? 'text-white' : 'text-gray-500'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#5eeccc] rounded-full" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Verdict List */}
      <div className="pb-16 space-y-4 sm:pb-0">
        {isLoading && <p className="mt-8 text-center text-gray-400">Loading verdicts...</p>}
        {isError && <p className="mt-8 text-center text-red-500">Error loading verdicts</p>}
        {!isLoading && !isError && filteredVerdicts.length === 0 && (
          <p className="mt-8 text-center text-gray-400">No verdicts yet</p>
        )}

        {filteredVerdicts.map(verdict => (
          <CommentCard key={verdict._id} verdict={verdict} />
        ))}
      </div>
    </div>
  );
};

export default VerdictFeed;







