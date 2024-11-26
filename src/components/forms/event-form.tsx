'use client'
import { useForm } from "react-hook-form"
import {zodResolver} from '@hookform/resolvers/zod'
import { EventFormType, eventFormSchema } from "@/schema/events";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import Link from "next/link";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { createEvent, deleteEvent, updateEvent } from "@/server/actions/events";

import { useState, useTransition } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";


const EventForm = ({event}:{event?:{
    id: string,
    name: string,
    description?:string,
    durationInMinutes:number,
    isActive:boolean
}}) => {

    const [isDeletePending, startDeleteTransition] = useTransition()


    const form = useForm<EventFormType>({
        resolver:zodResolver(eventFormSchema),
        mode:'all',
        criteriaMode:'all',
        defaultValues: event ?? {
            isActive: true,
            durationInMinutes: 30,
            name: '',
            description: ''
        }
    });


   async function onSubmit (values: EventFormType) {
        const action = event === null ? createEvent : updateEvent.bind(null,event!.id)

        const data = await action(values)
        if(data?.error){
            form.setError('root',{message:'There was an error saving the event!'})
        }
        
    }

    const handleDelete = async () => {
        startDeleteTransition(async () => {
            const data = await deleteEvent(event!.id)

            if (data?.error) {
              form.setError("root", {
                message: "There was an error deleting your event",
              })
            }
          })
    }
    
    return (
    
    <Form {...form}>

        <form className="gap-y-6 flex flex-col" onSubmit={form.handleSubmit(onSubmit)}>
        	
            {form.formState.errors.root && (
                <div className="text-destructive text-sm">
                    {form.formState.errors.root.message}
                </div>
            )}
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Event Name
                        </FormLabel>

                        <FormControl >
                            <Input {...field} />
                        </FormControl>

                        <FormDescription >
                            The name users will see when booking
                        </FormDescription>

                        <FormMessage  />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="durationInMinutes"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Duration in minutes
                        </FormLabel>

                        <FormControl >
                            <Input type="number" {...field} />
                        </FormControl>

                        <FormDescription >
                            In minutes
                        </FormDescription>

                        <FormMessage  />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>
                            Description
                        </FormLabel>

                        <FormControl >
                            <Textarea className="resize-none h-32" {...field} />
                        </FormControl>

                        <FormDescription >
                            Optional description of the event
                        </FormDescription>

                        <FormMessage  />
                    </FormItem>
                )}
            />

            <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex gap-2 items-center">

                            <FormLabel>
                                Active
                            </FormLabel>

                            <FormControl >
                                <Switch 
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>

                        </div>

                        <FormDescription >
                            Inactive events will not be visible for users to book
                        </FormDescription>

                        <FormMessage  />
                    </FormItem>
                )}
            />

            <div className="flex justify-end gap-2">
                
                {event && (
                    <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button disabled={isDeletePending || form.formState.isSubmitting} variant={"destructiveGhost"}>
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you shure?
                                    </AlertDialogTitle>
                                        
                                    <AlertDialogDescription>
                                        This action can not be undone. This will permanently delete your event.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                      variant="destructive"
                                      onClick={handleDelete}
                                    disabled={isDeletePending || form.formState.isSubmitting}>
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                    </AlertDialog>
                )}

                <Button variant={"outline"} asChild>
                    <Link href={"/events"} >
                        Cancel
                    </Link>
                </Button>
                <Button type="submit">
                    Save
                </Button>

            </div>

        </form>

    </Form>

  )

}

export default EventForm