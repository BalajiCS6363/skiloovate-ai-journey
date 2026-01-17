import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { TestResult, Question } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { Trophy, Target, CheckCircle, XCircle, ArrowLeft, RotateCcw, Home, Download } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import confetti from 'canvas-confetti';
import jsPDF from 'jspdf';
import ChatBot from '@/components/ChatBot';

const Results = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const { result, questions } = (location.state as { result: TestResult; questions: Question[] }) || {};

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }
    if (!result) {
      navigate('/dashboard');
      return;
    }
    
    // Trigger confetti for good scores
    const percentage = (result.correctAnswers / result.totalQuestions) * 100;
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [isAuthenticated, result, navigate]);

  if (!result || !questions) return null;

  const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getScoreColor = () => {
    if (percentage >= 70) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreMessage = () => {
    if (percentage >= 90) return { emoji: '🏆', text: 'Outstanding Performance!' };
    if (percentage >= 70) return { emoji: '🎉', text: 'Great Job!' };
    if (percentage >= 50) return { emoji: '👍', text: 'Good Effort!' };
    return { emoji: '💪', text: 'Keep Practicing!' };
  };

  const scoreMessage = getScoreMessage();

  const downloadReport = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Skiloovate LMS', pageWidth / 2, 18, { align: 'center' });
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('AI-Assisted Learning Assessment Report', pageWidth / 2, 30, { align: 'center' });
    
    // Student Info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Student Information', 20, 55);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${user?.name || 'Student'}`, 20, 65);
    doc.text(`Email: ${user?.email || 'N/A'}`, 20, 73);
    doc.text(`Course: ${user?.course || 'N/A'}`, 20, 81);
    doc.text(`Date: ${new Date(result.completedAt).toLocaleDateString()}`, 20, 89);
    
    // Test Summary
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Test Summary', 20, 105);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Test Type: ${result.testType.charAt(0).toUpperCase() + result.testType.slice(1)} Assessment`, 20, 115);
    doc.text(`Total Questions: ${result.totalQuestions}`, 20, 123);
    doc.text(`Time Taken: ${formatTime(result.timeTaken)}`, 20, 131);
    
    // Score Box
    doc.setFillColor(240, 240, 250);
    doc.roundedRect(120, 100, 70, 40, 3, 3, 'F');
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    const scoreColor = percentage >= 70 ? [34, 197, 94] : percentage >= 50 ? [234, 179, 8] : [239, 68, 68];
    doc.setTextColor(scoreColor[0], scoreColor[1], scoreColor[2]);
    doc.text(`${percentage}%`, 155, 120, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Score', 155, 132, { align: 'center' });
    
    // Results Breakdown
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Results Breakdown', 20, 155);
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(34, 197, 94);
    doc.text(`✓ Correct Answers: ${result.correctAnswers}`, 20, 165);
    doc.setTextColor(239, 68, 68);
    doc.text(`✗ Wrong Answers: ${result.wrongAnswers}`, 20, 173);
    doc.setTextColor(100, 100, 100);
    doc.text(`○ Unanswered: ${result.totalQuestions - result.correctAnswers - result.wrongAnswers}`, 20, 181);
    
    // Question Details Header
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Question-wise Analysis', 20, 200);
    
    let yPos = 210;
    const maxY = 280;
    
    questions.forEach((question, index) => {
      const answer = result.answers.find(a => a.questionId === question.id);
      const isCorrect = answer?.isCorrect;
      const selectedAnswer = answer?.selectedAnswer ?? -1;
      
      if (yPos > maxY) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      const status = isCorrect ? '✓' : selectedAnswer === -1 ? '○' : '✗';
      const statusColor = isCorrect ? [34, 197, 94] : selectedAnswer === -1 ? [100, 100, 100] : [239, 68, 68];
      doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.text(`${status} Q${index + 1}: `, 20, yPos);
      
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      const questionText = question.question.substring(0, 80) + (question.question.length > 80 ? '...' : '');
      doc.text(questionText, 38, yPos);
      
      yPos += 6;
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      
      if (selectedAnswer !== -1) {
        doc.text(`Your Answer: ${question.options[selectedAnswer]?.substring(0, 50) || 'N/A'}`, 38, yPos);
      } else {
        doc.text('Your Answer: Not answered', 38, yPos);
      }
      
      yPos += 5;
      doc.setTextColor(34, 197, 94);
      doc.text(`Correct Answer: ${question.options[question.correctAnswer]?.substring(0, 50)}`, 38, yPos);
      
      yPos += 10;
    });
    
    // Footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generated by Skiloovate LMS | Page ${i} of ${totalPages}`,
        pageWidth / 2,
        290,
        { align: 'center' }
      );
    }
    
    doc.save(`Skiloovate_${result.testType}_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="sm" />
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            <Home size={18} className="mr-2" />
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Score Summary */}
        <Card className="mb-8 overflow-hidden animate-scale-in">
          <div className={`h-2 ${percentage >= 70 ? 'bg-gradient-to-r from-success to-emerald-400' : percentage >= 50 ? 'bg-gradient-to-r from-warning to-amber-400' : 'bg-gradient-to-r from-destructive to-red-400'}`} />
          <CardContent className="pt-8 pb-8 text-center">
            <div className="text-6xl mb-4">{scoreMessage.emoji}</div>
            <h1 className="text-3xl font-display font-bold mb-2">{scoreMessage.text}</h1>
            <p className="text-muted-foreground capitalize mb-8">
              {result.testType} Assessment Completed
            </p>

            <div className="flex justify-center gap-12 mb-8">
              <div className="text-center">
                <div className={`text-5xl font-bold font-display ${getScoreColor()}`}>
                  {percentage}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">Score</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold font-display text-success">
                  {result.correctAnswers}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Correct</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold font-display text-destructive">
                  {result.wrongAnswers}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Wrong</p>
              </div>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span>Progress</span>
                <span>{result.correctAnswers}/{result.totalQuestions} correct</span>
              </div>
              <Progress value={percentage} className="h-3" />
            </div>

            <p className="text-muted-foreground mt-6">
              Time taken: <span className="font-medium">{formatTime(result.timeTaken)}</span>
            </p>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} className="mr-2" />
            Back to Dashboard
          </Button>
          <Button variant="success" onClick={downloadReport}>
            <Download size={18} className="mr-2" />
            Download Report
          </Button>
          <Button variant="gradient" onClick={() => navigate(`/test/${result.testType}-test`)}>
            <RotateCcw size={18} className="mr-2" />
            Retake Test
          </Button>
        </div>

        {/* Detailed Answers */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Answer Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const answer = result.answers.find(a => a.questionId === question.id);
              const isCorrect = answer?.isCorrect;
              const selectedAnswer = answer?.selectedAnswer ?? -1;

              return (
                <div 
                  key={question.id} 
                  className={`p-6 rounded-xl border-2 ${
                    isCorrect 
                      ? 'border-success/30 bg-success/5' 
                      : 'border-destructive/30 bg-destructive/5'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isCorrect ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                    }`}>
                      {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-muted-foreground">Question {index + 1}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          question.difficulty === 'easy' 
                            ? 'bg-success/10 text-success' 
                            : question.difficulty === 'medium' 
                              ? 'bg-warning/10 text-warning' 
                              : 'bg-destructive/10 text-destructive'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      <h3 className="font-medium mb-4">{question.question}</h3>
                      
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg text-sm ${
                              optIndex === question.correctAnswer
                                ? 'bg-success/20 text-success font-medium'
                                : optIndex === selectedAnswer && !isCorrect
                                  ? 'bg-destructive/20 text-destructive'
                                  : 'bg-muted/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-mono">{String.fromCharCode(65 + optIndex)}.</span>
                              <span>{option}</span>
                              {optIndex === question.correctAnswer && (
                                <CheckCircle size={16} className="ml-auto text-success" />
                              )}
                              {optIndex === selectedAnswer && !isCorrect && (
                                <XCircle size={16} className="ml-auto text-destructive" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {selectedAnswer === -1 && (
                        <p className="text-sm text-muted-foreground mt-3 italic">
                          Question was not answered
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </main>

      {/* AI Chatbot */}
      <ChatBot />
    </div>
  );
};

export default Results;
