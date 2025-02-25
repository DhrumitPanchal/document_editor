"use client";
import DocCard from "./components/DocCard";
import { FaPlus } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Input from "./components/Input";
import Button from "./components/Button";
import { Axios } from "./axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
  const [popup, setPopup] = useState(false);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();

  const router = useRouter();

  const newDoc = async () => {
    try {
      setLoading(true);
      const response = await Axios.put("/doc/create", { title });
      setLoading(false);
      router.push(`/document/${response?.data?._id}`);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  const fetchAllDoc = async () => {
    try {
      setLoading(true);
      const response = await Axios.get("/doc/all");
      setLoading(false);
      console.log(response?.data);
      setData(response?.data);
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };

  useEffect(() => {
    fetchAllDoc();
  }, []);
  return (
    <>
      {popup && (
        <div className="flex justify-center items-center fixed top-0 left-0 w-full h-screen z-20 bg-black/10 backdrop-blur-[2px]">
          <div className="bg-white w-[26%] p-4 rounded-md">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibolds text-ellipsis">New Document</h2>
              <div
                onClick={() => setPopup(false)}
                className="flex justify-center items-center cursor-pointer h-6 w-6 bg-slate-200 rounded-sm"
              >
                <FaPlus className="rotate-[45deg]" />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-10">
              <Input
                type="text"
                placeholder={"Title"}
                value={title}
                action={(e) => setTitle(e.target.value)}
              />
              <Button action={() => newDoc()} text="Create" loading={loading} />
            </div>
          </div>
        </div>
      )}
      <section className="px-8 py-4">
        <div className="flex flex-wrap gap-6">
          <div
            onClick={() => setPopup(true)}
            className="cursor-pointer border-[1px] border-black/50 flex  flex-col"
          >
            <div className="flex justify-center items-center h-40 w-36 text-slate-300 bg-slate-100/80 text-6xl">
              <FaPlus />
            </div>
            <div className="px-2 py-2">
              <h2 className="text-base capitalize font-semibold">New</h2>
              <h2 className="text-xs font-light">Blank document</h2>
            </div>
          </div>
          {data?.map((item, index) => (
            <DocCard
              action={() => router.push(`/document/${item?._id}`)}
              key={index}
              data={item}
            />
          ))}
        </div>
      </section>
    </>
  );
}
