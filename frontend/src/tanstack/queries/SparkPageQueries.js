// SparkPageQuery.js
import { useQuery } from "@tanstack/react-query";
import { getSparkById  } from "../api/SparkPageApi";

export const useShowSparkPage = (sparkId) => {
    return useQuery({
      queryKey: ["spark", sparkId],
      queryFn: () => getSparkById(sparkId),
      staleTime: 1000 * 60 * 5, // optional: cache 5 minutes
      retry: 1,                 // optional
    });
  };