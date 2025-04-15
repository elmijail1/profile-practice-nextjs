type user = {
    id: number,
    name: string,
    username: string,
    emoji: string,
    bgColor: string,
    joinedIn: Date,
    aboutMe: string,
    friends: number[]
}

export const usersData: user[] = [
    {
        id: 1,
        name: "Jack O'Lantern",
        username: "jackolantern15",
        emoji: "🎃",
        bgColor: "hsl(0, 0%, 95%)",
        joinedIn: new Date(2013, 11),
        aboutMe: `I like lighting fires and eating pumpkins with sea salt. Yeah, that's really weird.`,
        // friends: [2, 3, 4],
        friends: [3, 4],
    },
    {
        id: 2,
        name: "Gina Machina",
        username: "ginamachina16",
        emoji: "🤖",
        bgColor: "hsl(50, 90%, 90%)",
        joinedIn: new Date(2015, 10),
        aboutMe: `Beyond human. Robots 01100110 01110100 01110111!`,
        friends: [1, 3],
    },
    {
        id: 3,
        name: "1C3K0LD",
        username: "icecold17",
        emoji: "🥶",
        bgColor: "hsl(300, 90%, 80%)",
        joinedIn: new Date(2017, 9),
        aboutMe: `Some people hate cold but I adore it! I'm the coolest!`,
        friends: [1, 2],
    },
    {
        id: 4,
        name: "AdNauseum",
        username: "adnauseum18",
        emoji: "🤢",
        bgColor: "hsl(100, 90%, 80%)",
        joinedIn: new Date(2020, 0),
        aboutMe: `If something must be learnt, I will keep learning it until I'm nauseaus.`,
        friends: [1],
    },
];
