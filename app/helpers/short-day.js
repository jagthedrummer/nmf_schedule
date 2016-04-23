import Ember from 'ember';

export function shortDay(params/*, hash*/) {
  var day = params[0]
  return day.substring(0,3);
}

export default Ember.Helper.helper(shortDay);
