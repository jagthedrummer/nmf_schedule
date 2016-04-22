import Ember from 'ember';
import $ from 'jquery';

const {
  Controller,
  computed,
  inject: { service }
} = Ember;

export default Controller.extend({
  routing: service('-routing'),

  showArrow: Ember.computed('routing.currentPath', function(){
    return this.get('routing.currentPath') === 'day.event' ||
      this.get('routing.currentPath') === 'my-show';
  }),

  bodyContainerHeight: "200",

  olHeight: "100",

  myShows: service(),

  backLinkPath: Ember.computed('routing.currentPath', function(){
    if(this.get('routing.currentPath') === 'day.event'){
      return "day.index";
    }
    return "index";
  }),

  initMyShows: Ember.observer('model', 'model.allEvents.[]', '', function(){
    var myShows = this.get('myShows');
    var events = this.get('model.allEvents');
    myShows.initEvents(events);
  }),

  handleResize: function() {
    var windowHeight = $(window).height();
    var navHeight = $('.day-nav').height();
    var bodyContainerHeight = windowHeight - navHeight;
    this.set('bodyContainerHeight', bodyContainerHeight);
  },
  
  bindResizeEvent: function() {
    this.handleResize();
    $(window).on('resize', Ember.run.bind(this, this.handleResize));
  }.on('init'),

  unbindResizeEvent: function(){
    $(window).off('resize');
  }.on('willDestroy')


});
