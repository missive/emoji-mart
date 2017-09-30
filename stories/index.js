import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, number, select, color } from '@storybook/addon-knobs';

import { Picker, Emoji, emojiIndex } from '../dist';
import '../css/emoji-mart.css';

const SETS = ['apple', 'google', 'twitter', 'emojione', 'messenger', 'facebook']
const CUSTOM_EMOJIS = [
  {
    name: 'Octocat',
    short_names: ['octocat'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7'
  },
  {
    name: 'Squirrel',
    short_names: ['shipit', 'squirrel'],
    keywords: ['github'],
    imageUrl: 'https://assets-cdn.github.com/images/icons/emoji/shipit.png?v7'
  }
]

storiesOf('Picker', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Picker
      onClick={action('clicked')}
      native={boolean('Unicode', true)}
      set={select('Emoji pack', SETS, SETS[0])}
      emojiSize={number('Emoji size', 24)}
      perLine={number('Per line', 9)}
      title={text('Idle text', 'Your Title Here')}
      emoji={text('Idle emoji', 'department_store')}
      skin={number('Skin tone', 1)}
      color={color('Highlight color', '#ae65c5')}
      showPreview={boolean('Show preview', true)}
      custom={CUSTOM_EMOJIS}
    />
  ));

storiesOf('Emoji', module)
  .addDecorator(withKnobs)
  .add('default', () => (
    <Emoji
      native={boolean('Unicode', true)}
      set={select('Emoji pack', SETS, SETS[0])}
      emoji={text('Emoji', '+1')}
      size={number('Emoji size', 64)}
      skin={number('Skin tone', 1)}
    />
  ));

storiesOf('Headless Search', module)
  .addDecorator(withKnobs)
  .add('default', () => {
    let results = emojiIndex.search(text('Search', 'christmas'), { custom: CUSTOM_EMOJIS })
    if (!results) { return null }

    return <div>
      {results.map((emoji) => {
        return <span key={emoji.id} style={{ marginLeft: '1.4em' }}>
          <Emoji native={true} emoji={emoji} size={48} />
        </span>
      })}
    </div>
  });
