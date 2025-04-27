import { GrFormCheckmark, GrFormClose } from "react-icons/gr";

type UserProps = {
    validatedData: {
        email: boolean,
        password: boolean,
        passwordRepeat: boolean
    },
    dataField: "email" | "password" | "passwordRepeat"
}

export default function ValidationIndicator({ validatedData, dataField }: UserProps) {
    if (validatedData[dataField]) {
        return (
            <div className="auth__inputindicator">
                <GrFormCheckmark className="auth__inputindicator__check" />
            </div>
        )
    } else {
        return (
            <div className="auth__inputindicatorissue">
                <GrFormClose className="auth__inputindicator__cross" />
            </div>
        )
    }
}