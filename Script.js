$(document).ready(function () { 
    // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
	// please note that in order to operate the function, in your html there should be a select element that hold the id categories.
	getCategories($("#catgories"));
});
//<------- global ------>
let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];
var questionNum;// the number of question in real time.
var score;// score.
var gameOver;// gameOver.
var amount;// amount.
var AnswerCorrectly;// Total Answer Correctly.
var herts;//Total Hearts of Game .
var totalHertsPerGame;// Total Hearts of Game.
//<------functions------>
async function start(){ 
	totalHertsPerGame=3;
	questionNum=0;
	score=0; // Total Score in real time.
	AnswerCorrectly=0;
	herts=['❤️','❤️','❤️'];// Array of Hearts. / Point / HP. 
	gameOver=false;// boolean => if game active == false .
	amount=getAmount();// amount = the number of questions you want to recive.
	var cat=getCat();// category = the category of the questions 9-32.
	var difficulty=getDifficulty();// difficulty = easy, medium, hard.
	var type=getType(); // type of questions .
	// getQuestion is an async function. in order to use it you have to use the keyword await.
	questionsArray =  await getQuestion(amount ,cat , difficulty ,type);
	fill();// Fill () => inners : questions , Answers , Hearts.

}
	function innerQuestion(){// function innerHTML to question.
		var q="";
		if (this.gameOver==true){
			q+="";
		}
		else{

			q+="question: "+	questionsArray[questionNum].question;
		}
		document.getElementById("question").innerHTML=q;
	}
	function innerScore(){// function innerHTML to Score.
	var s="";
	if (this.gameOver==true){s+="Your Total Score Is: ";}
	s+=score;
	document.getElementById("score").innerHTML=s;
	}	
	function innerHeart(){// function innerHTML to Heart.
		if(gameOver==true){
			herts="";
		}
	document.getElementById("heart").innerHTML=herts;
	}
	function getCat(){ // get from html
		var cat=document.getElementById("catgories");
		return cat.value;
	}
	function getType(){ // get from html
		var type=document.getElementById("type");
		return type.value;
	}
	function getDifficulty(){ // get from html
		var difficulty=document.getElementById("difficulty");
		return difficulty.value;
	}
	function getAmount(){ // get from html
		var amount=document.getElementById("amount");
		return amount.value;
	}
	function innerAnswers(){// function innerHTML to Answers.
		questionsArray[questionNum].incorrect_answers.push(questionsArray[questionNum].correct_answer);
		questionsArray[questionNum].incorrect_answers.sort();
		console.log(questionsArray[questionNum].correct_answer);
		console.log(questionsArray[questionNum].incorrect_answers);
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
	function innerResult(){// function innerHTML to Result By end of the game.
		var r="";
		if(gameOver==true){
			r+="result: "+AnswerCorrectly+"/"+amount;
		}
		else{r+="";}
		document.getElementById("result").innerHTML =r;
	}
	function ifTrue(i){// function cheak if the answer is correct. 
		var ans=document.getElementById("answer"+i);
		ans=ans.value;
		if(questionsArray[questionNum].correct_answer===ans){
			return 1;
		}
	return -100;
	}
	function ifFalse(i){// function cheak if the answer is Incorrect. 
	var ans=document.getElementById("answer"+i);
	ans=ans.value;
		if(questionsArray[questionNum].correct_answer!=ans){
			return 0;
		}
	return -100;
 	 }
	function game(i){// The function Manages the game.
		if((amount-1)==questionNum || totalHertsPerGame==1){gameOver=true;}

		if (gameOver==true){
			window.alert("Game Over");
			fill(); // Fill end game ! .
		}

		else if(ifTrue(i)==1){
			this.questionNum++;
			AnswerCorrectly++;
			this.score+=10;
			fill(); // Fill () => inners
		}

		else if (ifFalse(i)==0){
			this.questionNum++;
			totalHertsPerGame--;
			this.herts[herts.length--]-1;
			fill(); // Fill () => inners
		}
		
	}
	function fill(){//Filling all the 
		innerQuestion();
	    innerScore();
		innerHeart();
		innerAnswers();
		innerResult();
	}
//<------Mock DB functions you should not edit!------>
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
