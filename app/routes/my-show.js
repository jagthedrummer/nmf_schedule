import Ember from 'ember';

const { inject } = Ember;

export default Ember.Route.extend({
  myShows: inject.service(),
  model({eventId}) {
    let events = this.get('myShows.shows');
    console.log('events = ', events);
    var event = events.findBy('id', eventId);
    console.log('eventId = ', eventId);
    console.log('event = ', event);
    return event;
  }
});
