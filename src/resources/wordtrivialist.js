const { MutipleChoiceTrivia, Trivia } = require("./triviaTemplate");

const list = ["kazoo", "join the band", "all hail king gethen", "*kazoo noises*", "welcome councillor liora", "neverseen only", "neverseen > blackswan"];
const replylist = [["dead chat", "If the chat is so dead, why don't you try and talk some?"], ["kazoo", "kazoo"]];

const trivia = [
    new MutipleChoiceTrivia("What does the Neverseen Symbol look like?", "A Swan", "A Crown", "An Eye", "Other", "An Eye", "eye"), 
    new MutipleChoiceTrivia("What book is this image from?", "Exile", "Neverseen", "Lodestar", "Unlocked", "Lodestar", "lodestar", "https://static.wikia.nocookie.net/lost-cities-keeper/images/2/25/NeverseenCloak.png/revision/latest/scale-to-width-down/180?cb=20210122173449"),
    new Trivia("Who says \"You kids\"?", "mr forkle", "forkle"),
    new MutipleChoiceTrivia("What was Keefe's first sentence to Sophie?", "You must be lost", "Look at my hair!", "Why are you here?", "Do you need help?", "You must be lost", "you must be lost", "https://static.wikia.nocookie.net/lost-cities-keeper/images/b/b3/Keefe_Sencen_Color.jpg/revision/latest/scale-to-width-down/500?cb=20161004030505"),
    new Trivia("Who said \"Actions never tell the whole story\"?", "linh", "linh song"),
    new Trivia("Who says \"There is no reason to worry\"?", "alden", "alden vacker"),
    new MutipleChoiceTrivia("Who said \"Dex, your girlfriends are here\"?", "Rex", "Lex", "Bex", null, "Bex", "bex", "https://static.wikia.nocookie.net/lost-cities-keeper/images/6/6e/IMG_1311.jpg/revision/latest?cb=20201202182504"),
    new MutipleChoiceTrivia("Who did Gethen say \“But wouldn't it be ironic if someday I used that blade to chop off your pretty head?\” to?", "Mr Forkle", "Oralie", "Sophie", "Edaline", "Oralie", "oralie", "https://static.wikia.nocookie.net/lost-cities-keeper/images/2/26/Lumenaria.png/revision/latest/scale-to-width-down/1000?cb=20210205234315"),
    new Trivia("Who said \"Hind Sight is a dangerous game to play\"?", "edaline", "edaline ruewen"),
    new Trivia("What is Vespera's middle name?", "neci", null, "https://static.wikia.nocookie.net/lost-cities-keeper/images/a/aa/Vespera.png/revision/latest/scale-to-width-down/310?cb=20181003172612"),
    new Trivia("Where is Nightfall?", "atlantis", null, "https://static.wikia.nocookie.net/lost-cities-keeper/images/e/ec/Nightfall_Symbol.png/revision/latest/scale-to-width-down/267?cb=20190531232322"),
    new Trivia("What is Gethen's hair color?", "blond", "blonde"),
    new Trivia("Who is this character?", "alvar", "alvar vacker", "https://static.wikia.nocookie.net/lost-cities-keeper/images/8/82/Screenshot_2018-09-24_at_1.20.24_PM.png/revision/latest/scale-to-width-down/310?cb=20180924173856"),
    new Trivia("What does Ruy always wair?", "addler", null),
    new Trivia("What does \"Fintain\" mean?", "white fire", "fire"),
    new Trivia("What is this place?", "oblivimyre", null, "https://static.wikia.nocookie.net/lost-cities-keeper/images/f/f8/B1C9F955-56DE-4B85-BCB1-7B14B2536B43.jpeg/revision/latest/scale-to-width-down/266?cb=20190719024628"),
    new Trivia("What is this place?", "eternalia", null, "https://static.wikia.nocookie.net/lost-cities-keeper/images/6/62/ET.png/revision/latest/scale-to-width-down/310?cb=20210122153022"),
    new MutipleChoiceTrivia("Who's caches does Sophie have?", "Oralie and Kenric", "Oralie and Fintain", "Kenric and Fintain", null, "Kenric and Fintain", "kenric and fintain"),
    new Trivia("What ability does Loira have?", "conjurer", null),
    new Trivia("What is Lady Gesila's middle name?", "minette", null),
    new Trivia("Who is this image of?", "alden", "alden vacker", "https://static.wikia.nocookie.net/lost-cities-keeper/images/6/60/Alden_Pic.png/revision/latest/scale-to-width-down/310?cb=20180919175901"),
    new Trivia("What is this place?", "exillium", null, "https://static.wikia.nocookie.net/lost-cities-keeper/images/7/78/Exillium.png/revision/latest/scale-to-width-down/273?cb=20201201073359")
];

module.exports = {list, replylist, trivia};