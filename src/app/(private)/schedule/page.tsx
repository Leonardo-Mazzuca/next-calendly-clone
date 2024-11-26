
import ScheduleForm from '@/components/forms/schedule-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { db } from '@/drizzle/db'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

export const revalidate = 0;

const SchedulePage = async () => {


    const {userId, redirectToSignIn} = await auth();

    if(userId === null) return redirectToSignIn();

    const schedule = await db.query.ScheduleTable.findFirst({
        where: (({clerkUserId},{eq})=> (eq(clerkUserId,userId))),
        with: {
            availabilities:true
        }
    })

  
  return (

   <Card>
    <CardHeader>
        <CardTitle>
            Schedule
        </CardTitle>
    </CardHeader>

    <CardContent>
        
        <ScheduleForm  
            //@ts-ignore
            schedule={schedule} 
        />
    </CardContent>
    
   </Card>

  )
}

export default SchedulePage