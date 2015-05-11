/**
 * @module ember-cli-keyboard-actions/function-resolver
 * @author Matt Wheatley <terrawheat@gmail.com>
 * @license MIT
 */
import keymap from 'ember-cli-keyboard-actions/keycode-map';
import keyranges from 'ember-cli-keyboard-actions/keycode-ranges';

/**
 * @constructor FunctionResolver
 * @param {Object} actions - object of functions
 * @param {Object} [view] - object representing view
 */
function FunctionResolver(actions, view) {
  this.resolvers = ['Chords', 'KeyCode', 'PrettyName', 'KeyRange', 'CatchAll'];
  this.keyCodePrefix = 'key';
  this.view = view || {};
  this.actions = actions;
  this.chords = view.chordState;
}

/**
 * Main function that attempts to resolve the
 * action that should be run in response to
 * the event fired.
 * @function resolve
 * @param {String} keyCode - keyCode to attempt to resolve
 * @returns {Function|Boolean} - Resolved function, or false
 */
FunctionResolver.prototype.resolve = function resolve(keyCode, ignoreChords) {
  var i = 0;
  var resolver;
  var fn = false;

  for (i = 0; i < this.resolvers.length; i++) {
    if (ignoreChords && this.resolvers[i] === 'Chords') {
      continue;
    }

    resolver = 'resolve' + this.resolvers[i];
    fn = this[resolver](keyCode);

    if (fn === false) {
      continue;
    }

    if (typeof fn === 'string') {
      return this.resolveFromView(fn);
    }

    return fn;
  }
};

FunctionResolver.prototype.resolveKeyCode = function resolveKC(keyCode) {
  var kc = this.keyCodePrefix + keyCode;

  if (kc in this.actions) {
    return this.actions[kc];
  }

  return false;
};

FunctionResolver.prototype.resolveChords = function resolveChords(keyCode) {
  var that = this;
  var currentChords = Object.keys(this.chords).filter(function (chord) {
    return that.chords[chord];
  });
  var currentKey = currentChords.join('.');

  if (currentChords.length <= 0) {
    return false;
  }

  if (currentKey in this.actions) {
    this.actions = this.actions[currentKey];
    return this.resolve(keyCode, false);
  }

  return false;
};

FunctionResolver.prototype.resolvePrettyName = function resolvePN(keyCode) {
  var prettyName = keymap[keyCode];

  if (prettyName in this.actions) {
    return this.actions[prettyName];
  }

  return false;
};

FunctionResolver.prototype.resolveKeyRange = function resolveKR(keyCode) {
  var ranges;
  var that = this;
  var toRun = false;

  if (keyCode in keyranges) {
    ranges = keyranges[keyCode];

    ranges.forEach(function (range) {
      if (range in that.actions) {
        toRun = range;
      }
    });
  }

  if (toRun) {
    return this.actions[toRun];
  }

  return false;
};

FunctionResolver.prototype.resolveCatchAll = function resolveCA() {
  if ('any' in this.actions) {
    return this.actions.any;
  }

  return false;
};

FunctionResolver.prototype.resolveFromView = function resolveFV(fnName) {
  if (fnName in this.view) {
    return this.view[fnName];
  }
};

export default FunctionResolver;
