
import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center space-x-2 animate-pulse">
      <div className="w-3 h-3 bg-repair-blue rounded-full"></div>
      <div className="w-3 h-3 bg-repair-blue rounded-full"></div>
      <div className="w-3 h-3 bg-repair-blue rounded-full"></div>
    </div>
  );
};
