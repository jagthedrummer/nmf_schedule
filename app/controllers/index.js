import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    chooseMyShow(showId){
      this.transitionToRoute('my-show', showId);
    }
  }
});
