import { redis } from "./redis.js";

export type Job<T =unknown> = {
    id: string;
    type: string;
    payload: T;
    createdAt: number;
    attemps: number;
    maxAttemps: number;
};

const QUEUE_NAME = "jobs";

export class JobQueue {
    async enqueue<T>(
        type: string,
        payload: T,
        maxAttemps = 3
    ): Promise<Job<T>> {
        const job: Job<T> = {
            id: crypto.randomUUID(),
            type,
            payload,
            createdAt: Date.now(),
            attemps: 0,
            maxAttemps
        };

        await redis.lpush(QUEUE_NAME, JSON.stringify(job));

        return job;
    }

    async dequeue(): Promise<Job | null> {
        const result = await redis.brpop(QUEUE_NAME, 0);

        if (!result) return null;

        const [, jobString] = result;

        return JSON.parse(jobString) as Job;
    }

    async requeue(job: Job): Promise<void> {
        const updateJob: Job = {
            ...job,
            attemps: job.attemps + 1
        };

        await redis.lpush(QUEUE_NAME, JSON.stringify(updateJob));
    }
}