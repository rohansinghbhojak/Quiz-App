import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizPage from "./Components/QuizPage";
import ResultsPage from "./Components/ResultsPage";
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<QuizPage />} />
      </Routes>
    </Router>
  )
}

export default App
