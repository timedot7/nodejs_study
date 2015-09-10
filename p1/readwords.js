var censor = require("timedot7");
console.log(censor.getCensoredWords());
console.log(censor.censor("Some ver sad, bad and mad text."));
censor.addCensoredWord("gloomy");
console.log(censor.getCensoredWords());
console.log(censor.censor("A very gloomy day."));