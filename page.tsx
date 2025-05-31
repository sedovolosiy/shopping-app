'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingCart, BarChart4, Sparkles, Store, Menu } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">Shopping Optimizer</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-600 hover:text-indigo-600">Возможности</Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-indigo-600">Как это работает</Link>
            <Link href="#stores" className="text-gray-600 hover:text-indigo-600">Магазины</Link>
            <Button asChild>
              <Link href="/app">
                Начать использовать
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

  const [availableStores, setAvailableStores] = useState<Store[]>([]);
  const [userLanguage, setUserLanguage] = useState<string>('en'); // Default language

  // Fetch available stores
  const fetchAvailableStores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stores');
      if (!response.ok) {
        throw new Error(`Failed to fetch stores: ${response.statusText}`);
      }
      const storesData: Store[] = await response.json();
      setAvailableStores(storesData);
      if (storesData.length > 0 && !selectedStoreId) {
        setSelectedStoreId(storesData[0].id); // Select the first store by default
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching stores",
        description: err.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [toast, selectedStoreId]);

  // Fetch user preferences (language)
  const fetchUserPreferences = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/user-preferences?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) {
        if (response.status === 404) { // User or preferences not found, use defaults
          // Removed direct call to updateUserPreferences to prevent potential loops if API behaves unexpectedly
          // Default language will be set, and user can change it.
          // Or, attempt to create preferences without immediately re-fetching or relying on its state update.
          console.warn(`User preferences for ${userId} not found. Using default.`);
          setUserLanguage('en'); // Set default language directly
          // Optionally, try to create preferences in the background without blocking
          // fetch('/api/user-preferences', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, language: 'en' }) });
          return;
        }
        throw new Error(`Failed to fetch user preferences: ${response.statusText}`);
      }
      const prefs: UserPreferences = await response.json();
      setUserLanguage(prefs.language || 'en');
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching user preferences:", err.message);
    }
    setIsLoading(false);
  }, [userId]); // Removed toast and updateUserPreferences from dependency array

  // Update user preferences (language)
  const updateUserPreferencesCallback = useCallback(async (language: string) => { // Renamed to avoid conflict and clarify it's a callback
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/user-preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, language }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update language: ${response.statusText}`);
      }
      const updatedPrefs: UserPreferences = await response.json();
      setUserLanguage(updatedPrefs.language);
      toast({
        title: "Language Updated",
        description: `Language set to ${updatedPrefs.language}.`, // TODO: Localize
      });
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error updating language",
        description: err.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [userId, toast]);

  useEffect(() => {
    fetchAvailableStores();
    fetchUserPreferences();
  }, [fetchAvailableStores, fetchUserPreferences]); // Run once on mount and when userId changes. fetchUserPreferences depends on userId.

  // Fetch user's shopping lists
  const fetchUserShoppingLists = useCallback(async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const response = await fetch(`/api/shopping-list?userId=${encodeURIComponent(userId)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch shopping lists: ${response.statusText}`);
      }
      const lists: ApiShoppingList[] = await response.json();
      setUserShoppingLists(lists);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error fetching your lists",
        description: err.message,
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }, [userId, toast]);

  useEffect(() => {
    fetchUserShoppingLists();
  }, [fetchUserShoppingLists]);

  const handleOptimize = async (currentUserId: string, currentListName?: string) => {
    if (!currentUserId.trim()) {
        toast({ title: "User ID required", description: "Please enter a User ID to save and optimize your list.", variant: "destructive"}); // TODO: Localize
        return;
    }
    if (!selectedStoreId) {
        toast({ title: "Store not selected", description: "Please select a store.", variant: "destructive"}); // TODO: Localize
        return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/shopping-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText, userId: currentUserId, listName: currentListName, storeId: selectedStoreId }), // Added storeId
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to optimize: ${response.statusText}`);
      }
      const optimizedList: ApiShoppingList = await response.json();
      setOptimizedItems(optimizedList.items);
      setIsOptimized(true);
      toast({
        title: "List Optimized!", // TODO: Localize
        description: currentListName ? `Your list '${currentListName}' has been optimized.` : "Your list has been optimized.", // TODO: Localize
      });
      fetchUserShoppingLists(); // Refresh the list of user's shopping lists
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Optimization Error", // TODO: Localize
        description: err.message,
        variant: "destructive",
      });
      setIsOptimized(false);
    }
    setIsLoading(false);
  };

  const handleAddStore = async (storeName: string): Promise<Store | null> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: storeName }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to add store: ${response.statusText}`);
      }
      const newStore: Store = await response.json();
      setAvailableStores(prevStores => [...prevStores, newStore].sort((a, b) => a.name.localeCompare(b.name)));
      toast({ title: "Store Added", description: `Store '${newStore.name}' added successfully.` }); // TODO: Localize
      return newStore;
    } catch (err: any) {
      setError(err.message);
      toast({ title: "Error Adding Store", description: err.message, variant: "destructive" }); // TODO: Localize
      return null;
    }
    finally {
      setIsLoading(false);
    }
  };

  // TODO: Implement UI for displaying userShoppingLists
  // TODO: Implement UI for language selection (e.g., a dropdown)
  //       that calls updateUserPreferences('selected_lang_code')

  return (
    <div className="container mx-auto p-4 flex flex-col items-center min-h-screen bg-gradient-to-br from-slate-50 to-sky-100 dark:from-slate-900 dark:to-sky-900">
      <header className="w-full max-w-4xl mb-8 text-center">
        {/* Language Selector Example - to be styled and localized properly */}
        <div className="my-4 flex justify-center items-center gap-2">
            <Label htmlFor="language-select" className="text-sm">Language:</Label>
            <Select value={userLanguage} onValueChange={(lang) => updateUserPreferencesCallback(lang)}> {/* Use renamed callback */}
                <SelectTrigger id="language-select" className="w-auto min-w-[100px]">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="uk">Українська</SelectItem>
                    <SelectItem value="pl">Polski</SelectItem>
                </SelectContent>
            </Select>
        </div>
        {/* Main title can also be localized based on userLanguage */}
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-400 dark:to-indigo-500">
          Optimal Shopping Assistant
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 mt-2">
          Plan your shopping efficiently. Enter your list, pick a store, and get an optimized path!
        </p>
      </header>

      <main className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <section className="md:col-span-1">
          <ShoppingListForm
            rawText={rawText}
            setRawText={setRawText}
            selectedStoreId={selectedStoreId}
            setSelectedStoreId={setSelectedStoreId}
            onOptimize={handleOptimize}
            isOptimized={isOptimized}
            userId={userId}
            setUserId={setUserId}
            listName={listName}
            setListName={setListName}
            availableStores={availableStores}
            onAddStore={handleAddStore}
          />
        </section>

        <section className="md:col-span-1">
          {isOptimized && optimizedItems.length > 0 && (
            <OptimizedListView items={optimizedItems} storeName={availableStores.find(s => s.id === selectedStoreId)?.name || 'Selected Store'} />
          )}
          {/* TODO: Display user's past shopping lists (userShoppingLists) */}
        </section>
      </main>
      
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <p className="text-white text-xl">Loading...</p> {/* TODO: Replace with a proper spinner component */}
        </div>
      )}

      {error && (
         <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
                <svg className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.651-3.03-2.651-3.029a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.651 3.03 2.651 3.029a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
        </div>
      )}
      <Toaster />
    </div>
  );
}
