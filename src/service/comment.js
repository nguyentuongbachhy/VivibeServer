import { Op } from 'sequelize'
import db from '../models'

const ROOT_ID = 1

export const initializeSongBranch = (songId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction()
    try {
        const root = await db.Comment.findByPk(ROOT_ID, {
            lock: true,
            transaction
        })

        if (!root) {
            resolve({
                err: -1,
                msg: 'Root node not found'
            })

            return
        }

        const existingBranch = await db.Comment.findOne({
            where: {
                songId,
                isVirtual: true
            }
        })

        if (existingBranch) {
            resolve({
                err: 0,
                msg: 'Song branch already exists'
            })

            return
        }

        await db.Comment.update(
            { rgt: db.sequelize.literal('rgt + 2') },
            {
                where: { rgt: { [Op.gte]: root.rgt } },
                transaction
            }
        )

        await db.Comment.create({
            songId,
            lft: root.rgt,
            rgt: root.rgt + 1,
            depth: 1,
            isVirtual: true
        }, { transaction });

        await transaction.commit();
        resolve({
            err: 0,
            msg: 'Create song branch successfully'
        })

    } catch (error) {
        console.log(JSON.stringify(error))
        await transaction.rollback()
        reject({
            err: -1,
            msg: `Interval server: ${error}`
        })
    }
})


export const addComment = (songId, userId, content, parentCommentId = null) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction()
    try {
        // 1. Lock entire comment tree for this song
        await db.sequelize.query(`
            SELECT id FROM Comments 
            WHERE songId = ? 
            FOR UPDATE
        `, {
            replacements: [songId],
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        // 2. Get parent node info
        const [parentNode] = await db.sequelize.query(`
            SELECT * FROM Comments 
            WHERE ${parentCommentId ? 'id = ?' : 'songId = ? AND isVirtual = true'}
            AND songId = ?
        `, {
            replacements: parentCommentId ? [parentCommentId, songId] : [songId, songId],
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        if (!parentNode) {
            await transaction.rollback();
            resolve({
                err: 1,
                msg: 'Parent node not found'
            });
            return;
        }

        await db.sequelize.query(`
            UPDATE Comments
            SET 
                rgt = rgt + 2,
                lft = CASE
                    WHEN lft > ? THEN lft + 2
                    ELSE lft
                END
            WHERE songId = ? AND rgt >= ?
            ORDER BY rgt DESC, lft DESC
        `, {
            replacements: [
                parentNode.rgt,
                songId,
                parentNode.rgt
            ],
            transaction
        });

        const [newCommentId] = await db.sequelize.query(`
            INSERT INTO Comments 
            (songId, userId, content, lft, rgt, depth, isVirtual, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, false, NOW(), NOW())
        `, {
            replacements: [
                songId,
                userId,
                content,
                parentNode.rgt,
                parentNode.rgt + 1,
                parentNode.depth + 1
            ],
            type: db.sequelize.QueryTypes.INSERT,
            transaction
        });

        const [newComment] = await db.sequelize.query(`
            SELECT 
                c.*,
                u.name as userName,
                u.profileUrl as userProfileUrl
            FROM Comments c
            JOIN Users u ON c.userId = u.id
            WHERE c.id = ? AND c.songId = ?
        `, {
            replacements: [newCommentId, songId],
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        await transaction.commit();

        resolve({
            err: 0,
            msg: 'Comment added successfully',
            data: {
                id: newComment.id,
                songId: newComment.songId,
                content: newComment.content,
                depth: newComment.depth,
                likes: 0,
                createdAt: newComment.createdAt,
                countReplies: 0,
                user: {
                    id: newComment.userId,
                    name: newComment.userName,
                    profilePictureUri: newComment.userProfileUrl
                }
            }
        });

    } catch (error) {
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const deleteComment = (songId, commentId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        // 1. Lock entire comment tree for this song
        await db.sequelize.query(`
            SELECT id FROM Comments 
            WHERE songId = ? 
            FOR UPDATE
        `, {
            replacements: [songId],
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        // 2. Get target node info
        const [targetNode] = await db.sequelize.query(`
            SELECT lft, rgt 
            FROM Comments 
            WHERE id = ? AND songId = ?
        `, {
            replacements: [commentId, songId],
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        if (!targetNode) {
            await transaction.rollback();
            resolve({
                err: 1,
                msg: 'Comment not found'
            });
            return;
        }

        const width = targetNode.rgt - targetNode.lft + 1;

        // 3. Delete target node and all its children
        await db.sequelize.query(`
            DELETE FROM Comments
            WHERE songId = ? 
            AND lft BETWEEN ? AND ?
        `, {
            replacements: [songId, targetNode.lft, targetNode.rgt],
            transaction
        });

        // 4. Update remaining nodes
        await db.sequelize.query(`
            UPDATE Comments 
            SET 
                rgt = CASE
                    WHEN rgt > ? THEN rgt - ?
                    ELSE rgt
                END,
                lft = CASE
                    WHEN lft > ? THEN lft - ?
                    ELSE lft
                END
            WHERE songId = ? 
            AND (rgt > ? OR lft > ?)
            ORDER BY lft ASC
        `, {
            replacements: [
                targetNode.rgt, width,
                targetNode.rgt, width,
                songId,
                targetNode.lft, targetNode.lft
            ],
            transaction
        });

        await transaction.commit();

        resolve({
            err: 0,
            msg: 'Comment deleted successfully'
        });

    } catch (error) {
        console.error('Delete comment error:', error);
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getSongComments = (songId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const songBranch = await db.Comment.findOne({
            where: {
                songId,
                isVirtual: true
            },
            lock: true,
            transaction
        });

        if (!songBranch) {
            await transaction.commit();
            resolve({
                err: -1,
                msg: 'Song branch not found'
            });
            return;
        }

        const query = `
            SELECT
                c.id,
                c.songId,
                c.content,
                c.userId,
                c.depth,
                c.likes,
                c.createdAt,
                u.name as userName,
                u.profileUrl as userProfileUrl,
                (c.rgt - c.lft - 1) / 2 as countReplies
            FROM Comments c
            LEFT JOIN Users u ON c.userId = u.id
            WHERE c.songId = :songId 
            AND c.depth = 2
            AND c.isVirtual = false
            AND c.lft BETWEEN :lft AND :rgt
            ORDER BY c.lft ASC
            FOR SHARE
        `;

        const comments = await db.sequelize.query(query, {
            replacements: {
                songId: songId,
                lft: songBranch.lft,
                rgt: songBranch.rgt
            },
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        await transaction.commit();
        resolve({
            err: 0,
            msg: 'Got comments successfully',
            data: comments.map(comment => ({
                id: comment.id,
                songId: comment.songId,
                content: comment.content,
                depth: comment.depth,
                likes: comment.likes,
                createdAt: comment.createdAt,
                countReplies: parseInt(comment.countReplies),
                user: {
                    id: comment.userId,
                    name: comment.userName,
                    profilePictureUri: comment.userProfileUrl
                }
            }))
        });

    } catch (error) {
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getCommentWithReplies = (songId, commentId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const query = `
            SELECT 
                c.id,
                c.songId,
                c.content,
                c.userId,
                c.depth,
                c.likes,
                c.lft,
                c.rgt,
                c.createdAt,
                (c.rgt - c.lft - 1) / 2 as countReplies,
                u.name as userName,
                u.profileUrl as userProfileUrl
            FROM Comments c
            JOIN Users u ON c.userId = u.id
            WHERE c.songId = ?
            AND c.isVirtual = false
            AND c.lft >= (SELECT lft FROM Comments WHERE id = ? AND songId = ?)
            AND c.rgt <= (SELECT rgt FROM Comments WHERE id = ? AND songId = ?)
            ORDER BY c.lft ASC
            FOR SHARE
        `;

        const replies = await db.sequelize.query(query, {
            replacements: [songId, commentId, songId, commentId, songId],
            type: db.sequelize.QueryTypes.SELECT,
            transaction
        });

        if (replies.length === 0) {
            await transaction.commit();
            resolve({
                err: 1,
                msg: 'Comments not found',
                data: []
            });
            return;
        }

        const formattedReplies = replies.map(comment => ({
            id: comment.id,
            songId: comment.songId,
            content: comment.content,
            depth: comment.depth,
            likes: comment.likes,
            createdAt: comment.createdAt,
            countReplies: parseInt(comment.countReplies, 10),
            user: {
                id: comment.userId,
                name: comment.userName,
                profilePictureUri: comment.userProfileUrl
            }
        }));

        await transaction.commit();
        resolve({
            err: 0,
            msg: 'Got replies successfully',
            data: formattedReplies
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Get comment replies error:', error);
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});

export const getTotalComments = (songId) => new Promise(async (resolve, reject) => {
    const transaction = await db.sequelize.transaction();
    try {
        const songBranch = await db.Comment.findOne({
            where: {
                songId,
                isVirtual: true
            },
            lock: true,
            transaction
        });

        if (!songBranch) {
            await transaction.commit();
            resolve({
                err: -1,
                msg: 'Song branch not found',
                data: 0
            });
            return;
        }

        const totalComments = (songBranch.rgt - songBranch.lft - 1) / 2;

        await transaction.commit();
        resolve({
            err: 0,
            msg: 'Get total comments successfully',
            data: totalComments
        });

    } catch (error) {
        await transaction.rollback();
        reject({
            err: -1,
            msg: `Internal server error: ${error}`
        });
    }
});