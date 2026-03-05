# UI/UX Design Specification: PDF Toolkit WebApp

## 1. Design Overview
The application follows a "Workspace-First" approach. Since there is no authentication, the landing page is the functional interface. The UI is designed with a high-contrast dark theme (as seen in `ui_ref.png`), prioritizing the "Upload Zone" as the primary entry point.

## 2. React Component Hierarchy (Next.js)

### Root Layout
- `layout.tsx`: Global Providers (Theme, Zustand Hydration) + Global CSS.
- `page.tsx`: Entry point. Switches between `DashboardView` and `ToolWorkspaceView`.

### Dashboard View
- `DashboardContainer`: Grid layout for tool selection.
    - `ToolCard`: Individual tool entry (Merge, Split, etc.).
- `GlobalUploadModal`: The component from `ui_ref.png`.
    - `ModalHeader`: Title and Close (X) button.
    - `DropZone`: The dashed upload area.
        - `UploadIcon`: Cloud/Arrow icon.
        - `UploadInstructions`: Text prompts and supported formats.
        - `BrowseButton`: Hidden file input trigger.
    - `FileScrollArea`: Max-height container for the file list.
        - `FileListItem`: Row-based component.
            - `FileTypeIcon`: (e.g., PDF, JPG).
            - `FileDetails`: Name, Size, and Status string.
            - `StatusIcon`: Success (Check) or Loading (Spinner).
            - `DeleteButton`: Action to remove file from state.

### Tool Workspace View
- `WorkspaceHeader`: Breadcrumbs (Home > Merge) and Action Buttons (Download All).
- `WorkspaceContent`:
    - `ReorderableGrid`: For Merge/Organize tools (using `dnd-kit`).
    - `PDFPreviewer`: Canvas-based viewer using `pdf.js`.
    - `AnnotationToolbar`: Tools for drawing/text overlay.
- `ProcessingOverlay`: Full-screen/Partial blur during heavy WASM tasks.
    - `TinyReminder`: Randomly cycling productivity tips.

---

## 3. State Management (Zustand)

The state is split into three focused stores to ensure performance and maintainability.

### `useFileStore`
Manages the raw file data and their metadata.
```typescript
interface FileState {
  files: LocalFile[]; // LocalFile: { id, fileHandle, name, size, status, previewUrl }
  addFiles: (newFiles: File[]) => void;
  removeFile: (id: string) => void;
  updateFileStatus: (id: string, status: 'idle' | 'processing' | 'completed' | 'error') => void;
  clearAll: () => void;
}
```

### `useToolStore`
Manages the active operation and its configuration.
```typescript
interface ToolState {
  activeTool: ToolType | null; // 'merge' | 'split' | 'lock' | etc.
  isProcessing: boolean;
  progress: number; // 0 to 100
  setActiveTool: (tool: ToolType | null) => void;
  setProcessing: (val: boolean) => void;
  setProgress: (val: number) => void;
}
```

### `useUIStore`
Manages global UI states like modals and notifications.
```typescript
interface UIState {
  isUploadModalOpen: boolean;
  isSidebarOpen: boolean;
  currentTipIndex: number;
  toggleUploadModal: (val?: boolean) => void;
  cycleTip: () => void;
}
```

---

## 4. Technical Strategy for Local-First
1.  **Web Workers:** PDF processing (merging, splitting) will be offloaded to Web Workers to keep the UI thread responsive.
2.  **Blob URLs:** For previewing PDFs/Images without server round-trips, use `URL.createObjectURL()`.
3.  **WASM Integration:** `pdf-lib` or specialized WASM builds will handle the low-level PDF manipulation.
4.  **IndexedDB (Optional):** If session persistence is needed across refreshes, `zustand/middleware` with a custom `IndexedDB` storage can be used to keep files locally saved without a backend.

## 5. Mobile Responsiveness
- **Modal:** On mobile, the `GlobalUploadModal` expands to 95% width.
- **File List:** `FileListItem` switches from a 4-column flex layout to a 2-row layout on screens < 640px to ensure the filename remains readable.
- **Touch Targets:** All buttons (Close, Delete, Browse) have a minimum hit area of 44x44px.
