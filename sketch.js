//Pratham Agarwal.
//Virtual pet-2

var dog, happyDog, dogImg, database, food, foodStock;
var gameState = 0;
var feedButton, addButton, input, name;
var fedtime;

var lastFed;

var canvas;

function preload(){
	dogImg = loadImage("images/dogImg.png");
	happyDog = loadImage("images/dogImg1.png");
}

function setup() {
	database = firebase.database();

	canvas = createCanvas(700, 600);

	dog = createSprite(width/2+200, height/2+100);
	dog.addImage(dogImg);
	dog.scale = 0.2;

  foodStock = database.ref("Food");
	foodStock.on("value", readStock);

	feedButton = createButton("Feed the Dog.");
	feedButton.position(width/2+290, 80);
	feedButton.mousePressed(feedDog);

	addButton = createButton("Add more Food.");
	addButton.position(width/2+400, 80);
	addButton.mousePressed(addFood);

	input = createInput("Name your Dog");
	input.position(width/2+480, height/2+10);

  name = input.value();

	food = new Food();
}


function draw() {
	background(46, 139, 87);

  food.display();

	fedtime = database.ref("feedTime");
	fedtime.on("value", function(data){
		lastFed = data.val();
	});

  push();
	textSize(19);
	fill(255);
	if(lastFed>=12){
    text("Last Fed: "+ lastFed % 12 + " PM",25,50);
  } else if(lastFed===0){
    text("Last Fed: 12AM",25,50);
  } else{
    text("Last Fed: "+ lastFed + " AM",25,50);
  }
	pop();

  drawSprites();
}

function feedDog(){
  dog.addImage(happyDog);

  if(foodStock<=0){
    foodStock=0;
    } else{
      foodStock = foodStock-1;
    }
  database.ref('/').update({
    FeedTime:hour(),
    Food:foodStock
  })
}

function addFood(){
  foodStock = foodStock + 1;

  database.ref('/').update({
    Food:foodStock
  })

}

function readStock(data){
	foodStock = data.val();
	food.updateFoodStock(foodStock);
}

function writeStock(x){
	if(x<=0){
		x = 0;
	} else {
		x = x - 1;
	}
	database.ref("/").update({
		"Food":x
	})
}

function update(state){
    database.ref('/').update({
      gameState:state
    });
}
