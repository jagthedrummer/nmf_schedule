import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  imageUrl: attr(),
  description: attr(),
  socialLinks: attr()
});
