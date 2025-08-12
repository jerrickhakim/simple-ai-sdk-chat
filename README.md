## Simple AI SDK Chat

A minimal Next.js chat app using the Vercel AI SDK and Vercel AI Gateway.

### Features

- **Smooth message scrolling**: Chat view keeps the latest messages in view.
- **Auto‑resize textarea**: Input grows with content for a better typing experience.

## Requirements

- Node.js and npm installed.
- A Vercel AI Gateway API Key.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create an `.env.local` file in the project root and set your gateway key:

```bash
AI_GATEWAY_API_KEY=YOUR_AI_GATEWAY_API_KEY
```

3. Start the development server:

```bash
npm run dev
```

Open `http://localhost:3000` to use the chat.

## How it works

The API route streams responses using the AI SDK and the Vercel AI Gateway. The default model is `openai/gpt-4.1-nano` and can be changed in `app/api/chat/route.ts`.

```ts
// app/api/chat/route.ts (excerpt)
const result = streamText({
  model: "openai/gpt-4.1-nano",
  messages: convertToModelMessages(messages),
});
```

Learn more in the Vercel docs: [Vercel AI Gateway docs](https://vercel.com/docs/ai/ai-gateway).

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build for production
- `npm start`: Start the production server
- `npm run lint`: Lint the project

## Troubleshooting

- **401 Unauthorized**: Ensure `AI_GATEWAY_API_KEY` is set in `.env.local` and the server was restarted.
- **429 / Rate limits**: Check your Vercel AI Gateway plan/quotas.
- **No responses streaming**: Verify network calls to `/api/chat` and your gateway configuration.

## License

MIT
