"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import React, { useEffect, useReducer, useRef } from "react";
import { FcDocument } from "react-icons/fc";
import { useParams } from "next/navigation";
import { Axios } from "@/app/axios";
import { toast } from "sonner";
import { FaPlus } from "react-icons/fa6";
import { jwtDecode } from "jwt-decode";

import { io } from "socket.io-client";

let socket;

function page() {
  const [loading, setLoading] = React.useState(false);
  const [allUsers, setAllUsers] = React.useState([]);
  const [connectedUsers, setConnectedUsers] = React.useState([]);

  const [popup, setPopup] = React.useState(false);
  const { ID } = useParams();
  const [DataChanged, setDataChanged] = React.useState(false);
  const [lastSavedData, setLastSavedData] = React.useState({});
  const [data, setData] = React.useState({});
  const dataRef = useRef(data);

  const fetchData = async () => {
    try {
      const response = await Axios.get(`/doc/${ID}`);
      setData(response?.data);
      setLastSavedData(response?.data);
      dataRef.current = response?.data;
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };
  const getallUSers = async () => {
    try {
      const response = await Axios.get("/auth/all");
      const filterUsers = response?.data?.filter(
        (user) =>
          user?._id !== data?.ownerId &&
          !data?.collaborators?.includes(user?._id)
      );
      setAllUsers(filterUsers);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  const save = async () => {
    if (!DataChanged) return;

    try {
      setLoading(true);
      const latestData = dataRef.current;
      await Axios.put(`/doc/update/${ID}`, {
        content: latestData?.content,
      });
      setLoading(false);
      console.log("send data ---", latestData);
      setLastSavedData(latestData);
      setDataChanged(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  const shareDoc = async (id) => {
    console.log(id);
    try {
      setLoading(true);
      const response = await Axios.put(`/doc/share/${data?._id}`, {
        share: id,
      });
      setLoading(false);
      getallUSers();
      setPopup(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  // Connect to socket
  useEffect(() => {
    socket = io("https://document-editor-80fc.onrender.com");
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.error("No token found, please login again.");
      return;
    }

    socket.on("connect", (id) => {});
    const decodedToken = jwtDecode(token);
    const userId = decodedToken?.id;
    socket.emit("join-document", { documentId: ID, userId });

    socket.on("user-joined", (user) => {
      user?.userId !== userId &&
        toast.success(`${user.username} has joined the document!`);
      setConnectedUsers(user?.connectedUsers);

      console.log(connectedUsers);
    });

    socket.on("user-disconnect", (user) => {
      console.log("Before Disconnect:", connectedUsers);

      setConnectedUsers((prevUsers) => {
        const filterUser = prevUsers.find(
          (e) => e?.socketId === user?.socketId
        );

        if (filterUser) {
          toast.success(`${filterUser?.name} has disconnected!`);
        }

        return user?.connectedUsers || [];
      });

      console.log("After Disconnect:", connectedUsers);
    });

    socket.on("receive-changes", (changes) => {
      setData((prev) => ({ ...prev, content: changes }));
    });

    return () => {
      socket.disconnect();
    };
  }, [ID]);
  useEffect(() => {
    const checkTitle = data?.title === lastSavedData?.title;
    const checkContent = data?.content === lastSavedData?.content;
    setDataChanged(!(checkTitle && checkContent));
    dataRef.current = data;
  }, [data, lastSavedData]);

  useEffect(() => {
    fetchData();
    getallUSers();
  }, [ID]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (DataChanged) {
        save();
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [DataChanged]);

  const handleContentChange = (e) => {
    const updatedContent = e.target.value;
    setData((prev) => {
      const newData = { ...prev, content: updatedContent };
      dataRef.current = newData;
      return newData;
    });

    socket.emit("send-changes", { documentId: ID, changes: updatedContent });
  };
  return (
    <>
      {popup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-screen z-20 bg-black/10 backdrop-blur-[2px]">
          <div className="bg-white w-[26%] p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibolds">Invite Person</h2>
              <div
                onClick={() => setPopup(false)}
                className="flex justify-center items-center cursor-pointer h-6 w-6 bg-slate-200 rounded-sm"
              >
                <FaPlus className="rotate-[45deg]" />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              <div className="mb-10 flex flex-col gap-2">
                {allUsers?.map((user) => {
                  if (
                    user?._id === data?.ownerId ||
                    data?.collaborators.includes(user?._id)
                  ) {
                    return <></>;
                  }
                  return (
                    <div
                      className="border-b-2 pb-1 flex  justify-between items-center"
                      key={user?._id}
                    >
                      <div>
                        <h2 className="text-base capitalize">
                          {user?.username}
                        </h2>
                        <h2 className="font-semibold">{user?.email}</h2>
                      </div>
                      <Button
                        text="Invite"
                        action={() => shareDoc(user?._id)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="bg-slate-100 h-screen w-full flex flex-col gap-4 items-center">
        <div className="bg-white w-full px-4 py-2 flex items-center justify-between gap-4">
          <div className=" flex items-center gap-4">
            <FcDocument className="text-5xl" />
            <Input
              placeholder={"Title"}
              action={(e) => setData({ ...data, title: e.target.value })}
              value={data?.title}
            />
          </div>

          <div className="flex gap-4">
            <Button text="Delete" />
            {DataChanged && (
              <Button action={() => save()} text="Save" loading={loading} />
            )}
            <Button action={() => setPopup(true)} text="Share" />
          </div>
        </div>

        <div className="flex px-10  h-screen w-full gap-40">
          <div className="w-[60%] h-[80%] bg-white">
            <textarea
              className="w-full h-full p-4 text-4xl"
              placeholder="Type here..."
              onChange={handleContentChange}
              value={data?.content}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Connected Users</h2>
            <div className="flex flex-col gap-2">
              {connectedUsers?.map((user) => (
                <div
                  key={user}
                  className="bg-slate-200 p-1 rounded-sm  text-2xl"
                >
                  {user?.email}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default page;
