import React from "react"

type FormInputProps = {
    inputData: string,
    fieldName: string,
    fieldType: "input" | "textarea",
    handleInput: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void,
    inputCounter?: number
}

export default function FormInput({
    inputData, fieldName, fieldType, handleInput, inputCounter
}: FormInputProps) {

    function capitalizeFieldName() {
        if (fieldName === "aboutMe") {
            return "About me"
        }
        return fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    }

    const currentLength: number = inputData?.length
    const limit: number | undefined = inputCounter
    const isLimitReached = limit && currentLength >= limit

    return (
        <div className="flex flex-col items-center w-full">

            <label
                className="flex w-full justify-between text-[hsl(0,0%,70%)]"
                id={`texteditor-label-${fieldName}`}
                htmlFor={`text-editor-field-${fieldName}`}
            >

                <span className="text-[1.1rem] font-semibold">
                    {capitalizeFieldName()}
                </span>

                {
                    inputCounter &&
                    <span className={`text-[0.9rem] ${isLimitReached && "text-[hsl(0,100%,50%)] font-semibold"}`}>
                        {currentLength}/{limit}
                    </span>
                }
            </label>

            {fieldType === "input" &&
                <input
                    type="text"
                    id={`text-editor-field-${fieldName}`}
                    name={fieldName}
                    value={inputData}
                    onChange={(event) => handleInput(event)}
                    maxLength={inputCounter}
                    autoComplete="off"
                    className="w-full h-[2.2rem] rounded-lg border-[0.15rem] border-solid border-[hsl(0,0%,85%)] text-[1rem] px-[0.4rem] py-[0] text-black"
                />
            }

            {fieldType === "textarea" &&
                <textarea
                    id={`text-editor-field-${fieldName}`}
                    name="aboutMe"
                    value={inputData}
                    onChange={(event) => handleInput(event)}
                    maxLength={inputCounter}
                    autoComplete="off"
                    className="w-full h-32 p-[0.4rem] rounded-lg border-[0.15rem] border-solid border-[hsl(0,0%,85%)] text-[1rem] m-0 text-black"
                >
                </textarea>
            }
        </div>
    )
}