"use client";

import { useState } from "react";
import Link from 'next/link';

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateAccount = async () => {
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to create account");
      alert("Account created successfully!");
      setShowModal(false);
      setFormData({ username: "", email: "", password: "" });
    } catch (error) {
      console.error(error)
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-3xl mb-6">Welcome to Exhibition Curator</h1>

      {/* Login form placeholder */}
      <section className="mb-6">
        <h2 className="text-xl mb-2">Login</h2>
        {/* Add your login form here */}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Create Account
        </button>
      </section>

      {/* Navigate to Find Artefacts page */}
      <section>
        <Link href="/artefacts">
            <button
                className="px-4 py-2 bg-green-600 text-white rounded"
            >
                Find Artefacts
            </button>
        </Link>
       </section>

      {/* Modal for create account */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-sm w-full">
            <h3 className="text-xl mb-4">Create Account</h3>

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border p-2 mb-3 w-full"
            />

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                className="px-4 py-2 bg-blue-600 text-white rounded"
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