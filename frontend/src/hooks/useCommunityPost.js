import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  delete_community_comment,
  delete_community_comment_like,
  delete_community_post,
  delete_community_post_like,
  get_community_post,
  patch_community_comment,
  post_community_comment,
  post_community_comment_like,
  post_community_post_like,
} from '../api/communityApi'

export function useCommunityPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [commentInput, setCommentInput] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editingCommentContent, setEditingCommentContent] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    loadPost()
  }, [id])

  async function loadPost() {
    const res = await get_community_post(id)
    setPost(res.data.data)
  }

  async function handleLike() {
    const res = post.liked
      ? await delete_community_post_like(post.id)
      : await post_community_post_like(post.id)
    setPost(res.data.data)
  }

  async function handleDeletePost({ confirm }) {
    const ok = await confirm({ icon: 'bi-trash3', title: '게시글 삭제', message: '게시글을 삭제할까요?', confirmLabel: '삭제', danger: true })
    if (!ok) return
    await delete_community_post(post.id)
    navigate('/community')
  }

  async function handleCommentSubmit(e, { showAlert }) {
    e.preventDefault()
    const text = commentInput.trim()
    if (!text) return
    setErrorMessage('')
    try {
      const res = await post_community_comment(post.id, text)
      setCommentInput('')
      if (res.data.data.safetyNotice) await showAlert({ title: res.data.data.safetyNotice, type: 'safety' })
      await loadPost()
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? '댓글을 등록하지 못했습니다.')
    }
  }

  function startEditComment(comment) {
    setEditingCommentId(comment.id)
    setEditingCommentContent(comment.content)
  }

  function cancelEditComment() {
    setEditingCommentId(null)
    setEditingCommentContent('')
  }

  async function handleCommentUpdate(commentId, { showAlert }) {
    const text = editingCommentContent.trim()
    if (!text) return
    setErrorMessage('')
    try {
      const res = await patch_community_comment(commentId, text)
      if (res.data.data.safetyNotice) await showAlert({ title: res.data.data.safetyNotice, type: 'safety' })
      cancelEditComment()
      await loadPost()
    } catch (error) {
      setErrorMessage(error.response?.data?.message ?? '댓글을 수정하지 못했습니다.')
    }
  }

  async function handleCommentDelete(commentId, { confirm }) {
    const ok = await confirm({ icon: 'bi-chat-x', title: '댓글 삭제', message: '댓글을 삭제할까요?', confirmLabel: '삭제', danger: true })
    if (!ok) return
    await delete_community_comment(commentId)
    await loadPost()
  }

  async function handleCommentLike(comment) {
    await (comment.liked
      ? delete_community_comment_like(comment.id)
      : post_community_comment_like(comment.id))
    await loadPost()
  }

  return {
    post,
    navigate,
    commentInput,
    setCommentInput,
    editingCommentId,
    setEditingCommentId,
    editingCommentContent,
    setEditingCommentContent,
    errorMessage,
    handleLike,
    handleDeletePost,
    handleCommentSubmit,
    startEditComment,
    cancelEditComment,
    handleCommentUpdate,
    handleCommentDelete,
    handleCommentLike,
  }
}
