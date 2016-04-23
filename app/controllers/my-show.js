import Ember from 'ember';
const { inject } = Ember;

export default Ember.Controller.extend({
  myShows: inject.service(),
  actions: {
    addShow(show) {
      const myShows = this.get('myShows');
      myShows.addShow(show);
    }
  }
});
