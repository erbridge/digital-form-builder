import React from 'react'
import ListEdit from './list-edit'
import { RenderInPortal } from './components/render-in-portal'
import Flyout from './flyout'
import { withI18n } from './i18n'
import { nanoid } from 'nanoid'

class ListsEdit extends React.Component {
  state = {}

  onClickList = (e, list) => {
    e.preventDefault()
    this.setState({
      list,
      showAddList: true
    })
  }

  onClickAddList = async e => {
    e.preventDefault()
    this.setState({
      id: nanoid(6),
      showAddList: true
    })
  }

  closeFlyout = (list) => {
    this.setState({ showAddList: false })
  }

  render () {
    const { data, i18n } = this.props
    const { lists } = data
    const { list, id, showAddList } = this.state

    return (
      <div className='govuk-body'>
        <ul className='govuk-list'>
          {lists.map((list, index) => (
            <li key={list.name}>
              <a href='#' onClick={e => this.onClickList(e, list)}>
                {list.title}
              </a>
            </li>
          ))}
          <li>
            <hr />
            <a href='#' onClick={this.onClickAddList}>Add list</a>
          </li>
        </ul>
        {showAddList &&
        <RenderInPortal>
          <Flyout title={list?.name ? i18n('list.editingTitle', { title: list.title }) : i18n('list.newTitle')}
            onHide={this.closeFlyout} show={showAddList}>
            <ListEdit
              data={data} id={id}
              onEdit={() => this.setState({ showAddList: false })}
              onCancel={() => this.setState({ showAddList: false })}
            />
          </Flyout>
        </RenderInPortal>
        }
      </div>
    )
  }
}

export default withI18n(ListsEdit)
