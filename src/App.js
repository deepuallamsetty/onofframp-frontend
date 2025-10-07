import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/SignupLoginpage";
import OnOffRampApp from "./components/OnOff"
import { useState ,useEffect} from "react";
function App() {
  const [isAuthTrue,setIsAuthTrue]=useState(false)

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage setIsAuthTrue={setIsAuthTrue} isAuthTrue={isAuthTrue} />} />
        {/* <Route path="/onofframp" element={<OnOffRampApp userAddress={userAddress} />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
