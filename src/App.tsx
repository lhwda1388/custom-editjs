import React, { useEffect, useState, useRef, useMemo } from 'react'
import './App.scss'

enum ContentType {
  IMAGE,
  TEXT,
  LINK,
  EMBED
}

interface EditorTypes {
  type: ContentType
  content: any
}

function App() {
  const [contentList, setContentList] = useState<Array<EditorTypes>>([
    {
      type: ContentType.TEXT,
      content: PComponent
    }
  ])
  const [currentCursorIndex, setCurrentCursorIndex] = useState(0)
  useEffect(() => {}, [])
  const onHandleKeyDown = (e, type, index, content) => {
    const keyCode = e.which || e.keyCode
    if (keyCode === 13) {
      setContentList(
        contentList.concat([
          {
            type: ContentType.TEXT,
            content: PComponent
          }
        ])
      )
      setCurrentCursorIndex(currentCursorIndex + 1)
      return e.preventDefault()
    } else if (keyCode === 38) {
      if (index !== 0) setCurrentCursorIndex(index - 1)
    } else if (keyCode === 40) {
      if (index !== contentList.length - 1) setCurrentCursorIndex(index + 1)
    } else if (keyCode === 8) {
      if (content === '') {
        console.log(`del index ${index}`)
        const filterList: Array<EditorTypes> = contentList.filter((item: EditorTypes, i) => i !== index)
        console.log(filterList)
        setContentList(filterList)
      }
    }
  }

  const onHandleClick = (e) => {
    setCurrentCursorIndex(contentList.length - 1)
  }

  return (
    <div className="App">
      <div className="editor">
        <div className="editor-control-list-container">
          <button type="button">이미지</button>
        </div>
        <div className="editor-content-list" onClick={onHandleClick}>
          {contentList.map((item: EditorTypes, key: number) => {
            if (item.type === ContentType.TEXT) {
              return (
                <PComponent
                  key={key}
                  onHandleKeyDown={onHandleKeyDown}
                  index={key}
                  currentCursorIndex={currentCursorIndex}
                />
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

interface PComponentProps {
  onHandleKeyDown: Function
  index: number
  currentCursorIndex: number
}
function PComponent({ onHandleKeyDown, index, currentCursorIndex }: PComponentProps) {
  const pRef = useRef(null)
  useEffect(() => {
    console.log(document.getElementById(`key${index}`).innerHTML)
    console.log(pRef)
    if (index === currentCursorIndex) {
      console.log(`currentCursorRef.current: ${currentCursorIndex}`)
      pRef.current.focus()
    }
  }, [pRef, index, currentCursorIndex])
  return (
    <div className="editor-content-container editor-content-p-container">
      <p
        className="editor-content-p"
        contentEditable={true}
        onKeyDown={(e) => {
          onHandleKeyDown(e, ContentType.TEXT, index, pRef.current.innerHTML)
        }}
        id={`key${index}`}
        ref={pRef}
      ></p>
    </div>
  )
}

export default App
