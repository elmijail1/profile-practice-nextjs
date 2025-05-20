"use client";
import React, { useState, useRef } from "react"
import { nanoid } from "nanoid";
import { changeSorting, determineSortingButtonName } from "../../utilities/sorting";
import useHandleElsewhereClick from "../../utilities/useHandleElsewhereClick";

type SortByButtonProps = {
    activeSorting: "joinedIn" | "name",
    setActiveSorting: React.Dispatch<React.SetStateAction<"joinedIn" | "name">>,
    sortingOptionsData: { name: string, displayName: string }[],
    colors: { text: number[], background: number[] }
}

export default function SortByButton({
    activeSorting,
    setActiveSorting,
    sortingOptionsData,
    colors
}: SortByButtonProps) {

    const [sortByMenuOpen, setSortByMenuOpen] = useState(false)
    let sortingMenuRef = useRef<any>(null)

    // 1. The problem must be here
    useHandleElsewhereClick(sortingMenuRef, ["sort-by-button", "sort-by-arrow"], setSortByMenuOpen)

    function isBlack(colors: number[]) {
        const isBlack = colors[0] === 0
            && colors[1] === 0
            && colors[2] === 100
        return isBlack ? "white" : "black"
    }

    function arrayToHSLA(colors: number[], opacity: number = 1) {
        return `hsla(${colors[0]}, ${colors[1]}%, ${colors[2]}%, ${opacity})`
    }

    return (
        <div className="flex items-center gap-[0.2rem] relative text-[1.1rem] font-bold">

            <p style={{ color: isBlack(colors.background) }}>Sort by:</p>

            <button
                className="px-[0.5rem] py-[0.2rem] rounded-[1rem] border-none font-bold"
                style={{ color: arrayToHSLA(colors.text), backgroundColor: arrayToHSLA(colors.background) }}
                // 2. And the problem continues here
                onClick={() => setSortByMenuOpen(prevMenu => !prevMenu)}
                id="sort-by-button"
            >
                {determineSortingButtonName(sortingOptionsData, activeSorting)}
                <span className="text-[0.6rem] ml-[0.3rem]" id="sort-by-arrow">▼</span>
            </button>

            {sortByMenuOpen &&
                <ul
                    className="bg-white font-medium list-none p-[1rem] rounded-[0.8rem] flex flex-col justify-start items-center gap-[0.8rem] absolute z-[1] top-[1.8rem] left-[4rem]"
                    style={{ color: arrayToHSLA(colors.text, 0.7), backgroundColor: arrayToHSLA(colors.background) }}
                    ref={sortingMenuRef}
                    id="sort-by-list"
                >
                    {
                        sortingOptionsData.map((sortingOption) => {
                            return (
                                <li
                                    onClick={() => changeSorting(sortingOption.name, setActiveSorting, setSortByMenuOpen(false))}
                                    key={nanoid()}
                                    className={activeSorting === sortingOption.name ? "box-border font-semibold border-b-2" : ""}
                                    style={activeSorting === sortingOption.name ? { color: arrayToHSLA(colors.text), borderColor: arrayToHSLA(colors.text) } : undefined}
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