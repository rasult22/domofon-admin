import { QueryClientProvider } from '@tanstack/react-query'
import queryClient from './queries/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { NotFound } from "./screens/NotFound";
import { HomeScreen } from "./screens/HomeScreen";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          {/* 404 Route - must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
