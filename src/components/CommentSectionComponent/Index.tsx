import CommentStructure from '../CommentStructure.tsx/Index'
import InputField from '../InputField/Index'
import './CommentSection.css'
import { useContext } from 'react'
import { GlobalContext } from '../../context/Provider'
import _ from 'lodash'
import React from 'react'
import LoginSection from '../LoginSection/LoginSection'
import NoComments from './NoComments'

interface CommentSectionProps {
  overlayStyle?: object
  logIn: {
    loginLink: string
    signupLink: string
  }
  hrStyle?: object
  titleStyle?: object
  customNoComment?: Function
}

const CommentSection = ({
  overlayStyle,
  logIn,
  hrStyle,
  titleStyle,
  customNoComment
}: CommentSectionProps) => {
  const loginMode = () => {
    return (
      <LoginSection
        loginLink={logIn!.loginLink}
        signUpLink={logIn!.signupLink}
      />
    )
  }
  const globalStore: any = useContext(GlobalContext)

  const totalComments = () => {
    let count = 0
    globalStore.data.map((i: any) => {
      count = count + 1
      i.replies.map(() => (count = count + 1))
    })
    return count
  }

  return (
    <div className='overlay' style={overlayStyle}>
      <span className='comment-title' style={titleStyle}>
        {globalStore.commentsCount || totalComments()}{' '}
        {totalComments() === 1 ? 'Comment' : 'Comments'}
      </span>
      <hr className='hr-style' style={hrStyle} />
      {globalStore.currentUserData === null ? (
        loginMode()
      ) : (
        <InputField formStyle={{ margin: '10px 0px' }} imgDiv={{ margin: 0 }} />
      )}

      {globalStore.data.length > 0 ? (
        globalStore.data.map(
          (i: {
            userId: string
            comId: string
            fullName: string
            avatarUrl: string
            text: string
            userProfile?: string
            replies: Array<any>
          }) => {
            return (
              <div key={i.comId}>
                <CommentStructure
                  info={i}
                  editMode={
                    true
                  }
                  replyMode={
                    true
                  }
                  logIn={logIn}
                />
                {i.replies &&
                  i.replies.length > 0 &&
                  i.replies.map((j: {
                    userId: string
                    comId: string
                    fullName: string
                    avatarUrl: string
                    text: string
                    userProfile?: string
                    replies: Array<any>
                  }) => {
                    return (
                      <div className='replySection' key={j.comId}>
                        <CommentStructure
                          info={j}
                          parentId={j.comId}
                          editMode={
                            true
                          }
                          replyMode={
                            true
                          }
                          logIn={logIn}
                        />
                       {j.replies &&
                        j.replies.length > 0 &&
                        j.replies.map((k: {
                          userId: string
                          comId: string
                          fullName: string
                          avatarUrl: string
                          text: string
                          userProfile?: string
                          replies: Array<any>
                        }) => {
                          return (
                            <div className='replySection' key={k.comId}>
                              <CommentStructure
                                info={k}
                                parentId={k.comId}
                                editMode={
                                  true
                                }
                                replyMode={
                                  true
                                }
                                logIn={logIn}
                              />
                             {k.replies &&
                              k.replies.length > 0 &&
                              k.replies.map((l: {
                                userId: string
                                comId: string
                                fullName: string
                                avatarUrl: string
                                text: string
                                userProfile?: string
                                replies: Array<any>
                              }) => {
                                return (
                                  <div className='replySection' key={l.comId}>
                                    <CommentStructure
                                      info={l}
                                      parentId={l.comId}
                                      editMode={
                                        true
                                      }
                                      replyMode={
                                        true
                                      }
                                      logIn={logIn}
                                    />
                                  </div>
                                )
                              })}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })}
              </div>
            )
          }
        )
      ) : customNoComment ? (
        customNoComment()
      ) : (
        <NoComments />
      )}
    </div>
  )
}

export default CommentSection
