"use client";
// *0.1
// misc
import React, { useState, useRef } from "react"
import { useParams } from "next/navigation";
// components
import CrossButton from "../CrossButton"
import FormInput from "./FormInput"
import PopupWindow from "../PopupWindow"
import WideButton from "../WideButton"
// utilities & data
import { wideButtonColorsData, extractColorObject } from "../../../../data/wideButtonColorsData"
import useHandleElsewhereClick from "@/utilities/useHandleElsewhereClick"


type TSProps = {
    profileData: any,
    setProfileData: any,
    setOpenTextEditor: any
}

export default function TextEditForm({
    profileData, setProfileData, setOpenTextEditor // *0.2
}: TSProps) {

    const [inputData, setInputData] = useState({ // *0.3
        name: profileData?.name,
        email: profileData?.email,
        aboutMe: profileData?.aboutMe
    })
    const inputCounter = { name: 20, aboutMe: 100 } //*0.3


    function discardChanges() { //*0.4
        setInputData({
            name: profileData?.name,
            email: profileData?.email,
            aboutMe: profileData?.aboutMe
        })
        setOpenTextEditor(false)
    }

    const id = useParams().id

    async function handleSubmission(event: React.FormEvent<HTMLFormElement>) { //*0.4
        event.preventDefault()
        const updatedProfileData = { ...inputData }

        try {
            const response = await fetch(`/api/users/${id}`, {
                method: "PATCH",
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
            setOpenTextEditor(false)

        } catch (error) {
            console.error("Error updating the profile's texts: ", error)
        }
    }

    function handleInput(event: any) { //*0.4
        const { name, value } = event.target
        setInputData(prevInputData => {
            return ({ ...prevInputData, [name]: value })
        })
    }

    let popupWindowRef = useRef() // *0.5
    useHandleElsewhereClick(popupWindowRef, "ProfPUW__DivGen", discardChanges) // *0.5



    return (
        <PopupWindow
            windowReference={popupWindowRef}
        >
            <h2 style={{ color: "black" }}>Edit Profile</h2>
            <form className="ProfTEF__Form">
                <FormInput
                    inputData={inputData}
                    fieldName={"name"}
                    fieldType={"input"}
                    handleInput={handleInput}
                    inputCounter={inputCounter}
                />

                <FormInput
                    inputData={inputData}
                    fieldName={"email"}
                    fieldType={"input"}
                    handleInput={handleInput}
                    inputCounter={inputCounter}
                />

                <FormInput
                    inputData={inputData}
                    fieldName={"aboutMe"}
                    fieldType={"textarea"}
                    handleInput={handleInput}
                    inputCounter={inputCounter}
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
            </form>

            <CrossButton onClickAction={discardChanges} />
        </PopupWindow>
    )
}

{/*
DOCUMENTATION
-
IDEA
Contains a form with its children as well as a PopupWindow containing the form itself.
-
STRUCTURE
1. PopupWindow
1.1. Form
1.1.1. FormInput (x several)
1.1.2. WideButton (x several)
1.2. CrossButton 
.
1. PopupWindow: adds a full-screen blurer that makes all other content unreachable while the
popup window is active. Also places the form in the middle of the screen and adds certain
paddings.
1.1. Contains main input elements: fields and buttons.
1.1.1. FormInput: allows writing text for further submission and change of the user's values
like name, and aboutMe. Learn more in components/Profile/FormInput.
1.1.2. WideButton: a stylized button. Learn more in components/WideButton.
1.2. CrossButton: a stylized button used to close the popup window. Has an absolute position
relative to the PopupWindow, not the form. Learn more in components/Profile/CrossButton.
-
KNOWN USES:
1. component/Profile/TopSection
-
COMMENTS
0.1. Imports
- useState: a React hook. We need it to create the inputData state used to control inputs.
- useRef: a React hook. We need it to apply a reference to a PopupWindow to make our own
hook useHandleElsewhereClick work properly.
- CrossButton: a component, see 1.2.
- FormInput: a component, see 1.1.1.
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
- setOpenTextEditor: used to shut the text edit form window (discardChanges, 0.4). Employed
as an onClick in the CrossButton and the Dicsard Changes WideButton.
,
, 
0.3 Consts
inputData – registers and controls data added to input fields. By default it's equal
to the data from the profileData state object (see 0.2).
inputCounter – a static object containing maximum length limits for different fields. It's
used for a character counter component inside FormInputs.
,
,
0.4. Functions
handleInput – makes controlled element work as expected. Whatever you add to input fields gets
registered with the help of this function straight to the inputData state.
discardChanges – shuts the whole TextEditForm by setting the openTextEditor state to false and
resets the inputData state to profileData values thus not saving any changes made in the form.
handleSubmission – saves all the changes made in the InputFields and saved to the InputData
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