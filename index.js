import express from 'express';
import mongoose from 'mongoose'
import multer from 'multer'
import cors from 'cors'

import { register, login, getMe } from "./controllers/UserControllers.js";
import { create, getAll, getOne, deletePost, update, getLastTags } from './controllers/PostControllers.js'
import {registerValidation, loginValidation} from './validations/auth.js'
import { postCreateValidation } from './validations/post.js'
import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";


const app = express();

mongoose.connect('mongodb://localhost:27017')
    .then(() => {
        console.log('Db ok')
    })
    .catch((err) => console.log(err))

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({ storage })

app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use(cors())

app.post('/auth/register', registerValidation, handleValidationErrors, register)
app.post('/auth/login',loginValidation, handleValidationErrors, login)
app.get('/auth/me', checkAuth, getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.get('/posts', getAll)
app.get('/posts/:id', getOne)
app.get('/posts/tags', getLastTags)
app.get('/tags', getLastTags)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, create)
app.patch('/posts/:id',checkAuth, postCreateValidation, handleValidationErrors, update)
app.delete('/posts/:id', checkAuth, deletePost)


app.listen(4444, (err) => {
    if (err) {
        return console.log(err)
    }

    console.log('Server ok')
})