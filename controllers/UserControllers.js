import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const register =  async (req, res) => {
    try {

        const password = req.body.password.toString();
        const salt = await bcrypt.genSalt(10);
        const passwordHashed = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            passwordHash: passwordHashed,
        });

        const user = await doc.save();
        const {passwordHash, ...userData} = user._doc;

        const token = jwt.sign(
            {
                _id: user._id
            },
            'aboba123',
            {
                expiresIn: '30d'
            })

        res.json({...userData, token})
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось зарегистрироваться'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const isValidPass = await bcrypt.compare(req.body.password.toString(), user._doc.passwordHash)
        if (!isValidPass) {
            return res.status(404).json({
                message: 'Неверный логин или пароль'
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            'aboba123',
            {
                expiresIn: '30d'
            })

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Не удалось авторизоватся'
        })
    }
}



export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user) {
            return res.status(404).json({
                message: 'Пользователь не найден'
            })
        }
        const token = jwt.sign(
            {
                _id: user._id
            },
            'aboba123',
            {
                expiresIn: '30d'
            })

        const {passwordHash, ...userData} = user._doc;

        res.json({...userData, token})
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: 'Нет доступа'
        })
    }
}