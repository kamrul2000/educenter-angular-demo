import { Injectable } from '@angular/core';
import { Subject, Chapter, Video } from '../models/subject.model';
import { QuizQuestion, CQQuestion, MockTest } from '../models/quiz.model';
import { PdfResource } from '../models/progress.model';
import { PricingPlan } from '../models/pricing.model';

/** Provides all static demo data for the application */
@Injectable({ providedIn: 'root' })
export class DemoDataService {

  readonly subjects: Subject[] = [
    { id: 'bangla', name: 'Bangla', nameBn: 'বাংলা', icon: 'bi-book', color: '#e63946', classes: [6,7,8,9,10], description: 'বাংলা ভাষা ও সাহিত্য', chapters: this.getBanglaChapters() },
    { id: 'english', name: 'English', nameBn: 'ইংরেজি', icon: 'bi-translate', color: '#457b9d', classes: [6,7,8,9,10], description: 'English Language & Literature', chapters: this.getEnglishChapters() },
    { id: 'math', name: 'Mathematics', nameBn: 'গণিত', icon: 'bi-calculator', color: '#2d6a4f', classes: [6,7,8,9,10], description: 'গণিত — Numbers, Algebra, Geometry', chapters: this.getMathChapters() },
    { id: 'science', name: 'Science', nameBn: 'বিজ্ঞান', icon: 'bi-flask', color: '#6a4c93', classes: [6,7,8], description: 'প্রাথমিক বিজ্ঞান', chapters: this.getScienceChapters() },
    { id: 'ict', name: 'ICT', nameBn: 'তথ্য ও যোগাযোগ প্রযুক্তি', icon: 'bi-laptop', color: '#0077b6', classes: [6,7,8,9,10], description: 'Information & Communication Technology', chapters: this.getICTChapters() },
    { id: 'bgs', name: 'Bangladesh & Global Studies', nameBn: 'বাংলাদেশ ও বিশ্বপরিচয়', icon: 'bi-globe', color: '#e76f51', classes: [6,7,8,9,10], description: 'বাংলাদেশ ও বিশ্ব সম্পর্কে জ্ঞান', chapters: [] },
    { id: 'religion', name: 'Religion', nameBn: 'ধর্ম ও নৈতিক শিক্ষা', icon: 'bi-heart', color: '#606c38', classes: [6,7,8,9,10], description: 'ধর্ম ও নৈতিক মূল্যবোধ', chapters: [] },
    { id: 'higher-math', name: 'Higher Mathematics', nameBn: 'উচ্চতর গণিত', icon: 'bi-infinity', color: '#3d405b', classes: [9,10], description: 'উচ্চতর গণিত', chapters: [] },
    { id: 'physics', name: 'Physics', nameBn: 'পদার্থবিজ্ঞান', icon: 'bi-lightning', color: '#f4a261', classes: [9,10], description: 'পদার্থবিজ্ঞান', chapters: this.getPhysicsChapters() },
    { id: 'chemistry', name: 'Chemistry', nameBn: 'রসায়ন', icon: 'bi-droplet', color: '#2a9d8f', classes: [9,10], description: 'রসায়নবিজ্ঞান', chapters: [] },
    { id: 'biology', name: 'Biology', nameBn: 'জীববিজ্ঞান', icon: 'bi-tree', color: '#52b788', classes: [9,10], description: 'জীববিজ্ঞান', chapters: [] },
    { id: 'accounting', name: 'Accounting', nameBn: 'হিসাববিজ্ঞান', icon: 'bi-journal-text', color: '#bc6c25', classes: [9,10], description: 'হিসাববিজ্ঞান', chapters: [] },
    { id: 'finance', name: 'Finance & Banking', nameBn: 'ফিন্যান্স ও ব্যাংকিং', icon: 'bi-bank', color: '#7b2d8b', classes: [9,10], description: 'ফিন্যান্স ও ব্যাংকিং', chapters: [] },
    { id: 'business', name: 'Business Entrepreneurship', nameBn: 'ব্যবসায় উদ্যোগ', icon: 'bi-briefcase', color: '#d62828', classes: [9,10], description: 'ব্যবসায় উদ্যোগ', chapters: [] },
  ];

  private getBanglaChapters(): Chapter[] {
    return [
      { id: 'bn_ch1', subjectId: 'bangla', title: 'Prose: Amar Para', titleBn: 'গদ্য: আমার পরা', number: 1, description: 'বাংলাদেশের গ্রামীণ জীবন', keyPoints: ['গ্রামীণ জীবনের বর্ণনা', 'প্রকৃতির সৌন্দর্য', 'লেখকের শৈশব স্মৃতি'], formulas: [], notes: 'এই অধ্যায়ে লেখক তার গ্রামের স্মৃতিচারণ করেছেন।', videoCount: 3, mcqCount: 15, pdfAvailable: true, estimatedTime: 45 },
      { id: 'bn_ch2', subjectId: 'bangla', title: 'Poetry: Amar Shonar Bangla', titleBn: 'কবিতা: আমার সোনার বাংলা', number: 2, description: 'জাতীয় সংগীত ও দেশপ্রেম', keyPoints: ['জাতীয় সংগীতের বিশ্লেষণ', 'রবীন্দ্রনাথের জীবনী', 'দেশপ্রেমের প্রকাশ'], formulas: [], notes: 'রবীন্দ্রনাথ ঠাকুর রচিত জাতীয় সংগীত।', videoCount: 2, mcqCount: 12, pdfAvailable: true, estimatedTime: 40 },
      { id: 'bn_ch3', subjectId: 'bangla', title: 'Grammar: Parts of Speech', titleBn: 'ব্যাকরণ: পদ প্রকরণ', number: 3, description: 'বাংলা ব্যাকরণের মূল বিষয়', keyPoints: ['বিশেষ্য', 'বিশেষণ', 'ক্রিয়া', 'সর্বনাম'], formulas: ['বিশেষ্য + বিশেষণ = গুণবাচক বিশেষ্য'], notes: 'পদ প্রকরণ বাংলা ব্যাকরণের একটি গুরুত্বপূর্ণ অধ্যায়।', videoCount: 4, mcqCount: 20, pdfAvailable: true, estimatedTime: 60 },
    ];
  }

  private getEnglishChapters(): Chapter[] {
    return [
      { id: 'en_ch1', subjectId: 'english', title: 'Reading Comprehension', titleBn: 'পড়া ও বোঝা', number: 1, description: 'Reading and understanding passages', keyPoints: ['Main idea', 'Supporting details', 'Vocabulary in context', 'Inference skills'], formulas: [], notes: 'Reading comprehension tests your ability to understand written text.', videoCount: 3, mcqCount: 18, pdfAvailable: true, estimatedTime: 50 },
      { id: 'en_ch2', subjectId: 'english', title: 'Grammar: Tense', titleBn: 'ব্যাকরণ: কাল', number: 2, description: 'Present, Past, Future Tenses', keyPoints: ['Present Simple', 'Past Simple', 'Future Simple', 'Continuous & Perfect forms'], formulas: ['Subject + V1 (s/es) = Present Simple', 'Subject + V2 = Past Simple', 'Subject + will + V1 = Future'], notes: 'Tense shows the time of action.', videoCount: 5, mcqCount: 25, pdfAvailable: true, estimatedTime: 70 },
      { id: 'en_ch3', subjectId: 'english', title: 'Writing: Paragraph', titleBn: 'লেখা: অনুচ্ছেদ', number: 3, description: 'How to write effective paragraphs', keyPoints: ['Topic sentence', 'Supporting sentences', 'Concluding sentence'], formulas: [], notes: 'A good paragraph has one main idea supported by details.', videoCount: 2, mcqCount: 10, pdfAvailable: true, estimatedTime: 45 },
    ];
  }

  private getMathChapters(): Chapter[] {
    return [
      { id: 'math_ch1', subjectId: 'math', title: 'Real Numbers', titleBn: 'বাস্তব সংখ্যা', number: 1, description: 'Types and properties of real numbers', keyPoints: ['Natural numbers', 'Integers', 'Rational & Irrational numbers', 'Number line'], formulas: ['a + b = b + a (Commutative)', 'a × (b + c) = ab + ac (Distributive)', '√2 = 1.41421...'], notes: 'Real numbers include all rational and irrational numbers.', videoCount: 4, mcqCount: 20, pdfAvailable: true, estimatedTime: 55 },
      { id: 'math_ch2', subjectId: 'math', title: 'Algebra: Polynomials', titleBn: 'বীজগণিত: বহুপদী', number: 2, description: 'Polynomials and factorization', keyPoints: ['Types of polynomials', 'Addition & subtraction', 'Multiplication', 'Factorization'], formulas: ['(a+b)² = a² + 2ab + b²', '(a-b)² = a² - 2ab + b²', '(a+b)(a-b) = a² - b²', 'a³ + b³ = (a+b)(a²-ab+b²)'], notes: 'Polynomials are algebraic expressions with multiple terms.', videoCount: 6, mcqCount: 30, pdfAvailable: true, estimatedTime: 80 },
      { id: 'math_ch3', subjectId: 'math', title: 'Geometry: Triangles', titleBn: 'জ্যামিতি: ত্রিভুজ', number: 3, description: 'Properties and theorems of triangles', keyPoints: ['Types of triangles', 'Pythagorean theorem', 'Area formulas', 'Congruence'], formulas: ['Area = ½ × base × height', 'Perimeter = a + b + c', 'a² + b² = c² (Pythagorean)', 'Area = √[s(s-a)(s-b)(s-c)] (Heron\'s)'], notes: 'A triangle is a polygon with three sides and three angles.', videoCount: 5, mcqCount: 25, pdfAvailable: true, estimatedTime: 65 },
    ];
  }

  private getScienceChapters(): Chapter[] {
    return [
      { id: 'sci_ch1', subjectId: 'science', title: 'Cell: The Unit of Life', titleBn: 'কোষ: জীবনের একক', number: 1, description: 'Structure and function of cells', keyPoints: ['Cell membrane', 'Nucleus', 'Cytoplasm', 'Plant vs Animal cells'], formulas: [], notes: 'The cell is the basic structural and functional unit of all living organisms.', videoCount: 4, mcqCount: 18, pdfAvailable: true, estimatedTime: 50 },
      { id: 'sci_ch2', subjectId: 'science', title: 'Motion and Forces', titleBn: 'গতি ও বল', number: 2, description: 'Newton\'s laws of motion', keyPoints: ['Speed and velocity', 'Acceleration', 'Newton\'s 3 laws', 'Gravity'], formulas: ['Speed = Distance / Time', 'F = ma', 'v = u + at', 'v² = u² + 2as'], notes: 'Force causes a change in motion of an object.', videoCount: 5, mcqCount: 22, pdfAvailable: true, estimatedTime: 60 },
    ];
  }

  private getICTChapters(): Chapter[] {
    return [
      { id: 'ict_ch1', subjectId: 'ict', title: 'Introduction to Computers', titleBn: 'কম্পিউটার পরিচিতি', number: 1, description: 'Basic concepts of computing', keyPoints: ['Hardware & Software', 'Input/Output devices', 'CPU components', 'Memory types'], formulas: ['1 Byte = 8 bits', '1 KB = 1024 Bytes', '1 MB = 1024 KB'], notes: 'A computer processes data to produce useful information.', videoCount: 3, mcqCount: 15, pdfAvailable: true, estimatedTime: 40 },
      { id: 'ict_ch2', subjectId: 'ict', title: 'Internet & Networking', titleBn: 'ইন্টারনেট ও নেটওয়ার্কিং', number: 2, description: 'How the internet works', keyPoints: ['IP address', 'DNS', 'HTTP/HTTPS', 'LAN/WAN/MAN'], formulas: [], notes: 'The internet is a global network of interconnected computers.', videoCount: 4, mcqCount: 18, pdfAvailable: true, estimatedTime: 50 },
    ];
  }

  private getPhysicsChapters(): Chapter[] {
    return [
      { id: 'phy_ch1', subjectId: 'physics', title: 'Physical World & Measurement', titleBn: 'ভৌত জগৎ ও পরিমাপ', number: 1, description: 'Fundamental quantities and units', keyPoints: ['SI Units', 'Fundamental quantities', 'Derived quantities', 'Significant figures'], formulas: ['Density = Mass / Volume', 'Speed = Distance / Time', '1 m = 100 cm = 1000 mm'], notes: 'Measurement is the foundation of all physical science.', videoCount: 3, mcqCount: 15, pdfAvailable: true, estimatedTime: 45 },
      { id: 'phy_ch2', subjectId: 'physics', title: 'Mechanics: Motion', titleBn: 'বলবিদ্যা: গতি', number: 2, description: 'Linear motion and equations', keyPoints: ['Displacement', 'Velocity', 'Acceleration', 'Projectile motion'], formulas: ['v = u + at', 's = ut + ½at²', 'v² = u² + 2as', 'F = ma', 'W = mg'], notes: 'Kinematics describes motion without reference to its cause.', videoCount: 6, mcqCount: 28, pdfAvailable: true, estimatedTime: 75 },
    ];
  }

  getMCQQuestions(subjectId: string, chapterId?: string): QuizQuestion[] {
    const allQuestions: QuizQuestion[] = [
      // Math questions
      { id: 'q1', subjectId: 'math', chapterId: 'math_ch1', question: 'What is √144?', options: ['10', '12', '14', '16'], correctAnswer: 1, explanation: '12 × 12 = 144, so √144 = 12', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q2', subjectId: 'math', chapterId: 'math_ch2', question: 'Expand (a + b)²', options: ['a² + b²', 'a² + 2ab + b²', 'a² - 2ab + b²', '2a + 2b'], correctAnswer: 1, explanation: '(a+b)² = a² + 2ab + b² by the square of a binomial formula', difficulty: 'medium', marks: 1, type: 'mcq' },
      { id: 'q3', subjectId: 'math', chapterId: 'math_ch3', question: 'Area of a triangle with base 6cm and height 4cm?', options: ['24 cm²', '12 cm²', '10 cm²', '20 cm²'], correctAnswer: 1, explanation: 'Area = ½ × base × height = ½ × 6 × 4 = 12 cm²', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q4', subjectId: 'math', chapterId: 'math_ch1', question: 'Which of these is an irrational number?', options: ['0.5', '¾', '√3', '1.25'], correctAnswer: 2, explanation: '√3 = 1.7320508... is non-terminating and non-repeating, so it\'s irrational', difficulty: 'medium', marks: 1, type: 'mcq' },
      // Science questions
      { id: 'q5', subjectId: 'science', chapterId: 'sci_ch1', question: 'Which organelle is called the "powerhouse of the cell"?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Vacuole'], correctAnswer: 2, explanation: 'Mitochondria produces ATP energy through cellular respiration', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q6', subjectId: 'science', chapterId: 'sci_ch2', question: 'Unit of force in SI system?', options: ['Joule', 'Watt', 'Newton', 'Pascal'], correctAnswer: 2, explanation: 'Newton (N) is the SI unit of force. F = ma where mass is kg and acceleration is m/s²', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q7', subjectId: 'science', chapterId: 'sci_ch2', question: 'A car travels 100 km in 2 hours. What is its average speed?', options: ['200 km/h', '50 km/h', '100 km/h', '25 km/h'], correctAnswer: 1, explanation: 'Speed = Distance/Time = 100/2 = 50 km/h', difficulty: 'easy', marks: 1, type: 'mcq' },
      // Physics questions
      { id: 'q8', subjectId: 'physics', chapterId: 'phy_ch2', question: 'Which law states F = ma?', options: ['Newton\'s 1st Law', 'Newton\'s 2nd Law', 'Newton\'s 3rd Law', 'Law of Gravitation'], correctAnswer: 1, explanation: 'Newton\'s 2nd Law of Motion: Force = mass × acceleration', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q9', subjectId: 'physics', chapterId: 'phy_ch1', question: 'SI unit of mass?', options: ['Gram', 'Pound', 'Kilogram', 'Newton'], correctAnswer: 2, explanation: 'Kilogram (kg) is the SI base unit of mass', difficulty: 'easy', marks: 1, type: 'mcq' },
      // ICT questions
      { id: 'q10', subjectId: 'ict', chapterId: 'ict_ch1', question: 'How many bits make 1 Byte?', options: ['4', '8', '16', '32'], correctAnswer: 1, explanation: '1 Byte = 8 bits. This is the standard unit of digital information', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q11', subjectId: 'ict', chapterId: 'ict_ch2', question: 'WWW stands for?', options: ['World Wide Web', 'Wide World Web', 'World Web Wide', 'Web World Wide'], correctAnswer: 0, explanation: 'WWW = World Wide Web, the information system of internet resources', difficulty: 'easy', marks: 1, type: 'mcq' },
      // English questions
      { id: 'q12', subjectId: 'english', chapterId: 'en_ch2', question: '"She ___ to school every day." (Present Simple)', options: ['go', 'goes', 'going', 'gone'], correctAnswer: 1, explanation: 'Third person singular (she/he/it) takes verb + s/es in Present Simple', difficulty: 'easy', marks: 1, type: 'mcq' },
      { id: 'q13', subjectId: 'english', chapterId: 'en_ch2', question: 'Correct Past Simple of "run"?', options: ['runned', 'runs', 'ran', 'running'], correctAnswer: 2, explanation: '"run" is an irregular verb. Its past simple form is "ran"', difficulty: 'medium', marks: 1, type: 'mcq' },
    ];

    return allQuestions.filter(q => q.subjectId === subjectId && (!chapterId || q.chapterId === chapterId));
  }

  getCQQuestions(subjectId: string): CQQuestion[] {
    return [
      {
        id: 'cq1', subjectId: 'math', chapterId: 'math_ch2',
        stimulusText: 'দুটি বর্গের বাহুর দৈর্ঘ্য যথাক্রমে (a + b) এবং (a - b) একক।',
        board: 'Dhaka', year: 2023,
        questions: [
          { part: 'ka', question: 'বর্গদ্বয়ের ক্ষেত্রফলের সমষ্টি নির্ণয় করো।', marks: 2, modelAnswer: '(a+b)² + (a-b)² = a² + 2ab + b² + a² - 2ab + b² = 2a² + 2b² = 2(a² + b²)', writingTips: ['সূত্র লিখুন', 'প্রতিস্থাপন করুন', 'সরল করুন'] },
          { part: 'kha', question: 'বড় বর্গের ক্ষেত্রফল থেকে ছোট বর্গের ক্ষেত্রফল বিয়োগ করো।', marks: 4, modelAnswer: '(a+b)² - (a-b)² = [a² + 2ab + b²] - [a² - 2ab + b²] = 4ab', writingTips: ['দুটি ক্ষেত্রফল আলাদা করুন', 'বিয়োগ করুন', 'ফলাফল যাচাই করুন'] },
          { part: 'ga', question: 'প্রমাণ করো যে বড় বর্গের ক্ষেত্রফল ছোট বর্গের ক্ষেত্রফলের চেয়ে 4ab বেশি।', marks: 4, modelAnswer: 'LHS = (a+b)² - (a-b)² = (a+b+a-b)(a+b-a+b) = 2a × 2b = 4ab = RHS [Proved]', writingTips: ['LHS থেকে শুরু করুন', 'সূত্র প্রয়োগ করুন', 'RHS দেখান'] },
        ]
      },
      {
        id: 'cq2', subjectId: 'science', chapterId: 'sci_ch1',
        stimulusText: 'একটি উদ্ভিদ কোষে ক্লোরোপ্লাস্ট ও মাইটোকন্ড্রিয়া উভয়ই বিদ্যমান।',
        board: 'Chattogram', year: 2023,
        questions: [
          { part: 'ka', question: 'ক্লোরোফিল কোথায় থাকে?', marks: 1, modelAnswer: 'ক্লোরোফিল ক্লোরোপ্লাস্টে থাকে।', writingTips: ['সরাসরি উত্তর দিন'] },
          { part: 'kha', question: 'কোষের "শক্তিঘর" কোনটি এবং কেন?', marks: 4, modelAnswer: 'মাইটোকন্ড্রিয়াকে কোষের শক্তিঘর বলা হয় কারণ এটি শ্বসন প্রক্রিয়ায় ATP (শক্তি) উৎপাদন করে।', writingTips: ['নাম বলুন', 'কারণ ব্যাখ্যা করুন', 'ATP উল্লেখ করুন'] },
          { part: 'ga', question: 'উদ্ভিদ ও প্রাণী কোষের পার্থক্য আলোচনা করো।', marks: 4, modelAnswer: 'উদ্ভিদ কোষে: কোষপ্রাচীর আছে, ক্লোরোপ্লাস্ট আছে, কেন্দ্রীয় গহ্বর (ভ্যাকুওল) বড়। প্রাণী কোষে: কোষপ্রাচীর নেই, সেন্ট্রিওল আছে, গহ্বর ছোট বা অনুপস্থিত।', writingTips: ['ছক আকারে লিখুন', 'উভয়ের বৈশিষ্ট্য তুলনা করুন'] },
        ]
      }
    ];
  }

  getVideos(subjectId?: string, chapterId?: string): Video[] {
    const videos: Video[] = [
      { id: 'v1', subjectId: 'math', chapterId: 'math_ch2', title: 'Polynomial Basics — Concept Video', duration: '12:34', thumbnail: 'https://via.placeholder.com/320x180/2d6a4f/white?text=Polynomial+Basics', type: 'concept', watched: false, progress: 0 },
      { id: 'v2', subjectId: 'math', chapterId: 'math_ch2', title: 'Full Chapter: Polynomials', duration: '45:20', thumbnail: 'https://via.placeholder.com/320x180/2d6a4f/white?text=Full+Chapter+Polynomials', type: 'full-chapter', watched: false, progress: 60 },
      { id: 'v3', subjectId: 'math', chapterId: 'math_ch3', title: 'Triangle Theorems Explained', duration: '18:45', thumbnail: 'https://via.placeholder.com/320x180/2d6a4f/white?text=Triangle+Theorems', type: 'concept', watched: true, progress: 100 },
      { id: 'v4', subjectId: 'physics', chapterId: 'phy_ch2', title: 'Newton\'s Laws — Complete Guide', duration: '32:10', thumbnail: 'https://via.placeholder.com/320x180/f4a261/white?text=Newton+Laws', type: 'full-chapter', watched: false, progress: 30 },
      { id: 'v5', subjectId: 'science', chapterId: 'sci_ch1', title: 'Cell Structure & Function', duration: '22:15', thumbnail: 'https://via.placeholder.com/320x180/6a4c93/white?text=Cell+Structure', type: 'concept', watched: false, progress: 0 },
      { id: 'v6', subjectId: 'english', chapterId: 'en_ch2', title: 'Tense Mastery — Exam Prep', duration: '28:00', thumbnail: 'https://via.placeholder.com/320x180/457b9d/white?text=Tense+Mastery', type: 'exam-prep', watched: false, progress: 0 },
      { id: 'v7', subjectId: 'math', chapterId: 'math_ch1', title: 'Real Numbers — SSC Exam Special', duration: '35:00', thumbnail: 'https://via.placeholder.com/320x180/2d6a4f/white?text=Real+Numbers+SSC', type: 'exam-prep', watched: false, progress: 0 },
      { id: 'v8', subjectId: 'ict', chapterId: 'ict_ch1', title: 'Computer Basics for Beginners', duration: '15:30', thumbnail: 'https://via.placeholder.com/320x180/0077b6/white?text=Computer+Basics', type: 'concept', watched: false, progress: 0 },
    ];
    if (subjectId) return videos.filter(v => v.subjectId === subjectId && (!chapterId || v.chapterId === chapterId));
    return videos;
  }

  getPdfResources(classNum?: number, subjectId?: string): PdfResource[] {
    const pdfs: PdfResource[] = [
      { id: 'pdf1', title: 'Math Chapter Notes — Class 9', subjectId: 'math', class: 9, type: 'notes', fileSize: '2.4 MB', pages: 24, downloadCount: 1245, isPremium: false },
      { id: 'pdf2', title: 'Physics Formula Sheet — All Chapters', subjectId: 'physics', class: 9, type: 'formula', fileSize: '0.8 MB', pages: 8, downloadCount: 3210, isPremium: false },
      { id: 'pdf3', title: 'SSC Bangla Suggestion 2024', subjectId: 'bangla', class: 10, type: 'suggestion', fileSize: '1.2 MB', pages: 15, downloadCount: 5678, isPremium: true },
      { id: 'pdf4', title: 'English Grammar — Quick Summary', subjectId: 'english', class: 8, type: 'summary', fileSize: '1.5 MB', pages: 18, downloadCount: 2341, isPremium: false },
      { id: 'pdf5', title: 'Science Model Test Paper — Class 8', subjectId: 'science', class: 8, type: 'model-test', fileSize: '0.6 MB', pages: 6, downloadCount: 876, isPremium: true },
      { id: 'pdf6', title: 'ICT Chapter Notes — Class 10', subjectId: 'ict', class: 10, type: 'notes', fileSize: '1.8 MB', pages: 20, downloadCount: 1567, isPremium: false },
      { id: 'pdf7', title: 'Math Formula Sheet — Algebra', subjectId: 'math', class: 10, type: 'formula', fileSize: '0.5 MB', pages: 5, downloadCount: 4321, isPremium: false },
      { id: 'pdf8', title: 'Chemistry Notes — Class 9', subjectId: 'chemistry', class: 9, type: 'notes', fileSize: '3.1 MB', pages: 32, downloadCount: 987, isPremium: true },
    ];
    return pdfs.filter(p => (!classNum || p.class === classNum) && (!subjectId || p.subjectId === subjectId));
  }

  getPricingPlans(): PricingPlan[] {
    return [
      {
        id: 'free', name: 'Free', nameBn: 'বিনামূল্যে', price: 0, currency: '৳', period: 'free',
        features: ['Notes (সীমিত)', 'Limited MCQ (৫০টি/মাস)', 'Some Videos (কিছু ভিডিও)', 'Question Bank (সীমিত)'],
        notIncluded: ['All Videos', 'Mock Tests', 'AI Tutor', 'Board Questions', 'Study Plans', 'PDF Downloads'],
        isPopular: false, color: '#6c757d', buttonText: 'Start Free'
      },
      {
        id: 'basic', name: 'Basic', nameBn: 'বেসিক', price: 99, currency: '৳', period: 'month',
        features: ['সব Notes ও Summary', 'Unlimited MCQ Practice', 'All Videos', 'Board Question Bank', 'PDF Downloads', 'Performance Analytics'],
        notIncluded: ['AI Tutor', 'Mock Tests', 'Study Plans', 'Live Class'],
        isPopular: false, color: '#2d6a4f', buttonText: 'Get Basic'
      },
      {
        id: 'premium', name: 'Premium', nameBn: 'প্রিমিয়াম', price: 199, currency: '৳', period: 'month',
        features: ['Everything in Basic', 'Mock Tests & Leaderboard', 'AI Tutor Chatbot', 'AI Study Plan Generator', 'AI Homework Solver', 'Live Class Access', 'Priority Support'],
        notIncluded: [],
        isPopular: true, color: '#1d3557', buttonText: 'Go Premium'
      },
      {
        id: 'yearly', name: 'Annual', nameBn: 'বার্ষিক', price: 999, currency: '৳', period: 'year',
        features: ['Everything in Premium', 'Save ৳1389/year', 'Parent Dashboard', 'Teacher Features', 'Offline PDF Access', 'Exam Tracker'],
        notIncluded: [],
        isPopular: false, color: '#e63946', buttonText: 'Best Value'
      }
    ];
  }

  getMockTests(): MockTest[] {
    return [
      { id: 'mt1', title: 'SSC Mathematics Full Mock Test', subjectId: 'math', class: 10, duration: 30, totalMarks: 25, questions: this.getMCQQuestions('math').slice(0, 5), type: 'full-subject' },
      { id: 'mt2', title: 'Science Chapter Test — Cell', subjectId: 'science', class: 8, duration: 20, totalMarks: 15, questions: this.getMCQQuestions('science').slice(0, 3), type: 'chapter' },
      { id: 'mt3', title: 'Weekly Test — Physics & Math', subjectId: 'physics', class: 9, duration: 25, totalMarks: 20, questions: [...this.getMCQQuestions('physics'), ...this.getMCQQuestions('math').slice(0, 2)], type: 'weekly' },
    ];
  }
}
