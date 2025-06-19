import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";


import CalculatorAppView from "./pages/CalculatorAppView";
import FinderWindowView from "./pages/FinderWindowView";
import MainDesktopInterface from "./pages/MainDesktopInterface";
import SystemSettingsView from "./pages/SystemSettingsView";
import TextEditorAppView from "./pages/TextEditorAppView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();


const App = () => (
<QueryClientProvider client={queryClient}>
    <TooltipProvider>
    <Toaster />
    <Sonner />
    <BrowserRouter>
        <Routes>


          <Route path="/" element={<MainDesktopInterface />} />
          <Route path="/calculator-app" element={<CalculatorAppView />} />
          <Route path="/finder-window" element={<FinderWindowView />} />
          <Route path="/system-settings" element={<SystemSettingsView />} />
          <Route path="/text-editor-app" element={<TextEditorAppView />} />
          {/* catch-all */}
          <Route path="*" element={<NotFound />} />


        </Routes>
    </BrowserRouter>
    </TooltipProvider>
</QueryClientProvider>
);

export default App;
