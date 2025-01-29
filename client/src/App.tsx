import { BrowserRouter as Router } from "react-router-dom";
import AuthenticatedApp from "./components/AuthenticatedApp";
import UnauthenticatedApp from "./components/UnauthenticatedApp"
import { AuthProvider, useAuth } from "./context/AuthContext";

function App() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  return isAuthenticated ? <AuthenticatedApp /> : <UnauthenticatedApp />;
}

export default function RootApp() {
  return (
      <AuthProvider>
        <Router>
          <App />
        </Router>
      </AuthProvider>
  );
}
