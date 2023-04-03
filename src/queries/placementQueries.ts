export const PLACEMENT_QUERY = `
    query EventStandings($eventId: ID!, $page: Int!) {
        event(id: $eventId) {
        standings(query: {
            perPage: 500,
            page: $page
        }){
            nodes {
                placement
                entrant {
                    participants {
                        player {
                            gamerTag
                            id
                        }
                    }
                }
            }
        }
        }
    }
`

export const PLACEMENT_PAGE_QUERY = `
    query EventStandings($eventId: ID!) {
        event(id: $eventId) {
            standings(query: {perPage: 500}) {
                pageInfo {
                    totalPages
                }
            }
        }
    }
`