"use client";
import { nanoid } from "nanoid"
import ListRow from "./ListRow"
import { sortBy } from "@/utilities/sorting"
import { useProfileContext } from "@/lib/ProfileContext";
import React, { SetStateAction, useState } from "react";
import type { User } from "@/app/types/user";
import { mutate as globalMutate } from "swr"
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react"

type FLWProps = {
    setProfileData: React.Dispatch<SetStateAction<User | undefined>>,
    setOpenFriendList: React.Dispatch<SetStateAction<boolean>>,
    friendsList: number[],
    mutate?: () => Promise<User | undefined>,
    page: number,
    limit: number
}

export default function ListOfFriends({
    setProfileData, setOpenFriendList, friendsList, mutate, page, limit
}: FLWProps) {

    const { isOwnProfile } = useProfileContext()

    const [error, setError] = useState("")
    const router = useRouter()

    async function removeFriend(friendId: number, mutate?: () => Promise<User | undefined>) {
        const res = await fetch("/api/account/friend-remove", {
            method: "PATCH",
            body: JSON.stringify({ friendId }),
            headers: { "Content-Type": "application/json" }
        })

        if (!res.ok) {
            const response = await res.json()
            if (response.error === "Session expired") {
                await signOut({ redirect: false })
                router.push("/login?reason=expired")
                return
            }
            setError("Removing friends in currently unavailable. Try again later.")
            throw new Error("Failed to remove friend")
        }

        setProfileData((prev): User | undefined => {
            if (!prev) return prev
            return {
                ...prev,
                friends: prev.friends.filter((id: number) => id !== friendId)
            }
        })

        await globalMutate("/api/account/friend-list", (prev: number[] = []) =>
            prev.filter(id => id !== friendId),
            { revalidate: false }
        )

        if (mutate) {
            await mutate()
        }
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