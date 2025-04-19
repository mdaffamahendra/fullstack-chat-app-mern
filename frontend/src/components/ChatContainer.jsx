import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime, isMoreThan15MinutesAgo } from "../lib/utils";
import { Copy, Edit, Trash2, ChevronDown, CheckCheck } from "lucide-react";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeToMessages,
    deleteMessages,
    setEditMessageActive,
    setMessageId,
    clearNotif
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    clearNotif(selectedUser._id);

    return () => unsubscribeToMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeToMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdownId &&
        dropdownRefs.current[openDropdownId] &&
        !dropdownRefs.current[openDropdownId].contains(event.target)
      ) {
        setOpenDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdownId]);

  const toggleDropdown = (messageId) => {
    setOpenDropdownId(openDropdownId === messageId ? null : messageId);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Chat copied!");
    setOpenDropdownId(null);
  };

  const handleEdit = (messageId) => {
    setMessageId(messageId);
    setEditMessageActive();
    setOpenDropdownId(null);
  };

  const handleDelete = (messageId) => {
    deleteMessages(messageId);
    setOpenDropdownId(null);
  };

  if (isMessagesLoading)
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 px-8 pb-12 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageEndRef}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic ||
                        "https://res.cloudinary.com/dii5kjxvz/image/upload/v1744552874/zjijehgi7xkrwjmfrxw2.png"
                      : selectedUser.profilePic ||
                        "https://res.cloudinary.com/dii5kjxvz/image/upload/v1744552874/zjijehgi7xkrwjmfrxw2.png"
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              {message.edited ? (
                <>
                  <p className="text-xs italic opacity-50 ml-1">edited</p>
                  <time className="text-xs opacity-50 ml-1">
                    {formatMessageTime(message.updatedAt)}
                  </time>
                </>
              ) : (
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              )}
            </div>

            {/* Message bubble with dropdown */}
            <div className="relative group">
              <div
                className="chat-bubble flex flex-col cursor-pointer"
                onClick={() => toggleDropdown(message._id)}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p className="text-sm">{message.text}</p>}
              </div>

              {/* Dropdown menu */}
              {openDropdownId === message._id && (
                <div
                  ref={(el) => (dropdownRefs.current[message._id] = el)}
                  className="absolute z-10 left-0 top-0 mb-8 bg-base-100 shadow-lg rounded-md p-1 min-w-[120px]"
                >
                  <button
                    className="w-full flex items-center px-3 py-2 text-sm text-white hover:bg-base-200 rounded"
                    onClick={() => handleCopy(message.text)}
                  >
                    <Copy className="mr-2 size-4" />
                    Salin
                  </button>
                  {message.senderId === authUser._id && (
                    <>
                      <button
                        className={`${
                          isMoreThan15MinutesAgo(message.createdAt)
                            ? "hidden"
                            : "flex"
                        } ${
                          !message.text ? "hidden" : "flex"
                        } w-full items-center px-3 py-2 text-sm hover:bg-base-200 rounded text-white`}
                        onClick={() => handleEdit(message._id)}
                      >
                        <Edit className="mr-2 size-4" />
                        Edit
                      </button>
                      <button
                        className="w-full flex items-center px-3 py-2 text-sm hover:bg-base-200 rounded text-white"
                        onClick={() => handleDelete(message._id)}
                      >
                        <Trash2 className="mr-2 size-4" />
                        Hapus
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Read status */}
            {/* {message.senderId === authUser._id && (
              <div className="chat-footer opacity-50 text-xs flex items-center mt-1">
                <CheckCheck className="size-3 mr-1" />
                Dibaca
              </div>
            )} */}
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
