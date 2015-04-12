import Ember from 'ember';
import keymap from '../keycode-map.js';

export default Ember.Mixin.create({
  eventManager: Ember.Object.create({
    keyDown: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyFunction(e.keyCode, 'keyDown');
      }
    },
    keyUp: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyFunction(e.keyCode, 'keyUp');
      }
    },
    keyPress: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyFunction(e.keyCode, 'keyPress')
      }
    }
  }),

  dispatchKeyFunction: function (keyCode, action) {
    var keyActions = this.get(action + 'Actions');
    var codeName = 'key' + keyCode;
    var prettyName = keymap[keyCode];

    if (keyActions) {
      if (codeName in keyActions) {
        return keyActions[codeName].apply(this);
      }

      if (prettyName in keyActions) {
        return keyActions[prettyName].apply(this);
      }
    }
  }
});
