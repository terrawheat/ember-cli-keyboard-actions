# Ember CLI Keyboard Actions

A small mixin to make intercepting keyboard events easier
to pick up and react to.

## Installation

`ember install:addon ember-cli-keyboard-actions`

## Importing

Simply import the mixin at the top of your component or view

`import KeyboardActionsMixin from 'ember-cli-keyboard-actions/mixins/keyboard-actions.js'`

and pass it to your component or view as you would any other mixin.

```
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
  - keyUpActions *(NYI)*
  - keyPressActions *(NYI)*

Within this object, specific key events can be defined using
either the name of the key, or the word 'key' followed by
the correct keyCode.

```
keyDownActions: {
  backspace: function () {
    console.log('Backspace pressed');
  },
  key27: function () {
    console.log('Escape pressed');
  }
}
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

## Full Example

```
import Ember from 'ember';
import KeyboardActionMixin from 'ember-cli-keyboard-actions/mixins/keyboard-actions.js';

export default Ember.Component.extend(
  KeyboardActionMixin,
  {
    keyDownActions: {
      backspace: function () {
        console.log('Backspace pressed');
      },
      key27: function () {
        console.log('Escape pressed');
      }
    }
  }
);
```

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
