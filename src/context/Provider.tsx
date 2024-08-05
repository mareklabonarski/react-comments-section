import React, { createContext, useEffect, useState } from 'react'
// const { v4: uuidv4 } = require('uuid')
import _ from 'lodash'


export const GlobalContext = createContext({})


export type Comment = {
    userId: string,
    comId: string,
    fullName: string,
    avatarUrl: string,
    text: string,
    userProfile?: string,
    replies: Array<Comment>
}

export const GlobalProvider = ({
  children,
  currentUser,
  replyTop,
  customImg,
  inputStyle,
  formStyle,
  submitBtnStyle,
  cancelBtnStyle,
  imgStyle,
  commentsCount,
  commentData,
  onSubmitAction,
  onDeleteAction,
  onReplyAction,
  onEditAction,
  currentData,
  replyInputStyle,
  removeEmoji,
  advancedInput
}: {
  children: any
  currentUser?: {
    currentUserId: string
    currentUserImg: string
    currentUserProfile?: string | undefined
    currentUserFullName: string
  } | null
  replyTop?: boolean
  customImg?: string
  inputStyle?: object
  formStyle?: object
  submitBtnStyle?: object
  cancelBtnStyle?: object
  imgStyle?: object
  replyInputStyle?: object
  commentsCount?: number
  removeEmoji?: boolean
  commentData?: Array<Comment>
  onSubmitAction?: Function
  onDeleteAction?: Function
  onReplyAction?: Function
  onEditAction?: Function
  currentData?: Function
  advancedInput?: boolean
}) => {
  const [currentUserData] = useState(currentUser)
  const [data, setData] = useState<Comment[]>([])
  const [editArr, setEdit] = useState<string[]>([])
  const [replyArr, setReply] = useState<string[]>([])

  useEffect(() => {
    if (commentData) {
      setData(commentData)
    }
  }, [commentData])

  useEffect(() => {
    if (currentData) {
      currentData(data)
    }
  }, [data])

  const handleAction = (id: string, edit: boolean) => {
    if (edit) {
      let editArrCopy: string[] = [...editArr]
      let indexOfId = _.indexOf(editArrCopy, id)
      if (_.includes(editArr, id)) {
        editArrCopy.splice(indexOfId, 1)
        setEdit(editArrCopy)
      } else {
        editArrCopy.push(id)
        setEdit(editArrCopy)
      }
    } else {
      let replyArrCopy: string[] = [...replyArr]
      let indexOfId = _.indexOf(replyArrCopy, id)
      if (_.includes(replyArr, id)) {
        replyArrCopy.splice(indexOfId, 1)
        setReply(replyArrCopy)
      } else {
        replyArrCopy.push(id)
        setReply(replyArrCopy)
      }
    }
  }

  const onSubmit = (text: string, uuid: string) => {
    let copyData = [...data]
    copyData.push({
      userId: currentUserData!.currentUserId,
      comId: uuid,
      avatarUrl: currentUserData!.currentUserImg,
      userProfile: currentUserData!.currentUserProfile
        ? currentUserData!.currentUserProfile
        : undefined,
      fullName: currentUserData!.currentUserFullName,
      text: text,
      replies: []
    })
    setData(copyData)
  }

  const onEdit = (text: string, comId: string, parentId: string) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      const indexOfId = _.findIndex(copyData[indexOfParent].replies, {
        comId: comId
      })
      copyData[indexOfParent].replies[indexOfId].text = text
      setData(copyData)
      handleAction(comId, true)
    } else {
      const indexOfId = _.findIndex(copyData, { comId: comId })
      copyData[indexOfId].text = text
      setData(copyData)
      handleAction(comId, true)
    }
  }

  const findIndices = (parentId: string, indices: number[], commentData: Comment[]): number[] | undefined => {

    // @ts-nocheck
    let indexOfParent = _.findIndex(commentData, { comId: parentId })
    if (indexOfParent === undefined) {
      for (let i= 0; i < commentData.length; i++) {
        let indicesOfGrandParent = findIndices(parentId, [...indices, i], commentData[i].replies)
        if (indicesOfGrandParent !== undefined) {
          return indicesOfGrandParent
        }
      }
    }
    return [...indices, indexOfParent]

  }

  const onReply = (
    text: string,
    comId: string,
    parentId: string,
    uuid: string
  ) => {
    let copyData = [...data]
    if (parentId) {
      const indicesOfParent = findIndices(parentId, [], copyData)
      let searchComment: any = copyData

      if (indicesOfParent !== undefined) {

        for (let i = 0; i < indicesOfParent.length; i++) {
          let idx = indicesOfParent[i]
          if (i == 0) {
            searchComment = searchComment[idx]
          } else {
            searchComment = searchComment.replies[idx]
          }
        }
      }

      searchComment.replies.push({
        userId: currentUserData!.currentUserId,
        comId: uuid,
        avatarUrl: currentUserData!.currentUserImg,
        userProfile: currentUserData!.currentUserProfile
          ? currentUserData!.currentUserProfile
          : undefined,
        fullName: currentUserData!.currentUserFullName,
        text: text,
        replies: []
      })
      setData(copyData)
      handleAction(comId, false)
    } else {
      const indexOfId = _.findIndex(copyData, {
        comId: comId
      })
      copyData[indexOfId].replies.push({
        userId: currentUserData!.currentUserId,
        comId: uuid,
        avatarUrl: currentUserData!.currentUserImg,
        userProfile: currentUserData!.currentUserProfile
          ? currentUserData!.currentUserProfile
          : undefined,
        fullName: currentUserData!.currentUserFullName,
        text: text,
        replies: []
      })
      setData(copyData)
      handleAction(comId, false)
    }
  }

  const onDelete = (comId: string, parentId: string) => {
    let copyData = [...data]
    if (parentId) {
      const indexOfParent = _.findIndex(copyData, { comId: parentId })
      const indexOfId = _.findIndex(copyData[indexOfParent].replies, {
        comId: comId
      })
      copyData[indexOfParent].replies!.splice(indexOfId, 1)
      setData(copyData)
    } else {
      const indexOfId = _.findIndex(copyData, { comId: comId })
      copyData.splice(indexOfId, 1)
      setData(copyData)
    }
  }

  return (
    <GlobalContext.Provider
      value={{
        currentUserData: currentUserData,
        replyTop: replyTop,
        data: data,
        handleAction: handleAction,
        editArr: editArr,
        onSubmit: onSubmit,
        onEdit: onEdit,
        replyArr: replyArr,
        onReply: onReply,
        onDelete: onDelete,
        customImg: customImg,
        inputStyle: inputStyle,
        formStyle: formStyle,
        submitBtnStyle: submitBtnStyle,
        cancelBtnStyle: cancelBtnStyle,
        imgStyle: imgStyle,
        commentsCount: commentsCount,
        onSubmitAction: onSubmitAction,
        onDeleteAction: onDeleteAction,
        onReplyAction: onReplyAction,
        onEditAction: onEditAction,
        replyInputStyle: replyInputStyle,
        removeEmoji: removeEmoji,
        advancedInput: advancedInput
      }}
    >
      {children}
    </GlobalContext.Provider>
  )
}

export default GlobalProvider
