(function () {
  'use strict';

  var language = window.SiteI18n ? window.SiteI18n.currentLanguage() : 'en';
  var supported = ['en', 'es', 'ru', 'bg'];
  if (supported.indexOf(language) === -1) language = 'en';

  var copy = {
    en: {
      open: 'Ask Sun Guide', title: 'Sun Guide', subtitle: 'Website assistant', close: 'Close assistant',
      welcome: 'Hello. I can explain the services on this website and point you to the right page. What would you like to know?',
      placeholder: 'Ask about mortgages, NIE, tax or viewings', send: 'Send',
      note: 'General website information only. Mortgage, tax and legal details must be confirmed for your circumstances.',
      fallback: 'I could not match that question confidently. Try one of the topics below, or speak with the team for an answer based on your circumstances.',
      view: 'Read more', typing: 'Sun Guide is preparing an answer',
      prompts: ['How much deposit do I need?', 'How do you help with an NIE?', 'Can I view a property remotely?', 'What taxes should I budget for?']
    },
    es: {
      open: 'Pregunte a Sun Guide', title: 'Sun Guide', subtitle: 'Asistente del sitio web', close: 'Cerrar asistente',
      welcome: 'Hola. Puedo explicarle los servicios de este sitio web y dirigirle a la página adecuada. ¿Qué desea saber?',
      placeholder: 'Pregunte sobre hipotecas, NIE, impuestos o visitas', send: 'Enviar',
      note: 'Solo información general del sitio web. Los detalles hipotecarios, fiscales y legales deben confirmarse para su situación.',
      fallback: 'No he podido identificar esa pregunta con seguridad. Pruebe uno de los temas siguientes o consulte al equipo para recibir una respuesta adaptada a su situación.',
      view: 'Leer más', typing: 'Sun Guide está preparando una respuesta',
      prompts: ['¿Qué entrada necesito?', '¿Cómo ayudan con el NIE?', '¿Puedo visitar una propiedad a distancia?', '¿Qué impuestos debo presupuestar?']
    },
    ru: {
      open: 'Спросить Sun Guide', title: 'Sun Guide', subtitle: 'Помощник по сайту', close: 'Закрыть помощника',
      welcome: 'Здравствуйте. Я могу объяснить услуги на этом сайте и направить вас на нужную страницу. Что вы хотите узнать?',
      placeholder: 'Спросите об ипотеке, NIE, налогах или просмотрах', send: 'Отправить',
      note: 'Только общая информация с сайта. Ипотечные, налоговые и юридические детали необходимо подтвердить с учетом вашей ситуации.',
      fallback: 'Я не смог уверенно определить тему вопроса. Выберите одну из тем ниже или обратитесь к команде за ответом с учетом вашей ситуации.',
      view: 'Подробнее', typing: 'Sun Guide готовит ответ',
      prompts: ['Какой первоначальный взнос нужен?', 'Как вы помогаете с NIE?', 'Можно ли посмотреть объект удаленно?', 'Какие налоги нужно учесть?']
    },
    bg: {
      open: 'Попитайте Sun Guide', title: 'Sun Guide', subtitle: 'Помощник за уебсайта', close: 'Затваряне на помощника',
      welcome: 'Здравейте. Мога да обясня услугите в този уебсайт и да ви насоча към правилната страница. Какво искате да знаете?',
      placeholder: 'Попитайте за ипотека, NIE, данъци или огледи', send: 'Изпращане',
      note: 'Само обща информация от уебсайта. Ипотечните, данъчните и правните подробности трябва да бъдат потвърдени за вашия случай.',
      fallback: 'Не успях да разпозная въпроса достатъчно сигурно. Изберете тема по-долу или се свържете с екипа за отговор според вашия случай.',
      view: 'Прочетете повече', typing: 'Sun Guide подготвя отговор',
      prompts: ['Какъв депозит ми е необходим?', 'Как помагате за NIE?', 'Мога ли да разгледам имот дистанционно?', 'Какви данъци да предвидя?']
    }
  };

  var answers = {
    service: {
      page: 'index.html',
      words: ['service', 'help', 'handle', 'all in one', 'servicio', 'ayuda', 'услуги', 'помощ', 'услуга'],
      text: {
        en: 'We coordinate the complete Tenerife property journey: NIE, mortgage preparation, property search, viewings, contracts, notary, keys, tax coordination, maintenance and rental support. You have one team coordinating the specialists and appointments.',
        es: 'Coordinamos todo el proceso inmobiliario en Tenerife: NIE, preparación hipotecaria, búsqueda, visitas, contratos, notaría, llaves, coordinación fiscal, mantenimiento y alquiler. Un solo equipo coordina a los especialistas y las citas.',
        ru: 'Мы координируем весь процесс покупки недвижимости на Тенерифе: NIE, подготовку ипотеки, поиск и просмотры, договоры, нотариуса, получение ключей, налоги, обслуживание и аренду.',
        bg: 'Координираме целия процес за имот в Тенерифе: NIE, подготовка за ипотека, търсене и огледи, договори, нотариус, ключове, данъчна координация, поддръжка и отдаване под наем.'
      }
    },
    deposit: {
      page: 'mortgage-property.html',
      words: ['deposit', 'mortgage', 'ltv', 'down payment', 'hipoteca', 'deposito', 'entrada', 'ипотек', 'първоначал', 'депозит'],
      text: {
        en: 'There is no fixed legal deposit. For a non-resident buying a second home, a sensible starting plan is a 40% deposit if the bank finances up to 60%. Some applications may reach 70% finance, while a Spanish resident buying a main home may be offered up to 80%. The bank decides after reviewing income, debts, residency and valuation. Purchase taxes and completion costs are separate.',
        es: 'No existe un porcentaje de entrada fijado por ley. Para un no residente que compra una segunda vivienda, un punto de partida prudente es una entrada del 40% si el banco financia hasta el 60%. Algunas solicitudes pueden alcanzar el 70% de financiación, mientras que un residente en España que compre su vivienda habitual puede recibir hasta el 80%. El banco decide tras revisar ingresos, deudas, residencia y tasación. Los impuestos y gastos de compra son adicionales.',
        ru: 'Фиксированного законом первоначального взноса нет. Для нерезидента, покупающего второе жилье, разумно планировать взнос 40%, если банк финансирует до 60%. В отдельных случаях финансирование может достигать 70%, а резиденту Испании на основное жилье могут предложить до 80%. Банк оценивает доходы, долги, резидентство и стоимость объекта. Налоги и расходы оплачиваются отдельно.',
        bg: 'Няма законово фиксиран депозит. За нерезидент, който купува втори дом, разумен начален план е 40% депозит, ако банката финансира до 60%. Някои случаи могат да достигнат 70% финансиране, а испански резидент за основно жилище може да получи до 80%. Банката преценява доходите, задълженията, резидентството и оценката. Данъците и разходите по сделката са отделно.'
      }
    },
    nie: {
      page: 'mortgage-property.html',
      words: ['nie', 'foreigner number', 'identification', 'numero de extranjero', 'номер иностранца', 'чужденец'],
      text: {
        en: 'An NIE is the identification number used for many Spanish financial and property procedures. It can be requested in Spain or through a Spanish consulate abroad, subject to appointment availability and the correct route. We can coordinate the appointment, document checklist, forms, fees, and Spanish-speaking support. An NIE number is not the same as residence permission or the EU registration certificate.',
        es: 'El NIE es el número de identificación utilizado en muchos trámites financieros e inmobiliarios en España. Puede solicitarse en España o a través de un consulado español en el extranjero, según las citas disponibles y la vía correcta. Podemos coordinar la cita, los documentos, formularios, tasas y el apoyo en español. El número NIE no equivale a un permiso de residencia ni al certificado de registro de ciudadano de la UE.',
        ru: 'NIE - это идентификационный номер, необходимый для многих финансовых и имущественных процедур в Испании. Его можно запросить в Испании или через консульство Испании за рубежом, в зависимости от доступности записи и подходящей процедуры. Мы координируем запись, документы, формы, пошлины и помощь на испанском языке. Сам номер NIE не является разрешением на проживание.',
        bg: 'NIE е идентификационен номер за много финансови и имотни процедури в Испания. Може да се заяви в Испания или чрез испанско консулство в чужбина според наличните часове и правилната процедура. Координираме часа, документите, формулярите, таксите и помощта на испански. Самият NIE не е разрешение за пребиваване.'
      }
    },
    viewing: {
      page: 'getting-there.html',
      words: ['view', 'virtual', 'glasses', 'remote', 'property search', 'visita', 'gafas', 'distancia', 'просмотр', 'очк', 'оглед', 'дистанцион'],
      text: {
        en: 'After the budget and property brief are clear, we can shortlist suitable properties and arrange live remote viewings through smart glasses. You can watch the agent walk through the property on your computer, TV, phone or tablet, then travel only for the strongest options. Remote viewings have a separate fixed fee.',
        es: 'Cuando el presupuesto y el perfil de la propiedad están claros, podemos seleccionar opciones y organizar visitas remotas en directo mediante gafas inteligentes. Puede ver al agente recorrer la propiedad desde su ordenador, televisión, teléfono o tableta y viajar solo para las mejores opciones. Las visitas remotas tienen una tarifa fija independiente.',
        ru: 'После определения бюджета и требований мы можем подобрать объекты и организовать дистанционные просмотры в прямом эфире с помощью умных очков. Вы увидите обход объекта на компьютере, телевизоре, телефоне или планшете и сможете приехать только ради лучших вариантов. Дистанционные просмотры оплачиваются отдельно по фиксированной цене.',
        bg: 'След уточняване на бюджета и изискванията можем да подберем имоти и да организираме дистанционни огледи на живо чрез смарт очила. Гледате как агентът обикаля имота на компютър, телевизор, телефон или таблет и пътувате само за най-добрите варианти. Дистанционните огледи са с отделна фиксирана такса.'
      }
    },
    tax: {
      page: 'tax-savings.html',
      words: ['tax', 'itp', 'igic', 'ajd', 'cost', 'fees', 'impuesto', 'gastos', 'налог', 'разход'],
      text: {
        en: 'For a resale property in the Canary Islands, the general ITP planning rate is 6.5%. A first sale by a developer is normally subject to IGIC, generally 7%, and the deed may also attract AJD, commonly 1%. Notary, registry, valuation, legal, translation and administration costs are separate. Reduced rates apply only when every legal condition is met.',
        es: 'Para una vivienda usada en Canarias, el tipo general de ITP para planificación es del 6,5%. La primera venta por un promotor suele estar sujeta al IGIC, generalmente al 7%, y la escritura también puede tributar por AJD, normalmente al 1%. Notaría, registro, tasación, servicios jurídicos, traducción y administración son gastos adicionales. Los tipos reducidos solo se aplican cuando se cumplen todas las condiciones legales.',
        ru: 'Для вторичной недвижимости на Канарских островах общая плановая ставка ITP составляет 6,5%. Первая продажа застройщиком обычно облагается IGIC, как правило 7%, а нотариальный акт может также облагаться AJD, обычно 1%. Нотариус, реестр, оценка, юридические услуги, перевод и администрирование оплачиваются отдельно. Льготные ставки применяются только при выполнении всех условий.',
        bg: 'За имот на вторичния пазар в Канарските острови общата ставка на ITP за планиране е 6,5%. Първа продажба от строител обикновено се облага с IGIC, най-често 7%, а нотариалният акт може да има и AJD, обичайно 1%. Нотариус, регистър, оценка, правни услуги, превод и администрация са отделни. Намалени ставки се прилагат само ако са изпълнени всички условия.'
      }
    },
    renting: {
      page: 'maintenance-renting.html',
      words: ['rent', 'rental', 'licence', 'license', 'airbnb', 'alquiler', 'licencia', 'аренд', 'лиценз', 'наем'],
      text: {
        en: 'The lawful rental route must be checked for the specific property before it is advertised. We can coordinate the licence position, paperwork, local management, cleaning, guest support and maintenance. Tourist-rental permission, longer rentals and tax reporting are separate checks, so income cannot be guaranteed.',
        es: 'La vía legal de alquiler debe comprobarse para cada propiedad antes de anunciarla. Podemos coordinar la licencia, los trámites, la gestión local, la limpieza, la atención a huéspedes y el mantenimiento. El alquiler turístico, los alquileres de mayor duración y la fiscalidad requieren comprobaciones independientes, por lo que no se pueden garantizar ingresos.',
        ru: 'Законный вариант сдачи необходимо проверить для конкретного объекта до публикации объявления. Мы можем координировать лицензирование, документы, местное управление, уборку, работу с гостями и обслуживание. Туристическая аренда, долгосрочная аренда и налоги проверяются отдельно, поэтому доход не гарантируется.',
        bg: 'Законният начин за отдаване трябва да се провери за конкретния имот преди реклама. Можем да координираме лиценза, документите, местното управление, почистването, гостите и поддръжката. Туристическото отдаване, по-дългите наеми и данъчното отчитане са отделни проверки, затова доход не може да бъде гарантиран.'
      }
    },
    company: {
      page: 'move-company.html',
      words: ['company', 'business', 'zec', '4%', 'corporate', 'empresa', 'negocio', 'compania', 'компан', 'бизнес', 'фирм'],
      text: {
        en: 'The Canary Islands ZEC regime can apply a 4% corporate-tax rate only to approved qualifying activity carried out materially and effectively in the Canary Islands, within legal limits. It is not automatic. Activity, local investment, employment, substance, approval and continuing compliance must all be assessed. We coordinate the specialist review and setup for EU and UK businesses.',
        es: 'El régimen ZEC de Canarias puede aplicar un impuesto sobre sociedades del 4% solo a actividades aprobadas y cualificadas realizadas material y efectivamente en Canarias, dentro de los límites legales. No es automático. Deben evaluarse la actividad, inversión local, empleo, presencia real, autorización y cumplimiento continuo. Coordinamos la revisión especializada y la implantación para empresas de la UE y del Reino Unido.',
        ru: 'Режим ZEC на Канарских островах предусматривает ставку корпоративного налога 4% только для одобренной соответствующей деятельности, реально осуществляемой на Канарских островах, и в установленных законом пределах. Льгота не предоставляется автоматически. Необходимо проверить деятельность, инвестиции, рабочие места, местное присутствие, разрешение и постоянное соблюдение требований.',
        bg: 'Режимът ZEC на Канарските острови може да приложи 4% корпоративен данък само за одобрена допустима дейност, която реално се извършва на Канарските острови и е в законовите граници. Това не е автоматично. Оценяват се дейността, местната инвестиция, работните места, реалното присъствие, одобрението и текущото съответствие.'
      }
    }
  };

  function pageUrl(path) {
    var url = new URL(path, window.location.href);
    if (language !== 'en') url.searchParams.set('lang', language);
    return url.href;
  }

  function normalise(value) {
    return value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[?!¿¡.,;:()]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function localAnswer(question) {
    var input = normalise(question);
    var best = null;
    var score = 0;
    Object.keys(answers).forEach(function (key) {
      var item = answers[key];
      var itemScore = item.words.reduce(function (total, word) {
        return total + (input.indexOf(word) !== -1 ? (word.length > 5 ? 3 : 1) : 0);
      }, 0);
      if (itemScore > score) {
        best = item;
        score = itemScore;
      }
    });
    return score ? best : null;
  }

  function buildAssistant() {
    var strings = copy[language];
    var root = document.createElement('div');
    root.className = 'sun-guide';
    root.setAttribute('data-no-i18n', '');
    root.innerHTML =
      '<button class="sun-guide-launcher" type="button" aria-expanded="false" aria-controls="sun-guide-panel">' +
        '<span class="sun-guide-launcher-icon" aria-hidden="true">?</span><span>' + strings.open + '</span>' +
      '</button>' +
      '<section class="sun-guide-panel" id="sun-guide-panel" aria-label="' + strings.title + '" hidden>' +
        '<header class="sun-guide-header"><div><strong>' + strings.title + '</strong><span>' + strings.subtitle + '</span></div>' +
        '<button class="sun-guide-close" type="button" aria-label="' + strings.close + '">&times;</button></header>' +
        '<div class="sun-guide-messages" role="log" aria-live="polite"></div>' +
        '<div class="sun-guide-prompts"></div>' +
        '<form class="sun-guide-form"><label class="sr-only" for="sun-guide-input">' + strings.placeholder + '</label>' +
        '<input id="sun-guide-input" type="text" maxlength="240" autocomplete="off" placeholder="' + strings.placeholder + '">' +
        '<button type="submit">' + strings.send + '</button></form>' +
        '<p class="sun-guide-note">' + strings.note + '</p>' +
      '</section>';
    document.body.appendChild(root);

    var launcher = root.querySelector('.sun-guide-launcher');
    var panel = root.querySelector('.sun-guide-panel');
    var close = root.querySelector('.sun-guide-close');
    var messages = root.querySelector('.sun-guide-messages');
    var prompts = root.querySelector('.sun-guide-prompts');
    var form = root.querySelector('.sun-guide-form');
    var input = root.querySelector('input');

    function addMessage(text, sender, link) {
      var message = document.createElement('div');
      message.className = 'sun-guide-message ' + sender;
      var paragraph = document.createElement('p');
      paragraph.textContent = text;
      message.appendChild(paragraph);
      if (link) {
        var anchor = document.createElement('a');
        anchor.href = pageUrl(link);
        anchor.textContent = strings.view + ' →';
        message.appendChild(anchor);
      }
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function setOpen(open) {
      panel.hidden = !open;
      launcher.setAttribute('aria-expanded', String(open));
      root.classList.toggle('open', open);
      if (open) {
        if (!messages.children.length) addMessage(strings.welcome, 'assistant');
        window.setTimeout(function () { input.focus(); }, 50);
      } else {
        launcher.focus();
      }
    }

    function ask(question) {
      if (!question.trim()) return;
      addMessage(question.trim(), 'user');
      input.value = '';
      var answer = localAnswer(question);

      // A protected server can set this endpoint without exposing its AI credentials.
      if (window.SUN_GUIDE_ENDPOINT) {
        fetch(window.SUN_GUIDE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: question, language: language, page: window.location.pathname })
        }).then(function (response) {
          if (!response.ok) throw new Error('Assistant unavailable');
          return response.json();
        }).then(function (data) {
          if (!data || !data.answer) throw new Error('Assistant answer missing');
          addMessage(data.answer, 'assistant', data.page || null);
        }).catch(function () {
          addMessage(answer ? answer.text[language] : strings.fallback, 'assistant', answer ? answer.page : null);
        });
        return;
      }

      window.setTimeout(function () {
        addMessage(answer ? answer.text[language] : strings.fallback, 'assistant', answer ? answer.page : null);
      }, 220);
    }

    strings.prompts.forEach(function (prompt) {
      var button = document.createElement('button');
      button.type = 'button';
      button.textContent = prompt;
      button.addEventListener('click', function () { ask(prompt); });
      prompts.appendChild(button);
    });

    launcher.addEventListener('click', function () { setOpen(panel.hidden); });
    close.addEventListener('click', function () { setOpen(false); });
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      ask(input.value);
    });
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && !panel.hidden) setOpen(false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildAssistant);
  else buildAssistant();
}());
