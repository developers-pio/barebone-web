export const keywordSearchQuery = `query eventKeywordSearch($first: Int, $after: String, $query: String!, $lat: Float!, $lon: Float!, $startDateRange: ZonedDateTime, $endDateRange: ZonedDateTime, $eventType: EventType, $radius: Int, $source: [SearchSources!]!, $sortField: KeywordSortField) {
    results: keywordSearch(
      input: {first: $first, after: $after}
      filter: {query: $query, lat: $lat, lon: $lon, source: $source, startDateRange: $startDateRange, endDateRange: $endDateRange, eventType: $eventType, radius: $radius}
      sort: {sortField: $sortField}
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      count
      edges {
        node {
            id
            result {
                ... on Event {
                    id
            title
            dateTime
            endTime
            description
            duration
            timezone
            eventType
            currency
            imageUrl
            venue {
                id
                address
                neighborhood
                city
                state
                country
                lat
                lng
                zoom
                name
                radius
            }
            onlineVenue {
                type
                url
            }
            eventUrl
            fees {
                processingFee {
                    amount
                    type
                }
            }
            maxTickets
            host {
                id
                name
            }
                }
                }
                }
            }
        }
    }
}`;

export const categorySearchQuery = `query categorySearch($lat: Float!, $lon: Float!, $categoryId: Int, $topicCategoryId: Int, $startDateRange: ZonedDateTime, $endDateRange: ZonedDateTime, $first: Int, $after: String, $eventType: EventType, $radius: Int, $isHappeningNow: Boolean, $isStartingSoon: Boolean, $sortField: RankedEventsSortField) {
    rankedEvents(
      filter: {lat: $lat, lon: $lon, categoryId: $categoryId, topicCategoryId: $topicCategoryId, startDateRange: $startDateRange, endDateRange: $endDateRange, eventType: $eventType, radius: $radius, isHappeningNow: $isHappeningNow, isStartingSoon: $isStartingSoon}
      input: {first: $first, after: $after}
      sort: {sortField: $sortField}
    ) {
      pageInfo {
        hasNextPage
        endCursor
      }
      count
      edges {
        node {
            id
            title
            dateTime
            endTime
            description
            duration
            timezone
            eventType
            currency
            imageUrl
            venue {
                id
                address
                neighborhood
                city
                state
                country
                lat
                lng
                zoom
                name
                radius
            }
            onlineVenue {
                type
                url
            }
            eventUrl
            fees {
                processingFee {
                    amount
                    type
                }
            }
            maxTickets
            host {
                id
                name
            }
        }
      }
    }
  }
  `;
export const eventQuery = ($id) => {
  return `query{
        event(id: ${$id}){
            id
            title
            dateTime
            endTime
            description
            duration
            timezone
            eventType
            currency
            imageUrl
            venue {
                id
                address
                neighborhood
                city
                state
                country
                lat
                lng
                zoom
                name
                radius
            }
            onlineVenue {
                type
                url
            }
            eventUrl
            fees {
                processingFee {
                    amount
                    type
                }
            }
            maxTickets
            host {
                id
                name
            }
            topics {
                edges {
                    cursor
                    node {
                        urlkey
                        name
                        id
                    }
                }
            }
            priceTier
        }
    }`;
};
