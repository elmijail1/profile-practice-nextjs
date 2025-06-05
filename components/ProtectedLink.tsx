import { ComponentProps } from 'react'
import Link from 'next/link'
import { useProtectedNavigation } from '@/utilities/useProtectedNavigation'

type ProtectedLinkProps = Omit<ComponentProps<typeof Link>, 'onClick' | 'href'> & {
    href: string
}

export default function ProtectedLink({ href, children, ...props }: ProtectedLinkProps) {
    const { navigate } = useProtectedNavigation()

    function handleClick(e: React.MouseEvent) {
        e.preventDefault()
        navigate(href)
    }

    return (
        <Link
            href={href}
            onClick={handleClick}
            {...props}
        >
            {children}
        </Link>
    )
} 