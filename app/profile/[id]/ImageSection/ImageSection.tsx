"use client";
import { useState } from "react"
import ImageEditForm from "./ImageEditForm"
import { useProfileContext } from "@/lib/ProfileContext";

type ProfileProps = {
    profileData: any,
    setProfileData: any
}

export default function ImageSection({
    profileData, setProfileData //*0.2
}: ProfileProps) {

    const { session, isOwnProfile } = useProfileContext()

    const [openImageEditor, setOpenImageEditor] = useState(false)


    return (
        <>
            <section
                className="w-4/5 max-w-[23rem] h-40 mt-6 bg-[white] rounded-3xl relative z-0 flex justify-center items-end"
                style={{ backgroundColor: `hsl(${profileData.bgColor[0]}, ${profileData.bgColor[1]}%, ${profileData.bgColor[2]}%)` }}
            >

                {/* 1. Initially visible part: Image + Pencil Button */}
                <div className="w-1/2 max-w-[10rem] h-[70%] relative flex items-end justify-center">
                    <div className="text-[6rem] absolute bottom-1 mx-auto z-10">
                        {profileData.emoji}
                    </div>
                    <div className="relative w-full h-12 flex justify-center">
                        <div className="w-16 h-full bg-[hsl(0,_0%,_85%)]"></div>
                        <div className="absolute w-4/5 h-6 bg-[hsl(0,_0%,_85%)] bottom-[0]"></div>
                    </div>
                </div>

                {
                    session && isOwnProfile &&
                    <>
                        <button
                            className="absolute right-[5%] top-[9%] w-8 h-8 text-[1.2rem] font-medium border-[0.1rem] border-solid border-[hsl(0,0%,85%)] rounded-[0.8rem] text-[hsl(0,_0%,_60%)] bg-[white] [rotate:90deg] z-10"
                            onClick={() => setOpenImageEditor(true)}
                        >
                            ✎
                        </button>
                        <button
                            className="absolute right-[5%] top-[10.5%] w-8 h-8 border-none rounded-[0.8rem] bg-[hsl(0,_0%,_85%)] z-0"
                            onClick={() => setOpenImageEditor(true)}
                        >
                        </button>
                    </>
                }


            </section>

            {/* 2. Image Editor Window */}
            {
                openImageEditor &&
                <ImageEditForm
                    profileData={profileData}
                    setProfileData={setProfileData}
                    setOpenImageEditor={setOpenImageEditor}
                />
            }
        </>
    )
}

{/*
DOCUMENTATION
-
IDEA
This section shows the profile's image and lets you customize it.
-
STRUCTURE
1. React Fragment
1.1. Initially visible Profile Image and Pencil Button
1.2. Image Editor Window
,
1. React Fragment: we need to keep the 2 other parts of this section together but due to the
pencil button inside 1.1. having an absolute position, I found it more convenient to take
the form component out of the section.
,
1.1. Initially visible Profile Image and Pencil Button. It consits of two parts: the profile
image is composed of several divs and the profile data's image (an emoji in our case). I
decided against making it a separate component because it's reusability value is low. The same
applies to the Pencil Button. However, it's important to note that the Pencil Button has more
features: it's shown conditionally only when you visit your own account and it's clickable
(although its styles were unexpectedly challenging to set due to various z-index and position
values weird compatibility). Upon clicking it, you open 1.2.
,
1.2. Image Editor Window. It's a separate popup window showing above the rest of the page
that lets you change your profile's image and background color.
-
KNOWN USES:
1. pages/Profile
-
COMMENTS
0.1 Imports
useState – a react hook used to create states.
ImageEditForm – a custom component, see 1.2.
,
,
0.2. Props
profileData – data about a particular user whose profile page we're on. Passed from the Profile
page.
setProfileData – the same state's setter. We need to be able to change the profile's data,
since that's the whole idea of the ImageEditForm.
,
,
0.3. States & consts
openImageEditor – controls whether ImageEditForm (1.2) is visible. By default it's not.
It becomes visible upon clicking the pencil button (1.1).
*/}