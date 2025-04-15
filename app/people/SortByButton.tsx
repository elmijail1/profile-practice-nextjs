"use client";
import { useState, useRef } from "react"
import { nanoid } from "nanoid";
import { changeSorting, determineSortingButtonName } from "../../utilities/sorting";
import useHandleElsewhereClick from "../../utilities/useHandleElsewhereClick";

type PeopleProps = {
    activeSorting: "joinedIn" | "username" | "name",
    setActiveSorting: any, // how do you annotate a state setter?
    sortingOptionsData: { name: string, displayName: string }[],
    colors: { text: string, background: string }
}

export default function SortByButton({
    activeSorting,
    setActiveSorting,
    sortingOptionsData,
    colors
}: PeopleProps) {

    const [sortByMenuOpen, setSortByMenuOpen] = useState(false)
    let sortingMenuRef = useRef() // wth does it want?
    useHandleElsewhereClick(sortingMenuRef, "SBB__Button", setSortByMenuOpen)

    return (
        <div className="SBB__DivGen">

            <p
                style={{
                    color: colors.background === "0, 0%, 100%"
                        ? "white"
                        : "black"
                }}
            >
                Sort by:
            </p>

            <button
                className="SBB__Button"
                style={{ color: `hsl(${colors.text})`, backgroundColor: `hsl(${colors.background})` }}
                onClick={() => setSortByMenuOpen(prevMenu => !prevMenu)}
            >
                {determineSortingButtonName(sortingOptionsData, activeSorting)}
                <span className="SBB__ButtonArrow">▼</span>
            </button>

            {sortByMenuOpen &&
                <ul
                    className="SBB__OptionsList"
                    style={{ color: `hsla(${colors.text}, 0.7)`, backgroundColor: `hsl(${colors.background})` }}
                    ref={sortingMenuRef} // what to do about it?
                >
                    {
                        sortingOptionsData.map((sortingOption) => {
                            return (
                                <li
                                    onClick={() => changeSorting(sortingOption.name, setActiveSorting, setSortByMenuOpen(false))}
                                    key={nanoid()}
                                    className={activeSorting === sortingOption.name ? "SBB__OptionItemActive" : ""}
                                    style={activeSorting === sortingOption.name ? { color: `hsl(${colors.text})`, borderColor: `hsl(${colors.text})` } : undefined}
                                >
                                    {sortingOption.displayName}
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div >
    )
}