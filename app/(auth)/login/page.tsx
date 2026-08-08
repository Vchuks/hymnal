"use client";

import { login } from "@/lib/queries";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutateAsync, isPending, isError, error } = login();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      return;
    }

    try {
      await mutateAsync({ username, password });
    } catch (error) {
      throw error;
    }
  };

  const [passwordType, setPasswordType] = useState("password");
  const handlePassword = () => {
    return passwordType === "password"
      ? setPasswordType("text")
      : setPasswordType("password");
  };
  return (
    <div className="bg-gray-800/10 h-screen pt-24 lg:pt-16">
      <div className="w-11/12 lg:w-2/4 px-4 py-5 bg-white font-inter rounded-2xl m-auto">
        <h2 className="w-fit font-inter m-auto pt-2 pb-1 bg-clip-text text-transparent bg-gradient-to-br from-[#222057] to-[#F8991D] to-80% font-[900] text-xl text-center animate-pulse">
          Sing Praises -<span className="text-2xl"> To the Lord!</span>
        </h2>
        <p className="text-center text-sm opacity-80">Login to your account</p>

        <form
          className="flex flex-col gap-2 pt-3 md:p-10"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col my-2 transform hover:scale-105 transition-transform duration-200">
            <label htmlFor="username" className="font-medium text-sm pb-2">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border border-[#22205747] rounded-lg px-6 py-3 transition-all duration-300"
            />
          </div>

          <div className="flex flex-col relative transform hover:scale-105 transition-transform duration-200">
            <label htmlFor="password" className="font-medium text-sm pb-2">
              Password
            </label>
            <input
              type={passwordType}
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              className="border border-[#22205747] rounded-lg px-6 py-3 transition-all duration-300"
            />
            <div
              className="absolute top-10 right-4 cursor-pointer hover:scale-110 transition-transform duration-200"
              onClick={handlePassword}
            >
              {passwordType === "password" ? (
                <EyeOffIcon className="w-4 text-gray-500 hover:text-[#8a6f2e]" />
              ) : (
                <EyeIcon className="w-4 text-gray-500 hover:text-[#8a6f2e]" />
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <button
              className={`
                bg-gradient-to-br from-[#222057] from-5% mt-8 to-[#F8991D] to-90% 
                w-full text-white font-medium py-3 rounded-lg hover:opacity-90 
                transform hover:scale-105 hover:shadow-lg transition-all duration-300
                ${
                  isPending
                    ? "cursor-not-allowed opacity-50 animate-pulse"
                    : "cursor-pointer"
                }
              `}
              style={{ background: "var(--gold-dark)" }}
              disabled={isPending}
            >
              {isPending ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Continue"
              )}
            </button>
          </div>
          <a href="/hymns" className="pt-2 text-center">
            Switch to normal user?
          </a>
          {isError && (
            <div className="p-2 mt-1 w-full bg-red-100 border border-red-300 text-red-700 rounded animate-shake">
              {error.message}
              {/* <button
                // onClick={clearError}
                className="float-right text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-200"
              >
                ×
              </button> */}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
