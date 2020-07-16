import React from 'react'
import { clone } from './helpers'

class Journeys extends React.Component {
  constructor (props) {
    super(props)
  }

  async showJourney (persona) {
    console.log(persona)
    const { data, highlightJourney } = this.props
    const formId = await data.getId()

    const response = await window.fetch(`${formId}/api/path`, {
      method: 'post',
      body: JSON.stringify(persona),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw Error(response.statusText)
    }

    const body = await response.json()
    console.log('paths', body)
    if (highlightJourney) {
      highlightJourney(body)
    }
  }

  render () {
    const { data } = this.props
    const { startPage } = data

    const toProcess = [data.findPage(startPage)]

    const relevantProperties = {}

    let page
    while (page = toProcess.shift()) {
      console.log(page)
      const {next} = page
      if (next) {
        for (const link of next) {
          if (link.condition) {
            const condition = data.findCondition(link.condition)
            const parts = condition.value.split(/\s+/g)
            const [ property ] = parts
            const availableInputs = data.inputsAccessibleAt(page.path)
            const input = availableInputs.find(i => i.propertyPath === property)
            const list = data.listFor(input)
            relevantProperties[property] = list.items.map(i => i.value)
          } else {
            toProcess.push(data.findPage(link.path))
          }
        }
      }
    }

    let personas = [{}]

    for (const property of Object.keys(relevantProperties)) {
      const values = relevantProperties[property]
      const newPersonas = []
      for (const value of values) {
        for (const persona of personas) {
          const newPersona = clone(persona)
          newPersona[property] = value
          newPersonas.push(newPersona)
        }
      }
      personas = newPersonas
    }

    console.log('personas', personas)

    // query paths from runner, because that's the best place to eval the journey at the mo


    /*

            const availableInputs = data.inputsAccessibleAt(nextPage.path)
            console.log('available input', availableInputs)

            const input = availableInputs.find(i => i.propertyPath === property)

            console.log('found input', input)
            if (input) {
              const list = data.listFor(input)
              console.log('found list', list)
              // list.items.value

            }

            console.log('TODO: generate permutations')
     */

    return (
      <div className='govuk-body'>
        <ul className='govuk-list'>
          {personas.map((persona, index) => (
            <li key={index}>
              <a onClick={this.showJourney(persona)}>Applicant {index + 1}</a>
            </li>
          ))}
        </ul>
      </div>
    )
  }
}

export default Journeys
