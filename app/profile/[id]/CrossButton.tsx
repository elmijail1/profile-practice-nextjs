export default function CrossButton({ onClickAction }: any) {
    return (
        <button
            className="ProfCross__Button"
            onClick={onClickAction}
        >
            +
        </button>
    )
}

{/*
DOCUMENTATION
-
IDEA
A stylized button meant to close a window or something similar.
-
STRUCTURE
1. Button
-
KNOWN USES:
1. components/Profile/TextEditForm
-
COMMENTS
1. Props
1.1. onClickAction. An action applied to the button as an onClick. Usually involves changing
some state.

*/}