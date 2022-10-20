const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");


const pumpkinTex = "🎃";

const vegetablesTex = "🥗 🥬 🥕 🍉 🥑 🍅 🍇 🥝 🥔 🍍 🍊 🍌 🍈 🥭 🍎 🍒 🍠 🍓 🥜 🍑 🥒 🍋 🍆 🧀 🌽 🫑 🍏 🍐 🥦 🌶".split(" ");

function randVegTex() {
    return vegetablesTex[Math.floor(vegetablesTex.length * Math.random())];
}

let keys = new Map();
document.addEventListener("keydown", e => {
    keys.set(e.key.toUpperCase(), true);
});
document.addEventListener("keyup", e => {
    keys.set(e.key.toUpperCase(), false);
});


let mouseButtons = new Map();
document.addEventListener("mousedown", e => {
    mouseButtons.set(e.button, true);
});
document.addEventListener("mouseup", e => {
    mouseButtons.set(e.button, false);
});



let mousePos = { x: 0, y: 0 };
document.addEventListener("mousemove", e => {
    mousePos = { x: e.clientX, y: e.clientY };
});

const onresize = e => {

}   
document.addEventListener("resize", onresize);
onresize();


let player = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    speed: 2.5
}



function clearCanvas() {
    ctx.fillStyle = "#ffffff66";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawPlayer() {
    ctx.fillStyle = "#ffffff";
    ctx.font = "36px Arial";
    ctx.textAlign = "center";
    ctx.fillText(pumpkinTex, player.x, player.y + 14);
    ctx.fillRect(player.x, player.y, 2, 2);
}

function handlePlayer() {
    if (keys.get("W")) {
        player.dy -= player.speed;
    }
    if (keys.get("A")) {
        player.dx -= player.speed;
    }
    if (keys.get("S")) {
        player.dy += player.speed;
    }
    if (keys.get("D")) {
        player.dx += player.speed;
    }
    player.x += player.dx;
    player.y += player.dy;
    player.dx *= 0.35;
    player.dy *= 0.35;

    if (player.x > 512) {
        player.x = 512;
        player.dx *= -1;
    }
    if (player.x < 0) {
        player.x = 0;
        player.dx *= -1;
    }
    if (player.y > 512) {
        player.y = 512;
        player.dy *= -1;
    }
    if (player.y < 0) {
        player.y = 0;
        player.dy *= -1;
    }
}

let vegetables = [];

function makeNewVegetable(x, y, dx, dy, lifetime, type) {
    vegetables.push({
        x, y, dx, dy, lifetime, type
    });
}

function handleVegetables() {
    for (const v of vegetables) {
        v.lifetime--;
        v.x += v.dx;
        v.y += v.dy;
    }
    vegetables = vegetables.filter(v => v.lifetime > 0);
}

function drawVegetables() {
    for (const v of vegetables) {
        ctx.fillStyle = "black";
        ctx.font = "36px Arial";
        ctx.textAlign = "center";
        ctx.fillText(v.type, v.x, v.y + 14);
    }
}

function vegetableCircle(cx, cy, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.PI * 2 * i / count;
        let x = Math.cos(angle) + cx;
        let y = Math.sin(angle) + cy;
        let dx = Math.cos(angle) * 5;
        let dy = Math.sin(angle) * 5;
        vegetables.push({ x, y, dx, dy, lifetime: 300, type: randVegTex() })
    }
}


let time = 0;

let anglePhase2 = 0;

function loop() {
    handlePlayer();
    handleVegetables();

    let dead = false
    for (const v of vegetables) {
        const offsetX = v.x - player.x;
        const offsetY = v.y - player.y;
        if (Math.hypot(offsetX, offsetY) < 30) {
            dead = true;
        }
    }

    if (time % 60 == 0) {
        let angle = Math.random() * Math.PI * 2;
        vegetableCircle(Math.cos(angle) * 400 + 256, Math.sin(angle) * 400 + 256, Math.min(50, Math.floor(time / 100) + 5));
    }

    if (time > 600) {
        if (time % 97 == 0) {
            anglePhase2 = Math.random() * Math.PI * 2;;
        }
        if (time % 97 < 15) {
            let angle = anglePhase2 + time * 0.1;
            const startX = Math.cos(angle) * 400 + 256;
            const startY = Math.sin(angle) * 400 + 256;
            const playerOffsetX = player.x - startX;
            const playerOffsetY = player.y - startY;
            const mag = Math.hypot(playerOffsetX, playerOffsetY);

            makeNewVegetable(startX, startY, playerOffsetX / mag * 6, playerOffsetY / mag * 6, 200, randVegTex());
        }
    }

    if (time > 1200) {
        if (time % 32 == 0) {
            let angle = Math.random() * Math.PI * 2;;
            const startX = Math.cos(angle) * 400 + 256;
            const startY = Math.sin(angle) * 400 + 256;
            const playerOffsetX = player.x - startX;
            const playerOffsetY = player.y - startY;
            const mag = Math.hypot(playerOffsetX, playerOffsetY);
            makeNewVegetable(startX, startY, playerOffsetX / mag * 8, playerOffsetY / mag * 8, 200, randVegTex());
        }
    }

    clearCanvas();
    drawPlayer();
    drawVegetables();

    time++;
    if (dead) {
        ctx.fillText("You died! Final score: " + time, 256, 256);
        ctx.fillRect("Refresh the page to try again!", 256, 300);
    } else {
        requestAnimationFrame(loop);
    }
}

loop();