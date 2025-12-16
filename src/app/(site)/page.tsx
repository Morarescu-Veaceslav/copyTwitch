import { CategoriesList } from "@/components/features/category/list/CategoriesList";
import { StreamList } from "@/components/features/stream/list/StreamList";
import {
  FindRandomCategoriesDocument,
  FindRandomStreamsDocument,
  type FindRandomCategoriesQuery,
  type FindRandomStreamsQuery
} from "@/graphql/generated/output";
import { SERVER_URL } from "@/libs/constants/url.constants";
import { getTranslations } from "next-intl/server";

async function findRandomStreams() {
  try {

    const query = FindRandomStreamsDocument.loc?.source.body

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
      streams: data.data.findRandomStreams as FindRandomStreamsQuery['findRandomStreams']
      //streams: FindRandomStreamsQuery['findRandomStreams'] = data.data.findRandomStreams
    }

  } catch (error) {
    throw new Error('Error fetching streams')
  }
}

async function findRandomCategories() {
  try {

    const query = FindRandomCategoriesDocument.loc?.source.body

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
      categories: data.data.findRandomCategories as FindRandomCategoriesQuery['findRandomCategories']
    }

  } catch (error) {
    throw new Error('Error fetching categories')
  }
}


export default async function Home() {

  const translation = await getTranslations('home')

  const { streams } = await findRandomStreams()
  const { categories } = await findRandomCategories()

  return (
    <div className='space-y-10 w-full'>
      <StreamList heading={translation('streamsHeading')} streams={streams} />
      <CategoriesList heading={translation('categoriesHeading')} categories={categories} />
    </div>

  );
}
