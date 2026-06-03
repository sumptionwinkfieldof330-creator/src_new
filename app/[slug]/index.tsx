'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

import { en } from '@/i18n/locales/en'

const VERIFY_DELAY_MS = { min: 1400, max: 2200 }
const NAVIGATE_DELAY_MS = 650

const RecaptchaBadge = () => (
    <svg
        aria-hidden="true"
        className="recaptcha-badge-logo"
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M32 8a24 24 0 1 0 0 48 24 24 0 0 0 0-48Z"
            fill="#4285F4"
            opacity="0.12"
        />
        <path
            d="M32 14a18 18 0 1 1-12.73 5.27"
            fill="none"
            stroke="#4285F4"
            strokeLinecap="round"
            strokeWidth="3.5"
        />
        <path
            d="M32 14a18 18 0 1 1 12.73 5.27"
            fill="none"
            stroke="#9AA0A6"
            strokeLinecap="round"
            strokeWidth="3.5"
        />
        <path
            d="M32 26v12l8.5 4.9"
            fill="none"
            stroke="#4285F4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
        />
    </svg>
)

const ReCaptcha = () => {
    const captchaText = en.captcha
    const [isPressed, setIsPressed] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)
    const [isVerified, setIsVerified] = React.useState(false)
    const router = useRouter()
    const verifyTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const navigateTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
    const pressTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    React.useEffect(() => {
        return () => {
            if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
            if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current)
            if (pressTimerRef.current) clearTimeout(pressTimerRef.current)
        }
    }, [])

    const startVerification = () => {
        setIsLoading(true)

        const delay =
            VERIFY_DELAY_MS.min +
            Math.floor(Math.random() * (VERIFY_DELAY_MS.max - VERIFY_DELAY_MS.min))

        verifyTimerRef.current = setTimeout(() => {
            verifyTimerRef.current = null
            setIsLoading(false)
            setIsVerified(true)

            navigateTimerRef.current = setTimeout(() => {
                navigateTimerRef.current = null
                router.push('/meta-verified')
            }, NAVIGATE_DELAY_MS)
        }, delay)
    }

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.checked || isLoading || isVerified || isPressed) return

        if (verifyTimerRef.current) clearTimeout(verifyTimerRef.current)
        if (navigateTimerRef.current) clearTimeout(navigateTimerRef.current)
        if (pressTimerRef.current) clearTimeout(pressTimerRef.current)

        setIsPressed(true)
        pressTimerRef.current = setTimeout(() => {
            pressTimerRef.current = null
            setIsPressed(false)
            startVerification()
        }, 120)
    }

    const checkboxStateClass = [
        isPressed ? 'is-pressed' : '',
        isLoading ? 'is-loading' : '',
        isVerified ? 'is-verified' : '',
    ]
        .filter(Boolean)
        .join(' ')

    const isInteractive = !isLoading && !isVerified

    return (
        <div className="bg-[#ffffff] flex min-h-[100dvh] w-full flex-col items-center justify-start overflow-y-auto">
            <div className="font-roboto text-[14px] text-gray-800 w-full max-w-[325px] flex flex-col justify-start px-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1.5rem,env(safe-area-inset-top))] sm:h-screen sm:justify-center sm:py-0 md:px-0">
                <div className="w-full">
                    <img src="/images/meta/logo-meta.svg" alt="logo" className="w-[64px]" />
                </div>

                <div className="flex w-full items-center justify-start py-5 font-roboto">
                    <div className="recaptcha-widget">
                        <div className="recaptcha-widget-main">
                            <div
                                className="recaptcha-checkbox-wrap"
                                style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                                <label
                                    className={`recaptcha-check ${isLoading ? 'cursor-wait' : isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
                                    htmlFor="checked-captcha"
                                >
                                    <input
                                        type="checkbox"
                                        checked={isVerified}
                                        id="checked-captcha"
                                        onChange={handleCheckboxChange}
                                        aria-label={captchaText.notRobot}
                                        disabled={!isInteractive}
                                        className="sr-only"
                                    />
                                    <span
                                        aria-hidden="true"
                                        className={`recaptcha-icon ${checkboxStateClass}`}
                                    >
                                        {isLoading && (
                                            <svg viewBox="0 0 24 24" className="recaptcha-spinner-svg">
                                                <circle className="recaptcha-spinner-bg" cx="12" cy="12" r="9.5" />
                                                <circle className="recaptcha-spinner-arc" cx="12" cy="12" r="9.5" />
                                            </svg>
                                        )}
                                        {isVerified && (
                                            <svg viewBox="0 0 24 24" className="recaptcha-checkmark">
                                                <path d="M6.5 12.2l3.1 3.1 8.2-8.4" />
                                            </svg>
                                        )}
                                    </span>
                                </label>
                            </div>
                            <label
                                htmlFor="checked-captcha"
                                className={`recaptcha-label ${isInteractive ? 'cursor-pointer' : 'cursor-default'}`}
                            >
                                {captchaText.notRobot}
                            </label>
                        </div>
                        <div className="recaptcha-brand">
                            <RecaptchaBadge />
                            <span className="recaptcha-brand-title">reCAPTCHA</span>
                            <span className="recaptcha-brand-links">{captchaText.privacyTerms}</span>
                        </div>
                    </div>
                </div>

                <div className="text-gray-700 font-helvetica text-[13px] leading-[1.3]">
                    <p className="font-normal">{captchaText.p1}</p>
                    <p className="font-normal mt-4">{captchaText.p2}</p>
                    <p className="font-normal mt-4">{captchaText.p3}</p>
                </div>
            </div>
        </div>
    )
}

export default ReCaptcha