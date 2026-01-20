# AR Fashion Platform (Prototype)

This repository contains a prototype scaffold of an AR-based virtual try-on e-commerce platform.

Structure:
- backend: Node.js + Express API (MongoDB, JWT auth, invoices, email stubs)
- frontend: React + Vite + Tailwind (product listing, cart, checkout, AR Try-On page)
- nginx: reverse proxy for frontend and backend
- docker-compose.yml: runs backend, frontend, mongo, nginx

Quick start (requires Docker & Docker Compose):

```bash
cp .env.example .env
# Edit .env to set values if needed
docker compose up --build
```

Open http://localhost in your browser (frontend served via Nginx on port 80).

Development (without Docker):

Backend
```bash
cd backend
cp ../.env.example .env
npm install
npm run dev
```

Frontend
```bash
cd frontend
npm install
npm run dev
```

Notes & Next Steps:
- AR Try-On page includes a camera feed and placeholder overlay; integrate `@mediapipe/pose` and Three.js GLTF loaders to map 3D garments to detected keypoints.
- TensorFlow.js model stub can be added to `frontend/src/utils/sizeModel.js` for size recommendation.
- Replace dummy payment flow with Razorpay SDK for production (use test keys first).
- Implement OAuth, CAPTCHA, secure cookie flags, and CSP headers for production hardening.

This scaffold focuses on structure and prototyping. Ask me to wire up any specific feature (full MediaPipe pipeline, TensorFlow model, Razorpay integration, OAuth, or admin upload flow) and I will implement it next.
