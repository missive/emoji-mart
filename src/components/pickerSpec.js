import React from 'react';
import TestUtils from 'react-dom/test-utils';
import Picker from './picker';

const {
  click
} = TestUtils.Simulate;

const {
  renderIntoDocument,
  scryRenderedComponentsWithType,
  findRenderedComponentWithType,
} = TestUtils;

describe('Picker', () => {
  let subject;

  it('works', () => {
    subject = render();
    expect(subject).toBeDefined();
  });

  describe('categories', () => {
    it('shows 10 by default', () => {
      subject = render();
      expect(subject.categories.length).toEqual(10);
    });

    it('will not show some based upon our filter', () => {
      subject = render({emojisToShowFilter: (unified) => false});
      expect(subject.categories.length).toEqual(2);
    });
  });

  function render(props = {}) {
    const defaultProps = {
    };
    return renderIntoDocument(
      <Picker {...defaultProps} {...props} />
    );
  }
});
