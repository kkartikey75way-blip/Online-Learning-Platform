import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuizByLesson } from "../services/quiz.service";
import { Quiz } from "../types/quiz-comment";

export default function QuizPage() {
  const { lessonId } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  useEffect(() => {
    if (lessonId) {
      getQuizByLesson(lessonId).then(setQuiz);
    }
  }, [lessonId]);

  if (!quiz) return <p>Loading quiz…</p>;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Quiz</h1>

      {quiz.questions.map((q, i) => (
        <div key={i} className="mb-4">
          <p className="font-medium">{q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j} className="block">
              <input type="radio" name={`q${i}`} /> {opt}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}
