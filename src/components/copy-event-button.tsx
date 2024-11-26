'use client'

import { useState } from 'react'
import { Button, ButtonProps } from './ui/button'
import { Copy, CopyCheck, CopyX } from 'lucide-react'


type CopyState = "idle" | "copied" | "error"
const CopyEventButton = ({eventId, clerkUserId, ...props}:Omit<ButtonProps, "children" | "onClick"> & {eventId:string, clerkUserId:string}) => {
    
    const [copyState, setCopyState] = useState<CopyState>('idle')

    const CopyIcon = getCopyIcon(copyState)


    const clipBoard = `${location.origin}/book/${clerkUserId}/${eventId}`

    function copyEvent () {
        navigator.clipboard.writeText(clipBoard)
        .then(()=>{
        setCopyState("copied")
            setTimeout(()=> {
                setCopyState("idle")
            },2000)
        
        }).catch(()=> {
            setCopyState("error")
            setTimeout(()=> {
                setCopyState("idle")
            },2000)
        })
    }

    return (

    <Button onClick={copyEvent} {...props}>
        <CopyIcon className='size-4 mr-2' />

        {getChildren(copyState)}
    </Button>

  )

}

function getChildren(copyState:CopyState){

    switch(copyState){
        case'idle':
        return "Copy Link"
        case 'copied':
            return "Copied!"
        case 'error':
            return "Error" 
    }
}   

function getCopyIcon(state:CopyState) {
    
    switch(state){
        case'idle':
            return Copy
        case 'copied':
            return CopyCheck
        case 'error':
            return CopyX
        
    }

}

export default CopyEventButton