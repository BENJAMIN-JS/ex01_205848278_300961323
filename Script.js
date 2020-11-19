let questionsArray = []; // this is a global array that will contain the questions you asked form the mock db function. 
let urlHelper = [];


// this function let the elements in your html to load first.
$(document).ready(function () { 
    // getCategories is a mock DB function that recive 'select' html element, and fill the select with the categories from opentdb.
	// please note that in order to operate the function, in your html there should be a select element that hold the id categories.
	getCategories($("#categories"));
	start();
	
});

async function start(){ 
	// questionsArray is the global array that recive the questions from the mock DB function named getQuestion
	// getQuestion USAGE: returns an array of questions, recives (amount, category , difficulty,type) all of the function parameters should be sent as a string!
	// amount = the number of questions you want to recive
	// category = the category of the questions 9-32
	// difficulty = easy, medium, hard
	// type = multiple , boolean
	// getQuestion is an async function. in order to use it you have to use the keyword await.
	questionsArray =  await getQuestion(5 , 18 , 'easy' ,'boolean');
	console.log(questionsArray);
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
