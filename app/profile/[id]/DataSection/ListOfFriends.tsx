"use client";
// *0.1 Imports
// general
import { nanoid } from "nanoid"
// components
import ListRow from "./ListRow"
// utilities
import { sortBy } from "@/utilities/sorting"

type FLWProps = {
    profileData: any,
    setProfileData: any,
    setOpenFriendList: any,
    friendsList: any[],
    activeSorting: "name" | "joinedIn"
}

export default function ListOfFriends({
    profileData, setProfileData, setOpenFriendList, friendsList, activeSorting // *0.2 Props
}: FLWProps) {

    // *0.3 Functions
    function removeFriend(id: number) {
        setProfileData((prevData: any) => ({ ...prevData, friends: prevData.friends.filter((entry: number) => entry !== id) }))
        if (profileData.friends.length === 1) {
            setOpenFriendList(false)
        }
    }

    return (
        <ol className="ProfLOF__ListWrapper">
            {
                sortBy(friendsList, activeSorting).map((user, index) => {
                    return (

                        <ListRow
                            key={nanoid()}
                            user={user}
                            listOrder={index + 1}
                            deleteOnClick={profileData.id === 1 ? removeFriend : null}
                            extraActionOnClick={() => setOpenFriendList(false)}
                            textColor="0, 0%, 0%"
                        />

                    )
                })
            }
        </ol>
    )
}