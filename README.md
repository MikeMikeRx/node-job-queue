# Node Job Queue

A Redis-backed job queue built with Node.js and TypeScript.

> 🚧 Work in progress — project is actively evolving.

## Features

- Redis list based queue
- Background worker processing
- Simple job handler architecture
- Minimal queue implementation

## Example use cases

- sending emails
- generating reports
- image processing
- background data imports

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