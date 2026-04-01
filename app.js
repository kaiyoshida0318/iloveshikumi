
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
function handleDrop(e, group) {
  e.preventDefault();
  const files = Array.from(e.dataTransfer.files);
  if (!kanriFiles[group]) kanriFiles[group] = [];
  files.forEach(f => {
    kanriFiles[group].push(f);
    const container = document.getElementById('files-' + group);
    const item = document.createElement('div');
    item.className = 'kanri-file-item';
    item.innerHTML = '<span>' + f.name + '<\/span><span class="kanri-file-remove" onclick="removeKanriFile(this,\''+group+'\',' + kanriFiles[group].length-1 + ')">✕<\/span>';
    container.appendChild(item);
  });
  e.currentTarget.classList.remove('dragover');
}
document.addEventListener('dragover', e => {
  const drop = e.target.closest('.kanri-drop');
  if (drop) drop.classList.add('dragover');
});
document.addEventListener('dragleave', e => {
  const drop = e.target.closest('.kanri-drop');
  if (drop) drop.classList.remove('dragover');
});

// 商品管理ドロップゾーン
document.querySelectorAll('.kanri-dropzone').forEach(zone => {
  zone.addEventListener('dragover', e => { e.preventDefault(); zone.classList.add('dragover'); });
  zone.addEventListener('dragleave', () => zone.classList.remove('dragover'));
  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) zone.querySelector('.kanri-file-name').textContent = '✅ ' + file.name;
  });
  zone.querySelector('.kanri-file-input').addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) zone.querySelector('.kanri-file-name').textContent = '✅ ' + file.name;
  });
});

async function kanriRun() {
  const log = document.getElementById('kanri-log');
  if (log) { log.style.display = 'block'; log.innerHTML = ''; }
  const missing = [];
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
    var kwText    = await _readFileAsText(_kanriFiles.keyword, 'Shift_JIS');
    var itemText  = await _readFileAsText(_kanriFiles.item,    'Shift_JIS');
    var salesText = await _readFileAsText(_kanriFiles.sales,   'UTF-8');
    var cpnText   = await _readFileAsText(_kanriFiles.coupon,  'UTF-8');

    var yyyy = '', mm = '';
    var kwLines = kwText.split(/?
/);
    for (var i = 0; i < Math.min(10, kwLines.length); i++) {
      var match = kwLines[i].match(/(20d{2})[-](d{2})/);
      if (match) { yyyy = match[1]; mm = match[2]; break; }
    }
    if (!yyyy) {
      var fnMatch = _kanriFiles.sales.name.match(/(20d{2})(d{2})/);
      if (fnMatch) { yyyy = fnMatch[1]; mm = fnMatch[2]; }
    }
    _kanriLog('対象年月: ' + yyyy + '-' + mm, '#a3e635');

    var kwRows   = _parseCSV(kwText);
    var itemRows = _parseCSV(itemText);
    var kwData   = _csvToObjects(kwRows, 6);
    var itemData = _csvToObjects(itemRows, 6);

    var salesRows = _parseCSV(salesText);
    var salesHeaderRow = 6;
    for (var i = 0; i < Math.min(15, salesRows.length); i++) {
      if (salesRows[i].some(function(c) { return c === '商品管理番号'; })) { salesHeaderRow = i; break; }
    }
    var salesData = _csvToObjects(salesRows, salesHeaderRow);

    var cpnRows = _parseCSV(cpnText);
    var cpnData = _csvToObjects(cpnRows, 0);

    var salesMap = {};
    salesData.forEach(function(r) {
      var no = String(r['商品管理番号'] || '').trim();
      var s  = _parseNum(r['売上'] || 0);
      if (no) salesMap[no] = (salesMap[no] || 0) + s;
    });

    var couponMap = {};
    cpnData.forEach(function(r) {
      var no   = String(r['商品管理番号'] || '').trim();
      var cost = _parseNum(r['実績額'] || 0);
      var sale = _parseNum(r['売上金額'] || 0);
      if (no) {
        if (!couponMap[no]) couponMap[no] = { cost: 0, sales: 0 };
        couponMap[no].cost  += cost;
        couponMap[no].sales += sale;
      }
    });

    var seenNos = new Set();
    var mgmtNos = [];
    kwData.concat(itemData).forEach(function(r) {
      var no = String(r['商品管理番号'] || '').trim();
      if (no && !seenNos.has(no)) { seenNos.add(no); mgmtNos.push(no); }
    });
    _kanriLog('商品管理番号数: ' + mgmtNos.length, '#a3e635');

    var header = [
      'レコードの開始行','商品管理番号',
      mm+'-楽天売上', mm+'-広告売上', mm+'-実績額', mm+'-CVR', mm+'-ROAS', mm+'-獲得単価', mm+'-CPC実績',
      '取得日'+mm+'月☆','楽天売上'+mm+'月☆','キーワード'+mm+'月☆','KWvol'+mm+'月☆','KWシェア'+mm+'月☆','CTR'+mm+'月☆','CL数'+mm+'月☆','実績額'+mm+'月☆','売上金額'+mm+'月☆','売上件数'+mm+'月☆','平均CL単価'+mm+'月☆','目安'+mm+'月☆','CVR'+mm+'月☆','ROAS'+mm+'月☆',
      '取得日'+mm+'月★','楽天売上'+mm+'月★','キーワード'+mm+'月★','KWvol'+mm+'月★','KWシェア'+mm+'月★','CTR'+mm+'月★','CL数'+mm+'月★','実績額'+mm+'月★','売上金額'+mm+'月★','売上件数'+mm+'月★','平均CL単価'+mm+'月★','目安'+mm+'月★','CVR'+mm+'月★','ROAS'+mm+'月★'
    ];
    var HI = {};
    header.forEach(function(h, i) { HI[h] = i; });

    var outRows = [header];

    function newRow() { return new Array(header.length).fill(''); }

    function setF(r, block, kw, ex) {
      ex = ex || {};
      var p = block === '☆' ? '月☆' : '月★';
      var cols = {
        '取得日'+mm+p: ex.date, '楽天売上'+mm+p: ex.rakuten, 'キーワード'+mm+p: kw,
        'KWvol'+mm+p: ex.kwvol, 'KWシェア'+mm+p: ex.share, 'CTR'+mm+p: ex.ctr,
        'CL数'+mm+p: ex.click, '実績額'+mm+p: ex.cost, '売上金額'+mm+p: ex.sales,
        '売上件数'+mm+p: ex.units, '平均CL単価'+mm+p: ex.avg_cpc,
        '目安'+mm+p: ex.target_cpc, 'CVR'+mm+p: ex.cvr, 'ROAS'+mm+p: ex.roas
      };
      Object.keys(cols).forEach(function(k) {
        if (HI[k] !== undefined && cols[k] !== undefined) r[HI[k]] = cols[k];
      });
    }

    mgmtNos.forEach(function(no) {
      var kwItems   = kwData.filter(function(r) { return String(r['商品管理番号']||'').trim() === no; });
      var itemItems = itemData.filter(function(r) { return String(r['商品管理番号']||'').trim() === no; });
      var rakuten   = salesMap[no] || '';
      var coupon    = couponMap[no] || null;

      var iCl = itemItems.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var iCo = itemItems.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var iSa = itemItems.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var iUn = itemItems.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);

      var sr = newRow();
      sr[HI['レコードの開始行']] = '*';
      sr[HI['商品管理番号']]     = no;
      sr[HI[mm+'-楽天売上']]    = rakuten;
      sr[HI[mm+'-広告売上']]    = iSa || '';
      sr[HI[mm+'-実績額']]      = iCo || '';
      sr[HI[mm+'-CVR']]         = _calcCvr(iUn, iCl) || '';
      sr[HI[mm+'-ROAS']]        = _calcRoas(iSa, iCo) || '';
      sr[HI[mm+'-獲得単価']]    = _calcAvgCpc(iCo, iCl) || '';
      sr[HI[mm+'-CPC実績']]     = itemItems[0] ? (_parseNum(itemItems[0]['CPC実績(合計)']||0)||'') : '';
      outRows.push(sr);

      var kCl = kwItems.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var kCo = kwItems.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var kSa = kwItems.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var kUn = kwItems.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);
      var dCl = iCl-kCl, dCo = iCo-kCo, dSa = iSa-kSa, dUn = iUn-kUn;

      var dateStr = yyyy+'/'+mm+'-①';
      var seoRakuten = rakuten !== '' ? (_parseNum(rakuten) - _parseNum(iSa||0)) : '';
      var seoRow = newRow();
      ['☆','★'].forEach(function(block) {
        var p = block === '☆' ? '月☆' : '月★';
        if (HI['取得日'+mm+p] !== undefined)   seoRow[HI['取得日'+mm+p]]   = dateStr;
        if (HI['楽天売上'+mm+p] !== undefined)  seoRow[HI['楽天売上'+mm+p]]  = rakuten;
        if (HI['キーワード'+mm+p] !== undefined) seoRow[HI['キーワード'+mm+p]] = 'SEO分-②';
        if (HI['売上金額'+mm+p] !== undefined && seoRakuten !== '') seoRow[HI['売上金額'+mm+p]] = seoRakuten;
      });
      outRows.push(seoRow);

      var shareSorted = kwItems.slice().sort(function(a,b){return _parseNum(b['売上金額(合計720時間)']||0)-_parseNum(a['売上金額(合計720時間)']||0);});
      var costSorted  = kwItems.slice().sort(function(a,b){return _parseNum(b['実績額(合計)']||0)-_parseNum(a['実績額(合計)']||0);});

      function emitBlock(block, sorted) {
        var r1 = newRow(); setF(r1, block, '------------------------------'); outRows.push(r1);
        var r3 = newRow(); setF(r3, block, '広告合計-③', {click:iCl||'',cost:iCo||'',sales:iSa||'',units:iUn||'',avg_cpc:_calcAvgCpc(iCo,iCl),cvr:_calcCvr(iUn,iCl),roas:_calcRoas(iSa,iCo)}); outRows.push(r3);
        if (itemItems.length) { var r4a=newRow(); setF(r4a,block,'商品CPC(20円出稿分)-④',{click:dCl||'',cost:dCo||'',sales:dSa||'',units:dUn||'',avg_cpc:_calcAvgCpc(dCo,dCl),cvr:_calcCvr(dUn,dCl),roas:_calcRoas(dSa,dCo)}); outRows.push(r4a); }
        var r4b=newRow(); setF(r4b,block,'KW合計(下記KWの合計)-④',{click:kCl||'',cost:kCo||'',sales:kSa||'',units:kUn||'',avg_cpc:_calcAvgCpc(kCo,kCl),cvr:_calcCvr(kUn,kCl),roas:_calcRoas(kSa,kCo)}); outRows.push(r4b);
        sorted.forEach(function(kw) {
          var cl=_parseNum(kw['クリック数(合計)']||0), co=_parseNum(kw['実績額(合計)']||0), sa=_parseNum(kw['売上金額(合計720時間)']||0), un=_parseNum(kw['売上件数(合計720時間)']||0);
          var rk=newRow(); setF(rk,block,kw['キーワード']||'',{ctr:kw['CTR(%)']||'',click:cl||'',cost:co||'',sales:sa||'',units:un||'',avg_cpc:_calcAvgCpc(co,cl),target_cpc:kw['目安CPC']||'',cvr:_calcCvr(un,cl),roas:_calcRoas(sa,co)});
          outRows.push(rk);
        });
        var r1b=newRow(); setF(r1b,block,'------------------------------'); outRows.push(r1b);
        if (coupon) { var r5=newRow(); setF(r5,block,'クーポンアドバンス-⑤',{cost:coupon.cost||'',sales:coupon.sales||'',roas:_calcRoas(coupon.sales,coupon.cost)}); outRows.push(r5); }
      }

      emitBlock('☆', shareSorted);
      emitBlock('★', costSorted);
    });

    var csvContent = '﻿' + outRows.map(function(r) {
      return r.map(function(v) {
        var s = String(v == null ? '' : v);
        return (s.indexOf(',')>=0||s.indexOf('"')>=0||s.indexOf('
')>=0) ? '"'+s.replace(/"/g,'""')+'"' : s;
      }).join(',');
    }).join('
');

    var blob = new Blob([csvContent], {type:'text/csv;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url; a.download = 'ゆかい屋個別-' + yyyy + '-' + mm + '.csv';
    a.click(); URL.revokeObjectURL(url);
    _kanriLog('完了: ゆかい屋個別-' + yyyy + '-' + mm + '.csv', '#4ade80');
    _kanriLog('  商品数: ' + mgmtNos.length + ' / 行数: ' + outRows.length, '#a3e635');
  } catch(e) {
    _kanriLog('【エラー】' + e.message, '#f87171');
    console.error(e);
  }
}

async function kanriRun() {
  const log = document.getElementById('kanri-log');
  if (log) { log.style.display = 'block'; log.innerHTML = ''; }
  const missing = [];
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
    var kwText    = await _readFileAsText(_kanriFiles.keyword, 'Shift_JIS');
    var itemText  = await _readFileAsText(_kanriFiles.item,    'Shift_JIS');
    var salesText = await _readFileAsText(_kanriFiles.sales,   'UTF-8');
    var cpnText   = await _readFileAsText(_kanriFiles.coupon,  'UTF-8');
    var yyyy = '', mm = '';
    var kwLines = kwText.split(/\r?\n/);
    for (var i = 0; i < Math.min(10, kwLines.length); i++) {
      var match = kwLines[i].match(/(20\d{2})[-](\d{2})/);
      if (match) { yyyy = match[1]; mm = match[2]; break; }
    }
    if (!yyyy) {
      var fnMatch = _kanriFiles.sales.name.match(/(20\d{2})(\d{2})/);
      if (fnMatch) { yyyy = fnMatch[1]; mm = fnMatch[2]; }
    }
    _kanriLog('対象年月: ' + yyyy + '-' + mm, '#a3e635');
    var kwRows = _parseCSV(kwText); var itemRows = _parseCSV(itemText);
    var kwData = _csvToObjects(kwRows, 6); var itemData = _csvToObjects(itemRows, 6);
    var salesRows = _parseCSV(salesText); var salesHeaderRow = 6;
    for (var i = 0; i < Math.min(15, salesRows.length); i++) {
      if (salesRows[i].some(function(c){return c==='商品管理番号';})) { salesHeaderRow=i; break; }
    }
    var salesData = _csvToObjects(salesRows, salesHeaderRow);
    var cpnRows = _parseCSV(cpnText); var cpnData = _csvToObjects(cpnRows, 0);
    var salesMap = {};
    salesData.forEach(function(r){var no=String(r['商品管理番号']||'').trim(),s=_parseNum(r['売上']||0);if(no)salesMap[no]=(salesMap[no]||0)+s;});
    var couponMap = {};
    cpnData.forEach(function(r){var no=String(r['商品管理番号']||'').trim(),cost=_parseNum(r['実績額']||0),sale=_parseNum(r['売上金額']||0);if(no){if(!couponMap[no])couponMap[no]={cost:0,sales:0};couponMap[no].cost+=cost;couponMap[no].sales+=sale;}});
    var seenNos=new Set(),mgmtNos=[];
    kwData.concat(itemData).forEach(function(r){var no=String(r['商品管理番号']||'').trim();if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}});
    _kanriLog('商品管理番号数: '+mgmtNos.length, '#a3e635');
    var header=['レコードの開始行','商品管理番号',mm+'-楽天売上',mm+'-広告売上',mm+'-実績額',mm+'-CVR',mm+'-ROAS',mm+'-獲得単価',mm+'-CPC実績','取得日'+mm+'月☆','楽天売上'+mm+'月☆','キーワード'+mm+'月☆','KWvol'+mm+'月☆','KWシェア'+mm+'月☆','CTR'+mm+'月☆','CL数'+mm+'月☆','実績額'+mm+'月☆','売上金額'+mm+'月☆','売上件数'+mm+'月☆','平均CL単価'+mm+'月☆','目安'+mm+'月☆','CVR'+mm+'月☆','ROAS'+mm+'月☆','取得日'+mm+'月★','楽天売上'+mm+'月★','キーワード'+mm+'月★','KWvol'+mm+'月★','KWシェア'+mm+'月★','CTR'+mm+'月★','CL数'+mm+'月★','実績額'+mm+'月★','売上金額'+mm+'月★','売上件数'+mm+'月★','平均CL単価'+mm+'月★','目安'+mm+'月★','CVR'+mm+'月★','ROAS'+mm+'月★'];
    var HI={};header.forEach(function(h,i){HI[h]=i;});
    var outRows=[header];
    function newRow(){return new Array(header.length).fill('');}
    function setF(r,block,kw,ex){ex=ex||{};var p=block==='☆'?'月☆':'月★';var cols={'取得日'+mm+p:ex.date,'楽天売上'+mm+p:ex.rakuten,'キーワード'+mm+p:kw,'KWvol'+mm+p:ex.kwvol,'KWシェア'+mm+p:ex.share,'CTR'+mm+p:ex.ctr,'CL数'+mm+p:ex.click,'実績額'+mm+p:ex.cost,'売上金額'+mm+p:ex.sales,'売上件数'+mm+p:ex.units,'平均CL単価'+mm+p:ex.avg_cpc,'目安'+mm+p:ex.target_cpc,'CVR'+mm+p:ex.cvr,'ROAS'+mm+p:ex.roas};Object.keys(cols).forEach(function(k){if(HI[k]!==undefined&&cols[k]!==undefined)r[HI[k]]=cols[k];});}
    mgmtNos.forEach(function(no){
      var kwItems=kwData.filter(function(r){return String(r['商品管理番号']||'').trim()===no;});
      var itemItems=itemData.filter(function(r){return String(r['商品管理番号']||'').trim()===no;});
      var rakuten=salesMap[no]||'',coupon=couponMap[no]||null;
      var iCl=itemItems.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var iCo=itemItems.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var iSa=itemItems.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var iUn=itemItems.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);
      var sr=newRow();sr[HI['レコードの開始行']]='*';sr[HI['商品管理番号']]=no;sr[HI[mm+'-楽天売上']]=rakuten;sr[HI[mm+'-広告売上']]=iSa||'';sr[HI[mm+'-実績額']]=iCo||'';sr[HI[mm+'-CVR']]=_calcCvr(iUn,iCl)||'';sr[HI[mm+'-ROAS']]=_calcRoas(iSa,iCo)||'';sr[HI[mm+'-獲得単価']]=_calcAvgCpc(iCo,iCl)||'';sr[HI[mm+'-CPC実績']]=itemItems[0]?(_parseNum(itemItems[0]['CPC実績(合計)']||0)||''):'';outRows.push(sr);
      var kCl=kwItems.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var kCo=kwItems.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var kSa=kwItems.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var kUn=kwItems.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);
      var dCl=iCl-kCl,dCo=iCo-kCo,dSa=iSa-kSa,dUn=iUn-kUn;
      var dateStr=yyyy+'/'+mm+'-①';
      var seoRakuten=rakuten!==''?(_parseNum(rakuten)-_parseNum(iSa||0)):'';
      var seoRow=newRow();
      ['☆','★'].forEach(function(block){var p=block==='☆'?'月☆':'月★';if(HI['取得日'+mm+p]!==undefined)seoRow[HI['取得日'+mm+p]]=dateStr;if(HI['楽天売上'+mm+p]!==undefined)seoRow[HI['楽天売上'+mm+p]]=rakuten;if(HI['キーワード'+mm+p]!==undefined)seoRow[HI['キーワード'+mm+p]]='SEO分-②';if(HI['売上金額'+mm+p]!==undefined&&seoRakuten!=='')seoRow[HI['売上金額'+mm+p]]=seoRakuten;});
      outRows.push(seoRow);
      var shareSorted=kwItems.slice().sort(function(a,b){return _parseNum(b['売上金額(合計720時間)']||0)-_parseNum(a['売上金額(合計720時間)']||0);});
      var costSorted=kwItems.slice().sort(function(a,b){return _parseNum(b['実績額(合計)']||0)-_parseNum(a['実績額(合計)']||0);});
      function emitBlock(block,sorted){
        var r1=newRow();setF(r1,block,'------------------------------');outRows.push(r1);
        var r3=newRow();setF(r3,block,'広告合計-③',{click:iCl||'',cost:iCo||'',sales:iSa||'',units:iUn||'',avg_cpc:_calcAvgCpc(iCo,iCl),cvr:_calcCvr(iUn,iCl),roas:_calcRoas(iSa,iCo)});outRows.push(r3);
        if(itemItems.length){var r4a=newRow();setF(r4a,block,'商品CPC(20円出稿分)-④',{click:dCl||'',cost:dCo||'',sales:dSa||'',units:dUn||'',avg_cpc:_calcAvgCpc(dCo,dCl),cvr:_calcCvr(dUn,dCl),roas:_calcRoas(dSa,dCo)});outRows.push(r4a);}
        var r4b=newRow();setF(r4b,block,'KW合計(下記KWの合計)-④',{click:kCl||'',cost:kCo||'',sales:kSa||'',units:kUn||'',avg_cpc:_calcAvgCpc(kCo,kCl),cvr:_calcCvr(kUn,kCl),roas:_calcRoas(kSa,kCo)});outRows.push(r4b);
        sorted.forEach(function(kw){var cl=_parseNum(kw['クリック数(合計)']||0),co=_parseNum(kw['実績額(合計)']||0),sa=_parseNum(kw['売上金額(合計720時間)']||0),un=_parseNum(kw['売上件数(合計720時間)']||0);var rk=newRow();setF(rk,block,kw['キーワード']||'',{ctr:kw['CTR(%)']||'',click:cl||'',cost:co||'',sales:sa||'',units:un||'',avg_cpc:_calcAvgCpc(co,cl),target_cpc:kw['目安CPC']||'',cvr:_calcCvr(un,cl),roas:_calcRoas(sa,co)});outRows.push(rk);});
        var r1b=newRow();setF(r1b,block,'------------------------------');outRows.push(r1b);
        if(coupon){var r5=newRow();setF(r5,block,'クーポンアドバンス-⑤',{cost:coupon.cost||'',sales:coupon.sales||'',roas:_calcRoas(coupon.sales,coupon.cost)});outRows.push(r5);}
      }
      emitBlock('☆',shareSorted);emitBlock('★',costSorted);
    });
    var csvContent='\uFEFF'+outRows.map(function(r){return r.map(function(v){var s=String(v==null?'':v);return(s.indexOf(',')>=0||s.indexOf('"')>=0||s.indexOf('\n')>=0)?'"'+s.replace(/"/g,'""')+'"':s;}).join(',');}).join('\r\n');
    var blob=new Blob([csvContent],{type:'text/csv;charset=utf-8;'});
    var url=URL.createObjectURL(blob);var a=document.createElement('a');a.href=url;a.download='ゆかい屋個別-'+yyyy+'-'+mm+'.csv';a.click();URL.revokeObjectURL(url);
    _kanriLog('完了: ゆかい屋個別-'+yyyy+'-'+mm+'.csv', '#4ade80');
    _kanriLog('  商品数: '+mgmtNos.length+' / 行数: '+outRows.length, '#a3e635');
  } catch(e) { _kanriLog('【エラー】'+e.message,'#f87171');console.error(e); }
}
