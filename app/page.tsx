"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "./user-context";

interface CreateFormData {
  username: string;
  email: string;
  password: string;
}

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginResult {
  success: boolean;
  error?: string;
}

export default function Home() {
  const { user, login, logout, isLoggedIn, loading } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [createFormData, setCreateFormData] = useState<CreateFormData>({
    username: "",
    email: "",
    password: "",
  });

  const [loginFormData, setLoginFormData] = useState<LoginFormData>({
    username: "",
    password: "",
  });

  const [loginError, setLoginError] = useState<string>("");

  // Typed event handlers for input change events
  const handleCreateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { name, value } = e.target;
    setLoginFormData((prev) => ({ ...prev, [name]: value }));
    setLoginError(""); // Clear error when user types
  };

  const handleCreateAccount = async (): Promise<void> => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createFormData),
      });
      if (!res.ok) throw new Error("Failed to create account");
      alert("Account created successfully!");
      setShowCreateModal(false);
      setCreateFormData({ username: "", email: "", password: "" });
    } catch (error) {
      console.error(error);
      alert("Failed to create account. Please try again.");
    }
  };

  const handleLogin = async (): Promise<void> => {
    const result: LoginResult = await login(
      loginFormData.username,
      loginFormData.password
    );

    if (result.success) {
      setShowLoginModal(false);
      setLoginFormData({ username: "", password: "" });
      setLoginError("");
    } else {
      setLoginError(result.error || "Unknown login error");
    }
  };

  const handleLogout = (): void => {
    logout();
  };

  if (loading) {
    return (
      <main className="p-8 max-w-md mx-auto">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl mb-6">Welcome to Exhibition Curator</h1>

      {isLoggedIn && (
        <div className="mb-6 p-4 bg-green-100 rounded-lg">
          <p className="text-green-800">
            Welcome back, <strong>{user?.username}</strong>!
          </p>
        </div>
      )}

      {/* Auth section */}
      <section className="mb-6">
        {!isLoggedIn ? (
          <>
            <h2 className="text-xl mb-2">Authentication</h2>
            <div className="space-x-2">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Login
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Create Account
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </section>

      {/* Navigate to Find Artefacts page */}
      <section>
        <Link href="/artefacts">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Find Artefacts
          </button>
        </Link>
      </section>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Login</h3>

            {loginError && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {loginError}
              </div>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginFormData.username}
              onChange={handleLoginChange}
              className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginFormData.password}
              onChange={handleLoginChange}
              className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                  setLoginFormData({ username: "", password: "" });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full shadow-lg">
            <h3 className="text-2xl font-bold mb-4 text-gray-800">
              Create Account
            </h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={createFormData.username}
              onChange={handleCreateChange}
              className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={createFormData.email}
              onChange={handleCreateChange}
              className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={createFormData.password}
              onChange={handleCreateChange}
              className="border border-gray-300 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateFormData({ username: "", email: "", password: "" });
                }}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
