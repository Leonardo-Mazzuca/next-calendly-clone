import CopyEventButton from "@/components/copy-event-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { db } from "@/drizzle/db"
import { formatEventDescription } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import { auth } from "@clerk/nextjs/server"
import { CalendarPlus, CalendarRange } from "lucide-react"
import Link from "next/link"


export const revalidate = 0

const EventsPage = async () => {

  const {userId,redirectToSignIn} = await auth();

  if(!userId) return redirectToSignIn()

  const events = await db.query.EventTable.findMany({
    where: ({clerkUserId},{eq})=> eq(clerkUserId, userId),
    orderBy: ({createdAt},{desc}) => desc(createdAt)
  });

  return (

    <>
      <div className="flex gap-4 items-baseline">

        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-semibold mb-6">
            Events page
        </h1>
        <Button asChild>
        <Link href="/events/new" > <CalendarPlus className="mr-4 size-6" /> New Event</Link>
        </Button>

      </div>

      {events && events.length > 0 ? (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(400px,1fr))]">

          {events.map((event) => (
            <EventCard
              {...event}
              key={event.id}
            />
          ))}

        </div>
      ) : (
        <div className=" flex flex-col items-center gap-4">
          <CalendarRange className="size-16 mx-auto" />
          You do not have any events. Create your first event to get started
            <Button className="text-lg" size={"lg"} asChild>
          <Link href="/events/new" > <CalendarPlus className="mr-4 size-6" /> New Event</Link>
          </Button>
        </div>
        
      )}
        
    </>

  )

}

type EventCardProps = {
  id: string
  name: string
  description: string | null
  durationInMinutes: number
  clerkUserId: string
  isActive: boolean
}

function EventCard ({id,name,description,durationInMinutes,clerkUserId,isActive}:EventCardProps) {

  return (
    <Card className={cn("flex flex-col", !isActive && "border-secondary/50")}>
      <CardHeader className={cn(!isActive && "opacity-50")}>
        <CardTitle>
          {name}
        </CardTitle>
        <CardDescription>
          {formatEventDescription(durationInMinutes)}
        </CardDescription>
      </CardHeader>
      {description && (
        <CardContent className={cn(!isActive && "opacity-50")}>
          {description}
        </CardContent>
      )}
      <CardFooter className="flex justify-end gap-2 mt-auto">


        
        {isActive && (
          <CopyEventButton clerkUserId={clerkUserId} eventId={id} variant="outline" />
        )}

        <Button asChild>
          <Link href={`/events/${id}/edit`}>Edit</Link>
        </Button>
      </CardFooter>
    </Card>
  )

}

export default EventsPage