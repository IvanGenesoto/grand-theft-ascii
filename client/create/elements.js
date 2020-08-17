import {createElement} from '..'

export const createElements = function (component) {

  const {tag, sections, variations} = component

  tag && createElement.call(this, component)
  sections && sections.map(createElements.bind(this))
  variations && variations.map(createElements.bind(this))
}
