import React, { useMemo, useState } from 'react'
import { useShowAllSparks } from '../tanstack/queries/sparkQueries';
import { useAuthStore } from '../store/authStore';

export const Header = () => {
     const [activeTab, setActiveTab] = useState('for-you');
      const { data: sparks, isLoading, isError } = useShowAllSparks();
       const { user } = useAuthStore();

      // Filter sparks based on active tab
             const filteredSparks = useMemo(() => {
               if (!sparks) return [];
           
               if (activeTab === 'following') {
                 return sparks.filter(spark => user?.following?.includes(spark.author._id));
               }
           
               return sparks; // 'for-you' shows all
             }, [sparks, activeTab, user]);
           
             if (isLoading) return <p>Loading sparks...</p>;
             if (isError) return <p>Error loading sparks.</p>;
             if (!filteredSparks.length) return <p>No sparks yet.</p>;

  return (
        <>
        <h2 className="px-4 py-3 text-xl font-bold text-white">
        {/* N o t i f i c a t i o n s */}
        {/* {unreadCount > 0 && (
            <span className="ml-2 text-sm text-[#5eeccc]">({unreadCount})</span>
        )} */}
        </h2>

        {/* Tabs */}
        <div className="flex border-t border-gray-800">
        {['for-you', 'connected'].map(tab => (
            <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-center font-medium transition-colors ${
                activeTab === tab
                ? 'text-white border-b-2 border-[#5eeccc]'
                : 'text-gray-500 hover:text-white'
            }`}
            >
            {tab === 'for-you' ? 'For You' : 'Connected'}
            </button>
        ))}
        </div>
  </>
  )
}
