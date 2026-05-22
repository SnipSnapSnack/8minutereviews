(function () {
  var symbols = ['*', '+', '✦', '✨', '·'];
  var colors = ['#ffff00', '#ff00ff', '#00ffff', '#ffffff', '#ffaa00'];
  var lastTime = 0;
  var throttleMs = 40;

  function spawn(x, y) {
    var s = document.createElement('span');
    s.className = 'sparkle';
    s.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    s.style.left = (x + (Math.random() * 12 - 6)) + 'px';
    s.style.top = (y + (Math.random() * 12 - 6)) + 'px';
    s.style.color = colors[Math.floor(Math.random() * colors.length)];
    s.style.fontSize = (10 + Math.random() * 8) + 'px';
    document.body.appendChild(s);
    setTimeout(function () {
      if (s.parentNode) s.parentNode.removeChild(s);
    }, 850);
  }

  document.addEventListener('mousemove', function (e) {
    var now = Date.now();
    if (now - lastTime < throttleMs) return;
    lastTime = now;
    spawn(e.clientX, e.clientY);
  });
})();
