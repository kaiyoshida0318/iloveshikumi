function _kanriSetupZones() {
  var groupMap = { uriage: 'sales', shohin: 'item', kw: 'keyword', coupon: 'coupon' };
  document.querySelectorAll('.kanri-drop').forEach(function(zone) {
    var group = zone.getAttribute('data-group');
    var key = groupMap[group];
    if (!key) return;
    zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
    // inputがあればchangeイベントも設定
    var input = zone.querySelector('input[type=file]');
    if (input) {
      input.addEventListener('change', function(e) {
        var file = e.target.files && e.target.files[0];
        if (!file) return;
        _kanriFiles[key] = file;
        var filesEl = document.getElementById('files-' + group);
        if (filesEl) {
          filesEl.innerHTML = '';
          var span = document.createElement('span');
          span.style.cssText = 'color:#16a34a;font-size:.8rem;padding:.25rem 0;display:block;';
          span.textContent = '✅ ' + file.name;
          filesEl.appendChild(span);
        }
      });
    }
  });
}
function _kanriSetupZones() {
  var map = {
    'dz-sales': 'sales',
    'dz-item': 'item',
    'dz-keyword': 'keyword',
    'dz-coupon': 'coupon'
  };
  Object.keys(map).forEach(function(id) {
    var key = map[id];
    var zone = document.getElementById(id);
    if (!zone) return;
    var label = zone.querySelector('.kanri-file-name');
    var input = zone.querySelector('input[type=file]');
    function setFile(file) {
      if (!file) return;
      _kanriFiles[key] = file;
      if (label) { label.textContent = '┅ ' + file.name; label.style.color = '#16a34a'; }
    }
    zone.addEventListener('dragover', function(e) { e.preventDefault(); zone.classList.add('dragover'); });
    zone.addEventListener('dragleave', function() { zone.classList.remove('dragover'); });
    zone.addEventListener('drop', function(e) {
      e.preventDefault(); zone.classList.remove('dragover');
      if (e.dataTransfer.files[0]) setFile(e.dataTransfer.files[0]);
    });
    if (input) input.addEventListener('change', function(e) { if (e.target.files[0]) setFile(e.target.files[0]); });
  });
}

document.addEventListener('DOMContentLoaded', function() { _kanriSetupZones(); });

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
    var kwText    = await _readFileAsText(_kanriFiles.keyword, 'Shift_JIS');
    var itemText  = await _readFileAsText(_kanriFiles.item,    'Shift_JIS');
    var salesText = await _readFileAsText(_kanriFiles.sales,   'UTF-8');
    var cpnText   = await _readFileAsText(_kanriFiles.coupon,  'UTF-8');
    var yyyy='', mm='';
    var kwLines = kwText.split(new RegExp('\r?\n'));
    for (var i=0; i<Math.min(10,kwLines.length); i++) {
      var m1 = kwLines[i].match(new RegExp('(20[0-9][0-9])[-]([0-9][0-9])'));
      if (m1) { yyyy=m1[1]; mm=m1[2]; break; }
    }
    if (!yyyy) {
      var m2 = _kanriFiles.sales.name.match(new RegExp('(20[0-9][0-9])([0-9][0-9])'));
      if (m2) { yyyy=m2[1]; mm=m2[2]; }
    }
    _kanriLog('対象年月: '+yyyy+'-'+mm, '#a3e635');
    var kwRows=_parseCSV(kwText), itemRows=_parseCSV(itemText);
    var kwData=_csvToObjects(kwRows,6), itemData=_csvToObjects(itemRows,6);
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
    var seenNos=new Set(), mgmtNos=[];
    kwData.concat(itemData).forEach(function(r){var no=String(r['商品管理番号']||'').trim();if(no&&!seenNos.has(no)){seenNos.add(no);mgmtNos.push(no);}});
    _kanriLog('商品管理番号数: '+mgmtNos.length, '#a3e635');
    var hN=['レコードの開始行','商品管理番号',mm+'-楽天売上',mm+'-広告売上',mm+'-実績額',mm+'-CVR',mm+'-ROAS',mm+'-獲得単価',mm+'-CPC実績',
      '取得日'+mm+'月☆','楽天売上'+mm+'月☆','キーワード'+mm+'月☆','KWvol'+mm+'月☆','KWシェア'+mm+'月☆','CTR'+mm+'月☆','CL数'+mm+'月☆','実績額'+mm+'月☆','売上金額'+mm+'月☆','売上件数'+mm+'月☆','平均CL単価'+mm+'月☆','目安'+mm+'月☆','CVR'+mm+'月☆','ROAS'+mm+'月☆',
      '取得日'+mm+'月★','楽天売上'+mm+'月★','キーワード'+mm+'月★','KWvol'+mm+'月★','KWシェア'+mm+'月★','CTR'+mm+'月★','CL数'+mm+'月★','実績額'+mm+'月★','売上金額'+mm+'月★','売上件数'+mm+'月★','平均CL単価'+mm+'月★','目安'+mm+'月★','CVR'+mm+'月★','ROAS'+mm+'月★'];
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
      var ac=_calcAvgCpc(iCo,iCl);if(ac)sr[HI[mm+'-獲得単価']]=ac;
      if(itI[0]){var cpc=_parseNum(itI[0]['CPC実績(合計)']||0);if(cpc)sr[HI[mm+'-CPC実績']]=cpc;}
      outRows.push(sr);
      var kCl=kwI.reduce(function(s,r){return s+_parseNum(r['クリック数(合計)']||0);},0);
      var kCo=kwI.reduce(function(s,r){return s+_parseNum(r['実績額(合計)']||0);},0);
      var kSa=kwI.reduce(function(s,r){return s+_parseNum(r['売上金額(合計720時間)']||0);},0);
      var kUn=kwI.reduce(function(s,r){return s+_parseNum(r['売上件数(合計720時間)']||0);},0);
      var dCl=iCl-kCl,dCo=iCo-kCo,dSa=iSa-kSa,dUn=iUn-kUn;
      var ds=yyyy+'/'+mm+'-①';
      var seoSa=rak!==''?(_parseNum(rak)-iSa):'';
      var sR=newRow();
      ['☆','★'].forEach(function(bl){var p2=bl==='☆'?'月☆':'月★';si(sR,'取得日'+mm+p2,ds);si(sR,'楽天売上'+mm+p2,rak);if(HI['キーワード'+mm+p2]!==undefined)sR[HI['キーワード'+mm+p2]]='SEO分-②';if(seoSa!=='')si(sR,'売上金額'+mm+p2,seoSa);});
      outRows.push(sR);
      var sh=kwI.slice().sort(function(a,b){return _parseNum(b['売上金額(合計720時間)']||0)-_parseNum(a['売上金額(合計720時間)']||0);});
      var co=kwI.slice().sort(function(a,b){return _parseNum(b['実績額(合計)']||0)-_parseNum(a['実績額(合計)']||0);});
      function eb(bl,so){
        var x=newRow();setF(x,bl,'------------------------------');outRows.push(x);
        var y=newRow();setF(y,bl,'広告合計-③',{click:iCl||'',cost:iCo||'',sales:iSa||'',units:iUn||'',avg_cpc:_calcAvgCpc(iCo,iCl),cvr:_calcCvr(iUn,iCl),roas:_calcRoas(iSa,iCo)});outRows.push(y);
        if(itI.length){var z=newRow();setF(z,bl,'商品CPC(20円出稿分)-④',{click:dCl||'',cost:dCo||'',sales:dSa||'',units:dUn||'',avg_cpc:_calcAvgCpc(dCo,dCl),cvr:_calcCvr(dUn,dCl),roas:_calcRoas(dSa,dCo)});outRows.push(z);}
        var w=newRow();setF(w,bl,'KW合計(下記KWの合計)-④',{click:kCl||'',cost:kCo||'',sales:kSa||'',units:kUn||'',avg_cpc:_calcAvgCpc(kCo,kCl),cvr:_calcCvr(kUn,kCl),roas:_calcRoas(kSa,kCo)});outRows.push(w);
        so.forEach(function(kw){var c1=_parseNum(kw['クリック数(合計)']||0),c2=_parseNum(kw['実績額(合計)']||0),s1=_parseNum(kw['売上金額(合計720時間)']||0),u1=_parseNum(kw['売上件数(合計720時間)']||0);var rk=newRow();setF(rk,bl,kw['キーワード']||'',{ctr:kw['CTR(%)']||'',click:c1||'',cost:c2||'',sales:s1||'',units:u1||'',avg_cpc:_calcAvgCpc(c2,c1),target_cpc:kw['目安CPC']||'',cvr:_calcCvr(u1,c1),roas:_calcRoas(s1,c2)});outRows.push(rk);});
        var x2=newRow();setF(x2,bl,'------------------------------');outRows.push(x2);
        if(cpn){var r5=newRow();setF(r5,bl,'クーポンアドバンス-⑤',{cost:cpn.cost||'',sales:cpn.sales||'',roas:_calcRoas(cpn.sales,cpn.cost)});outRows.push(r5);}
      }
      eb('☆',sh);eb('★',co);
    });
    var csv='\uFEFF'+outRows.map(function(r){return r.map(function(v){var s=String(v==null?'':v);return(s.indexOf(',')>=0||s.indexOf('"')>=0||s.indexOf('\n')>=0)?'"'+s.split('"').join('""')+'"':s;}).join(',');}).join('\r\n');
    var b=new Blob([csv],{type:'text/csv;charset=utf-8;'});var u=URL.createObjectURL(b);var a=document.createElement('a');a.href=u;a.download='ゆかい屋個別-'+yyyy+'-'+mm+'.csv';a.click();URL.revokeObjectURL(u);
    _kanriLog('完了: ゆかい屋個別-'+yyyy+'-'+mm+'.csv','#4ade80');
    _kanriLog('  商品数:'+mgmtNos.length+' 行数:'+outRows.length,'#a3e635');
  } catch(e) { _kanriLog('【エラー】'+e.message,'#f87171'); console.error(e); }
}
