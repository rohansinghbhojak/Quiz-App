import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ResultsPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { questions = [], answers = [] } = state || {};

  const total = questions.length;
  const score = questions.reduce(
    (acc, q, idx) => (answers[idx] === q.answer ? acc + 1 : acc),
    0
  );
  const correctPct = total ? Math.round((score / total) * 100) : 0;
  const wrong = total - score;
  const wrongPct = total ? Math.round((wrong / total) * 100) : 0;

  return (
    <div className="quiz-container" style={{ paddingRight: 40 }}>
      <div className="results-header">
        <div>
          <h2 className="results-title">Results</h2>
          <p className="results-sub">You scored {score} out of {total}</p>
        </div>
        <button className="submit-btn" onClick={() => navigate("/quiz")}>Restart Quiz</button>
      </div>

      <div className="results-bars">
        <div className="bar-labels">
          <span>Correct</span>
          <span>{correctPct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill correct" style={{ width: `${correctPct}%` }} />
        </div>

        <div className="bar-labels" style={{ marginTop: 12 }}>
          <span>Incorrect</span>
          <span>{wrongPct}%</span>
        </div>
        <div className="progress-track">
          <div className="progress-fill wrong" style={{ width: `${wrongPct}%` }} />
        </div>
      </div>

      <div className="results-list">
        {questions.map((q, idx) => {
          const isCorrect = answers[idx] === q.answer;
          return (
            <div key={q.id} className="result-item">
              <div className="result-top">
                <span className={`badge ${isCorrect ? 'ok' : 'bad'}`}>{isCorrect ? 'Correct' : 'Wrong'}</span>
                <span className="q-index">Q{idx + 1}</span>
              </div>
              <div className="result-question" dangerouslySetInnerHTML={{ __html: q.question }} />
              <div className="result-answers">
                <div className="answer-row">
                  <span className="answer-label">Your Answer:</span>
                  <span className={`answer-pill ${isCorrect ? 'pill-ok' : 'pill-bad'}`} dangerouslySetInnerHTML={{ __html: answers[idx] || 'None' }} />
                </div>
                {!isCorrect && (
                  <div className="answer-row">
                    <span className="answer-label">Correct Answer:</span>
                    <span className="answer-pill" dangerouslySetInnerHTML={{ __html: q.answer }} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
