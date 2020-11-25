let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];//urlHelper
var type; // type of questions global variable.
var Score=0; // Total Score in real time.
var ArrHearts=['❤️','❤️','❤️','❤️'];// Array of Hearts.// Total Hearts of Game / Point / HP. 
var questionNum=0; // the number of question in real time.
// this function let the elements in your html to load first.
$(document).ready(function () { 
    // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
	// please note that in order to operate the function, in your html there should be a select element that hold the id categories.
	getCategories($("#catgories"));
	
	
});
function getCategoriesValue(){// return Categories Value from html
	var category=document.getElementById("catgories");
	var category2=category.value;
	return category2;
}
function getdifficulty(){// return difficulty Value from html
	var difficulty=document.getElementById("difficulty");
	var difficulty2=difficulty.value;
	return difficulty2;
}
function getType(){// return type Value from html
	var type=document.getElementById("type");
	var type2=type.value;
	return type2;
}
function getAmount(){// return type Value from html
	var amount=document.getElementById("amount");
	var amount2=amount.value;
	return amount2;
}
async function start(){ 
	questionNum=0;
	var ArrHearts=['❤️','❤️','❤️','❤️'];
	Score=0;
	var amount=getAmount();// amount = the number of questions you want to recive
	var cat=getCategoriesValue(); // category = the category of the questions 9-32
	var difficulty =getdifficulty(); // difficulty = easy, medium, hard
	type = getType(); // type = multiple , boolean
	questionsArray =  await getQuestion(amount ,cat ,difficulty ,type);
	Database_test(); // test if => !questionsArray.
	inner_question(); // innerHTML question.
	inner_Answers(questionNum); // innerHTML Answers.
	inner_hearts(); // innerHTML hearts.
	inner_score(); // innerHTML score.
	}
	function next(){// function that will be a check answer==correct_answer
		var answers=document.getElementById("answers");
		var answers=answers.value;
		var i=questionsArray.length;
			if(ArrHearts.length==1)//Geme Over
			{
				window.confirm("Geme Over!");
				document.getElementById("question").innerHTML="";
			}
			if(answers==questionsArray[questionNum].correct_answer)//correct
			{
				questionNum++;
				Score+=10;
				inner_question();
			inner_Answers(questionNum);
			inner_hearts();
			inner_score();
			}
			if(answers!=questionsArray[questionNum].correct_answer)//incorrect
			{
				questionNum++;
				ArrHearts.pop(ArrHearts.length);
				inner_question();
				inner_Answers(questionNum);
				inner_hearts();
				inner_score();
			}
			
	}

function Database_test(){//function test the /Database if questionsArray !empty.
	if(questionsArray==0)
		window.alert("not exist in this category\nPlease select a different category / type");
		
}

function inner_question(){//function innerHTML to question.
	if(ArrHearts.length>0)
	document.getElementById("question").innerHTML = questionsArray[questionNum].question;
	
}

function inner_score(){//function innerHTML to score.
	if(ArrHearts.length==0){
		document.getElementById("score").innerHTML = "<span>Your total Score: </span>"+Score+"   <button onclick='rel()' class='btn btn-success' >Try agian</button>";
	}
	else{
	document.getElementById("score").innerHTML = "<span>Score: </span>"+Score;
	}
}
function rel(){//function restart the game.
	location.reload();
}
function inner_hearts(){//function inner set hearts. 
	var o="";
	for(var i=0;i<ArrHearts.length;i++){

		o+= ArrHearts[i];
	}
	document.getElementById("heart").innerHTML =o;
}

function inner_Answers(x){//function inner answers buttons.
	var str="";
	if(ArrHearts.length>0){//
	if (type=='boolean'){// if type == 'boolean', inner button true & button false.
		str+="<button id='answers' class='btn btn-primary' onclick='next()' value='False'>False</button>";
		str+="<button id='answers' class='btn btn-primary' onclick='next()' value='True'>True</button>";
	}
	else{// if type == 'multiple', inner button in questionsArray[x].incorrect_answers.

		for (let answers in questionsArray[x].incorrect_answers) {
			str+="<button onclick='next()' class='btn btn-primary' value='"+questionsArray[x].incorrect_answers[answers]+"' id='answers'>"+questionsArray[x].incorrect_answers[answers]+"</button>";
		}
	}
}
	document.getElementById("answers").innerHTML = str;
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
