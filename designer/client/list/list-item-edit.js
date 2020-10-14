import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { withI18n } from './../i18n'
import { Input } from '@govuk-jsx/input'
import { Textarea } from '@govuk-jsx/textarea'
import { Label } from '@govuk-jsx/label'
import { Hint } from '@govuk-jsx/hint'
import { RenderInPortal } from '../components/render-in-portal'
import Flyout from '../flyout'
import ComponentCreate from '../component-create'

export function ListItemEdit (props) {
  const [title, setTitle] = useState(props.title)
  const [helpText, setHelpText] = useState('')
  const [value, setValue] = useState('')
  const [condition, setCondition] = useState('')
  const [isEditingSubComponent, setIsEditingSubComponent] = useState(false)
  const { i18n, conditions } = props

  const handleCreateSubComponent = (e) => {
    e.preventDefault()
    setIsEditingSubComponent(true)
  }
  return (
    <div>
      <form>
        <Input label={{
          className: 'govuk-label--s',
          children: [i18n('list.item.title')]
        }}/>
        <Textarea
          label={{ children: [i18n('list.item.titleHint')] }}
        />
        <Input label={{ children: [i18n('list.item.title')] }}
          hint={{ children: [i18n('list.item.valueHint')] }} />

        <Label>{i18n('list.item.conditions')}</Label>
        <Hint>{i18n('list.item.conditionsHint')}</Hint>
        <select className='govuk-select' id='condition' name='options.condition' value={condition}>
          <option value='' />
          {conditions?.map((condition) => (<option key={condition.name} value={condition.name}>{condition.name}</option>))}
        </select>
      </form>
      <hr/>
      <p className="govuk-body govuk-!-font-weight-bold govuk-!-margin-0">{i18n('list.item.subComponent')}</p>
      <Hint>{i18n('list.item.subComponentHint')}</Hint>
      <a href="#" className="govuk-link" onClick={handleCreateSubComponent}>{i18n('list.item.createSubComponent')}</a>
      {isEditingSubComponent &&
      <RenderInPortal>
        <Flyout width={'xlarge'} show={isEditingSubComponent}>
          <ComponentCreate/>
        </Flyout>
      </RenderInPortal>
      }
    </div>

  )
}

export default withI18n(ListItemEdit)
