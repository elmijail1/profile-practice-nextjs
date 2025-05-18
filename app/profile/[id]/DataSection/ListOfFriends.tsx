"use client";
// *0.1 Imports
// general
import { nanoid } from "nanoid"
// components
import ListRow from "./ListRow"
// utilities
import { sortBy } from "@/utilities/sorting"
import { useOwnFriendList } from "./useOwnFriendList";

type FLWProps = {
    profileData: any,
    setProfileData: any,
    setOpenFriendList: any,
    friendsList: any[],
    isOwnProfile: boolean,
    mutate?: any
}

export default function ListOfFriends({
    profileData, setProfileData, setOpenFriendList, friendsList, isOwnProfile, mutate // *0.2 Props
}: FLWProps) {

    async function removeFriend(friendId: number, mutate: () => void) {
        const res = await fetch("/api/account/friend-remove", {
            method: "PATCH",
            body: JSON.stringify({ friendId }),
            headers: { "Content-Type": "application/json" }
        })

        if (!res.ok) {
            throw new Error("Failed to remove friend")
        }

        setProfileData((prev: any) => ({
            ...prev,
            friends: prev.friends.filter((id: number) => id !== friendId)
        }))

        await mutate()
    }

    return (
        <ol className="ProfLOF__ListWrapper">
            {sortBy(friendsList, "name").map((user, index) => {
                return (
                    <ListRow
                        key={nanoid()}
                        user={user}
                        listOrder={index + 1}
                        deleteOnClick={isOwnProfile ? () => removeFriend(user.id, mutate) : null}
                        extraActionOnClick={() => setOpenFriendList(false)}
                        textColor="0, 0%, 0%"
                    />
                )
            })
            }
        </ol>
    )
}