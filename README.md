# Profile Practice

## 📖 Description
This is a fullstack web app that lets users sign up, manage their profile, add friends, and view other users.

Please note that it's a learning-focused project – hence, in its current form it's not a standalone commercial app. Yet though it's built for practice, it features real-world functionality – and shows what solutions I've come up with during development.

## 🚀 Quick start

Find Profile Practice live by following this link:
https://profile-practice-nextjs-production.up.railway.app/

## 🤔 Why did I make this app?
Ever since I finished my first app ([Georgian Transilterator](https://github.com/elmijail1/georgian-transliterator)), I was wondering what it's like to make an app that lets you authenticate users. Before I started working on it, I didn't even realize that it needed a server part – you live and learn 🤷‍♂️

And this app does indeed live for me to learn: it's my playground for several basic web-dev concepts that I, as a beginner, found both exciting in functionality and mysterious in implementation.

When I started it I thought of myself as a purely frontend developer. Now that I've finished it, I realize that I can do fullstack. It helped me grow a lot.

## ⚙️ What does this app do?
This app lets you:
1. Create an account or log into an existing one
2. Change your profile's data: name, email, about me, image, and password
3. View other people's profiles and add them to your friend list – or remove them from it

Minor yet important features:
- Real-time email uniqueness check for signing up or updating email
- Pagination and sorting for user lists
- Automatic user session logout due to inactivity with redirecting

### Pages
After all the work I've done, I was surprised to realize that the app actually has only three full-fledged pages (not counting dynamic ones, that is):
1. **Authentication screen**: log in or sign up by choose one of two tabs available here.
2. **People list**: view all the users registered in the app and sort them.
3. **Profile**: view users' details and update yours. Also add / remove friends.

Brief showcase of each:
#### 1. Authentication
gif

#### 2. People
gif

#### 3. Profile
gif


## 🛠 What did I use in this app?
1. Next.js
2. TypeScript
3. PostgresQL
4. Prisma
5. NextAuth

### 1. Next.js
At first the idea of the stack inlcuded just React, then it evolved to include Express. I've learned about Next.js after my entire frontend part was finished and I had to start working on the server side (which I was absolutely clueless about and had only little experience with previously). I found Next to be convenient and straightforward for a beginner, so I moved my app to it. I didn't regret it. Well, maybe just once, when Next's aggressive caching prevented my user session from expiring properly on the client which I couldn't find an explanation for for several days. But then again, nothing is perfect.

### 2. TypeScript
At first the app used regular JavaScript. But as I was learning to use Next with a tutorial that used TypeScript, I decided that it wouldn't hurt to move to it, as well. Certainly, it led to numerous linting errors on my first builds which I wasn't very happy to discover – but it was great practice and I don't regret it. Now I use TypeScript more or less confidently for basic tasks and find it very hepful.

### 3. PostgresQL
My first experience with a relational database. Loved it, so far haven't had any issues with it. But speaking of issues...

### 4. Prisma
Now if something did annoy me during the development, it was Prisma. I was lucky to start using it right after they had a major update so at first I couldn't understand how to set it up properly for quite some time. After that, things went more or less smoothly until deployment. Since my app's built on Next, it was natural for me to try deploying it on Vercel – but Prisma made it almost impossible with errors that I failed to resolve, so I had to move to Railway which didn't have anything of that kind. It's not a bad ORM and it does its job fine, but its documentation and compatibility could be better. Thankfully, the devs added a chatbot to their website, so it should be less frustrating now – props to them!

### 5. NextAuth
Perhaps, the least straightforward part of my app's development. NextAuth requires lots of learning and since it was my first app with authentication, I didn't have it easy with it. I certainly want to make a couple more apps with it to get a better command of it.

## ❤️ Acknowledgements
- **Mosh Hamedani** (CodeWithMosh) for introducing me to Next.js and making me enthusiastic about TypeScript with [his course](https://codewithmosh.com/p/ultimate-nextjs-series)
- **Luke Barousse** for a great introduction to PostgresQL and SQL in general in [his YouTube course](https://www.youtube.com/watch?v=7mz73uXD9DA)
- **Duolingo Team** for design inspiration – [check them out](https://www.duolingo.com/) if you haven't seen their language-learning app yet

## 🤝 Contributing

Clone this repo:

```
git@github.com:elmijail1/profile-practice-nextjs.git
```

By no means this app is perfect. Neither it's a _tour de force_ of an experienced developer. Yet it doesn't mean that this app is bad: I spent a lot of time on it, working on all its features to make them do the right thing. So it does what you expect. But it can be improved – at least in terms of optimization, UI, and UX. So always feel free to suggest improvements, I'll be happy to revisit this app.
