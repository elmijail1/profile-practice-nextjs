"use client";
// *0.1 Imports
// general
import { nanoid } from "nanoid"
// components
import ListRow from "./ListRow"
// utilities
import { sortBy } from "@/utilities/sorting"
import { useProfileContext } from "@/lib/ProfileContext";
import { useState } from "react";

type FLWProps = {
    setProfileData: any,
    setOpenFriendList: any,
    friendsList: any[],
    mutate?: any,
    page: number,
    limit: number
}

export default function ListOfFriends({
    setProfileData, setOpenFriendList, friendsList, mutate, page, limit
}: FLWProps) {

    const { isOwnProfile } = useProfileContext()

    const [error, setError] = useState("")

    async function removeFriend(friendId: number, mutate: () => void) {
        const res = await fetch("/api/account/friend-remove", {
            method: "PATCH",
            body: JSON.stringify({ friendId }),
            headers: { "Content-Type": "application/json" }
        })

        if (!res.ok) {
            setError("Removing friends in currently unavailable. Try again later.")
            throw new Error("Failed to remove friend")
        }

        setProfileData((prev: any) => ({
            ...prev,
            friends: prev.friends.filter((id: number) => id !== friendId)
        }))

        await mutate()
    }

    if (!friendsList || friendsList.length === 0) {
        return (
            <p className="text-black">
                No friends found
            </p>
        )
    }

    return (
        <>
            <p className="text-red-500 w-[80%] text-center my-1">
                {error}
            </p>
            {/* <ol className="[list-style:none] p-0 mt-0 flex flex-col gap-2 w-4/5 h-full"> */}
            <ol className="[list-style:none] p-0 mt-0 flex flex-col gap-2 w-[14rem] h-full">
                {sortBy(friendsList, "name").map((user, index) => {
                    return (
                        <ListRow
                            key={nanoid()}
                            user={user}
                            listOrder={((page - 1) * limit) + index + 1}
                            deleteOnClick={isOwnProfile && !error ? () => removeFriend(user.id, mutate) : null}
                            extraActionOnClick={() => setOpenFriendList(false)}
                            textColor="0, 0%, 0%"
                        />
                    )
                })
                }
            </ol>
        </>
    )
}