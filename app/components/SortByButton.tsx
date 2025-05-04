"use client";
import { useState, useRef } from "react"
import { nanoid } from "nanoid";
import { changeSorting, determineSortingButtonName } from "../../utilities/sorting";
import useHandleElsewhereClick from "../../utilities/useHandleElsewhereClick";

type PeopleProps = {
    activeSorting: "joinedIn" | "name",
    setActiveSorting: any, // how do you annotate a state setter?
    sortingOptionsData: { name: string, displayName: string }[],
    colors: { text: number[], background: number[] }
}

export default function SortByButton({
    activeSorting,
    setActiveSorting,
    sortingOptionsData,
    colors
}: PeopleProps) {

    const [sortByMenuOpen, setSortByMenuOpen] = useState(false)
    let sortingMenuRef = useRef<any>(null)
    useHandleElsewhereClick(sortingMenuRef, "SBB__Button", setSortByMenuOpen)

    return (
        <div className="SBB__DivGen">

            <p
                style={{
                    color: colors.background[0] === 0 && colors.background[1] === 0 && colors.background[2] === 100
                        ? "white"
                        : "black"
                }}
            >
                Sort by:
            </p>

            <button
                className="SBB__Button"
                style={{ color: `hsl(${colors.text[0]}, ${colors.text[1]}%, ${colors.text[2]}%)`, backgroundColor: `hsl(${colors.background[0]}, ${colors.background[1]}%, ${colors.background[2]}%)` }}
                onClick={() => setSortByMenuOpen(prevMenu => !prevMenu)}
            >
                {determineSortingButtonName(sortingOptionsData, activeSorting)}
                <span className="SBB__ButtonArrow">▼</span>
            </button>

            {sortByMenuOpen &&
                <ul
                    className="SBB__OptionsList"
                    style={{ color: `hsla(${colors.text[0]}, ${colors.text[1]}%, ${colors.text[2]}%, 0.7)`, backgroundColor: `hsl(${colors.background[0]}, ${colors.background[1]}%, ${colors.background[2]}%)` }}
                    ref={sortingMenuRef}
                >
                    {
                        sortingOptionsData.map((sortingOption) => {
                            return (
                                <li
                                    onClick={() => changeSorting(sortingOption.name, setActiveSorting, setSortByMenuOpen(false))}
                                    key={nanoid()}
                                    className={activeSorting === sortingOption.name ? "SBB__OptionItemActive" : ""}
                                    style={activeSorting === sortingOption.name ? { color: `hsl(${colors.text[0]}, ${colors.text[1]}%, ${colors.text[2]}%)`, borderColor: `hsl(${colors.text[0]}, ${colors.text[1]}%, ${colors.text[2]}%)` } : undefined}
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