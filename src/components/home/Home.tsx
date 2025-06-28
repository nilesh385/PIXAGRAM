import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  FaUser,
  FaImage,
  FaHeart,
  FaSearch,
  FaBell,
  FaCommentDots,
  FaEnvelope,
  FaUserShield,
  FaHashtag,
  FaUsers,
  FaReact,
  FaGithub,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";
import {
  SiTypescript,
  SiTailwindcss,
  SiSupabase,
  SiClerk,
  SiShadcnui,
} from "react-icons/si";
import { SignInButton } from "@clerk/clerk-react";

const featuresCore = [
  {
    icon: <FaUser className="w-6 h-6 text-primary" />,
    title: "User Authentication",
    points: [
      "Sign up with email/password",
      "Login/logout",
      "Social login (Google, GitHub)",
    ],
  },
  {
    icon: <FaImage className="w-6 h-6 text-primary" />,
    title: "User Profiles",
    points: [
      "Profile creation (username, bio, profile picture)",
      "View other users' profiles",
      "Edit profile information",
    ],
  },
  {
    icon: <FaHeart className="w-6 h-6 text-primary" />,
    title: "Post Creation & Interaction",
    points: [
      "Upload images and short videos",
      "Add captions and hashtags",
      "Like/unlike posts",
    ],
  },
  {
    icon: <FaUsers className="w-6 h-6 text-primary" />,
    title: "Following System",
    points: [
      "Follow/unfollow users",
      "Display followers & following lists",
      "Feed displays posts from followed users",
    ],
  },
];

const featuresEnhanced = [
  {
    icon: <FaCommentDots className="w-6 h-6 text-primary" />,
    title: "Comments",
    points: [
      "Add and display comments on posts",
      "Like/unlike comments (optional)",
    ],
  },
  {
    icon: <FaSearch className="w-6 h-6 text-primary" />,
    title: "Search",
    points: ["Search users by username", "Search posts by hashtags (optional)"],
  },
  {
    icon: <FaBell className="w-6 h-6 text-primary" />,
    title: "Notifications",
    points: [
      "Likes, comments, follows notifications",
      "Direct message notifications",
    ],
  },
  {
    icon: <FaEnvelope className="w-6 h-6 text-primary" />,
    title: "Direct Messaging (DM)",
    points: ["Send text messages", "Display message history"],
  },
  {
    icon: <FaUserShield className="w-6 h-6 text-primary" />,
    title: "Settings",
    points: [
      "Account privacy controls",
      "Password change and 2FA",
      "Email & phone verification",
    ],
  },
  {
    icon: <FaHashtag className="w-6 h-6 text-primary" />,
    title: "Stories",
    points: [
      "Upload temporary photos/videos",
      "Stories disappear after 24 hours",
      "View stories from followed users",
    ],
  },
];

const technologies = [
  { icon: <FaReact className="w-8 h-8 text-sky-700 " />, name: "React JS" },
  {
    icon: <SiTypescript className="w-8 h-8 text-blue-800" />,
    name: "TypeScript",
  },
  {
    icon: <SiTailwindcss className="w-8 h-8 text-teal-600" />,
    name: "Tailwind CSS",
  },
  { icon: <SiShadcnui className="w-8 h-8 text-primary" />, name: "shadcn-ui" },
  { icon: <SiClerk className="w-8 h-8 text-violet-700" />, name: "Clerk Auth" },
  {
    icon: <SiSupabase className="w-8 h-8 text-emerald-600" />,
    name: "Supabase",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted text-foreground dark:from-background dark:to-muted dark:text-foreground transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative dark:bg-neutral-900 bg-neutral-100 px-20 py-24 md:py-32 mx-auto flex flex-col md:flex-row items-center justify-between gap-12 ">
        {/* Left Text Content */}
        <div className="flex-1 text-center z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-extrabold mb-6"
          >
            Share Moments, Build Connections <br />
            with <span className="text-primary">PixaGram</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-lg text-muted-foreground mb-8 mx-auto max-w-md"
          >
            A modern photo-sharing platform where you can upload, explore, and
            engage with your favorite people and moments.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-lg"
            >
              <SignInButton />
            </Button>
          </motion.div>
        </div>

        {/* Right Visual Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex-1 relative z-10 w-full max-w-md"
        >
          <div className="relative p-6 bg-muted/40 dark:bg-muted/50 rounded-3xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <FaUser className="text-primary" />
              <span className="font-medium text-foreground">john_doe</span>
            </div>
            <img
              src="https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=800&q=80"
              alt="Pixagram post"
              className="h-60 w-full object-cover rounded-xl border border-border"
            />

            <div className="mt-4 flex justify-between items-center text-sm text-muted-foreground">
              <div className="flex gap-3 items-center">
                <FaHeart className="text-destructive" />
                <span>128 likes</span>
              </div>
              <div className="flex gap-3 items-center">
                <FaCommentDots />
                <span>12 comments</span>
              </div>
            </div>
          </div>

          {/* Floating Elements */}
          <motion.div
            animate={{
              y: [0, 15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 4,
              ease: "easeInOut",
            }}
            className="absolute -top-10 -left-10 w-16 h-16 bg-primary/10 dark:bg-primary/15 rounded-full z-0"
          ></motion.div>

          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              repeat: Infinity,
              duration: 6,
              ease: "easeInOut",
            }}
            className="absolute bottom-0 -right-10 w-24 h-24 bg-muted-foreground/15 rounded-full z-0"
          ></motion.div>
        </motion.div>
      </section>

      {/* Core Features */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-semibold mb-12 text-center">
          Core Features
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {featuresCore.map(({ icon, title, points }, i) => (
            <Card
              key={i}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  {icon}
                  <h4 className="text-xl font-semibold">{title}</h4>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {points.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Enhanced Experiences */}
      <section className="bg-muted px-6 py-16 dark:bg-muted/50">
        <h3 className="text-3xl font-semibold mb-12 text-center">
          Enhanced Experiences
        </h3>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 px-6 py-5">
          {featuresEnhanced.map(({ icon, title, points }, i) => (
            <Card
              key={i}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <CardContent>
                <div className="flex  items-center gap-3 mb-4">
                  {icon}
                  <h4 className="text-xl font-semibold">{title}</h4>
                </div>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {points.map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Technologies Used */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h3 className="text-3xl font-semibold mb-12 text-center">
          Technologies Used
        </h3>
        <div className="flex flex-wrap justify-center gap-12">
          {technologies.map(({ icon, name }, i) => (
            <div key={i} className="flex flex-col items-center space-y-2">
              {icon}
              <span className="text-lg font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border text-foreground py-10 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
          {/* Brand */}
          <div>
            <img src="/fulllogo.png" alt="pixagram" className="h-20" />
            <p className="text-muted-foreground">
              Share, connect, and explore your world visually.
            </p>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-medium mb-3">Follow Us</h4>
            <div className="flex justify-center md:justify-start gap-4 text-xl">
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <FaTwitter />
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <FaInstagram />
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
              >
                <FaGithub />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="mt-10 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} PixaGram. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
