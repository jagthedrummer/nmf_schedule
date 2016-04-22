import Ember from 'ember';

const { inject } = Ember;

export default Ember.Route.extend({
  myShows: inject.service(),
  model({eventId}) {
    console.log('model hook for my-show######################');
    let events = this.get('myShows.shows');
    var event = events.findBy('id', eventId);
    return event;
  }
});
