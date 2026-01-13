import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DashboardHeader } from '@/components/DashboardHeader';
import { TestCard } from '@/components/TestCard';
import { StatsCard } from '@/components/StatsCard';
import { availableTests } from '@/data/questions';
import { Trophy, Target, ClipboardCheck, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const Dashboard = () => {
  const { user, isAuthenticated, testResults } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const handleStartTest = (testId: string) => {
    navigate(`/test/${testId}`);
  };

  const recentResults = testResults.slice(-5).reverse();
  const aptitudeResults = testResults.filter(r => r.testType === 'aptitude');
  const technicalResults = testResults.filter(r => r.testType === 'technical');
  
  const aptitudeAvg = aptitudeResults.length > 0 
    ? Math.round(aptitudeResults.reduce((acc, r) => acc + (r.correctAnswers / r.totalQuestions) * 100, 0) / aptitudeResults.length)
    : 0;
  
  const technicalAvg = technicalResults.length > 0
    ? Math.round(technicalResults.reduce((acc, r) => acc + (r.correctAnswers / r.totalQuestions) * 100, 0) / technicalResults.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-display font-bold">
            Welcome back, <span className="gradient-text">{user.name.split(' ')[0]}</span>! 👋
          </h1>
          <p className="text-muted-foreground mt-2">
            Ready to continue your learning journey? Track your progress and take new assessments.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="animate-slide-up">
            <StatsCard
              title="Tests Completed"
              value={user.testsCompleted}
              icon={<ClipboardCheck size={28} />}
              colorClass="from-primary to-purple-500"
            />
          </div>
          <div className="animate-slide-up-delay-1">
            <StatsCard
              title="Average Score"
              value={`${user.averageScore}%`}
              icon={<Target size={28} />}
              colorClass="from-accent to-teal-400"
            />
          </div>
          <div className="animate-slide-up-delay-2">
            <StatsCard
              title="Aptitude Score"
              value={`${aptitudeAvg}%`}
              icon={<TrendingUp size={28} />}
              colorClass="from-amber-500 to-orange-500"
            />
          </div>
          <div className="animate-slide-up-delay-3">
            <StatsCard
              title="Technical Score"
              value={`${technicalAvg}%`}
              icon={<Trophy size={28} />}
              colorClass="from-success to-emerald-400"
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Tests */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-display font-semibold mb-4">Available Assessments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availableTests.map((test) => (
                <TestCard key={test.id} test={test} onStart={handleStartTest} />
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-display font-semibold mb-4">Recent Activity</h2>
            <Card>
              <CardContent className="p-6">
                {recentResults.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <ClipboardCheck className="text-muted-foreground" size={32} />
                    </div>
                    <p className="text-muted-foreground">No tests completed yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Start an assessment to see your progress</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentResults.map((result, index) => (
                      <div key={result.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          result.testType === 'aptitude' 
                            ? 'bg-primary/10 text-primary' 
                            : 'bg-accent/10 text-accent'
                        }`}>
                          {result.testType === 'aptitude' ? '🧠' : '💻'}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm capitalize">{result.testType} Test</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(result.completedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            (result.correctAnswers / result.totalQuestions) >= 0.7 
                              ? 'text-success' 
                              : (result.correctAnswers / result.totalQuestions) >= 0.5 
                                ? 'text-warning' 
                                : 'text-destructive'
                          }`}>
                            {result.correctAnswers}/{result.totalQuestions}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Skill Progress */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg font-display">Skill Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Aptitude</span>
                    <span className="text-sm text-muted-foreground">{aptitudeAvg}%</span>
                  </div>
                  <Progress value={aptitudeAvg} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Technical</span>
                    <span className="text-sm text-muted-foreground">{technicalAvg}%</span>
                  </div>
                  <Progress value={technicalAvg} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
