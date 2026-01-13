import { Question, Test } from '@/types';

export const aptitudeQuestions: Question[] = [
  {
    id: 'apt-1',
    question: 'If a train travels 360 km in 4 hours, what is its speed in km/hr?',
    options: ['80 km/hr', '90 km/hr', '100 km/hr', '70 km/hr'],
    correctAnswer: 1,
    type: 'aptitude',
    difficulty: 'easy'
  },
  {
    id: 'apt-2',
    question: 'What is 25% of 400?',
    options: ['75', '100', '125', '150'],
    correctAnswer: 1,
    type: 'aptitude',
    difficulty: 'easy'
  },
  {
    id: 'apt-3',
    question: 'If the ratio of boys to girls in a class is 3:2 and there are 30 students, how many are boys?',
    options: ['12', '15', '18', '20'],
    correctAnswer: 2,
    type: 'aptitude',
    difficulty: 'medium'
  },
  {
    id: 'apt-4',
    question: 'A shop offers a 20% discount on a product priced at $50. What is the final price?',
    options: ['$35', '$40', '$45', '$30'],
    correctAnswer: 1,
    type: 'aptitude',
    difficulty: 'easy'
  },
  {
    id: 'apt-5',
    question: 'If 8 workers can complete a task in 12 days, how many days will 6 workers take?',
    options: ['14 days', '16 days', '18 days', '20 days'],
    correctAnswer: 1,
    type: 'aptitude',
    difficulty: 'medium'
  },
  {
    id: 'apt-6',
    question: 'What comes next in the sequence: 2, 6, 12, 20, 30, ?',
    options: ['40', '42', '44', '46'],
    correctAnswer: 1,
    type: 'aptitude',
    difficulty: 'medium'
  },
  {
    id: 'apt-7',
    question: 'A car covers 450 km in 6 hours. How long will it take to cover 600 km at the same speed?',
    options: ['7 hours', '8 hours', '9 hours', '10 hours'],
    correctAnswer: 1,
    type: 'aptitude',
    difficulty: 'easy'
  },
  {
    id: 'apt-8',
    question: 'The average of 5 numbers is 20. If one number is removed, the average becomes 18. What was the removed number?',
    options: ['24', '26', '28', '30'],
    correctAnswer: 2,
    type: 'aptitude',
    difficulty: 'hard'
  },
  {
    id: 'apt-9',
    question: 'Find the odd one out: 144, 169, 196, 225, 250',
    options: ['144', '169', '225', '250'],
    correctAnswer: 3,
    type: 'aptitude',
    difficulty: 'medium'
  },
  {
    id: 'apt-10',
    question: 'If the perimeter of a square is 64 cm, what is its area?',
    options: ['256 sq cm', '196 sq cm', '225 sq cm', '289 sq cm'],
    correctAnswer: 0,
    type: 'aptitude',
    difficulty: 'easy'
  }
];

export const technicalQuestions: Question[] = [
  {
    id: 'tech-1',
    question: 'What does HTML stand for?',
    options: [
      'Hyper Text Markup Language',
      'High Tech Modern Language',
      'Hyper Transfer Markup Language',
      'Home Tool Markup Language'
    ],
    correctAnswer: 0,
    type: 'technical',
    difficulty: 'easy'
  },
  {
    id: 'tech-2',
    question: 'Which of the following is NOT a JavaScript data type?',
    options: ['String', 'Boolean', 'Float', 'Undefined'],
    correctAnswer: 2,
    type: 'technical',
    difficulty: 'easy'
  },
  {
    id: 'tech-3',
    question: 'What is the time complexity of binary search?',
    options: ['O(n)', 'O(log n)', 'O(n²)', 'O(1)'],
    correctAnswer: 1,
    type: 'technical',
    difficulty: 'medium'
  },
  {
    id: 'tech-4',
    question: 'Which CSS property is used to create space between elements?',
    options: ['spacing', 'margin', 'padding', 'gap'],
    correctAnswer: 1,
    type: 'technical',
    difficulty: 'easy'
  },
  {
    id: 'tech-5',
    question: 'What does API stand for?',
    options: [
      'Application Programming Interface',
      'Advanced Protocol Integration',
      'Application Protocol Interface',
      'Advanced Programming Integration'
    ],
    correctAnswer: 0,
    type: 'technical',
    difficulty: 'easy'
  },
  {
    id: 'tech-6',
    question: 'Which data structure uses LIFO (Last In, First Out)?',
    options: ['Queue', 'Stack', 'Array', 'Linked List'],
    correctAnswer: 1,
    type: 'technical',
    difficulty: 'medium'
  },
  {
    id: 'tech-7',
    question: 'In React, what hook is used for side effects?',
    options: ['useState', 'useEffect', 'useContext', 'useRef'],
    correctAnswer: 1,
    type: 'technical',
    difficulty: 'medium'
  },
  {
    id: 'tech-8',
    question: 'What is the purpose of SQL JOIN?',
    options: [
      'To delete records',
      'To combine rows from multiple tables',
      'To update records',
      'To create new tables'
    ],
    correctAnswer: 1,
    type: 'technical',
    difficulty: 'medium'
  },
  {
    id: 'tech-9',
    question: 'Which sorting algorithm has the best average-case time complexity?',
    options: ['Bubble Sort', 'Selection Sort', 'Quick Sort', 'Insertion Sort'],
    correctAnswer: 2,
    type: 'technical',
    difficulty: 'hard'
  },
  {
    id: 'tech-10',
    question: 'What does REST stand for in API development?',
    options: [
      'Representational State Transfer',
      'Remote Execution State Transfer',
      'Resource State Transport',
      'Representational System Transfer'
    ],
    correctAnswer: 0,
    type: 'technical',
    difficulty: 'medium'
  }
];

export const availableTests: Test[] = [
  {
    id: 'aptitude-test',
    title: 'Aptitude Assessment',
    description: 'Test your logical reasoning, numerical ability, and problem-solving skills',
    type: 'aptitude',
    duration: 15,
    questionCount: 10,
    difficulty: 'medium',
    icon: 'Brain'
  },
  {
    id: 'technical-test',
    title: 'Technical Assessment',
    description: 'Evaluate your programming concepts, data structures, and web development knowledge',
    type: 'technical',
    duration: 20,
    questionCount: 10,
    difficulty: 'medium',
    icon: 'Code'
  }
];
