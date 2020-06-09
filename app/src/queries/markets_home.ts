import { BigNumber } from 'ethers/utils'
import gql from 'graphql-tag'

import { IS_CORONA_VERSION } from './../common/constants'
import { MarketFilters, MarketStates, MarketsSortCriteria } from './../util/types'

export const MarketDataFragment = gql`
  fragment marketData on FixedProductMarketMaker {
    id
    collateralVolume
    collateralToken
    outcomeTokenAmounts
    title
    outcomes
    openingTimestamp
    arbitrator
    category
    templateId
  }
`

export type GraphMarketMakerDataItem = {
  id: string
  collateralVolume: string
  collateralToken: string
  outcomeTokenAmounts: string[]
  title: string
  outcomes: Maybe<string[]>
  openingTimestamp: string
  arbitrator: string
  category: string
  templateId: string
}

export type MarketMakerDataItem = {
  address: string
  collateralVolume: BigNumber
  collateralToken: string
  outcomeTokenAmounts: BigNumber[]
  title: string
  outcomes: Maybe<string[]>
  openingTimestamp: Date
  arbitrator: string
  category: string
  templateId: number
}

export const DEFAULT_OPTIONS = {
  state: MarketStates.open,
  whitelistedCreators: false,
  whitelistedTemplateIds: true,
  category: 'All',
  title: null as Maybe<string>,
  arbitrator: null as Maybe<string>,
  templateId: null as Maybe<string>,
  currency: null as Maybe<string>,
  sortBy: null as Maybe<MarketsSortCriteria>,
  sortByDirection: (IS_CORONA_VERSION ? 'asc' : 'desc') as 'asc' | 'desc',
}

type buildQueryType = MarketFilters & { whitelistedCreators: boolean; whitelistedTemplateIds: boolean }
export const buildQueryMarkets = (options: buildQueryType = DEFAULT_OPTIONS) => {
  const {
    arbitrator,
    category,
    currency,
    state,
    templateId,
    title,
    whitelistedCreators,
    whitelistedTemplateIds,
  } = options
  const whereClause = [
    state === MarketStates.closed ? 'answerFinalizedTimestamp_lt: $now' : '',
    state === MarketStates.open ? 'answerFinalizedTimestamp: null' : '',
    state === MarketStates.pending ? 'answerFinalizedTimestamp_gt: $now' : '',
    state === MarketStates.myMarkets || whitelistedCreators ? 'creator_in: $accounts' : '',
    category === 'All' ? '' : 'category: $category',
    title ? 'title_contains: $title' : '',
    currency ? 'collateralToken: $currency' : '',
    arbitrator ? 'arbitrator: $arbitrator' : '',
    templateId ? 'templateId: $templateId' : whitelistedTemplateIds ? 'templateId_in: ["0", "2", "6"]' : '',
    'fee: $fee',
  ]
    .filter(s => s.length)
    .join(',')

  const query = gql`
    query GetMarkets($first: Int!, $skip: Int!, $sortBy: String, $sortByDirection: String, $category: String, $title: String, $currency: String, $arbitrator: String, $templateId: String, $accounts: [String!], $now: Int, $fee: String) {
      fixedProductMarketMakers(first: $first, skip: $skip, orderBy: $sortBy, orderDirection: $sortByDirection, where: { ${whereClause} }) {
        ...marketData
      }
    }
    ${MarketDataFragment}
  `
  return query
}
