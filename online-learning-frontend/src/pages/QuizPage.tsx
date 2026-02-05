import { useParams } from "react-router-dom";
import { useState } from "react";
import { api } from "../services/api";

export default function QuizPage() {
  const { quizId } = useParams<{ quizId: string }>();

  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<any>(null);

  const submitQuiz = async () => {
    if (!quizId) return;

    const res = await api.post("/quizzes/submit", {
      quizId,
      answers,
    });

    setResult(res.data);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Quiz</h1>

      <button
        onClick={submitQuiz}
        className="bg-teal-500 text-white px-4 py-2 rounded cursor-pointer"
      >
        Submit Quiz
      </button>

      {result && (
        <p className="mt-4">
          Score: {result.score}/{result.total}
        </p>
      )}
    </div>
  );
}
