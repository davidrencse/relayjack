# RelayJack Backend

Node.js, Express, TypeScript REST API with file-backed JSON persistence and a WebSocket update channel.

## Run

```bash
npm install
npm run dev
```

Build with:

```bash
npm run build
npm start
```

The API is served under `/api`. WebSocket clients connect to `/ws`. Data is stored in `backend/data/store.json` by default and can be moved with `RELAYJACK_DATA_FILE`.

Sensitive API calls require a prior `POST /api/session/acknowledge` for the operator id. In local development, routes use `local-operator` unless `x-operator-id` is provided.
