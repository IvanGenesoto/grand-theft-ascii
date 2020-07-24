import {renderElement as r} from '.'

export const renderLoading = () => {
  const $loading = document.getElementById('loading')
  $loading.append(r('div', {class: 'center medium'}, 'Loading...'))
}
