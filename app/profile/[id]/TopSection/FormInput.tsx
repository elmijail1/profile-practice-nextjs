
type TEFormProps = {
    inputData: any,
    fieldName: any,
    fieldType: any,
    handleInput: any,
    inputCounter?: any
}

export default function FormInput({
    inputData, fieldName, fieldType, handleInput, inputCounter // *0.1
}: TEFormProps) {

    function capitalizeFieldName() { //0.2
        if (fieldName === "aboutMe") {
            return fieldName.slice(0, 1).toUpperCase() + fieldName.slice(1, 5) + " " + fieldName.slice(-2)
        }
        return fieldName.slice(0, 1).toUpperCase() + fieldName.slice(1)
    }

    let currentLength: number = inputData[fieldName]?.length
    const limit: number | undefined = inputCounter[fieldName]
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
                    inputCounter[fieldName] &&
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
                    value={inputData[fieldName]}
                    onChange={(event) => handleInput(event)}
                    maxLength={inputCounter[fieldName]}
                    autoComplete="off"
                    className="w-full h-[2.2rem] rounded-lg border-[0.15rem] border-solid border-[hsl(0,0%,85%)] text-[1rem] px-[0.4rem] py-[0] text-black"
                />
            }

            {fieldType === "textarea" &&
                <textarea
                    id={`text-editor-field-${fieldName}`}
                    name="aboutMe"
                    value={inputData[fieldName]}
                    onChange={(event) => handleInput(event)}
                    maxLength={inputCounter[fieldName]}
                    autoComplete="off"
                    className="w-full h-32 p-[0.4rem] rounded-lg border-[0.15rem] border-solid border-[hsl(0,0%,85%)] text-[1rem] m-0 text-black"
                >
                </textarea>
            }
        </div>
    )
}

{/*
DOCUMENTATION
-
IDEA
A stylized form input/textarea element.
-
STRUCTURE
1. General Div
1.1. Label
1.1.1. Input name
1.1.2. Character counter
1.2. Input / Textarea (depending on the props' value)
.
1. General Div: contains all other elements and gives them styles like flex.
1.1. Label: contains the Input name and the Character character. Is located over the input
area (1.2).
1.1.1. Input name: is passed with props and is capitalized with the help of the special
function defined here above (0.2). Some input names consist of several words and require
each of them to be capitalized.
1.1.2. Character counter: counts the current number of characters in the input zone (1.2)
and compares it to the maximum allowed number of characaters for it. The former value comes
from the inputData state (props) and the latter comes from the inputCounter object (props).
1.2. Input / Textarea: depending on what values are conatined in the props, either an input
or a textarea is rendered.
-
KNOWN USES:
1. components/Profile/TextEditForm
-
COMMENTS
0.1. Props
inputData: a state connected to controlled inputs (which includes all the form's FormInputs).
fieldName: the name of the field equal. The name of it is initially identical to a related
property of the inputData state. This name is displayed in 1.1.1..
fieldType: defines whether 1.2 is an input or a textarea.
handleInput: registers input into controlled inputs and saves it to the inputData state right
away.
inputCounter: an object containing maximum allowed lengths for various fields.
.
0.2. capitalizeFieldName
A fieldName by default starts with a small letter to be equal to the property name of inputData
and userData: e.g. "name", "aboutMe", etc. But in labels they must be capitalized
for stylistic reasons. So we change the first letter. In the only known case of a several-word
field name (aboutMe => About Me) a space between the words is also added.
*/}