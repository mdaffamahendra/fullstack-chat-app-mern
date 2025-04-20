import RequestSkeleton from "./skeletons/RequestSkeleton";
import { useRequestStore } from "../store/useRequestStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";
const RequestFromMe = () => {
  const {
    isRequestsLoading,
    requestsFromMe,
    fetchRequestsFromUser,
    deleteFriendRequest,
  } = useRequestStore();

  useEffect(() => {
    fetchRequestsFromUser();
  }, []);

  const handleDelete = (id) => {
    deleteFriendRequest(id);
  };

  if (isRequestsLoading) return <RequestSkeleton />;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
      {requestsFromMe.map((req, index) => (
        <div
          key={index}
          className="flex flex-col justify-between p-4 border rounded-xl bg-base-100 shadow-sm"
        >
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                req.receiver.profilePic ||
                "https://res.cloudinary.com/dii5kjxvz/image/upload/v1744552874/zjijehgi7xkrwjmfrxw2.png"
              }
              alt={req.receiver.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <div className="font-medium text-left">{req.receiver.fullName}</div>
              <div
                className={`text-sm text-left ${
                  req.status === "accepted"
                ? "text-success"
                : req.status === "rejected"
                ? "text-error"
                : ""
                }`}
              >
                {req.status === "accepted"
                ? "Accepted"
                : req.status === "rejected"
                ? "Rejected"
                : "Pending, waiting response..."}
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className={`btn btn-sm ${
                req.status === "pending"
                  ? "btn-disabled btn-outline"
                  : "btn-outline btn-primary"
              }`}
              onClick={() => {
                if (req.status !== "pending") {
                  handleDelete(req._id);
                }
              }}
              disabled={req.status === "pending"}
            >
              {req.status === "accepted"
                ? "OK"
                : req.status === "rejected"
                ? "OK"
                : (<Loader className="animate-spin size-5 text-primary"/>)}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestFromMe;
