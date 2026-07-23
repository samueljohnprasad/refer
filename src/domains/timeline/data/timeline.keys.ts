export const timelineKeys = {
  all: ['timeline'] as const,
  daily: (page: number, pageSize: number) => ['timeline', 'daily', { page, pageSize }] as const,
  dailyInfinite: (pageSize: number) => ['timeline', 'daily', 'infinite', { pageSize }] as const,
  weekly: (page: number, pageSize: number) => ['timeline', 'weekly', { page, pageSize }] as const,
  weeklyInfinite: (pageSize: number) => ['timeline', 'weekly', 'infinite', { pageSize }] as const,
  monthly: (page: number, pageSize: number) => ['timeline', 'monthly', { page, pageSize }] as const,
  monthlyInfinite: (pageSize: number) => ['timeline', 'monthly', 'infinite', { pageSize }] as const,
};
