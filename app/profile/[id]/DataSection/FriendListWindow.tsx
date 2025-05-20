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
    const [error, setError] = useState<any>(null)

    const { friendsSelf, mutate } = useOwnFriendList(isOwnProfile, profileData.friends)

    useEffect(() => {
        if (!isOwnProfile) {
            async function fetchFriends() {
                setLoading(true)
                try {
                    const res = await fetch("/api/users/friend-list-data", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ friends: profileData.friends })
                    })
                    if (!res.ok) {
                        throw new Error("Failed to fetch friend list")
                    }

                    const data = await res.json()
                    setFriendsList(data)
                } catch (error) {
                    console.error("Unexpected error fetching friend list: ", error)
                    setError(error)
                } finally {
                    setLoading(false)
                }
            }

            fetchFriends()
        }

    }, [isOwnProfile, profileData.friends])

    useEffect(() => {
        if (isOwnProfile && friendsSelf) {
            setFriendsList(friendsSelf)
            setLoading(false)
        }
    }, [isOwnProfile, friendsSelf])

    // this is a questionable arrangement
    let popupWindowRef = useRef()

    useHandleElsewhereClick(popupWindowRef, "ProfPUW__DivGen", () => setOpenFriendList(false))


    return (
        <PopupWindow windowReference={popupWindowRef}>

            <section className="ProfFLW__Section">

                <h2 className="ProfFLW__H2">
                    Friends of
                    <br />{profileData.name}
                </h2>

                {
                    !loading
                        ?
                        <ListOfFriends
                            setProfileData={setProfileData}
                            setOpenFriendList={setOpenFriendList}
                            friendsList={friendsList}
                            mutate={mutate}
                        />
                        : <div className="text-black">Loading...</div>
                }

                <CrossButton
                    onClickAction={() => setOpenFriendList(false)}
                />

            </section>

        </PopupWindow>
    )
}