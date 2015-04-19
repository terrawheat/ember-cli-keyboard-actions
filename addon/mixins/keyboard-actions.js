/**
 * @module ember-cli-keyboard-actions/mixins/keyboard-actions
 * @requires ember
 * @requires keycode-map
 * @requires keycode-ranges
 * @author Matt Wheatley <terrawheat@gmail.com>
 * @license MIT
 */
import Ember from 'ember';
import keymap from '../keycode-map.js';
import keyranges from '../keycode-ranges.js';

export default Ember.Mixin.create({
  /**
   * Sets the eventManager property of an Ember View
   * to include the required hooks to trigger the
   * user-defined handlers.
   * Automatic hooks are created for the three keyboard
   * based events - keyDown, keyUp and keyPress.
   * @property eventManager
   */
  eventManager: Ember.Object.create({
    /**
     * Event hook for the keyDown event
     * @function keyDown
     * @memberof eventManager
     * @param {KeyboardEvent} e - Event object
     * @param {Ember.View} view - Ember view that triggered
     * @see dispatchKeyFunction
     * @returns {Boolean} - Used to continue/halt propagation
     */
    keyDown: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyFunction(e.keyCode, 'keyDown');
      }
    },
    /**
     * Event hook for the keyUp event
     * @function keyUp
     * @memberof eventManager
     * @param {KeyboardEvent} e - Event object
     * @param {Ember.View} view - Ember view that triggered
     * @see dispatchKeyFunction
     * @returns {Boolean} - Used to continue/halt propagation
     */
    keyUp: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyFunction(e.keyCode, 'keyUp');
      }
    },
    /**
     * Event hook for the keyPress event
     * @function keyPress
     * @memberof eventManager
     * @param {KeyboardEvent} e - Event object
     * @param {Ember.View} view - Ember view that triggered
     * @see dispatchKeyFunction
     * @returns {Boolean} - Used to continue/halt propagation
     */
    keyPress: function (e, view) {
      if ('keyCode' in e) {
        return view.dispatchKeyFunction(e.keyCode, 'keyPress');
      }
    }
  }),

  /**
   * Attempts to resolve a function from the view that
   * should be run in response to the event and keyCode.
   * @function dispatchKeyFuntion
   * @param {Number} keyCode - numeric representation of key pressed
   * @param {String} action - string representation of event that triggered
   * @returns {Boolean} - Used to continue/halt propagation
   */
  dispatchKeyFunction: function (keyCode, action) {
    /**
     * The object of actions related to the event
     * fired. Convention is action + 'Actions',
     * i.e., keyDownActions, keyUpActions
     * @var keyActions
     */
    var keyActions = this.get(action + 'Actions');

    /**
     * String representation of the generic (non-named)
     * key handler to attempt to resolve. Follows the
     * convention of 'key' + KeyboardEvent keyCode.
     * i.e., key37, key12
     * @var codeName
     */
    var codeName = 'key' + keyCode;

    /**
     * A String representing a human readable representation
     * of the key pressed that will attempt to be resolved in
     * to a function.
     * i.e., tab, space
     * @var prettyName
     */
    var prettyName = keymap[keyCode];

    /**
     * Used by the key range resolving code to store the
     * key ranges associated with the key pressed.
     * @var ranges
     */
    var ranges = [];

    /**
     * Used to store the name of the key range function
     * to run
     * @var toRun
     */
    var toRun;

    /** First check to see if we actually have any actions to run **/
    if (keyActions) {
      /**
       * Priority 1: Resolve by keyCode (key37)
       */
      if (codeName in keyActions) {
        return this.runKeyFunction(codeName, keyActions, keyCode);
      }

      /**
       * Priority 2: Resolve by human readable name (tab)
       */
      if (prettyName in keyActions) {
        return this.runKeyFunction(prettyName, keyActions, keyCode);
      }

      /**
       * Priority 3: Resolve key range function
       */
      if (keyCode in keyranges) {
        ranges = keyranges[keyCode];

        ranges.forEach(function (range) {
          if (range in keyActions) {
            toRun = range;
          }
        });

        if (toRun) {
          return this.runKeyFunction(toRun, keyActions, keyCode);
        }
      }

      /**
       * Priority 4: Resolve an 'any' function
       */
      if ('any' in keyActions) {
        return this.runKeyFunction('any', keyActions, keyCode);
      }

      /** ... and if no action found, return true to allow bubbling **/
      return true;
    }
  },

  /**
   * Function that actually handles the calling of the action
   * handler. If a string is found where a function should be
   * it will attempt to delegate to a function with that name.
   * @function runKeyFunction
   * @param {String} fn - name of function to run
   * @param {Object} actions - list of all possible actions
   * @param {Number|Object} data - to be passed to the handler
   * @returns {Boolean} - Used to continue/halt propagation
   */
  runKeyFunction: function (fn, actions, data) {
    var toRun = actions[fn];
    var fnData = data || {};

    if (toRun) {
      if (typeof toRun === 'string') {
        return this[toRun].call(this, fnData);
      }

      return toRun.call(this, fnData);
    }
  }
});
