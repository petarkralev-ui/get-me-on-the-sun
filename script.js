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

  var calculator = document.querySelector('[data-mortgage-calculator]');
  if (!calculator) return;

  var presets = {
    'fixed-bonified': { fixedRate: 2.96, euribor: 2.798, margin: 0.84, mode: 'fixed' },
    'fixed-standard': { fixedRate: 3.96, euribor: 2.798, margin: 1.84, mode: 'fixed' },
    'variable-bonified': { fixedRate: 2.96, euribor: 2.798, margin: 0.84, mode: 'variable' },
    'variable-standard': { fixedRate: 3.96, euribor: 2.798, margin: 1.84, mode: 'variable' }
  };

  function input(name) {
    return calculator.querySelector('[data-calc="' + name + '"]');
  }

  function output(name) {
    return calculator.querySelector('[data-calc-output="' + name + '"]');
  }

  function value(name) {
    var field = input(name);
    return field ? Number(field.value) || 0 : 0;
  }

  function money(amount) {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(amount);
  }

  function monthlyPayment(principal, annualRate, years) {
    var months = years * 12;
    var monthlyRate = annualRate / 100 / 12;
    if (!principal || !months) return 0;
    if (!monthlyRate) return principal / months;
    var factor = Math.pow(1 + monthlyRate, months);
    return principal * monthlyRate * factor / (factor - 1);
  }

  function applyPreset() {
    var presetName = input('preset').value;
    var preset = presets[presetName];
    if (!preset) return;
    input('fixedRate').value = preset.fixedRate;
    input('euribor').value = preset.euribor;
    input('margin').value = preset.margin;
  }

  function calculate() {
    var price = value('price');
    var depositPercent = value('deposit');
    var years = value('years');
    var costsPercent = value('costs');
    var presetName = input('preset').value;
    var preset = presets[presetName] || { mode: 'fixed' };
    var isVariable = preset.mode === 'variable';
    var annualRate = isVariable ? value('euribor') + value('margin') : value('fixedRate');
    var depositAmount = price * depositPercent / 100;
    var buyingCosts = price * costsPercent / 100;
    var loanAmount = Math.max(price - depositAmount, 0);
    var monthly = monthlyPayment(loanAmount, annualRate, years);
    var totalPaid = monthly * years * 12;
    var totalInterest = Math.max(totalPaid - loanAmount, 0);
    var ltv = price ? loanAmount / price * 100 : 0;

    output('depositLabel').textContent = depositPercent.toFixed(0) + '%';
    output('monthly').textContent = money(monthly);
    output('rateNote').textContent = isVariable
      ? 'Using Euribor ' + value('euribor').toFixed(3) + '% + margin ' + value('margin').toFixed(2) + '%'
      : 'Using ' + value('fixedRate').toFixed(2) + '% fixed rate';
    output('depositAmount').textContent = money(depositAmount);
    output('loanAmount').textContent = money(loanAmount);
    output('ltv').textContent = ltv.toFixed(0) + '%';
    output('cashNeeded').textContent = money(depositAmount + buyingCosts);
    output('interest').textContent = money(totalInterest);
    output('warning').textContent = ltv > 70
      ? 'This is above the 60-70% range many non-resident buyers should plan around. We help check the lender, deposit, valuation, and contract risk before you commit.'
      : 'This is an estimate only. We help check what deposit, bank, rate type, and conditions are realistic before you commit to the property.';
  }

  calculator.querySelectorAll('input, select').forEach(function (field) {
    field.addEventListener('input', function () {
      if (field.dataset.calc === 'preset') applyPreset();
      calculate();
    });
  });

  calculate();
});
