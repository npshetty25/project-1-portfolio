/*
 * Project data. Every fact here was checked against the project's own repo
 * (README, PORTFOLIO_REPORT, devlog) on 2026-10-15. If a claim cannot be
 * verified from a repo, it is not here. `source` records where each came from.
 *
 * media.type: "terminal" | "slider" | "image"
 * terminal lines are arrays of [className, text] segments:
 *   dim | cyan | green | amber | plain
 * links: only real, working URLs.
 * note:  an honest status line shown on the card.
 */
window.PORTFOLIO_PROJECTS = [
    {
        id: 'qa-copilot',
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
        note: 'Private repository. Walkthrough available on request.',
        media: {
            type: 'terminal',
            title: 'qa-copilot: run suite',
            label: 'Illustrative pipeline output',
            lines: [
                [['dim', '> '], ['cyan', 'story '], ['plain', '"User logs in with valid credentials"']],
                [['dim', '> '], ['plain', 'generating test cases '], ['green', 'ok '], ['dim', '(table + Gherkin)']],
                [['dim', '> '], ['plain', 'grounding on live DOM '], ['green', 'ok']],
                [['dim', '> '], ['plain', 'locator '], ['amber', '#submit-btn '], ['plain', 'stale, '], ['amber', 'self-healed']],
                [['dim', '> '], ['plain', 'suite passed '], ['green', 'ok '], ['dim', 'llama3:8b, local, 0 cloud calls']]
            ]
        },
        source: 'qa-copilot-dashboard README + docs/project-walkthrough.md'
    },
    {
        id: 'nutritrust',
        title: 'Nutri-Trust: Smart Pantry',
        category: 'Full-stack / AI',
        featured: true,
        summary: 'A pantry tracker for Indian households: scan a barcode or receipt, see what is nearing its estimated expiry, and get recipes that use it up first.',
        description: 'Gemini reads receipts, labels and printed expiry dates, Open Food Facts resolves barcodes, and households share a pantry through invite codes with Postgres row-level security deciding who sees what. Expiry is shown as risk bands and shelf-life estimates with their source, not as a claim that food has spoiled. Recipes are validated server-side against the user\'s diet before they are shown.',
        highlights: [
            'Debugged a production RLS infinite-recursion bug (Postgres 42P17) and pinned it with a negative-control test',
            '515 unit, component, API and RLS tests plus 59 browser tests, run on every push in CI',
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
            type: 'slider',
            images: [
                ['assets/images/projects/nutritrust/pantry_dashboard.png', 'Pantry dashboard sorted by expiry urgency'],
                ['assets/images/projects/nutritrust/scanner_feature.png', 'Receipt and label scanner'],
                ['assets/images/projects/nutritrust/shopping_list.png', 'Shared shopping list'],
                ['assets/images/projects/nutritrust/recipe_suggestions.png', 'Recipe suggestions from expiring items'],
                ['assets/images/projects/nutritrust/impact_dashboard.png', 'Impact dashboard']
            ]
        },
        source: 'NutriTrusto README + PORTFOLIO_REPORT.md (CI run at 6eb9fc6)'
    },
    {
        id: 'oddoreve',
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
            { label: 'Source', url: 'https://github.com/npshetty25/oddreve' }
        ],
        note: 'No hosted demo yet. Run it locally from the repository.',
        media: {
            type: 'terminal',
            title: 'oddoreve: one ball',
            label: 'Illustrative round flow',
            lines: [
                [['dim', '> '], ['plain', 'countdown '], ['amber', '3, 2, 1, GO']],
                [['dim', '> '], ['plain', 'gesture '], ['cyan', 'open palm = 5 '], ['dim', 'held 280ms']],
                [['dim', '> '], ['plain', 'commit '], ['cyan', 'sha256(throw:nonce) '], ['dim', 'sent']],
                [['dim', '> '], ['plain', 'both committed, reveal '], ['green', 'ok']],
                [['dim', '> '], ['plain', 'hash matches, ball resolved '], ['green', 'ok']]
            ]
        },
        source: 'oddreve README + src/engine, src/multiplayer, src/vision'
    },
    {
        id: 'wrdl',
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
            type: 'image',
            src: 'assets/images/projects/wrdl_screenshot.png',
            alt: 'Wrdl.io gameplay board with the room sidebar'
        },
        source: 'Wrdl.io README + package.json'
    },
    {
        id: 'episode-three',
        title: 'Episode Three',
        category: 'Data / ML (in progress)',
        featured: false,
        summary: 'A data pipeline and experiment design for predicting a season\'s final score from episode three, and whether a viewer will drop a show.',
        description: 'What exists today is the data layer: an AniList sync into MongoDB Atlas, probes of the AniList and MyAnimeList data, and a report checking where my own list sits relative to the 5,000 Kaggle training users. The two models and the dashboard are specified in the project spec but not trained or built yet.',
        highlights: [
            'Sync that pings the database before any API request and skips if the last run was under 24 hours ago',
            'Reproducible profile-vs-training report: my 4,181 labelled entries sit at the extreme top of the training range',
            'Rejected the TMDB API after reading its terms, which prohibit ML use, and recorded the decision',
            '40 offline tests'
        ],
        tags: ['Python', 'pandas', 'MongoDB', 'pytest'],
        links: [
            { label: 'Source', url: 'https://github.com/npshetty25/episode-three' }
        ],
        note: 'In progress. Models A and B are planned, not yet trained.',
        media: {
            type: 'terminal',
            title: 'episode-three: profile check',
            label: 'From reports/profile_vs_training.md',
            lines: [
                [['dim', '> '], ['plain', 'training users '], ['cyan', '5,000 '], ['dim', '(Kaggle MAL 2020, seed 42)']],
                [['dim', '> '], ['plain', 'my labelled TV entries '], ['cyan', '4,181 '], ['dim', 'percentile 99.98']],
                [['dim', '> '], ['plain', 'my drop rate '], ['cyan', '3.0% '], ['dim', 'training median 4.1%']],
                [['dim', '> '], ['plain', 'model A / model B '], ['amber', 'planned, not trained']]
            ]
        },
        source: 'episode-three docs/SPEC.md v1.5, devlog/006, reports/profile_vs_training.md'
    },
    {
        id: 'portfolio',
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
            type: 'image',
            src: 'assets/images/projects/portfolio_preview.png',
            alt: 'Screenshot of this portfolio website'
        },
        source: 'this repository'
    },
    {
        id: 'windscapes',
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
        media: {
            type: 'slider',
            images: [
                ['assets/images/projects/windscapes_1.png', 'Windscapes ERP dashboard'],
                ['assets/images/projects/windscapes_2.png', 'Windscapes role-based access panel'],
                ['assets/images/projects/windscapes_3.png', 'Windscapes CI/CD pipeline']
            ]
        },
        source: 'resume (no repository to verify against)'
    }
];
