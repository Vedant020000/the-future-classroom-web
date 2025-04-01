# PocketBase Setup Instructions

## Installation

1. Download PocketBase from the official website: https://pocketbase.io/

2. Extract the ZIP file to a directory of your choice.

3. Run PocketBase:
   - On Windows: Double-click the executable or run it from the command line
   - On macOS/Linux: Run the executable from the terminal

```bash
# Example for macOS/Linux
./pocketbase serve
```

## Setting up Google OAuth

1. Go to the Google Cloud Console: https://console.cloud.google.com/

2. Create a new project or select an existing one.

3. Navigate to "APIs & Services" > "Credentials".

4. Click on "Create Credentials" and select "OAuth client ID".

5. Set up the OAuth consent screen:
   - Add your application name
   - Add authorized domains
   - Set user type (External or Internal)
   - Add scopes for email and profile

6. Create the OAuth client ID:
   - Application type: Web application
   - Name: Future Classroom
   - Authorized JavaScript origins: http://localhost:3000
   - Authorized redirect URIs: http://127.0.0.1:8090/api/oauth2-redirect

7. Save the Client ID and Client Secret.

## PocketBase Admin Setup

1. Access the PocketBase Admin UI at http://127.0.0.1:8090/_/

2. Create an admin account if it's your first time.

3. Go to Settings > Auth providers.

4. Enable Google auth provider and enter the Client ID and Client Secret from the Google Cloud Console.

5. Create the necessary collections:
   - users (extends the built-in users collection)
   - ai_usage (to track usage limits)
   - tools (to store AI tool configurations)
   - community_posts (for the community feature)

## Users Collection Structure

The users collection should have the following fields:
- name (text)
- avatar (file, optional)
- role (select, options: teacher, admin)
- dailyQueriesUsed (number)
- dailyQueriesLimit (number)
- savedTemplates (relation to templates collection)

## Next.js Integration

1. Make sure the `.env.local` file has the correct URL:

```
NEXT_PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
```

2. Run your Next.js development server:

```bash
npm run dev
```

3. Test the Google Sign In functionality at http://localhost:3000/login 