
let rivalCount = 4;
function switchTab(el) {
  // å¨ã¿ãã®activeè§£é¤ï¼position:absoluteã®ãã®ãå«ãï¼
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  // å¨ããã«éè¡¨ç¤º
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  // ã¯ãªãã¯ãããã¿ããactive
  el.classList.add('active');
  // å¯¾å¿ããã«ãè¡¨ç¤º
  const panel = document.getElementById('panel-' + el.dataset.panel);
  if (panel) panel.classList.add('active');
  // rival-toolbarã®è¡¨ç¤ºåæ¿
  const tb = document.getElementById('rival-toolbar');
  if (tb) tb.style.display = el.dataset.panel === 'ranking-data' ? 'flex' : 'none';
}

function addRival() {
  rivalCount++;
  const grid = document.getElementById('data-grid');
  const card = document.createElement('div');
  card.className = 'card rival-card';
  card.id = 'rival-card-' + rivalCount;
  card.innerHTML = '<div class="card-header rival"><span>ã©ã¤ãã« ' + rivalCount + '<\/span><button class="btn-remove" onclick="removeRival(' + rivalCount + ')">â<\/button><\/div><table class="form-table"><tr><td class="label">ã·ã§ããå<\/td><td class="badge-tai-col"><\/td><td class="badge-ra-col"><span class="badge-ra">ã©<\/span><\/td><td><input type="text" class="rival-shop" placeholder="ä¾: ã©ã¤ãã«ã·ã§ãã"><\/td><\/tr><tr><td class="label">ååURL<\/td><td class="badge-tai-col"><\/td><td class="badge-ra-col"><span class="badge-ra">ã©<\/span><\/td><td><input type="url" class="rival-url" placeholder="https://..."><\/td><\/tr><\/table>';
  grid.appendChild(card);
}
function removeRival(id) {
  const card = document.getElementById('rival-card-' + id);
  if (card) card.remove();
  document.querySelectorAll('.rival-card').forEach((c, i) => {
    const n = i + 1;
    c.querySelector('.card-header span').textContent = 'ã©ã¤ãã« ' + n;
    c.id = 'rival-card-' + n;
    c.querySelector('.btn-remove').setAttribute('onclick', 'removeRival(' + n + ')');
  });
  rivalCount = document.querySelectorAll('.rival-card').length;
}
function clearForm() {
  document.querySelectorAll('#panel-ranking-data input').forEach(el => { el.value = ''; });
}
function downloadCSV(filename, rows) {
  const bom = '\uFEFF';
  const csv = bom + rows.map(r => r.map(c => '"' + String(c ?? '').replace(/"/g, '""') + '"').join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename + '.csv';
  a.click();
}

function getBasic() {
  return {
    shop: document.getElementById('shop-name').value,
    mgmtNo: document.getElementById('mgmt-no').value,
    productNo: document.getElementById('product-no').value,
    productName: document.getElementById('product-name').value,
    productUrl: document.getElementById('product-url').value,
    weeklyRank: document.getElementById('weekly-rank').value,
    rankingSupplement: document.getElementById('ranking-supplement').value,
  };
}

function getRivals() {
  return Array.from(document.querySelectorAll('.rival-card')).map((card, i) => ({
    no: i + 1,
    shop: card.querySelector('.rival-shop')?.value ?? '',
    url: card.querySelector('.rival-url')?.value ?? '',
  }));
}

function downloadGeneral() {
  const b = getBasic();
  const kw = encodeURIComponent(b.productName);
  const base = 'https://yukaiya.cybozu.com/k/182/?';
  const urls = [
    base + 'view=5534938&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5534939&order_0=asc&qs=1',
    base + 'view=5534965&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534953&order_1=asc&size=20',
    base + 'view=5534967&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534954&order_1=asc&size=20',
    base + 'view=5534969&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534955&order_1=desc&size=20',
    base + 'view=5534971&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534956&order_1=desc&size=20',
    base + 'view=5534973&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5534957&order_0=asc&qs=1',
    base + 'view=5534975&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534958&order_1=desc&size=20',
    base + 'view=5534977&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534959&order_1=asc&size=20',
    base + 'view=5534979&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534960&order_1=asc&size=20',
    base + 'view=5534981&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534961&order_1=desc&size=20',
    base + 'view=5534983&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534963&order_1=desc&size=20',
    base + 'view=5534985&q=f5532012%20like%20%22' + kw + '%22#sort_0=f5532012&order_0=asc&sort_1=f5534962&order_1=asc&size=20',
  ];
  const header = ['ååç®¡ççªå·','ååçªå·','âåååâ','ã©ã³ã­ã³ã°è£è¶³æ°','K01-URL','K02-URL','K03-URL','K04-URL','K05-URL','K06-URL','K07-URL','K08-URL','K09-URL','K10-URL','K11-URL','K12-URL'];
  const row = [b.mgmtNo, b.productNo, b.productName, b.rankingSupplement, ...urls];
  downloadCSV('ããã¼ã¿åæãä¸¡ã·ã§ããå¯¾å¿å¨è¬', [header, row]);
}

function downloadRanking() {
  const b = getBasic();
  const rivals = getRivals();
  const kw = encodeURIComponent(b.productName);
  const shopLabel = document.getElementById('shop-name').options[document.getElementById('shop-name').selectedIndex].text;
  const myProductUrl = b.productUrl || '';
  const base182 = 'https://yukaiya.cybozu.com/k/182/?';
  const kiboriUrls = [
    base182+'view=5534938&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5534939&order_0=asc&qs=1',
    base182+'view=5534965&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534953&order_1=asc&size=20',
    base182+'view=5534967&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534954&order_1=asc&size=20',
    base182+'view=5534969&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534955&order_1=desc&size=20',
    base182+'view=5534971&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534956&order_1=desc&size=20',
    base182+'view=5534973&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5534957&order_0=asc&qs=1',
    base182+'view=5534975&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534958&order_1=desc&size=20',
    base182+'view=5534977&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534959&order_1=asc&size=20',
    base182+'view=5534979&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534960&order_1=asc&size=20',
    base182+'view=5534981&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534961&order_1=desc&size=20',
    base182+'view=5534983&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534963&order_1=desc&size=20',
    base182+'view=5534985&q=f5532012%20like%20%22'+kw+'%22#sort_0=f5532012&order_0=asc&sort_1=f5534962&order_1=asc&size=20',
  ];
  const base189 = 'https://yukaiya.cybozu.com/k/189/?';
  const kisoUrls = [
    base189+'view=5533525&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533561&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533559&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533557&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533555&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533553&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533575&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533573&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533571&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533569&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533567&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
    base189+'view=5533577&q=f5532880%20like%20%22'+kw+'%22#sort_0=f5532877&order_0=asc&size=20',
  ];
  const header = ['No','åé¡','ååå','ã·ã§ããå','ååURL','Weeklyã©ã³ã¯','01æåçµãè¾¼ã¿','02æåçµãè¾¼ã¿','03æåçµãè¾¼ã¿','04æåçµãè¾¼ã¿','05æåçµãè¾¼ã¿','06æåçµãè¾¼ã¿','07æåçµãè¾¼ã¿','08æåçµãè¾¼ã¿','09æåçµãè¾¼ã¿','10æåçµãè¾¼ã¿','11æåçµãè¾¼ã¿','12æåçµãè¾¼ã¿','01æå-åºç¤æå ±','02æå-åºç¤æå ±','03æå-åºç¤æå ±','04æå-åºç¤æå ±','05æå-åºç¤æå ±','06æå-åºç¤æå ±','07æå-åºç¤æå ±','08æå-åºç¤æå ±','09æå-åºç¤æå ±','10æå-åºç¤æå ±','11æå-åºç¤æå ±','12æå-åºç¤æå ±'];
  const rows = [header];
  if (myProductUrl) {
    rows.push(['', shopLabel, b.productName, shopLabel, myProductUrl, b.weeklyRank, ...kiboriUrls, ...kisoUrls]);
  }
  rivals.forEach(r => {
    rows.push(['', shopLabel, b.productName, r.shop, r.url, b.weeklyRank, ...kiboriUrls, ...Array(12).fill('')]);
  });
  downloadCSV('ããã¼ã¿åæãä¸¡ã·ã§ãã-ã©ã³ã­ã³ã°', rows);
}

function addSetRow(group) {
  const container = document.getElementById('set-rows-' + group);
  const row = document.createElement('div');
  row.className = 'set-row';
  row.innerHTML = '<input type="text" placeholder="ä¾: ä¸é¨"><input type="text" placeholder="ä¾: ABC-001">';
  container.appendChild(row);
}
function clearSet() {
  [1,2,3].forEach(g => {
    document.getElementById('set-rows-' + g).innerHTML = '';
    for(let i=0;i<10;i++) addSetRow(g);
  });
}
function downloadSet() {
  const groups = [1,2,3].map(g =>
    Array.from(document.getElementById('set-rows-'+g).querySelectorAll('.set-row')).map(r => {
      const inputs = r.querySelectorAll('input');
      return [inputs[0].value, inputs[1].value];
    })
  );
  const maxLen = Math.max(...groups.map(g => g.length));
  const header = ['å¯¾å¿é¨å1','ååã³ã¼ã1','å¯¾å¿é¨å2','ååã³ã¼ã2','å¯¾å¿é¨å3','ååã³ã¼ã3'];
  const rows = [header];
  for(let i=0;i<maxLen;i++) {
    const row = [];
    groups.forEach(g => { row.push(g[i]?g[i][0]:'', g[i]?g[i][1]:''); });
    if(row.some(v=>v)) rows.push(row);
  }
  downloadCSV('ã»ããååã³ã¼ã', rows);
}
// åæåï¼åã°ã«ã¼ãã«10è¡è¿½å 
document.addEventListener('DOMContentLoaded', function() {
  [1,2,3].forEach(g => { for(let i=0;i<10;i++) addSetRow(g); });
});

// ã¨ã¯ã»ã«ããã®Ctrl+Vãã¼ã¹ãå¯¾å¿
document.addEventListener('paste', function(e) {
  // set-codeããã«ãã¢ã¯ãã£ããªã¨ãã®ã¿
  const panel = document.getElementById('panel-set-code');
  if (!panel || !panel.classList.contains('active')) return;

  const text = (e.clipboardData || window.clipboardData).getData('text');
  if (!text) return;

  // ã©ã®ã°ã«ã¼ãã®ã»ã«ã«ãã©ã¼ã«ã¹ããããæ¤åº
  const focused = document.activeElement;
  let targetGroup = 1;
  if (focused && focused.closest('.set-block')) {
    const block = focused.closest('.set-block');
    const blocks = Array.from(document.querySelectorAll('.set-block'));
    targetGroup = blocks.indexOf(block) + 1;
    if (targetGroup < 1) targetGroup = 1;
  }

  // ãã©ã¼ã«ã¹ã»ã«ã®è¡ã¤ã³ããã¯ã¹
  let startRow = 0;
  let startCol = 0;
  if (focused && focused.closest('.set-row')) {
    const row = focused.closest('.set-row');
    const container = document.getElementById('set-rows-' + targetGroup);
    const rows = Array.from(container.querySelectorAll('.set-row'));
    startRow = rows.indexOf(row);
    startCol = Array.from(row.querySelectorAll('input')).indexOf(focused);
    if (startRow < 0) startRow = 0;
    if (startCol < 0) startCol = 0;
  }

  // ã¿ãã»æ¹è¡ã§ãã¼ã¹
  const rows = text.split(/\r?\n/).filter(r => r !== '');
  const container = document.getElementById('set-rows-' + targetGroup);
  let existingRows = Array.from(container.querySelectorAll('.set-row'));

  rows.forEach((rowText, ri) => {
    const cols = rowText.split('\t');
    const rowIdx = startRow + ri;
    // è¡ãè¶³ããªããã°è¿½å 
    while (existingRows.length <= rowIdx) {
      addSetRow(targetGroup);
      existingRows = Array.from(container.querySelectorAll('.set-row'));
    }
    const inputs = existingRows[rowIdx].querySelectorAll('input');
    cols.forEach((val, ci) => {
      const colIdx = startCol + ci;
      if (inputs[colIdx]) inputs[colIdx].value = val;
    });
  });

  e.preventDefault();
});

const kanriFiles = {};
function handleDrop(event, group) {
  event.preventDefault();
  var groupMap = { uriage: 'sales', shohin: 'item', kw: 'keyword', coupon: 'coupon' };
  var key = groupMap[group];
  var file = event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0];
  if (!file || !key) return;
  _kanriFiles[key] = file;
  var filesEl = document.getElementById('files-' + group);
  if (filesEl) {
    filesEl.innerHTML = '';
    var span = document.createElement('span');
    span.style.cssText = 'color:#16a34a;font-size:.8rem;padding:.25rem 0;display:block;';
    span.textContent = 'â ' + file.name;
    filesEl.appendChild(span);
  }
  var zone = event.target.closest ? event.target.closest('.kanri-drop') : null;
  if (zone) zone.classList.remove('dragover');
}

// kanri helpers
var _kanriFiles = { sales: null, item: null, keyword: null, coupon: null };

function _readFileAsText(file, enc) {
  return new Promise(function(res, rej) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var bytes = new Uint8Array(e.target.result);
        var encoding = enc || 'Shift-JIS';
        var decoder = new TextDecoder(encoding, {fatal: false});
        res(decoder.decode(bytes));
      } catch(err) { rej(err); }
    };
    reader.onerror = rej;
    reader.readAsArrayBuffer(file);
  });
}
function _parseCSV(text) {
  var rows = [];
  var lines = text.split(new RegExp('[\r]?[\n]'));
  for (var li = 0; li < lines.length; li++) {
    var line = lines[li];
    var row = [], cur = '', inQ = false;
    for (var i = 0; i < line.length; i++) {
      var c = line[i];
      if (c === '"') {
        if (inQ && line[i+1] === '"') { cur += '"'; i++; }
        else inQ = !inQ;
      } else if (c === ',' && !inQ) {
        row.push(cur.trim()); cur = '';
      } else cur += c;
    }
    row.push(cur.trim());
    rows.push(row);
  }
  return rows;
}

function _csvToObjects(rows, headerRow) {
  var h = rows[headerRow] || [];
  var result = [];
  for (var i = headerRow + 1; i < rows.length; i++) {
    var r = rows[i];
    if (!r || r.every(function(c){return c === '';})) continue;
    var o = {};
    for (var j = 0; j < h.length; j++) { o[h[j]] = r[j] || ''; }
    result.push(o);
  }
  return result;
}

function _parseNum(v) {
  if (v === '' || v === null || v === undefined) return 0;
  return parseFloat(String(v).replace(/,/g,'')) || 0;
}

function _calcAvgCpc(cost, click) {
  if (!_parseNum(click)) return '';
  var v = Math.round(_parseNum(cost) / _parseNum(click) * 100) / 100;
  return v === 0 ? '0.0' : (Number.isInteger(v) ? v.toFixed(1) : v);
}

function _calcCvr(units, click) {
  if (!_parseNum(click)) return '';
  var v = Math.round(_parseNum(units) / _parseNum(click) * 10000) / 100;
  return v === 0 ? '0.0' : (Number.isInteger(v) ? v.toFixed(1) : v);
}

function _calcRoas(sales, cost) {
  if (!_parseNum(cost)) return '';
  var v = Math.round(_parseNum(sales) / _parseNum(cost) * 10000) / 100;
  // æ´æ°ã®å ´åãå°æ°ç¹1æ¡ã§è¡¨ç¤ºï¼ä¾ï¼445â445.0ï¼
  return v === 0 ? '0.0' : (Number.isInteger(v) ? v.toFixed(1) : v);
}

function _kanriLog(msg, color) {
  var log = document.getElementById('kanri-log');
  if (!log) return;
  log.style.display = 'block';
  var span = document.createElement('span');
  span.style.color = color || '#d4d4d4';
  span.textContent = msg + '\n';
  log.appendChild(span);
  log.scrollTop = log.scrollHeight;
}

function kanriClear() {
  _kanriFiles.sales = null;
  _kanriFiles.item = null;
  _kanriFiles.keyword = null;
  _kanriFiles.coupon = null;
  document.querySelectorAll('.kanri-drop-files').forEach(function(el) { el.innerHTML = ''; });
  var log = document.getElementById('kanri-log');
  if (log) { log.style.display = 'none'; log.innerHTML = ''; }
}

async function kanriRun() {
  var log = document.getElementById('kanri-log');
  if (log) { log.style.display = 'block'; log.innerHTML = ''; }
  var missing = [];
  if (!_kanriFiles.sales)   missing.push('ãææ¬¡ãå£²ä¸ï¼Item_SalesListï¼');
  if (!_kanriFiles.item)    missing.push('ãææ¬¡ãååå¥ã¬ãã¼ã');
  if (!_kanriFiles.keyword) missing.push('ãææ¬¡ãKWå¥ã¬ãã¼ã');
  if (!_kanriFiles.coupon)  missing.push('ãææ¬¡ãã¯ã¼ãã³ã¢ããã³ã¹åºåã¬ãã¼ã');
  if (missing.length) {
    _kanriLog('ãã¨ã©ã¼ãä»¥ä¸ã®ãã¡ã¤ã«ãã»ããããã¦ãã¾ããï¼', '#f87171');
    missing.forEach(function(m) { _kanriLog('  - ' + m, '#f87171'); });
    return;
  }
  _kanriLog('å¦çãéå§ãã¾ã...', '#60a5fa');
  try {
    // ZIPãã¡ã¤ã«ã®å ´åã¯è§£åãã¦CSVãåãåºã
    async function readCsvFromFile(file, enc) {
      var name = file.name.toLowerCase();
      if (name.endsWith('.zip')) {
        // JSZipã§è§£å
        if (typeof JSZip === 'undefined') throw new Error('JSZipãèª­ã¿è¾¼ã¾ãã¦ãã¾ãã');
        var zip = await JSZip.loadAsync(file);
        var csvFile = null;
        zip.forEach(function(path, f) {
          if (!f.dir && path.toLowerCase().endsWith('.csv') && !csvFile) csvFile = f;
        });
        if (!csvFile) throw new Error('ZIPåã«CSVãã¡ã¤ã«ãè¦ã¤ããã¾ãã');
        var buf = await csvFile.async('arraybuffer');
        var decoder = new TextDecoder(enc || 'Shift-JIS', {fatal:false});
        return decoder.decode(new Uint8Array(buf));
      }
      return _readFileAsText(file, enc);
    }
    var kwText    = await readCsvFromFile(_kanriFiles.keyword, 'Shift-JIS');
    var itemText  = await readCsvFromFile(_kanriFiles.item,    'Shift-JIS');
    var salesText = await readCsvFromFile(_kanriFiles.sales,   'UTF-8');
    var cpnText   = await readCsvFromFile(_kanriFiles.coupon,  'UTF-8');
    var yyyy='', mm='';
    var _sn = _kanriFiles.sales ? _kanriFiles.sales.name : '';
    var _sm = _sn.match(new RegExp('(20[0-9][0-9])([01][0-9])'));
    if (_sm) { yyyy=_sm[1]; mm=_sm[2]; }
    if (!yyyy) {
      var _kwl = kwText.split(new RegExp('[\r]?[\n]'));
      for (var _i=7; _i<Math.min(20,_kwl.length); _i++) {
        var _rm = _kwl[_i].match(new RegExp('(20[0-9][0-9])\\u5e74([01][0-9])\\u6708'));
        if (_rm) { yyyy=_rm[1]; mm=_rm[2]; break; }
      }
    }
    _kanriLog('å¯¾è±¡å¹´æ: '+yyyy+'-'+mm, '#a3e635');
    var kwRows=_parseCSV(kwText), itemRows=_parseCSV(itemText);
    var kwHdr=6, itHdr=6;
    var kwData=_csvToObjects(kwRows,kwHdr), itemData=_csvToObjects(itemRows,itHdr);
    var salesRows=_parseCSV(salesText), salesHeaderRow=6;
    for (var i=0; i<Math.min(15,salesRows.length); i++) {
      if (salesRows[i].some(function(c){return c==='ååç®¡ççªå·';})) { salesHeaderRow=i; break; }
    }
    var salesData=_csvToObjects(salesRows,salesHeaderRow);
    var cpnRows=_parseCSV(cpnText), cpnData=_csvToObjects(cpnRows,0);
    var salesMap={};
    salesData.forEach(function(r){var no=String(r['ååç®¡ççªå·']||'').trim(),s=_parseNum(r['å£²ä¸']||0);if(no)salesMap[no]=(salesMap[no]||0)+s;});
    var couponMap={};
    cpnData.forEach(function(r){var no=String(r['ååç®¡ççªå·']||'').trim(),cost=_parseNum(r['å®ç¸¾é¡']||0),sale=_parseNum(r['å£²ä¸éé¡']||0);if(no){if(!couponMap[no])couponMap[no]={cost:0,sales:0};couponMap[no].cost+=cost;couponMap[no].sales+=sale;}});
    var seenNos=new Set(),mgmtNos=[];
    kwData.concat(itemData).forEach(function(r){
      var no=String(r['ååç®¡ççªå·']||'').trim();
      if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}
    });
    salesData.forEach(function(r){
      var no=String(r['ååç®¡ççªå·']||'').trim();
      if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}
    });
    mgmtNos.sort(function(a,b){var na=Number(a),nb=Number(b);if(!isNaN(na)&&!isNaN(nb))return na-nb;return a<b?-1:a>b?1:0;});
    _kanriLog('ååç®¡ççªå·æ°: '+mgmtNos.length, '#a3e635');
    var hN=['ã¬ã³ã¼ãã®éå§è¡','ååç®¡ççªå·',mm+'-æ¥½å¤©å£²ä¸',mm+'-åºåå£²ä¸',mm+'-å®ç¸¾é¡',mm+'-CVR',mm+'-ROAS',mm+'-ç²å¾åä¾¡',mm+'-CPCå®ç¸¾',
      'åå¾æ¥'+mm+'æâ','æ¥½å¤©å£²ä¸'+mm+'æâ','ã­ã¼ã¯ã¼ã'+mm+'æâ','KWvol'+mm+'æâ','KWã·ã§ã¢'+mm+'æâ','CTR'+mm+'æâ','CLæ°'+mm+'æâ','å®ç¸¾é¡'+mm+'æâ','å£²ä¸éé¡'+mm+'æâ','å£²ä¸ä»¶æ°'+mm+'æâ','å¹³åCLåä¾¡'+mm+'æâ','ç®å®'+mm+'æâ','CVR'+mm+'æâ','ROAS'+mm+'æâ',
      'åå¾æ¥'+mm+'æâ','æ¥½å¤©å£²ä¸'+mm+'æâ','ã­ã¼ã¯ã¼ã'+mm+'æâ','KWvol'+mm+'æâ','KWã·ã§ã¢'+mm+'æâ','CTR'+mm+'æâ','CLæ°'+mm+'æâ','å®ç¸¾é¡'+mm+'æâ','å£²ä¸éé¡'+mm+'æâ','å£²ä¸ä»¶æ°'+mm+'æâ','å¹³åCLåä¾¡'+mm+'æâ','ç®å®'+mm+'æâ','CVR'+mm+'æâ','ROAS'+mm+'æâ'];
    var HI={};hN.forEach(function(h,i){HI[h]=i;});
    var outRows=[hN];
    function newRow(){return new Array(hN.length).fill('');}
    function si(r,k,v){if(HI[k]!==undefined&&v!==undefined&&v!==null&&v!=='')r[HI[k]]=v;}
    function setF(r,bl,kw,ex){
      ex=ex||{};var p=bl==='â'?'æâ':'æâ';
      si(r,'åå¾æ¥'+mm+p,ex.date);si(r,'æ¥½å¤©å£²ä¸'+mm+p,ex.rakuten);
      if(HI['ã­ã¼ã¯ã¼ã'+mm+p]!==undefined)r[HI['ã­ã¼ã¯ã¼ã'+mm+p]]=kw;
      si(r,'KWvol'+mm+p,ex.kwvol);si(r,'KWã·ã§ã¢'+mm+p,ex.share);si(r,'CTR'+mm+p,ex.ctr);
      si(r,'CLæ°'+mm+p,ex.click);si(r,'å®ç¸¾é¡'+mm+p,ex.cost);si(r,'å£²ä¸éé¡'+mm+p,ex.sales);
      si(r,'å£²ä¸ä»¶æ°'+mm+p,ex.units);si(r,'å¹³åCLåä¾¡'+mm+p,ex.avg_cpc);si(r,'ç®å®'+mm+p,ex.target_cpc);
      si(r,'CVR'+mm+p,ex.cvr);si(r,'ROAS'+mm+p,ex.roas);
    }
    mgmtNos.forEach(function(no){
      var kwI=kwData.filter(function(r){return String(r['ååç®¡ççªå·']||'').trim()===no;});
      var itI=itemData.filter(function(r){return String(r['ååç®¡ççªå·']||'').trim()===no;});
      var rak=salesMap[no]||'', cpn=couponMap[no]||null;
      var iCl=itI.reduce(function(s,r){return s+_parseNum(r['ã¯ãªãã¯æ°(åè¨)']||0);},0);
      var iCo=itI.reduce(function(s,r){return s+_parseNum(r['å®ç¸¾é¡(åè¨)']||0);},0);
      var iSa=itI.reduce(function(s,r){return s+_parseNum(r['å£²ä¸éé¡(åè¨720æé)']||0);},0);
      var iUn=itI.reduce(function(s,r){return s+_parseNum(r['å£²ä¸ä»¶æ°(åè¨720æé)']||0);},0);
      var sr=newRow();sr[0]='*';sr[1]=no;
      if(rak!=='')sr[HI[mm+'-æ¥½å¤©å£²ä¸']]=rak;
      if(iSa)sr[HI[mm+'-åºåå£²ä¸']]=iSa;if(iCo)sr[HI[mm+'-å®ç¸¾é¡']]=iCo;
      var cv=_calcCvr(iUn,iCl);if(cv)sr[HI[mm+'-CVR']]=cv;
      var ro=_calcRoas(iSa,iCo);if(ro)sr[HI[mm+'-ROAS']]=ro;
      // ç²å¾åä¾¡ = æ³¨æç²å¾åä¾¡(åè¨720æé) ãitem CSVããåå¾
      if(itI[0]){
        var cpc=_parseNum(itI[0]['CPCå®ç¸¾(åè¨)']||0);if(cpc)sr[HI[mm+'-CPCå®ç¸¾']]=cpc;
        var ac=_parseNum(itI[0]['æ³¨æç²å¾åä¾¡(åè¨720æé)']||0);if(ac)sr[HI[mm+'-ç²å¾åä¾¡']]=ac;
      }
      outRows.push(sr);
      var kCl=kwI.reduce(function(s,r){return s+_parseNum(r['ã¯ãªãã¯æ°(åè¨)']||0);},0);
      var kCo=kwI.reduce(function(s,r){return s+_parseNum(r['å®ç¸¾é¡(åè¨)']||0);},0);
      var kSa=kwI.reduce(function(s,r){return s+_parseNum(r['å£²ä¸éé¡(åè¨720æé)']||0);},0);
      var kUn=kwI.reduce(function(s,r){return s+_parseNum(r['å£²ä¸ä»¶æ°(åè¨720æé)']||0);},0);
      var dCl=iCl-kCl,dCo=iCo-kCo,dSa=iSa-kSa,dUn=iUn-kUn;
      var ds=yyyy+'/'+mm+'-â ';
      var seoSa=rak!==''?(_parseNum(rak)-iSa-(cpn?_parseNum(cpn.sales):0)):'';
      var sRHoshi=newRow();
      si(sRHoshi,'åå¾æ¥'+mm+'æâ',ds);
      si(sRHoshi,'æ¥½å¤©å£²ä¸'+mm+'æâ',rak);
      if(HI['ã­ã¼ã¯ã¼ã'+mm+'æâ']!==undefined)sRHoshi[HI['ã­ã¼ã¯ã¼ã'+mm+'æâ']]='SEOå-â¡';
      if(seoSa!=='')si(sRHoshi,'å£²ä¸éé¡'+mm+'æâ',seoSa);
      var sRStar=newRow();
      si(sRStar,'åå¾æ¥'+mm+'æâ',ds);
      si(sRStar,'æ¥½å¤©å£²ä¸'+mm+'æâ',rak);
      if(HI['ã­ã¼ã¯ã¼ã'+mm+'æâ']!==undefined)sRStar[HI['ã­ã¼ã¯ã¼ã'+mm+'æâ']]='SEOå-â¡';
      if(seoSa!=='')si(sRStar,'å£²ä¸éé¡'+mm+'æâ',seoSa);
      outRows.push(sRHoshi);
      var sh=kwI.slice().sort(function(a,b){return _parseNum(b['å£²ä¸éé¡(åè¨720æé)']||0)-_parseNum(a['å£²ä¸éé¡(åè¨720æé)']||0);});
      var co=kwI.slice().sort(function(a,b){return _parseNum(b['å®ç¸¾é¡(åè¨)']||0)-_parseNum(a['å®ç¸¾é¡(åè¨)']||0);});
      function eb(bl,so){
        // ââãã­ãã¯ã®åºåãç·
        var x=newRow(); setF(x,bl,'------------------------------'); outRows.push(x);
        // kw/itemãªãååï¼salesã®ã¿ï¼
        if(so.length===0 && iCl===0 && iCo===0){
          var na=newRow(); setF(na,bl,'åºååºç¨¿ãªã'); outRows.push(na);
        } else {
          // åºååè¨-â¢
          var y=newRow(); setF(y,bl,'åºååè¨-â¢',{click:iCl||'',cost:iCo||'',sales:iSa||'',units:iUn||'',avg_cpc:_calcAvgCpc(iCo,iCl),cvr:_calcCvr(iUn,iCl),roas:_calcRoas(iSa,iCo)}); outRows.push(y);
          // ååCPC-â£ï¼itemããæã®ã¿ï¼
          if(itI.length){
            var z=newRow(); setF(z,bl,'ååCPC(20ååºç¨¿å)-â£',{click:dCl||'',cost:dCo||'',sales:dSa||'',units:dUn||'',avg_cpc:_calcAvgCpc(dCo,dCl),cvr:_calcCvr(dUn,dCl),roas:_calcRoas(dSa,dCo)}); outRows.push(z);
          }
          // KWåè¨-â£
          var w=newRow(); setF(w,bl,'KWåè¨(ä¸è¨KWã®åè¨)-â£',{click:kCl||'',cost:kCo||'',sales:kSa||'',units:kUn||'',avg_cpc:_calcAvgCpc(kCo,kCl),cvr:_calcCvr(kUn,kCl),roas:_calcRoas(kSa,kCo)}); outRows.push(w);
          // KWvolåè¨ãåã«è¨ç®ï¼KWã·ã§ã¢ç®åºã«å¿è¦ï¼
          var totalVol=0;
          so.forEach(function(kw){
            var cl=_parseNum(kw['ã¯ãªãã¯æ°(åè¨)']||0);
            var ctr=_parseNum(kw['CTR(%)']||0);
            totalVol += ctr>0 ? Math.floor(cl/ctr*100) : 0;
          });
          // KWè¡
          so.forEach(function(kw){
            var c1=_parseNum(kw['ã¯ãªãã¯æ°(åè¨)']||0);
            var c2=_parseNum(kw['å®ç¸¾é¡(åè¨)']||0);
            var s1=_parseNum(kw['å£²ä¸éé¡(åè¨720æé)']||0);
            var u1=_parseNum(kw['å£²ä¸ä»¶æ°(åè¨720æé)']||0);
            var ctr=_parseNum(kw['CTR(%)']||0);
            var kwvol = ctr>0 ? Math.floor(c1/ctr*100) : 0;
            var kwshare = totalVol>0 ? Math.round(kwvol/totalVol*10000)/100 : 0;
            var rk=newRow();
            setF(rk,bl,kw['ã­ã¼ã¯ã¼ã']||'',{
              kwvol:kwvol||'', share:kwshare||'',
              ctr:parseFloat(kw['CTR(%)'||''])||'', click:c1||'', cost:c2||'',
              sales:s1||'', units:u1||'',
              avg_cpc:_calcAvgCpc(c2,c1),
              target_cpc:kw['ç®å®CPC']||'',
              cvr:_calcCvr(u1,c1), roas:_calcRoas(s1,c2)
            });
            outRows.push(rk);
          });
        }
        // åºåãç·
        var x2=newRow(); setF(x2,bl,'------------------------------'); outRows.push(x2);
        // ã¯ã¼ãã³ã¢ããã³ã¹-â¤
        if(cpn){ var r5=newRow(); setF(r5,bl,'ã¯ã¼ãã³ã¢ããã³ã¹-â¤',{cost:cpn.cost||'',sales:cpn.sales||'',roas:_calcRoas(cpn.sales,cpn.cost)}); outRows.push(r5); }
      }
      eb('â',sh);      outRows.push(sRStar);
eb('â',co);
    });
    var csv='\uFEFF'+outRows.map(function(r){return r.map(function(v){var s=String(v==null?'':v);return(s.indexOf(',')>=0||s.indexOf('"')>=0||s.indexOf('\n')>=0)?'"'+s.split('"').join('""')+'"':s;}).join(',');}).join('\r\n');
    var b=new Blob([csv],{type:'text/csv;charset=utf-8;'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download='ãããå±åå¥-'+yyyy+'-'+mm+'.csv';a.click();URL.revokeObjectURL(u);
    _kanriLog('å®äº: ãããå±åå¥-'+yyyy+'-'+mm+'.csv','#4ade80');
    _kanriLog('  ååæ°:'+mgmtNos.length+' è¡æ°:'+outRows.length,'#a3e635');
  } catch(e) { _kanriLog('ãã¨ã©ã¼ã'+e.message,'#f87171'); console.error(e); }
}
