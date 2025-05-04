"use client";

import { useState, useEffect } from "react";
import SortByButton from "../components/SortByButton";
import ListRow from "./ListRow";
import { sortingOptionsData } from "@/data/sortingOptionsData";
import { sortBy } from "../../utilities/sorting";
import type { User } from "../types/user";
import { useSession } from "next-auth/react";

export default function People() {

    const [activeSorting, setActiveSorting] = useState<"joinedIn" | "name">("joinedIn")
    const [usersLoading, setUsersLoading] = useState(true)
    const [users, setUsers] = useState<User[]>([])

    const { data: session, status } = useSession()

    const pageColors = {
        sortByText: [200, 80, 60],
        sortByBackground: [0, 0, 100],
    }

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await fetch("/api/users")
                const users: User[] = await res.json()
                setUsers(users)
            } catch (error) {
                console.error("Error fetching users: ", error)
            } finally {
                setUsersLoading(false)
            }
        }
        fetchUsers()
    }, [])


    if (usersLoading || status === "loading") {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <main>
            <div className="Global__Screen Global__Screen__Blue">
                <div className="Peop__HeaderDiv">
                    <h1 className="Global__H1__Centered">People</h1>
                </div>

                <SortByButton
                    activeSorting={activeSorting}
                    setActiveSorting={setActiveSorting}
                    sortingOptionsData={sortingOptionsData}
                    colors={{
                        text: pageColors.sortByText,
                        background: pageColors.sortByBackground
                    }}
                />

                <div>
                    {users.length === 0
                        ? <p>No users found.</p>
                        : (
                            <ol className="Peop__LOP__List">
                                {
                                    sortBy(users, activeSorting).map((user, index) => {
                                        return (
                                            <ListRow
                                                key={user.id}
                                                user={user}
                                                listOrder={index + 1}
                                                self={user.id === Number(session?.user.id)}
                                            />
                                        )
                                    })
                                }
                            </ol>
                        )}
                </div>

            </div>
        </main >
    )
}