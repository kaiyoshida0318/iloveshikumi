let rivalCount = 4;
function switchTab(el) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  const panel = document.getElementById('panel-' + el.dataset.panel);
  if (panel) panel.classList.add('active');
  const tb = document.getElementById('rival-toolbar');
  if (tb) tb.style.display = el.dataset.panel === 'ranking-data' ? 'flex' : 'none';
}

function addRival() {
  rivalCount++;
  const grid = document.getElementById('data-grid');
  const card = document.createElement('div');
  card.className = 'card rival-card';
  card.id = 'rival-card-' + rivalCount;
  card.innerHTML = '<div class="card-header rival"><span>ライバル ' + rivalCount + '<\/span><button class="btn-remove" onclick="removeRival(' + rivalCount + ')">✕<\/button><\/div><table class="form-table"><tr><td class="label">ショップ名<\/td><td class="badge-tai-col"><\/td><td class="badge-ra-col"><span class="badge-ra">ラ<\/span><\/td><td><input type="text" class="rival-shop" placeholder="例: ライバルショップ"><\/td><\/tr><tr><td class="label">商品URL<\/td><td class="badge-tai-col"><\/td><td class="badge-ra-col"><span class="badge-ra">ラ<\/span><\/td><td><input type="url" class="rival-url" placeholder="https://..."><\/td><\/tr><\/table>';
  grid.appendChild(card);
}
function removeRival(id) {
  const card = document.getElementById('rival-card-' + id);
  if (card) card.remove();
  document.querySelectorAll('.rival-card').forEach((c, i) => {
    const n = i + 1;
    c.querySelector('.card-header span').textContent = 'ライバル ' + n;
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
  const header = ['\u5546\u54c1\u7ba1\u7406\u756a\u53f7','\u5546\u54c1\u756a\u53f7','\u25ce\u5546\u54c1\u540d\u25ce','\u30e9\u30f3\u30ad\u30f3\u30b0\u88dc\u8db3\u6570','K01-URL','K02-URL','K03-URL','K04-URL','K05-URL','K06-URL','K07-URL','K08-URL','K09-URL','K10-URL','K11-URL','K12-URL'];
  const row = [b.mgmtNo, b.productNo, b.productName, b.rankingSupplement, ...urls];
  downloadCSV('\u300c\u30c7\u30fc\u30bf\u5206\u6790\u300d\u4e21\u30b7\u30e7\u30c3\u30d7\u5bfe\u5fdc\u5168\u822c', [header, row]);
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
  const header = ['No','\u5206\u985e','\u5546\u54c1\u540d','\u30b7\u30e7\u30c3\u30d7\u540d','\u5546\u54c1URL','Weekly\u30e9\u30f3\u30af','01\u6708\u5206\u7d5e\u308a\u8fbc\u307f','02\u6708\u5206\u7d5e\u308a\u8fbc\u307f','03\u6708\u5206\u7d5e\u308a\u8fbc\u307f','04\u6708\u5206\u7d5e\u308a\u8fbc\u307f','05\u6708\u5206\u7d5e\u308a\u8fbc\u307f','06\u6708\u5206\u7d5e\u308a\u8fbc\u307f','07\u6708\u5206\u7d5e\u308a\u8fbc\u307f','08\u6708\u5206\u7d5e\u308a\u8fbc\u307f','09\u6708\u5206\u7d5e\u308a\u8fbc\u307f','10\u6708\u5206\u7d5e\u308a\u8fbc\u307f','11\u6708\u5206\u7d5e\u308a\u8fbc\u307f','12\u6708\u5206\u7d5e\u308a\u8fbc\u307f','01\u6708\u5206-\u57fa\u790e\u60c5\u5831','02\u6708\u5206-\u57fa\u790e\u60c5\u5831','03\u6708\u5206-\u57fa\u790e\u60c5\u5831','04\u6708\u5206-\u57fa\u790e\u60c5\u5831','05\u6708\u5206-\u57fa\u790e\u60c5\u5831','06\u6708\u5206-\u57fa\u790e\u60c5\u5831','07\u6708\u5206-\u57fa\u790e\u60c5\u5831','08\u6708\u5206-\u57fa\u790e\u60c5\u5831','09\u6708\u5206-\u57fa\u790e\u60c5\u5831','10\u6708\u5206-\u57fa\u790e\u60c5\u5831','11\u6708\u5206-\u57fa\u790e\u60c5\u5831','12\u6708\u5206-\u57fa\u790e\u60c5\u5831'];
  const rows = [header];
  if (myProductUrl) {
    rows.push(['', shopLabel, b.productName, shopLabel, myProductUrl, b.weeklyRank, ...kiboriUrls, ...kisoUrls]);
  }
  rivals.forEach(r => {
    rows.push(['', shopLabel, b.productName, r.shop, r.url, b.weeklyRank, ...kiboriUrls, ...Array(12).fill('')]);
  });
  downloadCSV('\u300c\u30c7\u30fc\u30bf\u5206\u6790\u300d\u4e21\u30b7\u30e7\u30c3\u30d7-\u30e9\u30f3\u30ad\u30f3\u30b0', rows);
}

// ===== セット商品コード =====
function addSetRow(group) {
  const container = document.getElementById('set-rows-' + group);
  const row = document.createElement('div');
  row.className = 'set-row';
  row.innerHTML = '<input type="text" placeholder="\u4f8b: \u4e0a\u90e8"><input type="text" placeholder="\u4f8b: ABC-001"><input type="text" placeholder="\u500b\u6570">';
  container.appendChild(row);
}
function clearSet() {
  [1,2,3].forEach(g => {
    document.getElementById('set-rows-' + g).innerHTML = '';
    for(let i=0;i<10;i++) addSetRow(g);
  });
}

function downloadSet() {
  // グループ1：商品コードが空の行はスキップ（対応部分も使わない）
  function getGroup1Rows(g) {
    return Array.from(document.getElementById('set-rows-' + g).querySelectorAll('.set-row'))
      .map(r => { const inputs = r.querySelectorAll('input'); return { part: inputs[0].value.trim(), code: inputs[1].value.trim(), qty: inputs[2].value.trim() || '1' }; })
      .filter(r => r.code !== '');
  }
  // グループ2・3：対応部分があれば全行取得（商品コードが空でもpartはset_codeに使う）
  function getGroupRows(g) {
    return Array.from(document.getElementById('set-rows-' + g).querySelectorAll('.set-row'))
      .map(r => { const inputs = r.querySelectorAll('input'); return { part: inputs[0].value.trim(), code: inputs[1].value.trim(), qty: inputs[2].value.trim() || '1' }; })
      .filter(r => r.part !== '');
  }

  const hontas = getGroup1Rows(1);
  const opts2  = getGroupRows(2);
  const opts3  = getGroupRows(3);

  if (hontas.length === 0) {
    alert('\u30b0\u30eb\u30fc\u30d71\uff08\u672c\u4f53\uff09\u306b\u5546\u54c1\u30b3\u30fc\u30c9\u3092\u5165\u529b\u3057\u3066\u304f\u3060\u3055\u3044');
    return;
  }

  const header = ['set_syohin_code','set_syohin_name','set_baika_tnk','syohin_code','suryo','daihyo_syohin_code'];
  const rows = [header];

  const combos2 = opts2.length > 0 ? opts2 : [{ part: '', code: '', qty: '1' }];
  const combos3 = opts3.length > 0 ? opts3 : [{ part: '', code: '', qty: '1' }];

  hontas.forEach(honta => {
    combos2.forEach(opt2 => {
      combos3.forEach(opt3 => {
        // set_syohin_code = 全partを結合（codeが空でもpartは使う）
        const setCode = honta.part + opt2.part + opt3.part;

        // 商品コードが空の行はスキップしつつ個数を合算
        const qtyMap = {};
        const order = [];
        [honta, opt2, opt3].forEach(item => {
          if (!item.code) return;
          const qty = parseInt(item.qty, 10) || 1;
          if (qtyMap[item.code] === undefined) { qtyMap[item.code] = 0; order.push(item.code); }
          qtyMap[item.code] += qty;
        });

        order.forEach(code => {
          rows.push([setCode, setCode, '1000', code, String(qtyMap[code]), '']);
        });
      });
    });
  });

  downloadCSV('set_syohin_ikkatsu_', rows);
}

// 初期化：各グループに10行追加
document.addEventListener('DOMContentLoaded', function() {
  [1,2,3].forEach(g => { for(let i=0;i<10;i++) addSetRow(g); });
});

// エクセルからのCtrl+Vペースト対応
document.addEventListener('paste', function(e) {
  const panel = document.getElementById('panel-set-code');
  if (!panel || !panel.classList.contains('active')) return;
  const text = (e.clipboardData || window.clipboardData).getData('text');
  if (!text) return;
  const focused = document.activeElement;
  let targetGroup = 1;
  if (focused && focused.closest('.set-block')) {
    const block = focused.closest('.set-block');
    const blocks = Array.from(document.querySelectorAll('.set-block'));
    targetGroup = blocks.indexOf(block) + 1;
    if (targetGroup < 1) targetGroup = 1;
  }
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
  const rows = text.split(/\r?\n/).filter(r => r !== '');
  const container = document.getElementById('set-rows-' + targetGroup);
  let existingRows = Array.from(container.querySelectorAll('.set-row'));
  rows.forEach((rowText, ri) => {
    const cols = rowText.split('\t');
    const rowIdx = startRow + ri;
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
    span.textContent = '\u2705 ' + file.name;
    filesEl.appendChild(span);
  }
  var zone = event.target.closest ? event.target.closest('.kanri-drop') : null;
  if (zone) zone.classList.remove('dragover');
}
function handleDropAll(event) {
  event.preventDefault();
  event.target.closest('.kanri-drop-single').classList.remove('dragover');
  var files = event.dataTransfer && event.dataTransfer.files;
  if (!files || !files.length) return;
  var groupMap = {
    sales: ['Item_SalesList', '\u58f2\u4e0a', 'SalesList'],
    item: ['item_report', '\u5546\u54c1\u5225', 'RPP_item', 'item-report'],
    keyword: ['keyword_report', 'KW\u5225', 'RPP_kw', 'kw-report', 'keyword-report'],
    coupon: ['\u30af\u30fc\u30dd\u30f3', 'coupon', 'cpnadv']
  };
  var filesEl = document.getElementById('files-all');
  if (filesEl) filesEl.innerHTML = '';
  for (var fi = 0; fi < files.length; fi++) {
    var file = files[fi];
    var name = file.name;
    var matched = null;
    for (var key in groupMap) {
      var keywords = groupMap[key];
      for (var ki = 0; ki < keywords.length; ki++) {
        if (name.toLowerCase().indexOf(keywords[ki].toLowerCase()) >= 0) { matched = key; break; }
      }
      if (matched) break;
    }
    if (!matched) {
      var order = ['sales','item','keyword','coupon'];
      for (var oi = 0; oi < order.length; oi++) {
        if (!_kanriFiles[order[oi]]) { matched = order[oi]; break; }
      }
    }
    if (matched) {
      _kanriFiles[matched] = file;
      if (filesEl) {
        var span = document.createElement('span');
        span.style.cssText = 'color:#16a34a;font-size:.78rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:4px;padding:.15rem .5rem;';
        var labels = {sales:'\u58f2\u4e0a',item:'\u5546\u54c1\u5225',keyword:'KW\u5225',coupon:'\u30af\u30fc\u30dd\u30f3'};
        span.textContent = '\u2705 [' + labels[matched] + '] ' + name;
        filesEl.appendChild(span);
      }
    }
  }
}

var _kanriFiles = { sales: null, item: null, keyword: null, coupon: null };

function _readFileAsText(file, enc) {
  return new Promise(function(res, rej) {
    var reader = new FileReader();
    reader.onload = function(e) {
      try {
        var bytes = new Uint8Array(e.target.result);
        var decoder = new TextDecoder(enc || 'Shift-JIS', {fatal: false});
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
      } else if (c === ',' && !inQ) { row.push(cur.trim()); cur = ''; }
      else cur += c;
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
  var v = parseFloat((_parseNum(units) / _parseNum(click) * 100).toFixed(2));
  return v === 0 ? '0.0' : (Number.isInteger(v) ? v.toFixed(1) : v);
}
function _calcRoas(sales, cost) {
  if (!_parseNum(cost)) return '';
  var v = parseFloat((_parseNum(sales) / _parseNum(cost) * 100).toFixed(2));
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

async function kanriCheck() {
  var rKi = new RegExp('\u96c6\u8a08\u671f\u9593.*?(20\\d\\d)-([01]\\d)');
  var rNen = new RegExp('(20\\d\\d)\u5e74([01]\\d)\u6708');
  var keys = ['sales','item','keyword','coupon'];
  var result = document.getElementById('check-result');
  result.textContent = '\u30c1\u30a7\u30c3\u30af\u4e2d...';
  result.className = 'kanri-check-result';
  keys.forEach(function(k) {
    var card = document.getElementById('desc-' + k);
    var badge = document.getElementById('badge-' + k);
    if (card) card.classList.remove('card-ok','card-ng');
    if (badge) { badge.textContent = '\u2015'; badge.className = 'kanri-month-badge'; }
  });
  var months = {};
  async function readText(file, enc) {
    var name = file.name.toLowerCase();
    if (name.endsWith('.zip')) {
      var zip = await JSZip.loadAsync(file);
      var csvFile = null;
      zip.forEach(function(path, f) { if (!f.dir && path.toLowerCase().endsWith('.csv') && !csvFile) csvFile = f; });
      if (!csvFile) return '';
      var buf = await csvFile.async('arraybuffer');
      return new TextDecoder(enc || 'Shift-JIS', {fatal:false}).decode(new Uint8Array(buf));
    }
    return _readFileAsText(file, enc);
  }
  function findMonth(text) {
    var lines = text.replace(/\r/g, '').split('\n');
    for (var i = 0; i < Math.min(30, lines.length); i++) {
      var m1 = rKi.exec(lines[i]);
      if (m1) return m1[1] + '-' + m1[2];
      var m2 = rNen.exec(lines[i]);
      if (m2) return m2[1] + '-' + m2[2];
    }
    return null;
  }
  if (_kanriFiles.sales) {
    var ms = _kanriFiles.sales.name.match(/(20\d\d)([01]\d)/);
    months.sales = ms ? ms[1] + '-' + ms[2] : null;
  }
  if (_kanriFiles.item) { try { months.item = findMonth(await readText(_kanriFiles.item, 'Shift-JIS')); } catch(e) { months.item = null; } }
  if (_kanriFiles.keyword) { try { months.keyword = findMonth(await readText(_kanriFiles.keyword, 'Shift-JIS')); } catch(e) { months.keyword = null; } }
  if (_kanriFiles.coupon) { try { months.coupon = findMonth(await readText(_kanriFiles.coupon, 'UTF-8')); } catch(e) { months.coupon = null; } }
  keys.forEach(function(k) {
    var badge = document.getElementById('badge-' + k);
    if (!badge) return;
    if (!_kanriFiles[k]) { badge.textContent = '\u672a\u30bb\u30c3\u30c8'; badge.className = 'kanri-month-badge badge-unset'; }
    else if (months[k]) { badge.textContent = months[k].replace('-', '/') + '\u6708\u5206'; badge.className = 'kanri-month-badge badge-found'; }
    else { badge.textContent = '\u4e0d\u660e'; badge.className = 'kanri-month-badge badge-unknown'; }
  });
  var allSet = keys.every(function(k){ return !!_kanriFiles[k]; });
  var vals = keys.map(function(k){ return months[k]; }).filter(Boolean);
  var allSame = vals.length === 4 && vals.every(function(v){ return v === vals[0]; });
  if (!allSet) {
    result.textContent = '\u26a0\ufe0f \u672a\u30bb\u30c3\u30c8\u306e\u30d5\u30a1\u30a4\u30eb\u304c\u3042\u308a\u307e\u3059'; result.className = 'kanri-check-result ng';
    keys.forEach(function(k){ if (!_kanriFiles[k]) document.getElementById('desc-'+k).classList.add('card-ng'); });
  } else if (vals.length < 4) {
    result.textContent = '\u26a0\ufe0f \u4e00\u90e8\u30d5\u30a1\u30a4\u30eb\u304b\u3089\u6708\u304c\u53d6\u5f97\u3067\u304d\u307e\u305b\u3093'; result.className = 'kanri-check-result ng';
  } else if (allSame) {
    result.textContent = '\u2705 OK\uff08' + vals[0].replace('-', '/') + '\u6708\u5206\u3001\u5168\u30d5\u30a1\u30a4\u30eb\u4e00\u81f4\uff09'; result.className = 'kanri-check-result ok';
    keys.forEach(function(k){ document.getElementById('desc-'+k).classList.add('card-ok'); });
  } else {
    var freq = {}; vals.forEach(function(v){ freq[v]=(freq[v]||0)+1; });
    var modeVal = Object.keys(freq).sort(function(a,b){return freq[b]-freq[a];})[0];
    result.textContent = '\u274c NG\uff1a\u6708\u304c\u4e00\u81f4\u3057\u3066\u3044\u307e\u305b\u3093'; result.className = 'kanri-check-result ng';
    keys.forEach(function(k){ var card = document.getElementById('desc-'+k); if (!months[k] || months[k] !== modeVal) card.classList.add('card-ng'); else card.classList.add('card-ok'); });
  }
}

function kanriClear() {
  _kanriFiles.sales = null; _kanriFiles.item = null; _kanriFiles.keyword = null; _kanriFiles.coupon = null;
  document.querySelectorAll('.kanri-drop-files').forEach(function(el) { el.innerHTML = ''; });
  var filesAll = document.getElementById('files-all');
  if (filesAll) filesAll.innerHTML = '';
  var result = document.getElementById('check-result');
  if (result) { result.textContent = ''; result.className = 'kanri-check-result'; }
  ['sales','item','keyword','coupon'].forEach(function(k){
    var card = document.getElementById('desc-'+k);
    var badge = document.getElementById('badge-'+k);
    if (card) card.classList.remove('card-ok','card-ng');
    if (badge) { badge.textContent = '\u2015'; badge.className = 'kanri-month-badge'; }
  });
  var log = document.getElementById('kanri-log');
  if (log) { log.style.display = 'none'; log.innerHTML = ''; }
}

async function kanriRun() {
  var log = document.getElementById('kanri-log');
  if (log) { log.style.display = 'block'; log.innerHTML = ''; }
  var missing = [];
  if (!_kanriFiles.sales)   missing.push('\u300c\u6708\u6b21\u300d\u58f2\u4e0a\uff08Item_SalesList\uff09');
  if (!_kanriFiles.item)    missing.push('\u300c\u6708\u6b21\u300d\u5546\u54c1\u5225\u30ec\u30dd\u30fc\u30c8');
  if (!_kanriFiles.keyword) missing.push('\u300c\u6708\u6b21\u300dKW\u5225\u30ec\u30dd\u30fc\u30c8');
  if (!_kanriFiles.coupon)  missing.push('\u300c\u6708\u6b21\u300d\u30af\u30fc\u30dd\u30f3\u30a2\u30c9\u30d0\u30f3\u30b9\u5e83\u544a\u30ec\u30dd\u30fc\u30c8');
  if (missing.length) {
    _kanriLog('\u300c\u30a8\u30e9\u30fc\u300d\u4ee5\u4e0b\u306e\u30d5\u30a1\u30a4\u30eb\u304c\u30bb\u30c3\u30c8\u3055\u308c\u3066\u3044\u307e\u305b\u3093\uff1a', '#f87171');
    missing.forEach(function(m) { _kanriLog('  - ' + m, '#f87171'); });
    return;
  }
  _kanriLog('\u51e6\u7406\u3092\u958b\u59cb\u3057\u307e\u3059...', '#60a5fa');
  try {
    async function readCsvFromFile(file, enc) {
      var name = file.name.toLowerCase();
      if (name.endsWith('.zip')) {
        if (typeof JSZip === 'undefined') throw new Error('JSZip\u304c\u8aad\u307f\u8fbc\u307e\u308c\u3066\u3044\u307e\u305b\u3093');
        var zip = await JSZip.loadAsync(file);
        var csvFile = null;
        zip.forEach(function(path, f) { if (!f.dir && path.toLowerCase().endsWith('.csv') && !csvFile) csvFile = f; });
        if (!csvFile) throw new Error('ZIP\u5185\u306bCSV\u30d5\u30a1\u30a4\u30eb\u304c\u898b\u3064\u304b\u308a\u307e\u305b\u3093');
        var buf = await csvFile.async('arraybuffer');
        return new TextDecoder(enc || 'Shift-JIS', {fatal:false}).decode(new Uint8Array(buf));
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
    _kanriLog('\u5bfe\u8c61\u5e74\u6708: '+yyyy+'-'+mm, '#a3e635');
    var kwRows=_parseCSV(kwText), itemRows=_parseCSV(itemText);
    var kwData=_csvToObjects(kwRows,6), itemData=_csvToObjects(itemRows,6);
    var salesRows=_parseCSV(salesText), salesHeaderRow=6;
    for (var i=0; i<Math.min(15,salesRows.length); i++) {
      if (salesRows[i].some(function(c){return c==='\u5546\u54c1\u7ba1\u7406\u756a\u53f7';})) { salesHeaderRow=i; break; }
    }
    var salesData=_csvToObjects(salesRows,salesHeaderRow);
    var cpnRows=_parseCSV(cpnText), cpnData=_csvToObjects(cpnRows,0);
    var salesMap={};
    salesData.forEach(function(r){var no=String(r['\u5546\u54c1\u7ba1\u7406\u756a\u53f7']||'').trim(),s=_parseNum(r['\u58f2\u4e0a']||0);if(no)salesMap[no]=(salesMap[no]||0)+s;});
    var couponMap={};
    cpnData.forEach(function(r){var no=String(r['\u5546\u54c1\u7ba1\u7406\u756a\u53f7']||'').trim(),cost=_parseNum(r['\u5b9f\u7e3e\u984d']||0),sale=_parseNum(r['\u58f2\u4e0a\u91d1\u984d']||0);if(no){if(!couponMap[no])couponMap[no]={cost:0,sales:0};couponMap[no].cost+=cost;couponMap[no].sales+=sale;}});
    var seenNos=new Set(),mgmtNos=[];
    kwData.concat(itemData).forEach(function(r){var no=String(r['\u5546\u54c1\u7ba1\u7406\u756a\u53f7']||'').trim();if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}});
    salesData.forEach(function(r){var no=String(r['\u5546\u54c1\u7ba1\u7406\u756a\u53f7']||'').trim();if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}});
    mgmtNos.sort(function(a,b){var na=Number(a),nb=Number(b);if(!isNaN(na)&&!isNaN(nb))return na-nb;return a<b?-1:a>b?1:0;});
    _kanriLog('\u5546\u54c1\u7ba1\u7406\u756a\u53f7\u6570: '+mgmtNos.length, '#a3e635');
    var hN=['\u30ec\u30b3\u30fc\u30c9\u306e\u958b\u59cb\u884c','\u5546\u54c1\u7ba1\u7406\u756a\u53f7',mm+'-\u697d\u5929\u58f2\u4e0a',mm+'-\u5e83\u544a\u58f2\u4e0a',mm+'-\u5b9f\u7e3e\u984d',mm+'-CVR',mm+'-ROAS',mm+'-\u7372\u5f97\u5358\u4fa1',mm+'-CPC\u5b9f\u7e3e','\u53d6\u5f97\u65e5'+mm+'\u6708\u2606','\u697d\u5929\u58f2\u4e0a'+mm+'\u6708\u2606','\u30ad\u30fc\u30ef\u30fc\u30c9'+mm+'\u6708\u2606','KWvol'+mm+'\u6708\u2606','KW\u30b7\u30a7\u30a2'+mm+'\u6708\u2606','CTR'+mm+'\u6708\u2606','CL\u6570'+mm+'\u6708\u2606','\u5b9f\u7e3e\u984d'+mm+'\u6708\u2606','\u58f2\u4e0a\u91d1\u984d'+mm+'\u6708\u2606','\u58f2\u4e0a\u4ef6\u6570'+mm+'\u6708\u2606','\u5e73\u5747CL\u5358\u4fa1'+mm+'\u6708\u2606','\u76ee\u5b89'+mm+'\u6708\u2606','CVR'+mm+'\u6708\u2606','ROAS'+mm+'\u6708\u2606'];
    var HI={};hN.forEach(function(h,i){HI[h]=i;});
    var outRows=[hN];
    function newRow(){return new Array(hN.length).fill('');}
    function si(r,k,v){if(HI[k]!==undefined&&v!==undefined&&v!==null&&v!=='')r[HI[k]]=v;}
    function setF(r,bl,kw,ex){
      ex=ex||{};var p='\u6708\u2606';
      si(r,'\u53d6\u5f97\u65e5'+mm+p,ex.date);si(r,'\u697d\u5929\u58f2\u4e0a'+mm+p,ex.rakuten);
      if(HI['\u30ad\u30fc\u30ef\u30fc\u30c9'+mm+p]!==undefined)r[HI['\u30ad\u30fc\u30ef\u30fc\u30c9'+mm+p]]=kw;
      si(r,'KWvol'+mm+p,ex.kwvol);si(r,'KW\u30b7\u30a7\u30a2'+mm+p,ex.share);si(r,'CTR'+mm+p,ex.ctr);
      si(r,'CL\u6570'+mm+p,ex.click);si(r,'\u5b9f\u7e3e\u984d'+mm+p,ex.cost);si(r,'\u58f2\u4e0a\u91d1\u984d'+mm+p,ex.sales);
      si(r,'\u58f2\u4e0a\u4ef6\u6570'+mm+p,ex.units);si(r,'\u5e73\u5747CL\u5358\u4fa1'+mm+p,ex.avg_cpc);si(r,'\u76ee\u5b89'+mm+p,ex.target_cpc);
      si(r,'CVR'+mm+p,ex.cvr);si(r,'ROAS'+mm+p,ex.roas);
    }
    mgmtNos.forEach(function(no){
      var kwI=kwData.filter(function(r){return String(r['\u5546\u54c1\u7ba1\u7406\u756a\u53f7']||'').trim()===no;});
      var itI=itemData.filter(function(r){return String(r['\u5546\u54c1\u7ba1\u7406\u756a\u53f7']||'').trim()===no;});
      var rak=salesMap[no]||'', cpn=couponMap[no]||null;
      var iCl=itI.reduce(function(s,r){return s+_parseNum(r['\u30af\u30ea\u30c3\u30af\u6570(\u5408\u8a08)']||0);},0);
      var iCo=itI.reduce(function(s,r){return s+_parseNum(r['\u5b9f\u7e3e\u984d(\u5408\u8a08)']||0);},0);
      var iSa=itI.reduce(function(s,r){return s+_parseNum(r['\u58f2\u4e0a\u91d1\u984d(\u5408\u8a08720\u6642\u9593)']||0);},0);
      var iUn=itI.reduce(function(s,r){return s+_parseNum(r['\u58f2\u4e0a\u4ef6\u6570(\u5408\u8a08720\u6642\u9593)']||0);},0);
      var sr=newRow();sr[0]='*';sr[1]=no;
      if(rak!=='')sr[HI[mm+'-\u697d\u5929\u58f2\u4e0a']]=rak;
      if(iSa)sr[HI[mm+'-\u5e83\u544a\u58f2\u4e0a']]=iSa;if(iCo)sr[HI[mm+'-\u5b9f\u7e3e\u984d']]=iCo;
      var cv=_calcCvr(iUn,iCl);if(cv)sr[HI[mm+'-CVR']]=cv;
      var ro=_calcRoas(iSa,iCo);if(ro)sr[HI[mm+'-ROAS']]=ro;
      if(itI[0]){
        var cpc=_parseNum(itI[0]['CPC\u5b9f\u7e3e(\u5408\u8a08)']||0);if(cpc)sr[HI[mm+'-CPC\u5b9f\u7e3e']]=cpc;
        var ac=_parseNum(itI[0]['\u6ce8\u6587\u7372\u5f97\u5358\u4fa1(\u5408\u8a08720\u6642\u9593)']||0);if(ac)sr[HI[mm+'-\u7372\u5f97\u5358\u4fa1']]=ac;
      }
      outRows.push(sr);
      var kCl=kwI.reduce(function(s,r){return s+_parseNum(r['\u30af\u30ea\u30c3\u30af\u6570(\u5408\u8a08)']||0);},0);
      var kCo=kwI.reduce(function(s,r){return s+_parseNum(r['\u5b9f\u7e3e\u984d(\u5408\u8a08)']||0);},0);
      var kSa=kwI.reduce(function(s,r){return s+_parseNum(r['\u58f2\u4e0a\u91d1\u984d(\u5408\u8a08720\u6642\u9593)']||0);},0);
      var kUn=kwI.reduce(function(s,r){return s+_parseNum(r['\u58f2\u4e0a\u4ef6\u6570(\u5408\u8a08720\u6642\u9593)']||0);},0);
      var dCl=iCl-kCl,dCo=iCo-kCo,dSa=iSa-kSa,dUn=iUn-kUn;
      var ds=yyyy+'/'+mm+'-\u2460';
      var seoSa=rak!==''?(_parseNum(rak)-iSa-(cpn?_parseNum(cpn.sales):0)):'';
      var sRHoshi=newRow();
      si(sRHoshi,'\u53d6\u5f97\u65e5'+mm+'\u6708\u2606',ds);
      si(sRHoshi,'\u697d\u5929\u58f2\u4e0a'+mm+'\u6708\u2606',rak);
      if(HI['\u30ad\u30fc\u30ef\u30fc\u30c9'+mm+'\u6708\u2606']!==undefined)sRHoshi[HI['\u30ad\u30fc\u30ef\u30fc\u30c9'+mm+'\u6708\u2606']]='SEO\u5206-\u2461';
      if(seoSa!=='')si(sRHoshi,'\u58f2\u4e0a\u91d1\u984d'+mm+'\u6708\u2606',seoSa);
      outRows.push(sRHoshi);
      var sh=kwI.slice().sort(function(a,b){var ca=_parseNum(a['\u30af\u30ea\u30c3\u30af\u6570(\u5408\u8a08)']||0),cb=_parseNum(b['\u30af\u30ea\u30c3\u30af\u6570(\u5408\u8a08)']||0),ta=_parseNum(a['CTR(%)']||0),tb=_parseNum(b['CTR(%)']||0);var va=ta>0?Math.floor(ca/ta*100):0,vb=tb>0?Math.floor(cb/tb*100):0;return vb-va;});
      function eb(bl,so){
        var x=newRow();setF(x,bl,'------------------------------');outRows.push(x);
        if(so.length===0&&iCl===0&&iCo===0){
          var na=newRow();setF(na,bl,'\u5e83\u544a\u51fa\u8bf3\u306a\u3057');outRows.push(na);
        } else {
          var y=newRow();setF(y,bl,'\u5e83\u544a\u5408\u8a08-\u2463',{click:iCl||'',cost:iCo||'',sales:iSa||'',units:iUn||'',avg_cpc:_calcAvgCpc(iCo,iCl),cvr:_calcCvr(iUn,iCl),roas:_calcRoas(iSa,iCo)});outRows.push(y);
          if(itI.length){var z=newRow();setF(z,bl,'\u5546\u54c1CPC(20\u5186\u51fa\u8bf3\u5206)-\u2464',{click:dCl||'',cost:dCo||'',sales:dSa||'',units:dUn||'',avg_cpc:_calcAvgCpc(dCo,dCl),cvr:_calcCvr(dUn,dCl),roas:_calcRoas(dSa,dCo)});outRows.push(z);}
          var w=newRow();setF(w,bl,'KW\u5408\u8a08(\u4e0b\u8a18KW\u306e\u5408\u8a08)-\u2464',{click:kCl||'',cost:kCo||'',sales:kSa||'',units:kUn||'',avg_cpc:_calcAvgCpc(kCo,kCl),cvr:_calcCvr(kUn,kCl),roas:_calcRoas(kSa,kCo)});outRows.push(w);
          var totalVol=0;
          so.forEach(function(kw){var cl=_parseNum(kw['\u30af\u30ea\u30c3\u30af\u6570(\u5408\u8a08)']||0),ctr=_parseNum(kw['CTR(%)']||0);totalVol+=ctr>0?Math.floor(cl/ctr*100):0;});
          so.forEach(function(kw){
            var c1=_parseNum(kw['\u30af\u30ea\u30c3\u30af\u6570(\u5408\u8a08)']||0),c2=_parseNum(kw['\u5b9f\u7e3e\u984d(\u5408\u8a08)']||0),s1=_parseNum(kw['\u58f2\u4e0a\u91d1\u984d(\u5408\u8a08720\u6642\u9593)']||0),u1=_parseNum(kw['\u58f2\u4e0a\u4ef6\u6570(\u5408\u8a08720\u6642\u9593)']||0),ctr=_parseNum(kw['CTR(%)']||0);
            var kwvol=ctr>0?Math.floor(c1/ctr*100):0;
            var kwshare=totalVol>0?Math.round(kwvol/totalVol*10000)/100:0;kwshare=Number.isInteger(kwshare)?kwshare.toFixed(1):kwshare;
            var rk=newRow();
            setF(rk,bl,kw['\u30ad\u30fc\u30ef\u30fc\u30c9']||'',{kwvol:kwvol||'',share:kwshare||'',ctr:(function(){var v=parseFloat(kw['CTR(%)'||'']);return isNaN(v)||v===0?'':Number.isInteger(v)?v.toFixed(1):v;})(),click:c1||'',cost:c2||'',sales:s1||'',units:u1||'',avg_cpc:_calcAvgCpc(c2,c1),target_cpc:(kw['\u76ee\u5b89CPC']==='-'?'':kw['\u76ee\u5b89CPC']||''),cvr:_calcCvr(u1,c1),roas:_calcRoas(s1,c2)});
            outRows.push(rk);
          });
        }
        var x2=newRow();setF(x2,bl,'------------------------------');outRows.push(x2);
        if(cpn){var r5=newRow();setF(r5,bl,'\u30af\u30fc\u30dd\u30f3\u30a2\u30c9\u30d0\u30f3\u30b9-\u2465',{cost:cpn.cost||'',sales:cpn.sales||'',roas:_calcRoas(cpn.sales,cpn.cost)});outRows.push(r5);}
      }
      eb('\u2606',sh);
    });
    var csv='\uFEFF'+outRows.map(function(r){return r.map(function(v){var s=String(v==null?'':v);return(s.indexOf(',')>=0||s.indexOf('"')>=0||s.indexOf('\n')>=0)?'"'+s.split('"').join('""')+'"':s;}).join(',');}).join('\r\n');
    var b=new Blob([csv],{type:'text/csv;charset=utf-8;'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download='\u3086\u304b\u3044\u5c4b\u500b\u5225-'+yyyy+'-'+mm+'.csv';a.click();URL.revokeObjectURL(u);
    _kanriLog('\u5b8c\u4e86: \u3086\u304b\u3044\u5c4b\u500b\u5225-'+yyyy+'-'+mm+'.csv','#4ade80');
    _kanriLog('  \u5546\u54c1\u6570:'+mgmtNos.length+' \u884c\u6570:'+outRows.length,'#a3e635');
  } catch(e) { _kanriLog('\u300c\u30a8\u30e9\u30fc\u300d'+e.message,'#f87171'); console.error(e); }
}

// ===== セット商品コード 行選択＆コピー =====
(function() {
  var selectedRows = new Set();
  var lastClickedRow = null;

  document.addEventListener('click', function(e) {
    var row = e.target.closest && e.target.closest('.set-row');
    if (!row) { clearSelection(); return; }
    // inputフォーカス時は選択しない
    if (e.target.tagName === 'INPUT') return;

    var container = row.parentElement;
    var allRows = Array.from(container.querySelectorAll('.set-row'));

    if (e.shiftKey && lastClickedRow && lastClickedRow.parentElement === container) {
      // Shift+クリック：範囲選択
      var from = allRows.indexOf(lastClickedRow);
      var to   = allRows.indexOf(row);
      if (from > to) { var tmp = from; from = to; to = tmp; }
      clearSelection();
      for (var i = from; i <= to; i++) selectRow(allRows[i]);
    } else {
      // 通常クリック：単一選択
      clearSelection();
      selectRow(row);
      lastClickedRow = row;
    }
  });

  function selectRow(row) {
    selectedRows.add(row);
    row.classList.add('row-selected');
  }
  function clearSelection() {
    selectedRows.forEach(function(r) { r.classList.remove('row-selected'); });
    selectedRows.clear();
    lastClickedRow = null;
  }

  document.addEventListener('keydown', function(e) {
    if (!((e.ctrlKey || e.metaKey) && e.key === 'c')) return;
    if (selectedRows.size === 0) return;
    var panel = document.getElementById('panel-set-code');
    if (!panel || !panel.classList.contains('active')) return;

    // 選択行をDOM順にソートしてタブ区切りでコピー
    var allSetRows = Array.from(document.querySelectorAll('#panel-set-code .set-row'));
    var sorted = allSetRows.filter(function(r) { return selectedRows.has(r); });
    var text = sorted.map(function(r) {
      return Array.from(r.querySelectorAll('input')).map(function(inp) { return inp.value; }).join('\t');
    }).join('\n');

    navigator.clipboard.writeText(text).then(function() {
      // コピー完了フィードバック
      sorted.forEach(function(r) { r.classList.add('row-copied'); });
      setTimeout(function() { sorted.forEach(function(r) { r.classList.remove('row-copied'); }); }, 400);
    }).catch(function() {
      // fallback
      var ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    });

    e.preventDefault();
  });
})();
