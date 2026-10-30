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
        if (date && data.lastChecked) {
          var checkedLabel = window.SiteI18n ? window.SiteI18n.label('checked') : 'Last checked';
          var checkedDate = new Date(data.lastChecked + 'T12:00:00Z');
          var locale = window.SiteI18n ? window.SiteI18n.currentLanguage() : 'en';
          var formattedDate = Number.isNaN(checkedDate.getTime())
            ? data.lastChecked
            : new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(checkedDate);
          date.textContent = checkedLabel + ': ' + formattedDate;
        }

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

        if (window.SiteI18n) window.SiteI18n.applyTo(rentalStatus);
      })
      .catch(function () {
        var pill = rentalStatus.querySelector('[data-rental-status-pill]');
        if (pill) pill.textContent = window.SiteI18n ? window.SiteI18n.label('review') : 'Manual review needed';
      });
  }

  var contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      var data = new FormData(contactForm);
      var subject = '[Get Me On The Sun] ' + data.get('subject');
      var lines = [
        'Name: ' + data.get('name'),
        'Email: ' + data.get('email'),
        'Telephone: ' + (data.get('phone') || 'Not provided'),
        'Preferred language: ' + data.get('language'),
        '',
        'Enquiry:',
        data.get('message')
      ];
      var mailto = 'mailto:hello@getmeonthesun.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(lines.join('\n'));
      var status = contactForm.querySelector('[data-contact-status]');
      var statusMessages = {
        en: 'Your email application should now open. Please review the message and press Send.',
        es: 'Su aplicación de correo debería abrirse ahora. Revise el mensaje y pulse Enviar.',
        ru: 'Сейчас должно открыться ваше почтовое приложение. Проверьте сообщение и нажмите «Отправить».',
        bg: 'Вашето приложение за имейл трябва да се отвори. Прегледайте съобщението и натиснете „Изпращане“.'
      };
      var currentLanguage = window.SiteI18n ? window.SiteI18n.currentLanguage() : 'en';
      if (status) status.textContent = statusMessages[currentLanguage] || statusMessages.en;
      window.location.href = mailto;
    });
  }

});
