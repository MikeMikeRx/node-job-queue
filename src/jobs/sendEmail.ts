export type SendEmailPayload = {
    to: string;
    subject: string;
    body: string;
};

export async function handleSendEmail(payload: SendEmailPayload): Promise<void> {
    console.log("Processing email job...");
    console.log(`To: ${payload.to}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body: ${payload.body}`);

    await new Promise((resolve) => setTimeout(resolve, 500));

    console.log("Email job completed");
}
