// reference point
var ref = { x: 0, y: 0, z: -1000, rx: 0, ry: 0, rz: 0 };

// main
var main = document.getElementById('main');
function centerMain() {
  main.style.transform = [
    'translate(', window.innerWidth / 2 - 50, 'px,', window.innerHeight / 2,'px)'
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
    rz: 0
  };
}

// create items
items.forEach(function(item) {
  var el = document.createElement('div');
  el.className = 'item';

  var name = document.createElement('div');
  name.className = 'name';
  name.innerText = randomItem('ABCDEFGHIJKLMNOPQRSTUVWXYZ')+randomItem('aeiouy');
  el.appendChild(name);
  
  var aNum = document.createElement('div');
  aNum.className = 'atomic-num';
  aNum.innerText = item.id + 1;
  el.appendChild(aNum);

  var aWeight = document.createElement('div');
  aWeight.className = 'atomic-weight';
  aWeight.innerText = item.id + parseFloat((Math.random() * 2).toFixed(3));
  el.appendChild(aWeight);  
  
  var desc = document.createElement('div');
  desc.className = 'item-description';
  desc.innerText = 'fake element';
  el.appendChild(desc);
  
  main.appendChild(el);
  el.addEventListener('click', function(e) {
    lookAt(item);
    e.stopPropagation();
  });
  item.el = el;
});

// Structure logic
var currentStructure = 'spiral';
var structures = {
  spiral: {
    label: document.getElementById('spiral-view'),
    space: 30,
    periods: 5,
    resetView: function() {
      ref.x = -300;
      ref.y = -3000;
      ref.z = -2300;
      ref.rx = 50;
      ref.ry = 0;
      ref.rz = 50;
    },
    layout: function() {
      
      var counter = 0;
      var theta = 0;
      while (items[counter]) {
        // var theta = (counter / items.length) * 2 * Math.PI * this.periods;
        theta += (1 / (counter + 10)) * Math.PI * 2;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);
        items[counter].x = (counter + 5) * this.space * cosTheta;
        items[counter].y = (counter + 5) * this.space * sinTheta;
        items[counter].z = 0;
        items[counter].rx = 0;
        items[counter].ry = 0;
        items[counter].rz = (theta * 180 / Math.PI - 90) % 360;
        counter++;
      }

    }
  },
  
  shifting: {
    label: document.getElementById('shifting-view'),
    space: 100,
    shrink: 5,
    resetView: function() {
      var gridSize = this.space * items.length / this.shrink;
      ref.x = -gridSize / 2 + 700;
      ref.y = -gridSize / 2;
      ref.z = -gridSize;
      ref.rx = 0;
      ref.ry = 30;
      ref.rz = 0;
    },
    layout: function() {
      // dim ^ 3 cube, set to item length so grid is always large enough
      var dim = Math.floor(items.length / this.shrink);
      var grid = Array(dim);
      for (var x = 0; x < dim; x++) {
        grid[x] = Array(dim);
        for (var y = 0; y < dim; y++) {
          grid[x][y] = Array(dim).fill(false);
        }
      }
      var space = this.space;
      
      var counter = 0;
      while (items[counter]) {
        var x = Math.floor(Math.random() * dim);
        var y = Math.floor(Math.random() * dim);
        var z = Math.floor(Math.random() * dim);
        if (!grid[x][y][z]) {
          items[counter].x = x * space;
          items[counter].y = y * space;
          items[counter].z = z * space;
          items[counter].rx = 0;
          items[counter].ry = 0;
          items[counter].rz = 0;
          grid[x][y][z] = items[counter];
          counter++;
        }
      }
      var shift = setInterval(function() {
        if (currentStructure !== 'shifting') clearInterval(shift);
        var item = randomItem(items);
        var x = item.x / space;
        var y = item.y / space;
        var z = item.z / space;
        var newX = x, newY = y, newZ = z;
        while(grid[newX][newY][newZ]) {
          newX = Math.floor(Math.random() * dim);
          newY = Math.floor(Math.random() * dim);
          newZ = Math.floor(Math.random() * dim);
        }
        grid[x][y][z] = false;
        item.x = newX * space;
        item.y = newY * space;
        item.z = newZ * space;
        grid[newX][newY][newZ] = item;
      }, 200);
    }
  },
  
  sphere: {
    label: document.getElementById('sphere-view'),
    radius: 800,
    resetView: function() {
      ref.x = 0;
      ref.y = -this.radius
      ref.z = -2000;
      ref.rx = -5;
      ref.ry = 0;
      ref.rz = 0;
    },
    layout: function() {
      var rows = 7;
      var rowSplits = [1, 2, 3, 4, 3, 2, 1]; // 16ths
      var counter = 0;
      for (var rowNum = 0; rowNum < rowSplits.length; rowNum++) {
        var deltaY = (rowNum) / (rows-1) * 2 - 1; // height from midsphere
        var thetaY = Math.asin(deltaY * 0.95);
        var rowLength = Math.ceil(items.length / 16 * rowSplits[rowNum]);
        var rowCounter = 0;
        while (rowCounter < rowLength) {
          if (!items[counter]) break;
          var theta = Math.floor(((rowCounter / rowLength) % 1) * 360);
          var cosTheta = Math.cos(theta / 180 * Math.PI);
          var sinTheta = Math.sin(theta / 180 * Math.PI);
          var rAdj = (this.radius - 200) * Math.cos(thetaY) + 200;
          items[counter].x = rAdj * cosTheta;
          items[counter].y = rowNum * this.radius / 3;
          items[counter].z = rAdj * sinTheta;
          items[counter].rx = -thetaY * 180 / Math.PI; // * sinTheta;
          items[counter].ry = (90 - theta);
          items[counter].rz = 0;
          counter++;
          rowCounter++;
        }
      }
    }
  },
  
  helix: {
    label: document.getElementById('helix-view'),
    radius: 500,
    perLoop: 20.3,
    stretch: 20,
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
    label: document.getElementById('hall-of-fame-view'),
    radius: 1000,
    rows: 4,
    resetView: function() {
      ref.x = 0;
      ref.y = -(this.rows * 90);
      ref.z = this.radius / 2;
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
        items[counter].ry = 270 - theta;
        items[counter].rz = 0;
        counter++;
      }
    }
  },
  
  table: {
    label: document.getElementById('table-view'),
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
  structures[currentStructure].label.className = '';
  currentStructure = type;
  structures[type].label.className = 'selected';
}

function defaultView() {
  structures[currentStructure].resetView();
}

function lookAt(item) {
  ref.x = -item.x;
  ref.y = -item.y;
  ref.z = -item.z + 500;
  ref.rx = -item.rx;
  ref.ry = -item.ry;
  ref.rz = -item.rz;
}

function renderItem(item) {
  set3d(item.el, item);
}

var perspective = 1000;
function set3d(el, d) {
  el.style.transform = [
    'perspective(' + perspective + 'px) ',
    'rotateZ(' + ((ref.rz || 0)) + 'deg) ',
    'rotateX(' + ((ref.rx || 0)) + 'deg) ',
    'rotateY(' + ((ref.ry || 0)) + 'deg) ',
    'translate3d(', ref.x, 'px,', ref.y, 'px,', ref.z, 'px) ',
    'translate3d(', d.x, 'px,', d.y, 'px,', d.z, 'px) ',
    'rotateY(' + ((d.ry || 0)) + 'deg) ',
    'rotateX(' + ((d.rx || 0)) + 'deg) ',
    'rotateZ(' + ((d.rz || 0)) + 'deg) '
  ].join('');
}

// Begin
setStructure(currentStructure);

function renderAll() {
  items.forEach(renderItem);
}
var rloop = setInterval(renderAll, 1000 / 30); // 30 fps

// Controls
var speed = 100;
document.addEventListener('keydown', function (event) {
  var k = event.key;
  if (k === 'ArrowUp') ref.rx -= speed / 36;
  if (k === 'ArrowDown') ref.rx += speed / 36;
  if (k === 'ArrowLeft') ref.ry -= speed / 36;
  if (k === 'ArrowRight') ref.ry += speed / 36;
  if (k === 'w') ref.y += speed;
  if (k === 'a') ref.x += speed;
  if (k === 's') ref.y -= speed;
  if (k === 'd') ref.x -= speed;
  if (k === 'e') ref.z += speed;
  if (k === 'q') ref.z -= speed;
}, false);

structures.table.label.addEventListener('click', function() {
  setStructure('table');
});
structures.halloffame.label.addEventListener('click', function() {
  setStructure('halloffame');
});
structures.helix.label.addEventListener('click', function() {
  setStructure('helix');
});
structures.sphere.label.addEventListener('click', function() {
  setStructure('sphere');
});
structures.shifting.label.addEventListener('click', function() {
  setStructure('shifting');
});
structures.spiral.label.addEventListener('click', function() {
  setStructure('spiral');
});
