# The Future Classroom

A non-profit platform providing AI tools to K-12 teachers to enhance education.

## Features

- Google Sign-in authentication
- AI tools for lesson planning, content creation, and more
- Usage limits to ensure equitable access
- Dark-themed modern UI

## Tech Stack

- **Frontend:** Next.js, React, CSS Modules
- **Backend:** PocketBase (BaaS)
- **Authentication:** Google OAuth via PocketBase

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PocketBase server (see [PocketBase Setup Instructions](pocketbase-setup.md))

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd the-future-classroom
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file with your PocketBase URL:

```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## PocketBase Setup

See the [PocketBase Setup Instructions](pocketbase-setup.md) for details on setting up the backend.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [PocketBase Documentation](https://pocketbase.io/docs/)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
