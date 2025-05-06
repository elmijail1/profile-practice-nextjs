"use client";
// *0.1
// general
import { useState, useRef } from "react"
import { useParams } from "next/navigation";
// components
import BGColorInput from "./BGColorInput"
import CrossButton from "../CrossButton"
import ImageInput from "./ImageInput"
import PopupWindow from "../PopupWindow"
import WideButton from "../WideButton"
// data
import { wideButtonColorsData, extractColorObject } from "../../../../data/wideButtonColorsData"
// utilities
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"

type ImageSectionProps = {
    profileData: any,
    setProfileData: any,
    setOpenImageEditor: any
}

export default function ImageEditForm({
    profileData, setProfileData, setOpenImageEditor // *0.2
}: ImageSectionProps) {

    const { id } = useParams()

    const [inputData, setInputData] = useState({ // *0.3
        emoji: profileData.emoji,
        bgColor: profileData.bgColor,
    })

    function discardChanges() { // *0.4
        setInputData({
            emoji: profileData.emoji,
            bgColor: profileData.bgColor,
        })
        setOpenImageEditor(false)
    }

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) { //*0.4
        event.preventDefault()
        const updatedProfileData = { ...profileData, ...inputData }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(updatedProfileData)
            })

            if (!response.ok) {
                console.error("Failed to update user")
                return
            }

            const updatedUser = await response.json()
            setProfileData(updatedUser.user)
            setOpenImageEditor(false)

        } catch (error) {
            console.error("Error updating the profile's images: ", error)
        }
    }


    let popupWindowRef = useRef() // *0.5
    useHandleElsewhereClick(popupWindowRef, "ProfPUW__DivGen", () => setOpenImageEditor(false))

    return (
        <PopupWindow windowReference={popupWindowRef}>
            <div className="ProfIEF__DivGen">
                <h2>Edit Profile Image</h2>
                <form className="ProfIEF__Form">
                    <ImageInput
                        inputData={inputData}
                        setInputData={setInputData}
                    />

                    <BGColorInput
                        inputData={inputData}
                        setInputData={setInputData}
                    />

                    <WideButton
                        colors={extractColorObject(wideButtonColorsData, "GreenFill")}
                        onClickAction={handleSubmission}
                        buttonText="Save changes"
                    />

                    <WideButton
                        colors={extractColorObject(wideButtonColorsData, "RedText")}
                        onClickAction={discardChanges}
                        buttonText="Discard changes"
                    />

                    <CrossButton onClickAction={discardChanges} />

                </form>
            </div>
        </PopupWindow>
    )
}

{/*
DOCUMENTATION
-
IDEA
This window appears upon clicking the pencil button in the Image Section. It lets you customize
your profile's avatar by changing its image and background color.
-
STRUCTURE
1. PopupWindow
1.1. A div for keeping styles together
1.1.1. Header
1.1.2. Form
1.1.2.1. ImageInput
1.1.2.2. BGColorInput
1.1.2.3. WideButton (x several)
1.1.2.4. CrossButton
-
1. PopupWindow: adds a full-screen blurer that makes all other content unreachable while the
popup window is active. Also places the form in the middle of the screen and adds certain
paddings. 
,
1.1. A div for keeping styles together: it's used to keep the CrossButton at the position it
should be. The issue here is that, unlike the Top Section, the Image Section has an absolute
element in its initially visible part (the pencil button) and it makes it a bit tricker to
make all other absolute elements work as expected (PopupWindow, CrossButton).
,
1.1.1. Header: the name of the page.
,
1.1.2. Form: contains all the inputs and buttons to save or discard changes in them.
,
1.1.2.1. ImageInput: lets you choose any of the given image options for your profile image.
,
1.1.2.2. BGColorInput: lets you choose any of the given background color options for your
profile image.
,
1.1.2.3. WideButton (x several): a stylized button. One handles submission by saving the
changes in the inputs and passing them to the profileData state. The other discards changes
and resets the inputData state. Learn more about this component in components/WideButton.
,
1.1.2.4. CrossButton: a stylized button used to close the popup window. Has an absolute position
relative to the Div for Keeping Styles Together (1.1), not the form or the PopupWindow (as
TextEditForm has it, for example). Learn more about this component in components/Profile/CrossButton.
-
KNOWN USES:
1. components/ImageSection/ImageSection
-
COMMENTS
0.1 Imports
- useState: a React hook. We need it to create the inputData state used to control inputs.
- useRef: a React hook. We need it to apply a reference to a PopupWindow to make our own
hook useHandleElsewhereClick work properly.
- BGColorInput: a component, see 1.1.2.2.
- CrossButton: a component, see 1.2.
- ImageInput: a component, see 1.1.2.1.
- PopupWindow: a component, see 1.
- WideButton: a component, see 1.1.2.
- wideButtonColorsData: a data array of objects containing color values for WideButton 
components.
- extractColorObject: a function related to the data array that helps extract the color
object you need from that array with the help of one keyword denoting the color palette
you need.
- useHandleElsewhereClick: a hook I've made that we need here to make the PopupWindow shut
whenever we click off it.
,
,
0.2. Props
- profileData: a user data that we both read (for discarding changes in inputs e.g.) and
modify (handleSubmission, 0.4).
- setProfileData: used to update profileData (handleSubmission, 0.4) to match the inputData.
- setOpenImageEditor: used to shut the text edit form window (discardChanges, 0.4). Employed
as an onClick in the CrossButton and the Dicsard Changes WideButton.
,
,
0.3. Consts
inputData – registers and controls data chosen in input fields. By default it's equal
to the data from the profileData state object (see 0.2).
,
,
0.4. Functions
discardChanges – shuts the whole ImageEditForm by setting the openImageEditor state to false and
resets the inputData state to profileData values thus not saving any changes made in the form.
handleSubmission – saves all the changes made in the input fields and saved to the inputData
state and updates profileData with new values.
,
,
0.5. Elsewhere Click Handling
To make clicks off some obect make it disappear (like a PopupWindow in this case), we need
a special hook. It registers clicks off a particular object (specified with a reference and
a className) and does the action specified as its third argument (in our case it closes the
popup window with the form discarding the changes).
useHandleElsewhereClick(reference, className, action)
The reference is passed to PopupWindow here. So whenever it's open and you click off it, it
shuts!
*/}