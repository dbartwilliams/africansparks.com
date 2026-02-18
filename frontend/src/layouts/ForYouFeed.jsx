import React from 'react';
import { useShowAllSparks } from "../tanstack/queries/sparkQueries";
import SparkCard from '../components/SparkCard';

const ForYouFeed = () => {
  const { data: sparks, isLoading, isError } = useShowAllSparks();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading sparks!</div>;

  return (
    <div className="space-y-4">
      {sparks?.map(spark => (
        <SparkCard key={spark._id} spark={spark} />
      ))}
      {sparks?.length === 0 && <p className="text-gray-400">No sparks yet.</p>}
    </div>
  );
};

export default ForYouFeed;