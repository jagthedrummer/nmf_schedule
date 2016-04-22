import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    chooseMyShow(showId){
      console.log('starting chooseMyShow');
      this.transitionToRoute('my-show', showId);
    }
  }
});
