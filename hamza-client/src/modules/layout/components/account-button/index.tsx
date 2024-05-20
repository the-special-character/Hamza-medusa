import LocalizedClientLink from '@modules/common/components/localized-client-link'
import React from 'react'

type Props = {}

const AccountButton = (props: Props) => {
  return (
    <LocalizedClientLink href='/account' title="account" className='text-white'>Account</LocalizedClientLink>
  )
}

export default AccountButton