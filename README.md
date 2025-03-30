# Victory Baptist Church CMS

A custom Content Management System (CMS) for Victory Baptist Church website.

## System Requirements

- Node.js (v14 or later)
- npm or yarn package manager

## Project Structure

- `/apps/website` - The front-end React website
- `/apps/admin` - The admin panel for content management
- `/public` - Static assets served directly by the server
- `/assets` - Media assets organized by category
- `/uploads` - User-uploaded files
- `db.json` - The database file for the CMS
- `start-json-server.js` - Server script to run the CMS backend
- `auth-middleware.js` - Authentication handlers

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm run server
   ```

3. In a separate terminal, start the website:
   ```
   cd apps/website
   npm install
   npm run dev
   ```

## Using the CMS

### Access Points

- Website: http://localhost:5173
- CMS API: http://localhost:3000
- Admin Panel: http://localhost:5173/admin

### Default Login Credentials

- Admin:
  - Username: admin
  - Password: church_admin_2025

- Editor:
  - Username: pastor
  - Password: pastor_2025

### Content Types

The CMS manages several types of content:

1. **Sermons** - Church messages with video links
2. **Events** - Upcoming church events and services
3. **Leaders** - Church leadership profiles
4. **Cell Groups** - Small group ministries
5. **Media** - Various media assets (images, documents, etc.)

### API Endpoints

- `/login` - Authentication endpoint
- `/api/upload` - File upload endpoint
- `/auth/status` - Check authentication status
- `/users` - User management (protected)
- `/sermons` - Sermon content
- `/events` - Event content
- `/leaders` - Leadership profiles
- `/cellGroups` - Cell group information
- `/media` - Media assets

## Security Notes

- Authentication uses JWT tokens
- Passwords are stored with SHA-256 hashing
- Environment variables control server configuration 

## Troubleshooting

If you experience image loading or CORS issues:

1. Make sure the server is running (`npm run server`)
2. Check that image paths are correctly specified
3. Verify that all asset directories exist
4. Check browser console for specific errors

For any technical issues, please contact the system administrator. 