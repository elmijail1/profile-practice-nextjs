export type User = {
    id: number,
    email: string,
    name: string,
    emoji: string,
    bgColor: number[],
    joinedIn: Date,
    aboutMe: string,
    friends: number[]
}