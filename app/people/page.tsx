"use client";

import { useState, useEffect } from "react";
import SortByButton from "../components/SortByButton";
import ListRow from "./ListRow";
import { sortingOptionsData } from "@/data/sortingOptionsData";
import { sortBy } from "../../utilities/sorting";
import type { User } from "../types/user";
import { useSession } from "next-auth/react";
import Loader from "../components/Loader";

export default function People() {

    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [activeSorting, setActiveSorting] = useState<"joinedIn" | "name">("joinedIn")
    const pageColors = { sortByText: [200, 80, 60], sortByBackground: [0, 0, 100] }

    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(1)
    const limit = 5
    const [total, setTotal] = useState(0)

    useEffect(() => {
        async function fetchUsers() {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/users?page=${page}&limit=${limit}&order=${activeSorting}`)
                const { users, total }: { users: User[], total: number } = await res.json()
                setUsers(users)
                setTotal(total)
            } catch (error) {
                setUsers([])
                console.error("Error fetching users: ", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [page])



    const MainDivClass = "w-full min-h-[45rem] flex flex-col items-center relative pb-[5rem] bg-[hsl(200,80%,60%)] text-white sm:w-[360px] sm:h-[600px]"

    if (isLoading || status === "loading") {
        return (
            <main>
                <div className={MainDivClass}>
                    <Loader />
                </div>
            </main >
        )
    }

    return (
        <main>
            <div className={MainDivClass}>

                <div className="w-4/5 flex justify-between items-center h-16 border-b border-white my-4">
                    <h1 className="mx-auto">People</h1>
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
                            <ol className="list-none p-0 mt-0 flex flex-col gap-[0.8rem] w-full">
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
                <div className="mt-4 flex justify-between w-full px-4">
                    <button
                        className="px-4 py-2 bg-white text-black rounded disabled:opacity-50"
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                        disabled={page === 1}
                    >
                        Prev
                    </button>
                    <span className="self-center">Page {page} of {Math.ceil(total / limit)}</span>
                    <button
                        className="px-4 py-2 bg-white text-black rounded disabled:opacity-50"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page * limit >= total}
                    >
                        Next
                    </button>
                </div>

            </div>
        </main >
    )
}