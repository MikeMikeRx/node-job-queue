import { JobQueue, type Job } from "./queue.js";
import { handleSendEmail, type SendEmailPayload } from "./jobs/sendEmail.js";

const queue = new JobQueue();

async function processJob(job: Job): Promise<void> {
    switch (job.type) {
        case "send-email":
            await handleSendEmail(job.payload as SendEmailPayload);
            break;
        default:
            throw new Error(`Unknown job type: ${job.type}`);
    }
}

async function startWorker(): Promise<void> {
    console.log("Worker started");

    while (true) {
        const job = await queue.dequeue();

        if (!job) {
            continue;
        }

        try {
            console.log(`Processing job ${job.id} (${job.type})`);
            await processJob(job);
            console.log(`Completed job ${job.id}`);
        } catch (err) {
            console.error(`Failed job ${job.id}`, err);
        }
    }
}

startWorker().catch((err) => {
    console.error("Worker crashed", err);
    process.exit(1);
});