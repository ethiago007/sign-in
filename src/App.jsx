import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignUp from "./component/signup";
import Login from "./component/login";
import DummyPage from "./component/dummy";
import UnderwaterBackground from "./component/UnderwaterBackground";

function App() {
  return (
    <Router>
      <UnderwaterBackground /> 
      <Routes>
        <Route path="/" element={<SignUp />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/dummy" element={<DummyPage />} />
        <Route path="/signup" element={<SignUp />} /> 
      </Routes>
    </Router>
  );
}

export default App;
