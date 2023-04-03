import { EventResponse } from "../models/event";
import { ParticipantsResponse } from "../models/player";
import { SetsResponse } from "../models/tourneySet";

export interface StartGGAPIResponse {
    data: any;
}

export interface EventPagesAPIResponse extends StartGGAPIResponse {
    data: {
        tournaments: {
            pageInfo: {
                totalPages: number;
            }
        }
    }
};

export interface EventAPIResponse extends StartGGAPIResponse {
    data: {
        tournaments: {
            nodes: {
                events: EventResponse[]
            }[];
        }
    }
};

export interface EntrantsAPIResponse extends StartGGAPIResponse {
    data: {
        event: {
            entrants: {
                nodes: {
                    participants: ParticipantsResponse;
                    standing: {
                        placement: number;
                    }
                }[]
            }
        }
    }
};

export interface SetsPagesAPIResponse extends StartGGAPIResponse {
    data: {
        event: {
            sets: {
                pageInfo: {
                    totalPages: number;
                }
            }
        }
    }
};

export interface SetsAPIResponse extends StartGGAPIResponse {
    data: {
        event: {
            sets: {
                nodes: SetsResponse[];
            }
        }
    }
};