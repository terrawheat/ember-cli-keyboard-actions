import Ember from 'ember';
import layout from '../templates/components/test-component';
import KAM from 'ember-cli-keyboard-actions/mixins/keyboard-actions';

export default Ember.Component.extend(KAM, {
  layout: layout,
  keysPressed: [],

  keyDownActions: {
    'any': function () {
      debugger;
    }
  }
});
