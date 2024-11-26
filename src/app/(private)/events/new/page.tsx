
import EventForm from '@/components/forms/event-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React from 'react'

const AddEvent = () => {

  return (

   <Card>
    <CardHeader>
        <CardTitle>
            New Event
        </CardTitle>
    </CardHeader>

    <CardContent>
        <EventForm />
    </CardContent>
    
   </Card>

  )
}

export default AddEvent