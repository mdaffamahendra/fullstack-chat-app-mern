import React from "react";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import RequestSkeleton from "./skeletons/RequestSkeleton";
import { useRequestStore } from "../store/useRequestStore";


const RequestFromUser = () => {
  const {requestsFromUser, isRequestsLoading, fetchRequestsFromUser, acceptFriendRequest, rejectFriendRequest} = useRequestStore();

  useEffect(() => {
    fetchRequestsFromUser();
  }, []);

  const handleAccept = (id) => {
    acceptFriendRequest(id);
  };

  const handleReject = (id) => {
    rejectFriendRequest(id)
  };

  if (isRequestsLoading) return <RequestSkeleton />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {requestsFromUser?.map((req) => (
        <div
          key={req._id}
          className="flex flex-col justify-between p-4 border rounded-xl bg-base-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={req.sender.profilePic || "https://res.cloudinary.com/dii5kjxvz/image/upload/v1744552874/zjijehgi7xkrwjmfrxw2.png"}
              alt={req.sender.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium">{req.sender.fullName}</div>
              <div className="text-sm text-base-content/60">
                Mengajukan pertemanan
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => handleAccept(req._id)}
              className="btn btn-sm btn-success"
            >
              <Check className="size-4" />
            </button>
            <button
              onClick={() => handleReject(req._id)}
              className="btn btn-sm btn-error"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestFromUser;
