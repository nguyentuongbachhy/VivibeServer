import * as authService from '../service/auth'

export const loginOrRegisterController = async (req, res) => {
    const { googleId, email, name, profileUrl } = req.body.user

    if (!googleId || !email || !name) {
        return res.status(401).json({
            err: 1,
            msg: "Error when verifying your account!"
        })
    }

    try {
        const response = await authService.loginOrRegisterService(googleId, email, name, profileUrl)
        if (response?.err == 0) {
            return res.status(200).json(response)
        }
        return res.status(500).json(response)
    } catch (error) {
        console.error('Error occurred:', error);
    }
}





