

import React, { PropsWithChildren } from 'react'

const PublicLayout = ({children}:PropsWithChildren) => {

  return (

    <main className='container my-6'>
        {children}
    </main>
    
  )
  
}

export default PublicLayout