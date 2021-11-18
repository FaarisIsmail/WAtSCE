import React from 'react';
import Event from './Event';

export default function EventList({ events, registrations, hostEvents }) {

  const eventElements = events.map(event => {
    return <Event key={event.id} {...event} registrations={registrations} hostEvents={hostEvents}/>
  })

  return (
    <div>
      {eventElements}
    </div>
  )
}
