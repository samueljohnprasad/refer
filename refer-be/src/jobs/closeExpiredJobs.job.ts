import cron from 'node-cron';
import { JobService } from '../services/job.service';
import { logger } from '../utils/logger';

/**
 * Job to close expired job posts
 * Runs daily at midnight
 */
export const setupCloseExpiredJobsJob = () => {
  // Schedule the job to run daily at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      logger.info('Running job: closeExpiredJobPosts');
      const count = await JobService.closeExpiredJobPosts();
      logger.info(`Closed ${count} expired job posts`);
    } catch (error) {
      logger.error(`Error in closeExpiredJobs job: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
};
