import db from '../models'
const { Op } = require("sequelize");
import { v4 as generateId } from 'uuid';
import generateCode from '../ultis/generateCode';
import moment from 'moment';

export const getPostsService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})
export const getPostsLimitService = (page, query, { priceNumber, areaNumber }) => new Promise(async (resolve, reject) => {
    try {
        let offset = (!page || +page <= 1) ? 0 : (+page - 1)
        const queries = { ...query }
        if (priceNumber) queries.priceNumber = { [Op.between]: priceNumber }
        if (areaNumber) queries.areaNumber = { [Op.between]: areaNumber }
        const response = await db.Post.findAndCountAll({
            where: queries,
            raw: true,
            nest: true,
            offset: offset * +process.env.LIMIT,
            limit: +process.env.LIMIT,
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
                { model: db.User, as: 'user', attributes: ['name', 'zalo', 'phone'] },
            ],
            attributes: ['id', 'title', 'star', 'address', 'description']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})

export const getNewPostService = () => new Promise(async (resolve, reject) => {
    try {
        const response = await db.Post.findAll({
            raw: true,
            nest: true,
            offset: 0,
            order: [['createdAt', 'DESC']],
            limit: +process.env.LIMIT,
            include: [
                { model: db.Image, as: 'images', attributes: ['image'] },
                { model: db.Attribute, as: 'attributes', attributes: ['price', 'acreage', 'published', 'hashtag'] },
            ],
            attributes: ['id', 'title', 'star', 'createdAt']
        })
        resolve({
            err: response ? 0 : 1,
            msg: response ? 'OK' : 'Getting posts is failed.',
            response
        })

    } catch (error) {
        reject(error)
    }
})
export const createNewPostsService = (body, userId) => new Promise(async (resolve, reject) => {
    try {
        const attributesId = generateId();
        const imagesId = generateId();
        const overviewId = generateId();
        const labelCode = generateCode(body.label);
        const hashtag = `#${Math.floor(Math.random() * Math.pow(10, 6))}`
        const currentDate = new Date();
        await db.Post.create({
            id: generateId(),
            title: body.title,
            labelCode,
            address: body.address,
            attributesId,
            categoryCode: body.categoryCode,
            description: JSON.stringify(body.description) || null,
            userId,
            overviewId,
            imagesId,
            areaCode: body.areaCode || null,
            priceCode: body.priceCode || null,
            provinceCode: body?.province?.includes('Th??nh ph???') ? generateCode(body?.province?.replace('Th??nh ph??? ', '')) : generateCode(body?.province?.replace('T???nh ', '')) || null,
            priceNumber: body.priceNumber,
            areaNumber: body.areaNumber
        })
        await db.Attribute.create({
            id: attributesId,
            price: +body.priceNumber < 1 ? `${+body.priceNumber * 1000000} ?????ng/th??ng` : `${body.priceNumber} tri???u/th??ng`,
            acreage: `${body.areaNumber} m2`,
            published: moment(new Date).format('DD/MM/YYYY'),
            hashtag
        })
        await db.Image.create({
            id: imagesId,
            image: JSON.stringify(body.images)
        })
        await db.Overview.create({
            id: overviewId,
            code: hashtag,
            area: body.label,
            type: body?.category,
            target: body?.target,
            bonus: 'tin th?????ng',
            created: new Date(),
            expired: currentDate.setDate(currentDate.getDate() + 10),
        })
        await db.Province.findOrCreate({
            where: {
                [Op.or]: [
                  { value: body?.province?.replace('Th??nh ph??? ', '') },
                  { value: body?.province?.replace('T???nh ', '') }
                ]
            },
            defaults: {
                code: body?.province?.includes('Th??nh ph???') ? generateCode(body?.province?.replace('Th??nh ph??? ', '')) : generateCode(body?.province?.replace('T???nh ', '')),
                value: body?.province?.includes('Th??nh ph???') ? body?.province?.replace('Th??nh ph??? ', '') : body?.province?.replace('T???nh ', ''),
            }
        })
        await db.Label.findOrCreate({
            where: {
                code: labelCode
            },
            defaults: {
                code: labelCode,
                value: body?.label
            }
        })
        resolve({
            err: 0,
            msg: 'OK',
        })

    } catch (error) {
        reject(error)
    }
})