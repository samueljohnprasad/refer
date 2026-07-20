export const timelineKeys = {
  all: ['timeline'] as const,
  daily: (page: number, pageSize: number) => ['timeline', 'daily', { page, pageSize }] as const,
  weekly: (page: number, pageSize: number) => ['timeline', 'weekly', { page, pageSize }] as const,
  monthly: (page: number, pageSize: number) => ['timeline', 'monthly', { page, pageSize }] as const,
};
