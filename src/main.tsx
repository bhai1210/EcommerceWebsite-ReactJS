
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";

import './index.css'
import { AuthProvider } from './Context/AuthContext.tsx'
import App from './App.tsx'
import { Provider } from 'react-redux';
import store from './Store/store.ts'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
createRoot(document.getElementById('root')!).render(
<BrowserRouter>
   <QueryClientProvider client={queryClient}>
    <Provider store={store}>
    <AuthProvider>

      <App />
    </AuthProvider>
    </Provider>
  </QueryClientProvider>
  </BrowserRouter>
)
