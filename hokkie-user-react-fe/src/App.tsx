import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Login } from "./Pages/Login";
import { Home } from "./Pages/Home";
import { Profile } from "./Pages/Profile";
import PWABadge from "./PWABadge";

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
  padding: 10px 0;
  border-top: 1px solid #ddd;
`;

const Tab = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
  padding: 10px;
`;

// ----- Tabs Wrapper -----
function TabsLayout() {
  const navigate = useNavigate();
  const current = window.location.pathname;

  return (
    <Container>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <BottomTabs>
        <Tab onClick={() => navigate("/home")} style={{ fontWeight: current === "/home" ? "bold" : "normal" }}>
          Home
        </Tab>
        <Tab onClick={() => navigate("/profile")} style={{ fontWeight: current === "/profile" ? "bold" : "normal" }}>
          Profile
        </Tab>
      </BottomTabs>
    </Container>
  );
}

// ----- App Root -----
export default function App() {
  return (
   <>
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/*" element={<TabsLayout />} />
      </Routes>
    </Router>
    {/* <PWABadge /> */}
   </>
  );
}
