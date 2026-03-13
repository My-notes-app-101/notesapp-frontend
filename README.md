# Notes App Frontend

A notes application built with Vue 3 + TypeScript.

## Tech Stack

- **Vue 3** + `<script setup lang="ts">`
- **Pinia** — state management with persistence
- **Vue Router 4** — client-side routing with auth guards
- **Axios** — HTTP client
- **VeeValidate + Zod** — form validation
- **Tailwind CSS v3** — styling
- **Vitest + Vue Test Utils** — unit testing

## Features

- Auth: register, login, logout with JWT persistence
- Full CRUD for notes
- Search with 400ms debounce
- Sort by title, created date, updated date
- Pagination
- Toast notifications
- Confirm dialog before delete
- Responsive design (mobile, tablet, desktop)

## Getting Started
```bash
npm install
npm run dev
```

## Scripts
```bash
npm run dev          # start dev server
npm run build        # production build
npm run test         # run unit tests
npm run lint         # lint check
npm run format       # format with prettier
```

## Tests

31 unit tests covering stores, utils, composables, and components.
```bash
npm run test
```
