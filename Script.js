let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];


// this function let the elements in your html to load first.
$(document).ready(function () { 
    // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
	// please note that in order to operate the function, in your html there should be a select element that hold the id categories.
	getCategories($("#catgories"));

	
});

/* questionsArray[0]:
category: "Science & Nature"
correct_answer: "False"
difficulty: "medium"
incorrect_answers: ["True"]
question: "The Neanderthals were a direct ancestor of modern humans."
type: "boolean"*/

var questionNum;
var score;
var gameOver;
var amount;

async function start(){ 
	totalHertsPerGame=3;
	questionNum=0;
	score=0;
	herts=['❤️','❤️','❤️'];
	gameOver=false;
	// questionsArray is the global array that recive the questions from the mock DB function named getQuestion
	// getQuestion USAGE: returns an array of questions, recives (amount, category , difficulty,type) all of the function parameters should be sent as a string!
	amount=getAmount();// amount = the number of questions you want to recive
	var cat=getCat();// category = the category of the questions 9-32
	var difficulty=getDifficulty();// difficulty = easy, medium, hard
	var type=getType();// type = multiple , boolean
	// getQuestion is an async function. in order to use it you have to use the keyword await.
	questionsArray =  await getQuestion(amount ,cat , difficulty ,type);
	innerQuestion();
    innerScore();
	innerHeart();
	innerAnswers();

}
function innerQuestion(){
	var q="";
	if (this.gameOver==true){
		q+="";
	}
	else{

		 q+="question: "+	questionsArray[questionNum].question;
	}
	document.getElementById("question").innerHTML=q;
}
function innerScore(){
	var s="";
	if (this.gameOver==true){s+="Your Total Score Is: ";}
	s+=score;
	document.getElementById("score").innerHTML=s;
}


	function innerHeart(){
		if(gameOver==true){
			herts="";
		}
	document.getElementById("heart").innerHTML=herts;
	}
	function getCat(){
		var cat=document.getElementById("catgories");
		return cat.value;
	}
	function getType(){
		var type=document.getElementById("type");
		return type.value;
	}
	function getDifficulty(){
		var difficulty=document.getElementById("difficulty");
		return difficulty.value;
	}
	function getAmount(){
		var amount=document.getElementById("amount");
		return amount.value;
	}

 
	function innerAnswers(){
		questionsArray[questionNum].incorrect_answers.push(questionsArray[questionNum].correct_answer);
		questionsArray[questionNum].incorrect_answers.sort();
		var button="";
		if (this.gameOver==true){
			//button+="<button class='btn btn-success'>Try again</button>";
		}
		else{
			for(var i=0;i<questionsArray[questionNum].incorrect_answers.length;i++){
				button+="<button id ='answer"+(i+1)+"' class='btn btn-primary' onclick='game("+(i+1)+")' value="+questionsArray[questionNum].incorrect_answers[i] +">"+questionsArray[questionNum].incorrect_answers[i] +"</button> ";
			}
		}
		button+="";
		document.getElementById("answers").innerHTML=button;
	}
	function ifTrue(i){
		var ans=document.getElementById("answer"+i);
		ans=ans.value;
		if(questionsArray[questionNum].correct_answer===ans){
			return 1;
		}
	return -100;
	}

  	function ifFalse(i){
	var ans=document.getElementById("answer"+i);
	ans=ans.value;
		if(questionsArray[questionNum].correct_answer!=ans){
			return 0;
		}
	return -100;
  }
  var herts;
  var totalHertsPerGame;
	function game(i){
		if((amount-1)==questionNum || totalHertsPerGame==1){gameOver=true;}

		if (gameOver==true){
			window.alert("Game Over");
			full();
		}

		else if(ifTrue(i)==1){
			this.questionNum++;
			this.score+=10;
			full();
		}

		else if (ifFalse(i)==0){
			this.questionNum++;
			totalHertsPerGame--;
			this.herts[herts.length--]-1;
			full();
		}
		
	}

	function full(){
		innerQuestion();
	    innerScore();
		innerHeart();
		innerAnswers();
	}


// Mock DB functions you should not edit!

function getCategories(select) {
    $.ajax({
        url: "https://opentdb.com/api_category.php",
        context: document.body
    }).done(function (data) {
        categories = data.trivia_categories;
        for (i in categories) {
            let cat = categories[i];
            let option = "<option value=" + cat.id + ">" + cat.name + "</option>"
            select.append(option);
        }
    });
}
function editUrl(amount, category , difficulty,type){
	urlHelper["amount"]='amount=' + amount;
	urlHelper["category"]='category=' + category;
	urlHelper["difficulty"]='difficulty=' + difficulty;
	urlHelper["type"]='type=' + type;
}
   
async function getQuestion(amount, category , difficulty,type) {
	editUrl(amount, category , difficulty,type);
	var arr= [] ;
    var url = 'https://opentdb.com/api.php?' + urlHelper.amount
            + '&' + urlHelper.category
            + '&' + urlHelper.difficulty
            + '&' + urlHelper.type
			
	var res = await fetch(url);
	var data = await res.json();
	return data.results;
}
