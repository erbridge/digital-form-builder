import React from 'react'
import { shallow } from 'enzyme'
import * as Code from '@hapi/code'
import * as Lab from '@hapi/lab'
import { RenderInPortal } from '../client/components/render-in-portal'
import { Data } from '@xgovformbuilder/model'
import sinon from 'sinon'

const { expect } = Code
const lab = Lab.script()
exports.lab = lab
const { before, suite, test } = lab

suite.only('Component RenderInPortal', () => {
  test('Should display form with component types in alphabetical order', () => {
    const wrapper = shallow(<RenderInPortal><p>Test</p></RenderInPortal>);
  })
})
