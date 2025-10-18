# Nested Comments System

A modern, fully-functional nested commenting system built with Next.js, MongoDB, and Tailwind CSS. Features include authentication, unlimited nesting levels, upvotes, collapsible threads, and admin privileges.

## Features

**Core Features**
- Nested comment threads with unlimited depth
- Visual hierarchy with indentation
- Upvote system for comments
- Collapse/expand comment threads
- Sort comments (newest, oldest, most upvoted, most replies)
- Responsive design (mobile, tablet, desktop)

**Authentication**
- User registration and login
- JWT-based authentication
- Admin privileges for content moderation

**UI/UX**
- Modern, clean interface
- Smooth animations with Framer Motion
- Real-time updates
- Intuitive user interactions

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT, bcrypt
- **Animations**: Framer Motion
- **Deployment**: Docker ready

## Prerequisites

- Node.js 18+ installed
- MongoDB instance (local or cloud)
- npm or yarn package manager

## Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd nested-comments-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/nested-comments
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nested-comments

JWT_SECRET=your-super-secret-jwt-key-change-this
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. **Seed the database** (Optional but recommended)
```bash
npm run seed
```

5. **Run the development server**
```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Demo Credentials

After seeding the database:

**Regular User:**
- Email: `demo@example.com`
- Password: `demo123`

**Admin User:**
- Email: `admin@example.com`
- Password: `admin123`

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes
│   ├── login/         # Login page
│   └── page.js        # Main page
├── components/        # React components
├── lib/              # Database and auth utilities
└── utils/            # Helper functions
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Comments
- `GET /api/comments` - Get all comments
- `POST /api/comments` - Create comment
- `DELETE /api/comments/[id]` - Delete comment

### Upvotes
- `POST /api/upvote` - Upvote/downvote comment

## Docker Deployment

1. **Build the image**
```bash
docker build -t nested-comments .
```

2. **Run with docker-compose**
```bash
docker-compose up -d
```

## Cloud Deployment

### Frontend (Vercel/Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Add environment variables
4. Deploy

### Backend & Database
- **MongoDB**: Use MongoDB Atlas (free tier available)
- **Full-stack**: Deploy to Render, Railway, or Fly.io

## Features Implemented

Nested comment structure
Authentication system
Upvote functionality
Collapse/expand threads
Sort comments
Admin privileges
Responsive design
Smooth animations
Docker support
RESTful API

## Development

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database
npm run seed
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/nested-comments` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-secret-key-here` |
| `NEXT_PUBLIC_API_URL` | API URL for client-side | `http://localhost:3000` |

## Screenshots

### Login Page
Clean authentication interface with registration option.

### Main Feed
Post with nested comments below, sorting options available.

### Comment Thread
Deeply nested conversations with visual hierarchy.

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running locally or connection string is correct
- Check firewall settings for MongoDB Atlas
- Verify IP whitelist in MongoDB Atlas

### Authentication Errors
- Clear browser cookies
- Check JWT_SECRET is set
- Verify token expiration time

### Build Errors
- Delete `.next` folder and `node_modules`
- Run `npm install` again
- Check Node.js version (18+)

## Future Enhancements

- Real-time updates with WebSockets
- Rich text editor for comments
- Image uploads
- User profiles
- Notifications system
- Comment editing
- Markdown support
- Search functionality
- Email verification

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for learning or production.

## Acknowledgments

- Inter IIT Tech Meet 14.0
- Next.js Team
- MongoDB Community
- Tailwind CSS
- Framer Motion

---

Built Inter IIT Tech Meet 14.0 Selections
