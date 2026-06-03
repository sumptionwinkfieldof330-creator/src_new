import { NextRequest, NextResponse } from 'next/server'

/** Từ khóa bot — dùng includes thay vì regex lớn (tránh crash Edge trên Vercel) */
const BOT_KEYWORDS = [
  'bot',
  'crawler',
  'spider',
  'scraper',
  'facebookexternalhit',
  'facebookcatalog',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'telegrambot',
  'googlebot',
  'bingbot',
  'yandexbot',
  'baiduspider',
  'headless',
  'phantomjs',
  'selenium',
  'webdriver',
  'puppeteer',
  'playwright',
  'curl/',
  'wget/',
  'python-requests',
  'go-http-client',
  'scrapy',
] as const

const SUSPICIOUS_KEYWORDS = ['curl', 'wget', 'python', 'java/', 'postman', 'insomnia'] as const

function matchesKeyword(value: string, keywords: readonly string[]): boolean {
  const lower = value.toLowerCase()
  return keywords.some((keyword) => lower.includes(keyword))
}

function isLikelyBot(req: NextRequest): boolean {
  const userAgent = req.headers.get('user-agent') ?? ''
  const acceptHeader = req.headers.get('accept') ?? ''
  const acceptLanguage = req.headers.get('accept-language') ?? ''

  if (!userAgent) {
    return false
  }

  if (matchesKeyword(userAgent, BOT_KEYWORDS)) {
    return true
  }

  if (matchesKeyword(userAgent, SUSPICIOUS_KEYWORDS)) {
    if (!acceptHeader || acceptHeader === '*/*') {
      return true
    }
    if (!acceptLanguage) {
      return true
    }
  }

  return false
}

function shouldSkipMiddleware(pathname: string): boolean {
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/metadata') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/fonts')
  ) {
    return true
  }

  // File tĩnh: .ico, .png, .svg, ...
  if (/\.[a-z0-9]+$/i.test(pathname)) {
    return true
  }

  return false
}

export function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl

    if (shouldSkipMiddleware(pathname)) {
      return NextResponse.next()
    }

    if (isLikelyBot(req)) {
      const url = req.nextUrl.clone()
      url.pathname = '/metadata'
      return NextResponse.rewrite(url)
    }

    return NextResponse.next()
  } catch {
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|api|favicon.ico|robots.txt|sitemap.xml|images|static|fonts|metadata).*)',
  ],
}
