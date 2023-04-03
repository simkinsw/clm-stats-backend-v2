from PIL import Image, ImageFont, ImageDraw, ImageOps
from io import BytesIO
import boto3
import json

ZOOM = {
    "marth": 1.4,
    "fox": 1.2,
    "jigglypuff": 1,
    "captainfalcon": 1.1,
    "samus": .9,
    "ganondorf": 1.2,
    "luigi": 1.1,
    "sheik": .9
}

FONT_SIZES = [
    96, 64, 64, 64, 50, 50, 50, 50
]

PADDINGS = [
    (15, 15), (15, 15), (15, 15), (15, 15), (10, 10), (10, 10), (10, 10), (10, 10)
]

BOUNDS = [
    [520, 900],
    [290, 450],
    [290, 450],
    [290, 450],
    [220, 300],
    [220, 300],
    [220, 300],
    [220, 300]
]

CROPS = [
    [550, 1000],
    [315, 500],
    [315, 500],
    [315, 500],
    [240, 400],
    [240, 400],
    [240, 400],
    [240, 400]
]

CHAR_COORDS = [
    [780, 230],
    [1200, 190],
    [1507, 190],
    [1814, 190],
    [1130, 765],
    [1370, 765],
    [1590, 765],
    [1830, 765]
]

NAME_COORDS = [
    [1008, 1084],
    [1340, 637],
    [1642, 637],
    [1947, 637],
    [1232, 1080],
    [1458, 1080],
    [1690, 1080],
    [1915, 1080]
]

WHITE = (248, 248, 248)
BLUE = (11, 120, 189)

S3 = boto3.client("s3", "us-east-1")
lambdaClient = boto3.client("lambda")
BUCKET = "top8-graphics"


def fromS3(key):
    file_byte_string = S3.get_object(Bucket=BUCKET, Key="" + key)['Body'].read()
    return BytesIO(file_byte_string)

def saveImageToS3(img, key):
    buffer = BytesIO()
    img.save(buffer, "PNG")
    buffer.seek(0)
    S3.put_object(Bucket=BUCKET, Key="" + key, Body=buffer)
    print("saved graphic to top8/" + key)

def invokeLambda():
    lambdaClient.invoke(
        FunctionName='clmstats-post-top8-graphic',
        InvocationType='Event',
        Payload=json.dumps({
            'source': 'aws.lambda',
            'detail-type': 'post-top8-graphic',
            'detail': { 'channel': 'TEST'},
        })
    )

def generateGraphic(data):
    img = Image.open(fromS3("images/template.png"))
    
    #number/date text
    draw = ImageDraw.Draw(img);

    boldfont = ImageFont.truetype(fromS3("fonts/URWDINCond-Bold.ttf"), 64)
    regfont = ImageFont.truetype(fromS3("fonts/URWDINCond-Regular.ttf"), 64)

    draw.text((125, 710), "#" + str(data["number"]), WHITE, font=boldfont)
    draw.text((205, 710), " - " + data["date"], WHITE, font=regfont)

    #character images
    for i in range(8):
        player = data["players"][i]
        character = player["character"]
        color = player["color"]
        charImage = Image.open(fromS3("images/" + character + "-" + color + ".png"))
        
        charImage = charImage.crop(charImage.getbbox());
        zoom = ZOOM.get(character, 1)
        bounds = [int(BOUNDS[i][0] * zoom), int(BOUNDS[i][1] * zoom)]
        charImage = ImageOps.contain(charImage, bounds)
        excess = [max((charImage.width - CROPS[i][0]) / 2, 0), 
                    max((charImage.height - CROPS[i][1]) / 2, 0)]
        charImage = charImage.crop((excess[0], excess[1], charImage.width-excess[0], charImage.height-excess[1]))
        
        img.paste(charImage, (CHAR_COORDS[i][0] - int(charImage.width/2), CHAR_COORDS[i][1]), mask=charImage)

    #frames
    frames = Image.open(fromS3("images/frames.png"))
    img.paste(frames, mask=frames)
    
    #text
    for i in range(8):
        tag = data["players"][i]["tag"].upper()
        fontSize = FONT_SIZES[i]
        tagFont = ImageFont.truetype(fromS3("fonts/URWDINCond-BoldItalic.ttf"), fontSize)
        
        txt = Image.new("L", (500, 200));
        txtImage = ImageDraw.Draw(txt);
        txtImage.text((0, 0), tag, font=tagFont, fill=248)

        txt = txt.crop(txt.getbbox());

        padding = PADDINGS[i]
        bg = Image.new("RGBA", (txt.width + 2*padding[0], txt.height + 2*padding[1]), BLUE)
        bg.paste(txt, padding, mask=txt)

        t = bg.rotate(86.27, expand=1, fillcolor=(255, 255, 255, 0))
        img.paste(t, (NAME_COORDS[i][0] - bg.height, NAME_COORDS[i][1] - bg.width), mask=t)
    
    return img
    


def handler(event, context):
    img = generateGraphic(event["data"])
    saveImageToS3(img, "output/" + str(event["data"]["number"]) + ".png")
    invokeLambda()
