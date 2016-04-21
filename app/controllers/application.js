import Ember from 'ember';

const {
  Controller,
  computed,
  inject: { service }
} = Ember;

export default Controller.extend({
  routing: service('-routing'),

  showArrow: computed.equal('routing.currentPath', 'day.event'),

  bodyContainerHeight: "200",

  olHeight: "100",

  handleResize: function() {
    var windowHeight = $(window).height();
    var navHeight = $('.day-nav').height();
    var bodyContainerHeight = windowHeight - navHeight;
    this.set('bodyContainerHeight', bodyContainerHeight);
  },
  
  bindResizeEvent: function() {
    this.handleResize();
    jQuery(window).on('resize', Ember.run.bind(this, this.handleResize));
  }.on('init'),

  unbindResizeEvent: function(){
    jQuery(window).off('resize');
  }.on('willDestroy')

});
