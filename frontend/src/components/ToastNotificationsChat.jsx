import React from "react";
import toast from "react-hot-toast";
import { PictureInPicture } from "lucide-react";

const showMessageNotification = (notif, setSelectedUser) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5 p-4`}
    >
      <div className="flex-shrink-0">
        <img
          src={
            notif.senderId.profilePic ||
            "https://res.cloudinary.com/dii5kjxvz/image/upload/v1744552874/zjijehgi7xkrwjmfrxw2.png"
          }
          alt={notif.senderId.fullName}
          className="w-10 h-10 rounded-full object-cover"
        />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-zinc-900 dark:text-white">
          {notif.senderId.fullName}
        </p>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-1">
          {notif.messageId?.text || (
            <div>
              <PictureInPicture className="size-7" />
              <p>Photo</p>
            </div>
          )}
        </p>
      </div>
      <div className="ml-4 flex-shrink-0 flex items-center">
        <button
          onClick={() => {
            setSelectedUser(notif.senderId);
            toast.dismiss(t.id);
          }}
          className="text-sm text-cyan-600 hover:underline"
        >
          Lihat
        </button>
      </div>
    </div>
  ));
};

export default showMessageNotification;
