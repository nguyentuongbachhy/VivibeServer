// routes/comment.js
import express from 'express'
import * as commentController from '../controller/comment'

const router = express.Router()

router.get('/initialize-song-branch', commentController.initializeSongBranchController)
router.post('/add-comment', commentController.addCommentController)
router.delete('/delete-comment/:songId/:commentId', commentController.deleteCommentController)
router.get('/get-comments-song/:songId', commentController.getSongCommentsController)
router.get('/get-replies/:songId/:commentId/replies', commentController.getCommentWithRepliesController)
router.get('/get-total-comment', commentController.getTotalCommentsController)

export default router