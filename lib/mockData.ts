import type { Issue } from './types';

const patch = (
  id: string,
  text: string,
  style: Issue['patches'][number]['style'],
  author: string,
  votes: number,
): Issue['patches'][number] => ({
  id,
  text,
  style,
  author,
  votes,
  createdAt: new Date().toISOString(),
});

export const initialIssues: Issue[] = [
  {
    id: 'homework-teacher',
    title: 'Forgot to do my homework, what should I tell the teacher?',
    body: 'I completely forgot to do my homework and class starts in 20 minutes. Need something that sounds responsible but not suspicious.',
    author: 'ryo',
    createdAt: '12 min ago',
    category: 'School',
    patches: [
      patch('p1', 'Dear Professor, due to an unexpected administrative failure within my personal productivity infrastructure, the assignment was regrettably not completed. I accept full responsibility and would appreciate the opportunity to remedy this oversight.', 'Business Formal', 'mika', 41),
      patch('p2', 'Teacher, the homework and I have agreed to separate paths. I wish it well on its journey.', 'Psychopath / Chaos', 'noah', 78),
      patch('p3', 'At dawn I awoke, yet the pages remained untouched. Fate has written another chapter, and alas, it contains no homework.', 'Poetic / Chunnibyou', 'luna', 29),
    ],
  },
  {
    id: 'crush-text',
    title: 'How do I reply without looking desperate?',
    body: 'They replied after three hours with “haha yeah”. I want to keep the conversation alive without looking like I was waiting by the phone.',
    author: 'kai',
    createdAt: '28 min ago',
    category: 'Social',
    patches: [
      patch('p4', 'Haha yeah. Anyway, what have you been up to lately?', 'Casual', 'ivy', 52),
      patch('p5', 'Acknowledged. Your response has been received and integrated into my ongoing communications strategy.', 'Corporate Passive-Aggressive', 'jules', 91),
    ],
  },
  {
    id: 'late-friend',
    title: 'I am 45 minutes late to meet my friend. What do I text?',
    body: 'I overslept. They are already there. I need an apology that does not make the situation worse.',
    author: 'sora',
    createdAt: '41 min ago',
    category: 'Friends',
    patches: [
      patch('p6', 'I am really sorry. I messed up the timing and made you wait. That was completely on me. I am leaving now.', 'Casual', 'eli', 37),
      patch('p7', 'Please accept my sincerest apologies for the temporal discrepancy that has resulted in your continued presence at the agreed location.', 'Business Formal', 'matt', 65),
    ],
  },
  {
    id: 'group-project',
    title: 'Nobody in our group project is doing anything.',
    body: 'The deadline is tomorrow. I have done most of it already and need a message that gets everyone moving without starting a war.',
    author: 'ren',
    createdAt: '1 hr ago',
    category: 'School',
    patches: [
      patch('p8', 'Hey everyone — quick check-in. We are very close to the deadline, so could everyone please finish their assigned section tonight? I will combine everything after.', 'Casual', 'aya', 46),
      patch('p9', 'As we approach the final delivery milestone, I would like to encourage all stakeholders to complete their outstanding action items at the earliest possible convenience.', 'Corporate Passive-Aggressive', 'vince', 74),
    ],
  },
];
