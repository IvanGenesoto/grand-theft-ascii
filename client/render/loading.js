import {renderElement as r} from '..'

export const renderLoading = () => {
  const $loading = document.getElementById('loading')
  $loading.append(
    r('div', {class: 'center medium'}, [
      r('span', null, 'arrow keys: run/fly'),
      r('p'),
      r('span', null, 'spacebar: in/out'),
      r('p'),
      r('br'),
      r('p'),
      r('div', null, 'loading...')
    ]))
}
