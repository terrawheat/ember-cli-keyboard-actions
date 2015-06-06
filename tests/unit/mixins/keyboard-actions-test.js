/* jshint expr:true */
import { assert } from 'chai';
import {
  describe,
  it
} from 'mocha';
import Ember from 'ember';
import KeyboardActionsMixin from 'ember-cli-keyboard-actions/mixins/keyboard-actions';

describe('KeyboardActionsMixin', function() {
  it('should exist', function () {
    assert.ok(KeyboardActionsMixin);
  });

  it('should attach in to the object\'s event manager', function () {
    var Test = Ember.View.extend(KeyboardActionsMixin, {});
    var sample = Test.create({});

    assert.ok(sample.eventManager.keyUp);
    assert.ok(sample.eventManager.keyPress);
    assert.ok(sample.eventManager.keyDown);
    assert.isFunction(sample.eventManager.keyUp);
    assert.isFunction(sample.eventManager.keyPress);
    assert.isFunction(sample.eventManager.keyDown);
  });
});
