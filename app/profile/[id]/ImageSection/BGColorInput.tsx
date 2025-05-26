import { backgroundColorData } from "@/data/visualOptionsData"
import { nanoid } from "nanoid"
import React, { SetStateAction } from "react"
import { ImageInputType } from "./ImageEditForm"

export default function BGColorInput({
    bgColor, setInputData
}: {
    bgColor: number[],
    setInputData: React.Dispatch<SetStateAction<ImageInputType>>
}) {


    return (
        <section className="image-option-section">
            <h3 className="image-option-h3">Background Color</h3>

            <div className="image-option-row">
                {backgroundColorData.map((option) => {

                    const isChosen = bgColor[0] === option.color[0] && bgColor[1] === option.color[1] && bgColor[2] === option.color[2]

                    return (
                        // *1.2.1. Label
                        <label
                            key={nanoid()}
                            onClick={() => setInputData((prevData) => ({ ...prevData, bgColor: option.color }))}
                            htmlFor={`checkbox${option.color}`}
                            className={`image-option-option ${isChosen && "yellow-border-highlight"} xl:cursor-pointer xl:hover:brightness-95`}
                            style={{ backgroundColor: `hsl(${option.color[0]}, ${option.color[1]}%, ${option.color[2]}%)` }}
                        >

                            {/* 1.2.1.1. Checkbox Input */}
                            <input
                                id={`checkbox${option.color}`}
                                type="checkbox"
                                className="hidden"
                                checked={bgColor === option.color}
                                onChange={() => setInputData((prevData) => ({ ...prevData, bgColor: option.color }))}
                            />
                        </label>
                    )
                })
                }

            </div>
        </section >
    )
}

{/*
DOCUMENTATION
-
IDEA
This section displays a set of background color options that you can click to change your
profile avatar's background color.
-
STRUCTURE
1. Section
1.1. Header
1.2. Row of options
1.2.1. Label
1.2.1.1. Checkbox Input
-
KNOWN USES:
1. components/ImageSection/ImageEditForm
-
COMMENTS
0.1 Imports
backgroundColorData – data containing color values that get rendered as options (colored 
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
1.2. Row of options: values of the backgroundColorData array of objects (see 0.1) get mapped
and rendered as a single option inside it.
,
1.2.1. Label
It does several things at once here:
- it gives a visual representation of the option: a square with a border and a particular
background color;
- it triggers a set change upon a click;
- it checks the checkbox input that's inside it upon a click.
,
1.2.1.1. Checkbox Input
I'm not sure I actually need that input inside it, but since it's a form, I believe it's at
least advisable to have them here for each option.
*/}