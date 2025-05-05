import React from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./styles/global.css";
import "./styles/components/favoritebutton.css";
import "./styles/components/favorites.css";
import "./index.css";

// Importar los contextos
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import ProtectedAdminRoute from "./components/Admin/ProtectedAdminRoute";

// Páginas principales
import HomePage from "./pages/HomePage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import MovieDetailPage from "./pages/MovieDetailPage";
import ExplorePage from "./pages/ExplorePage";
import ProfilePage from "./pages/ProfilePage";
import NotFoundPage from "./pages/NotFoundPage";
import LogoutPage from "./pages/LogoutPage";
import AccessDeniedPage from "./pages/AccessDeniedPage";

// Nuevas páginas legales y de información
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import CookiesPage from "./pages/CookiesPage";
import LegalPage from "./pages/LegalPage";
import AdvertisingPage from "./pages/AdvertisingPage";
import FAQPage from "./pages/FAQPage";

// Componentes
import Forum from "./components/Forum/Forum";
import ForumThread from "./components/Forum/ForumThread";

// Componentes de autenticación
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import UpdateProfile from "./components/Auth/UpdateProfile";

// Páginas de listas
import ListsPage from "./pages/ListsPage";
import ListDetailPage from "./pages/ListDetailPage";

// Páginas de administración
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminCheckingPage from "./pages/AdminCheckingPage";

// Aplicación principal
function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <FavoritesProvider>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<HomePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/blog/:postId" element={<BlogPostPage />} />

              {/* Nuevas rutas */}
              <Route path="/movie/:id" element={<MovieDetailPage />} />
              <Route path="/series/:id" element={<MovieDetailPage />} />
              <Route path="/forum" element={<Forum />} />
              <Route path="/forum/topic/:id" element={<ForumThread />} />
              <Route path="/blog" element={<BlogPage />} />

              {/* Rutas de exploración */}
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/explore/films" element={<ExplorePage />} />
              <Route path="/explore/series" element={<ExplorePage />} />

              {/* Nuevas páginas legales y de información */}
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/advertising" element={<AdvertisingPage />} />
              <Route path="/faq" element={<FAQPage />} />

              {/* Rutas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/profile/update" element={<UpdateProfile />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/logout" element={<LogoutPage />} />

              {/* Rutas de listas */}
              <Route
                path="/lists"
                element={<Navigate to="/lists/favorites" replace />}
              />
              <Route path="/lists/favorites" element={<ListsPage />} />
              <Route path="/lists/collections" element={<ListsPage />} />
              <Route path="/lists/:listId" element={<ListDetailPage />} />

              {/* Rutas protegidas de administración */}
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedAdminRoute>
                    <AdminDashboardPage />
                  </ProtectedAdminRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedAdminRoute>
                    <AdminUsersPage />
                  </ProtectedAdminRoute>
                }
              />

              {/* Ruta base de admin con página de verificación */}
              <Route path="/admin" element={<AdminCheckingPage />} />

              {/* Ruta de redirección para rutas de admin no definidas */}
              <Route
                path="/admin/*"
                element={<Navigate to="/admin/users" replace />}
              />

              {/* Página de acceso denegado */}
              <Route path="/access-denied" element={<AccessDeniedPage />} />

              {/* Ruta para URLs no encontradas - Página 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </FavoritesProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
