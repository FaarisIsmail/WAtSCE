import React from 'react';
import Event from './Event';

export default function EventList({ events, registrations, hostEvents }) {
  let previous = "";
  let eventElements = "";

  if (!hostEvents)
  {
    eventElements = events.map(event => {
      return <>{event.date !== previous && <><br/><br/><h1>{date(event.date)}</h1></>}<Event key={event.id} {...event} registrations={registrations} hostEvents={hostEvents}/></>
    })
  }
  else
  {
    eventElements = events.map(event => {
      return <><Event key={event.id} {...event} registrations={registrations} hostEvents={hostEvents}/></>
    })
  }

  function date(d)
  {
    if (previous !== d)
      {
        previous = d;
        return d;
      }
    else
      {
        previous = d;
        return "";
      }
  }

  return (
    <div>
      {eventElements}
    </div>
  )
}
