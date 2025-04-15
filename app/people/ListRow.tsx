import Link from "next/link"

type PeopleProps = {
    user: any,
    listOrder: number,
    self: boolean,
    deleteOnClick?: any,
    extraActionOnClick?: any,
    textColor?: string
}

export default function ListRow(
    { user, listOrder = 0, self = false, deleteOnClick = false, extraActionOnClick = false, textColor = "0, 0%, 100%" }: PeopleProps
) {
    return (
        <li className={self ? "LR__GenSelf" : "LR__Gen"}>

            <Link
                href={`/profile/${user.id}`}
                className={deleteOnClick ? "LR__LinkClipped" : "LR__Link"}
                onClick={extraActionOnClick ? extraActionOnClick : undefined}
                style={{ color: `hsl(${textColor})` }}
            >
                <div className="LR__ListOrder">{listOrder}</div>
                <div
                    className="LR__ProfileImage"
                    style={{ backgroundColor: user.bgColor }}
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