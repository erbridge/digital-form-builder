import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import ListEdit from './list-edit'
import { RenderInPortal } from '../components/render-in-portal'
import Flyout from './../flyout'
import { withI18n } from './../i18n'
import { nanoid } from 'nanoid'

export function ListsEdit (props) {
  const { i18n, data } = props
  const [selectedList, setSelectedList] = useState()
  const [isEditingList, setIsEditingList] = useState(false)
  const { lists } = data

  const handleListClick = (e, list) => {
    e.preventDefault()
    setIsEditingList(true)
    if (list) {
      setSelectedList(list)
    }
  }

  const closeFlyout = (selectedList) => {
    if (selectedList) {
      setSelectedList(selectedList)
    }
    setIsEditingList(false)
  }

  return (
    <div className='govuk-body'>
      <ul className='govuk-list'>
        {lists.map((list) => (
          <li key={list.name}>
            <a href='#' onClick={e => handleListClick(e, list)}>
              {list.title}
            </a>
          </li>
        ))}
        <li>
          <hr />
          <a href='#' onClick={handleListClick}>{i18n('list.newTitle')}</a>
        </li>
      </ul>
      {isEditingList &&
      <RenderInPortal>
        <Flyout title={selectedList?.name ? i18n('list.editingTitle', { title: selectedList.title }) : i18n('list.newTitle')}
          onHide={closeFlyout} width={'xlarge'} show={isEditingList}>
          <ListEdit
            data={data}
          />
        </Flyout>
      </RenderInPortal>
      }
    </div>
  )
}

export default withI18n(ListsEdit)
