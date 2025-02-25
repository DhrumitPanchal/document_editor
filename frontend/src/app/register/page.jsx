"use client";
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { Axios } from "../axios";
import { toast } from "sonner";

function Page() {
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const router = useRouter();
  const register = async () => {
    try {
      setLoading(true);
      const response = await Axios.post("/auth/register", { ...data });
      setLoading(false);
      console.log(response);
      toast.success("register successfully");
      localStorage.setItem("accessToken", response?.data?.token);
      router.push("/");
    } catch (error) {
      setLoading(false);
      console.log(error);
      toast.error(error?.response?.data?.msg);
    }
  };
  return (
    <section className="h-screen w-full flex flex-col gap-4 items-center justify-center bg-slate-100">
      <div className="bg-white w-[28%] p-6 rounded-md flex flex-col gap-4">
        <h1 className="text-3xl font-bold ">Register</h1>

        <div className="mt-4 mb-10 w-full flex flex-col gap-4">
          <Input
            placeholder={"Name"}
            action={(e) => setData({ ...data, name: e.target.value })}
            value={data.name}
          />
          <Input
            placeholder={"Email"}
            type={"email"}
            action={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
          <Input
            placeholder={"Password"}
            type="password"
            action={(e) => setData({ ...data, password: e.target.value })}
            value={data.password}
          />
          <h2>
            If You already have account{" "}
            <span
              onClick={() => router.push("/login")}
              className="text-blue-500 underline cursor-pointer"
            >
              Login
            </span>
          </h2>
        </div>

        <Button action={() => register()} text="Register" loading={loading} />
      </div>
    </section>
  );
}

export default Page;
