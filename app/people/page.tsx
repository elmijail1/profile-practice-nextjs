"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import SortByButton from "./SortByButton";
import ListRow from "./ListRow";
import { sortingOptionsData } from "@/app/data/sortingOptionsData";
import { usersData } from "../data/usersData";
import { sortBy } from "../utilities/sorting";

export default function People() {
    const [activeSorting, setActiveSorting] = useState("joinedIn")
    const pageColors = {
        sortByText: "200, 80%, 60%",
        sortByBackground: "0, 0%, 100%",
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
                    activeSorting={activeSorting} // wth do I do about it?
                    setActiveSorting={setActiveSorting}
                    sortingOptionsData={sortingOptionsData}
                    colors={{ text: pageColors.sortByText, background: pageColors.sortByBackground }}
                />

                <div>
                    <ol className="Peop__LOP__List">
                        {
                            sortBy(usersData, activeSorting).map((user, index) => {
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