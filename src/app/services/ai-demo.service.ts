import { Injectable } from '@angular/core';

export interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

/** Frontend-only AI demo using condition-based TypeScript responses */
@Injectable({ providedIn: 'root' })
export class AiDemoService {

  private tutorResponses: { [key: string]: string } = {
    'pythagorean': 'পিথাগোরাসের সূত্র হলো: **a² + b² = c²** যেখানে c হলো অতিভুজ। উদাহরণ: যদি a=3, b=4 হয়, তাহলে c = √(9+16) = √25 = 5।',
    'polynomial': 'বহুপদী হলো একটি বীজগাণিতিক রাশি যেমন **ax² + bx + c**। (a+b)² = a² + 2ab + b² — এই সূত্রটি মনে রাখুন!',
    'photosynthesis': '🌱 সালোকসংশ্লেষণ: **6CO₂ + 6H₂O + আলোক শক্তি → C₆H₁₂O₆ + 6O₂**। সবুজ উদ্ভিদ আলো ব্যবহার করে খাদ্য তৈরি করে।',
    'newton': 'নিউটনের ৩টি গতিসূত্র: 1️⃣ জড়তার সূত্র 2️⃣ **F = ma** (বল = ভর × ত্বরণ) 3️⃣ ক্রিয়া-প্রতিক্রিয়ার সূত্র',
    'cell': '🔬 কোষের প্রধান অংশ: কোষঝিল্লি, নিউক্লিয়াস, সাইটোপ্লাজম। মাইটোকন্ড্রিয়া = শক্তিঘর, ক্লোরোপ্লাস্ট = সালোকসংশ্লেষণের স্থান।',
    'tense': '⏰ Tense মনে রাখুন: Present: V1/V1+s, Past: V2, Future: will+V1. Continuous: be+V-ing, Perfect: have+V3',
    'dna': 'DNA হলো ডিঅক্সিরাইবোনিউক্লিক অ্যাসিড। এটি দ্বিতন্ত্রী হেলিক্স গঠন। চারটি বেস: A-T, G-C পেয়ার।',
    'default': 'আমি বুঝতে পেরেছি! আপনার প্রশ্নটি আরও নির্দিষ্ট করুন। বিষয়ের নাম, অধ্যায় বা সমস্যাটি লিখুন — আমি সাহায্য করব। 📚'
  };

  getTutorResponse(message: string): string {
    const lower = message.toLowerCase();
    for (const key of Object.keys(this.tutorResponses)) {
      if (lower.includes(key)) return this.tutorResponses[key];
    }
    // Context-based fallback responses
    if (lower.includes('math') || lower.includes('গণিত') || lower.includes('number')) {
      return '📐 গণিতের যেকোনো সমস্যায় আমি সাহায্য করতে পারি। সংখ্যা, বীজগণিত, জ্যামিতি — সবই আওতায় আছে!';
    }
    if (lower.includes('english') || lower.includes('grammar') || lower.includes('tense')) {
      return '📝 English grammar নিয়ে চিন্তিত? Tense, Narration, Transformation — সব ব্যাখ্যা করব সহজভাবে!';
    }
    if (lower.includes('science') || lower.includes('বিজ্ঞান')) {
      return '🔬 বিজ্ঞানের যেকোনো বিষয়ে জিজ্ঞেস করুন — পদার্থ, রসায়ন, জীববিজ্ঞান সব জানি!';
    }
    if (lower.includes('physics') || lower.includes('পদার্থ')) {
      return '⚡ পদার্থবিজ্ঞান: বল, গতি, শক্তি, আলো, তাপ — যেকোনো টপিক বুঝিয়ে দেব!';
    }
    if (lower.includes('help') || lower.includes('সাহায্য')) {
      return '😊 আমি EduCenter AI Tutor! গণিত, বিজ্ঞান, ইংরেজি, পদার্থবিজ্ঞান — যেকোনো বিষয়ে সাহায্য করতে পারি। কী জানতে চান?';
    }
    return this.tutorResponses['default'];
  }

  solveHomework(subject: string, description: string): string {
    const solutions: { [key: string]: string } = {
      'math': `**সমাধান (Mathematics)**\n\nধাপ ১: সমস্যাটি চিহ্নিত করুন\nধাপ ২: প্রাসঙ্গিক সূত্র প্রয়োগ করুন\nধাপ ৩: গণনা করুন\n\n✅ ${description.substring(0, 50)}... সংক্রান্ত সমাধান:\n\nপ্রদত্ত রাশি বিশ্লেষণ করে সঠিক সূত্র ব্যবহার করে উত্তর পাওয়া যাবে। বিস্তারিত সমাধানের জন্য অধ্যায়ের নোটস দেখুন।`,
      'science': `**সমাধান (Science)**\n\n🔬 বৈজ্ঞানিক পদ্ধতিতে সমাধান:\n\n1. পর্যবেক্ষণ করুন\n2. হাইপোথিসিস তৈরি করুন\n3. পরীক্ষা-নিরীক্ষা করুন\n\n✅ "${description.substring(0, 40)}..." এর উত্তর বিজ্ঞানের মূলনীতি অনুসরণ করে দেওয়া হলো।`,
      'english': `**Solution (English)**\n\n📝 Step-by-step approach:\n\n1. Identify the topic\n2. Structure your answer\n3. Use proper grammar\n\n✅ For "${description.substring(0, 40)}..." — Apply the relevant grammar rule or writing technique taught in class.`,
      'default': `**সমাধান**\n\n✅ "${description.substring(0, 50)}..." এই প্রশ্নের সমাধান:\n\nএই ধরনের সমস্যা সমাধানে প্রথমে মূল বিষয়গুলো চিহ্নিত করুন। তারপর পদ্ধতিগতভাবে সমাধান করুন। প্রয়োজনে সংশ্লিষ্ট অধ্যায়ের নোটস ও উদাহরণ দেখুন।`
    };
    return solutions[subject.toLowerCase()] || solutions['default'];
  }

  generateStudyPlan(className: number, examDate: string, weakSubjects: string[]): string {
    const daysLeft = Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    const weakList = weakSubjects.join(', ') || 'Mathematics, Science';
    return `
## 📚 AI Study Plan — Class ${className}

**পরীক্ষার আগে বাকি সময়: ${daysLeft} দিন**

### সাপ্তাহিক রুটিন:
| দিন | বিষয় | সময় |
|-----|-------|------|
| শনিবার | ${weakList.split(',')[0] || 'Mathematics'} | ২ ঘন্টা |
| রবিবার | English | ১.৫ ঘন্টা |
| সোমবার | ${weakList.split(',')[1] || 'Science'} | ২ ঘন্টা |
| মঙ্গলবার | Bangla | ১.৫ ঘন্টা |
| বুধবার | ICT + BGS | ১ ঘন্টা |
| বৃহস্পতিবার | Mock Test | ৩ ঘন্টা |
| শুক্রবার | Revision + Rest | ১ ঘন্টা |

### দুর্বল বিষয়ে মনোযোগ দিন:
${weakList.split(',').map((s, i) => `${i+1}. **${s.trim()}** — প্রতিদিন অন্তত ৩০ মিনিট অতিরিক্ত সময় দিন`).join('\n')}

### পরামর্শ:
- 📖 প্রতিদিন নোটস পড়ুন
- ✏️ MCQ Practice করুন
- 🎯 Weekly Mock Test দিন
- 😴 রাত ১০টার মধ্যে ঘুমান
- 🍎 সুষম খাবার খান ও পানি পান করুন

*এই পরিকল্পনা অনুসরণ করলে পরীক্ষায় ভালো ফলাফল নিশ্চিত!* ✅
    `;
  }
}
