import React, { useEffect, useState, useRef, useCallback } from 'react'

import './App.scss'

enum ContentType {
  IMAGE,
  TEXT,
  LINK,
  EMBED
}

interface EditorTypes {
  type: ContentType
  html?: any
  index?: number
}

function App() {
  let [, setState] = useState()
  const [contentList, setContentList] = useState<Array<EditorTypes>>([
    {
      type: ContentType.TEXT,
      index: 0
    }
  ])
  const [currentInfo, setCurrentInfo] = useState({
    index: 0,
    time: new Date().getTime()
  })

  const onHandleKeyDown = useCallback(
    (e, type, index, content) => {
      const keyCode = e.which || e.keyCode
      if (keyCode === 13) {
        setContentList(
          contentList.concat([
            {
              type: ContentType.TEXT,
              index: currentInfo.index + 1
            }
          ])
        )
        setCurrentInfo({
          index: currentInfo.index + 1,
          time: new Date().getTime()
        })
        return e.preventDefault()
      } else if (keyCode === 38) {
        if (index !== 0) {
          setCurrentInfo({
            index: index - 1,
            time: new Date().getTime()
          })
        }
      } else if (keyCode === 40) {
        if (index !== contentList.length - 1) {
          setCurrentInfo({
            index: index + 1,
            time: new Date().getTime()
          })
        }
      } else if (keyCode === 8) {
        if (content === '') {
          removeTag(e, index)
        }
      }
    },
    [contentList, setContentList, currentInfo, setCurrentInfo]
  )

  const removeTag = useCallback(
    (e, index) => {
      if (contentList.length > 1) {
        console.log(index)
        const tmpList = contentList.slice(0)
        tmpList.splice(index, 1)
        console.log(tmpList)
        setContentList(tmpList)
        setCurrentInfo({
          index: index - 1,
          time: new Date().getTime()
        })
      }
    },
    [contentList, setContentList, setCurrentInfo]
  )

  const onHandleClick = (e) => {
    e.stopPropagation()
    setCurrentInfo({
      index: contentList.length - 1,
      time: new Date().getTime()
    })
  }

  const addImageTag = useCallback(() => {
    const tmpList = contentList.slice(0)
    tmpList.splice(currentInfo.index + 1, 0, {
      type: ContentType.IMAGE
    })
    setContentList(tmpList)
    setCurrentInfo({
      index: currentInfo.index,
      time: new Date().getTime()
    })
  }, [contentList, setContentList, currentInfo, setCurrentInfo])

  const onHandleChange = useCallback(
    (index, value) => {
      const tmpList = contentList.slice(0)
      tmpList[index].html = value
      setContentList(tmpList)
    },
    [contentList, setContentList]
  )

  return (
    <div className="App">
      {contentList.map((item, key) => {
        return <div key={key}>test : {item.html}</div>
      })}
      {Math.random()}
      <div className="editor">
        <div className="editor-control-list-container">
          <button type="button" onClick={addImageTag}>
            이미지
          </button>
          <button
            type="button"
            onClick={(e) => {
              removeTag(e, currentInfo.index)
            }}
          >
            삭제
          </button>
          {currentInfo.index}
        </div>
        <div className="editor-content-list" onClick={onHandleClick}>
          {contentList.map((item: EditorTypes, key: number) => {
            if (item.type === ContentType.TEXT) {
              return (
                <PTag
                  key={key}
                  onHandleKeyDown={onHandleKeyDown}
                  index={key}
                  currentInfo={currentInfo}
                  setCurrentInfo={setCurrentInfo}
                  onHandleChange={onHandleChange}
                />
              )
            } else if (item.type === ContentType.IMAGE) {
              return (
                <PTag
                  key={key}
                  onHandleKeyDown={onHandleKeyDown}
                  index={key}
                  currentInfo={currentInfo}
                  setCurrentInfo={setCurrentInfo}
                  onHandleChange={onHandleChange}
                />
              )
            }
          })}
        </div>
      </div>
    </div>
  )
}

interface TagProps {
  onHandleKeyDown: Function
  onHandleChange?: Function
  index: number
  currentInfo: any
  setCurrentInfo: Function
  removeTag?: Function
}
function PTag({ onHandleKeyDown, index, currentInfo, setCurrentInfo, removeTag, onHandleChange }: TagProps) {
  const pRef = useRef(null)
  useEffect(() => {
    if (index === currentInfo.index) {
      pRef.current.focus()
    }
  }, [pRef, index, currentInfo])

  const onFocusHandle = useCallback(
    (e) => {
      setCurrentInfo({
        index: index,
        time: new Date().getTime()
      })
    },
    [setCurrentInfo, index]
  )

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
        onFocus={onFocusHandle}
        onClick={(e) => {
          e.stopPropagation()
        }}
        tabIndex={index}
      ></p>
    </div>
  )
}

function ImageTag({ onHandleKeyDown, index, currentInfo, setCurrentInfo, removeTag }: TagProps) {
  const imageRef = useRef(null)
  useEffect(() => {
    if (index === currentInfo.index) {
      imageRef.current.focus()
    }
  }, [imageRef, index, currentInfo])

  const onFocusHandle = useCallback(
    (e) => {
      e.stopPropagation()
      setCurrentInfo({
        index: index,
        time: new Date().getTime()
      })
    },
    [setCurrentInfo, index]
  )
  useEffect(() => {
    console.log(imageRef)
  }, [imageRef])
  return (
    <div
      className="editor-content-container editor-content-image-container"
      onKeyDown={(e) => {
        onHandleKeyDown(e, ContentType.IMAGE, index, imageRef.current.innerHTML)
      }}
      ref={imageRef}
      onClick={onFocusHandle}
      tabIndex={index}
    >
      <div>
        <img src="/logo192.png" />
      </div>
      <div>
        <select>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </div>
    </div>
  )
}

export default App
