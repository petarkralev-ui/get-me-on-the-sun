document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  var rentalStatus = document.querySelector('[data-rental-status]');
  if (rentalStatus && window.fetch) {
    fetch('rental-law-status.json', { cache: 'no-store' })
      .then(function (response) {
        if (!response.ok) throw new Error('Rental status unavailable');
        return response.json();
      })
      .then(function (data) {
        var title = rentalStatus.querySelector('[data-rental-status-title]');
        var copy = rentalStatus.querySelector('[data-rental-status-copy]');
        var pill = rentalStatus.querySelector('[data-rental-status-pill]');
        var date = rentalStatus.querySelector('[data-rental-status-date]');
        var linkWrap = rentalStatus.querySelector('[data-rental-status-links]');

        if (title && data.headline) title.textContent = data.headline;
        if (copy && data.summary) copy.textContent = data.summary;
        if (pill && data.statusLabel) pill.textContent = data.statusLabel;
        if (date && data.lastChecked) date.textContent = 'Last checked: ' + data.lastChecked;

        if (linkWrap && Array.isArray(data.sources)) {
          linkWrap.innerHTML = '';
          data.sources.forEach(function (source) {
            if (!source.url || !source.label) return;
            var a = document.createElement('a');
            a.href = source.url;
            a.target = '_blank';
            a.rel = 'noopener';
            a.textContent = source.label;
            linkWrap.appendChild(a);
          });
        }
      })
      .catch(function () {
        var pill = rentalStatus.querySelector('[data-rental-status-pill]');
        if (pill) pill.textContent = 'Manual review needed';
      });
  }

});
