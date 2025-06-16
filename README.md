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

## Project info

## Introduction

- PixaGram is a clone of Instagram.

## What technologies are used for this project?

## This project is built with .

- React JS
- TypeScript
- Tailwind CSS
- shadcn-ui
- Clerk Authentication
- Supabase

## Core Features (Essential):

# User Authentication:

- Sign up with email/password.
- Login/logout.
- Social login (Google, GitHub ).

# User Profiles:

- Profile creation (username, bio, profile picture).
- View other users' profiles.
- Edit profile information.

# Post Creation:

- Upload images (and potentially short videos).
- Add captions/descriptions to posts.
- Hashtag support (basic parsing and display).

# Post Display:

- Display posts in a feed (reverse chronological order).
- Display post images/videos.
- Display post captions and timestamps.
- Like/unlike posts.
- Display number of likes.

# Following/Followers:

-Follow/unfollow other users.
-Display a list of followers and following.
-Display posts from followed users in the main feed.

## Secondary Features (Enhancements):

# Comments:

- Add comments to posts.
- Display comments below posts.
- Like/unlike comments (optional).

# Search:

- Search for users by username.
- Search for posts by hashtags (optional).

# Notifications:

- Like, comment, and follow notifications
- Direct message notifications

# Settings:

- Account privacy settings
- Password change
- Email and phone number verification
- Two-factor authentication

# Direct Messaging (DM - Basic):

- Send text messages to other users.
- Display message history.

# Stories (Simplified):

- Upload temporary photos/videos (disappearing after 24 hours).
- View stories from followed users.
