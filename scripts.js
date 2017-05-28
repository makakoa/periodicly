function randomItem(a) {
  return a[Math.floor(Math.random() * a.length)];
}
// Item generation
var items = Array(118);
for (var i = 0; i < items.length; i++) {
  items[i] = {
    id: i,
    x: 0,
    y: 0,
    z: 0,
    text: randomItem('ABCDEFGHIJKLMNOPQRSTUVWXYZ') + randomItem('aeiouy')
  };
}

// main
var main = document.getElementById('main');
set3d(main, window.innerWidth / 2, window.innerHeight / 2, 0, 0);
document.body.addEventListener('click', function() {
  defaultView();
});

// reference
var refEl = document.getElementById('reference');
var reference = {el: refEl, x: 0, y: 0, z: -1000};
function lookAt(x, y, z) {
  reference.x = -x;
  reference.y = -y;
  reference.z = 200 + z;
}

items.forEach(function(item) {
  var el = document.createElement('div');
  el.className = 'item';
  el.innerText = item.text + item.id;
  refEl.appendChild(el);
  el.addEventListener('click', function(e) {
    lookAt(item.x + 70, item.y + 90, item.z);
    e.stopPropagation();
  });
  item.el = el;
});

var currentStructure = 'table';
var tCols = 18;
var structures = {
  table: {
    resetView: function() {
      reference.x = -1250; // middle x
      reference.y = -900; // middle y
      reference.z = -1000;
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
        while (p < 200 && !grid[Math.floor(p / tCols)][p % tCols]) {
          p++;
        }
        items[counter].x = (p % tCols) * 140; // col width
        items[counter].y = (Math.floor(p / tCols)) * 180; // row height
        counter++;
        p++;
      }
    }
  }
};



structures[currentStructure].layout();
structures[currentStructure].resetView();


function defaultView() {
  structures[currentStructure].resetView();
}

var speed = 100;
document.addEventListener('keydown', function (event) {
  var k = event.key;

  if (k === 'ArrowUp') {
    reference.z -= speed;
  } else if (k === 'ArrowDown') {
    reference.z += speed;
  } else if (k === 'w') {
    reference.y += speed;
  } else if (k === 'a') {
    reference.x += speed;
  } else if (k === 's') {
    reference.y -= speed;
  } else if (k === 'd') {
    reference.x -= speed;
  }
}, false);


function renderItem(item) {
  set3d(item.el, item.x, item.y, item.z);
}

function set3d(el, x, y, z, p) {
  el.style.transform = 'perspective(' + (p || 500) + 'px) translate3d(' + x
    + 'px,' + y + 'px,' + z +'px)';
}

setInterval(function() {
  renderItem(reference);
  items.forEach(renderItem);
}, 1000 / 30); // 30 fps
