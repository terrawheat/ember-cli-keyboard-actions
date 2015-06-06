/**
 * @module ember-cli-keyboard-actions/mixins/keyboard-actions
 * @requires ember
 * @requires ember-cli-keyboard-actions/function-resolver
 * @author Matt Wheatley <terrawheat@gmail.com>
 * @license MIT
 */
import Ember from 'ember';
import FunctionResolver from '../function-resolver';

export default Ember.Mixin.create({
  /**
   * Monitors and manages the current state of
   * modifier keys currently held by the user.
   * @property chordState
   * @property chordState.ctrl Maps to Control/Command
   * @property chordState.alt Maps to Alt
   * @property chordState.shift Maps to shift key
   */
  chordState: {
    ctrl: false,
    alt: false,
    shift: false
  },

  /**
   * Returns a boolean indicating whether we are in
   * any chorded state, to ascertain wheter the
   * chordActions should take priority.
   * @function isChordPressed
   * @returns {Boolean}
   */
  isChordPressed: Ember.computed('chordState.ctrl', 'chordState.alt', 'chordState.shift', function () {
    var state = this.get('chordState');
    return Object.keys(state).some(function (chord) {
      return state[chord];
    });
  }),
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
        if ('refreshChordState' in view) {
          view.refreshChordState.apply(view, [e]);
        }
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
        if ('refreshChordState' in view) {
          view.refreshChordState.apply(view, [e]);
        }
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
   * Each time a key is pressed, the internal representation
   * of the chord map is updated.
   * @function refreshChordState
   * @property {KeyboardEvent} e - Currently handled keyboard event
   */
  refreshChordState: function (event) {
    this.setProperties({
      'chordState.ctrl': event.ctrlKey,
      'chordState.alt': event.altKey,
      'chordState.shift': event.shiftKey
    });
  },

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
    var keyActions;

    //Make sure chord actions only get run once
    if (this.get('isChordPressed') === true && action === 'keyUp') {
      keyActions = this.get('keyChordActions');
    } else {
      keyActions = this.get(action + 'Actions');
    }

    /**
     * An instance of FunctionResolver that will be used to
     * decide which function to run.
     * @var functionResolver
     */
    var functionResolver = new FunctionResolver(keyActions, this);

    /**
     * The function that has been resolved
     * @var fn {Function}
     */
    var fn;

    /** First check to see if we actually have any actions to run **/
    if (keyActions) {
      fn = functionResolver.resolve(keyCode);

      if (fn) {
        return this.runKeyFunction(fn, keyCode);
      }
      /** ... and if no action found, return true to allow bubbling **/
      return true;
    }
  },

  /**
   * Function that actually handles the calling of the action
   * handler.
   * @function runKeyFunction
   * @param {Function} fn - function to run
   * @param {Number|Object} data - to be passed to the handler
   * @returns {Boolean} - Used to continue/halt propagation
   */
  runKeyFunction: function (fn, data) {
    return fn.call(this, data);
  }
});
