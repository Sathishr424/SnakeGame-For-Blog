// Snake size
const snakeSize = 20;

let canvas = document.querySelector('canvas');
// Calculating number of rows and columns using canvas width and height
let rows = canvas.height/snakeSize;
let columns = canvas.width/snakeSize;

let scoreContainer = document.querySelector('h3');
// Getting canvas context 2d (This is needed for writing graphics)
let ctx = canvas.getContext("2d");
// Defining snake properties
let snakeBody = [[0,0]]
let direction = ['r', true];
let score = 0;
// Snake food position
let food = [];

// Game Object
let game = {
    // For generating food based on available space in the canvas
    genFood: () => {
        let visited = {};
        snakeBody.forEach(s => visited[(s[0]*columns) + s[1]] = 1); 
        let path = [];
        for (let i=0; i<rows*columns; i++){
            if ( !(i in visited) ){
                path.push(i);
            }
        }let rand_pos = Math.floor(Math.random() * path.length);
        food = [parseInt(rand_pos/columns),  rand_pos % columns];
    },
    // Short function for checking direction
    gd: (d) => d == direction[0],
    // Checking if snake head collided into body
    checkCollision: () => {
        let visited = {};
        for (let s of snakeBody){
            if (visited[(s[0]*columns) + s[1]]) return true;
            visited[(s[0]*columns) + s[1]] = 1;
        }return false;
    },
     // Reset game
    gameOver: () => {
        snakeBody = [[0,0]];
        direction[0] = 'r';
        game.updateScore(-1);
    },
    // Updating score
    updateScore: (s) => {
        score = s+1;
        game.genFood();
        scoreContainer.innerHTML = "Score: " + score;
    },
    // Main game fuction for drawing snake and food and checking food collision and others
    update: () => {
        let n = snakeBody.length - 1;
        // Checking if snake inside the wall
        if (snakeBody[n][1] - game.gd('l') >= 0 && snakeBody[n][1] + game.gd('r') < columns && snakeBody[n][0] - game.gd('u') >= 0 && snakeBody[n][0] + game.gd('d') < rows) {
            // Checking food collision
            let grow = [];
            if (snakeBody[n][0] == food[0] && snakeBody[n][1] == food[1]){
                // If collided assigning current tail posision to grow variable and updating score
                Object.assign(grow, snakeBody[0]);
                game.updateScore(score);
            }
            // Moving all previous snake child to next child
            for (let i=0; i<n; i++) Object.assign(snakeBody[i], snakeBody[i+1]);
            // Moving snake head based on direction
            if (direction[0] == 'r') snakeBody[n][1] += 1;
            else if (direction[0] == 'l') snakeBody[n][1] -= 1;
            else if (direction[0] == 'd')  snakeBody[n][0] += 1;
            else if (direction[0] == 'u') snakeBody[n][0] -= 1;
            // If grow variable not empty, Increasing tail length using grow position
            if (grow.length > 0) snakeBody.splice(0, 0, grow);
        }
        // Else snake hit the wall calling gameover
        else return game.gameOver();
        // Checking snake head body collision and calling game over
        if (game.checkCollision()) return game.gameOver();
        // Drawing snake and food on the canvas
        game.draw();
    },
    // Draw rectangle function (snake and food) using x, y and width, height, color
    drawRect: (x, y, w, h, color='greenyellow') => {
        // This is the procedure to draw rectangle on canvas
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
        // End
    }, // Draw function
    draw : () => {
        // Clearing canvas from previous draw
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Drawing food
        game.drawRect(food[1]*snakeSize+4, food[0]*snakeSize+4, snakeSize-8, snakeSize-8, 'yellow');
        // Drawing snake body and tail
        for (let i=0; i<snakeBody.length; i++){
            // Checking if it was head
            if (i == snakeBody.length-1) game.drawRect( snakeBody[i][1]*snakeSize, snakeBody[i][0]*snakeSize, snakeSize, snakeSize );
            // If not draw as body
            else game.drawRect( snakeBody[i][1]*snakeSize+1, snakeBody[i][0]*snakeSize+1, snakeSize-2, snakeSize-2 );
        }
        // Assiging so we know one frame was finished
        direction[1] = true;
    }
}
// On window load reseting game and starting the game function to 1 frame per 0.1 second
window.onload = () => { 
    game.gameOver(); 
    setInterval(game.update, 100); 
}
// Checking user input
window.onkeydown = (event) => {
    // Checking if already an user input was pending
    if (!direction[1]) return;
    // Checking user pressed key and assigning the direction
    if (event.key.toLowerCase() == 'a') direction[0] = direction[0] == 'r' ? direction[0] : 'l';
    else if (event.key.toLowerCase() == 'w') direction[0] = direction[0] == 'd' ? direction[0] : 'u';
    else if (event.key.toLowerCase() == 'd') direction[0] = direction[0] == 'l' ? direction[0] : 'r';
    else if (event.key.toLowerCase() == 's') direction[0] = direction[0] == 'u' ? direction[0] : 'd';
    // Assigning new move
    direction[1] = false;
}