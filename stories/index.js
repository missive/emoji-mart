import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs';

import { Picker, Emoji } from '../src';
import '../css/emoji-mart.css';

storiesOf('Picker', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Picker
      onClick={action('clicked')}
      set={text('Emoji pack', 'twitter')}
      emojiSize={number('Emoji size', 24)}
      perLine={number('Per line', 9)}
      native={boolean('Unicode', false)}
      title={text('Idle text', 'Your Title Here')}
      emoji={text('Idle emoji', 'department_store')}
      skin={number('Skin tone', 1)}
      color={text('Highlight color', '#ae65c5')}
    />
  ));

storiesOf('Emoji', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Emoji
      set={text('Emoji pack', 'twitter')}
      emoji={text('Emoji', '+1')}
      size={number('Emoji size', 64)}
      skin={number('Skin tone', 1)}
      native={boolean('Unicode', false)}
    />
  ));
