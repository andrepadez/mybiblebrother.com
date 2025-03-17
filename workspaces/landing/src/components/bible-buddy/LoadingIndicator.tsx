
import React from 'react';

export const LoadingIndicator = () => {
  return (
    <div className="text-center">
      <p className="text-lg mb-4">Processing your question...</p>
      <div className="animate-pulse h-32 w-32 bg-bible-skyblue/30 rounded-full flex items-center justify-center">
        <div className="h-24 w-24 rounded-full bg-bible-skyblue/60"></div>
      </div>
    </div>
  );
};
