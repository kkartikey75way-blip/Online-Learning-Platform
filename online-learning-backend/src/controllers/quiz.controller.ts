import { Response } from "express";
import type { AuthRequest } from "../types/auth-request";
import { Quiz } from "../models/quiz.model";
import { Question } from "../models/question.model";

export const createQuiz = async (
  req: AuthRequest,
  res: Response
) => {
  const quiz = await Quiz.create(req.body);
  res.status(201).json(quiz);
};

export const submitQuiz = async (
  req: AuthRequest,
  res: Response
) => {
  const { quizId, answers } = req.body;

  const questions = await Question.find({ quiz: quizId });

  let score = 0;
  questions.forEach((q, i) => {
    if (q.correctAnswer === answers[i]) score++;
  });

  res.json({
    score,
    total: questions.length,
  });
};
