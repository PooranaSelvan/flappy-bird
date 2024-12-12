import kaboom from "kaboom";

// initialize kaboom libary
kaboom();


// Loading images 
loadSprite("bird", "images/bird.png");
loadSprite("bg", "images/bg.png");
loadSprite("pipe", "images/pipe.png");


// getting highScore from localStorage if not initializing locally.
let highScore = localStorage.getItem("highScore") ? parseInt(localStorage.getItem("highScore")) : 0;


// Set the game camera and scale for responsiveness
const gheight = 640;
const gwidth = 480;
const scaleFactor = Math.min(width() / gwidth, height() / gheight);


// Resize the game according to the screen size md:
scale(scaleFactor);
const scaledWidth = width();
const scaledHeight = height();


// Set the game camera to the scaled width and height
scene("game", () => {

    // gap between every pipe.
    const pipeGap = 140;

    // score which calculated after crossing every pipe
    let score = 0;

    // setting gravity of the bird.
    setGravity(1400);


    // Background that scales based on screen size
    add([sprite("bg", { width: scaledWidth, height: scaledHeight })]);

    // score which will update after crossing every pipe - top left corner
    const scoreText = add([text(score), pos(12, 12)]);


    // bird's pos
    const player = add([sprite("bird"), scale(1.2), pos(100, 50), area(), body()]);



    // creating pipes
    function createPipes() {
        const offset = rand(-100, 100); // Random pos for pipe - using rand

        const dynamicGap = Math.max(pipeGap - score * 5, 100); // gap between pipes


        // Adding the top pipe
        add([
            sprite("pipe", { flipY: true }),
            pos(scaledWidth, scaledHeight / 2 + offset - dynamicGap / 2), // position of the pipe.
            "pipe",
            anchor("botleft"),
            scale(rand(1.8, 2.2)), // pipes scale in random pos.
            area(),
            { passed: false }, // this is for passing - that bird passed or not - if passed score + 1.
            move(vec2(-300 - score * 5, 0)),
        ]);


        // Adding the bottom pipe
        add([
            sprite("pipe"),
            pos(scaledWidth, scaledHeight / 2 + offset + dynamicGap / 2), // position of the pipe.
            "pipe",
            scale(rand(1.8, 2.2)), // pipes scale in random pos.
            area(),
            move(vec2(-300 - score * 5, 0)), // Speed increases accroding to the score
        ]);
    }


    // Create pipes dynamically
    loop(Math.max(1.5 - score * 0.02, 0.8), () => createPipes());



    onUpdate("pipe", (pipe) => {

        // moving the pipe to the left
        pipe.move(-300, 0);


        // condition to chekc if the bird passed the pipe or not
        if (pipe.passed === false && pipe.pos.x < player.pos.x) {

            // make the passed as true - check 69th line.
            pipe.passed = true;

            // incrementing score.
            score += 1;

            // displaying the score in frontend.
            scoreText.text = score;
        }
    });


    // it listens the pos between pipe & object(bird)
    player.onCollide("pipe", () => {

        // capture a screenshot of current game.
        const ss = screenshot();

        // sending the screenshot as parameter of gameOver
        go("gameover", score, ss);
    });

    // it listens when the bird passes every pipe
    player.onUpdate(() => {

        // when the bird falls beyond the height we gave
        if (player.pos.y > scaledHeight) {

            // it took screenshot
            const ss = screenshot();

            // sending the screenshot as parameter of gameOver
            go("gameover", score, ss);
        }
    });



    // Jump control for desktop and mobile
    // it listens for the "space" bar of the desktops.
    onKeyPress("space", () => {
        player.jump(400);
    });

    // for mobile when the screen is tapped.
    // Touch control for mobile players
    window.addEventListener("touchstart", () => {
        player.jump(400);
    });


    // Display message for mobile and tablet users
    add([
        text("Mobile & Tablet users might face some issues! Play on Laptop & Desktop for better experience.", {
            size: 18,
            width: scaledWidth - 20,
            align: "center",
            family: "monospace",
        }),
        pos(scaledWidth / 2, scaledHeight - 10),
        anchor("center"),
    ]);
});



// Game over scene
// getting that score & screenshot that we gave in the parameter.
scene("gameover", (score, screenshot) => {


    // Update high score if the current score is higher than the score we got from localStorage
    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore); // Save highScore to localStorage
    }


    loadSprite("gameOverScreen", screenshot);
    add([sprite("gameOverScreen", { width: scaledWidth, height: scaledHeight })]);
    

    add([
        text(`gameover!\nscore: ${score}\nhigh score: ${highScore}`, { size: 45, align:"center", color: rgb(255, 0, 0) }),
        pos(scaledWidth / 3, scaledHeight / 3),
    ]);


    // pressing space bar again to start the game - pc
    onKeyPress("space", () => {
        go("game");
    });

    // pressing space bar again to start the game - mobile
    window.addEventListener("touchstart", () => {
        go("game");
    });
});


// Starting the game
go("game");