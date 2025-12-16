import { CategoriesList } from "@/components/features/category/list/CategoriesList"
import { FindAllCategoriesDocument, FindAllCategoriesQuery } from "@/graphql/generated/output"
import { SERVER_URL } from "@/libs/constants/url.constants"
import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"



async function findAllCategories() {
    try {

        const query = FindAllCategoriesDocument.loc?.source.body

        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query }),
            next: {
                revalidate: 30
            }
        })

        const data = await response.json()

        return {
            categories: data.data.findAllCategories as FindAllCategoriesQuery['findAllCategories']
        }

    } catch (error) {
        throw new Error('Error fetching categories')
    }

}

export async function generateMetadata(): Promise<Metadata> {
    const translation = await getTranslations('categories')

    return {
        title: translation('heading')
    }
}



export default async function CategoriesPage() {
    const translation = await getTranslations('categories')
    const { categories } = await findAllCategories()

    return <div className='space-y-10 w-full'>
        <CategoriesList heading={translation('heading')} categories={categories} />
    </div>

}