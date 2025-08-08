# Playground Groq — Next.js version

This is a Next.js single-folder repo intended for Vercel deployment.
- Frontend: pages/index.js (React)
- API: pages/api/*.js (Node serverless functions)
- Python diarization script lives in /python/diarization.py (invoked by API)

Notes:
- The diarization script uses only Python stdlib to compute duration and return simulated speaker segments.
- Groq API key must be set in Vercel environment variable GROQ_API_KEY.
- Uploads are sent as base64 in JSON from the frontend to simplify serverless usage.
