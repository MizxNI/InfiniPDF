# Tech Stack Manifest: PDF Toolkit

## Frontend Framework
* **Next.js (React):** The industry standard. We will use the App Router for clean page architecture. 
* **Tailwind CSS:** For rapid, utility-first styling.
* **shadcn/ui & 21st.dev:** For copy-pasting accessible, beautifully designed, and headless UI components.

## State Management
* **Zustand:** A tiny, unopinionated state manager. Much lighter than Redux and perfect for handling our `FileStore` and `ToolStore` locally.

## The Core Engines (The "Boring" Tech)
* **pdf-lib:** The undisputed champion of JavaScript PDF manipulation. It handles merging, splitting, and metadata modification flawlessly purely in the browser.
* **react-dropzone:** The standard for handling drag-and-drop file uploads in React.
* **dnd-kit:** For the drag-and-drop reordering grid (when users need to swap page order before merging).

## Deployment & Hosting
* **Vercel:** Seamless continuous integration from our GitHub repository. Free tier is more than enough since we have zero backend server costs.
