# Implementation Roadmap: PDF Toolkit WebApp

## Phase 1: Project Foundation
- [ ] Initialize Next.js 14+ Project (App Router, TypeScript, Tailwind CSS)
- [ ] Install Core Dependencies: `zustand`, `pdf-lib`, `react-dropzone`, `dnd-kit`, `lucide-react`, `clsx`, `tailwind-merge`
- [ ] Initialize shadcn/ui CLI and install base components: `Button`, `Card`, `Dialog`, `ScrollArea`, `Toast`
- [ ] Configure Dark Mode as the default theme in `globals.css` and `tailwind.config.ts`
- [ ] Create folder structure: `/components/ui`, `/components/shared`, `/store`, `/lib`, `/workers`, `/hooks`

## Phase 2: State Management (Zustand)
- [ ] Define `LocalFile` and `ToolType` types in a shared types file
- [ ] Create `useFileStore.ts` with `files` array and `addFiles/removeFile` actions
- [ ] Create `useToolStore.ts` with `activeTool` and `isProcessing` state
- [ ] Create `useUIStore.ts` for modal toggles and tip cycling logic
- [ ] Implement Zustand middleware for `IndexedDB` persistence (optional but recommended for local-first)

## Phase 3: Dashboard & Upload UI
- [ ] Build `DashboardContainer` grid layout
- [ ] Create `ToolCard` component with hover effects and icons for each PDF operation
- [ ] Build `GlobalUploadModal` using shadcn `Dialog`
- [ ] Implement `DropZone` using `react-dropzone` with file type validation (PDF, Images)
- [ ] Build `FileListItem` with status indicators (Idle, Processing, Completed)
- [ ] Connect `BrowseButton` to the hidden file input trigger
- [ ] Implement `DeleteButton` logic to remove files from `useFileStore`

## Phase 4: PDF Processing Engine (Local-First)
- [ ] Create a `pdf-service.ts` utility wrapper for `pdf-lib` operations
- [ ] Implement `mergeFiles` function (Combine multiple PDFs into one)
- [ ] Implement `splitFile` function (Extract specific pages)
- [ ] Implement `protectFile` and `unlockFile` functions (Password management)
- [ ] Implement `imageToPdf` conversion logic
- [ ] Implement `renameFile` utility (Appending `_merged`, `_locked`, etc.)
- [ ] **Crucial:** Setup a Web Worker to handle these operations to prevent UI freezing

## Phase 5: Workspace & Interaction
- [ ] Build `ToolWorkspaceView` layout (conditional rendering based on `activeTool`)
- [ ] Implement `WorkspaceHeader` with breadcrumbs and "Download All" action
- [ ] Integrate `dnd-kit` into `ReorderableGrid` for page/file reordering
- [ ] Create `PDFPreviewer` using `URL.createObjectURL` and a canvas/iframe fallback
- [ ] Implement `ProcessingOverlay` with a blur effect
- [ ] Create `TinyReminder` component to cycle tips during the `isProcessing` state

## Phase 6: Refinement & Mobile Optimization
- [ ] Audit all components for mobile responsiveness (95% width modals, stacked lists)
- [ ] Implement `Service Worker` via `next-pwa` for full offline capability
- [ ] Add "Clear All" functionality with a confirmation dialog
- [ ] Implement accessible "Touch Targets" (44x44px) for all mobile buttons
- [ ] Final UI polish: Add smooth transitions using `framer-motion` (optional) or CSS transitions

## Phase 7: Validation & Deployment
- [ ] Test Merge/Split logic with large files (>50MB)
- [ ] Verify "No Backend" integrity (Check Network tab for zero uploads)
- [ ] Test offline mode by disabling internet connection
- [ ] Deploy to Vercel and verify production build
