import React from 'react'
import { clone, toUrl } from './helpers'

class PageEdit extends React.Component {
  state = {}

  onSubmit = e => {
    e.preventDefault()
    const form = e.target
    const formData = new window.FormData(form)
    const title = formData.get('title').trim()
    const isLooping = formData.get('is-looping')
    const newPath = toUrl(title)
    const section = formData.get('section').trim()
    const pageType = formData.get('page-type').trim()
    const { data, page } = this.props

    const copy = clone(data)
    const pathChanged = newPath !== page.path
    const pageIndex = data.pages.indexOf(page)
    const copyPage = copy.pages[pageIndex]

    if (pathChanged) {
      // `path` has changed - validate it is unique
      if (data.findPage(newPath)) {
        form.elements.path.setCustomValidity(`Path '${newPath}' already exists`)
        form.reportValidity()
        return
      }

      copyPage.path = newPath

      if (pageIndex === 0) {
        copy.startPage = newPath
      }
    }

    copyPage.title = title
    copyPage.isLooping = isLooping

    if (section) {
      copyPage.section = section
    } else {
      delete copyPage.section
    }

    if (pageType) {
      copyPage.controller = pageType
    } else {
      delete copyPage.controller
    }

    copy.pages[pageIndex] = copyPage
    data.save(copy)
      .then(data => {
        console.log(data)
        this.props.onEdit({ data })
      })
      .catch(err => {
        console.error(err)
      })
  }

  onClickDelete = e => {
    e.preventDefault()

    if (!window.confirm('Confirm delete')) {
      return
    }

    const { data, page } = this.props
    const copy = clone(data)

    const copyPageIdx = copy.pages.findIndex(p => p.path === page.path)

    // Remove all links to the page
    copy.pages.forEach((p, index) => {
      if (index !== copyPageIdx && Array.isArray(p.next)) {
        for (var i = p.next.length - 1; i >= 0; i--) {
          const next = p.next[i]
          if (next.path === page.path) {
            p.next.splice(i, 1)
          }
        }
      }
    })

    // Remove the page itself
    copy.pages.splice(copyPageIdx, 1)

    data.save(copy)
      .then(data => {
        console.log(data)
        // this.props.onEdit({ data })
      })
      .catch(err => {
        console.error(err)
      })
  }

  onClickDuplicate = e => {
    e.preventDefault()

    const { data, page } = this.props
    let copy = clone(data)
    let duplicatedPage = clone(page)
    let id = Math.floor(100 + Math.random() * 900)
    duplicatedPage.path = `${duplicatedPage.path}-${id}`
    duplicatedPage.components.forEach(component => {
      component.name = `${duplicatedPage.path}-${id}`
    })
    copy.pages.push(duplicatedPage)

    data.save(copy)
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  render () {
    const { data, page } = this.props
    const { sections } = data

    return (
      <form onSubmit={this.onSubmit} autoComplete='off'>
        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='page-type'>Page Type</label>
          <select className='govuk-select' id='page-type' name='page-type' defaultValue={page.controller || ''}>
            <option value=''>Question Page</option>
            <option value='./pages/start.js'>Start Page</option>
            <option value='./pages/summary.js'>Summary Page</option>
          </select>
        </div>

        <div className='govuk-checkboxes govuk-form-group'>
          <div className='govuk-checkboxes__item'>
            <input className='govuk-checkboxes__input' id='page-is-looping'
                name='is-looping' type='checkbox' value defaultChecked={page.isLooping} onChange={this.onChangeLooping}
              />
              <label className='govuk-label govuk-checkboxes__label'
                htmlFor='is-looping'>Is Looping</label>
          </div>
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='page-title'>Title</label>
          <input className='govuk-input' id='page-title' name='title' type='text' defaultValue={page.title}
            aria-describedby='page-title-hint' required />
        </div>

        <div className='govuk-form-group'>
          <label className='govuk-label govuk-label--s' htmlFor='page-section'>Section (optional)</label>
          <select className='govuk-select' id='page-section' name='section' defaultValue={page.section}>
            <option />
            {sections.map(section => (<option key={section.name} value={section.name}>{section.title}</option>))}
          </select>
        </div>

        <button className='govuk-button' type='submit'>Save</button>{' '}
        <button className='govuk-button' type='button' onClick={this.onClickDuplicate}>Duplicate</button>{' '}
        <button className='govuk-button' type='button' onClick={this.onClickDelete}>Delete</button>
      </form>
    )
  }
}

export default PageEdit
