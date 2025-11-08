# Danang Culinary Atlas - AI Coding Assistant Instructions

## Project Overview
Next.js 16 culinary tourism app showcasing Da Nang restaurants with interactive maps, search, and filtering. Uses App Router with TypeScript, Redux Toolkit for state management, and MapLibre GL for map visualization.

## Architecture & Key Patterns

### Route Group Structure
- Uses `(culinary-atlas)` route group for main app layout with navbar/footer
- Auth layout in `src/app/(culinary-atlas)/layout.tsx` wraps Redux Provider + AuthProvider
- All pages require `"use client"` directive (no server components used in routes)

### State Management: Redux + Context Hybrid
**Critical**: Auth state uses BOTH Redux (`src/stores/auth`) and React Context (`src/contexts/AuthContext`):
- Redux is source of truth; AuthContext syncs via `useEffect` from Redux state
- AuthContext methods are deprecated—use Redux actions (`loginUser`, `registerUser`, `logout`)
- Token stored in localStorage, attached via axios interceptor (`src/helpers/axios`)

Example Redux usage:
```typescript
import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
const dispatch = useAppDispatch();
const { user, loading } = useAppSelector((state) => state.auth);
dispatch(loginUser({ email, password }));
```

### API Integration Pattern
- Base URL: `src/configs/api.ts` (env: `NEXT_PUBLIC_APP_API_URL`)
- Axios instance: `src/helpers/axios/index.tsx` with JWT interceptor
- Service layer returns `ApiResponse` type (`src/types/response.ts`)
- 401 errors auto-clear auth and redirect to `/login`

### Redux Store Structure (`src/stores`)
1. **auth**: User authentication, token management
2. **restaurant**: Paginated restaurant list (search/filter)
3. **atlas**: Map-specific state (restaurants by bounds, view state)

Actions use `createAsyncThunk` with service functions. Slices handle pagination, filters, and loading states.

### Map Implementation (`/atlas` route)
- **MapLibre GL** (not Mapbox) with custom styles in `public/map-styles/`
- **Debounced bounds fetching**: 500ms delay on pan/zoom (`src/app/(culinary-atlas)/(routes)/atlas/components/RestaurantMap.tsx`)
- View state (lat/lng/zoom) persisted in Redux `atlas` slice
- Separate API endpoint `/restaurants/map-view` for clustering by zoom level

## Development Workflows

### Running the App
```bash
npm run dev          # Turbopack dev server
npm run build        # Production build with Turbopack
npm start            # Start production server
npm run lint         # ESLint check
```

### Docker Build
```bash
# Build args required for Next.js env vars:
docker build --build-arg NEXT_PUBLIC_APP_API_URL=<url> \
             --build-arg NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<token> \
             -t danang-culinary-atlas-fe .
```
Uses standalone output mode (`next.config.ts`). Production image runs `node server.js`.

### Environment Variables
- `NEXT_PUBLIC_APP_API_URL`: Backend API base URL
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: For map tiles (even though using MapLibre)

## Project-Specific Conventions

### Component Organization
- Page components: `src/app/(culinary-atlas)/(routes)/<route>/page.tsx`
- Page-specific components: `<route>/components/`
- Shared components: `src/components/<feature>/`
- UI primitives (shadcn): `src/components/ui/`

### Styling Conventions
- **TailwindCSS v4** with custom fonts (Mulish, Volkhov, Poppins, NicoMoji)
- Use `cn()` utility from `src/lib/utils.ts` for conditional classes
- Font classes: `font-mulish`, `font-volkhov`, `font-poppins`, `font-nicomoji`

### Type Safety
- All API responses typed via `src/types/response.ts` (`ApiResponse` interface)
- Restaurant types: `src/types/restaurant/index.ts`
- Redux types exported from store: `RootState`, `AppDispatch`

### Image Handling
- Remote images allowed: Unsplash, Google user content, Google Maps/Street View
- Configured in `next.config.ts` `remotePatterns`

## Common Tasks

### Adding a New Protected Route
1. Create page in `src/app/(culinary-atlas)/(routes)/<name>/page.tsx`
2. Add `"use client"` directive if using hooks
3. Check auth: `const { user } = useAppSelector((state) => state.auth)`
4. Redirect if needed: `useEffect(() => { if (!user) router.push('/login') }, [user])`

### Creating a Redux Slice
1. Define slice in `src/stores/<feature>/index.ts`
2. Create async actions in `src/stores/<feature>/action.ts`
3. Add service function in `src/services/<feature>.ts`
4. Register reducer in `src/stores/index.ts`

### Working with Maps
- Map bounds stored in `atlas.mapBounds` (Redux)
- Always debounce map interaction handlers (500ms standard)
- Use `react-map-gl/maplibre` imports, not `react-map-gl`

## Critical Dependencies
- **Next.js 16** with Turbopack (use `--turbopack` flag in scripts)
- **React 19** (RC version)
- **Redux Toolkit** for state, NOT Context API for app state
- **MapLibre GL** (NOT Mapbox GL) for maps
- **react-toastify** for notifications
- **axios** for HTTP (interceptors configured)

## Testing & Quality
No test suite currently configured. When adding tests, consider:
- Redux async thunks with mock API responses
- Map interactions (bounds, debouncing)
- Auth flow (localStorage, token refresh)
