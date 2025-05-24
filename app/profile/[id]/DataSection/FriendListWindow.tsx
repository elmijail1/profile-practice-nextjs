// *0.1 Imports
// general
import { useState, useEffect, useRef } from "react"
// components
import CrossButton from "../CrossButton"
import ListOfFriends from "./ListOfFriends"
import PopupWindow from "../PopupWindow"
import { useOwnFriendList } from "./useOwnFriendList"
// utilities
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"
import { useProfileContext } from "@/lib/ProfileContext"

type DSProps = {
    profileData: any,
    setProfileData: any,
    setOpenFriendList: any
}

export default function FriendListWindow({
    profileData, setProfileData, setOpenFriendList // *0.2 Props
}: DSProps) {

    const { isOwnProfile } = useProfileContext()

    const [friendsList, setFriendsList] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    const [page, setPage] = useState(1)
    const limit = 5
    const [total, setTotal] = useState(0)
    const [renderPage, setRenderPage] = useState(1)

    const { friendsSelf, totalSelf, mutate } = useOwnFriendList(isOwnProfile, profileData.friends, page, limit)

    useEffect(() => {
        if (!isOwnProfile) {
            async function fetchFriends() {
                setLoading(true)
                try {
                    const res = await fetch("/api/users/friend-list-data", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            friends: profileData.friends,
                            page: page || 1,
                            limit: limit || 5
                        })
                    })
                    if (!res.ok) {
                        setFriendsList([])
                        setError("The friend list is currently unavailable. Try again later.")
                        throw new Error("Failed to fetch friend list")
                    }

                    const { users, total } = await res.json()
                    setFriendsList(users)
                    setTotal(total)
                    setRenderPage(page)
                } catch (error) {
                    // console.error("Unexpected error fetching friend list: ", error)
                    setError("The friend list is currently unavailable. Try again later.")
                } finally {
                    setLoading(false)
                }
            }

            fetchFriends()
        }

    }, [isOwnProfile, profileData.friends, page])

    useEffect(() => {
        if (isOwnProfile && friendsSelf) {
            setFriendsList(friendsSelf)
            setTotal(totalSelf)
            setRenderPage(page)
            setLoading(false)
        }
    }, [isOwnProfile, friendsSelf])

    let popupWindowRef = useRef()
    useHandleElsewhereClick(popupWindowRef, "popup-window", setOpenFriendList)


    return (
        <PopupWindow windowReference={popupWindowRef}>

            <section className="top-24 w-72 h-[26rem] pt-4 bg-[white] rounded-2xl flex flex-col items-center justify-start">

                <h2 className="text-[black] text-[1.4rem] mt-[0.7rem] text-center">
                    Friends of
                    <br />{profileData.name}
                </h2>

                {
                    error &&
                    <p className="text-red-500 text-center w-[80%] my-2">
                        {error}
                    </p>
                }

                <div className="h-[18rem]">

                    {
                        !loading
                            ?
                            <ListOfFriends
                                setProfileData={setProfileData}
                                setOpenFriendList={setOpenFriendList}
                                friendsList={friendsList}
                                mutate={mutate}
                                page={renderPage}
                                limit={limit}
                            />
                            : <div className="text-black">Loading...</div>
                    }
                </div>

                {
                    total > 5 &&
                    <div className="flex justify-between w-[100%] px-2 h-[2rem] text-black">
                        <button
                            className="px-2 font-semibold text-[1.2rem] text-white bg-gray-800 rounded-2xl disabled:opacity-0"
                            onClick={() => setPage((p) => Math.max(p - 1, 1))}
                            disabled={page === 1}
                        >
                            ◀ Prev
                        </button>
                        {
                            total
                                ? <span className="self-center">Page {page} of {Math.ceil(total / limit)}</span>
                                : <span className="self-center">Loading pages...</span>
                        }
                        <button
                            className="px-2 font-semibold text-[1.2rem] text-white bg-gray-800 rounded-2xl disabled:opacity-0"
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page * limit >= total}
                        >
                            Next ▶
                        </button>
                    </div>
                }


                <CrossButton
                    onClickAction={() => setOpenFriendList(false)}
                />

            </section>

        </PopupWindow>
    )
}