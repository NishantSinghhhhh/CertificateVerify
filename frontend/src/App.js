// src/App.js
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Cert from "./components/Cert";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Cert/>} />
          <Route path="/verifyCertificate" element={<Cert />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
