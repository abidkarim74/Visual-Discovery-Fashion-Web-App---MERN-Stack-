import "./App.css";
// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BottomBar from "./components/BottomBar";
import UnauthenticatedHeader from "./components/UnauthenticatedHeader";

// Other
import { Route, Routes } from "react-router-dom";
import { useWindowSize } from "./hooks/useWindowSize";
import ProtectRoutes from "./middleware/ProtectRoutes";
import { AuthenticatedProtection } from "./middleware/AuthenticatedProtect";
// Pages
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import AuthProfilePage from "./pages/AuthProfilePage";
import UserProfilePage from "./pages/UsersProfilePage";
import CreatePinPage from "./pages/CreatePinPage";
import ProfileUpdatePage from "./pages/ProfileUpdatePage";
import PinDetails from "./pages/PinDetails";
import SettingsPage from "./pages/SettingsPage";
import { AuthContext } from "./context/authContext";
import { useContext } from "react";
import MainLoading from "./components/sub/MainLoading";
import CreatedPage from "./pages/CreatedPage";
import SavedPage from "./pages/SavedPage";


function App() {
  const auth = useContext(AuthContext);

  if (!auth) {
    return <MainLoading></MainLoading>;
  }
  const { width } = useWindowSize();
  return (
    <div className="flex flex-col h-screen">
      {auth.user ? (
        <header className="h-16 bg-white border-b shadow-sm px-4 flex items-center sticky top-0 z-50">
          <Header />
        </header>
      ) : (
        <UnauthenticatedHeader></UnauthenticatedHeader>
      )}

      <div className="flex flex-1 overflow-hidden">
        {auth.user && <>{width > 470 ? <Sidebar /> : null}</>}

        <main className="flex-1 overflow-y-auto  p-4">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectRoutes>
                  <HomePage />
                </ProtectRoutes>
              }
            />
            <Route
              path="/:username"
              element={
                <ProtectRoutes>
                  <UserProfilePage></UserProfilePage>
                </ProtectRoutes>
              }
            ></Route>
            <Route
              path="/:username/profile"
              element={
                <ProtectRoutes>
                  <AuthProfilePage></AuthProfilePage>
                </ProtectRoutes>
              }
            ></Route>
            <Route
              path="/login"
              element={
                <AuthenticatedProtection>
                  <LoginPage />
                </AuthenticatedProtection>
              }
            />
            <Route
              path="/pin/create"
              element={
                <ProtectRoutes>
                  <CreatePinPage></CreatePinPage>
                </ProtectRoutes>
              }
            ></Route>
            <Route
              path="/pins/created"
              element={<ProtectRoutes><CreatedPage></CreatedPage></ProtectRoutes>}
            ></Route>
            <Route
              path="/pins/saved"
              element={<ProtectRoutes><SavedPage></SavedPage></ProtectRoutes>}
            ></Route>
            <Route
              path="/settings"
              element={<SettingsPage></SettingsPage>}
            ></Route>
            <Route path="/pins/:id" element={<PinDetails></PinDetails>}></Route>
            <Route
              path="/:username/update-profile"
              element={
                <ProtectRoutes>
                  <ProfileUpdatePage></ProfileUpdatePage>
                </ProtectRoutes>
              }
            ></Route>
            <Route
              path="/signup"
              element={
                <AuthenticatedProtection>
                  <SignupPage></SignupPage>
                </AuthenticatedProtection>
              }
            ></Route>
          </Routes>
        </main>
      </div>

      {auth.user && width <= 470 && <BottomBar></BottomBar>}
    </div>
  );
}

export default App;
