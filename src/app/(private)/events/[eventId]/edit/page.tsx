import EventForm from "@/components/forms/event-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/drizzle/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import React from "react";

export const revalidate = 0

const EditEvent = async ({
  params: { eventId },
}: {
  params: { eventId: string };
}) => {
  const { userId, redirectToSignIn } = await auth();

  if (userId === null) {
    return redirectToSignIn();
  }

  const event = await db.query.EventTable.findFirst({
    where: ({ id, clerkUserId }, { and, eq }) =>
      and(eq(clerkUserId, userId), eq(id, eventId)),
  });

  if (!event) return notFound();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Event</CardTitle>
      </CardHeader>

      <CardContent>
        <EventForm
          event={{ ...event, description: event.description || undefined }}
        />
      </CardContent>
    </Card>
  );
};

export default EditEvent;
