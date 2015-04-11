import Ember from 'ember';
import keymap from '../keycode-map.js';

export default Ember.Mixin.create({
  eventManager: Ember.Object.create({
    keyDown: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyDownFunction(e.keyCode);
      }
    }
  }),

  dispatchKeyDownFunction: function (keyCode) {
    var keyDownActions = this.get('keyDownActions');
    var codeName = `key${keyCode}`;
    var prettyName = keymap[keyCode];

    if (keyDownActions) {
      if (codeName in keyDownActions) {
        return keyDownActions[codeName].apply(this);
      }

      if (prettyName in keyDownActions) {
        return keyDownActions[prettyName].apply(this);
      }
    }
  }
});
