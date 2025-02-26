import gql from '.'

export interface FavoriteHentai {
    title: {
        display: string
    }
    images: {
        cover: {
            link: string
            info: {
                width: number
                height: number
            }
        }
    }
    info: {
        amount: number
        favorite: number
    }
    metadata: {
        language: string
    }
}

export interface FavoriteHentaisVariable {
    id: number[]
}

export interface FavoriteHentais {
    nhql: {
        multiple: {
            success: boolean
            data: FavoriteHentaiData[] | null
        }
    }
}

export interface FavoriteHentaiData {
    id: number
    success: boolean
    data: FavoriteHentai
}

export const favoriteHentaisDocument = `query GetFavoriteHentais($id: [Int!]!) {
nhql {
  multiple(id: $id) {
    success
      data {
        success
        data {
          title {
            display
          }
          images {
            cover {
              link
              info {
                width
                height
              }
            }
          }
          info {
            amount
            favorite
          }
          metadata {
            language
          }
        }
      }
    }
  }
}`

const getFavoriteHentais = async (
    id: number[]
): Promise<FavoriteHentaiData[] | null> => {
    if (!id.length) return

    const data = await gql<FavoriteHentais, FavoriteHentaisVariable>(
        favoriteHentaisDocument,
        {
            variables: {
                id
            }
        }
    )

    if (
        Array.isArray(data) ||
        data instanceof Error ||
        !data.nhql.multiple.data
    )
        return

    return data.nhql.multiple.data.map((x, index) => ({
        id: id[index],
        ...x
    }))
}

export default getFavoriteHentais
