type MoodStatus = 'happy' | 'sad' | 'neutral' | 'excited' | 'anxious' | 'grateful' | 'tired';

export interface JournalEntry {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  mood_status: MoodStatus;
}

export const journalEntries: JournalEntry[] = [
  {
    id: '1',
    created_at: '2025-07-20T09:15:00+05:30',
    updated_at: '2025-07-20T09:15:00+05:30',
    title: 'A Productive Morning',
    content: 'Woke up early and went for a refreshing morning walk. The weather was perfect and I felt energized for the day ahead.',
    mood_status: 'happy'
  },
  {
    id: '2',
    created_at: '2025-07-21T22:30:00+05:30',
    updated_at: '2025-07-21T22:45:00+05:30',
    title: 'Project Deadline Stress',
    content: 'The project deadline is approaching and there\'s still so much to do. Feeling a bit overwhelmed but trying to stay focused.',
    mood_status: 'anxious'
  },
  {
    id: '3',
    created_at: '2025-07-22T18:20:00+05:30',
    updated_at: '2025-07-22T18:20:00+05:30',
    title: 'Team Celebration',
    content: 'Our team successfully launched the new feature today! Everyone was in high spirits during the celebration.',
    mood_status: 'excited'
  },
  {
    id: '4',
    created_at: '2025-07-23T07:45:00+05:30',
    updated_at: '2025-07-23T07:45:00+05:30',
    title: 'Morning Coffee',
    content: 'Enjoying a quiet morning with my favorite coffee. The simple pleasures in life are often the best.',
    mood_status: 'grateful'
  },
  {
    id: '5',
    created_at: '2025-07-24T23:10:00+05:30',
    updated_at: '2025-07-24T23:10:00+05:30',
    title: 'Long Day',
    content: 'Worked late again today. Feeling exhausted but satisfied with what I accomplished.',
    mood_status: 'tired'
  },
  {
    id: '6',
    created_at: '2025-07-25T14:20:00+05:30',
    updated_at: '2025-07-25T14:20:00+05:30',
    title: 'Lunch with Friends',
    content: 'Had a great time catching up with old friends over lunch. Good food and better company.',
    mood_status: 'happy'
  },
  {
    id: '7',
    created_at: '2025-07-26T10:05:00+05:30',
    updated_at: '2025-07-26T10:05:00+05:30',
    title: 'Weekend Plans',
    content: 'Looking forward to a relaxing weekend. Planning to read that book I\'ve been putting off and maybe go for a hike.',
    mood_status: 'neutral'
  },
  {
    id: '8',
    created_at: '2025-07-26T15:30:00+05:30',
    updated_at: '2025-07-26T15:30:00+05:30',
    title: 'Unexpected Meeting',
    content: 'Had an unexpected meeting with the team lead. Got some good feedback on my project.',
    mood_status: 'excited'
  },
  {
    id: '9',
    created_at: '2025-07-25T08:15:00+05:30',
    updated_at: '2025-07-25T08:15:00+05:30',
    title: 'Morning Run',
    content: 'Went for a refreshing morning run. The park was peaceful and the weather was perfect.',
    mood_status: 'happy'
  },
  {
    id: '10',
    created_at: '2025-07-24T19:45:00+05:30',
    updated_at: '2025-07-24T19:45:00+05:30',
    title: 'Movie Night',
    content: 'Watched an amazing movie tonight. The storyline was captivating and the acting was superb.',
    mood_status: 'excited'
  },
  {
    id: '11',
    created_at: '2025-07-23T11:20:00+05:30',
    updated_at: '2025-07-23T11:20:00+05:30',
    title: 'Rainy Day',
    content: 'It\'s been raining all day. Perfect weather to stay in and work on personal projects.',
    mood_status: 'neutral'
  },
  {
    id: '12',
    created_at: '2025-07-22T16:50:00+05:30',
    updated_at: '2025-07-22T16:50:00+05:30',
    title: 'Family Dinner',
    content: 'Had a wonderful dinner with family. Good food and great conversations.',
    mood_status: 'happy'
  },
  {
    id: '13',
    created_at: '2025-07-21T09:30:00+05:30',
    updated_at: '2025-07-21T09:30:00+05:30',
    title: 'New Project',
    content: 'Started working on a new project today. Feeling a bit nervous but excited about the possibilities.',
    mood_status: 'anxious'
  },
  {
    id: '14',
    created_at: '2025-07-20T20:15:00+05:30',
    updated_at: '2025-07-20T20:15:00+05:30',
    title: 'Yoga Session',
    content: 'Attended a yoga class after work. Feeling relaxed and centered.',
    mood_status: 'grateful'
  },
  {
    id: '15',
    created_at: '2025-07-19T14:10:00+05:30',
    updated_at: '2025-07-19T14:10:00+05:30',
    title: 'Weekend Getaway',
    content: 'Planning a weekend getaway with friends. Looking forward to the break.',
    mood_status: 'excited'
  },
  {
    id: '16',
    created_at: '2025-07-18T17:30:00+05:30',
    updated_at: '2025-07-18T17:30:00+05:30',
    title: 'Team Lunch',
    content: 'Had lunch with the team at a new restaurant. The food was delicious!',
    mood_status: 'happy'
  },
  {
    id: '17',
    created_at: '2025-07-17T10:45:00+05:30',
    updated_at: '2025-07-17T10:45:00+05:30',
    title: 'Productive Day',
    content: 'Crossed off many items from my to-do list today. Feeling accomplished!',
    mood_status: 'happy'
  },
  {
    id: '18',
    created_at: '2025-07-16T13:20:00+05:30',
    updated_at: '2025-07-16T13:20:00+05:30',
    title: 'New Book',
    content: 'Started reading a new book recommended by a friend. The first chapter is promising.',
    mood_status: 'neutral'
  },
  {
    id: '19',
    created_at: '2025-07-15T18:00:00+05:30',
    updated_at: '2025-07-15T18:00:00+05:30',
    title: 'Long Day at Work',
    content: 'Worked late to meet a deadline. Exhausted but glad it\'s done.',
    mood_status: 'tired'
  },
  {
    id: '20',
    created_at: '2025-07-14T11:10:00+05:30',
    updated_at: '2025-07-14T11:10:00+05:30',
    title: 'Morning Coffee',
    content: 'Enjoying a quiet morning with coffee and some light reading.',
    mood_status: 'grateful'
  },
  {
    id: '21',
    created_at: '2025-07-13T16:40:00+05:30',
    updated_at: '2025-07-13T16:40:00+05:30',
    title: 'Weekend Plans',
    content: 'Planning to visit the new art exhibition this weekend. Heard great things about it.',
    mood_status: 'excited'
  },
  {
    id: '22',
    created_at: '2025-07-12T09:00:00+05:30',
    updated_at: '2025-07-12T09:00:00+05:30',
    title: 'Early Start',
    content: 'Woke up early to get a head start on the day. The sunrise was beautiful.',
    mood_status: 'happy'
  }
];

export const getJournalEntries = (): Promise<{ data: JournalEntry[] }> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      resolve({ data: journalEntries });
    }, 500);
  });
};
