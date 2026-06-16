export interface PricingPlan {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  currency: string;
  period: 'month' | 'year' | 'free';
  features: string[];
  notIncluded: string[];
  isPopular: boolean;
  color: string;
  buttonText: string;
}

export interface QuestionBankFilter {
  class?: number;
  subjectId?: string;
  chapterId?: string;
  board?: string;
  year?: number;
  type?: 'mcq' | 'cq';
}

export const BOARDS = [
  'Dhaka', 'Chattogram', 'Rajshahi', 'Sylhet',
  'Barishal', 'Cumilla', 'Dinajpur', 'Mymensingh', 'Jashore'
];
