"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "./user-context";
import Card from "./components/itemCards";

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

interface ExhibitionItem {
  id: string;
  title: string;
  description?: string;
  author?: string;
  provider?: string;
  edmPreview?: string;
  source?: string;
  saved_items?: ExhibitionItem[];
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

  // Exhibition states
  const [exhibitions, setExhibitions] = useState<ExhibitionItem[]>([]);
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  const [showExhibitionModal, setShowExhibitionModal] = useState<boolean>(false);
  const [newExhibitionTitle, setNewExhibitionTitle] = useState<string>('');
  const [exhibitionLoading, setExhibitionLoading] = useState<boolean>(false);
  const [exhibitionMessage, setExhibitionMessage] = useState<string>('');

  // Fetch exhibitions when user logs in
  useEffect(() => {
    const fetchExhibitions = async () => {
      if (!isLoggedIn || !user) return;

      try {
        const response = await fetch(`/api/exhibits?userId=${user.id}`);
        const data: ExhibitionItem[] = await response.json();
        setExhibitions(data);
      } catch (error) {
        console.error('Error fetching exhibitions:', error);
      }
    };

    fetchExhibitions();
  }, [isLoggedIn, user]);

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
    // Clear exhibition data on logout
    setExhibitions([]);
    setSelectedExhibition(null);
  };

  // Exhibition handlers
  const handleAddExhibition = async () => {
    if (!isLoggedIn || !user || !newExhibitionTitle) {
      setExhibitionMessage('Please provide a title and be logged in.');
      return;
    }

    setExhibitionLoading(true);
    setExhibitionMessage('');

    try {
      const response = await fetch('/api/exhibitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: newExhibitionTitle,
        }),
      });

      const data: ExhibitionItem = await response.json();

      if (!response.ok) {
        throw new Error(data as unknown as string || 'Failed to add exhibition');
      }

      setExhibitions((prev) => [...prev, data]);
      setNewExhibitionTitle('');
      setShowExhibitionModal(false);
    } catch (error) {
      setExhibitionMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setExhibitionLoading(false);
    }
  };

  const handleExhibitionClick = (exhibitionId: string) => {
    setSelectedExhibition(selectedExhibition === exhibitionId ? null : exhibitionId);
  };

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
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
      <section className="mb-6">
        <Link href="/artefacts">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Find Artefacts
          </button>
        </Link>
      </section>

      {/* Exhibitions Section - Only show when logged in */}
      {isLoggedIn && (
        <section className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Your Exhibitions</h2>
            <button
              onClick={() => setShowExhibitionModal(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Create Exhibition
            </button>
          </div>
          
          {exhibitions.length === 0 ? (
            <div className="p-6 bg-gray-100 rounded-lg text-center">
              <p className="text-gray-600">You haven&apos;t created any exhibitions yet.</p>
              <p className="text-sm text-gray-500 mt-2">Click &quot;Create Exhibition&quot; to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {exhibitions.map((exhibition) => (
                <div key={exhibition.id}>
                  <div 
                    onClick={() => handleExhibitionClick(exhibition.id)}
                    className="border rounded p-4 cursor-pointer hover:shadow-md bg-blue-50 hover:bg-blue-100"
                  >
                    <h3 className="font-bold text-lg">{exhibition.title}</h3>
                    <p className="text-sm text-gray-600">
                      {exhibition.saved_items?.length || 0} items • Click to {selectedExhibition === exhibition.id ? 'hide' : 'view'}
                    </p>
                  </div>
                  {selectedExhibition === exhibition.id && exhibition.saved_items && exhibition.saved_items.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 border-l-4 border-blue-500 pl-4">
                      {exhibition.saved_items.map((item, index) => (
                        <Card
                          key={`${exhibition.id}-${index}`}
                          title={item.title}
                          description={item.description}
                          author={item.author}
                          provider={item.provider}
                          source={item.source}
                          image={item.edmPreview}
                        />
                      ))}
                    </div>
                  )}
                  {selectedExhibition === exhibition.id && (!exhibition.saved_items || exhibition.saved_items.length === 0) && (
                    <div className="mt-4 p-4 bg-gray-100 rounded border-l-4 border-blue-500">
                      <p className="text-gray-600 italic">No items in this exhibition yet.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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

      {/* Exhibition Creation Modal */}
      {showExhibitionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4">Create New Exhibition</h2>
            <input
              type="text"
              value={newExhibitionTitle}
              onChange={(e) => setNewExhibitionTitle(e.target.value)}
              placeholder="Enter exhibition title"
              className="border p-2 w-full rounded mb-4"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowExhibitionModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExhibition}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                disabled={exhibitionLoading}
              >
                {exhibitionLoading ? 'Creating...' : 'Create'}
              </button>
            </div>
            {exhibitionMessage && <p className="text-red-500 mt-2">{exhibitionMessage}</p>}
          </div>
        </div>
      )}
    </main>
  );
}