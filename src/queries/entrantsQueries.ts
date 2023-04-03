export const ENTRANTS_QUERY = `
    query EventEntrants($eventId: ID!) {
        event(id: $eventId) {
            entrants(query: {
                perPage: 500
            }) {
                nodes {
                    standing {
                        placement
                    }
                    participants {
                        player {
                            id
                            gamerTag
                            prefix
                            user {
                                genderPronoun
                                name
                                authorizations {
                                    type
                                    externalUsername
                                }
                                images {
                                    url
                                    type
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
