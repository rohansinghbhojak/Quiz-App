import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QuestionCard from "../Components/QuestionCard";

export default function QuizPage() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [attempted, setAttempted] = useState([]);
  const [attemptedCount, setAttemptedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [started, setStarted] = useState(false);
  const navigate = useNavigate();

  // Fetch data from Open Trivia DB
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("https://opentdb.com/api.php?amount=10&type=multiple");
        const data = await res.json();
        const formatted = data.results.map((q, idx) => ({
          id: idx + 1,
          question: q.question,
          options: shuffle([q.correct_answer, ...q.incorrect_answers]),
          answer: q.correct_answer,
        }));
        setQuestions(formatted);
        setAttempted(new Array(formatted.length).fill(false));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (loading) return;
    if (!questions.length) return;
    if (!started) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [loading, questions.length, started, timeLeft]);

  function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  }

  function handleSelect(option) {
    const newAnswers = [...answers];
    newAnswers[current] = option;
    setAnswers(newAnswers);
  }

  function markAttemptIfNeeded(index) {
    if (!attempted[index] && answers[index]) {
      const updated = [...attempted];
      updated[index] = true;
      setAttempted(updated);
      setAttemptedCount(attemptedCount + 1);
    }
  }

  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  function goNext() {
    // count attempt only when moving forward via Next/Finish
    markAttemptIfNeeded(current);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    // optionally count the current one if finishing via header button
    markAttemptIfNeeded(current);
    navigate("/results", { state: { questions, answers } });
  }

  const total = questions.length;
  const ringPct = total ? Math.round((attemptedCount / total) * 100) : 0;

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const ss = String(timeLeft % 60).padStart(2, "0");

  if (loading) return <h2 className="p-4">Loading questions...</h2>;
  if (!questions.length) return <h2 className="p-4">No questions found.</h2>;

  // Start screen
  if (!started) {
    return (
      <div className="quiz-container" style={{ ['--ring']: `0%`, paddingRight: '40px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '400px', textAlign: 'center' }}>
          <h2 style={{ marginBottom: 10 }}>Ready to start your quiz?</h2>
          <p style={{ color: '#445', opacity: 0.9, marginBottom: 20 }}>You have 5 minutes to complete 10 questions.</p>
          <button className="submit-btn" onClick={() => setStarted(true)}>Start Quiz</button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container" style={{ ['--ring']: `${ringPct}%` }}>
      <div className="quiz-header">
        <div className="timer">
          <span className="timer-icon">🕒</span>
          <div>
            <div style={{ fontWeight: 600 }}>Time remaining</div>
            <div>{mm}:{ss}</div>
          </div>
        </div>
        <button className="submit-btn" disabled={current !== questions.length - 1} onClick={handleSubmit}>Submit</button>
      </div>

      <h3 style={{ marginBottom: 10 }}>Question {current + 1} of {questions.length}</h3>
      <div className="question-text" dangerouslySetInnerHTML={{ __html: questions[current].question }} />

      <QuestionCard
        question={questions[current]}
        selected={answers[current]}
        onSelect={handleSelect}
      />

      <div className="nav-btns">
        <button className="nav-btn" disabled={current === 0} onClick={goPrev}>Prev</button>
        <div className="pagination">
          {questions.map((q, idx) => (
            <button
              key={q.id}
              className={`page-btn ${idx === current ? "active" : ""}`}
              onClick={() => setCurrent(idx)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <button className="nav-btn" disabled={!answers[current]} onClick={goNext}>
          {current === questions.length - 1 ? "Finish" : "Next"}
        </button>
      </div>

      <div
        className="score-circle"
        style={{ background: `conic-gradient(#2f4f39 ${ringPct}%, #d6d6d6 0)` }}
      >
        <span>{attemptedCount}/{questions.length}</span>
      </div>
    </div>
  );
}
