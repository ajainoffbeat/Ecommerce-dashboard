import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "@/pages/dashboard/Dashboard";
import { SidebarProvider } from "./ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import CategoryPage from "@/pages/marketplace/Category";
import { Provider } from "react-redux";
import store from "@/store/store";

const AuthenticatedApp = () => {
  return (
    <Provider store={store}>
      <SidebarProvider>
        <AppSidebar />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </SidebarProvider >
    </Provider>
  );
};


export default AuthenticatedApp;
