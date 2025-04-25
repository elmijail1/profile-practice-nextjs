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
    return (
        <li className={self ? "LR__GenSelf" : "LR__Gen"}>

            <Link
                href={`/profile/${user.id}`}
                className={deleteOnClick ? "LR__LinkClipped" : "LR__Link"}
                onClick={extraActionOnClick ? extraActionOnClick : undefined}
                style={{ color: `hsl(${textColor[0]}, ${textColor[1]}%, ${textColor[2]}%)` }}
            >
                <div className="LR__ListOrder">{listOrder}</div>
                <div
                    className="LR__ProfileImage"
                    style={{ backgroundColor: `hsl(${user.bgColor[0]}, ${user.bgColor[1]}%, ${user.bgColor[2]}%)` }}
                >
                    {user.emoji}
                </div>
                <div className="LR__ProfileName">{user.name}</div>
            </Link>

            {
                deleteOnClick &&
                <button
                    className="LR__DeleteButton"
                    onClick={() => deleteOnClick(user.id)}
                >
                    +
                </button>
            }
        </li>
    )
}