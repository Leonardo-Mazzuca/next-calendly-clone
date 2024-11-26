"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EventFormType } from "@/schema/events";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";

import { deleteEvent } from "@/server/actions/events";

import { Fragment, useEffect, useState, useTransition } from "react";
import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { scheduleFormSchema, ScheduleFormType } from "@/schema/schedule";
import { timeToInt } from "@/lib/utils";
import { Select, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { SelectContent } from "@radix-ui/react-select";
import { formatTimezoneOffset } from "@/lib/formatters";
import { PlusIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { saveSchedule } from "@/server/actions/schedule";
import { db } from "@/drizzle/db";
import { ScheduleAvailabilityTable } from "@/drizzle/schema";

type Availability = {
  startTime: string;
  endTime: string;
  dayOfWeek: (typeof DAYS_OF_WEEK_IN_ORDER)[number];
};

const ScheduleForm = ({
  schedule,
}: {
  schedule?: {
    timezone: string;
    availabilities: Availability[];
  };
}) => {
  const [isDeletePending, startDeleteTransition] = useTransition();
  const [successMessage, setSuccessMessage] = useState("")

  const form = useForm<ScheduleFormType>({
    resolver: zodResolver(scheduleFormSchema),
    mode: "all",
    criteriaMode: "all",
    defaultValues: {
      availabilities: schedule?.availabilities.toSorted(
        (a, b) => timeToInt(a.startTime) - timeToInt(b.startTime)
      ),
      timezone:
        schedule?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  

  async function onSubmit(values: ScheduleFormType) {

    const data = await saveSchedule(values);

    if (data?.error) {
      form.setError("root", {
        message: "There was an error saving the schedule!",
      });
    } else {
      setSuccessMessage("Schedule Saved!")
    }
  }

  const {
    append: addAvailability,
    fields: availabilityFields,
    remove: removeAvailability,
  } = useFieldArray({
    name: "availabilities",
    control: form.control,
  });

  //user isso em alguma hora
  const groupedAvailabilitiesFields = Object.groupBy(
    availabilityFields.map((field, index) => ({
      ...field,
      index,
    })),
    (availability) => availability.dayOfWeek
  );

  const handleDelete = async () => {
    startDeleteTransition(async () => {
      // const data = await deleteEvent(schedule!.id);

      // if (data?.error) {
      //   form.setError("root", {
      //     message: "There was an error deleting your event",
      //   });
      // }
    });
  };

  return (
    <Form {...form}>
      <form
        className="gap-y-6 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        {successMessage && (
             <div className="text-green-500 text-sm">
              {successMessage}
           </div>
        )}

        <FormField
          control={form.control}
          name="timezone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Timezone</FormLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Intl.supportedValuesOf("timeZone").map((timezone) => (
                    <SelectItem value={timezone} key={timezone}>
                      {`${formatTimezoneOffset(timezone)}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-[auto,1fr] gap-y-6 gap-x-4">
          {DAYS_OF_WEEK_IN_ORDER.map((dayOfWeek) => (
            <Fragment key={dayOfWeek}>
              <div className="capitalize text-sm font-semibold">
                {dayOfWeek.substring(0, 3)}
              </div>
              <div className="flex-col gap-2 flex">
                <Button
                  variant={"outline"}
                  className="size-6 p-1"
                  onClick={() => {

                    addAvailability({
                      dayOfWeek,
                      startTime: "9:00",
                      endTime: "17:00" 
                    })

                  }}
                  type="button"
                >
                  <PlusIcon className="size-full" />
                </Button>
                {groupedAvailabilitiesFields[dayOfWeek]?.map(
                  (field, labelIndex) => (

                    <div className="flex flex-col gap-1" key={field.id}>

                      <div key={labelIndex} className="flex gap-2 items-center">
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.startTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  aria-label={`${dayOfWeek} Start Time ${
                                    labelIndex + 1
                                  }`}
                                  className="w-24"
                                  {...field}
                                />
                              </FormControl>

                            </FormItem>
                          )}
                        />
                        -
                        <FormField
                          control={form.control}
                          name={`availabilities.${field.index}.endTime`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  aria-label={`${dayOfWeek} End Time ${
                                    labelIndex + 1
                                  }`}
                                  className="w-24"
                                  {...field}
                                />
                              </FormControl>

                
                            </FormItem>
                          )}
                        />
                        <Button 
                          variant={"destructiveGhost"} 
                          className="size-6 p-1" 
                          type="button"
                          onClick={()=>removeAvailability(field.index)}
                        >
                          <X />
                        </Button>
                      </div>

                      <FormMessage>
                        {form.formState.errors?.availabilities?.at?.(field.index)?.root?.message}
                      </FormMessage>
                      <FormMessage>
                        {form.formState.errors?.availabilities?.at?.(field.index)?.startTime?.message}
                      </FormMessage>
                      <FormMessage>
                        {form.formState.errors?.availabilities?.at?.(field.index)?.endTime?.message}
                      </FormMessage>


                    </div>

                  )
                )}
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ScheduleForm;
