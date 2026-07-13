/* Calculadora de lana: estimación de metros y ovillos según prenda, talla y grosor. */

const CALC = {
  // Metros base para talla adulto M con lana de grosor medio.
  garments: {
    gorro: 180,
    bufanda: 350,
    cuello: 220,
    chaleco: 700,
    sweater: 1000,
    cardigan: 1100,
    manta: 1200,
    calcetines: 400,
    amigurumi: 150,
  },
  sizes: { bebe: 0.4, nino: 0.65, s: 0.9, m: 1.0, l: 1.15, xl: 1.3 },
  // Lana más gruesa rinde menos metros por prenda... pero también requiere menos metros totales.
  weights: { fino: 1.15, medio: 1.0, grueso: 0.8, muygrueso: 0.65 },
  margin: 1.1, // 10% de margen de seguridad
};

function initCalculadora() {
  const form = document.getElementById('calc-form');
  const result = document.getElementById('calc-result');

  const garmentSel = form.querySelector('[name=garment]');
  const sizeSel = form.querySelector('[name=size]');
  const weightSel = form.querySelector('[name=weight]');

  garmentSel.innerHTML = Object.keys(CALC.garments)
    .map((g) => `<option value="${g}" data-i18n="calc.g.${g}"></option>`)
    .join('');
  sizeSel.innerHTML = Object.keys(CALC.sizes)
    .map((s) => `<option value="${s}" ${s === 'm' ? 'selected' : ''} data-i18n="calc.s.${s}"></option>`)
    .join('');
  weightSel.innerHTML = Object.keys(CALC.weights)
    .map((w) => `<option value="${w}" ${w === 'medio' ? 'selected' : ''} data-i18n="calc.w.${w}"></option>`)
    .join('');

  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const meters = Math.round(
      CALC.garments[garmentSel.value] *
      CALC.sizes[sizeSel.value] *
      CALC.weights[weightSel.value] *
      CALC.margin
    );
    const skeinLen = Math.max(1, parseInt(form.querySelector('[name=skein]').value, 10) || 100);
    const skeins = Math.ceil(meters / skeinLen);

    document.getElementById('calc-meters').textContent = meters;
    document.getElementById('calc-skeins').textContent =
      `≈ ${skeins} ${t('calc.skeins')} ${skeinLen} m`;
    result.classList.add('visible');
  });

  document.addEventListener('langchange', () => {
    // Re-traduce las opciones de los selects (applyI18n ya cubre los data-i18n).
    if (result.classList.contains('visible')) form.requestSubmit();
  });
}
