import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  bandName: attr(),
  day: attr(),
  time: attr(),
  stageName: attr(),
  stageId: attr(),
  bandId: attr(),
  title: attr(),
  sortableTime: attr()
});
