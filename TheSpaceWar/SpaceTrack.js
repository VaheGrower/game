const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const backgroundImg = document.createElement("img");
backgroundImg.src = "http://images.unsplash.com/photo-1548346941-0f485f3ec808?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max";

class Obj {
  constructor(x, y, width, height) {
    this._x = x;
    this._y = y;
    this._width = width;
    this._height = height;

    this._speed = 4;
    this._xDelta = 0;
    this._yDelta = 0;
    
    this._img = document.createElement("img");
    this._img.src = "";
  }
  get() {
    return {
      x: this._x,
      y: this._y,
      width: this._width,
      height: this._height
    };
  }
  update() {
    this._x += this._xDelta;
    this._y += this._yDelta;
  }
  draw() {
    context.drawImage(this._img, this._x, this._y, this._width, this._height);
  }
  moveRight() {
    this._xDelta = this._speed;
  }
  moveLeft() {
    this._xDelta = this._speed * -1;
  }
 moveUp() {
    this._yDelta = this._speed * -1;
  }
  moveDown() {
    this._yDelta = this._speed ;
  }
  stop() {
    this._xDelta = 0;
    this._yDelta = 0;
  }
}

class Ship extends Obj {
  constructor(x, y, width, height) {
    super(x, y, width, height);
    this._speed=7;
    
    this._img = document.createElement("img");
    this._img.src = "ship.png";

    this._audio = document.createElement("audio");
    this._audio.src = "laser-blast-descend_gy7c5deo.mp3";
  }
  shoot() {
      const x = this._x ,
      y = this._y - this._height/2,
      width = 90,
      height = 90;

    const bullet = new Bullet(x, y, width, height);
    bullet.moveUp();
    data.bullets. push(bullet);

    this._audio.currentTime = 0;
    this._audio.play(); 
  }
}
class Bullet extends Obj {
    constructor(x, y, width, height) {
      super(x, y, width, height);
      
      this._speed = 20;
      
      this._img = document.createElement("img");
      this._img.src = "bullet.png";
  
      this._stabAudio = document.createElement("audio");
      this._stabAudio.src = "boom.mp3";
    }
    update() {
      super.update();
  
      if (this._yDelta < 0 && this._y + this._height < 0) 
        {
        this.deleteMe = true;
      }
  
      data.asteroids.forEach((asteroid) => {
        if (touching(this.get(), asteroid.get())) {
          asteroid.vanish();
          this._stabAudio.currentTime = 0;
          this._stabAudio.play();
          this.deleteMe = true;
        }
      });
    }
  }
  
  let data = {
    ship: new Ship(canvas.width/2, 690, 100, 100),
    bullets: [],
    asteroids: []
  };
class Asteroid extends Obj {
  constructor(x, y, width, height) {
    super(x, y, width, height); 
   ;
    
    this._img = document.createElement("img");
    this._img.src = "asteroid.png";
  }
  update() {
    super.update();
   
    
    if (this._yDelta < 0 && this._y > canvas.height) 
     {
      this.deleteMe = true;
    }
  }
  vanish() {
    this.deleteMe = true;
  }
}


function touching(rect1, rect2) {
  const x = Math.max(rect1.x, rect2.x),
    num1 = Math.min(rect1.x + rect1.width, rect2.x + rect2.width),
    y = Math.max(rect1.y, rect2.y),
    num2 = Math.min(rect1.y + rect1.height, rect2.y + rect2.height);
  return (num1 >= x && num2 >= y);
};

function update() {
  data.ship.update();
  data.asteroids.forEach((asteroid) => asteroid.update());
  data.bullets.forEach((bullet) => bullet.update());

  data.bullets = data.bullets.filter((bullet) => bullet.deleteMe !== true);
  data.asteroids = data.asteroids.filter((asteroid) => asteroid.deleteMe !== true);
  
  if (data.asteroids.length === 0) {
    const asteroid = new Asteroid( Math.floor(Math.random() * (530 - 0 + 1) ) + 0,0, 100, 100);
    asteroid.moveDown()
   
    data.asteroids.push(asteroid);
  }
}

function draw() {
  context.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);

  data.ship.draw();
  data.bullets.forEach((bullet) => bullet.draw());
  data.asteroids.forEach((asteroid) => asteroid.draw());
}

function loop() {
  requestAnimationFrame(loop);
  update();
  draw();
}

loop();

document.addEventListener("keydown", (evt) => {
  if (evt.code === "ArrowRight") {
    data.ship.moveRight();
  } else if (evt.code === "ArrowLeft") {
    data.ship.moveLeft();
  } else if (evt.code === "Space") {
    data.ship.shoot();
  }
});

document.addEventListener("keyup", (evt) => {
  data.ship.stop();
});