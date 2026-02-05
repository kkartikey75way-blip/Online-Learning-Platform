import { Request, Response } from "express";
import { Quiz } from "../models/quiz.model";

export const createQuiz = async (req: Request, res: Response) => {
  const { lessonId, questions } = req.body;

  const quiz = await Quiz.create({
    lesson: lessonId,
    questions,
  });

  res.status(201).json(quiz);
};

export const getQuizByLesson = async (
  req: Request,
  res: Response
) => {
  const quiz = await Quiz.findOne({
    lesson: req.params.lessonId,
  });

  res.json(quiz);
};
