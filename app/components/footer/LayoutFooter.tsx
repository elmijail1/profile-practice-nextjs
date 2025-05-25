"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import MobileButtons from "./MobileButtons";
import DesktopButtons from "./DesktopButtons";
import useWindowWidth from "./useWindowWidth";

export default function LayoutFooter() {

    const pathname = usePathname()
    const currentPathId = pathname?.split("/")[2]

    const { data: session } = useSession()

    const isAuthenticated = !!session
    const isOwnProfile = session?.user?.id?.toString() === currentPathId
    const isOtherProfile = isAuthenticated && !isOwnProfile

    const width = useWindowWidth()
    if (width === null) {
        return <div>Loading...</div>
    }

    const isMobile = width < 1280

    const footerClassMob = "w-full h-20 bg-white fixed bottom-0 z-30 border-t-[0.1rem] border-gray-300 flex justify-center items-center"
    const footerClassDesk = "xl:h-15 xl:top-0 xl:px-[35%]"

    const buttonsClassMob = "w-full h-full flex justify-center items-center"
    const buttonsClassDesk = "xl:max-w-[40rem] xl:justify-between"


    return (
        <footer className={`${footerClassMob} ${footerClassDesk}`}>
            <div className={`${buttonsClassMob} ${buttonsClassDesk}`}>
                {isMobile
                    ?
                    <MobileButtons
                        pathname={pathname}
                        session={session}
                        isAuthenticated={isAuthenticated}
                        isOtherProfile={isOtherProfile}
                        isOwnProfile={isOwnProfile}
                    />
                    :
                    <DesktopButtons
                        pathname={pathname}
                        session={session}
                        isAuthenticated={isAuthenticated}
                    />
                }

            </div>
        </footer >
    )
}