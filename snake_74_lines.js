let canvas = document.querySelector('canvas');
const snakeSize = 20;
let rows = canvas.height/snakeSize;
let columns = canvas.width/snakeSize;
let scoreContainer = document.querySelector('h3');
let ctx = canvas.getContext("2d");
let snakeBody = [[0,0]]
let direction = ['r', true];
let score = 0;
let food = [];
let game = {
    genFood: () => {
        let visited = {};
        snakeBody.forEach(s => visited[(s[0]*columns) + s[1]] = 1); 
        let r = Math.floor(Math.random() * ((rows*columns)-snakeBody.length));
        let cnt = [0, 0];
        for (i=0; i<rows*columns && cnt[0] <= r; i++) if (!visited[i]) cnt = [cnt[0]+1, i]; 
        food = [parseInt(cnt[1]/columns),  cnt[1] % columns];
    },gd: (d) => d == direction[0],
    checkCollision: () => {
        let visited = {};
        for (let s of snakeBody){
            if (visited[(s[0]*columns) + s[1]]) return true;
            visited[(s[0]*columns) + s[1]] = 1;
        }return false;
    },gameOver: () => {
        snakeBody = [[0,0]];
        direction[0] = 'r';
        game.updateScore(-1);
    },updateScore: (s) => {
        score = s+1;
        game.genFood();
        scoreContainer.innerHTML = "Score: " + score;
    },update: () => {
        let n = snakeBody.length - 1;
        if (snakeBody[n][1] - game.gd('l') >= 0 && snakeBody[n][1] + game.gd('r') < columns && snakeBody[n][0] - game.gd('u') >= 0 && snakeBody[n][0] + game.gd('d') < rows) {
            let grow = [];
            if (snakeBody[n][0] == food[0] && snakeBody[n][1] == food[1]){
                Object.assign(grow, snakeBody[0]);
                game.updateScore(score);
            }
            for (let i=0; i<n; i++) Object.assign(snakeBody[i], snakeBody[i+1]);
            if (direction[0] == 'r') snakeBody[n][1] += 1;
            else if (direction[0] == 'l') snakeBody[n][1] -= 1;
            else if (direction[0] == 'd')  snakeBody[n][0] += 1;
            else if (direction[0] == 'u') snakeBody[n][0] -= 1;
            if (grow.length > 0) snakeBody.splice(0, 0, grow);
        }else return game.gameOver();
        if (game.checkCollision()) return game.gameOver();
        game.draw();
    },drawRect: (x, y, w, h, color='greenyellow') => {
        ctx.beginPath();
        ctx.rect(x, y, w, h);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.closePath();
    },draw : () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.drawRect(food[1]*snakeSize+4, food[0]*snakeSize+4, snakeSize-8, snakeSize-8, 'yellow');
        for (let i=0; i<snakeBody.length; i++){
            if (i == snakeBody.length-1) game.drawRect( snakeBody[i][1]*snakeSize, snakeBody[i][0]*snakeSize, snakeSize, snakeSize );
            else game.drawRect( snakeBody[i][1]*snakeSize+1, snakeBody[i][0]*snakeSize+1, snakeSize-2, snakeSize-2 );
        }direction[1] = true;
    }
}
window.onload = () => { game.gameOver(); setInterval(game.update, 100); }
window.onkeydown = (event) => {
    if (!direction[1]) return;
    if (event.key.toLowerCase() == 'a') direction[0] = direction[0] == 'r' ? direction[0] : 'l';
    else if (event.key.toLowerCase() == 'w') direction[0] = direction[0] == 'd' ? direction[0] : 'u';
    else if (event.key.toLowerCase() == 'd') direction[0] = direction[0] == 'l' ? direction[0] : 'r';
    else if (event.key.toLowerCase() == 's') direction[0] = direction[0] == 'u' ? direction[0] : 'd';
    direction[1] = false;
}