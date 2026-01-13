export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  course: string;
  enrollmentDate: string;
  testsCompleted: number;
  averageScore: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  type: 'aptitude' | 'technical';
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestResult {
  id: string;
  testType: 'aptitude' | 'technical';
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeTaken: number;
  completedAt: string;
  answers: {
    questionId: string;
    selectedAnswer: number;
    isCorrect: boolean;
  }[];
}

export interface Test {
  id: string;
  title: string;
  description: string;
  type: 'aptitude' | 'technical';
  duration: number; // in minutes
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  icon: string;
}
