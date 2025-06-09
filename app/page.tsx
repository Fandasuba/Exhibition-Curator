"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useUser } from "./user-context";
import Card from "./components/itemCards";
import Pagination from "./components/pagination";
import { sortItems } from "./utils/sort";

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

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
}

type SortOption = 'name-asc' | 'name-desc' | 'date-asc' | 'date-desc' | 'items-asc' | 'items-desc';
type ItemSortOption = 'title-asc' | 'title-desc' | 'author-asc' | 'author-desc' | 'provider-asc' | 'provider-desc';

export default function Home() {
  const { user, login, logout, isLoggedIn, loading } = useUser();
  
  // Auth states
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

  // Exhibition list states
  const [exhibitions, setExhibitions] = useState<ExhibitionItem[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 10,
  });
  const [exhibitionSort, setExhibitionSort] = useState<SortOption>('date-desc');

  // Exhibition modal states
  const [showExhibitionModal, setShowExhibitionModal] = useState<boolean>(false);
  const [newExhibitionTitle, setNewExhibitionTitle] = useState<string>('');
  const [exhibitionLoading, setExhibitionLoading] = useState<boolean>(false);
  const [exhibitionMessage, setExhibitionMessage] = useState<string>('');

  // Exhibition items states
  const [selectedExhibition, setSelectedExhibition] = useState<string | null>(null);
  const [exhibitionItems, setExhibitionItems] = useState<{[key: string]: SavedItem[]}>({});
  const [itemsPagination, setItemsPagination] = useState<{[key: string]: PaginationState}>({});
  const [itemsSort, setItemsSort] = useState<{[key: string]: ItemSortOption}>({});
  
  // Loading states
  const [update, setExhibitUpdate] = useState<boolean>(false);
  const [itemsLoading, setItemsLoading] = useState<{[key: string]: boolean}>({});
  const [exhibitionsLoading, setExhibitionsLoading] = useState<boolean>(false);

  // Modal refs for keyboard navigation
  const loginModalRef = useRef<HTMLDivElement>(null);
  const createModalRef = useRef<HTMLDivElement>(null);
  const exhibitionModalRef = useRef<HTMLDivElement>(null);
  const loginFirstInputRef = useRef<HTMLInputElement>(null);
  const createFirstInputRef = useRef<HTMLInputElement>(null);
  const exhibitionInputRef = useRef<HTMLInputElement>(null);

  // Sort option labels
  const exhibitionSortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' },
    { value: 'items-desc', label: 'Most Items' },
    { value: 'items-asc', label: 'Fewest Items' }
  ];

  const itemSortOptions = [
    { value: 'title-asc', label: 'Title A-Z' },
    { value: 'title-desc', label: 'Title Z-A' },
    { value: 'author-asc', label: 'Author A-Z' },
    { value: 'author-desc', label: 'Author Z-A' },
    { value: 'provider-asc', label: 'Provider A-Z' },
    { value: 'provider-desc', label: 'Provider Z-A' }
  ];

  // Login Modal keyboard navigation
  useEffect(() => {
    if (showLoginModal) {
      setTimeout(() => {
        if (loginFirstInputRef.current) {
          loginFirstInputRef.current.focus();
        }
      }, 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseLoginModal();
        }
      };

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = loginModalRef.current?.querySelectorAll(
            'button, input, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [showLoginModal]);

  // Create Account Modal keyboard navigation
  useEffect(() => {
    if (showCreateModal) {
      setTimeout(() => {
        if (createFirstInputRef.current) {
          createFirstInputRef.current.focus();
        }
      }, 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseCreateModal();
        }
      };

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = createModalRef.current?.querySelectorAll(
            'button, input, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [showCreateModal]);

  // Exhibition Modal keyboard navigation
  useEffect(() => {
    if (showExhibitionModal) {
      setTimeout(() => {
        if (exhibitionInputRef.current) {
          exhibitionInputRef.current.focus();
        }
      }, 100);

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCloseExhibitionModal();
        }
      };

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          const focusableElements = exhibitionModalRef.current?.querySelectorAll(
            'button, input, [tabindex]:not([tabindex="-1"])'
          );
          
          if (focusableElements && focusableElements.length > 0) {
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleTabKey);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = 'unset';
      };
    }
  }, [showExhibitionModal]);

  
  const getRandomPreviewImage = (exhibition: ExhibitionItem): string | null => {
    if (!exhibition.saveditems || exhibition.saveditems.length === 0) {
      return null;
    }

    const itemsWithImages = [];
    
    for (const item of exhibition.saveditems) {
      if (item.edmPreview && 
          item.edmPreview.toString().trim().length > 0) {
        const preview = item.edmPreview.toString().trim();
        itemsWithImages.push(preview);
      } else {
      }
    }
    if (itemsWithImages.length === 0) {
      return null;
    }
    
    const randomIndex = Math.floor(Math.random() * itemsWithImages.length);
    const selectedPreview = itemsWithImages[randomIndex];
    return selectedPreview;
  };

  // Keyboard handling
  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>): void => {
    if (e.key === "Enter") {
      if (showLoginModal) {
        handleLogin();
      } else if (showCreateModal) {
        handleCreateAccount();
      } else if (showExhibitionModal) {
        handleAddExhibition();
      }
    } else if (e.key === "Escape") {
      setShowLoginModal(false);
      setShowCreateModal(false);
      setShowExhibitionModal(false);
    }
  };

  const updateExhibits = async () => {
    if (!isLoggedIn || !user || exhibitionsLoading) return;

    setExhibitionsLoading(true);
    try {
      const url = `/api/exhibits?userId=${user.id}&page=${pagination.currentPage}&pageSize=${pagination.pageSize}&sortBy=${exhibitionSort}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exhibitions');
      }

      const result = await response.json();
      
      setExhibitions(result.data);
      setPagination(prev => ({
        ...prev,
        totalPages: result.pagination.totalPages,
        totalItems: result.pagination.totalItems,
        currentPage: result.pagination.currentPage
      }));
      
    } catch (error) {
      console.error("Error fetching exhibits:", error);
      setExhibitionMessage("Failed to load exhibitions. Please try again.");
    } finally {
      setExhibitionsLoading(false);
    }
  };

  const fetchExhibitionItems = async (
    exhibitionId: string, 
    page?: number, 
    pageSize?: number, 
    sortBy?: ItemSortOption
  ) => {
    if (!user || itemsLoading[exhibitionId]) return;
    
    const currentPagination = itemsPagination[exhibitionId] || { 
      currentPage: 1, 
      pageSize: 8, 
      totalPages: 1, 
      totalItems: 0 
    };
    
    const finalPage = page ?? currentPagination.currentPage;
    const finalPageSize = pageSize ?? currentPagination.pageSize;
    const finalSortBy = sortBy ?? itemsSort[exhibitionId] ?? 'title-asc';
    
    setItemsLoading(prev => ({ ...prev, [exhibitionId]: true }));
    
    try {
      const url = `/api/exhibits?userId=${user.id}&exhibitionId=${exhibitionId}&itemsPage=${finalPage}&itemsPageSize=${finalPageSize}&itemsSortBy=${finalSortBy}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch exhibition items: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
    
      setExhibitionItems(prev => ({
        ...prev,
        [exhibitionId]: result.data
      }));
      
      setItemsPagination(prev => ({
        ...prev,
        [exhibitionId]: {
          currentPage: result.pagination.currentPage,
          pageSize: result.pagination.pageSize,
          totalPages: result.pagination.totalPages,
          totalItems: result.pagination.totalItems
        }
      }));
      
    } catch (error) {
      console.error("Error fetching exhibition items:", error);
      setExhibitionMessage(`Failed to load items: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setTimeout(() => setExhibitionMessage(''), 5000);
    } finally {
      setItemsLoading(prev => ({ ...prev, [exhibitionId]: false }));
    }
  };
  useEffect(() => {
    if (isLoggedIn && user && !loading && !exhibitionsLoading) {
      updateExhibits();
    }
  }, [isLoggedIn, user, loading, pagination.currentPage, pagination.pageSize, exhibitionSort]);

  // Exhibition pagination handlers
  const handlePageChange = useCallback((page: number): void => {
    if (exhibitionsLoading) return;
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, [exhibitionsLoading]);

  const handlePageSizeChange = useCallback((size: number): void => {
    if (exhibitionsLoading) return;
    setPagination(prev => ({ ...prev, pageSize: size, currentPage: 1 }));
  }, [exhibitionsLoading]);

  const handleExhibitionSortChange = useCallback((sortBy: SortOption) => {
    if (exhibitionsLoading) return;
    setExhibitionSort(sortBy);
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  }, [exhibitionsLoading]);

 const handleItemsPageChange = async (exhibitionId: string, page: number): Promise<void> => {
  setItemsPagination(prev => ({
    ...prev,
    [exhibitionId]: {
      ...prev[exhibitionId],
      currentPage: page
    }
  }));
};

  const handleItemsPageSizeChange = async (exhibitionId: string, size: number): Promise<void> => {
    if (itemsLoading[exhibitionId]) return;
    
    setItemsPagination(prev => ({
      ...prev,
      [exhibitionId]: {
        ...prev[exhibitionId],
        currentPage: 1,
        pageSize: size
      }
    }));

    await fetchExhibitionItems(exhibitionId, 1, size);
  };

  const handleItemsSortChange = async (exhibitionId: string, sortBy: ItemSortOption): Promise<void> => {
    if (itemsLoading[exhibitionId]) return;
    setItemsSort(prev => ({
      ...prev,
      [exhibitionId]: sortBy
    }));
    
    setItemsPagination(prev => ({
      ...prev,
      [exhibitionId]: {
        ...prev[exhibitionId],
        currentPage: 1
      }
    }));

    await fetchExhibitionItems(exhibitionId, 1, undefined, sortBy);
  };

  // Exhibition click handler
  const handleExhibitionClick = async (exhibitionId: string) => {
  const wasSelected = selectedExhibition === exhibitionId;
  setSelectedExhibition(wasSelected ? null : exhibitionId);
  
  if (!wasSelected) {
    const exhibition = exhibitions.find(ex => ex.id === exhibitionId);
    if (exhibition && exhibition.saveditems) {
      setExhibitionItems(prev => ({
        ...prev,
        [exhibitionId]: exhibition.saveditems || []
      }));
      setItemsPagination(prev => ({
        ...prev,
        [exhibitionId]: {
          currentPage: 1,
          pageSize: 8,
          totalPages: Math.ceil((exhibition.saveditems?.length || 0) / 8),
          totalItems: exhibition.saveditems?.length || 0
        }
      }));
    }
  }
};

  const handleCreateChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCreateFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
    } else {
      setLoginError(result.error || "Unknown login error");
    }
  };

  const handleLogout = (): void => {
    logout();
    setExhibitions([]);
    setSelectedExhibition(null);
    setExhibitionItems({});
    setItemsPagination({});
    setItemsSort({});
    setPagination({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      pageSize: 10,
    });
  };

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

  // Modal close handlers
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
    setLoginError("");
    setLoginFormData({ username: "", password: "" });
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateFormData({ username: "", email: "", password: "" });
  };

  const handleCloseExhibitionModal = () => {
    setShowExhibitionModal(false);
    setNewExhibitionTitle('');
    setExhibitionMessage('');
  };

  const handleBackdropClick = (e: React.MouseEvent, closeHandler: () => void) => {
    if (e.target === e.currentTarget) {
      closeHandler();
    }
  };

  const patchSavedItem = async (exhibitionId: string, itemIndex: number): Promise<void> => {
  setExhibitUpdate(true);
  try {
    const currentItems = exhibitionItems[exhibitionId] || [];
    const itemToDelete = currentItems[itemIndex];
    
    if (!itemToDelete) {
      throw new Error("Item not found for deletion.");
    }

    const exhibition = exhibitions.find(ex => ex.id === exhibitionId);
    if (!exhibition) {
      throw new Error("Exhibition not found.");
    }

    const allItems = exhibition.saveditems || [];
    const actualItemIndex = allItems.findIndex(item => 
      item.title === itemToDelete.title && 
      item.author === itemToDelete.author &&
      item.source === itemToDelete.source
    );
    
    if (actualItemIndex === -1) {
      throw new Error("Item not found in original data.");
    }

    const updatedSavedItems = allItems.filter((_, i) => i !== actualItemIndex);

    const response = await fetch(`/api/exhibits?exhibitId=${exhibitionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ saveditems: updatedSavedItems }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update exhibit: ${response.statusText}`);
    }

    setExhibitions(prev => 
      prev.map(ex => 
        ex.id === exhibitionId 
          ? { ...ex, saveditems: updatedSavedItems }
          : ex
      )
    );

    if (selectedExhibition === exhibitionId) {
      const currentSort = itemsSort[exhibitionId] || 'title-asc';
      const sortedItems = sortItems(updatedSavedItems, currentSort) as SavedItem[];
      
      setExhibitionItems(prev => ({
        ...prev,
        [exhibitionId]: sortedItems
      }));
      
      setItemsPagination(prev => ({
        ...prev,
        [exhibitionId]: {
          ...prev[exhibitionId],
          totalItems: sortedItems.length,
          totalPages: Math.ceil(sortedItems.length / (prev[exhibitionId]?.pageSize || 8))
        }
      }));
    }
    
  } catch (error) {
    console.error("Error updating exhibit:", (error as Error).message);
  } finally {
    setExhibitUpdate(false);
  }
};

  const deleteExhibit = async (id: string) => {
    setExhibitUpdate(true);
    try {
      const response = await fetch(`/api/exhibits?exhibitId=${id}`, {
        method: "DELETE",
        headers: {"Content-Type": "application/json"},
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete exhibit: ${response.statusText}`);
      }
      
      await updateExhibits();
    } catch (error) {
      console.error("Error deleting exhibit:", error);
    } finally {
      setExhibitUpdate(false);
    }
  };

  //pagination
const getPaginatedItems = (exhibitionId: string) => {
  const allItems = exhibitionItems[exhibitionId] || [];
  const pagination = itemsPagination[exhibitionId] || {
    currentPage: 1,
    pageSize: 8,
    totalPages: 1,
    totalItems: 0
  };
  const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
  const endIndex = startIndex + pagination.pageSize;
  const paginatedItems = allItems.slice(startIndex, endIndex);
  
  return { items: paginatedItems, pagination };
};

  if (loading) {
    return (
      <main className="p-8 max-w-4xl mx-auto">
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900">
      <main 
        className="p-8 max-w-6xl mx-auto min-h-screen" 
        onKeyDown={handleKeyPress} 
        tabIndex={0}
        role="main"
        aria-label="Exhibition Curator Application"
      >
        <header>
          <h1 className="text-3xl mb-6 text-amber-800 font-bold drop-shadow-sm">Welcome to Exhibition Curator</h1>
        </header>

        {/* User Welcome Section */}
        {isLoggedIn && (
          <section 
            className="mb-6 p-4 bg-white/50 backdrop-blur-sm border border-amber-300 rounded-lg flex justify-between items-center"
            aria-label="User welcome section"
          >
            <p className="text-amber-800">
              Welcome back, <strong className="text-amber-900">{user?.username}</strong>!
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-amber-800 hover:bg-amber-700 text-white rounded border border-red-500 hover:border-red-400 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              aria-label={`Logout from account ${user?.username}`}
            >
              Logout
            </button>
          </section>
        )}

        {/* Auth Section */}
        {!isLoggedIn && (
          <section 
            className="mb-6 p-4 bg-white/50 backdrop-blur-sm border border-amber-300 rounded-lg"
            aria-label="Authentication section"
          >
            <h2 className="text-xl mb-4 text-amber-900 font-semibold">Authentication</h2>
            <div className="space-x-3" role="group" aria-label="Authentication options">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded border border-amber-600 hover:border-amber-500 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Open login form"
              >
                Login
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded border border-amber-600 hover:border-amber-500 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                aria-label="Open account creation form"
              >
                Create Account
              </button>
            </div>
          </section>
        )}

        {/* Navigate to Find Artefacts */}
        <section className="mb-8">
          <Link href="/artefacts">
            <button className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded border border-amber-500 hover:border-amber-400 transition-all duration-200 font-medium text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
              🔍 Find Artefacts
            </button>
          </Link>
        </section>

        {/* Exhibitions Section */}
        {isLoggedIn && (
          <>
            <section 
              className="mb-8 p-6 bg-white/40 backdrop-blur-sm border-2 border-amber-300 rounded-lg"
              aria-label="Your exhibitions"
            >
              <header className="flex justify-between items-center mb-6 pb-4 border-b border-amber-400">
                <h2 className="text-2xl font-bold text-amber-900">Your Exhibitions</h2>
                <button
                  onClick={() => setShowExhibitionModal(true)}
                  disabled={exhibitionsLoading}
                  className="bg-amber-700 hover:bg-amber-600 disabled:bg-stone-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded border border-amber-600 hover:border-amber-500 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  aria-label="Create a new exhibition"
                  aria-disabled={exhibitionsLoading}
                >
                  ✨ Create Exhibition
                </button>
              </header>
              
              {exhibitionsLoading ? (
                <div 
                  className="flex justify-center items-center py-12"
                  aria-live="polite" 
                  aria-label="Loading exhibitions"
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700" aria-hidden="true"></div>
                  <span className="ml-3 text-amber-800">Loading exhibitions...</span>
                </div>
              ) : exhibitions.length === 0 ? (
                <div className="p-8 bg-amber-100/50 border border-amber-300 rounded-lg text-center">
                  <p className="text-amber-800 text-lg">You haven&apos;t created any exhibitions yet.</p>
                  <p className="text-sm text-amber-700 mt-2">Click &quot;Create Exhibition&quot; to get started!</p>
                </div>
              ) : (
                <>
                  {/* Sorting Control */}
                  <div className="mb-4 flex justify-between items-center">
                    <div className="flex items-center space-x-3">
                      <label htmlFor="exhibition-sort" className="text-sm text-amber-800 font-medium">
                        Sort by:
                      </label>
                      <select
                        id="exhibition-sort"
                        value={exhibitionSort}
                        onChange={(e) => handleExhibitionSortChange(e.target.value as SortOption)}
                        disabled={exhibitionsLoading}
                        className="bg-white/80 border border-amber-400 text-amber-900 text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Sort exhibitions by"
                      >
                        {exhibitionSortOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Exhibitions List */}
                  <div className="space-y-4" role="list" aria-label="List of your exhibitions">
                    {exhibitions.map((exhibition) => {
                      const previewImage = getRandomPreviewImage(exhibition);
                      const isExpanded = selectedExhibition === exhibition.id;
                      
                      return (
                        <article
                          key={exhibition.id}
                          role="listitem"
                          onClick={() => handleExhibitionClick(exhibition.id)}
                          className="border-2 border-amber-400 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg bg-white/50 hover:bg-white/60 hover:border-amber-500 transition-all duration-300 group focus-within:ring-2 focus-within:ring-amber-500"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleExhibitionClick(exhibition.id);
                            }
                          }}
                          aria-label={`${exhibition.name} exhibition with ${exhibition.saveditems?.length || 0} items. ${isExpanded ? 'Currently expanded' : 'Click to expand'}`}
                        >
                          <div className="flex flex-col sm:flex-row sm:h-32">
                            {/* Image Section */}
                            <div 
                              className="w-full h-48 sm:w-48 sm:h-full flex-shrink-0 relative overflow-hidden"
                              role="img" 
                              aria-label={previewImage ? `Preview image for ${exhibition.name}` : `No preview image available for ${exhibition.name}`}
                            >
                              {previewImage ? (
                                <img
                                  src={previewImage}
                                  alt={`Preview for ${exhibition.name}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.nextElementSibling as HTMLDivElement;
                                    if (fallback) {
                                      fallback.style.display = 'flex';
                                    }
                                  }}
                                />
                              ) : null}
                              <div 
                                className={`absolute inset-0 bg-amber-100 flex items-center justify-center ${previewImage ? 'hidden' : 'flex'}`}
                                style={{ display: previewImage ? 'none' : 'flex' }}
                                aria-hidden={!!previewImage}
                              >
                                <div className="text-center">
                                  <div className="text-3xl text-amber-600 mb-2" aria-hidden="true">🖼️</div>
                                  <p className="text-xs text-amber-700">No Preview</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Content Section */}
                            <div className="flex-1 p-4 flex justify-between items-center">
                              <div className="flex-1">
                                <h3 className="font-bold text-lg text-amber-900 group-hover:text-amber-800 transition-colors mb-1">
                                  {exhibition.name}
                                </h3>
                                <p className="text-sm text-amber-700">
                                  <span className="text-amber-800 font-medium">{exhibition.saveditems?.length || 0}</span> items • 
                                  Click to <span className="text-amber-800">{selectedExhibition === exhibition.id ? 'hide' : 'view'}</span>
                                </p>
                              </div>
                              
                              {/* Action Buttons */}
                              <div className="flex items-center space-x-3 ml-4">
                                {update && (
                                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-700" aria-hidden="true"></div>
                                )}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteExhibit(exhibition.id);
                                  }}
                                  disabled={update}
                                  className="px-3 py-1 text-sm text-white bg-amber-800 hover:bg-amber-700 disabled:bg-stone-500 disabled:cursor-not-allowed rounded border border-amber-700 hover:border-amber-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                  aria-label={`Delete ${exhibition.name} exhibition`}
                                  aria-disabled={update}
                                >
                                  🗑️ Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
              
              {/* Exhibition Pagination */}
              {exhibitions.length > 0 && (
                <div className="mt-6 pt-4 border-t border-amber-400">
                  <div className="flex justify-end items-center mb-4">
                    <span className="text-amber-800 text-sm" aria-live="polite">
                      {pagination.totalItems} total exhibitions
                    </span>
                  </div>
                  
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    pageSize={pagination.pageSize}
                    onPageSizeChange={handlePageSizeChange}
                    pageSizeOptions={[5, 10, 20]}
                    disabled={exhibitionsLoading}
                  />
                </div>
              )}
            </section>

            {/* Exhibition Items Display */}
            {selectedExhibition && (
              <section 
                className="mb-8 p-6 bg-amber-50/80 backdrop-blur-sm border-2 border-amber-400 rounded-lg"
                aria-label="Exhibition items"
                id={`exhibition-content-${selectedExhibition}`}
              >
                <header className="mb-6">
                  <h3 className="text-xl font-bold text-amber-900 mb-2">
                    {exhibitions.find(ex => ex.id === selectedExhibition)?.name}
                  </h3>
                  <p className="text-amber-700">Exhibition Items</p>
                </header>
                
                {(() => {
                  const { items: paginatedItems, pagination } = getPaginatedItems(selectedExhibition);
                  
                  if (pagination.totalItems === 0) {
                    return (
                      <div className="p-8 bg-amber-100/50 border border-amber-300 rounded-lg text-center">
                        <p className="text-amber-800 italic">No items in this exhibition yet.</p>
                        <p className="text-sm text-amber-700 mt-2">Add some artefacts to get started!</p>
                      </div>
                    );
                  }
                  
                  return (
                    <>
                      {/* Items Sorting Control */}
                      <div className="mb-4 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <label htmlFor={`items-sort-${selectedExhibition}`} className="text-sm text-amber-800 font-medium">
                            Sort items by:
                          </label>
                          <select
                            id={`items-sort-${selectedExhibition}`}
                            value={itemsSort[selectedExhibition] || 'title-asc'}
                            onChange={(e) => handleItemsSortChange(selectedExhibition, e.target.value as ItemSortOption)}
                            disabled={itemsLoading[selectedExhibition]}
                            className="bg-white/80 border border-amber-400 text-amber-900 text-sm rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Sort exhibition items by"
                          >
                            {itemSortOptions.map(option => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Items Grid */}
                      {itemsLoading[selectedExhibition] ? (
                        <div 
                          className="flex justify-center items-center py-12"
                          aria-live="polite" 
                          aria-label="Loading exhibition items"
                        >
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-700" aria-hidden="true"></div>
                          <span className="ml-3 text-amber-800">Loading items...</span>
                        </div>
                      ) : (
                        <div 
                          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6"
                          role="grid" 
                          aria-label="Exhibition items grid"
                        >
                          {paginatedItems.map((item, index) => (
                            <article
                              key={`${selectedExhibition}-${index}`} 
                              className="relative"
                              role="gridcell"
                              aria-label={`Artifact: ${item.title} by ${item.author}`}
                            >
                              {/* Museum Card Container with integrated remove button */}
                              <div className="relative bg-white/35 backdrop-blur-sm rounded-lg border border-stone-200 shadow-inner p-6 group hover:shadow-lg transition-all duration-300 min-h-[400px] flex flex-col">
                                {/* Archival Paper Texture */}
                                <div 
                                  className="absolute inset-0 opacity-40 rounded-lg"
                                  style={{
                                    backgroundImage: `
                                      radial-gradient(ellipse at 20% 30%, rgba(255, 255, 255, 0.6) 20%, transparent 45%),
                                      radial-gradient(ellipse at 70% 20%, rgba(255, 255, 255, 0.4) 15%, transparent 40%),
                                      radial-gradient(ellipse at 40% 70%, rgba(255, 255, 255, 0.5) 25%, transparent 50%),
                                      linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.2) 32%, rgba(255, 255, 255, 0.3) 34%, transparent 36%)
                                    `,
                                    backgroundSize: '60px 45px, 90px 68px, 75px 60px, 150px 113px',
                                    filter: 'blur(0.3px)'
                                  }}
                                  aria-hidden="true"
                                ></div>
                                
                                {/* Card */}
                                <div className="relative mt-6 mb-3 flex-1">
                                  <Card
                                    title={item.title}
                                    description={item?.description}
                                    author={item?.author}
                                    provider={item?.provider}
                                    source={item?.source}
                                    image={item?.edmPreview}
                                  />
                                </div>

                                <div className="relative pt-3 border-t border-stone-300 mt-auto">
                                  <button
                                    onClick={() => patchSavedItem(selectedExhibition, index)}
                                    disabled={update || itemsLoading[selectedExhibition]}
                                    className="w-full px-3 py-2 text-sm text-white bg-amber-800 hover:bg-amber-700 disabled:bg-stone-500 disabled:cursor-not-allowed rounded border border-amber-700 hover:border-amber-600 transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                                    aria-label={`Remove ${item.title} from exhibition`}
                                    aria-disabled={update || itemsLoading[selectedExhibition]}
                                  >
                                    {update ? (
                                      <span className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                                        <span aria-live="polite">Removing...</span>
                                      </span>
                                    ) : (
                                      <>🗑️ Remove Item</>
                                    )}
                                  </button>
                                </div>
                                
                                {/* Loading Overlay */}
                                {update && (
                                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-lg z-20" aria-hidden="true">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
                                  </div>
                                )}
                              </div>
                            </article>
                          ))}
                        </div>
                      )}
                      
                      {/* Items Pagination */}
                      <div className="mt-6 pt-4 border-t border-amber-400">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-amber-800 text-sm" aria-live="polite">
                            Showing {paginatedItems.length} of {pagination.totalItems} items
                          </span>
                          <span className="text-amber-700 text-xs">
                            Page {pagination.currentPage} of {pagination.totalPages}
                          </span>
                        </div>
                        
                        <Pagination
                          currentPage={pagination.currentPage}
                          totalPages={pagination.totalPages}
                          onPageChange={(page) => handleItemsPageChange(selectedExhibition, page)}
                          pageSize={pagination.pageSize}
                          onPageSizeChange={(size) => handleItemsPageSizeChange(selectedExhibition, size)}
                          pageSizeOptions={[4, 8, 12, 16]}
                          disabled={itemsLoading[selectedExhibition]}
                        />
                      </div>
                    </>
                  );
                })()}
              </section>
            )}
          </>
        )}

        {/* Error Messages */}
        {exhibitionMessage && (
          <div 
            className="mb-4 p-3 bg-red-100/70 backdrop-blur-sm border border-red-300 text-red-800 rounded"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {exhibitionMessage}
          </div>
        )}

        {/* Login Modal */}
        {showLoginModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={(e) => handleBackdropClick(e, handleCloseLoginModal)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
          >
            <div 
              ref={loginModalRef}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-lg max-w-sm w-full shadow-2xl border-2 border-amber-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="login-modal-title" className="text-2xl font-bold mb-6 text-amber-900 border-b border-amber-400 pb-3">
                Login
              </h3>

              {loginError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-800 rounded" role="alert" aria-live="polite">
                  {loginError}
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <label htmlFor="login-username" className="sr-only">Username</label>
                <input
                  id="login-username"
                  ref={loginFirstInputRef}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={loginFormData.username}
                  onChange={handleLoginChange}
                  className="border border-amber-400 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-600 transition-colors"
                  required
                  autoComplete="username"
                />
                <label htmlFor="login-password" className="sr-only">Password</label>
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={loginFormData.password}
                  onChange={handleLoginChange}
                  className="border border-amber-400 rounded p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-600 transition-colors"
                  required
                  autoComplete="current-password"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseLoginModal}
                    className="px-4 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 rounded border border-stone-500 hover:border-stone-400 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded border border-amber-600 hover:border-amber-500 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Create Account Modal */}
        {showCreateModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={(e) => handleBackdropClick(e, handleCloseCreateModal)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-modal-title"
          >
            <div 
              ref={createModalRef}
              className="bg-white/90 backdrop-blur-sm p-8 rounded-lg max-w-sm w-full shadow-2xl border-2 border-amber-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="create-modal-title" className="text-2xl font-bold mb-6 text-amber-900 border-b border-amber-400 pb-3">
                Create Account
              </h3>
              <form onSubmit={(e) => { e.preventDefault(); handleCreateAccount(); }}>
                <label htmlFor="create-username" className="sr-only">Username</label>
                <input
                  id="create-username"
                  ref={createFirstInputRef}
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={createFormData.username}
                  onChange={handleCreateChange}
                  className="border border-amber-400 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-600 transition-colors"
                  required
                  autoComplete="username"
                />
                <label htmlFor="create-email" className="sr-only">Email</label>
                <input
                  id="create-email"
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={createFormData.email}
                  onChange={handleCreateChange}
                  className="border border-amber-400 rounded p-3 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-600 transition-colors"
                  required
                  autoComplete="email"
                />
                <label htmlFor="create-password" className="sr-only">Password</label>
                <input
                  id="create-password"
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={createFormData.password}
                  onChange={handleCreateChange}
                  className="border border-amber-400 rounded p-3 mb-6 w-full focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-600 transition-colors"
                  required
                  autoComplete="new-password"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseCreateModal}
                    className="px-4 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 rounded border border-stone-500 hover:border-stone-400 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded border border-amber-600 hover:border-amber-500 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Exhibition Creation Modal */}
        {showExhibitionModal && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={(e) => handleBackdropClick(e, handleCloseExhibitionModal)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exhibition-modal-title"
          >
            <div 
              ref={exhibitionModalRef}
              className="bg-white/90 backdrop-blur-sm p-6 rounded-lg shadow-2xl max-w-sm w-full border-2 border-amber-300"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 id="exhibition-modal-title" className="text-xl font-bold mb-6 text-amber-900 border-b border-amber-400 pb-3">
                Create New Exhibition
              </h2>
              <form onSubmit={(e) => { e.preventDefault(); handleAddExhibition(); }}>
                <label htmlFor="exhibition-title" className="sr-only">Exhibition title</label>
                <input
                  id="exhibition-title"
                  ref={exhibitionInputRef}
                  type="text"
                  value={newExhibitionTitle}
                  onChange={(e) => setNewExhibitionTitle(e.target.value)}
                  placeholder="Enter exhibition title"
                  className="border border-amber-400 p-3 w-full rounded mb-6 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white/80 text-amber-900 placeholder-amber-600 transition-colors"
                  required
                  aria-describedby="exhibition-title-help"
                />
                <p id="exhibition-title-help" className="sr-only">Enter a descriptive title for your new exhibition</p>
                <div className="flex justify-center space-x-3">
                  <button
                    type="button"
                    onClick={handleCloseExhibitionModal}
                    className="px-4 py-2 bg-stone-600 hover:bg-stone-500 text-stone-100 rounded border border-stone-500 hover:border-stone-400 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:ring-offset-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-700 hover:bg-amber-600 text-white rounded border border-amber-600 hover:border-amber-500 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
                    disabled={exhibitionLoading}
                    aria-disabled={exhibitionLoading}
                  >
                    {exhibitionLoading ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" aria-hidden="true"></div>
                        <span aria-live="polite">Creating...</span>
                      </span>
                    ) : (
                      '✨ Create'
                    )}
                  </button>
                </div>
                {exhibitionMessage && (
                  <p className="text-red-800 mt-3 p-2 bg-red-100 border border-red-300 rounded text-sm" role="alert" aria-live="polite">
                    {exhibitionMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}