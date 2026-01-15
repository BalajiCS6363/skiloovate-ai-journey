import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { aptitudeQuestions, technicalQuestions, availableTests } from '@/data/questions';
import { Question, TestResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Logo } from '@/components/Logo';
import { Clock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

const Test = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, addTestResult } = useAuth();
  
  const test = availableTests.find(t => t.id === testId);
  const questions: Question[] = testId === 'aptitude-test' ? aptitudeQuestions : technicalQuestions;
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [timeLeft, setTimeLeft] = useState(() => test ? test.duration * 60 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [testStartTime] = useState(Date.now());

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!test) {
      navigate('/dashboard');
      return;
    }
    // Initialize timer only once when test starts
    if (!testStarted && test) {
      setTimeLeft(test.duration * 60);
      setTestStarted(true);
    }
  }, [isAuthenticated, test, navigate, testStarted]);

  const submitTest = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const answers = questions.map(q => ({
      questionId: q.id,
      selectedAnswer: selectedAnswers[q.id] ?? -1,
      isCorrect: selectedAnswers[q.id] === q.correctAnswer
    }));

    const correctCount = answers.filter(a => a.isCorrect).length;
    const timeTaken = Math.round((Date.now() - testStartTime) / 1000);

    const result: TestResult = {
      id: Date.now().toString(),
      testType: test?.type || 'aptitude',
      score: correctCount,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      wrongAnswers: questions.length - correctCount,
      timeTaken,
      completedAt: new Date().toISOString(),
      answers
    };

    addTestResult(result);
    navigate('/results', { state: { result, questions } });
  }, [isSubmitting, questions, selectedAnswers, testStartTime, test, addTestResult, navigate]);

  useEffect(() => {
    // Don't start timer until test has started
    if (!testStarted || !test) return;
    
    if (timeLeft <= 0) {
      toast.warning("Time's up! Submitting your test...");
      submitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, test, submitTest, testStarted]);

  if (!test || !isAuthenticated) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (answeredCount < questions.length) {
      const unanswered = questions.length - answeredCount;
      toast.warning(`You have ${unanswered} unanswered question${unanswered > 1 ? 's' : ''}. Are you sure you want to submit?`, {
        action: {
          label: 'Submit Anyway',
          onClick: submitTest
        }
      });
    } else {
      submitTest();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" />
          
          <div className="flex items-center gap-6">
            <div className={`flex items-center gap-2 font-mono font-bold text-lg ${
              timeLeft < 60 ? 'text-destructive animate-pulse' : timeLeft < 300 ? 'text-warning' : ''
            }`}>
              <Clock size={20} />
              {formatTime(timeLeft)}
            </div>
            
            <Button variant="destructive" onClick={handleSubmit} disabled={isSubmitting}>
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span className="text-sm text-muted-foreground">{answeredCount} answered</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-8 animate-fade-in">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                currentQuestion.difficulty === 'easy' 
                  ? 'bg-success/10 text-success' 
                  : currentQuestion.difficulty === 'medium' 
                    ? 'bg-warning/10 text-warning' 
                    : 'bg-destructive/10 text-destructive'
              }`}>
                {currentQuestion.difficulty}
              </span>
              <span className="text-sm text-muted-foreground capitalize">{currentQuestion.type}</span>
            </div>
            <CardTitle className="text-xl font-display leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                      selectedAnswers[currentQuestion.id] === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {selectedAnswers[currentQuestion.id] === index && (
                      <CheckCircle className="text-primary" size={20} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft size={18} className="mr-2" />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button variant="success" onClick={handleSubmit} disabled={isSubmitting}>
              <CheckCircle size={18} className="mr-2" />
              Submit Test
            </Button>
          ) : (
            <Button onClick={handleNext}>
              Next
              <ArrowRight size={18} className="ml-2" />
            </Button>
          )}
        </div>

        {/* Question Navigator */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Question Navigator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    index === currentQuestionIndex
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : selectedAnswers[q.id] !== undefined
                        ? 'bg-success/20 text-success border border-success/30'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-primary"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-success/20 border border-success/30"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-muted"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Test;
