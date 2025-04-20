import React from "react";

const RequestSkeleton = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {[...Array(6)].map((_, idx) => (
        <div
          key={idx}
          className="flex flex-col justify-between p-4 border rounded-xl bg-base-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="skeleton w-12 h-12 rounded-full" />
            <div className="space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-3 w-24 rounded" />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="skeleton h-8 w-8 rounded" />
            <div className="skeleton h-8 w-8 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestSkeleton;
