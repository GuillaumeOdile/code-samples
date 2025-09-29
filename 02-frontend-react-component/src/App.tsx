// Main app - pretty straightforward setup
// Using React Query for state management since Redux felt overkill for this

import { QueryClient, QueryClientProvider } from 'react-query';
import { UserTable } from '@/components/UserTable';
import './App.css';

// React Query config - tuned these retry settings after some testing
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Skip retries for client errors - no point hammering the server
        if (error && typeof error === 'object' && 'statusCode' in error) {
          const statusCode = (error as any).statusCode;
          if (statusCode >= 400 && statusCode < 500) {
            return false;
          }
        }
        // 3 retries seems reasonable for network issues
        return failureCount < 3;
      },
      staleTime: 5 * 60 * 1000, // 5 min - users don't need real-time updates
      cacheTime: 10 * 60 * 1000, // 10 min cache
    },
    mutations: {
      retry: false, // Mutations shouldn't retry automatically
    },
  },
});

// Main component - keeping it simple for now
function App(): JSX.Element {
  const handleEditUser = (userId: string): void => {
    // TODO: Need to build the edit modal - probably next sprint
    console.log('Edit user:', userId);
  };

  const handleViewUser = (userId: string): void => {
    // TODO: User details page - might use a modal or separate route
    console.log('View user:', userId);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <header className="app-header">
          <h1>User Management</h1>
        </header>

        <main className="app-main">
          <UserTable 
            onEditUser={handleEditUser}
            onViewUser={handleViewUser}
          />
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 User Management System</p>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default App;
