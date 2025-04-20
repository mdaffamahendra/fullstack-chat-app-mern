import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { UserPlus, Users } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { useRequestStore } from "../store/useRequestStore";

const Sidebar = () => {
  const {
    setSelectedUser,
    isUsersLoading,
    selectedUser,
    subscribeNotifications,
    notifications,
    unsubscribeToNotif,
    fetchNotifications,
  } = useChatStore();
  const { getUsers, users } = useRequestStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);


  const filteredusers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;
  return (
    <aside
      className={`h-full ${
        selectedUser ? "hidden" : "w-full"
      } md:w-72 md:flex flex-col transition-all duration-200 border-r border-base-300`}
    >
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium block">Friends</span>
          </div>

          <Link
            to="/friend/add"
            className="btn btn-sm btn-primary flex items-center gap-2"
          >
            <UserPlus className="size-4" />
            Add
          </Link>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          {/* <span className="text-xs text-zinc-500">
            ({onlineUsers.length - 1} online)
          </span> */}
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredusers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${
                selectedUser?._id === user._id
                  ? "bg-base-300 ring-1 ring-base-300"
                  : ""
              }
            `}
          >
            <div className="relative mx-0">
              <img
                src={
                  user.profilePic ||
                  "https://res.cloudinary.com/dii5kjxvz/image/upload/v1744552874/zjijehgi7xkrwjmfrxw2.png"
                }
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="block text-left min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="font-medium truncate">{user.fullName}</p>
                {notifications[user._id] > 0 && (
                  <div className="ml-2 min-w-[24px] h-6 px-2 text-xs font-bold bg-primary text-primary-content  rounded-full flex items-center justify-center shadow-md">
                    {notifications[user._id]}
                  </div>
                )}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </p>
            </div>
          </button>
        ))}

        {filteredusers.length === 0 && (
          <div className="text-center text-sm text-zinc-500 py-4">You dont have any online friends yet</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
