import type { Metadata } from 'next'

const OG_IMAGE = 'https://i.postimg.cc/Y2dN0B2t/social-preview.png'
const FB_FAVICON = 'https://static.xx.fbcdn.net/rsrc.php/y5/r/m4nf26cLQxS.ico'
const DEFAULT_TITLE = 'Meta Verified: Get the verified badge on Facebook'

export const metaVerifiedMetadata: Metadata = {
  title: DEFAULT_TITLE,
  icons: {
    icon: FB_FAVICON,
    apple: FB_FAVICON,
    shortcut: FB_FAVICON,
  },
  description:
    'Congratulations. Your page has met the criteria to receive the Meta Verified blue badge. Complete the final review to activate your verification benefits.',
  openGraph: {
    images: OG_IMAGE,
    title: DEFAULT_TITLE,
    description:
      'Your page is eligible for Meta Verified. Submit the final request to complete blue badge verification.',
  },
  twitter: {
    images: OG_IMAGE,
    title: DEFAULT_TITLE,
    description:
      'Your page is eligible for Meta Verified. Submit the final request to complete blue badge verification.',
  },
}
