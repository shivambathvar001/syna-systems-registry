# website Specifications & Technical Architecture

## Technical Stack & Versions
- **Framework:** Next.js v14.2.3 (App Router model, React Server Components enabled).
- **Language:** TypeScript v5 (Strict type checking, zero any types allowed).
- **Styling:** Tailwind CSS v3.4.3 + custom HSL color system variables.
- **Component Primitives:** Custom headless layouts styled to mimic shadcn/ui clean aesthetics.
- **Animations:** Framer Motion (only imported inside client components).
- **Metadata Management:** Built-in Next.js metadata system (SEO tags, JSON-LD schemas).
- **Validation Engine:** Zod for type-safe form and payload validation.

## Page Specifications & Layouts
- **Home (`/`):** Developer documentation portal displaying AOS v2.0 files.
  - Purpose: Exhibit operational discipline, transparent architectures, and developer resources.
  - Target Persona: VP of Revenue Cycle, Chief Information Security Officer (CISO).
  - Business Goal: Build technical authority and showcase systems engineering quality.
  - Primary CTA: Open ROI assessment tool sidebar.
  - Page Hierarchy: Header -> Sidebar Nav + MD Render Panel -> Custom ROI drawer.

## SEO, Crawlers, and AI Indexing
- **SEO Rules:** High-quality metadata schemas containing description, keywords, OpenGraph images.
- **AI-SEO Integration:** Provide static `sitemap.xml` and `robots.txt` specifying MDX sources. Include clean, unstructured paragraph definitions to enable accurate semantic parsing by Perplexity, Gemini, and SearchGPT.
- **caching:** ISR (Incremental Static Regeneration) caching strategy with 1-hour revalidation intervals.
