"use client";
import Link from "next/link";

type LOFProps = {
    user: any,
    listOrder?: number,
    self?: boolean,
    deleteOnClick?: any,
    extraActionOnClick?: any,
    textColor?: string
}

export default function ListRow({
    user, listOrder = 0, deleteOnClick = undefined, extraActionOnClick = undefined, textColor = "0, 0%, 100%"
}: LOFProps) {
    // *0.1

    return (
        // 1. List item
        <li className="flex items-center justify-between w-full h-12 text-[1.3rem] font-semibold">

            {/* 1.1. Profile Representation */}
            <Link
                href={`/profile/${user.id}`}
                className={`friendlist-row ${deleteOnClick && "justify-start w-[85%]"}`}
                onClick={extraActionOnClick ? extraActionOnClick : undefined}
                style={{ color: `hsl(${textColor})` }}
            >
                <div className="mr-[-0.3rem]">
                    {listOrder}
                </div>
                <div
                    className="w-10 h-10 bg-[hsl(0,_0%,_90%)] rounded-[50%] flex px-2 py-[0] items-center text-[1.2rem] leading-[1.3rem]"
                    style={{ backgroundColor: user.bgColor }}
                >
                    {user.emoji}
                </div>
                <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {user.name}
                </div>
            </Link>

            {/* 1.2. Delete Button */}
            {
                deleteOnClick &&
                <button
                    className="bg-[hsl(0,_50%,_80%)] text-[white] rounded-[50%] border-none w-[1.9rem] h-[1.9rem] p-2 [rotate:45deg] text-[2.1rem] font-bold flex justify-center items-center pl-[0.55rem] pb-[0.65rem] xl:cursor-pointer xl:hover:brightness-95"
                    onClick={deleteOnClick}
                >
                    +
                </button>
            }
        </li>
    )
}