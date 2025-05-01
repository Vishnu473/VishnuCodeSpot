
# Blog Application

A simple blog application built with React, TypeScript, and Supabase. It allows users to view blog posts, toggle between light and dark themes, and preview markdown content.

## Features

- **View Blog Posts**: Users can view a list of blog posts and click to read the full content.
- **Markdown Preview**: Blog post content is rendered using Markdown and dynamically converted to HTML.
- **Theme Toggle**: Switch between light and dark themes with persistence across sessions.
- **Admin Panel**: A page for managing blog posts (add, edit, delete).
- **Responsive Layout**: Mobile-friendly design with responsive navigation and content layout.
- **Supabase Backend**: Integrated with Supabase for handling blog posts storage and management.

## Project Structure

```
📦src
 ┣ 📂assets
 ┃ ┗ 📜react.svg            # Static assets like images/icons
 ┣ 📂components
 ┃ ┣ 📜Layout.tsx            # Wrapper component for layout
 ┃ ┣ 📜MarkDownPreview.tsx   # Component to preview markdown content
 ┃ ┗ 📜NotFound.tsx          # Page not found component
 ┣ 📂Context
 ┃ ┗ 📜ThemeContext.tsx      # Context for theme management (light/dark)
 ┣ 📂pages
 ┃ ┣ 📜Admin.tsx            # Admin page for managing posts
 ┃ ┣ 📜BlogPost.tsx         # Blog post detail page
 ┃ ┗ 📜Home.tsx             # Home page displaying list of blog posts
 ┣ 📂types
 ┃ ┗ 📜BlogPosts.ts         # Type definitions for blog posts
 ┣ 📂utils
 ┃ ┗ 📜supabaseClient.ts    # Utility for interacting with Supabase API
 ┣ 📜App.css                # Global styles
 ┣ 📜App.tsx                # Main app entry
 ┣ 📜index.css              # Global styles for index page
 ┣ 📜main.tsx               # Entry point for React app
 ┗ 📜vite-env.d.ts          # Vite environment types
```

## Tech Stack

- **React** - JavaScript library for building user interfaces
- **TypeScript** - Typed JavaScript to enhance development experience
- **Tailwind CSS** - Utility-first CSS framework for custom styles
- **Supabase** - Backend-as-a-Service for managing blog posts and authentication
- **Vite** - Fast and modern build tool for frontend development

## Setup

### Prerequisites

- Node.js (version >= 14.x)
- Supabase account (to manage your blog posts)

### Getting Started

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/blog-app.git
   cd blog-app
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up Supabase**:
   - Create a new Supabase project at [Supabase](https://supabase.io/).
   - Set up a new table for blog posts with fields like `title`, `content`, and `createdAt`.
   - Update the `supabaseClient.ts` file with your Supabase URL and anon key.

4. **Run the app locally**:

   ```bash
   npm run dev
   ```

   This will start the development server and the app will be available at `http://localhost:3000`.

## Usage

- On the home page, you can see a list of blog posts.
- Click on any post to read the full content.
- Admins can manage blog posts (add, edit, or delete) from the Admin page.
- Toggle between light and dark theme using the button in the navigation bar.

## Contributing

1. Fork this repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and test them.
4. Submit a pull request with a detailed description of your changes.
