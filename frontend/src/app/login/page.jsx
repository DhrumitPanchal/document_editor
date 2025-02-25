"use client";
import React, { useState } from "react";
import Input from "../components/Input";
import Button from "../components/Button";
import { useRouter } from "next/navigation";
import { Axios } from "../axios";
import { toast } from "sonner";

function Page() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const login = async () => {
    try {
      setLoading(true);
      const response = await Axios.post("/auth/login", { ...data });
      setLoading(false);
      console.log(response);
      toast.success("login successfully");
      localStorage &&
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
        <h1 className="text-3xl font-bold ">Login</h1>

        <div className="mt-4 mb-10 w-full flex flex-col gap-4">
          <Input
            placeholder={"Email"}
            action={(e) => setData({ ...data, email: e.target.value })}
            type="email"
            value={data.email}
          />
          <Input
            placeholder={"Password"}
            type="password"
            action={(e) => setData({ ...data, password: e.target.value })}
            value={data.password}
          />
          <h2>
            If You don't have account{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-blue-500 underline cursor-pointer"
            >
              Register
            </span>
          </h2>
        </div>

        <Button action={() => login()} loading={loading} text="Login" />
      </div>
    </section>
  );
}

export default Page;
