import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShowSparkComments } from "../tanstack/queries/commentQueries"
import { useShowSparkPage } from "../tanstack/queries/SparkPageQueries";
import SparkCard from "../components/SparkCard";
import SparkPageComments from "./SparkPageComments";

const SparkPage = () => {
  const navigate = useNavigate();
  const { sparkId } = useParams();
  
  const { data: spark, isLoading, isError, error } = useShowSparkPage(sparkId);
  const { data: comments, isLoading: commentsLoading } =
  useShowSparkComments(sparkId);

  if (isLoading) return <div>Loading Spark...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  if (!spark) return <div>Spark not found!</div>;

  return (
    <div className="spark-page">
      {/* Header */}
      <div className="px-3 py-2 spark-page-header">
        <button onClick={() => navigate(-1)} className="cursor-pointer">
          ← Back
        </button>
      </div>

      {/* Spark Content */}
      <SparkCard spark={spark} />


      {commentsLoading && <p>Loading comments...</p>}

      {comments?.map((comment) => (
        <div key={comment._id} className="comment">
         <SparkPageComments comment={comment} />
        </div>
      ))}
    </div>
  );
};

export default SparkPage;
