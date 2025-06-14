// *0.1
import { profileImageData } from "@/data/visualOptionsData"
import { nanoid } from "nanoid"
import React, { SetStateAction } from "react"
import { ImageInputType } from "./ImageEditForm"

type ImageEditFormProps = {
    emoji: string,
    setInputData: React.Dispatch<SetStateAction<ImageInputType>>
}

export default function ImageInput({
    emoji, setInputData // *0.2
}: ImageEditFormProps) {

    return (
        <section className="image-option-section">

            <h3 className="image-option-h3">Image</h3>

            <div className="image-option-row">
                {profileImageData.map((image) => {

                    const isChosen = emoji === image.emoji

                    return (
                        // 1.2.1. Label
                        <label
                            key={nanoid()}
                            onClick={() => setInputData((prevData) => ({ ...prevData, emoji: image.emoji }))}
                            className={`image-option-option ${isChosen ? "yellow-border-highlight" : "xl:hover:bg-gray-100"} xl:cursor-pointer`}
                        >

                            {/* 1.2.1.1. Checkbox Input */}
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={emoji === image.emoji}
                                onChange={() => setInputData((prevData) => ({ ...prevData, emoji: image.emoji }))}
                            />

                            {/* 1.2.1.2. Image */}
                            {image.emoji}
                        </label>
                    )
                })
                }
            </div>
        </section>
    )
}

{/*
DOCUMENTATION
-
IDEA
This section displays a set of image options that you can click to change your profile's
avatar.
-
STRUCTURE
1. Section
1.1. Header
1.2. Row of options
1.2.1. Label
1.2.1.1. Checkbox Input
1.2.1.2. Image
-
KNOWN USES:
1. components/ImageSection/ImageEditForm
-
COMMENTS
0.1 Imports
profileImageData – data containing color values that get rendered as options (colored 
squares).
nanoid – used for auto generation of unique IDs for mapped options.
,
,
0.2. Props
inputData – a state from ImageEditForm controlling the checkboxes with BG color options.
setInputData – a state setter to change the value of inputData.
,
,
1. Section: a container for this option row and its header.
1.1. Header: a header for the option row.
1.2. Row of options: values of the profileImageData array of objects (see 0.1) get mapped
and rendered as a single option inside it.
,
1.2.1. Label
It does several things at once here:
- it gives a visual representation of the option: a square with a border and a particular
dimensions of the image inside it;
- it triggers a set change upon a click;
- it checks the checkbox input that's inside it upon a click.
,
1.2.1.1. Checkbox Input
I'm not sure I actually need that input inside it, but since it's a form, I believe it's at
least advisable to have them here for each option.
,
1.2.1.2. Image: is retrieved from the mapped array of objects (profileImageData). For simplicity's
sake, I use emojis here.
*/}