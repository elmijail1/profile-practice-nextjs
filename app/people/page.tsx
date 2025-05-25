"use client";

import { useState, useEffect } from "react";
import SortByButton from "../components/SortByButton";
import ListRow from "./ListRow";
import { sortingOptionsData } from "@/data/sortingOptionsData";
import { sortBy } from "../../utilities/sorting";
import type { User } from "../types/user";
import { useSession } from "next-auth/react";

export default function People() {

    const { data: session, status } = useSession()
    const [isLoading, setIsLoading] = useState(true)
    const [activeSorting, setActiveSorting] = useState<"joinedIn" | "name">("joinedIn")
    const pageColors = { sortByText: [200, 80, 60], sortByBackground: [0, 0, 100] }

    const [users, setUsers] = useState<User[]>([])
    const [page, setPage] = useState(1)
    const limit = 5
    const [total, setTotal] = useState(0)
    const [renderPage, setRenderPage] = useState(1)

    useEffect(() => {
        async function fetchUsers() {
            setIsLoading(true)
            try {
                const res = await fetch(`/api/users?page=${page}&limit=${limit}&order=${activeSorting}`)
                const { users, total }: { users: User[], total: number } = await res.json()
                setUsers(users)
                setTotal(total)
                setRenderPage(page)
            } catch (error) {
                setUsers([])
                console.error("Error fetching users: ", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchUsers()
    }, [page])

    const mainDivClassMob = "w-full min-h-max h-[calc(100vh-80px)] flex flex-col items-center relative bg-[hsl(200,80%,60%)] text-white pb-5"
    const mainDivClassDesk = "xl:h-screen xl:pt-[3rem]"

    const topDivClassMob = "w-4/5 flex justify-between items-center h-16 border-b border-white my-4"
    const topDivClassDesk = "xl:max-w-[30rem]"

    return (
        <main>
            <div className={`${mainDivClassMob} ${mainDivClassDesk}`}>

                <div className={`${topDivClassMob} ${topDivClassDesk}`}>
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

                <div className="h-[18rem] w-[15rem] flex justify-center">
                    {
                        isLoading || status === "loading" &&
                        <p>Loading users...</p>
                    }

                    {!isLoading && users.length === 0
                        ? <p className="pt-5">No users found.</p>
                        : (
                            <ol className="list-none p-0 my-1 flex flex-col gap-[0.8rem] w-full">
                                {
                                    sortBy(users, activeSorting).map((user, index) => {
                                        return (
                                            <ListRow
                                                key={user.id}
                                                user={user}
                                                listOrder={(limit * (renderPage - 1)) + (index + 1)}
                                                self={user.id === Number(session?.user.id)}
                                            />
                                        )
                                    })
                                }
                            </ol>
                        )}
                </div>

                {
                    total > 5 &&
                    <div className="mt-4 flex justify-between w-[90%] xl:max-w-[22rem] px-4">
                        <button
                            className={`px-3 py-1 font-semibold text-[1.2rem] bg-white text-[hsl(200,80%,60%)] rounded-3xl xl:cursor-pointer ${renderPage === 1 && "opacity-0"} ${renderPage !== page && "opacity-50"}`}
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={renderPage !== page || renderPage === 1}
                        >
                            ◀ Prev
                        </button>
                        {
                            total
                                ? <span className="self-center">Page {page} of {Math.ceil(total / limit)}</span>
                                : <span className="self-center">Loading pages...</span>
                        }
                        <button
                            className={`px-3 py-1 font-semibold text-[1.2rem] bg-white text-[hsl(200,80%,60%)] rounded-3xl xl:cursor-pointer ${renderPage * limit >= total && "opacity-0"} ${renderPage !== page && "opacity-50"}`}
                            onClick={() => setPage((p) => p + 1)}
                            disabled={renderPage !== page || renderPage * limit >= total}
                        >
                            Next ▶
                        </button>
                    </div>
                }

            </div>
        </main >
    )
}