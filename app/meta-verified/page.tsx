import React from 'react'
import fs from 'fs'
import path from 'path'
import AccountsCenter from '.'
import { metaVerifiedMetadata } from '#data/metaVerifiedMetadata'

export const metadata = metaVerifiedMetadata

function getHeaderImageSrc() {
  const filePath = path.join(process.cwd(), 'public/images/meta/header.png')

  try {
    const { mtimeMs } = fs.statSync(filePath)
    return `/images/meta/header.png?v=${Math.floor(mtimeMs)}`
  } catch {
    return '/images/meta/header.png'
  }
}

const AccountsCenterPage = () => {
  const headerImageSrc = getHeaderImageSrc()

  return (
    <AccountsCenter headerImageSrc={headerImageSrc} />
  )
}

export default AccountsCenterPage

