type TEFormProps = {
    children: any,
    windowReference: any
}

export default function PopupWindow({ children, windowReference = null }: TEFormProps) { //*0.1
    return (
        <div className="ProfPUW__Blurer">
            <div
                className="ProfPUW__DivGen"
                ref={windowReference ? windowReference : null} //*0.1
            >
                {children}
            </div>
        </div>
    )
}

{/*
DOCUMENTATION
-
IDEA:
A popup window for forms and other data. Also adds a blurer to the background.
.
STRUCTURE:
1. Blurer
1.1. Popup Window
.
KNOWN USES:
1. components/Profile/TextEditForm
.
COMMENTS
0.1 Props
children – the PopupWindow component works as a wrapper. It gives a blurer to the background
to cover the rest of the page's conent and a window element to contain all the content that
you pass to it as children.
windowReference – mainly used for useHandleElsewhereClick to make the popup go away upon
clicking off it. By default the windowReference is meant to be null as it might not always
be passed.
*/}