import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Mail, BookOpen, Trophy, Target, TrendingUp } from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, testResults } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  if (!user) return null;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const aptitudeResults = testResults.filter(r => r.testType === 'aptitude');
  const technicalResults = testResults.filter(r => r.testType === 'technical');
  
  const getBestScore = (results: typeof testResults) => {
    if (results.length === 0) return 0;
    return Math.max(...results.map(r => Math.round((r.correctAnswers / r.totalQuestions) * 100)));
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft size={18} className="mr-2" />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-primary via-purple-500 to-primary" />
              <CardContent className="pt-0 pb-6 px-6">
                <div className="flex flex-col items-center -mt-12">
                  <Avatar className="w-24 h-24 border-4 border-card">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-display font-bold mt-4">{user.name}</h2>
                  <Badge className="mt-2" variant="secondary">Student</Badge>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Mail size={18} />
                    <span className="text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <BookOpen size={18} />
                    <span className="text-sm">{user.course}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Calendar size={18} />
                    <span className="text-sm">
                      Enrolled {new Date(user.enrollmentDate).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-purple-500/10">
                    <Trophy className="w-10 h-10 mx-auto text-primary mb-3" />
                    <p className="text-3xl font-bold font-display">{user.testsCompleted}</p>
                    <p className="text-sm text-muted-foreground mt-1">Tests Completed</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-accent/10 to-teal-400/10">
                    <Target className="w-10 h-10 mx-auto text-accent mb-3" />
                    <p className="text-3xl font-bold font-display">{user.averageScore}%</p>
                    <p className="text-sm text-muted-foreground mt-1">Average Score</p>
                  </div>
                  <div className="text-center p-6 rounded-xl bg-gradient-to-br from-success/10 to-emerald-400/10">
                    <TrendingUp className="w-10 h-10 mx-auto text-success mb-3" />
                    <p className="text-3xl font-bold font-display">
                      {Math.max(getBestScore(aptitudeResults), getBestScore(technicalResults))}%
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">Best Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Test History */}
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Test History</CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                      <Target className="text-muted-foreground" size={32} />
                    </div>
                    <p className="text-muted-foreground">No tests completed yet</p>
                    <Button 
                      variant="gradient" 
                      className="mt-4"
                      onClick={() => navigate('/dashboard')}
                    >
                      Take Your First Test
                    </Button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Test Type</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Score</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Correct</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Wrong</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testResults.slice().reverse().map((result) => {
                          const percentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
                          return (
                            <tr key={result.id} className="border-b last:border-0 hover:bg-muted/50">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{result.testType === 'aptitude' ? '🧠' : '💻'}</span>
                                  <span className="capitalize font-medium">{result.testType}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge className={
                                  percentage >= 70 
                                    ? 'bg-success/10 text-success border-success/20' 
                                    : percentage >= 50 
                                      ? 'bg-warning/10 text-warning border-warning/20' 
                                      : 'bg-destructive/10 text-destructive border-destructive/20'
                                } variant="outline">
                                  {percentage}%
                                </Badge>
                              </td>
                              <td className="py-3 px-4 text-success font-medium">{result.correctAnswers}</td>
                              <td className="py-3 px-4 text-destructive font-medium">{result.wrongAnswers}</td>
                              <td className="py-3 px-4 text-muted-foreground text-sm">
                                {new Date(result.completedAt).toLocaleDateString()}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
