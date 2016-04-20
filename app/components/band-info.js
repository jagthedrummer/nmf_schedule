import Ember from 'ember';

export default Ember.Component.extend({

  store: Ember.inject.service(),
  bandId: null,

  willInsertElement(){
    var component = this;
    var bandId = this.get('bandId');
    console.log('looking for bandId', bandId);
    this.get('store').findRecord('band', bandId).then(function(band){
      component.set('band',band);
    })
  }

});
