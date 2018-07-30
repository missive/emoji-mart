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
      onSelect={action('selected')}
      onSkinChange={action('skin changed')}
      native={boolean('Unicode', true)}
      set={select('Emoji pack', SETS, SETS[0])}
      emojiSize={number('Emoji size', 24)}
      perLine={number('Per line', 9)}
      title={text('Idle text', 'Your Title Here')}
      emoji={text('Idle emoji', 'department_store')}
      notFoundEmoji={text('Not found emoji', 'sleuth_or_spy')}
      defaultSkin={number('Default skin tone', 1)}
      color={color('Highlight color', '#ae65c5')}
      showPreview={boolean('Show preview', true)}
      showSkinTones={boolean('Show skin tones', true)}
      custom={CUSTOM_EMOJIS}
    />))
    .add('with a custom not found image', () => (
      <Picker
        notFound={
          () => <img src='https://assets-cdn.github.com/images/icons/emoji/octocat.png?v7' />
        }
      />))
      .add('with a custom not found SVG', () => (
        <Picker
          notFound={
            () => <svg aria-labelledby="simpleicons-jira-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title id="simpleicons-jira-icon">Jira icon</title><path d="M23.323 11.33L13.001 1 12 0 4.225 7.775.67 11.33a.96.96 0 0 0 0 1.347l7.103 7.103L12 24l7.771-7.771.121-.121 3.431-3.431a.945.945 0 0 0 0-1.347zM12 15.551L8.449 12 12 8.453 15.548 12 12 15.551z"/></svg>
          }
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
      html={boolean('HTML', false)}
      fallback={(emoji) => {
        return `:${emoji.short_names[0]}:`
      }}
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
