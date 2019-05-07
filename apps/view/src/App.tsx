// root component
import React from 'react'
import {hot} from 'react-hot-loader/root'

import {useAppState, createBoard, createBoardFromUrl} from './state'
import BoardDisplay from './BoardDisplay'
import FileList from './FileList'
import BoardList from './BoardList'
import Nav from './Nav'
import LoadFiles from './LoadFiles'
import ErrorToast from './ErrorToast'
import {preventDefault} from './events'
import {Main} from './ui'
import {FileEvent} from './types'

const NextUrl = (file: string, token: string): string =>
  `https://staging.newmatik.com/api/method/newmatik.next.endpoints.file.fetch_file?file_name=${file}&token=${token}`

export type AppParams = {
  params: any
}

function App(props: AppParams): JSX.Element {
  const {dispatch, loading, processing, board} = useAppState()

  const handleFiles = (event: FileEvent): void => {
    const files =
      'dataTransfer' in event
        ? Array.from(event.dataTransfer.files)
        : Array.from(event.target.files || [])

    if (files.length > 0) dispatch(createBoard(files))
    if ('value' in event.target) event.target.value = ''
    preventDefault(event)
  }

  const handleUrl = (url: string): void => {
    console.log('handling url')
    console.log(url)
    if (url) dispatch(createBoardFromUrl(url))
  }
  const handleParams = (urlParams: any): any => {
    let file = ''
    let token = ''
    let params = ''
    for (params in urlParams) {
      if (urlParams[params].startsWith('token='))
        token = urlParams[params].split('=')[1]

      if (urlParams[params].startsWith('file='))
        file = urlParams[params].split('=')[1]
    }
    return {
      file: file,
      token: token,
    }
  }

  const {file, token} = handleParams(props.params)

  setTimeout(() => {
    if (!processing && board === null) handleUrl(NextUrl(file, token))
  }, 500)

  return (
    <Main onDragOver={preventDefault} onDrop={handleFiles}>
      <BoardDisplay />
      <FileList />
      {/* <BoardList /> */}
      <Nav handleFiles={handleFiles} handleUrl={handleUrl} />
      <LoadFiles
        handleFiles={handleFiles}
        handleUrl={handleUrl}
        nextURL={NextUrl(file, token)}
      />
      <ErrorToast />
    </Main>
  )
}

export default hot(App)
