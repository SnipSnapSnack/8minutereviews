(function () {
  var html =
    '<div id="cookie-modal-overlay" class="cookie-modal-overlay">' +
    '  <div class="cookie-modal" role="dialog" aria-labelledby="cookie-modal-title">' +
    '    <div class="cookie-modal-title">' +
    '      <span id="cookie-modal-title">&#x1F36A; Cookie Notice</span>' +
    '      <button type="button" class="cookie-modal-close-x" aria-label="Close" data-cookie-action="dismiss">&times;</button>' +
    '    </div>' +
    '    <div class="cookie-modal-body">' +
    '      <div class="cookie-modal-icon">&#x1F36A;</div>' +
    '      <div class="cookie-modal-text">' +
    '        <p>We\'re sorry, but this website does <b>not</b> have any cookies.</p>' +
    '        <p>We sincerely apologize for any inconvenience this may cause.</p>' +
    '      </div>' +
    '    </div>' +
    '    <div class="cookie-modal-buttons">' +
    '      <button type="button" class="win95-button" data-cookie-action="dismiss">That\'s ok</button>' +
    '      <button type="button" class="win95-button" data-cookie-action="search">I need cookies</button>' +
    '    </div>' +
    '  </div>' +
    '</div>';

  function init() {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.appendChild(wrapper);

    var overlay = document.getElementById('cookie-modal-overlay');

    function dismiss() {
      overlay.parentNode.removeChild(overlay);
    }

    function search() {
      window.location.href = 'https://www.google.com/search?q=cookies+near+me';
    }

    overlay.addEventListener('click', function (e) {
      var action = e.target.getAttribute('data-cookie-action');
      if (action === 'dismiss') dismiss();
      if (action === 'search') search();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
