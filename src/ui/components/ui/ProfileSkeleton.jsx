import React from 'react';

const ProfileSkeleton = () => {
  return (
    <div className="mt-5 mx-auto p-6 bg-white rounded-lg animate-pulse">
      {/* File upload section skeleton */}
      <div className="mb-6">
        <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
        <div className="h-10 bg-gray-200 rounded-md"></div>
      </div>

      {/* User information section skeleton */}
      <div className="space-y-4">
        {/* Username and Full Name row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>

        {/* Email and Phone row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
          <div>
            <div className="h-4 w-3/4 bg-gray-200 rounded mb-2"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;