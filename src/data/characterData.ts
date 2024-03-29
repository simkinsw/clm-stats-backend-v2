export function getCharacterData(player: string) {
    return CHARACTER_DATA.get(player);
}

const CHARACTER_DATA = new Map<string, { character: string; color: string }>([
    [
        "Skerzo",
        {
            character: "fox",
            color: "red",
        },
    ],
    [
        "Michael",
        {
            character: "jigglypuff",
            color: "red",
        },
    ],
    [
        "Ober",
        {
            character: "falco",
            color: "red",
        },
    ],
    [
        "Ferocitii",
        {
            character: "peach",
            color: "blue",
        },
    ],
    [
        "Killablue",
        {
            character: "falco",
            color: "default",
        },
    ],
    [
        "Hyunnies",
        {
            character: "marth",
            color: "white",
        },
    ],
    [
        "Unsure",
        {
            character: "fox",
            color: "blue",
        },
    ],
    [
        "Mekk",
        {
            character: "ganondorf",
            color: "default",
        },
    ],
    [
        "Arpy",
        {
            character: "marth",
            color: "red",
        },
    ],
    [
        "Forest",
        {
            character: "marth",
            color: "default",
        },
    ],
    [
        "FoxCap",
        {
            character: "fox",
            color: "green",
        },
    ],
    [
        "GI0GOAT",
        {
            character: "fox",
            color: "blue",
        },
    ],
    [
        "macdaddy69",
        {
            character: "captainfalcon",
            color: "default",
        },
    ],
    [
        "Dragoid",
        {
            character: "falco",
            color: "default",
        },
    ],
    [
        "ORLY",
        {
            character: "captainfalcon",
            color: "gray",
        },
    ],
    [
        "Frost",
        {
            character: "samus",
            color: "black",
        },
    ],
    [
        "Azzu",
        {
            character: "falco",
            color: "blue",
        },
    ],
    [
        "Tranimal",
        {
            character: "sheik",
            color: "green",
        },
    ],
    [
        "lovestory4a",
        {
            character: "sheik",
            color: "red",
        },
    ],
    [
        "Scooby",
        {
            character: "sheik",
            color: "default",
        },
    ],
    [
        "Q?",
        {
            character: "drmario",
            color: "blue",
        },
    ],
    [
        "Eggy",
        {
            character: "peach",
            color: "yellow",
        },
    ],
    [
        "Olivia :3",
        {
            character: "marth",
            color: "black",
        },
    ],
    [
        "Kumi",
        {
            character: "yoshi",
            color: "pink",
        },
    ],
    [
        "Certified",
        {
            character: "fox",
            color: "default",
        },
    ],
    [
        "Larfen",
        {
            character: "sheik",
            color: "green",
        },
    ],
    [
        "Umma",
        {
            character: "marth",
            color: "black",
        },
    ],
    [
        "Rocks",
        {
            character: "puff",
            color: "red",
        },
    ],
    [
        "Fry",
        {
            character: "peach",
            color: "default",
        },
    ],
    [
        "Fasthands",
        {
            character: "mewtwo",
            color: "green",
        },
    ],
    [
        "Nox",
        {
            character: "sheik",
            color: "default",
        },
    ],
    [
        "Pleeba",
        {
            character: "sheik",
            color: "default",
        },
    ],
    [
        "Phalanx",
        {
            character: "peach",
            color: "white",
        },
    ],
    [
        "Basil",
        {
            character: "fox",
            color: "default",
        },
    ],
    [
        "Jakespeare",
        {
            character: "marth",
            color: "green",
        },
    ],
    [
        "Stump",
        {
            character: "captainfalcon",
            color: "pink",
        },
    ],
    [
        "The Meadow",
        {
            character: "fox",
            color: "default",
        },
    ],
    [
        "TAO",
        {
            character: "captainfalcon",
            color: "default",
        },
    ],
    [
        "DZ",
        {
            character: "yoshi",
            color: "yellow",
        },
    ],
    [
        "Zamu",
        {
            character: "fox",
            color: "orange",
        },
    ],
    [
        "ellis",
        {
            character: "sheik",
            color: "white",
        },
    ],
    [
        "justjoe",
        {
            character: "fox",
            color: "default",
        },
    ],
    [
        "shabo",
        {
            character: "fox",
            color: "default",
        },
    ],
    [
        "Don Hudson",
        {
            character: "marth",
            color: "green",
        },
    ],
    [
        "Mattchu",
        {
            character: "falco",
            color: "green",
        },
    ],
    [
        "Fluid",
        {
            character: "iceclimbers",
            color: "green",
        },
    ],
    [
        "Moe",
        {
            character: "donkeykong",
            color: "blue"
        }
    ],
    [
        "Preeminent",
        {
            character: "fox",
            color: "default"
        }
    ],
    [
        "Peanutphobia",
        {
            character: "yoshi",
            color: "darkblue"
        }
    ],
    [
        "bigoldchub",
        {
            character: "falco",
            color: "default"
        }
    ],
    [
        "natebug01",
        {
            character: "jigglypuff",
            color: "red"
        }
    ],
    [
        "Linkbane",
        {
            character: "ganondorf",
            color: "red"
        }
    ],
    [
        "Josh",
        {
            character: "jigglypuff",
            color: "green"
        }
    ],
    [
        "IMDRR",
        {
            character: "falco",
            color: "green"
        }
    ],
    [
        "Jopps",
        {
            character: "captainfalcon",
            color: "green"
        }
    ],
    [
        "Knubs.",
        {
            character: "captainfalcon",
            color: "gray"
        }
    ],
    [
        "perfume",
        {
            character: "sheik",
            color: "red",
        },
    ],
    [
        "deez",
        {
            character: "sheik",
            color: "default"
        }
    ],
    [
        "Tao",
        {
            character: "pikachu",
            color: "default"
        }
    ],
    [
        "Trail",
        {
            character: "iceclimbers",
            color: "default"
        }
    ],
    [
        "Kels",
        {
            character: "fox",
            color: "green"
        }
    ],
    [
        "Blue",
        {
            character: "fox",
            color: "default"
        }
    ]
]);
