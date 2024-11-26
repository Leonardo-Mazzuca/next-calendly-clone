"use server"
import "use-server"

import {google} from 'googleapis'
import {endOfDay, startOfDay} from 'date-fns'
import { clerkClient } from "@clerk/nextjs/server"



export async function getCalendarEventTimes(
    clerkUserId:string,
    {start,end}:{start:Date,end:Date}
) {
    
    const oAuthClient = await getOAuthClient(clerkUserId)
  

    // const events = await google.calendar("v3").events.list({
    //     calendarId:"primary",
    //     auth: oAuthClient,
    //     eventTypes: ["default"],
    //     singleEvents: true,
    //     timeMin: start.toISOString(),
    //     timeMax: end.toISOString(),
    //     maxResults: 2500
    // })


    // return events.data.items?.map(event => {

    //     if(event.start?.date != null && event.end?.date != null){
    //         return {
    //             start:startOfDay(event.start.date),
    //             end: endOfDay(event.end.date)
    //         }
    //     }

    //     if(event.start?.dateTime!=null && event.end?.dateTime!= null){
    //         return {
    //             start:new Date(event.start.dateTime),
    //             end: new Date(event.end.dateTime)
    //         }
    //     }

    // }).filter(date => date!=null) || []
}


async function getOAuthClient(clerkUserId:string) {

    const token = await (await clerkClient()).users.getUserOauthAccessToken(
        clerkUserId,
        "oauth_google"
      )
    console.log('{DEBUG} USERID: ', clerkUserId);
    

    // const data = (await token).data

    // if(data.length===0 || data[0].token==null){
    //     return;
    // }

    // if (
    //     !process.env.GOOGLE_OAUTH_CLIENT_ID || 
    //     !process.env.GOOGLE_OAUTH_CLIENT_SECRET || 
    //     !process.env.GOOGLE_OAUTH_REDIRECT_AUTH
    // ) {
    //     throw new Error("Variáveis de ambiente do Google OAuth não estão configuradas.");
    // }

    // const client = new google.auth.OAuth2(
    //     process.env.GOOGLE_OAUTH_CLIENT_ID,
    //     process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    //     process.env.GOOGLE_OAUTH_REDIRECT_AUTH,
    // )


    // client.setCredentials({access_token: data[0].token})

    // return client
}