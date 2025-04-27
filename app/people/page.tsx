"use client";

import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import SortByButton from "../components/SortByButton";
import ListRow from "./ListRow";
import { sortingOptionsData } from "@/data/sortingOptionsData";
import { sortBy } from "../../utilities/sorting";
import type { User } from "../types/user";

export default function People() {
    const [activeSorting, setActiveSorting] = useState<"joinedIn" | "username" | "name">("joinedIn")
    const pageColors = {
        sortByText: [200, 80, 60],
        sortByBackground: [0, 0, 100],
    }

    const [users, setUsers] = useState<User[] | undefined>()
    useEffect(() => {
        async function fetchUsers() {
            const res = await fetch("/api/users")
            const users = await res.json()
            setUsers(users)
        }
        fetchUsers()
    }, [])

    if (!users) {
        return (
            <p>Loading...</p>
        )
    }

    return (
        <main>
            <div className="Global__Screen Global__Screen__Blue">

                <div className="Peop__HeaderDiv">
                    <h1 className="Global__H1__Centered">
                        People
                    </h1>
                </div>

                <SortByButton
                    activeSorting={activeSorting}
                    setActiveSorting={setActiveSorting}
                    sortingOptionsData={sortingOptionsData}
                    colors={{ text: pageColors.sortByText, background: pageColors.sortByBackground }}
                />

                <div>
                    <ol className="Peop__LOP__List">
                        {
                            sortBy(users, activeSorting).map((user, index) => {
                                return (
                                    <ListRow
                                        key={nanoid()}
                                        user={user}
                                        listOrder={index + 1}
                                        self={user.id === 1 ? true : false}
                                    />
                                )
                            })
                        }
                    </ol>
                </div>

            </div>
        </main>
    )
}