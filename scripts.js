// reference point
var ref = { x: 0, y: 0, z: -1000, rx: 0, ry: 0, rz: 0 };

// main
var main = document.getElementById('main');
function centerMain() {
  main.style.transform = [
    'translate(', window.innerWidth / 2, 'px,', window.innerHeight / 2,'px)'
  ].join('');
}
window.onresize = centerMain;
centerMain();
document.body.addEventListener('click', defaultView);

// Item input (generation)
function randomItem(a) {
  return a[Math.floor(Math.random() * a.length)];
}
var items = Array(118);
// var items = Array(118);
for (var i = 0; i < items.length; i++) {
  items[i] = {
    id: i,
    x: 0,
    y: 0,
    z: 0,
    rx: 0,
    ry: 0,
    rz: 0,
    text: randomItem('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + randomItem('aeiouy')
  };
}

// create items
items.forEach(function(item) {
  var el = document.createElement('div');
  el.className = 'item';
  el.innerText = item.text + (item.id + 1);
  main.appendChild(el);
  el.addEventListener('click', function(e) {
    console.log('click', item);
    lookAt(item.x + 70, item.y + 90, item.z);
    e.stopPropagation();
  });
  item.el = el;
});

// Structure logic
var currentStructure = 'halloffame';
var structures = {
  helix: {
    radius: 1000,
    perLoop: 30,
    stretch: 10,
    resetView: function() {
      ref.x = 0;
      ref.y = -(this.stretch * items.length / 2);
      ref.z = -1000;
      ref.rx = 0;
      ref.ry = 0;
      ref.rz = 0;
    },
    layout: function() {
      var rowLength = this.perLoop;
      var counter = 0;
      while (items[counter]) {
        var theta = Math.floor(((counter / rowLength) % 1) * 360);
        var cosTheta = Math.cos(theta / 180 * Math.PI);
        var sinTheta = Math.sin(theta / 180 * Math.PI);
        var r = this.radius;
        items[counter].x = r * cosTheta;
        items[counter].y = counter * this.stretch;
        items[counter].z = r * sinTheta;
        items[counter].rx = 0;
        items[counter].ry = 90 - theta;
        items[counter].rz = 0;
        counter++;
      }
    }
  },
  halloffame: {
    radius: 1000,
    rows: 4,
    resetView: function() {
      ref.x = 0;
      ref.y = -(this.rows * 90);
      ref.z = -1000;
      ref.rx = 0;
      ref.ry = 0;
      ref.rz = 0;
    },
    layout: function() {
      var rowLength = Math.ceil(items.length / this.rows);
      
      var counter = 0;
      while (items[counter]) {
        var theta = Math.floor(((counter / rowLength) % 1) * 360);
        var cosTheta = Math.cos(theta / 180 * Math.PI);
        var sinTheta = Math.sin(theta / 180 * Math.PI);
        var r = this.radius;
        items[counter].x = r * cosTheta;
        items[counter].y = Math.floor(counter / rowLength) * 180;
        items[counter].z = r * sinTheta;
        items[counter].rx = 0;
        items[counter].ry = 90 - theta;
        items[counter].rz = 0;
        counter++;
      }
    }
  },
  table: {
    cols: 18,
    resetView: function() {
      ref.x = -1250; // middle x
      ref.y = -900; // middle y
      ref.z = -2000;
      ref.rx = 0;
      ref.ry = 0;
      ref.rz = 0;
    },
    layout: function() {
      
      // periodic layout
      var r1 = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1];
      var r2 = [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1];
      var r3 = Array(18).fill(1);
      var r4 = [1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var r5 = Array(18).fill(0);
      var r6 = [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
      var grid = [r1, r2, r2, r3, r3, r4, r4, r5, r6, r6];
      
      var counter = 0;
      var p = 0;
      while (items[counter]) {
        while (p < 200 && !grid[Math.floor(p / this.cols)][p % this.cols]) {
          p++;
        }
        items[counter].x = (p % this.cols) * 140; // col width
        items[counter].y = (Math.floor(p / this.cols)) * 180; // row height
        items[counter].z = 0;
        items[counter].rx = 0;
        items[counter].ry = 0;
        items[counter].rz = 0;
        counter++;
        p++;
      }
    }
  }
};

function setStructure(type) {
  structures[type].layout();
  structures[type].resetView();
  currentStructure = type;
}

function defaultView() {
  structures[currentStructure].resetView();
}

function lookAt(x, y, z) {
  ref.x = -x;
  ref.y = -y;
  ref.z = 200 + z;
}

function renderItem(item) {
  set3d(item.el, item);
}

function set3d(el, d) {
  var x = ref.x + d.x;
  var y = ref.y + d.y;
  var z = ref.z + d.z;
  el.style.transform = [
    'perspective(1000px) ',
    'translate3d(', x, 'px,', y, 'px,', z, 'px) ',
    'rotateX(' + ((d.rx || 0)) + 'deg) ',
    'rotateY(' + ((d.ry || 0)) + 'deg) ',
    'rotateZ(' + ((d.rz || 0)) + 'deg) '
  ].join('');
}

// Begin
setStructure(currentStructure);

// dev
var originEl = document.createElement('div');
originEl.innerText = 'origin';
originEl.style.backgroundColor = 'white';
main.appendChild(originEl);
var origin = {el: originEl, x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0};

// use requestAnimationFrame?
setInterval(function() {
  renderItem(origin);
  items.forEach(renderItem);
}, 1000 / 30); // 30 fps


// Controls
var speed = 100;
document.addEventListener('keydown', function (event) {
  var k = event.key;
  if (k === 'ArrowUp') ref.z -= speed;
  if (k === 'ArrowDown') ref.z += speed;
  if (k === 'w') ref.y += speed;
  if (k === 'a') ref.x += speed;
  if (k === 's') ref.y -= speed;
  if (k === 'd') ref.x -= speed;
  if (k === 'e') ref.ry += speed / 36;
  if (k === 'q') ref.ry -= speed / 36;
}, false);

document.getElementById('table-view').addEventListener('click', function() {
  setStructure('table');
});
document.getElementById('hall-of-fame-view').addEventListener('click', function() {
  setStructure('halloffame');
});
document.getElementById('helix-view').addEventListener('click', function() {
  setStructure('helix');
});
