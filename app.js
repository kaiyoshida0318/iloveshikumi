
let rivalCount = 4;
function switchTab(el) {
  // 全タブのactive解除（position:absoluteのものも含む）
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  // 全パネル非表示
  document.querySelectorAll('.tool-panel').forEach(p => p.classList.remove('active'));
  // クリックされたタブをactive
  el.classList.add('active');
  // 対応パネルを表示
  const panel = document.getElementById('panel-' + el.dataset.panel);
  if (panel) panel.classList.add('active');
  // rival-toolbarの表示切替
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
  const header = ['商品管理番号','商品番号','◎商品名◎','ランキング補足数','K01-URL','K02-URL','K03-URL','K04-URL','K05-URL','K06-URL','K07-URL','K08-URL','K09-URL','K10-URL','K11-URL','K12-URL'];
  const row = [b.mgmtNo, b.productNo, b.productName, b.rankingSupplement, ...urls];
  downloadCSV('【データ分析】両ショップ対応全般', [header, row]);
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
  const header = ['No','分類','商品名','ショップ名','商品URL','Weeklyランク','01月分絞り込み','02月分絞り込み','03月分絞り込み','04月分絞り込み','05月分絞り込み','06月分絞り込み','07月分絞り込み','08月分絞り込み','09月分絞り込み','10月分絞り込み','11月分絞り込み','12月分絞り込み','01月分-基礎情報','02月分-基礎情報','03月分-基礎情報','04月分-基礎情報','05月分-基礎情報','06月分-基礎情報','07月分-基礎情報','08月分-基礎情報','09月分-基礎情報','10月分-基礎情報','11月分-基礎情報','12月分-基礎情報'];
  const rows = [header];
  if (myProductUrl) {
    rows.push(['', shopLabel, b.productName, shopLabel, myProductUrl, b.weeklyRank, ...kiboriUrls, ...kisoUrls]);
  }
  rivals.forEach(r => {
    rows.push(['', shopLabel, b.productName, r.shop, r.url, b.weeklyRank, ...kiboriUrls, ...Array(12).fill('')]);
  });
  downloadCSV('【データ分析】両ショップ-ランキング', rows);
}

function addSetRow(group) {
  const container = document.getElementById('set-rows-' + group);
  const row = document.createElement('div');
  row.className = 'set-row';
  row.innerHTML = '<input type="text" placeholder="例: 上部"><input type="text" placeholder="例: ABC-001">';
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
  const header = ['対応部分1','商品コード1','対応部分2','商品コード2','対応部分3','商品コード3'];
  const rows = [header];
  for(let i=0;i<maxLen;i++) {
    const row = [];
    groups.forEach(g => { row.push(g[i]?g[i][0]:'', g[i]?g[i][1]:''); });
    if(row.some(v=>v)) rows.push(row);
  }
  downloadCSV('セット商品コード', rows);
}
// 初期化：各グループに10行追加
document.addEventListener('DOMContentLoaded', function() {
  [1,2,3].forEach(g => { for(let i=0;i<10;i++) addSetRow(g); });
});

// エクセルからのCtrl+Vペースト対応
document.addEventListener('paste', function(e) {
  // set-codeパネルがアクティブなときのみ
  const panel = document.getElementById('panel-set-code');
  if (!panel || !panel.classList.contains('active')) return;

  const text = (e.clipboardData || window.clipboardData).getData('text');
  if (!text) return;

  // どのグループのセルにフォーカスがあるか検出
  const focused = document.activeElement;
  let targetGroup = 1;
  if (focused && focused.closest('.set-block')) {
    const block = focused.closest('.set-block');
    const blocks = Array.from(document.querySelectorAll('.set-block'));
    targetGroup = blocks.indexOf(block) + 1;
    if (targetGroup < 1) targetGroup = 1;
  }

  // フォーカスセルの行インデックス
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

  // タブ・改行でパース
  const rows = text.split(/\r?\n/).filter(r => r !== '');
  const container = document.getElementById('set-rows-' + targetGroup);
  let existingRows = Array.from(container.querySelectorAll('.set-row'));

  rows.forEach((rowText, ri) => {
    const cols = rowText.split('\t');
    const rowIdx = startRow + ri;
    // 行が足りなければ追加
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
    span.textContent = '✅ ' + file.name;
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
  // ファイル名から自動判定
  var groupMap = {
    sales: ['Item_SalesList', '売上', 'SalesList'],
    item: ['item_report', '商品別', 'RPP_item', 'item-report'],
    keyword: ['keyword_report', 'KW別', 'RPP_kw', 'kw-report', 'keyword-report'],
    coupon: ['クーポン', 'coupon', 'cpnadv']
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
        if (name.toLowerCase().indexOf(keywords[ki].toLowerCase()) >= 0) {
          matched = key; break;
        }
      }
      if (matched) break;
    }
    // マッチしない場合は拡張子で順番に割り当て
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
        var labels = {sales:'売上',item:'商品別',keyword:'KW別',coupon:'クーポン'};
        span.textContent = '✅ [' + labels[matched] + '] ' + name;
        filesEl.appendChild(span);
      }
    }
  }
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
  var v = parseFloat((_parseNum(units) / _parseNum(click) * 100).toFixed(2));
  return v === 0 ? '0.0' : (Number.isInteger(v) ? v.toFixed(1) : v);
}

function _calcRoas(sales, cost) {
  if (!_parseNum(cost)) return '';
  var v = parseFloat((_parseNum(sales) / _parseNum(cost) * 100).toFixed(2));
  // 整数の場合も小数点1桁で表示（例：445→445.0）
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
  var keys = ['sales','item','keyword','coupon'];
  var result = document.getElementById('check-result');
  result.textContent = 'チェック中...';
  result.className = 'kanri-check-result';

  // 全カードをリセット
  keys.forEach(function(k) {
    var card = document.getElementById('desc-' + k);
    var badge = document.getElementById('badge-' + k);
    if (card) card.classList.remove('card-ok','card-ng');
    if (badge) { badge.textContent = '―'; badge.className = 'kanri-month-badge'; }
  });

  // 各ファイルから月を取得
  var months = {};

  // ① sales: ファイル名から年月抽出
  if (_kanriFiles.sales) {
    var m = _kanriFiles.sales.name.match(/(20\d\d)([01]\d)/);
    months.sales = m ? m[1] + '-' + m[2] : null;
  }

  // ②③ item/keyword: ZIPまたはCSVの中身から「2026年02月」形式を取得
  for (var ki = 0; ki < 2; ki++) {
    var kkey = ki === 0 ? 'item' : 'keyword';
    if (!_kanriFiles[kkey]) continue;
    try {
      var text = await readCsvFromFile(_kanriFiles[kkey], 'Shift-JIS');
      var lines = text.split(/\r?\n/);
      var found = null;
      for (var li = 0; li < Math.min(30, lines.length); li++) {
        var rm = lines[li].match(/(20\d\d)年([01]\d)月/);
        if (rm) { found = rm[1] + '-' + rm[2]; break; }
      }
      months[kkey] = found;
    } catch(e) { months[kkey] = null; }
  }

  // ④ coupon: UTF-8、ファイル名または内容から年月取得
  if (_kanriFiles.coupon) {
    // まずファイル名から試行
    var cm = _kanriFiles.coupon.name.match(/(20\d\d)([01]\d)/);
    if (cm) {
      months.coupon = cm[1] + '-' + cm[2];
    } else {
      try {
        var ctext = await readCsvFromFile(_kanriFiles.coupon, 'UTF-8');
        var clines = ctext.split(/\r?\n/);
        var cfound = null;
        for (var cl = 0; cl < Math.min(30, clines.length); cl++) {
          var crm = clines[cl].match(/(20\d\d)\/([01]\d)/);
          if (!crm) crm = clines[cl].match(/(20\d\d)([01]\d)/);
          if (crm) { cfound = crm[1] + '-' + crm[2]; break; }
        }
        months.coupon = cfound;
      } catch(e) { months.coupon = null; }
    }
  }

  // バッジを更新
  keys.forEach(function(k) {
    var badge = document.getElementById('badge-' + k);
    if (!badge) return;
    if (!_kanriFiles[k]) {
      badge.textContent = '未セット';
      badge.className = 'kanri-month-badge badge-unset';
    } else if (months[k]) {
      badge.textContent = months[k].replace('-','/') + '月分';
      badge.className = 'kanri-month-badge badge-found';
    } else {
      badge.textContent = '不明';
      badge.className = 'kanri-month-badge badge-unknown';
    }
  });

  // 全ファイルがセットされているか
  var allSet = keys.every(function(k){ return !!_kanriFiles[k]; });
  var allFound = keys.every(function(k){ return !!months[k]; });
  var vals = keys.map(function(k){ return months[k]; }).filter(Boolean);
  var allSame = vals.length === keys.length && vals.every(function(v){ return v === vals[0]; });

  if (!allSet) {
    result.textContent = '⚠️ 未セットのファイルがあります';
    result.className = 'kanri-check-result ng';
    keys.forEach(function(k){
      if (!_kanriFiles[k]) document.getElementById('desc-'+k).classList.add('card-ng');
    });
  } else if (!allFound) {
    result.textContent = '⚠️ 一部のファイルから月が取得できませんでした';
    result.className = 'kanri-check-result ng';
  } else if (allSame) {
    result.textContent = '✅ OK（' + vals[0].replace('-','/') + '月分、全ファイル一致）';
    result.className = 'kanri-check-result ok';
    keys.forEach(function(k){ document.getElementById('desc-'+k).classList.add('card-ok'); });
  } else {
    // 不一致：多数決の月を基準にズレを赤に
    var modeVal = vals.sort(function(a,b){
      return vals.filter(function(v){return v===b;}).length - vals.filter(function(v){return v===a;}).length;
    })[0];
    result.textContent = '❌ NG：月が一致していません';
    result.className = 'kanri-check-result ng';
    keys.forEach(function(k){
      var card = document.getElementById('desc-'+k);
      if (months[k] !== modeVal) card.classList.add('card-ng');
      else card.classList.add('card-ok');
    });
  }
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
  if (!_kanriFiles.sales)   missing.push('【月次】売上（Item_SalesList）');
  if (!_kanriFiles.item)    missing.push('【月次】商品別レポート');
  if (!_kanriFiles.keyword) missing.push('【月次】KW別レポート');
  if (!_kanriFiles.coupon)  missing.push('【月次】クーポンアドバンス広告レポート');
  if (missing.length) {
    _kanriLog('【エラー】以下のファイルがセットされていません：', '#f87171');
    missing.forEach(function(m) { _kanriLog('  - ' + m, '#f87171'); });
    return;
  }
  _kanriLog('処理を開始します...', '#60a5fa');
  try {
    // ZIPファイルの場合は解凍してCSVを取り出す
    async function readCsvFromFile(file, enc) {
      var name = file.name.toLowerCase();
      if (name.endsWith('.zip')) {
        // JSZipで解凍
        if (typeof JSZip === 'undefined') throw new Error('JSZipが読み込まれていません');
        var zip = await JSZip.loadAsync(file);
        var csvFile = null;
        zip.forEach(function(path, f) {
          if (!f.dir && path.toLowerCase().endsWith('.csv') && !csvFile) csvFile = f;
        });
        if (!csvFile) throw new Error('ZIP内にCSVファイルが見つかりません');
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
    _kanriLog('対象年月: '+yyyy+'-'+mm, '#a3e635');
    var kwRows=_parseCSV(kwText), itemRows=_parseCSV(itemText);
    var kwHdr=6, itHdr=6;
    var kwData=_csvToObjects(kwRows,kwHdr), itemData=_csvToObjects(itemRows,itHdr);
    var salesRows=_parseCSV(salesText), salesHeaderRow=6;
    for (var i=0; i<Math.min(15,salesRows.length); i++) {
      if (salesRows[i].some(function(c){return c==='商品管理番号';})) { salesHeaderRow=i; break; }
    }
    var salesData=_csvToObjects(salesRows,salesHeaderRow);
    var cpnRows=_parseCSV(cpnText), cpnData=_csvToObjects(cpnRows,0);
    var salesMap={};
    salesData.forEach(function(r){var no=String(r['商品管理番号']||'').trim(),s=_parseNum(r['売上']||0);if(no)salesMap[no]=(salesMap[no]||0)+s;});
    var couponMap={};
    cpnData.forEach(function(r){var no=String(r['商品管理番号']||'').trim(),cost=_parseNum(r['実績額']||0),sale=_parseNum(r['売上金額']||0);if(no){if(!couponMap[no])couponMap[no]={cost:0,sales:0};couponMap[no].cost+=cost;couponMap[no].sales+=sale;}});
    var seenNos=new Set(),mgmtNos=[];
    kwData.concat(itemData).forEach(function(r){
      var no=String(r['商品管理番号']||'').trim();
      if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}
    });
    salesData.forEach(function(r){
      var no=String(r['商品管理番号']||'').trim();
      if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}
    });
    mgmtNos.sort(function(a,b){var na=Number(a),nb=Number(b);if(!isNaN(na)&&!isNaN(nb))return na-nb;return a<b?-1:a>b?1:0;});
    _kanriLog('商品管理番号数: '+mgmtNos.length, '#a3e635');
    var hN=['レコードの開始行','商品管理番号',mm+'-楽天売上',mm+'-広告売上',mm+'-実績額',mm+'-CVR',mm+'-ROAS',mm+'-獲得単価',mm+'-CPC実績',
      '取得日'+mm+'月☆','楽天売上'+mm+'月☆','キーワード'+mm+'月☆','KWvol'+mm+'月☆','KWシェア'+mm+'月☆','CTR'+mm+'月☆','CL数'+mm+'月☆','実績額'+mm+'月☆','売上金額'+mm+'月☆','売上件数'+mm+'月☆','平均CL単価'+mm+'月☆','目安'+mm+'月☆','CVR'+mm+'月☆','ROAS'+mm+'月☆'];
    var HI={};hN.forEach(function(h,i){HI[h]=i;});
    var outRows=[hN];
    function newRow(){return new Array(hN.length).fill('');}
    function si(r,k,v){if(HI[k]!==undefined&&v!==undefined&&v!==null&&v!=='')r[HI[k]]=v;}
    function setF(r,bl,kw,ex){
      ex=ex||{};var p=bl==='☆'?'月☆':'月★';
      si(r,'取得日'+mm+p,ex.date);si(r,'楽天売上'+mm+p,ex.rakuten);
      if(HI['キーワード'+mm+p]!==undefined)r[HI['キーワード'+mm+p]]=kw;
      si(r,'KWvol'+mm+p,ex.kwvol);si(r,'KWシェア'+mm+p,ex.share);si(r,'CTR'+mm+p,ex.ctr);
      si(r,'CL数'+mm+p,ex.click);si(r,'実績額'+mm+p,ex.cost);si(r,'売上金額'+mm+p,ex.sales);
      si(r,'売上件数'+mm+p,ex.units);si(r,'平均CL単価'+mm+p,ex.avg_cpc);si(r,'目安'+mm+p,ex.target_cpc);
      si(r,'CVR'+mm+p,ex.cvr);si(r,'ROAS'+mm+p,ex.roas);
    }
    mgmtNos.forEach(function(no){
      var kwI=kwData.filter(function(r){return String(r['商品管理番号']||'').trim()===no;});
      var itI=itemData.filter(function(r){return String(r['商品管理番号']||'').trim()===no;});
      var rak=salesMap[no]||'', cpn=couponMap[no]||null;
      var iCl=itI.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var iCo=itI.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var iSa=itI.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var iUn=itI.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);
      var sr=newRow();sr[0]='*';sr[1]=no;
      if(rak!=='')sr[HI[mm+'-楽天売上']]=rak;
      if(iSa)sr[HI[mm+'-広告売上']]=iSa;if(iCo)sr[HI[mm+'-実績額']]=iCo;
      var cv=_calcCvr(iUn,iCl);if(cv)sr[HI[mm+'-CVR']]=cv;
      var ro=_calcRoas(iSa,iCo);if(ro)sr[HI[mm+'-ROAS']]=ro;
      // 獲得単価 = 注文獲得単価(合計720時間) をitem CSVから取得
      if(itI[0]){
        var cpc=_parseNum(itI[0]['CPC実績(合計)']||0);if(cpc)sr[HI[mm+'-CPC実績']]=cpc;
        var ac=_parseNum(itI[0]['注文獲得単価(合計720時間)']||0);if(ac)sr[HI[mm+'-獲得単価']]=ac;
      }
      outRows.push(sr);
      var kCl=kwI.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var kCo=kwI.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var kSa=kwI.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var kUn=kwI.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);
      var dCl=iCl-kCl,dCo=iCo-kCo,dSa=iSa-kSa,dUn=iUn-kUn;
      var ds=yyyy+'/'+mm+'-①';
      var seoSa=rak!==''?(_parseNum(rak)-iSa-(cpn?_parseNum(cpn.sales):0)):'';
      var sRHoshi=newRow();
      si(sRHoshi,'取得日'+mm+'月☆',ds);
      si(sRHoshi,'楽天売上'+mm+'月☆',rak);
      if(HI['キーワード'+mm+'月☆']!==undefined)sRHoshi[HI['キーワード'+mm+'月☆']]='SEO分-②';
      if(seoSa!=='')si(sRHoshi,'売上金額'+mm+'月☆',seoSa);
      outRows.push(sRHoshi);
      var sh=kwI.slice().sort(function(a,b){var ca=_parseNum(a['クリック数(合計)']||0),cb=_parseNum(b['クリック数(合計)']||0),ta=_parseNum(a['CTR(%)']||0),tb=_parseNum(b['CTR(%)']||0);var va=ta>0?Math.floor(ca/ta*100):0,vb=tb>0?Math.floor(cb/tb*100):0;return vb-va;});
            function eb(bl,so){
        // ☆★ブロックの区切り線
        var x=newRow(); setF(x,bl,'------------------------------'); outRows.push(x);
        // kw/itemなし商品（salesのみ）
        if(so.length===0 && iCl===0 && iCo===0){
          var na=newRow(); setF(na,bl,'広告出稿なし'); outRows.push(na);
        } else {
          // 広告合計-③
          var y=newRow(); setF(y,bl,'広告合計-③',{click:iCl||'',cost:iCo||'',sales:iSa||'',units:iUn||'',avg_cpc:_calcAvgCpc(iCo,iCl),cvr:_calcCvr(iUn,iCl),roas:_calcRoas(iSa,iCo)}); outRows.push(y);
          // 商品CPC-④（itemあり時のみ）
          if(itI.length){
            var z=newRow(); setF(z,bl,'商品CPC(20円出稿分)-④',{click:dCl||'',cost:dCo||'',sales:dSa||'',units:dUn||'',avg_cpc:_calcAvgCpc(dCo,dCl),cvr:_calcCvr(dUn,dCl),roas:_calcRoas(dSa,dCo)}); outRows.push(z);
          }
          // KW合計-④
          var w=newRow(); setF(w,bl,'KW合計(下記KWの合計)-④',{click:kCl||'',cost:kCo||'',sales:kSa||'',units:kUn||'',avg_cpc:_calcAvgCpc(kCo,kCl),cvr:_calcCvr(kUn,kCl),roas:_calcRoas(kSa,kCo)}); outRows.push(w);
          // KWvol合計を先に計算（KWシェア算出に必要）
          var totalVol=0;
          so.forEach(function(kw){
            var cl=_parseNum(kw['クリック数(合計)']||0);
            var ctr=_parseNum(kw['CTR(%)']||0);
            totalVol += ctr>0 ? Math.floor(cl/ctr*100) : 0;
          });
          // KW行
          so.forEach(function(kw){
            var c1=_parseNum(kw['クリック数(合計)']||0);
            var c2=_parseNum(kw['実績額(合計)']||0);
            var s1=_parseNum(kw['売上金額(合計720時間)']||0);
            var u1=_parseNum(kw['売上件数(合計720時間)']||0);
            var ctr=_parseNum(kw['CTR(%)']||0);
            var kwvol = ctr>0 ? Math.floor(c1/ctr*100) : 0;
            var kwshare = totalVol>0 ? Math.round(kwvol/totalVol*10000)/100 : 0; kwshare = Number.isInteger(kwshare) ? kwshare.toFixed(1) : kwshare;
            var rk=newRow();
            setF(rk,bl,kw['キーワード']||'',{
              kwvol:kwvol||'', share:kwshare||'',
              ctr:(function(){var v=parseFloat(kw['CTR(%)'||'']);return isNaN(v)||v===0?'':Number.isInteger(v)?v.toFixed(1):v;})(), click:c1||'', cost:c2||'',
              sales:s1||'', units:u1||'',
              avg_cpc:_calcAvgCpc(c2,c1),
              target_cpc:(kw['目安CPC']==='-'?'':kw['目安CPC']||''),
              cvr:_calcCvr(u1,c1), roas:_calcRoas(s1,c2)
            });
            outRows.push(rk);
          });
        }
        // 区切り線
        var x2=newRow(); setF(x2,bl,'------------------------------'); outRows.push(x2);
        // クーポンアドバンス-⑤
        if(cpn){ var r5=newRow(); setF(r5,bl,'クーポンアドバンス-⑤',{cost:cpn.cost||'',sales:cpn.sales||'',roas:_calcRoas(cpn.sales,cpn.cost)}); outRows.push(r5); }
      }
      eb('☆',sh);      });
    var csv='\uFEFF'+outRows.map(function(r){return r.map(function(v){var s=String(v==null?'':v);return(s.indexOf(',')>=0||s.indexOf('"')>=0||s.indexOf('\n')>=0)?'"'+s.split('"').join('""')+'"':s;}).join(',');}).join('\r\n');
    var b=new Blob([csv],{type:'text/csv;charset=utf-8;'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download='ゆかい屋個別-'+yyyy+'-'+mm+'.csv';a.click();URL.revokeObjectURL(u);
    _kanriLog('完了: ゆかい屋個別-'+yyyy+'-'+mm+'.csv','#4ade80');
    _kanriLog('  商品数:'+mgmtNos.length+' 行数:'+outRows.length,'#a3e635');
  } catch(e) { _kanriLog('【エラー】'+e.message,'#f87171'); console.error(e); }
}
