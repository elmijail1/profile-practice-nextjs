import { GrFormCheckmark, GrFormClose } from "react-icons/gr";

type UserProps = {
    isValid: boolean
}

const isValidClass = "auth-validation-indicator w-8 h-8 bg-[hsl(265,60%,50%)] bottom-0"
const isInvalidClass = "auth-validation-indicator w-10 h-10 bg-[hsl(15,70%,55%)] bottom-[-0.2rem]"


export default function ValidationIndicator({ isValid }: UserProps) {
    if (isValid) {
        return (
            <div className={isValidClass}>
                <GrFormCheckmark className="text-white text-[1.5rem]" />
            </div>
        )
    } else {
        return (
            <div className={isInvalidClass}>
                <GrFormClose className="text-white text-[1.8rem]" />
            </div>
        )
    }
}