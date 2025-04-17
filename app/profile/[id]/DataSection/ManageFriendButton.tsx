// *0.1 Imports
import WideButton from "../WideButton"
import { wideButtonColorsData, extractColorObject } from "../../../../data/wideButtonColorsData"

type DSProps = {
    friendAdded: boolean,
    setFriendAdded: any
}

export default function ManageFriendButton({
    friendAdded, setFriendAdded // *0.2 Props
}: DSProps) {

    // 1. If the current user is on your friend list
    if (friendAdded) {
        return (
            <WideButton
                colors={extractColorObject(wideButtonColorsData, "RedText")}
                onClickAction={() => setFriendAdded((prev: boolean) => !prev)}
                buttonText={"Remove friend"}
            />
        )
    }

    // 2. If the current user isn't on your friend list
    else {
        return (
            <WideButton
                colors={extractColorObject(wideButtonColorsData, "GreenText")}
                onClickAction={() => setFriendAdded((prev: boolean) => !prev)}
                buttonText={"Add friend"}
            />
        )
    }
}