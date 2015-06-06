/*eslint no-new:0*/
import Ember from 'ember';
import { describe, it } from 'mocha';
import assert from 'chai';
import FunctionResolver from 'ember-cli-keyboard-actions/function-resolver';
var testActions = {
  keyDownActions: {
    'key37': function () {
      return 'key37';
    },
    'backspace': function () {
      return 'backspace';
    },
    'alphanumeric': function () {
      return 'alphanumeric';
    },
    'any': function () {
      return 'any';
    }
  },
  keyUpActions: {
    'key37': function () {
      return 'key37';
    },
    'backspace': function () {
      return 'backspace';
    }
  },
  keyPressActions: {
    'key37': function () {
      return 'key37';
    },
    'backspace': function () {
      return 'backspace';
    }
  }
};

describe('FunctionResolver', function () {
  it('should be able to resolve a key action based on keyX', function () {
    var keyDown = new FunctionResolver(testActions.keyDownActions);
    var keyUp = new FunctionResolver(testActions.keyUpActions);
    var keyPress = new FunctionResolver(testActions.keyPressActions);

    Ember.run.next(function () {
      assert.equal(keyDown.resolveKeyCode(37)(), 'key37');
      assert.equal(keyUp.resolveKeyCode(37)(), 'key37');
      assert.equal(keyPress.resolveKeyCode(37)(), 'key37');
    });
  });

  it('should be able to resolve a key action to a key name', function () {
    var keyDown = new FunctionResolver(testActions.keyDownActions);
    var keyUp = new FunctionResolver(testActions.keyUpActions);
    var keyPress = new FunctionResolver(testActions.keyPressActions);

    Ember.run.next(function () {
      assert.equal(keyDown.resolvePrettyName(8)(), 'backspace');
      assert.equal(keyUp.resolvePrettyName(8)(), 'backspace');
      assert.equal(keyPress.resolvePrettyName(8)(), 'backspace');
    });
  });

  it('should be able to resolve a key action from a key range', function () {
    var keyDown = new FunctionResolver(testActions.keyDownActions);

    Ember.run.next(function () {
      assert.equal(keyDown.resolveKeyRange(85)(), 'alphanumeric');
    });
  });

  it('should be able to resolve a catch all', function () {
    var keyDown = new FunctionResolver(testActions.keyDownActions);

    Ember.run.next(function () {
      assert.equal(keyDown.resolveCatchAll()(), 'any');
    });
  });
});
