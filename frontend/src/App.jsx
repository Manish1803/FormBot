import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import { ThemeProvider } from "./contexts/ThemeContext";
import SettingPage from "./pages/SettingPage";
import Workspace from "./pages/Workspace";
import FlowTab from "./pages/Workspace/components/FlowTab";
import ResponseTab from "./pages/Workspace/components/ResponseTab";
import { FormBuilderProvider } from "./contexts/FormBuilderContext";

import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import AcceptInvite from "./components/AcceptInvite";
import FormPage from "./components/FormPage";

function App() {
  return (
    <>
      <ThemeProvider>
        <AuthProvider>
          <FormBuilderProvider>
            <BrowserRouter>
              <Toaster position="top-center" reverseOrder={false} />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/invite/:token" element={<AcceptInvite />} />
                <Route path="/respond/:responseLink" element={<FormPage />} />
                <Route path="/settings" element={<SettingPage />} />
                <Route path="/workspace/:id" element={<Workspace />}>
                  <Route index element={<Navigate to="flow" replace />} />
                  <Route path="flow" element={<FlowTab />} />
                  <Route path="response" element={<ResponseTab />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </FormBuilderProvider>
        </AuthProvider>
      </ThemeProvider>
    </>
  );
}

export default App;
