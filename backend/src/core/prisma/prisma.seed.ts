import { BadRequestException, Logger } from "@nestjs/common";
import { Prisma, PrismaClient } from '../../../generated/prisma';
import { hash } from "argon2";


const prisma = new PrismaClient({
    transactionOptions: {
        maxWait: 5000,
        timeout: 10000,
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable
    }
})

async function main() {
    try {
        Logger.log('Incepem sa incarcm datele')

        await prisma.$transaction([
            prisma.user.deleteMany(),
            prisma.socialLink.deleteMany(),
            prisma.stream.deleteMany(),
            prisma.category.deleteMany()
        ])

        const categoriesData = [
            {
                title: 'WarCraft',
                slug: 'warcraft',
                description: 'Random description for WarCraft.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'Spider-Man',
                slug: 'spider man',
                description: 'Random description for Spider-Man.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'Call-of-duty',
                slug: 'call of duty',
                description: 'Random description for Call-of-duty.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'Masinitzi',
                slug: 'masinitzi',
                description: 'Random description for Masinitzi.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'FIFA',
                slug: 'fifa',
                description: 'Random description for FIFA.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'Angry birds',
                slug: 'angry birds',
                description: 'Random description for Angry birds.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'San Andres',
                slug: 'san andres',
                description: 'Random description for San Andres.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'Cherviciki',
                slug: 'cherviciki',
                description: 'Random description for Cherviciki.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            },
            {
                title: 'Tanciki',
                slug: 'tanciki',
                description: 'Random description for Tanciki.',
                thumbnailUrl: Buffer.from('urlImg'),
                thumbnailType: 'imagetype'
            }
        ]
        // await prisma.category.createMany({
        //     data: categoriesData
        // })

        Logger.log('Categoriele au fost incarcate cu succes')

        const categories = await prisma.category.findMany()

        const categoriesBySlug = Object.fromEntries(
            categories.map(category => [category.slug, category])
        )
        const streamTitles: Record<string, string[]> = {
            'warcraft': [
                'Random stream text 1 for WarCraft',
                'Random stream text 2 for WarCraft',
                'Random stream text 3 for WarCraft'
            ],
            'spider man': [
                'Random stream text 1 for Spider-Man',
                'Random stream text 2 for Spider-Man',
                'Random stream text 3 for Spider-Man'
            ],
            'call of duty': [
                'Random stream text 1 for Call-of-duty',
                'Random stream text 2 for Call-of-duty',
                'Random stream text 3 for Call-of-duty'
            ],
            'masinitzi': [
                'Random stream text 1 for Masinitzi',
                'Random stream text 2 for Masinitzi',
                'Random stream text 3 for Masinitzi'
            ],
            'fifa': [
                'Random stream text 1 for FIFA',
                'Random stream text 2 for FIFA',
                'Random stream text 3 for FIFA'
            ],
            'angry birds': [
                'Random stream text 1 for Angry birds',
                'Random stream text 2 for Angry birds',
                'Random stream text 3 for Angry birds'
            ],
            'san andres': [
                'Random stream text 1 for San Andres',
                'Random stream text 2 for San Andres',
                'Random stream text 3 for San Andres'
            ],
            'cherviciki': [
                'Random stream text 1 for Cherviciki',
                'Random stream text 2 for Cherviciki',
                'Random stream text 3 for Cherviciki'
            ],
            'tanciki': [
                'Random stream text 1 for Tanciki',
                'Random stream text 2 for Tanciki',
                'Random stream text 3 for Tanciki'
            ]
        }

        const usernames = [
            'Yra',
            'ahmed',
            'Ara',
            'Petru',
            'Alia',
            'Artiom',
            'baku',
            'Vlad'
        ]

        await prisma.$transaction(async tx => {
            for (const username of usernames) {

                const randomCategory =
                    categoriesBySlug[
                    Object.keys(categoriesBySlug)[
                    Math.floor(Math.random() * Object.keys(categoriesBySlug).length)
                    ]
                    ]



                const userExist = await tx.user.findUnique({
                    where: {
                        username
                    }
                })

                if (!userExist) {
                    const createUser = await tx.user.create({
                        data: {
                            email: `${username}@morarescu.com`,
                            password: await hash('12345678'),
                            username,
                            displayName: username,
                            avatar: null,
                            isEmailVerified: true,
                            socialLinks: {
                                createMany: {
                                    data: [
                                        {
                                            title: 'Telegram',
                                            url: 'https://t.me',
                                            position: 1
                                        },
                                        {
                                            title: 'Youtube',
                                            url: 'https://youtube.com',
                                            position: 2
                                        }
                                    ]
                                }
                            }
                        }
                    })

                    const randomTitles = streamTitles[randomCategory.slug]

                    const randomTitle = randomTitles[Math.floor(Math.random() * randomTitles.length)]

                    await tx.stream.create({
                        data: {
                            title: randomTitle,
                            thumbnailUrl: null,
                            user: {
                                connect: {
                                    id: createUser.id
                                }
                            },
                            category: {
                                connect: {
                                    id: randomCategory.id
                                }
                            }
                        }
                    })

                    Logger.log(`Utilizatorul ${createUser.username} si pagina lui success s-a salvat`)
                }

            }
        })

        Logger.log('S-a salvat tot cu success in baza de date')

    } catch (error) {
        Logger.log(error)
        throw new BadRequestException('Erroare la incarcarea datelor')
    } finally {
        Logger.log('Deconectarea cu baza de date')
        await prisma.$disconnect()
        Logger.log('Connectarea cu baza de date s-a incheiat cu success.')
    }
}

main()