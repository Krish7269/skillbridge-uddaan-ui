import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./contexts/AppContext";
import { Layout } from "./components/layout/Layout";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import AuthPage from "./pages/AuthPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/auth" element={<AuthPage />} />
              {/* Placeholder routes */}
              <Route path="/mentorship" element={<div className="container py-16 text-center">Mentorship (Coming Soon)</div>} />
              <Route path="/community" element={<div className="container py-16 text-center">Community (Coming Soon)</div>} />
              <Route path="/showcase" element={<div className="container py-16 text-center">Showcase (Coming Soon)</div>} />
              <Route path="/certificates" element={<div className="container py-16 text-center">Certificates (Coming Soon)</div>} />
              <Route path="/support" element={<div className="container py-16 text-center">Support (Coming Soon)</div>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
