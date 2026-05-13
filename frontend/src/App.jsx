import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ToastProvider";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Budget from "./pages/Budget";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import GoalsPage from "./pages/GoalsPage";

function App() {
  return (
    <AuthProvider>

      <ToastProvider>

        <Router>

          <Routes>

            <Route
              path="/"
              element={<Landing />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/register"
              element={<Register />}
            />

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route
              path="/transactions"
              element={<Transactions />}
            />

            <Route
              path="/budget"
              element={<Budget />}
            />

            {/* GOALS */}
            <Route
              path="/goals"
              element={<GoalsPage />}
            />

            <Route
              path="/categories"
              element={<Categories />}
            />

            <Route
              path="/settings"
              element={<Settings />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

          </Routes>

        </Router>

      </ToastProvider>

    </AuthProvider>
  );
}

export default App;