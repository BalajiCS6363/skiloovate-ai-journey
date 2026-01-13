import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, TestResult } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string, course: string) => Promise<boolean>;
  logout: () => void;
  testResults: TestResult[];
  addTestResult: (result: TestResult) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('skiloovate_user');
    const savedResults = localStorage.getItem('skiloovate_results');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedResults) {
      setTestResults(JSON.parse(savedResults));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate authentication
    const savedUsers = localStorage.getItem('skiloovate_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('skiloovate_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string, course: string): Promise<boolean> => {
    const savedUsers = localStorage.getItem('skiloovate_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [];
    
    if (users.find((u: any) => u.email === email)) {
      return false;
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      email,
      password,
      name,
      course,
      enrollmentDate: new Date().toISOString(),
      testsCompleted: 0,
      averageScore: 0
    };

    users.push(newUser);
    localStorage.setItem('skiloovate_users', JSON.stringify(users));
    
    const { password: _, ...userWithoutPassword } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('skiloovate_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const logout = () => {
    setUser(null);
    setTestResults([]);
    localStorage.removeItem('skiloovate_user');
    localStorage.removeItem('skiloovate_results');
  };

  const addTestResult = (result: TestResult) => {
    const newResults = [...testResults, result];
    setTestResults(newResults);
    localStorage.setItem('skiloovate_results', JSON.stringify(newResults));
    
    if (user) {
      const avgScore = newResults.reduce((acc, r) => acc + (r.score / r.totalQuestions) * 100, 0) / newResults.length;
      const updatedUser = {
        ...user,
        testsCompleted: newResults.length,
        averageScore: Math.round(avgScore)
      };
      setUser(updatedUser);
      localStorage.setItem('skiloovate_user', JSON.stringify(updatedUser));
      
      // Update in users list too
      const savedUsers = localStorage.getItem('skiloovate_users');
      if (savedUsers) {
        const users = JSON.parse(savedUsers);
        const userIndex = users.findIndex((u: any) => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = { ...users[userIndex], ...updatedUser };
          localStorage.setItem('skiloovate_users', JSON.stringify(users));
        }
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, signup, logout, testResults, addTestResult }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
