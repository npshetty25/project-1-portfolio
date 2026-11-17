/*
 * Project data. Every fact here was checked against the project's own repo
 * (README, PORTFOLIO_REPORT, devlog) on 2026-10-15. If a claim cannot be
 * verified from a repo, it is not here. `source` records where each came from.
 *
 * flip: true puts the media on the right of a featured card
 * media is optional: a project with no real visuals shows text only
 * media.type: "terminal" | "slider" | "image" | "rail" (large preview + thumbnail tabs; ratio, portrait optional) | "architecture" (inline SVG diagram)
 * terminal lines are arrays of [className, text] segments:
 *   dim | cyan | green | amber | plain
 * status: live | private | progress | nolink  (shown as a labelled chip)
 * links: only real, working URLs.
 * note:  an honest status line shown on the card.
 */
window.PORTFOLIO_PROJECTS = [
    {
        id: 'qa-copilot',
        flip: true,
        status: 'private',
        groups: ['ai'],
        title: 'QA Copilot Dashboard',
        category: 'AI / QA automation',
        featured: true,
        summary: 'Turns a plain-English user story into manual test cases and a runnable Playwright suite, runs it against a live site, and repairs broken locators when the page changes.',
        description: 'Generation is live: each test step is attempted in a real browser while the script is written, so every selector in the output was already proven to work rather than guessed by the model. When a locator goes missing, the runner re-scans the page and matches a replacement by meaning using sentence-transformer embeddings. The whole stack runs on a local llama3:8b model through Ollama, with no cloud API.',
        highlights: [
            'Boundary Value Analysis and Equivalence Partitioning applied to numeric business rules',
            'Embedding-based locator healing (all-MiniLM-L6-v2) instead of exact-string matching',
            'Nginx access logs clustered into behaviour personas with K-Means and the elbow method, no LLM involved',
            'Locust load-test scripts weighted by those persona ratios'
        ],
        tags: ['Python', 'FastAPI', 'React', 'Playwright', 'Ollama (Llama 3)', 'sentence-transformers', 'Locust'],
        links: [],
        note: 'Walkthrough available on request. Screenshots are the real dashboard UI in its empty state.',
        media: {
            type: 'rail',
            label: 'QA Copilot screens',
            items: [
                {
                    src: 'assets/images/projects/qa-copilot/story_input.webp',
                    label: 'Story',
                    alt: 'QA Copilot dashboard with a user story containing acceptance criteria, a business rule and a functional requirement',
                    caption: 'Write the story: acceptance criteria, business rules and requirements as plain text.'
                },
                {
                    src: 'assets/images/projects/qa-copilot/performance_tab.webp',
                    label: 'Performance',
                    alt: 'Performance tab: upload an nginx access log to cluster sessions into user personas',
                    caption: 'Cluster real traffic: upload an nginx log and sessions become user personas.'
                },
                {
                    src: 'assets/images/projects/qa-copilot/load_test.webp',
                    label: 'Load test',
                    alt: 'Load-test section: generate a Locust script from cluster weights and run it',
                    caption: 'Load-test it: a Locust script is generated from the persona weights.'
                }
            ]
        },
        source: 'qa-copilot-dashboard README + docs/project-walkthrough.md'
    },
    {
        id: 'nutritrust',
        status: 'live',
        groups: ['ai', 'web'],
        title: 'Nutri-Trust: Smart Pantry',
        category: 'Full-stack / AI',
        featured: true,
        summary: 'A pantry tracker for Indian households: scan a barcode or receipt, see what is nearing its estimated expiry, and get recipes that use it up first.',
        description: 'Gemini reads receipts, labels and printed expiry dates, Open Food Facts resolves barcodes, and households share a pantry through invite codes with Postgres row-level security deciding who sees what. Expiry is shown as risk bands and shelf-life estimates with their source, not as a claim that food has spoiled. Recipes are validated server-side against the user\'s diet before they are shown.',
        highlights: [
            'Debugged a production RLS infinite-recursion bug (Postgres 42P17) and pinned it with a negative-control test',
            '849 unit, component, API and RLS tests plus Playwright browser journeys on phone and desktop, run on every push in CI',
            'Category model: 85.3% accuracy vs 42.6% for the previous keyword rules on a held-out set of 510 products',
            'Installable PWA with an offline page'
        ],
        tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Gemini API', 'FastAPI', 'Playwright'],
        links: [
            { label: 'Live demo', url: 'https://nutri-trusto.vercel.app/' },
            { label: 'Source', url: 'https://github.com/npshetty25/NutriTrusto' }
        ],
        note: 'The category model runs in CI and Docker, not on the Vercel deployment, which falls back to keyword rules.',
        media: {
            type: 'rail',
            label: 'Nutri-Trust screens',
            portrait: true,
            items: [
                {
                    src: 'assets/images/projects/nutritrust/pantry_dashboard.webp',
                    label: 'Dashboard',
                    alt: 'Pantry dashboard showing freshness, critical items and a prompt to cook what expires first',
                    caption: 'Dashboard: pantry freshness, critical items and a prompt to cook what expires first.'
                },
                {
                    src: 'assets/images/projects/nutritrust/scanner_feature.webp',
                    label: 'Scanner',
                    alt: 'Scan Barcode dialog with a camera view and a field to type the barcode',
                    caption: 'Scanner: point the camera at a barcode, or type the number if scanning fails.'
                },
                {
                    src: 'assets/images/projects/nutritrust/shopping_list.webp',
                    label: 'Shopping',
                    alt: 'Shopping list dialog with an add-item field',
                    caption: 'Shopping list: add the things you need to buy.'
                },
                {
                    src: 'assets/images/projects/nutritrust/recipe_suggestions.webp',
                    label: 'Recipes',
                    alt: 'Recipes by cuisine with Veg, Egg OK and All diet filters',
                    caption: 'Recipes by cuisine, filtered to your diet: Veg, Egg OK or All.'
                },
                {
                    src: 'assets/images/projects/nutritrust/impact_dashboard.webp',
                    label: 'Impact',
                    alt: 'Impact dashboard with a waste-free streak and estimated savings',
                    caption: 'Impact: waste-free streak and estimated savings, labelled as directional, not exact.'
                }
            ]
        },
        source: 'NutriTrusto README + PORTFOLIO_REPORT.md (CI run at 6eb9fc6)'
    },
    {
        id: 'oddoreve',
        status: 'live',
        groups: ['ai', 'realtime'],
        title: 'ODDOREVE: Hand-Gesture Cricket',
        category: 'Computer vision / real-time',
        featured: false,
        summary: 'A browser game that turns hand gestures into cricket and baseball throws using client-side hand tracking, with peer-to-peer multiplayer.',
        description: 'MediaPipe hand landmarks are classified into throw values 0 to 6, and a stabiliser requires a steady hold of about 280 ms before a throw locks in, which removes camera jitter. Online matches run peer-to-peer over WebRTC with room codes and invite links, so no game server is needed. Each throw is committed as a SHA-256 hash and revealed afterwards, so neither player can wait to see the other\'s hand.',
        highlights: [
            'Cricket, baseball and 2v2 team formats, plus a computer opponent',
            'Tap and keyboard fallback controls for when no camera is available',
            'Commit-reveal anti-cheat verified by the host\'s room logic',
            'Unit tests over game rules, the gesture classifier and the multiplayer state machine'
        ],
        tags: ['Next.js', 'TypeScript', 'MediaPipe', 'WebRTC', 'PeerJS', 'Zustand', 'Vitest'],
        links: [
            { label: 'Play', url: 'https://oddreve.vercel.app/' },
            { label: 'Source', url: 'https://github.com/npshetty25/oddreve' }
        ],
        note: 'Gesture play needs a webcam; a tap keypad is available without one.',
        media: {
            type: 'rail',
            label: 'ODDOREVE screens',
            ratio: '16 / 10',
            items: [
                {
                    src: 'assets/images/projects/oddoreve/home.webp',
                    label: 'Home',
                    alt: 'ODDOREVE home screen with play-a-friend and play-the-computer options',
                    caption: 'Home: play a friend online, or play the computer.'
                },
                {
                    src: 'assets/images/projects/oddoreve/modes.webp',
                    label: 'Modes',
                    alt: 'ODDOREVE mode select: cricket and baseball in 1v1 and 2v2',
                    caption: 'Modes: cricket and baseball, each 1v1 or 2v2.'
                }
            ]
        },
        source: 'oddreve README + src/engine, src/multiplayer, src/vision'
    },
    {
        id: 'wrdl',
        status: 'live',
        groups: ['realtime', 'web'],
        title: 'Wrdl.io: Multiplayer Wordle',
        category: 'Real-time web',
        featured: false,
        summary: 'A real-time multiplayer Wordle with competitive and cooperative modes, shareable rooms and responsive desktop and mobile layouts.',
        description: 'Game state is synchronised between players over Socket.IO events. Rooms can be joined by link or QR code. Competitive mode races to solve the same word; cooperative mode shares one board.',
        highlights: [
            'Competitive and cooperative modes on one event-driven server',
            'QR-code and copy-link room sharing',
            'Separate desktop and compact mobile layouts'
        ],
        tags: ['Next.js', 'TypeScript', 'Socket.IO', 'Express'],
        links: [
            { label: 'Play', url: 'https://wrdl-io.onrender.com/' },
            { label: 'Source', url: 'https://github.com/npshetty25/Wrdl.io' }
        ],
        note: 'Hosted on a free tier, so the first load can take a moment to wake.',
        media: {
            type: 'rail',
            label: 'Wrdl.io screens',
            ratio: '2 / 1',
            items: [
                {
                    src: 'assets/images/projects/wrdl/first_look.webp',
                    label: 'Home',
                    alt: 'Wrdl.io home screen with competitive and cooperative modes and create or join room',
                    caption: 'Home: pick competitive or cooperative, then create or join a room.'
                },
                {
                    src: 'assets/images/projects/wrdl/competitive.webp',
                    label: 'Competitive',
                    alt: 'Wrdl.io competitive match with a QR code, room code, timer and opponent board',
                    caption: 'Competitive: race to find the word first. Share the room by QR code or link.'
                },
                {
                    src: 'assets/images/projects/wrdl/cooperative.webp',
                    label: 'Cooperative',
                    alt: 'Wrdl.io cooperative match with one shared board',
                    caption: 'Cooperative: work together on one shared board to solve the word.'
                }
            ]
        },
        source: 'Wrdl.io README + package.json'
    },
    {
        id: 'episode-three',
        status: 'progress',
        groups: ['data'],
        title: 'Episode Three',
        category: 'Data / ML (in progress)',
        featured: false,
        summary: 'A machine-learning experiment on whether early viewing behaviour predicts how a season ends: Model A predicts a show’s final score from episode three; Model B (will a viewer drop a show) is still in data collection.',
        description: 'Model A is trained and evaluated. A Ridge regression on episode-three scores and show features was chosen over RandomForest and gradient boosting with time-ordered cross-validation, then scored once on a locked test set of 337 shows. The data layer for Model B is built: 6,050 anime fetched from AniList and joined to a 5,000-user Kaggle sample. The dashboard is specified but not built.',
        highlights: [
            'Test MAE 1.52 vs 1.69 for a naive "finale = episode 3" baseline on 337 held-out shows: 10.01% lower against a 10% bar set in advance, a narrow pass',
            'Pre-registered the evaluation: the test split is loaded exactly once, and a guard stops a second run',
            'Wrote the caveats into the report: the margin is thin, and the gain is fewer large misses rather than more near-exact predictions',
            'AniList sync into MongoDB Atlas that fetched 6,050 anime in 121 requests with no rate-limit errors or retries'
        ],
        tags: ['Python', 'scikit-learn', 'pandas', 'MongoDB', 'pytest'],
        links: [
            { label: 'Source', url: 'https://github.com/npshetty25/episode-three' }
        ],
        note: 'In progress. Model A is done; Model B and the dashboard are not finished.',
        media: {
            type: 'terminal',
            title: 'episode-three: model A on the test set',
            label: 'Figures from devlog 014 and reports/model_a_v1.md',
            lines: [
                [['dim', '> '], ['plain', 'model '], ['cyan', 'ridge (alpha 100) '], ['dim', 'chosen on validation']],
                [['dim', '> '], ['plain', 'test set '], ['cyan', '337 shows '], ['dim', 'loaded once']],
                [['dim', '> '], ['plain', 'test MAE '], ['green', '1.52 '], ['dim', 'vs 1.69 for finale = ep3']],
                [['dim', '> '], ['plain', 'model B '], ['amber', 'data collection, 6,050 anime']]
            ]
        },
        source: 'episode-three devlog/011-015, docs/SPEC.md v1.14, reports/model_a_v1.md'
    },
    {
        id: 'portfolio',
        status: 'live',
        groups: ['web'],
        title: 'This Portfolio',
        category: 'Frontend',
        featured: false,
        summary: 'A dependency-light portfolio in plain HTML, CSS and JavaScript with dark and light themes and reduced-motion support.',
        description: 'No framework and no build step. Project, skill and playlist content lives in data files rather than hand-written markup.',
        highlights: [
            'Light and dark themes that persist across visits',
            'Respects prefers-reduced-motion and works with the keyboard'
        ],
        tags: ['HTML', 'CSS', 'JavaScript'],
        links: [
            { label: 'Live', url: 'https://niravshettyportfolio.vercel.app/' },
            { label: 'Source', url: 'https://github.com/npshetty25/project-1-portfolio' }
        ],
        note: '',
        media: {
            type: 'rail',
            label: 'Portfolio screens',
            ratio: '16 / 10',
            items: [
                {
                    src: 'assets/images/projects/portfolio/hero.webp',
                    label: 'Hero',
                    alt: 'The portfolio home screen with name, stats and resume button',
                    caption: 'Hero: name, role, key numbers and the resume download.'
                },
                {
                    src: 'assets/images/projects/portfolio/projects.webp',
                    label: 'Projects',
                    alt: 'The portfolio projects section with filter chips and the featured QA Copilot project',
                    caption: 'Projects: filterable cards with status chips and screenshots.'
                },
                {
                    src: 'assets/images/projects/portfolio/skills.webp',
                    label: 'Skills',
                    alt: 'The portfolio skills section grouped into six categories',
                    caption: 'Skills: six groups with inline icons.'
                }
            ]
        },
        source: 'this repository'
    },
    {
        id: 'ai-codebase-assistant',
        status: 'progress',
        groups: ['ai', 'web'],
        title: 'AI Codebase Assistant',
        category: 'Full-stack / AI',
        featured: false,
        summary: 'Upload a codebase as a zip, get a structured analysis, and search it in natural language with vector search.',
        description: 'Uploads are unpacked and split into chunks. A Python FastAPI service embeds them with all-MiniLM-L6-v2 and indexes them in FAISS. A Node and Express backend handles JWT auth with bcrypt, user and admin roles, projects and Socket.io project chat. The React and TypeScript frontend ties them together.',
        highlights: [
            'Three services: a React frontend, a Node backend and a Python AI engine',
            'Semantic search over an uploaded codebase using FAISS and sentence-transformers',
            'Real-time project chat with multi-user rooms and typing indicators',
            'Role-based access control for user and admin accounts'
        ],
        tags: ['React', 'TypeScript', 'Node.js', 'Socket.io', 'FastAPI', 'FAISS', 'MongoDB'],
        links: [
            { label: 'Source', url: 'https://github.com/npshetty25/ai-codebase-assistant' }
        ],
        note: 'In progress. No hosted demo and no automated tests yet.',
        media: {
            type: 'architecture',
            label: 'Architecture, from the project README',
            alt: 'Architecture: a React frontend talks to a Node.js Express and Socket.io backend, which calls a Python FastAPI service using FAISS; the backend stores data in MongoDB.',
            svg: `<svg viewBox="0 0 520 250" aria-hidden="true" font-family="Inter, system-ui, sans-serif"><defs><marker id="arch-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#6e7681"/></marker></defs><g fill="#161b22" stroke="#30363d"><rect x="10" y="30" width="140" height="64" rx="10"/><rect x="190" y="30" width="140" height="64" rx="10"/><rect x="370" y="30" width="140" height="64" rx="10"/><rect x="190" y="160" width="140" height="64" rx="10"/></g><g fill="#c9d1d9" font-size="13" font-weight="600" text-anchor="middle"><text x="80" y="58">React UI</text><text x="260" y="58">Node + Express</text><text x="440" y="58">Python + FastAPI</text><text x="260" y="188">MongoDB</text></g><g fill="#8b949e" font-size="11" text-anchor="middle"><text x="80" y="76">Tailwind, Vite</text><text x="260" y="76">Socket.io, JWT</text><text x="440" y="76">FAISS, embeddings</text><text x="260" y="206">projects, users, chat</text></g><g stroke="#6e7681" stroke-width="1.5" fill="none" marker-end="url(#arch-arrow)" marker-start="url(#arch-arrow)"><path d="M150 62H188"/><path d="M330 62H368"/><path d="M260 94V158"/></g><text x="169" y="52" fill="#8b949e" font-size="10" text-anchor="middle">HTTP, WS</text><text x="349" y="52" fill="#8b949e" font-size="10" text-anchor="middle">HTTP</text></svg>`
        },
        source: 'ai-codebase-assistant README + server, client and ai-service code'
    },
    {
        id: 'windscapes',
        status: 'nolink',
        groups: ['web'],
        title: 'Windscapes: Enterprise ERP',
        category: 'Full-stack / internship',
        featured: false,
        summary: 'A three-service ERP platform covering inventory, finance, reporting, auth and dashboards, secured behind a single Nginx gateway.',
        description: 'Added role-based access control with three permission tiers and SSL through an Nginx gateway so all ingress passes through one entry point.',
        highlights: [
            'Five-plus modules across three services',
            'RBAC with three permission tiers behind one Nginx entry point'
        ],
        tags: ['TypeScript', 'React', 'Python', 'Nginx', 'REST APIs', 'CI/CD'],
        links: [],
        note: 'Source not linked. Content from my resume; walkthrough available on request.',
        source: 'resume (no repository to verify against)'
    }
];
