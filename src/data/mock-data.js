let BOOKS = [
    {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
        name: 'The Final Empire',
        serie: 'Mistborn',
        serieNr: 1,
        autor: 'Brandon Sanderson',
    },
    {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
        name: 'The Way of Kings',
        serie: 'Stormlight Archive',
        serieNr: 1,
        autor: 'Brandon Sanderson',
    },
    {   
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff83',
        name: 'Rhythm of War',
        serie: 'Stormlight Archive',
        serieNr: 4,
        autor: 'Brandon Sanderson',
    },
];

let CHARACTERS = [
    {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff87',
        name: 'Kelsier',
        aliases: ['Survivor', 'Lord of Scars', 'Thaidakar'],
        user: {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
            name: 'Dylan Rathé',
        },
        book: {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
            name: 'The Final Empire',
            serie: 'Mistborn',
            serieNr: 1,
            autor: 'Brandon Sanderson',
        },
    },
    {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff88',
        name: 'Leshwi',
        aliases: [],
        user: {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
            name: 'Dylan Rathé',
        },
        book: {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff84',
            name: 'Rhythm of War',
            serie: 'Stormlight Archive',
            serieNr: 4,
            autor: 'Brandon Sanderson',
        },
    },
    {
        id: '7f28c5f9-d711-4cd6-ac15-d13d71abff86',
        name: 'Szeth',
        aliases: ['Assassin in White'],
        user: {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff80',
            name: 'Dylan Rathé',
        },
        book: {
            id: '7f28c5f9-d711-4cd6-ac15-d13d71abff85',
            name: 'The Way of Kings',
            serie: 'Stormlight Archive',
            serieNr: 1,
            autor: 'Brandon Sanderson',
        },
    },
];

module.exports = { CHARACTERS, BOOKS };