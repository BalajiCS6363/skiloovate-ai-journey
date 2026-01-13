import { Test } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Brain, Code, Clock, HelpCircle, ArrowRight } from 'lucide-react';
import { Badge } from './ui/badge';

interface TestCardProps {
  test: Test;
  onStart: (testId: string) => void;
}

export const TestCard = ({ test, onStart }: TestCardProps) => {
  const IconComponent = test.icon === 'Brain' ? Brain : Code;
  
  const difficultyColors = {
    easy: 'bg-success/10 text-success border-success/20',
    medium: 'bg-warning/10 text-warning border-warning/20',
    hard: 'bg-destructive/10 text-destructive border-destructive/20'
  };

  return (
    <Card className="card-hover overflow-hidden group">
      <div className={`h-2 ${test.type === 'aptitude' ? 'bg-gradient-to-r from-primary to-purple-500' : 'bg-gradient-to-r from-accent to-teal-400'}`} />
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${
            test.type === 'aptitude' 
              ? 'bg-primary/10 text-primary' 
              : 'bg-accent/10 text-accent'
          }`}>
            <IconComponent size={28} />
          </div>
          <Badge variant="outline" className={difficultyColors[test.difficulty]}>
            {test.difficulty}
          </Badge>
        </div>
        <CardTitle className="text-xl font-display mt-4">{test.title}</CardTitle>
        <CardDescription className="text-base">{test.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{test.duration} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle size={16} />
            <span>{test.questionCount} questions</span>
          </div>
        </div>
        <Button 
          variant={test.type === 'aptitude' ? 'gradient' : 'default'}
          className="w-full group/btn"
          onClick={() => onStart(test.id)}
        >
          Start Assessment
          <ArrowRight size={18} className="transition-transform group-hover/btn:translate-x-1" />
        </Button>
      </CardContent>
    </Card>
  );
};
