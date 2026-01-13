import { GraduationCap } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export const Logo = ({ size = 'md', showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };

  const textClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-3xl'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-glow`}>
        <GraduationCap className="text-primary-foreground" size={size === 'lg' ? 32 : size === 'md' ? 24 : 18} />
      </div>
      {showText && (
        <span className={`${textClasses[size]} font-display font-bold gradient-text`}>
          Skiloovate
        </span>
      )}
    </div>
  );
};
