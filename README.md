# Node Job Queue

A Redis-backed job queue built with Node.js and TypeScript.

## Features

- Redis list based queue
- Background worker processing
- Simple job handler architecture
- Minimal queue implementation

## How it works

Jobs are pushed into a Redis list:
- LPUSH jobs jobData

Workers consume jobs using:
- BRPOP jobs

## Running locally

Start Redis:

```bash
docker run --rm -p 6379:6379 redis:7
```
Install dependencies:
```bash
npm install
```
Run the worker:
```bash
npm run dev:worker
```