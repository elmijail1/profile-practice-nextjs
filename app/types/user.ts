export type User = {
    id: number,
    email: string,
    name: string,
    username: string,
    emoji: string,
    bgColor: number[],
    joinedIn: Date,
    aboutMe: string,
    friends: number[]
}