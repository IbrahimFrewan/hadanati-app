import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { RequireAdmin } from "./auth/RequireAdmin";
import { LoginPage } from "./auth/LoginPage";
import { Layout } from "./components/Layout";
import { DashboardPage } from "./pages/DashboardPage";
import { VerificationPage } from "./pages/VerificationPage";
import { NurseriesPage } from "./pages/NurseriesPage";
import { UsersPage } from "./pages/UsersPage";
import { BookingsPage } from "./pages/BookingsPage";
import { FinancePage } from "./pages/FinancePage";
import { AuditLogPage } from "./pages/AuditLogPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<RequireAdmin><Layout /></RequireAdmin>}>
            <Route index element={<DashboardPage />} />
            <Route path="verification" element={<VerificationPage />} />
            <Route path="nurseries" element={<NurseriesPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="finance" element={<FinancePage />} />
            <Route path="audit" element={<AuditLogPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
