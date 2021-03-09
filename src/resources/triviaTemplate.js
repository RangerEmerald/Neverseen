class Trivia {
    constructor (question, answer, acceptable, image = null, toImage = null, name = "shortanswer") {
        this.question = question;
        this.answer = answer;
        this.acceptable = acceptable;
        this.image = image;
        this.name = name;
        this.id = Math.round(Math.random() * 9999999);
        this.toImage = toImage;
    }
}

class MutipleChoiceTrivia extends Trivia {
    constructor (question, a, b, c, d, answer, acceptable, image, toImage = null) {
        super(question, answer, acceptable, image, toImage, "mutiplechoice");
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
}

module.exports = { Trivia, MutipleChoiceTrivia };