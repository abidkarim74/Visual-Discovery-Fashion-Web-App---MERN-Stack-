import "./App.css";
// Components
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import BottomBar from "./components/BottomBar";

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


function App() {
  const { width } = useWindowSize();
  return (
    <div className="flex flex-col h-screen">
      <header className="h-16 bg-white border-b shadow-sm px-4 flex items-center sticky top-0 z-50">
        <Header />
      </header>

      <div className="flex flex-1 overflow-hidden">
        {width > 470 ? <Sidebar /> : null}

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
            <Route path='/pins/:id' element={<PinDetails></PinDetails>}></Route>
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

      {width <= 470 && <BottomBar></BottomBar>}
    </div>
  );
}

export default App;
