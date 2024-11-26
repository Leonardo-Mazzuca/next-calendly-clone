

import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

import React from 'react'

const AuthLayout = async ({children}:{children:React.ReactNode}) => {

    const {userId} = await auth();

    if(userId !== null) {
        redirect('/')
    }

  return (

    <div className='justify-center min-h-screen items-center flex'>
        {children}
    </div>

  )
}

export default AuthLayout