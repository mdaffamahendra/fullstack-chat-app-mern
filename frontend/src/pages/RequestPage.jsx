import React, { useEffect, useRef } from "react";
import RequestFromUser from "../components/RequestFromUser";
import { useRequestStore } from "../store/useRequestStore";
import RequestFromMe from "../components/RequestFromMe";

const RequestPage = () => {
  const {
    requestsFromUser,
    fetchRequestsFromMe,
    requestsFromMe,
  } = useRequestStore();

  useEffect(() => {
    fetchRequestsFromMe();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 sm:p-12">
      <div className="w-full max-w-full space-y-8">
        <div className="text-center mb-8">
          <div className="flex flex-col items-center gap-2 group">
            <div className="size-12 rounded-xl bg-primary/10 mt-12 md:mt-6 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <span className="font-bold text-primary text-xl">👥</span>
            </div>
            <h1 className="text-2xl font-bold mt-2">Friend Requests</h1>
            <p className="text-base-content/60">Permintaan pertemanan masuk</p>
          </div>
        </div>

        {/* Pending Requests */}
        {requestsFromUser.length === 0 ? (
          <div className="text-center text-base-content/60">
            Tidak ada permintaan pertemanan.
          </div>
        ) : (
          <RequestFromUser />
        )}

        {requestsFromMe.length > 0 && (
          <div className="mt-10 space-y-4 text-center">
            <h2 className="text-lg font-semibold">Permintaanmu</h2>

            <RequestFromMe />
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestPage;
