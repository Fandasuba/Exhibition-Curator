"use client";
// Need to fix the get request on this page to refresh the user so they can see their curated exhibits actual refresh when they add stuff.
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

export interface SavedItem {
    edmPreview: string;
    title: string; 
    description: string;
    source: string;
    provider: string;
    author: string;
}

export interface ExhibitionItem {
    id: string,
    name: string,
    saveditems?: SavedItem[]
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
  const [update, setExhibitUpdate] = useState<boolean>(false);
  
  const updateExhibits = async () => {
    if (!isLoggedIn || !user) return;

    try {
      const response = await fetch(`/api/exhibits?userId=${user.id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exhibitions');
      }

      const data: ExhibitionItem[] = await response.json();
      
      setExhibitions(data);
      
      console.log('Exhibitions updated:', data);
    } catch (error) {
      console.error("Error fetching exhibits belonging to user:", error);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user && !loading) {
      updateExhibits();
    }
  }, [isLoggedIn, user, loading]);

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
    setLoginError("");
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
      // Note: updateExhibits will be called by the useEffect when isLoggedIn changes
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
      const response = await fetch('/api/exhibits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          name: newExhibitionTitle,
        }),
      });

      const data: ExhibitionItem = await response.json();

      if (!response.ok) {
        throw new Error(data as unknown as string || 'Failed to add exhibition');
      }
      await updateExhibits();
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
    
  // Purge the unwated historical artefact.
  const patchSavedItem = async (exhibition: ExhibitionItem,index: number): Promise<void> => {
    setExhibitUpdate(true)
    try {
      const updatedSavedItems = exhibition.saveditems?.filter((_, i) => i !== index);

      if (!updatedSavedItems) {
        throw new Error("No saved items to update.");
      }
      const response = await fetch(`/api/exhibits/?exhibitId=${exhibition.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ saveditems: updatedSavedItems }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update exhibit: ${response.statusText}`);
      }

      console.log("Exhibit updated successfully.");
      updateExhibits()
      setExhibitUpdate(false)
    } catch (error) {
      console.error("Error updating exhibit:", (error as Error).message);
    }
  };

  // purge the unwanted exhibit.
  const deleteExhibit = async (id: string) => {
    setExhibitUpdate(true)
    try {
      const response = await fetch (`/api/exhibits?exhibitId=${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      })
       if (!response.ok) {
        throw new Error(`Failed to update exhibit: ${response.statusText}`);
      }
      console.log("Exhibit deleted successfully.");
      updateExhibits()
      setExhibitUpdate(false)
      
    } catch (error){
      console.error("Error deleting Exhibit:", error)
    }
  }

  return (
    <main className="p-8 max-w-6xl mx-auto bg-gray-900 min-h-screen">
      <h1 className="text-3xl mb-6 text-blue-400 font-bold drop-shadow-sm">Welcome to Exhibition Curator</h1>

      {/* User Welcome Section with Logout */}
      {isLoggedIn && (
        <div className="mb-6 p-4 bg-green-900 border border-green-600 rounded-lg flex justify-between items-center">
          <p className="text-green-300">
            Welcome back, <strong className="text-green-200">{user?.username}</strong>!
          </p>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded border border-red-500 hover:border-red-400 transition-all duration-200 font-medium"
          >
            Logout
          </button>
        </div>
      )}

      {/* Auth section - Only show when not logged in */}
      {!isLoggedIn && (
        <section className="mb-6 p-4 bg-gray-800 border border-gray-600 rounded-lg">
          <h2 className="text-xl mb-4 text-blue-400 font-semibold">Authentication</h2>
          <div className="space-x-3">
            <button
              onClick={() => setShowLoginModal(true)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded border border-blue-500 hover:border-blue-400 transition-all duration-200 font-medium"
            >
              Login
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded border border-gray-500 hover:border-gray-400 transition-all duration-200 font-medium"
            >
              Create Account
            </button>
          </div>
        </section>
      )}

      {/* Navigate to Find Artefacts page */}
      <section className="mb-8">
        <Link href="/artefacts">
          <button className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded border border-green-500 hover:border-green-400 transition-all duration-200 font-medium text-lg shadow-md">
            🔍 Find Artefacts
          </button>
        </Link>
      </section>

      {/* Exhibitions Section - Only show when logged in */}
      {isLoggedIn && (
        <>
          {/* Exhibition List Section */}
          <section className="mb-8 p-6 bg-gray-800 border-2 border-gray-600 rounded-lg">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-600">
              <h2 className="text-2xl font-bold text-blue-400">Your Exhibitions</h2>
              <button
                onClick={() => setShowExhibitionModal(true)}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded border border-blue-500 hover:border-blue-400 transition-all duration-200 font-medium"
              >
                ✨ Create Exhibition
              </button>
            </div>
            
            {exhibitions.length === 0 ? (
              <div className="p-8 bg-gray-700 border border-gray-600 rounded-lg text-center">
                <p className="text-gray-300 text-lg">You haven&apos;t created any exhibitions yet.</p>
                <p className="text-sm text-gray-400 mt-2">Click &quot;Create Exhibition&quot; to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {exhibitions.map((exhibition) => (
                  <div 
                    key={exhibition.id}
                    onClick={() => handleExhibitionClick(exhibition.id)}
                    className="border-2 border-gray-600 rounded-lg p-4 cursor-pointer hover:shadow-lg bg-gray-700 hover:bg-gray-650 hover:border-blue-500 transition-all duration-300 group flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-lg text-blue-400 group-hover:text-blue-300 transition-colors">
                        {exhibition.name}
                      </h3>
                      <p className="text-sm text-gray-400 mt-1">
                        <span className="text-blue-400 font-medium">{exhibition.saveditems?.length || 0}</span> items • 
                        Click to <span className="text-blue-400">{selectedExhibition === exhibition.id ? 'hide' : 'view'}</span>
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {update && (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteExhibit(exhibition.id);
                        }}
                        className="px-3 py-1 text-sm text-white bg-red-600 hover:bg-red-500 rounded border border-red-500 hover:border-red-400 transition-all duration-200 font-medium"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Exhibition Items Display Section - Conditionally rendered */}
          {selectedExhibition && (
            <section className="mb-8 p-6 bg-gray-750 border-2 border-blue-500 rounded-lg">
              <div className="mb-6">
                <h3 className="text-xl font-bold text-blue-400 mb-2">
                  {exhibitions.find(ex => ex.id === selectedExhibition)?.name}
                </h3>
                <p className="text-gray-400">Exhibition Items</p>
              </div>
              
              {(() => {
                const exhibition = exhibitions.find(ex => ex.id === selectedExhibition);
                if (!exhibition?.saveditems || exhibition.saveditems.length === 0) {
                  return (
                    <div className="p-8 bg-gray-700 border border-gray-600 rounded-lg text-center">
                      <p className="text-gray-400 italic">No items in this exhibition yet.</p>
                      <p className="text-sm text-gray-500 mt-2">Add some artefacts to get started!</p>
                    </div>
                  );
                }
                
                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {exhibition.saveditems.map((item, index) => (
                      <div key={`${exhibition.id}-${index}`} className="relative">
                        <div className="w-full max-w-sm mx-auto">
                          <Card
                            title={item.title}
                            description={item?.description}
                            author={item?.author}
                            provider={item?.provider}
                            source={item?.source}
                            image={item?.edmPreview}
                          />
                        </div>
                        <button
                          onClick={() => patchSavedItem(exhibition, index)}
                          className="mt-3 w-full px-3 py-2 text-sm text-white bg-red-600 hover:bg-red-500 rounded border border-red-500 hover:border-red-400 transition-all duration-200 font-medium"
                        >
                          🗑️ Remove Item
                        </button>
                        {update && (
                          <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center rounded">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </section>
          )}
        </>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-sm w-full shadow-2xl border-2 border-gray-600">
            <h3 className="text-2xl font-bold mb-6 text-blue-400 border-b border-gray-600 pb-3">Login</h3>

            {loginError && (
              <div className="mb-4 p-3 bg-red-900 border border-red-600 text-red-300 rounded">
                {loginError}
              </div>
            )}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={loginFormData.username}
              onChange={handleLoginChange}
              className="border border-gray-600 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginFormData.password}
              onChange={handleLoginChange}
              className="border border-gray-600 rounded p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowLoginModal(false);
                  setLoginError("");
                  setLoginFormData({ username: "", password: "" });
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded border border-gray-500 hover:border-gray-400 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded border border-blue-500 hover:border-blue-400 font-medium transition-all duration-200"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Account Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg max-w-sm w-full shadow-2xl border-2 border-gray-600">
            <h3 className="text-2xl font-bold mb-6 text-blue-400 border-b border-gray-600 pb-3">
              Create Account
            </h3>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={createFormData.username}
              onChange={handleCreateChange}
              className="border border-gray-600 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={createFormData.email}
              onChange={handleCreateChange}
              className="border border-gray-600 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={createFormData.password}
              onChange={handleCreateChange}
              className="border border-gray-600 rounded p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateFormData({ username: "", email: "", password: "" });
                }}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded border border-gray-500 hover:border-gray-400 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded border border-blue-500 hover:border-blue-400 font-medium transition-all duration-200"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exhibition Creation Modal */}
      {showExhibitionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-2xl max-w-sm w-full border-2 border-gray-600">
            <h2 className="text-xl font-bold mb-6 text-blue-400 border-b border-gray-600 pb-3">Create New Exhibition</h2>
            <input
              type="text"
              value={newExhibitionTitle}
              onChange={(e) => setNewExhibitionTitle(e.target.value)}
              placeholder="Enter exhibition title"
              className="border border-gray-600 p-3 w-full rounded mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-gray-300 placeholder-gray-400 transition-colors"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowExhibitionModal(false)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-300 rounded border border-gray-500 hover:border-gray-400 font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExhibition}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded border border-blue-500 hover:border-blue-400 font-medium transition-all duration-200"
                disabled={exhibitionLoading}
              >
                {exhibitionLoading ? 'Creating...' : '✨ Create'}
              </button>
            </div>
            {exhibitionMessage && (
              <p className="text-red-300 mt-3 p-2 bg-red-900 border border-red-600 rounded text-sm">
                {exhibitionMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </main>
  );
}