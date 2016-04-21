import Ember from 'ember';

export default Ember.Route.extend({
  model({eventId}) {
    let day = this.modelFor('day');
    return day.events.findBy('id', eventId);
  }
});
