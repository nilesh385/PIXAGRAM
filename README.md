#### Link

# Run the following command first to run the backend server for clerk webhook.

- ngrok http --url=relaxing-octopus-brief.ngrok-free.app 3000

# Here's the forwarding url of it (just for information)

- https://relaxing-octopus-brief.ngrok-free.app

# if the forwarding url is different than the above url,

- then go to clerk dashboard -> webhooks
- create new endpoint.
- add the forwading url in the endpoint and also add '/app/webhooks' in it.
- example url -> https://relaxing-octopus-brief.ngrok-free.app/api/webhooks
- now everything should be working properly.

# 📸 PixaGram

**PixaGram** is a modern Instagram clone built using the MERN stack and other modern tools. It offers all core social media functionalities like posts, user profiles, likes, comments, following, direct messaging, and more — with a clean and responsive UI.

---

## 🚀 Tech Stack

This project is built with:

- ⚛️ **React.js** — Component-based frontend UI library
- 🔡 **TypeScript** — Strongly-typed JavaScript
- 🎨 **Tailwind CSS** — Utility-first CSS framework
- 🧩 **shadcn/ui** — Accessible and customizable UI components
- 🔐 **Clerk** — Authentication provider (Email, Google, GitHub)
- 🗄️ **Supabase** — Realtime backend service (Database, Auth, Storage)

---

## 🌟 Core Features

### 🔐 User Authentication

- Email/password sign up and login
- Social login with Google and GitHub
- Secure logout

### 👤 User Profiles

- Create profile with username, bio, and profile picture
- View other users’ profiles
- Edit and update own profile

### 🔍 Search

- Search users by username and fullname

### 🖼️ Post Creation

- Upload image posts (optionally videos)
- Add captions with hashtags
- Basic hashtag detection and linking

### 📰 Post Display

- Feed shows posts in reverse chronological order
- Show post image, caption, timestamp
- Like/unlike functionality
- Show like counts

### 👥 Following System

- Follow/unfollow users
- View followers and following lists
- Main feed shows posts from followed users

### 💬 Comments

- Add and view comments on posts
- Optional: Like/unlike comments

### Admin Panel

- Admin can view all the users and posts
- Admin can block users
- Admin can delete posts

---

## 🔧 Secondary Features

### 🔍 Search

- Optional: Search posts by hashtags

### 🔔 Notifications

- Notifications for:
  - New likes
  - New comments
  - New followers
- Optional: Direct message alerts

### ⚙️ User Settings

- Privacy controls (public/private)
- Change password
- Email and phone verification
- Two-Factor Authentication (2FA)

### ✉️ Direct Messaging (Basic)

- Send/receive text messages
- View full conversation history

### 📷 Stories (Simplified)

- Upload temporary photos/videos
- Auto-expire after 24 hours
- View stories of users you follow

---

### 📌 Future Improvements

Advanced DM with media support

Story reactions

Real-time notifications with WebSockets

Explore page with trending posts

Post analytics and insights

### 🙌 Acknowledgements

Clerk.dev

Supabase

shadcn/ui

Tailwind CSS
