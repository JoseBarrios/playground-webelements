var CLViews = require('../index.js');
var riot = require('riot')
var fs = require('fs');


var viewModel = {}
viewModel.required= true ;
viewModel.stemQuestion = 'Choose the correct answer';
viewModel.stemIndex= 1;
viewModel.stemDescription= 'This is an example';
viewModel.alternativesInstructions = "Select more than one";
viewModel.alternatives = ['Tacos', 'Burritos', 'Kisses'];


//var view = CLViews.getView('MultipleChoiceQuestion', viewModel);
//console.log(view);




/*fs.readFile(__dirname+'/../views/ratingScaleQuestion.html', 'utf-8', function(err, html){*/
//fs.readFile(__dirname+'/../styles/multipleChoiceQuestionStyle.css', 'utf-8', function(err, css){
//var tag = riot.tag('cl-mcq', html, css, function(opts){
//console.log('HELLO', this, opts)
//});
//})
//})



