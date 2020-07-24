import {renderElement as r} from '.'

export const renderUnsupported = () => {

  const $unsupported = document.getElementById('unsupported')

  $unsupported.append(
    r('div', {class: 'center medium'}, [
      r('p', null, 'Anarch City can only be experienced on the Chrome browser.'),
      r('p', null, [
        r('span', null, 'Please switch to '),
        r('a', {
          href: 'https://www.chrome.com/',
          target: '_blank',
          rel: 'noopener noreferrer'
        }, 'Chrome'),
        '.'
      ])
    ])
  )
}
