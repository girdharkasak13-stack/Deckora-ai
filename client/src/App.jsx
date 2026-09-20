import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreatePresentation from "./pages/CreatePresentation";
import UploadPresentation from "./pages/UploadPresentation";
import ReviewPresentation from "./pages/ReviewPresentation";
import EditPresentation from "./pages/EditPresentation";
import History from "./pages/History";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import PresentationCoach from "./pages/PresentationCoach";
function App() {
  return (
     
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
      <Route
  path="/create"
  element={
    <ProtectedRoute>
      <CreatePresentation />
    </ProtectedRoute>
  }
/>
      <Route
  path="/upload"
  element={
    <ProtectedRoute>
      <UploadPresentation />
    </ProtectedRoute>
  }
/>

<Route
  path="/review"
  element={
    <ProtectedRoute>
      <PresentationCoach />
    </ProtectedRoute>
  }
/>
      <Route
  path="/review/:id"
  element={
    <ProtectedRoute>
      <ReviewPresentation />
    </ProtectedRoute>
  }
/>
      <Route
  path="/history"
  element={
    <ProtectedRoute>
      <History />
    </ProtectedRoute>
  }
/>
<Route
  path="/edit/:id"
  element={
    <ProtectedRoute>
      <EditPresentation />
    </ProtectedRoute>
  }
/>
      <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>
    </Routes>
      
  );
}

export default App;