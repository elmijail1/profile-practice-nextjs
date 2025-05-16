// *0.1 Imports
// general
import { useState, useEffect, useRef } from "react"
// components
import CrossButton from "../CrossButton"
import ListOfFriends from "./ListOfFriends"
import PopupWindow from "../PopupWindow"
import SortByButton from "@/app/components/SortByButton"
// utilities
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"

type DSProps = {
    profileData: any,
    setProfileData: any,
    usersData: any,
    setOpenFriendList: any
}

export default function FriendListWindow({
    profileData, setProfileData, usersData, setOpenFriendList // *0.2 Props
}: DSProps) {

    const [friendsList, setFriendsList] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
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
    }, [profileData.friends])

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
                            profileData={profileData}
                            setProfileData={setProfileData}
                            setOpenFriendList={setOpenFriendList}
                            friendsList={friendsList}
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