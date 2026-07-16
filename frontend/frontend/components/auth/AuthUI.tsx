import Link from 'next/link'
import { LucideIcon, Menu } from 'lucide-react'
import { cn } from '../../lib/utils'
import { ReactNode } from 'react'

type AuthShellProps = {
    children: ReactNode
    showBrand?: boolean
    showMenu?: boolean
}

export function AuthShell({ children, showBrand = true, showMenu = true }: AuthShellProps) {
    return (
        <main className="min-h-screen bg-[radial-gradient(120%_100%_at_50%_-8%,#cfe9cd_0%,rgba(207,233,205,0)_60%),linear-gradient(180deg,#f5f7f5_0%,#eef3ef_100%)] px-4 py-5 sm:px-8 sm:py-8">
            <section className="mx-auto w-full max-w-190 overflow-hidden rounded-[28px] border border-[#e4ebe5] bg-[#f7f9f7] shadow-[0_24px_70px_rgba(10,26,14,0.24)] animate-fade-in">
                <header className="flex items-center justify-between border-b border-[#dde5df] px-5 py-4 sm:px-6 sm:py-5">
                    {showBrand ? <Brand /> : <div />}
                    {showMenu ? (
                        <button
                            type="button"
                            className="grid h-10 w-10 place-items-center rounded-full bg-[#ebefec] text-[#6f7a88]"
                            aria-label="Open menu"
                        >
                            <Menu size={22} strokeWidth={2} />
                        </button>
                    ) : (
                        <div />
                    )}
                </header>
                <div className="px-4 py-8 sm:px-10 sm:py-12">{children}</div>
            </section>
        </main>
    )
}

export function AuthTitle({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <>
            <h1 className="text-center text-[2.2rem] font-bold leading-[1.05] tracking-[-0.03em] text-[#1d6b3f] sm:text-[3.2rem]">
                {title}
            </h1>
            <p className="mt-2 text-center text-[1.1rem] text-[#4b5563] sm:text-[1.2rem]">{subtitle}</p>
        </>
    )
}

export function AuthCard({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                'mt-8 rounded-3xl bg-[#f1f4f1] p-5 shadow-[0_14px_40px_rgba(22,40,24,0.08)] sm:mt-10 sm:p-9',
                className
            )}
        >
            {children}
        </div>
    )
}

export function AuthInput({
    icon: Icon,
    placeholder,
    type = 'text',
    trailing,
}: {
    icon: LucideIcon
    placeholder: string
    type?: 'text' | 'email' | 'password'
    trailing?: ReactNode
}) {
    return (
        <label className="flex min-h-14 w-full items-center gap-2 rounded-2xl border-2 border-[#dde3e7] bg-white px-4 text-[#4b5563] transition focus-within:border-[#8fba73] focus-within:ring-4 focus-within:ring-[#81bc5c33] sm:min-h-15.5 sm:px-5">
            <Icon className="shrink-0 text-[#97a1ae]" size={22} strokeWidth={2} />
            <input
                type={type}
                placeholder={placeholder}
                className="w-full border-0 bg-transparent text-[1rem] text-[#273142] outline-0 placeholder:text-[#9ca6b5] sm:text-[1.12rem]"
            />
            {trailing ? <span className="shrink-0 text-[#97a1ae]">{trailing}</span> : null}
        </label>
    )
}

export function AuthField({
    label,
    icon,
    placeholder,
    type,
    trailing,
}: {
    label: string
    icon: LucideIcon
    placeholder: string
    type?: 'text' | 'email' | 'password'
    trailing?: ReactNode
}) {
    return (
        <div className="mb-5 sm:mb-5.5">
            <p className="mb-2.5 text-[1.1rem] font-semibold text-[#1d6b3f] sm:text-[1.42rem]">{label}</p>
            <AuthInput icon={icon} placeholder={placeholder} type={type} trailing={trailing} />
        </div>
    )
}

export function AuthButton({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <button
            type="button"
            className={cn(
                'mt-1 min-h-14 w-full rounded-full bg-linear-to-b from-[#5c9a34] to-[#4f9132] px-6 text-[1.55rem] font-bold text-[#f8fff5] shadow-[0_10px_24px_rgba(78,146,53,0.26)] transition hover:brightness-[1.02] active:translate-y-px sm:min-h-17 sm:text-[2rem]',
                className
            )}
        >
            {children}
        </button>
    )
}

export function AuthFooterText({
    text,
    action,
    href,
}: {
    text: string
    action: string
    href: string
}) {
    return (
        <p className="mt-7 text-center text-[1.08rem] text-[#4b5563]">
            {text} <Link href={href}>{action}</Link>
        </p>
    )
}

export function BackTextLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link href={href} className="back-link">
            {children}
        </Link>
    )
}

function Brand() {
    return (
        <div aria-label="EcoSmart AI">
            <img
                src="/images/logo.png"
                alt="EcoSmart AI"
                className="h-8 w-auto object-contain"
            />
        </div>
    )
}
