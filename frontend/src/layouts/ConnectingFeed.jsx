import React from 'react';
import { useShowConnectingSparks } from "../tanstack/queries/sparkQueries";
import SparkCard from '../components/SparkCard';

const ConnectingFeed = () => {
  const { data: sparks, isLoading, isError, error } = useShowConnectingSparks();

  console.log('ConnectingFeed:', { 
    sparks: sparks?.length, 
    isLoading, 
    isError, 
    error: error?.message,
    rawData: sparks // Check the actual structure
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return (
    <div className="text-red-500">
      {error?.response?.data?.message || error?.message}
    </div>
  );

  return (
    <div className="space-y-4">
      {sparks?.length > 0 ? (
        sparks.map(spark => <SparkCard key={spark._id} spark={spark} />)
      ) : (
        <p className="text-gray-400">No sparks from users you follow yet.</p>
      )}
    </div>
  );
};

export default ConnectingFeed;
