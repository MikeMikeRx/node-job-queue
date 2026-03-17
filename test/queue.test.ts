import { beforeEach, describe, expect, it } from "vitest";
import { redis } from "../src/redis.js";
import { JobQueue } from "../src/queue.js";

describe("JobQueue", ()=> {
    const queue = new JobQueue();

    beforeEach(async ()=> {
        await redis.flushdb();
    });

    it("enqueues a job", async ()=> {
        const job = await queue.enqueue("send-email", {
            to: "user@example.com",
            subject: "Welcome",
            body: "Hello"
        });

        expect(job.type).toBe("send-email");
        expect(job.attempts).toBe(0);
        expect(job.maxAttempts).toBe(3);
    });

    it("dequeues a job", async ()=> {
        await queue.enqueue("send-email", {
            to: "user@example.com",
            subject: "Welcome",
            body: "Hello"
        });

        const job = await queue.dequeue();

        expect(job).not.toBeNull();
        expect(job?.type).toBe("send-email");
    });

    it("requeues a job with incremented attempts", async () => {
        const job = await queue.enqueue("send-email", {
            to: "user@example.com",
            subject: "Welcome",
            body: "Hello"
        });

        await queue.requeue(job);
        
        const originalJob = await queue.dequeue();
        const retriedJob = await queue.dequeue();
        
        expect(originalJob?.attempts).toBe(0);
        expect(retriedJob?.attempts).toBe(1);       
    });

    it("moves a job to fail queue", async ()=> {
        const job = await queue.enqueue("send-email", {
            to: "user@example.com",
            subject: "Welcome",
            body: "Hello"
        });

        await queue.moveToFailed(job);

        const failedJobs = await redis.lrange("jobs:failed", 0, -1);
        expect(failedJobs).toHaveLength(1);

        const parsed = JSON.parse(failedJobs[0]);
        expect(parsed.id).toBe(job.id);
    });
});