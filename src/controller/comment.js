// commentController.js
import * as commentService from '../service/comment'

export const initializeSongBranchController = async (req, res) => {
    try {
        const { songId } = req.query

        if (!songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing song ID'
            })
        }

        await commentService.initializeSongBranch(+songId)

        return res.status(200).json({
            err: 0,
            msg: 'Song branch initialized successfully'
        })
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const addCommentController = async (req, res) => {
    try {
        const { songId, userId, content, parentCommentId } = req.body

        if (!songId || !userId || !content) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing required data'
            })
        }

        const response = await commentService.addComment(+songId, userId, content, +parentCommentId)

        return res.status(200).json(response)
    } catch (error) {
        console.log(JSON.stringify(error))
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const deleteCommentController = async (req, res) => {
    try {
        const { songId, commentId } = req.params

        if (!songId || !commentId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing song ID or comment ID'
            })
        }

        const response = await commentService.deleteComment(+songId, +commentId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getSongCommentsController = async (req, res) => {
    try {
        const { songId } = req.params

        if (!songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing song ID'
            })
        }

        const response = await commentService.getSongComments(+songId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getCommentWithRepliesController = async (req, res) => {
    try {
        const { songId, commentId } = req.params

        if (!songId || !commentId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing song ID or comment ID'
            })
        }

        const response = await commentService.getCommentWithReplies(+songId, +commentId)

        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}

export const getTotalCommentsController = async (req, res) => {
    try {
        const { songId } = req.query
        if (!songId) {
            return res.status(400).json({
                err: 1,
                msg: 'Missing input'
            })
        }

        const response = await commentService.getTotalComments(songId)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
}