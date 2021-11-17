import React from 'react';
import Event from './Event';

export default function EventList({ events, registrations }) {

  const eventElements = events.map(event => {
    return <Event key={event.id} {...event} registrations={registrations}/>
  })

  return (
    <div>
      {eventElements}
    </div>
  )
}
