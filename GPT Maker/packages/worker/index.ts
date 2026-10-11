import PgBoss from 'pg-boss';

const pgboss = new PgBoss({
  connectionString: process.env.DATABASE_URL || 'postgres://localhost/gptmaker',
  schema: 'pgboss',
});

export async function initializeWorker() {
  await pgboss.start();
  console.log('✅ pg-boss job queue initialized');

  // Register handlers
  pgboss.work(
    'automation-run',
    async (job) => {
      console.log('▶️ Processing automation run:', job.data);
      // Handler implementation
      return { success: true };
    },
    {
      teamSize: 5,
      teamConcurrency: 2,
    }
  );

  return pgboss;
}

export async function enqueueJob(
  queue: string,
  data: any,
  options = {}
) {
  return pgboss.send(queue, data, options);
}

export { pgboss };
