import DS from 'ember-data';
import {
  extractSingle
} from "nmf-schedule/extractors/band";

export default DS.RESTSerializer.extend({

  normalizeSingleResponse(store, type, payload, id, requestType) {
    payload = extractSingle(payload);

    this.extractMeta(store, type, payload);

    return this._super(store, type, payload, id, requestType);
  }

});

