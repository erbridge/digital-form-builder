import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { withI18n } from './../i18n'
import { Input } from '@govuk-jsx/input'
import { Textarea } from '@govuk-jsx/textarea'
import { Label } from '@govuk-jsx/label'
import { Hint } from '@govuk-jsx/hint'
import { RenderInPortal } from '../components/render-in-portal'
import Flyout from '../flyout'
import ComponentCreate from '../component-create'
import { ComponentTypes } from '@xgovformbuilder/model'
import { DataContext } from '../context'

export function ListItemEdit (props) {
  const { data, save } = useContext(DataContext)
  const [title, setTitle] = useState(props.selectedItem?.text ?? '')
  const [helpText, setHelpText] = useState(props.selectedItem?.description ?? '')
  const [value, setValue] = useState(props.selectedItem?.value ?? '')
  const [condition, setCondition] = useState(props.selectedItem?.condition ?? '')
  const [isEditingSubComponent, setIsEditingSubComponent] = useState(false)
  const { i18n, list: selectedList } = props
  const editingItemAtIndex = selectedList.items?.findIndex(item => item.text === title)
  const { conditions } = data
  const allowedTypes = ComponentTypes.filter(type => !['RadiosField', 'CheckboxesField', 'SelectField', 'AutocompleteField', 'YesNoField'].includes(type.name))

  const handleCreateSubComponent = (e) => {
    e.preventDefault()
    setIsEditingSubComponent(true)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const listItem = {
      text: title, description: helpText, value, condition
    }

    if (editingItemAtIndex === -1) {
      const items = data.lists.find(list => list.name === selectedList.name).items
      data.lists.find(list => list.name === selectedList.name).items = [...items, listItem]
    } else {
      data.lists.find(list => list.name === selectedList.name).items[editingItemAtIndex] = listItem
    }

    await save(data)
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Input label={{
          className: 'govuk-label--s',
          children: [i18n('list.item.title')]
        }}
        value={title}
        onChange={e => setTitle(e.target.value)}/>
        <Textarea
          label={{ children: [i18n('list.item.titleHint')] }}
          value={helpText}
          onChange={e => setHelpText(e.target.value)}
        />
        <Input label={{ children: [i18n('list.item.value')] }}
          hint={{ children: [i18n('list.item.valueHint')] }}
          value={value}
          onChange={e => setValue(e.target.value)}/>

        <Label>{i18n('list.item.conditions')}</Label>
        <Hint>{i18n('list.item.conditionsHint')}</Hint>
        <select className='govuk-select' id='condition' name='options.condition' value={condition} onChange={event => setCondition(event.target.value)}>
          <option value='' />
          {conditions?.map((condition) => (<option key={condition.name} value={condition}>{condition.name}</option>))}
        </select>
        <hr/>
        <p className="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">{i18n('list.item.subComponent')}</p>
        <Hint>{i18n('list.item.subComponentHint')}</Hint>
        <a href="#" className="govuk-link" onClick={handleCreateSubComponent}>{i18n('list.item.createSubComponent')}</a>
        {isEditingSubComponent &&
        <RenderInPortal>
          <Flyout width={'xlarge'} show={isEditingSubComponent}>
            <ComponentCreate allowedTypes={allowedTypes}/>
          </Flyout>
        </RenderInPortal>
        }
        <div className={'govuk-form-group'}>
          <button className='govuk-button' type='submit'>Save</button>
        </div>
      </form>

    </div>

  )
}

export default withI18n(ListItemEdit)
