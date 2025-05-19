import Link from "next/link"
import type { User } from "../types/user"

type PeopleProps = {
    user: User,
    listOrder: number,
    self: boolean,
    deleteOnClick?: any,
    extraActionOnClick?: any,
    textColor?: number[]
}

export default function ListRow(
    { user, listOrder = 0, self = false, deleteOnClick = false, extraActionOnClick = false, textColor = [0, 0, 100] }: PeopleProps
) {

    function arrayToHSL(array: number[]) {
        return `hsl(${array[0]}, ${array[1]}%, ${array[2]}%)`
    }

    const listRowClass = "flex items-center justify-between w-full h-12 text-[1.3rem] font-semibold"
    const nameClass = "overflow-hidden truncate whitespace-nowrap"
    const deleteButtonClass = "bg-[hsl(0,50%,80%)] text-white rounded-full border-0 w-[1.9rem] h-[1.9rem] rotate-[45deg] text-[2.1rem] font-bold flex justify-center items-center pl-[0.55rem] pb-[0.65rem]"

    return (
        <li className={listRowClass}>

            <Link
                href={`/profile/${user.id}`}
                className={deleteOnClick ? "list-row-regular justify-start w-[85%]" : "list-row-regular"}
                onClick={extraActionOnClick ? extraActionOnClick : undefined}
                style={
                    self
                        ? { color: "hsl(50, 90%, 70%)", fontWeight: 800 }
                        : { color: arrayToHSL(textColor) }}
            >
                <div className="mr-[-0.3rem]">{listOrder}</div>
                <div
                    className="w-[2.5rem] h-[2.5rem] bg-[hsl(0,0%,90%)] rounded-full flex px-[0.5rem] items-center text-[1.2rem] leading-[1.3rem]"
                    style={{ backgroundColor: arrayToHSL(user.bgColor) }}
                >
                    {user.emoji}
                </div>
                <div className={nameClass}>{user.name}</div>
            </Link>

            {
                deleteOnClick &&
                <button
                    className={deleteButtonClass}
                    onClick={() => deleteOnClick(user.id)}
                >
                    +
                </button>
            }
        </li>
    )
}