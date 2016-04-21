import Ember from 'ember';

export default Ember.Route.extend({
  //queryParams: {
    //selectedStage: {
      //refreshModel: true
    //}
  //},
  model(params){
    console.log('calling the model hook', params);
    var day = this.modelFor('day');
    //var events = day.get('events');
    //console.log('events = ', events);
    //if(params.selectedStage){
      //events = events.filter(event => event.get('stageName') === params.selectedStage)
    //}
    //var newDay = Ember.Object.create({
      //id: day.get('id'),
      //events: events,
      //stages: day.get('stages'),
      //friendlyName: day.get('friendlyName')
    //});
    return day;
  },

  setupController(controller,model){
    this._super(controller,model);
    var day = model.get('id');
    var scrollTop = controller.get('scrollTop'+day) || 0;
    controller.set('scrollTop', scrollTop);
    Ember.run.next(this,function(){
      controller.handleResize();
    });
    Ember.run.later(this,function(){
      controller.handleResize();
    },300);
    Ember.run.later(this,function(){
      controller.handleResize();
    },900);
    Ember.run.later(this,function(){
      controller.handleResize();
    },1500);
  },

  actions:{
    willTransition(){
      console.log('calling will transition');
      var scrollTop = this.get('controller.scrollTop');
      var day = this.get('controller.model.id');
      this.set('controller.scrollTop'+day,scrollTop);
    }
  }
});
