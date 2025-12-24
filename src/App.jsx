import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Stream from "./Stream";
import StreamLanding from "./landingPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StreamLanding />} />
        
        <Route path="/stream" element={<Stream />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
