import React, { useState, useRef, useEffect } from 'react';
import { Brain, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI learning assistant. I can help you improve your performance based on your test results. Ask me anything about aptitude, technical concepts, or study strategies!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, testResults } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Get user's performance data
    const avgScore = testResults.length > 0 
      ? Math.round(testResults.reduce((acc, r) => acc + (r.correctAnswers / r.totalQuestions) * 100, 0) / testResults.length)
      : 0;
    
    const aptitudeResults = testResults.filter(r => r.testType === 'aptitude');
    const technicalResults = testResults.filter(r => r.testType === 'technical');
    
    const aptitudeAvg = aptitudeResults.length > 0
      ? Math.round(aptitudeResults.reduce((acc, r) => acc + (r.correctAnswers / r.totalQuestions) * 100, 0) / aptitudeResults.length)
      : null;
    
    const technicalAvg = technicalResults.length > 0
      ? Math.round(technicalResults.reduce((acc, r) => acc + (r.correctAnswers / r.totalQuestions) * 100, 0) / technicalResults.length)
      : null;

    // Performance-based responses
    if (lowerMessage.includes('performance') || lowerMessage.includes('how am i doing') || lowerMessage.includes('my score')) {
      if (testResults.length === 0) {
        return "You haven't taken any tests yet! I recommend starting with the Aptitude Assessment to evaluate your logical reasoning and problem-solving skills. Would you like some tips on how to prepare?";
      }
      
      let response = `Based on your ${testResults.length} test(s), your average score is ${avgScore}%. `;
      
      if (aptitudeAvg !== null) {
        response += `\n\n📊 **Aptitude**: ${aptitudeAvg}% - `;
        if (aptitudeAvg >= 70) response += "Excellent! Keep practicing to maintain this level.";
        else if (aptitudeAvg >= 50) response += "Good progress! Focus on time management and practice more complex problems.";
        else response += "Needs improvement. I suggest practicing basic arithmetic, percentages, and logical reasoning daily.";
      }
      
      if (technicalAvg !== null) {
        response += `\n\n💻 **Technical**: ${technicalAvg}% - `;
        if (technicalAvg >= 70) response += "Great understanding of technical concepts!";
        else if (technicalAvg >= 50) response += "Solid foundation. Review data structures and algorithms regularly.";
        else response += "Focus on fundamentals - variables, loops, functions, and basic algorithms.";
      }
      
      return response;
    }

    // Improvement tips
    if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('tips') || lowerMessage.includes('help')) {
      const weakerArea = aptitudeAvg !== null && technicalAvg !== null 
        ? (aptitudeAvg < technicalAvg ? 'aptitude' : 'technical')
        : aptitudeAvg !== null ? 'aptitude' : 'technical';
      
      if (weakerArea === 'aptitude') {
        return `Here are personalized tips to improve your aptitude skills:

🎯 **Time Management**
- Practice solving problems under time constraints
- Learn mental math shortcuts

📚 **Focus Areas**
- Number series and patterns
- Percentage and ratio problems
- Logical reasoning puzzles

💡 **Daily Practice**
- Solve 5-10 aptitude questions daily
- Review incorrect answers thoroughly
- Time yourself on each question

Would you like me to explain any specific topic?`;
      } else {
        return `Here are personalized tips to improve your technical skills:

💻 **Core Concepts**
- Master data structures (arrays, linked lists, trees)
- Understand algorithm complexity (Big O)
- Practice coding problems regularly

🔧 **Hands-on Practice**
- Build small projects to apply concepts
- Use online coding platforms like LeetCode
- Read and understand existing code

📖 **Study Strategy**
- Focus on one topic at a time
- Write code by hand before typing
- Explain concepts out loud to reinforce learning

Which specific technical topic would you like help with?`;
      }
    }

    // Study plan
    if (lowerMessage.includes('study') || lowerMessage.includes('plan') || lowerMessage.includes('schedule')) {
      return `Here's a recommended weekly study plan:

📅 **Monday & Tuesday**: Aptitude
- Number systems, percentages, ratios
- 30 mins theory + 30 mins practice

📅 **Wednesday & Thursday**: Technical
- Data structures and algorithms
- 45 mins learning + 15 mins coding

📅 **Friday**: Mock Tests
- Take practice assessments
- Review all incorrect answers

📅 **Weekend**: Review & Relax
- Revisit weak areas
- Light revision only

🎯 **Pro Tips**:
- Study in 25-minute focused sessions (Pomodoro)
- Take regular breaks
- Track your progress weekly

Would you like a more detailed plan for any specific day?`;
    }

    // Aptitude help
    if (lowerMessage.includes('aptitude') || lowerMessage.includes('math') || lowerMessage.includes('logical')) {
      return `For aptitude improvement, focus on these key areas:

🔢 **Quantitative**
- Percentages & Profit/Loss
- Time & Work problems
- Speed & Distance calculations
- Number series patterns

🧠 **Logical Reasoning**
- Syllogisms and deductions
- Blood relations
- Coding-decoding
- Direction sense

✨ **Quick Tips**:
- Learn multiplication tables up to 20
- Memorize squares up to 30
- Practice fraction to decimal conversions

What specific aptitude topic would you like to explore?`;
    }

    // Technical help
    if (lowerMessage.includes('technical') || lowerMessage.includes('coding') || lowerMessage.includes('programming')) {
      return `For technical skill improvement:

💻 **Programming Fundamentals**
- Variables, data types, operators
- Control structures (if/else, loops)
- Functions and scope
- Object-Oriented Programming

📊 **Data Structures**
- Arrays and strings
- Linked lists
- Stacks and queues
- Trees and graphs

⚡ **Algorithms**
- Searching (linear, binary)
- Sorting (bubble, merge, quick)
- Recursion basics
- Time complexity analysis

Which programming concept would you like me to explain in detail?`;
    }

    // Motivation
    if (lowerMessage.includes('motivate') || lowerMessage.includes('discouraged') || lowerMessage.includes('hard')) {
      return `Remember ${user?.name || 'friend'}, every expert was once a beginner! 🌟

💪 **You've Got This!**
- Learning takes time - be patient with yourself
- Small daily progress adds up to big results
- Mistakes are learning opportunities, not failures

🎯 **Focus on Growth**
- Compare yourself only to yesterday's you
- Celebrate small wins along the way
- Take breaks when needed - rest is productive too

📈 **Success Stories**
- Many successful professionals struggled initially
- Consistency beats intensity
- Your effort today builds tomorrow's skills

Keep pushing forward! What can I help you with today?`;
    }

    // Default response
    return `I'm here to help you improve! You can ask me about:

• 📊 Your performance analysis
• 💡 Study tips and strategies  
• 📚 Aptitude concepts
• 💻 Technical topics
• 📅 Creating a study plan
• 🎯 Specific problem-solving techniques

What would you like to know more about?`;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: generateAIResponse(input.trim())
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <Brain size={24} />
        
      </Button>

      {/* Chat Window */}
      <div
        className={`fixed bottom-6 right-6 w-[380px] h-[520px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden transition-all duration-300 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Brain size={20} />
            </div>
            <div>
              <h3 className="font-semibold">AI Learning Assistant</h3>
              <p className="text-xs opacity-80">Here to help you improve</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-primary-foreground hover:bg-white/20"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted rounded-tl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              size="icon"
              className="bg-primary hover:bg-primary/90"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBot;
