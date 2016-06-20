var canvas = document.getElementById("brickConvas");
var ctx = canvas.getContext("2d"); // 2D渲染環境
// 環境

var lives = 3;

var score = 0;

var bornX = canvas.width/2;
var bornY = canvas.height-30;

var dx = 0;   
var dy = 0;  

var ballRadius = 10; // 球半徑
var ball_color = "blue";
// 球

var paddleHeight = 10;
var paddleWidth = 100;
var paddleX = ( canvas.width - paddleWidth ) / 2;

var rightPressed = false;
var leftPressed = false;
// 板板

var brickRowCount = 3;
var brickColumnCount = 4;
var brickWidth = 85;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 40;
var brickOffsetLeft = 50;

var bricks = [];
for ( c = 0 ; c < brickColumnCount; c++ ) {
  bricks[c] = [];
  for( r = 0 ; r < brickRowCount; r++ ) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  } // for
} // for
// 磚塊

function drawBricks() {
  for( c = 0; c < brickColumnCount; c++ ) {
    for( r = 0; r < brickRowCount; r++ ) {
      if ( bricks[c][r].status == 1 ) {
        var brickX = ( c * ( brickWidth + brickPadding )) + brickOffsetLeft;
        var brickY = ( r * ( brickHeight + brickPadding )) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect( brickX, brickY, brickWidth, brickHeight );
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      } // if Status == 1 可顯示狀態
    } // for
  } // for
} // for

function drawBall( ) {
  ctx.beginPath();
  ctx.arc( bornX, bornY, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = ball_color;
  ctx.fill();
  ctx.closePath();
} // drawBall()

function changeColor() {
  if ( ball_color == "blue" )
    ball_color = "red";
  else if ( ball_color == "red" )
    ball_color = "green";
  else if ( ball_color == "green" )
    ball_color = "yellow";
  else if ( ball_color == "yellow" )
    ball_color = "blue";
} // changeColor()

function drawPaddle() {
  ctx.beginPath();
  ctx.rect( paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
} // drawPaddle() 板板

function drawScore() {
  ctx.font = "16px 微軟正黑體";
  ctx.fillStyle = "#0095DD";
  ctx.fillText( "分數: " + score * 100 , 8, 20 );
} // drawScore()

function drawLives() {
  ctx.font = "16px 微軟正黑體";
  ctx.fillStyle = "#0095DD";
  ctx.fillText( "Lives: " + lives, canvas.width - 65, 20 );
} // drawLives()

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 清除上次留下來的軌跡        
  if ( bornX + dx > canvas.width-ballRadius || bornX + dx < ballRadius ) { // 前半:當移動加本身位置超過畫框大小，就把位移的左右顛倒 ，後半反之 記得要把球半徑考慮進去
    dx = -dx;
    changeColor();
  } // if
  
  if ( bornY + dy < ballRadius ) { 
    dy = -dy;
    changeColor();
  } // if
  else if ( bornY + dy > canvas.height-ballRadius ) {
    if( bornX > paddleX && bornX < paddleX + paddleWidth) {// 
      dy = -dy;
      changeColor();
    }       // if 接到球!
    else {  // 沒接到球
      lives--;
      if ( !lives ) {
        //alert("GAME OVER");
        document.location.reload();
      } // if 死光光拉~
      else {
        bornX = canvas.width / 2;
        bornY = canvas.height - 30;
        dx = 0;
        dy = 0;
        paddleX = ( canvas.width - paddleWidth ) / 2;
      } // 重置
    } // else
  } // else if 球掉到底部
  
  drawBall( );
  
  bornX += dx;  // x位移 dx px
  bornY += dy;  // y位移 yx px
  
  if ( rightPressed && paddleX < canvas.width-paddleWidth ) // 按下方向鍵右 同時 板板不超出邊界就往右
    paddleX += 5;
  else if ( leftPressed && paddleX > 0 )                    // 反之 ( 0可視為左邊邊界
    paddleX -= 5;
  drawPaddle();
  drawScore();
  drawLives();
  
  collisionDetection();
  drawBricks();
  requestAnimationFrame( draw );
} // draw()

function keyDownHandler( e ) {
  if ( e.keyCode == 39 ) 
    rightPressed = true;
  else if ( e.keyCode == 37 ) 
    leftPressed = true;
} // keyDownHandler()

function keyUpHandler( e ) {
  if ( e.keyCode == 39 ) 
    rightPressed = false;
  else if( e.keyCode == 37 ) 
    leftPressed = false;
} // keyUpHandler()

function mouseMoveHandler( e ) {
  var relativeX = e.clientX - canvas.offsetLeft;
  if ( relativeX > ( paddleWidth / 2 ) && relativeX < canvas.width - ( paddleWidth / 2 ) ) {
    paddleX = relativeX - paddleWidth / 2;
  } // if
} // mouseMoveHandler()

function mouseClickHandler( e ) {
  if ( dx == 0 && dy == 0 ) {
    dx = -4;
    dy = -2;
  } // if
} // mouseMoveHandler()
  
function collisionDetection() {
  for( c = 0; c < brickColumnCount; c++ ) {
    for( r = 0; r < brickRowCount; r++ ) {
      var brick = bricks[c][r];
      if( brick.status == 1 && bornX > brick.x && bornX < brick.x + brickWidth && bornY > brick.y && bornY < brick.y + brickHeight ) {
          dy = -dy;
          brick.status = 0;
          score++;
          changeColor();
          if( score == brickRowCount * brickColumnCount ) {
            alert( "YOU WIN, CONGRATULATIONS!\nTotal Score = " + ( score * 100 ) );
            document.location.reload();
          } // 打完收工
      } // if 偵測到碰撞
    } // for
  } // for
} // collisionDetection()

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

document.addEventListener("mousemove", mouseMoveHandler, false);
document.addEventListener("click", mouseClickHandler, false);

draw();
//setInterval(draw, 10); // 每10毫秒執行一次 draw()