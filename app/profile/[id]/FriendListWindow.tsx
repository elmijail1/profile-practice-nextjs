// *0.1 Imports
// general
import { useState, useEffect, useRef } from "react"
// components
import CrossButton from "./CrossButton"
import ListOfFriends from "./ListOfFriends"
import PopupWindow from "./PopupWindow"
import SortByButton from "../../people/SortByButton"
// utilities
import { sortingOptionsData } from "../../../data/sortingOptionsData"
import useHandleElsewhereClick from "../../../utilities/useHandleElsewhereClick"

type DSProps = {
    profileData: any,
    setProfileData: any,
    usersData: any,
    setOpenFriendList: any
}

export default function FriendListWindow({
    profileData, setProfileData, usersData, setOpenFriendList // *0.2 Props
}: DSProps) {


    // *0.3 States & variables
    const [activeSorting, setActiveSorting] = useState<"name" | "username" | "joinedIn">("joinedIn")
    // this is a questionable arrangement

    const [friendsList, setFriendsList] = useState([""])
    const pageColors = {
        sortByText: "0, 0%, 100%",
        sortByBackground: "130, 70%, 50%"
    }
    let popupWindowRef = useRef()

    // *0.4 Functions
    function populateFriendsList() {
        const friendsArray: any[] = []
        if (profileData) {
            profileData.friends.map((number: number) => {
                usersData.map((user: any) => {
                    if (number === user.id) {
                        friendsArray.push(user)
                    }
                })
            })
        }
        return friendsArray
    }

    // *0.5 Effects
    useEffect(() => {
        setFriendsList(populateFriendsList())
    }, [profileData])

    useHandleElsewhereClick(popupWindowRef, "ProfPUW__DivGen", () => setOpenFriendList(false))


    return (
        <PopupWindow windowReference={popupWindowRef}>

            <section className="ProfFLW__Section">

                <h2 className="ProfFLW__H2">
                    Friends of
                    <br />{profileData.name}
                </h2>

                <SortByButton
                    activeSorting={activeSorting}
                    setActiveSorting={setActiveSorting}
                    sortingOptionsData={sortingOptionsData}
                    colors={{ text: pageColors.sortByText, background: pageColors.sortByBackground }}
                />

                {
                    friendsList
                        ?
                        <ListOfFriends
                            profileData={profileData}
                            setProfileData={setProfileData}
                            setOpenFriendList={setOpenFriendList}
                            friendsList={friendsList}
                            activeSorting={activeSorting}
                        />
                        : <div>None</div>
                }

                <CrossButton
                    onClickAction={() => setOpenFriendList(false)}
                />

            </section>

        </PopupWindow>
    )
}