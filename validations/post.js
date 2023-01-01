import { body } from 'express-validator'

export const postCreateValidation = [
    body('title', 'Введите заголовок статьи').isLength({min: 3}).isString(),
    body('text', 'Введите текст статьи').isLength({min: 10}).isString(),
    body('tags', 'Введите формат тэгов').optional().isString(),
    body('title', 'Неверная ссылка на изображения').optional().isString(),
]