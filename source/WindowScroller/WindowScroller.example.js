/** @flow */
import cn from 'classnames'
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import WindowScroller from './WindowScroller'
import List from '../List'
import AutoSizer from '../AutoSizer'
import shallowCompare from 'react-addons-shallow-compare'
import styles from './WindowScroller.example.css'

export default class AutoSizerExample extends Component {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  }

  constructor (props) {
    super(props)

    this.state = {
      showHeaderText: true
    }

    this._hideHeader = this._hideHeader.bind(this)
    this._rowRenderer = this._rowRenderer.bind(this)
  }

  render () {
    const { list } = this.context
    const { showHeaderText } = this.state

    return (
      <ContentBox>
        <ContentBoxHeader
          text='WindowScroller'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/WindowScroller/WindowScroller.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/WindowScroller.md'
        />

        {showHeaderText && (
          <ContentBoxParagraph>
            This component decorates <code>List</code>, <code>Table</code>, or any other component
            and manages the window scroll to scroll through the list
          </ContentBoxParagraph>
        )}

        {showHeaderText && (
          <ContentBoxParagraph>
            <button onClick={this._hideHeader}>
              Hide header text
            </button>
          </ContentBoxParagraph>
        )}

        <div className={styles.WindowScrollerWrapper}>
          <WindowScroller
            ref={(ref) => {
              this._windowScroller = ref
            }}
          >
            {({ height, isScrolling, scrollTop }) => (
              <AutoSizer disableHeight>
                {({ width }) => (
                  <List
                    autoHeight
                    className={styles.List}
                    height={height}
                    overscanRowCount={2}
                    rowCount={list.size}
                    rowHeight={30}
                    rowRenderer={({ index, isVisible, key, style }) => this._rowRenderer({ index, isScrolling, isVisible, key, style })}
                    scrollTop={scrollTop}
                    width={width}
                  />
                )}
              </AutoSizer>
            )}
          </WindowScroller>
        </div>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _hideHeader () {
    const { showHeaderText } = this.state

    this.setState({
      showHeaderText: !showHeaderText
    }, () => {
      this._windowScroller.updatePosition()
    })
  }

  _rowRenderer ({ index, isScrolling, isVisible, key, style }) {
    const { list } = this.context
    const row = list.get(index)
    const className = cn(styles.row, {
      [styles.rowScrolling]: isScrolling,
      isVisible: isVisible
    })

    return (
      <div
        key={key}
        className={className}
        style={style}
      >
        {row.name}
      </div>
    )
  }
}
