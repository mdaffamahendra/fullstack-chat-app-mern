import { useState } from "react";
import { Mail, Loader2, UserPlus } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useRequestStore } from "../store/useRequestStore";

export default function AddFriend() {
  const [email, setEmail] = useState("");
  const { sendFriendRequest, isSendRequestsLoading } = useRequestStore();

  const handleSendRequest = async (e) => {
    e.preventDefault();
    sendFriendRequest(email);
    setEmail("");
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <UserPlus className="size-6 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mt-2">Add a Friend</h1>
            <p className="text-base-content/60">
              Send a friend request by email
            </p>
            <Link to={"/"} className="link link-primary">
              Back Home
            </Link>
          </div>
        </div>

        <form onSubmit={handleSendRequest} className="space-y-6">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Friend Email</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center z-10 pointer-events-none">
                <Mail className="size-5 text-base-content/40" />
              </div>
              <input
                type="email"
                className="input input-bordered w-full pl-10"
                placeholder="friend@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSendRequestsLoading}
          >
            {isSendRequestsLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Sending...
              </>
            ) : (
              "Send Request"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
