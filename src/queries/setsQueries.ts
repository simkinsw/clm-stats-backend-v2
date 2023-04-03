export const SETS_PAGE_QUERY = `
    query EventSets($eventId: ID!) {
        event(id: $eventId) {
            sets(perPage: 80) {
                pageInfo {
                    totalPages
                }
            }
        }
    }
`;

export const SETS_QUERY = `
    query EventSets($eventId: ID!, $page: Int!) {
        event(id: $eventId) {
            sets(perPage: 80, page: $page) {
                nodes {
                    id
                    displayScore
                    winnerId
                    fullRoundText
                    event {
                        id
                    }
                    slots {
                        entrant {
                            id
                            participants {
                                player {
                                    id
                                    gamerTag
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
