import { db } from "@/drizzle/db"
import { getValidTimesFromSchedule } from "@/lib/get-valid-times-from-schedule"
import { clerkClient } from "@clerk/nextjs/server"
import { addMonths, eachMinuteOfInterval, endOfDay, roundToNearestMinutes } from "date-fns"
import { notFound } from "next/navigation"



const BookEventPage = async ({
  params: {clerkUserId,eventId}
}: {
  params: {
    clerkUserId: string,
    eventId: string
  }
}) => {

  const event = await db.query.EventTable.findFirst({
    where: (({clerkUserId:userIdCol,isActive,id},{eq,and}) => (
      and(eq(isActive,true),eq(userIdCol,clerkUserId),eq(id,eventId))
    ))
  })

  if(event==null) return notFound();

  const calendarUser = (await clerkClient()).users.getUser(clerkUserId)

  const startDate = roundToNearestMinutes(new Date(),{
    nearestTo: 15,roundingMethod: "ceil"
  })

  const endDate = endOfDay(addMonths(startDate,2))

  const validTimes = await getValidTimesFromSchedule(
    eachMinuteOfInterval({
      start: startDate,
      end: endDate,
    }, {
      step: 15
    }),
    {
      clerkUserId: event.clerkUserId,
      durationInMinutes: event.durationInMinutes
    })

  return (
    <div>BookEventPage</div>
  )
  
}

export default BookEventPage