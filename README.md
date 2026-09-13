# Patch!

A viral social rewriting game for awkward everyday messages.

## MVP

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React
- React Context + mock data
- Issue timeline
- Dynamic Issue detail pages
- GitHub-style Before / After diff view
- Issue creation modal
- Patch submission modal
- No backend required

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Project structure

```text
app/
  page.tsx
  layout.tsx
  globals.css
  issues/[id]/page.tsx
components/
  Header.tsx
  Timeline.tsx
  IssueDetail.tsx
  DiffCard.tsx
  PatchCard.tsx
  IssueModal.tsx
  PatchModal.tsx
context/
  IssueContext.tsx
lib/
  types.ts
  mockData.ts
```

## Next step

Replace `IssueContext` mock state with a persistent backend such as Supabase, then add authentication, voting, comments, moderation, ranking, and shareable OG cards.