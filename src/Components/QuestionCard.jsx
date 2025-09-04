import React from "react";

export default function QuestionCard({ question, selected, onSelect }) {
  return (
    <div>
      <div className="options-container">
        {question.options.map((opt, idx) => (
          <button
            key={idx}
            className={`option-btn ${selected === opt ? "selected" : ""}`}
            onClick={() => onSelect(opt)}
            dangerouslySetInnerHTML={{ __html: opt }}
          />
        ))}
      </div>
    </div>
  );
}
