// general
import { useState } from "react"
// components
import TextEditForm from "./TextEditForm"

type ProfileProps = {
    profileData: any,
    setProfileData: any
}

export default function TopSection({
    profileData, setProfileData //*0.2
}: ProfileProps) {

    // *0.3
    const [openTextEditor, setOpenTextEditor] = useState(false)


    return (
        <section className="ProfTop__Section">

            {/* 1. Initially visible H1 & Gear Button */}
            <h1 className="Global__H1__Centered">Profile</h1>

            {
                profileData.id === 1 &&
                <button
                    className="ProfTop__GearButton"
                    onClick={() => setOpenTextEditor(true)}
                >
                    ⚙
                </button>
            }


            {/* 2. Text Editor Window */}
            {
                openTextEditor &&
                <TextEditForm
                    profileData={profileData}
                    setProfileData={setProfileData}
                    setOpenTextEditor={setOpenTextEditor}
                />
            }
        </section>
    )
}


{/*
DOCUMENTATION
-
IDEA
This section shows the name of the page and gives you access to a part of your profile's settings.
-
STRUCTURE
1. Initially visible H1 and Gear Button
2. Text Editor Window
-
KNOWN USES:
1. pages/Profile
-
COMMENTS
0.1 Imports
useState – a react hook used to create states.
TextEditForm – a custom component, see 2.
,
,
0.2. Props
profileData – data about a particular user whose profile page we're on. Passed from the Profile
page.
setProfileData – the same state's setter. We need to be able to change the profile's data,
since that's the whole idea of the TextEditForm.
,
,
0.3. States & consts
openTextEditor – controls whether TextEditForm (2) is visible. By default it's not. It becomes
visible upon clicking the gear button (1).
,
,
1. Initially visible H1 & Gear Button
The initially visible part of the top section is just the h1 of the page ("Profile") and
the gear button in the top right. I decided against putting it in a separate component
since this part is static and simple.
The gear button is only visible if it's your profile.
,
,
2. TextEditForm
It contains a form in a popup window that a part of the user data is displayed in and can
be changed in: namely, the values of the properties name, username, and aboutMe. It appears
only when the gear button is clicked and the state openTextEditor is changed to true. Learn
more about its contents in components/Profile/TextEditForm.
*/}