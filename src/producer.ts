import { JobQueue } from "./queue.js";

const queue = new JobQueue();

async function main() {
    const job = await queue.enqueue("send-email", {
        to: "user@example.com",
        subject: "welcome",
        body: "Hello from job queue"
    });

    console.log("Job added:", job);
}

main().catch((err) => {
    console.error("Producer error", err);
    process.exit(1);
});