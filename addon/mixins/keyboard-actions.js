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
        return this.runKeyFunction(codeName, keyActions);
      }

      if (prettyName in keyActions) {
        return this.runKeyFunction(prettyName, keyActions);
      }
    }
  },

  runKeyFunction: function (key, actions) {
    var toRun = actions[key];

    if (toRun) {
      if (typeof toRun === 'string') {
        return this[toRun].apply(this);
      }

      return toRun.apply(this);
    }
  }
});
