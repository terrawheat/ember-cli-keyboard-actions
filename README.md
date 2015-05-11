# Ember CLI Keyboard Actions

A small mixin to make intercepting keyboard events easier
to pick up and react to.

## Installation

`ember install:addon ember-cli-keyboard-actions`

## Changelog

###v0.3.0

  - Added ability to add actions for chords

###v0.2.1

  - Fixed issue where returning true/false from an action wouldn't
    alter the bubbling of the event.

###v0.2.0

  - Added a catch-all 'any' range that will fire on all keypresses.
  - The keyCode of the pressed key will now be passed to the handler.
  - Abstracted function resolving code out to a separate class.
  - Added code documentation

###v0.1.5

  - Run through ESLint for stricter linting checks.

###v0.1.4
  - Fixed a 'bug' causing keycode ranges to fail.

###v0.1.3

  - Added ability to use a string as the action to have it resolve
    a function from the view.
  - Added support for a-z and 0-9 as named keys.
  - Added support for 'key range' events.

## Importing

Simply import the mixin at the top of your component or view

`import KeyboardActionsMixin from 'ember-cli-keyboard-actions/mixins/keyboard-actions.js'`

and pass it to your component or view as you would any other mixin.

```javascript
export default Ember.Component.extend(
  KeyboardActionsMixin,
  {
  }
);
```

## Usage

Create an object on your component or view with one of the
following keys to respond to the correct event:

  - keyDownActions
  - keyUpActions
  - keyPressActions

Within this object, specific key events can be defined using
either the name of the key, or the word 'key' followed by
the correct keyCode.

```javascript
keyDownActions: {
  backspace: function () {
    console.log('Backspace pressed');
  },
  key27: function () {
    console.log('Escape pressed');
  }
}
```

Alternatively, setting a string as the action will attempt
to resolve the corresponding function from the view.

```javascript
doSomeStuff: function () {
  console.log('Did some stuff');
},
keyDownActions: {
  backspace: 'doSomeStuff'
},
```

Key names currently supported:
  - tab
  - backspace
  - enter
  - capsLock
  - escape
  - pageUp
  - pageDown
  - end
  - home
  - left
  - up
  - right
  - down
  - insert
  - delete
  - space
  - a - z
  - 0 - 9

Actions can also be hooked in to a number of 'range' events, for
instance declaring a keyDownAction 'alphanumeric' will trigger
whenever an alphanumeric key is pressed.

Key ranges currently supported:
  - alphanumeric (a-z, 0-9)
  - alpha (a-z)
  - numeric (0-9)
  - any (ALL keys)

## Chords / Shortcuts

A special set of actions can be defined under the key `keyChordActions`
that can be used to assign actions to keys pressed while CTRL, ALT or
SHIFT are being held down.

```javascript
  keyChordActions: {
    'ctrl': {
      'a': function () {
        console.log('Ctrl + A pressed');
      }
    },
    'alt': {
      'a': function () {
        console.log('Alt + A pressed');
      }
    },
    'shift': {
      'a': function () {
        console.log('Shift + A pressed');
      }
    },
    'ctrl.alt': {
      'a': function () {
        console.log('Ctrl, Alt + A pressed');
      }
    },
    'ctrl.alt.shift': {
      'a': function () {
        console.log('Ctrl, Shift, Alt + A pressed');
      }
    }
  },
```

## Full Example

```javascript
import Ember from 'ember';
import KeyboardActionMixin from 'ember-cli-keyboard-actions/mixins/keyboard-actions.js';

export default Ember.Component.extend(
  KeyboardActionMixin,
  {
    doSomeStuff: function () {
      console.log('Did some stuff');
    },
    recogniseAlphaEvent: function () {
      console.log('Alpha event');
    },
    keyDownActions: {
      backspace: 'doSomeStuff',
      alpha: 'recogniseAlphaEvent',
      numeric: function () {
        console.log('Numeric event');
      }
    },
    keyUpActions: {
      escape: function () {
        console.log('Tab pressed on keyUp');
      }
    },
    keyPressActions: {
      key101: function () {
        console.log('Left pressed on keyPress');
      }
    }
  }
);
```

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
