import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ArrowRight, Brain, Code, Trophy, Users, Sparkles, CheckCircle } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: 'Aptitude Tests',
      description: 'Evaluate logical reasoning, numerical ability, and problem-solving skills'
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: 'Technical Assessments',
      description: 'Test programming concepts, data structures, and web development knowledge'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Instant Results',
      description: 'Get detailed feedback with correct and incorrect answers immediately'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Track Progress',
      description: 'Monitor your improvement over time with comprehensive analytics'
    }
  ];

  const benefits = [
    'AI-powered question curation',
    'Adaptive difficulty levels',
    'Detailed performance analytics',
    'Personalized learning path',
    'Real-time progress tracking',
    'Certificate generation'
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button variant="gradient" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-slide-up">
              <Sparkles size={16} />
              AI-Powered Learning Assessment Platform
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
              Evaluate Your Skills with{' '}
              <span className="gradient-text">Skiloovate LMS</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up-delay-1">
              Take intelligent assessments, track your progress, and unlock your full potential 
              with our AI-assisted learning management system.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
              <Button variant="hero" size="xl" onClick={() => navigate('/auth')}>
                Start Learning Now
                <ArrowRight size={20} />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/auth')}>
                View Demo
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 animate-slide-up-delay-3">
            {[
              { value: '10k+', label: 'Active Students' },
              { value: '500+', label: 'Questions' },
              { value: '95%', label: 'Satisfaction' },
              { value: '50+', label: 'Courses' }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-card border border-border card-hover">
                <div className="text-3xl md:text-4xl font-bold font-display gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive assessment platform helps you identify strengths, 
              improve weaknesses, and achieve your learning goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="p-6 rounded-2xl bg-card border border-border card-hover"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Why Choose <span className="gradient-text">Skiloovate?</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our AI-assisted learning platform adapts to your learning style and provides 
                personalized assessments to help you grow faster.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-success/20 text-success flex items-center justify-center flex-shrink-0">
                      <CheckCircle size={14} />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 via-purple-500/20 to-accent/20 p-8 flex items-center justify-center">
                <div className="w-full max-w-sm space-y-4">
                  {[
                    { label: 'Aptitude Skills', value: 85, color: 'from-primary to-purple-500' },
                    { label: 'Technical Skills', value: 72, color: 'from-accent to-teal-400' },
                    { label: 'Problem Solving', value: 90, color: 'from-success to-emerald-400' }
                  ].map((skill, index) => (
                    <div key={index} className="bg-card/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                      <div className="flex justify-between mb-2">
                        <span className="font-medium">{skill.label}</span>
                        <span className="font-bold">{skill.value}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-1000`}
                          style={{ width: `${skill.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-glow animate-float">
                <Brain className="text-primary-foreground" size={32} />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-accent rounded-xl flex items-center justify-center shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <Code className="text-accent-foreground" size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl bg-gradient-to-r from-primary via-purple-500 to-primary p-12 text-center text-primary-foreground">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to Elevate Your Skills?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Join thousands of students who are already improving their skills with Skiloovate.
            </p>
            <Button 
              size="xl" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hover:shadow-xl"
              onClick={() => navigate('/auth')}
            >
              Get Started for Free
              <ArrowRight size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Skiloovate LMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
