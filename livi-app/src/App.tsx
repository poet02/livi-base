import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import styled from "styled-components";
import { Login } from "./Pages/Login";
import { Profile } from "./Pages/Profile";
import { Properties } from "./Pages/Properties";
import { Property } from "./Pages/Property";
import { AddProperty } from "./Pages/AddProperty";
import { CircleUserRound, MapPinHouse } from "lucide-react";
import { SearchPlaces } from "./Pages/SearchPlaces";
import { Media } from "./Pages/Media";
import { CameraProvider } from "./context/CameraContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { Registration } from "./Pages/Registration";

// ----- Styled Components -----
const Container = styled.div`
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  height: 100vh;
`;

const BottomTabs = styled.div`
  display: flex;
  justify-content: space-around;
  border-top: 1px solid ${props => props.theme.colors.border.light};
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 10px;
`;

//take in current as prop
const StyledTab = styled(Tab)<{ active?: boolean }>`
  font-weight: ${(props) => (props.active ? props.theme.typography.fontWeight.bold : props.theme.typography.fontWeight.normal)};
  border-bottom: ${(props) => (props.active ? `2px solid ${props.theme.colors.primary.main}` : "none")};
  background-color: ${(props) => (props.active ? props.theme.colors.primary.main : "transparent")};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${(props) => (props.active ? props.theme.colors.primary.contrast : props.theme.colors.text.primary)};
  transition: ${props => props.theme.transitions.base};
  
  &:hover {
    background-color: ${(props) => (props.active ? props.theme.colors.primary.dark : props.theme.colors.grey[100])};
  }
`;

// ----- Tabs Wrapper -----
function TabsLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const current = location.pathname;
  const showBottomTabs = (current === "/profile" || current === "/places");
  return (
    <Container>
      <Routes>
        <Route path="/register" element={<Registration />} />
        <Route path="/media" element={<ProtectedRoute><Media /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/properties" element={<ProtectedRoute><Properties /></ProtectedRoute>} />
        <Route path="/properties/add/:id" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/properties/add" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
        <Route path="/properties/:id" element={<ProtectedRoute><Property /></ProtectedRoute>} />
        <Route path="/places" element={<ProtectedRoute><SearchPlaces /></ProtectedRoute>} />
      </Routes>

      {showBottomTabs && (
        <BottomTabs>
          <StyledTab onClick={() => navigate("/places")} active={current === "/places"}>
            <MapPinHouse size={24} />
          </StyledTab>
          <StyledTab onClick={() => navigate("/profile")} active={current === "/profile"}>
            <CircleUserRound />
          </StyledTab>
        </BottomTabs>
      )}
    </Container>
  );
}

function RootRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Navigate to="/properties" replace /> : <Navigate to="/login" replace />;
}

// ----- App Root -----
export default function App() {
  return (
    <AuthProvider>
      <CameraProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RootRoute />} />
            <Route path="/*" element={<TabsLayout />} />
          </Routes>
        </Router>
      </CameraProvider>
    </AuthProvider>
  );
}
