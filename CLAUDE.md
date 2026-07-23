## Project

Field Service Technician Platform with an **offline-first** architecture. Technicians should work without internet and automatically sync when online.

## Stack

- React
- TypeScript (Strict)
- Vite
- PWA
- React Router
- TanStack Query
- Dexie (IndexedDB)
- React Hook Form
- Zod
- Axios

## Principles

- Offline First
- Mobile First
- Feature Based
- Component Driven
- SOLID
- Composition over Inheritance
- Reusable Components
- Type Safe
- Clean Code

## Folder Structure

```text
src/
 app/
 assets/
 components/
 features/
 hooks/
 layouts/
 pages/
 routes/
 services/
 lib/
 store/
 types/
 utils/
 workers/
```

Each feature:

```text
feature/
 api/
 components/
 hooks/
 pages/
 types/
 utils/
```

## Features

- Authentication
- Assigned Jobs
- Job Details
- Notes
- Checklist
- Photo Upload
- Customer Signature
- Offline Queue
- Offline Sync
- Push Notifications

## Routing

- Lazy load routes
- Protected routes
- Keep route config centralized

## State Management

- TanStack Query → Server State
- Context → UI State
- Dexie → Offline Storage

Avoid global state unless necessary.

## API

- Axios instance only
- No API calls inside components
- One service per feature
- Centralized error handling
- Auto refresh token

## Authentication

- Access Token in memory
- Refresh using HttpOnly Cookie
- Logout on refresh failure

## Data Fetching

Use custom hooks:

```ts
useJobs();
useJob(id);
useNotes(jobId);
useSyncQueue();
```

## Offline Strategy

Cache locally:

- Assigned Jobs
- Job Details
- Notes
- Checklist
- Upload Metadata

Never use localStorage for application data.

## Queue

Queue:

- Status Update
- Notes
- Checklist
- Upload Metadata
- Signature

Queue Item:

```ts
{
  (id, endpoint, method, payload, retryCount, createdAt);
}
```

## Sync

When online:

1. Read queue
2. Sync sequentially
3. Remove successful items
4. Retry failures
5. Invalidate affected queries

All APIs must be idempotent.

## Connectivity

Listen:

```ts
window.addEventListener("online");
window.addEventListener("offline");
```

Prevent duplicate syncs.

## File Upload

1. Request pre-signed URL
2. Upload directly to S3
3. Save metadata
4. Queue if offline

Never proxy files through backend.

## Images

- Compress before upload
- Generate thumbnail
- Retry failed uploads
- Show upload progress

## Signature

- Save locally first
- Sync later if offline
- Preview before submit

## PWA

Support:

- Installable
- Service Worker
- Offline Cache
- Background Sync
- App Shell
- Cache Versioning

## Service Worker

Cache:

- Static Assets
- Icons
- Fonts
- Safe GET Requests

Never cache auth endpoints.

## Forms

- React Hook Form
- Zod Validation
- Inline Errors
- Disable submit while loading

## UI

Build reusable:

- Button
- Input
- Card
- Modal
- Badge
- Loader
- Empty State
- Error State
- Job Card

## UX

Every request should have:

- Loading
- Success
- Error
- Empty State

Use optimistic updates where appropriate.

## Query Keys

```ts
jobs;
job(id);
notes(jobId);
profile;
notifications;
```

## Types

- Avoid `any`
- Shared interfaces
- Use enums for Status & Priority

## Performance

- Lazy Loading
- Code Splitting
- Memoization
- Image Compression
- Virtual Lists
- Query Caching

Avoid unnecessary re-renders.

## Accessibility

- Semantic HTML
- Keyboard Navigation
- Proper Labels
- Color Contrast

## Security

- Never trust client data
- Sanitize input
- Never store passwords
- Never expose secrets

## Code Style

- Functional Components
- Small Components
- Custom Hooks
- Thin Pages
- Readable Code
- Feature Isolation

## UI Components

Use **shadcn/ui** for all UI components. Available:

- Button
- Input
- Label
- Card
- InputOTP

All components are in `src/components/ui/` and are styled with Tailwind CSS using CSS variables for theming.

### shadcn/ui Guidelines

- Only use shadcn/ui components — no external UI libraries.
- All components support dark mode via CSS variables (OKLCH).
- Use semantic HTML and proper ARIA labels.
- Components are fully typed with TypeScript.
- Tailwind classes can be composed for custom styling.
- To add new components: `npx shadcn@latest add <component-name>`

## Constants

Store all constants in `src/constants/`:

- `auth.constants.ts` — OTP, cooldown, lengths
- `api.constants.ts` — API delays, error messages
- `validation.constants.ts` — Regex patterns, validation messages
- `app.constants.ts` — Routes, app config
- `index.ts` — Barrel export

Import constants from `@/constants` in components and services. Never hardcode magic strings or numbers.

## Claude Instructions

Always:

- Follow React best practices.
- Use TypeScript strict mode.
- Use TanStack Query for server state.
- Use Dexie for offline persistence.
- Keep components reusable.
- Extract business logic into hooks.
- Prefer composition over inheritance.
- Handle loading, error and empty states.
- Optimize for slow networks.
- Consider offline synchronization before implementation.
- Ask before making architectural assumptions.
- Store all constants in `src/constants/` — never hardcode values.
- Use shadcn/ui for all UI components.
