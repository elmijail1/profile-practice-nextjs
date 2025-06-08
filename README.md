# Profile Practice

## ℹ️ Description
This is a fullstack web app that lets users sign up, manage their profile, add friends, and view other users.

Please note that it's a learning-focused project – hence, in its current form it's not a standalone commercial app. Yet though it's built for practice, it features real-world functionality – and shows what solutions I've come up with during development.

## 🚀 Quick start

Find Profile Practice live by following this link:
https://profile-practice-nextjs-production.up.railway.app/

## 🤔 Why did I make this app?
After finishing my first app ([Georgian Transilterator](https://github.com/elmijail1/georgian-transliterator)), I wanted to explore user authentication – a powerful and widespread feature I barely knew how to implement. To be honest, at first I didn't even realize that it required a backend – you live and learn 🤷‍♂️

And this app became a playground for several essential web development concepts, like authentication, session expiration, database callbacks, etc. I believe that it's safe to say that it helped me transition from a frontend-only mindset to actually building a fullstack app. The learning curve was steep and at times it wasn't easy to carry on, but the result was well worth it.

## ⚙️ Features
- 🚪 User sign-up and login
- ⚙️ Profile editing (name, email, password, image, about me)
- 🤝 Add / remove friends
- 🗂 User list with sorting & pagination
- ✅ Real-time email availability check
- ⏳ Auto-logout after inactivity with redirect

## 📖 Pages
### 1. Authentication
- Sign up or log in via tabbed interface
gif

### 2. People
- Browse and sort users
gif

### 3. Profile
- View others' profiles, update your own, manage yor friend list
gif


## 🛠 Tech stack
1. Next.js
2. TypeScript
3. PostgresQL
4. Prisma
5. NextAuth

### Development notes
#### 1. Next.js
At first, I planned to use React and Firebase. I switched to Next.js after deciding to have more control over my backend. With time I've come to appreciate how beginner-friendly and powerful Next is. The only notable issue with it was debugging session expiration behavior on the client – its aggessive cache prevented my solution from working properly. Figuring out what the problem was and how to fix it was truly a learning opportunity in disguise!

#### 2. TypeScript
I started in plain JS, but decided to adopt TypeScript after seeing it in a Next tutorial. It slowed me down at some moments (all those linting errors...) but in the long run it definitely improved my code's precision.

#### 3. PostgresQL
My first time using a relational database in an app. Smooth experience overall, so far haven't had any notable issues with it. And speaking of issues...

#### 4. Prisma
Prisma gave me headache a couple of times. Its setup wasn't smooth sailing, as I was "lucky" to start using Prisma after it got a major update – the docs had conflicting information probably because of that. Another issue was with deployment on Vercel – seems to be a compatibility issue. Popular solutions didn't work for me, so I just moved to Railway which worked fine. Overall, Prisma does its job well, but the guidelines could be clearer. However, it's also worth noting that its developers added a chatbot on their website – props to them for that!

#### 5. NextAuth
Authentication was the most challenging part. NextAuth seems to be pretty poewrful, but also has a steep learning curve. I'm definitely planning to revisit in future projects to get a better command of it.

## ❤️ Acknowledgements
- **[Mosh Hamedani](https://codewithmosh.com/)** (CodeWithMosh) – for introducing me to Next.js and making me enthusiastic about TypeScript with [his Next.js course](https://codewithmosh.com/p/ultimate-nextjs-series)
- **[Luke Barousse](https://www.lukebarousse.com/)** – for a great introduction to PostgresQL and SQL in general in [his YouTube course](https://www.youtube.com/watch?v=7mz73uXD9DA)
- **[Duolingo](https://www.duolingo.com/)** – for design inspiration from a decent language-learning app

## 🤝 Contributing

Clone this repo:

```
git@github.com:elmijail1/profile-practice-nextjs.git
```

This app isn't perfect – and that's okay. I built it to learn.
Still, there's room for improvement (performance, UX, design), and I'm always open to feedback. Feel ree to fork, play around, or suggest changes – I'll be happy to revisit it!
