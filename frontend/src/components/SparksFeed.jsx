import React, { useState, useMemo } from 'react';
import SparksCard from './SparkCard';
import CreateSpark from './CreateSpark';
import { useAuthStore } from '../store/authStore';
import { useShowAllSparks } from "../tanstack/queries/sparkQueries";


const SparksFeed = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState('for-you');

  const { data: sparks = [], isLoading, isError } = useShowAllSparks();

  const following = useMemo(() => user?.following || [], [user?.following]);

  const filteredSparks = useMemo(() => {
    if (activeTab === 'following') {
      return sparks.filter(spark =>
        following.includes(spark.author._id)
      );
    }
    return sparks;
  }, [sparks, activeTab, following]);

  return (
    <main className="min-h-screen">

      {/* Tabs */}
       <div className="sticky top-0 z-20 hidden border-b border-gray-800 sm:flex bg-black/80 backdrop-blur-md">
         <button
          onClick={() => setActiveTab('for-you')}
          className="relative flex justify-center w-1/2 py-4 transition-colors cursor-pointer hover:bg-gray-900"
        >
          <span className={`${activeTab === 'for-you' ? 'font-bold text-white' : 'font-medium text-gray-500'}`}>
            For you
          </span>
          {activeTab === 'for-you' && (
            <div className="absolute bottom-0 h-1 bg-[#5eeccc] rounded-full w-14"></div>
          )}
        </button>

        <button
          // onClick={() => setActiveTab('following')}
          className="relative flex justify-center w-1/2 py-4 transition-colors cursor-pointer hover:bg-gray-900"
        >
          <span className={`${activeTab === 'following' ? 'font-bold text-white' : 'font-medium text-gray-500'}`}>
            Following
          </span>
          {activeTab === 'following' && (
            <div className="absolute bottom-0 h-1 bg-[#5eeccc] rounded-full w-14"></div>
          )}
        </button>
    </div>

      {/* ✅ ALWAYS RENDER CREATE */}
      <CreateSpark onSparkSubmit={() => {}} />

      {/* Feed */}
      <div className="pb-16 space-y-4 sm:pb-0">

        {isLoading && <p>Loading sparks...</p>}
        {isError && <p>Error loading sparks.</p>}

        {!isLoading && !isError && filteredSparks.length === 0 && (
          <p className="mt-8 text-center text-gray-400">
            {activeTab === 'following' && following.length === 0
              ? "You’re not following anyone yet. Explore and connect!"
              : "No sparks yet."}
          </p>
        )}

        {filteredSparks.map(spark => (
          <SparksCard key={spark._id} spark={spark} />
        ))}
      </div>
    </main>
  );
};

export default SparksFeed;





// import React, { useState, useMemo } from 'react';
// import SparksCard from './SparkCard';
// import CreateSpark from './CreateSpark';
// import { useAuthStore } from '../store/authStore';
// import { useShowAllSparks } from "../tanstack/queries/sparkQueries";


// const SparksFeed = () => {
//   const { user } = useAuthStore();
//   const [activeTab, setActiveTab] = useState('for-you');

//   // Fetch sparks from DB
//   const { data: sparks, isLoading, isError } = useShowAllSparks();

//   // Filter sparks based on active tab
//   const filteredSparks = useMemo(() => {
//     if (!sparks) return [];

//     if (activeTab === 'following') {
//       return sparks.filter(spark => user?.following?.includes(spark.author._id));
//     }

//     return sparks; // 'for-you' shows all
//   }, [sparks, activeTab, user]);

//   if (isLoading) return <p>Loading sparks...</p>;
//   if (isError) return <p>Error loading sparks.</p>;
//   if (!filteredSparks.length) return <p>No sparks yet.</p>;

//   return (
//     <main className="min-h-screen">
//       {/* Tabs */}
//       <div className="sticky top-0 z-20 hidden border-b border-gray-800 sm:flex bg-black/80 backdrop-blur-md">
//         <button
//           onClick={() => setActiveTab('for-you')}
//           className="relative flex justify-center w-1/2 py-4 transition-colors cursor-pointer hover:bg-gray-900"
//         >
//           <span className={`${activeTab === 'for-you' ? 'font-bold text-white' : 'font-medium text-gray-500'}`}>
//             For you
//           </span>
//           {activeTab === 'for-you' && (
//             <div className="absolute bottom-0 h-1 bg-[#5eeccc] rounded-full w-14"></div>
//           )}
//         </button>

//         <button
//           onClick={() => setActiveTab('following')}
//           className="relative flex justify-center w-1/2 py-4 transition-colors cursor-pointer hover:bg-gray-900"
//         >
//           <span className={`${activeTab === 'following' ? 'font-bold text-white' : 'font-medium text-gray-500'}`}>
//             Following
//           </span>
//           {activeTab === 'following' && (
//             <div className="absolute bottom-0 h-1 bg-[#5eeccc] rounded-full w-14"></div>
//           )}
//         </button>
//       </div>

//       {/* Create Spark */}
//       <CreateSpark onSparkSubmit={() => {}} />
  

//       {/* Feed */}
//       <div className="pb-16 space-y-4 sm:pb-0">
//         {isLoading && <p>Loading sparks...</p>}
//         {isError && <p>Error loading sparks.</p>}

//         {!isLoading && !isError && filteredSparks.length === 0 && (
//           <p className="mt-8 text-center text-gray-400">No sparks yet.</p>
//         )}

//         {filteredSparks.map(spark => (
//           <SparksCard key={spark._id} spark={spark} />
//         ))}
//       </div>
//     </main>
//   );
// };

// export default SparksFeed;