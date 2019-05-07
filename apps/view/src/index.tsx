// @tracespace/view entry point
import React from 'react'
import './styles'

Promise.all([
  import('react-dom'),
  import('./state/StateProvider'),
  import('./App'),
]).then(imports => {
  const [
    {default: ReactDom},
    {default: StateProvider},
    {default: App},
  ] = imports

  let params = window.location.search.substring(1).split('&')

  ReactDom.hydrate(
    <StateProvider>
      <App params={params} />
    </StateProvider>,
    document.querySelector('[data-hook=root]')
  )
})
