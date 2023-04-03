export const EVENT_QUERY = `
    query ChicagoTournaments($page: Int!, $coordinates: String!, $radius: String!, $state: String, $afterDate: Timestamp!, $beforeDate: Timestamp) {
        tournaments(query: {
            perPage: 20
            page: $page
            filter: {
                location: {
                    distanceFrom: $coordinates,
                    distance: $radius
                },
                addrState: $state,
                afterDate: $afterDate,
                beforeDate: $beforeDate,
                upcoming: false,
                videogameIds: [1],
            }
        }) {
            nodes {
                events(filter: {type: 1, videogameId: 1}) {
                    id
                    numEntrants
                    slug
                    name
                    tournament {
                        name
                        endAt
                        images {
                            url
                            type
                        }
                    }
                }
            }
        }
    }
`;

export const EVENT_PAGE_QUERY = `
    query ChicagoTournaments($coordinates: String!, $radius: String!, $state: String) {
        tournaments(query: {
            perPage: 20
            filter: {
                location: {
                    distanceFrom: $coordinates,
                    distance: $radius
                },
                addrState: $state,
                afterDate: 1672552800,
                upcoming: false,
                videogameIds: [1],
            }
        }) {
            pageInfo {
                totalPages
            }
        }
    }
`