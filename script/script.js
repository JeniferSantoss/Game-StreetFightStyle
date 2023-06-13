const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/background.png",
});


const shop = new Sprite({
  position: {
    x: 600,
    y: 173,
  },
  imageSrc: "./assets/shop.png",
  scale: 2.4,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: "./assets/samurai/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/samurai/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./assets/samurai/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/samurai/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/samurai/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/samurai/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./assets/samurai/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./assets/samurai/Death.png",
      framesMax: 6,
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width:  160,
    height: 50
  }
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "red",
  offset: {
    x: -50,
    y: 0,
  },
  imageSrc: "./assets/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 169,
  },
  sprites: {
    idle: {
      imageSrc: "./assets/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./assets/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./assets/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./assets/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./assets/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./assets/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./assets/kenji/Death.png",
      framesMax: 7,
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
});

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
  up: {
    pressed: false,
  },
  enemyRight: {
    pressed: false,
  },
  enemyLeft: {
    pressed: false,
  },
  enemyUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255, 255, 255, 0.13)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.left.pressed && player.lastKey === 65) {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.right.pressed && player.lastKey === 68) {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (keys.enemyLeft.pressed && enemy.lastKey === 74) {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.enemyRight.pressed && enemy.lastKey === 76) {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  // enemy jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //detect collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.attacking && player.frameCurrent === 4
  ) {
    enemy.takeHit()
    player.attacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  // player misses
  if(player.attacking && player.frameCurrent === 4){
    player.attacking = false
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.attacking && player.frameCurrent === 2
  ) {
    player.takeHit()
    enemy.attacking = false;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

    // enemy misses
    if(enemy.attacking && enemy.frameCurrent === 2){
      enemy.attacking = false
    }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    detemineWinner({ player, enemy, timerId });
  }
}

animate();

document.addEventListener("keydown", (event) => {
  if(!player.dead) { 
  switch (event.keyCode) {
    case 68:
      keys.right.pressed = true;
      player.lastKey = 68;
      break;
    case 65:
      keys.left.pressed = true;
      player.lastKey = 65;
      break;
    case 87:
      player.velocity.y = -20;
      break;
    case 32:
      player.attack();
      break;
    }
  }

  if(!enemy.dead){
  switch (event.keyCode) {
    case 76:
      keys.enemyRight.pressed = true;
      enemy.lastKey = 76;
      break;
    case 74:
      keys.enemyLeft.pressed = true;
      enemy.lastKey = 74;
      break;
    case 73:
      enemy.velocity.y = -20;
      break;
    case 75:
      enemy.attack() = true;
      break;
  }
}
});
document.addEventListener("keyup", (event) => {
  switch (event.keyCode) {
    case 68:
      keys.right.pressed = false;
      break;
    case 65:
      keys.left.pressed = false;
      break;
    case 87:
      keys.up.pressed = false;
      break;

    //enemy keys
    case 76:
      keys.enemyRight.pressed = false;
      break;
    case 74:
      keys.enemyLeft.pressed = false;
      break;
    case 73:
      keys.enemyUp.pressed = false;
      break;
  }
});
