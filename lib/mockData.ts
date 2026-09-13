import type { Issue } from './types';

export const initialIssues: Issue[] = [
  {
    id: 'homework-teacher',
    title: 'Forgot to do my homework, what should I tell the teacher?',
    body: 'I completely forgot to do my homework and class starts in 20 minutes. Need something that sounds responsible but not suspicious.',
    author: 'ryo',
    createdAt: '12 min ago',
    patches: [
      {
        id: 'p1',
        text: 'Dear Professor, due to an unexpected administrative failure within my personal productivity infrastructure, the assignment was regrettably not completed. I accept full responsibility and would appreciate the opportunity to remedy this oversight.',
        style: 'Business Formal',
        author: 'mika',
        votes: 41,
      },
      {
        id: 'p2',
        text: 'Teacher, the homework and I have agreed to separate paths. I wish it well on its journey.',
        style: 'Psychopath / Chaos',
        author: 'noah',
        votes: 78,
      },
      {
        id: 'p3',
        text: 'At dawn I awoke, yet the pages remained untouched. Fate has written another chapter, and alas, it contains no homework.',
        style: 'Poetic / Chunnibyou',
        author: 'luna',
        votes: 29,
      },
    ],
  },
  {
    id: 'crush-text',
    title: 'How do I reply to a crush without looking desperate?',
    body: 'They replied after three hours with “haha yeah”. I want to keep the conversation alive without looking like I was waiting by the phone.',
    author: 'kai',
    createdAt: '28 min ago',
    patches: [
      {
        id: 'p4',
        text: 'Haha yeah. Anyway, what have you been up to lately?',
        style: 'Casual',
        author: 'ivy',
        votes: 52,
      },
      {
        id: 'p5',
        text: 'Acknowledged. Your response has been received and integrated into my ongoing communications strategy.',
        style: 'Corporate Passive-Aggressive',
        author: 'jules',
        votes: 91,
      },
    ],
  },
  {
    id: 'late-friend',
    title: 'I am 45 minutes late to meet my friend. What do I text?',
    body: 'I overslept. They are already there. I need an apology that does not make the situation worse.',
    author: 'sora',
    createdAt: '41 min ago',
    patches: [
      {
        id: 'p6',
        text: 'I am really sorry. I messed up the timing and made you wait. That was completely on me. I am leaving now.',
        style: 'Casual',
        author: 'eli',
        votes: 37,
      },
      {
        id: 'p7',
        text: 'Please accept my sincerest apologies for the temporal discrepancy that has resulted in your continued presence at the agreed location.',
        style: 'Business Formal',
        author: 'matt',
        votes: 65,
      },
    ],
  },
  {
    id: 'group-project',
    title: 'Nobody in our group project is doing anything.',
    body: 'The deadline is tomorrow. I have done most of it already and need a message that gets everyone moving without starting a war.',
    author: 'ren',
    createdAt: '1 hr ago',
    patches: [
      {
        id: 'p8',
        text: 'Hey everyone — quick check-in. We are very close to the deadline, so could everyone please finish their assigned section tonight? I will combine everything after.',
        style: 'Casual',
        author: 'aya',
        votes: 46,
      },
      {
        id: 'p9',
        text: 'As we approach the final delivery milestone, I would like to encourage all stakeholders to complete their outstanding action items at the earliest possible convenience.',
        style: 'Corporate Passive-Aggressive',
        author: 'vince',
        votes: 74,
      },
    ],
  },
];