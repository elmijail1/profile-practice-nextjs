"use client";

type ImageEditFormProps = {
    colors: {
        behindColor: string,
        textColor: string,
        backgroundColor: string,
        borderColor: string
    },
    onClickAction: any,
    buttonText: string
}

export default function WideButton({ colors, onClickAction, buttonText }: ImageEditFormProps) { // *1
    return (
        <button
            className={`WButton__Button WButton__Behind${colors.behindColor}`}
            style={{
                color: `hsl(${colors.textColor})`,
                backgroundColor: `hsl(${colors.backgroundColor})`,
                borderColor: `hsl(${colors.borderColor})`,
            }}
            onClick={onClickAction}
        >
            {buttonText}
        </button >
    )
}

{/*
DOCUMENTATION
-
IDEA
A stylized button with a stereo effect.
-
STRUCTURE
1. Button
-
KNOWN USES:
1. components/Profile/TextEditForm
-
COMMENTS
1. Props
1.1. colors. An object containing color values in its properties. The object should come from
data/wideButtonColorsData.
1.2. onClickAction. An action applied to the button as an onClick.
1.3. buttonText. A text displayed in the button.

*/}