import React from 'react'
import PropTypes from 'prop-types'
import { NimbleEmoji } from '.'

export default class NotFound extends React.PureComponent {
  render() {
    const { data, emojiProps, i18n, notFound } = this.props

    const component = (notFound && notFound()) || (
      <div className="emoji-mart-no-results">
        {NimbleEmoji({
          data: data,
          ...emojiProps,
          size: 38,
          emoji: 'sleuth_or_spy',
          onOver: null,
          onLeave: null,
          onClick: null,
        })}
        <div className="emoji-mart-no-results-label">{i18n.notfound}</div>
      </div>
    )

    return component
  }
}

NotFound.propTypes = {
  notFound: PropTypes.func.isRequired,
  emojiProps: PropTypes.object.isRequired,
}

NotFound.defaultProps = {
  notFound: () => {},
}
