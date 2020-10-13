import React from 'react'
import ListItems from './list-items'
import { clone } from '@xgovformbuilder/model'
import { withI18n } from '../i18n'
import { Hint } from '@xgovformbuilder/govuk-react-jsx'

class ListEdit extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      type: props.list?.type,
      list: props.list || {}
    }
  }

  onSubmit = async (e) => {
    e.preventDefault()
    const form = e.target
    const formData = new window.FormData(form)
    const newName = formData.get('name').trim()
    const newTitle = formData.get('title').trim()
    const newType = formData.get('type')
    const { data } = this.props
    const { list } = this.state

    const copy = clone(data)
    const nameChanged = newName !== list.name
    let copyList = copy.lists[data.lists.indexOf(list)]

    if (!copyList) {
      copyList = {}
      copy.lists.push(copyList)
    }

    if (nameChanged) {
      copyList.name = newName

      // Update any references to the list
      copy.pages.forEach(p => {
        p.components.forEach(c => {
          if (c.values?.type === 'listRef' && c.values.list === list.name) {
            c.values.list = newName
          }
        })
      })
    }

    copyList.title = newTitle
    copyList.type = newType

    // Items
    const texts = formData.getAll('text').map(t => t.trim())
    const values = formData.getAll('value').map(t => t.trim())
    const descriptions = formData.getAll('description').map(t => t.trim())
    const conditions = formData.getAll('condition').map(t => t.trim())

    copyList.items = texts.map((t, index) => ({
      text: t,
      value: values[index],
      description: descriptions[index],
      condition: conditions[index]
    }))

    console.log(copy)
    data.save(copy)
      .then(updatedData => {
        console.log('updatedData', updatedData)
        this.props.onEdit({ data: copy })
      })
  }

  onClickDelete = e => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, list } = this.props
    const copy = clone(data)

    const affectedComponents = copy.pages.flatMap(p => p.components)
      .filter(component => component.values?.type === 'listRef' && component.values.list === list.name)

    // Flag anything we are breaking to the user
    let aborted = false
    if (affectedComponents.length > 0) {
      aborted = !window.confirm(`The following components will no longer function correctly:\n\n
      ${affectedComponents.map(it => it.type + ': ' + it.title + '\n\n')}
      Are you sure you want to proceed?`)
    }
    if (!aborted) {
      // Remove the list
      copy.lists.splice(data.lists.indexOf(list), 1)
      // Update any references to the list
      affectedComponents.forEach(c => {
        delete c.values
      })
      data.save(copy)
        .then(data => {
          console.log(data)
          this.props.onEdit({ data })
        })
        .catch(err => {
          console.error(err)
        })
    }
  }

  onBlurName = e => {
    const input = e.target
    const { data, list } = this.props
    const newName = input.value.trim()

    // Validate it is unique
    if (data.lists.find(l => l !== list && l.name === newName)) {
      input.setCustomValidity(`List '${newName}' already exists`)
    } else {
      input.setCustomValidity('')
    }
  }

  render () {
    const state = this.state
    const { list } = this.state
    const { data, id, i18n } = this.props
    const { conditions } = data
    return (
      <form onSubmit={e => this.onSubmit(e)} autoComplete='off'>
        <a
          className='govuk-back-link' href='#'
          onClick={e => this.props.onCancel(e)}
        >Back
        </a>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='list-title'>{i18n('list.title')}</label>
          <input
            className='govuk-input govuk-input--width-20' id='list-title' name='title'
            type='text' defaultValue={list.title} required
          />
        </div>

        <ListItems items={list.items} type={state.type} conditions={conditions} />

        <button className='govuk-button' type='submit'>Save</button>{' '}
        <a href="#" className='govuk-link' onClick={this.onClickDelete}>{i18n('delete')}</a>
      </form>
    )
  }
}

export default withI18n(ListEdit)
