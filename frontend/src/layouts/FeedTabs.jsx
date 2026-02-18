import React, { useState } from "react";
import ForYouFeed from "./ForYouFeed";
import ConnectingFeed from "../layouts/ConnectingFeed";

const FeedTabs = () => {
  const [activeTab, setActiveTab] = useState("for-you");

  return (
    <div>
      {/* Tab buttons */}
      <div className="sticky top-0 z-20 flex border-b border-gray-800 bg-black/80 backdrop-blur-md">
        <button
          onClick={() => setActiveTab("for-you")}
          className="relative flex justify-center w-1/2 py-4 cursor-pointer hover:bg-gray-900"
        >
          <span className={activeTab === "for-you" ? "font-bold text-white" : "font-medium text-gray-500"}>
            For You
          </span>
          {activeTab === "for-you" && (
            <div className="absolute bottom-0 h-1 bg-[#5eeccc] rounded-full w-14"></div>
          )}
        </button>

        <button
          onClick={() => setActiveTab("connecting")}
          className="relative flex justify-center w-1/2 py-4 cursor-pointer hover:bg-gray-900"
        >
          <span className={activeTab === "connecting" ? "font-bold text-white" : "font-medium text-gray-500"}>
            Connecting
          </span>
          {activeTab === "connecting" && (
            <div className="absolute bottom-0 h-1 bg-[#5eeccc] rounded-full w-14"></div>
          )}
        </button>
      </div>

      {/* Feed content */}
      <div>
        {activeTab === "for-you" && <ForYouFeed />}
        {activeTab === "connecting" && <ConnectingFeed />}
      </div>
    </div>
  );
};

export default FeedTabs;
