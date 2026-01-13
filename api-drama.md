
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Drama APIs Explorer</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root{--bg:#0a0a0f;--bg2:#12121a;--bg3:#1a1a25;--border:#2a2a3a;--text:#f0f0f5;--text2:#8888a0;--accent:#00d4ff;--green:#00ff88;--blue:#00d4ff;--red:#ff4466;--yellow:#ffcc00;--purple:#aa66ff;--glass:rgba(255,255,255,.03)}
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);min-height:100vh;position:relative;overflow-x:hidden}
    body::before{content:'';position:fixed;top:-50%;left:-50%;width:200%;height:200%;background:radial-gradient(circle at 20% 20%,rgba(0,212,255,.08) 0%,transparent 40%),radial-gradient(circle at 80% 80%,rgba(170,102,255,.08) 0%,transparent 40%);animation:bgMove 20s ease-in-out infinite;z-index:-1}
    @keyframes bgMove{0%,100%{transform:translate(0,0)}50%{transform:translate(-5%,-5%)}}
    .container{max-width:1400px;margin:0 auto;padding:20px}
    header{text-align:center;padding:48px 0 32px;margin-bottom:32px}
    h1{font-size:clamp(28px,5vw,42px);font-weight:700;margin-bottom:12px;background:linear-gradient(135deg,var(--accent),var(--purple),var(--accent));background-size:200% 200%;-webkit-background-clip:text;-webkit-text-fill-color:transparent;animation:gradient 4s ease infinite;text-shadow:0 0 60px rgba(0,212,255,.3)}
    @keyframes gradient{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}
    .subtitle{color:var(--text2);font-size:15px;margin-bottom:12px;letter-spacing:.5px}
    .notice{color:var(--yellow);font-size:12px;margin-bottom:20px;padding:10px 20px;background:linear-gradient(135deg,rgba(255,204,0,.1),rgba(255,204,0,.05));border:1px solid rgba(255,204,0,.2);border-radius:12px;display:inline-flex;align-items:center;gap:8px;backdrop-filter:blur(10px)}
    .tg-btn{display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#0088cc,#00aced);color:#fff;padding:12px 28px;border-radius:50px;text-decoration:none;font-size:14px;font-weight:600;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 4px 20px rgba(0,136,204,.4),inset 0 1px 0 rgba(255,255,255,.2)}
    .tg-btn:hover{transform:translateY(-3px) scale(1.02);box-shadow:0 8px 30px rgba(0,136,204,.5)}
    .tg-btn svg{width:20px;height:20px}
    .api-tabs{display:flex;gap:12px;flex-wrap:wrap;justify-content:center;margin-bottom:32px;padding:0 16px}
    .api-tab{background:var(--glass);border:1px solid var(--border);border-radius:16px;padding:12px 24px;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);display:flex;align-items:center;gap:12px;backdrop-filter:blur(10px)}
    .api-tab:hover{border-color:var(--accent);transform:translateY(-4px);box-shadow:0 8px 25px rgba(0,212,255,.2)}
    .api-tab.active{border-color:var(--accent);background:linear-gradient(135deg,rgba(0,212,255,.1),rgba(170,102,255,.1))}
    .api-tab .name{font-weight:600;font-size:14px}
    .api-tab .port{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);background:rgba(0,212,255,.15);padding:3px 10px;border-radius:20px}
    .api-tab .dot{width:10px;height:10px;background:var(--green);border-radius:50%;box-shadow:0 0 15px var(--green);animation:pulse 2s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(.9)}}
    .layout{display:flex;flex-direction:column;gap:20px}
    .api-section{background:var(--glass);border:1px solid var(--border);border-radius:20px;overflow:hidden;backdrop-filter:blur(10px);transition:all .3s}
    .api-section:hover{border-color:rgba(0,212,255,.3)}
    .api-header{display:flex;align-items:center;gap:14px;padding:18px 24px;cursor:pointer;transition:all .2s}
    .api-header:hover{background:var(--bg3)}
    .api-header.active{background:linear-gradient(90deg,rgba(0,212,255,.1),rgba(170,102,255,.05))}
    .api-header .dot{width:10px;height:10px;background:var(--green);border-radius:50%;box-shadow:0 0 12px var(--green)}
    .api-header .name{font-weight:600;font-size:16px;flex:1}
    .api-header .port{font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--accent);background:rgba(0,212,255,.15);padding:4px 12px;border-radius:20px}
    .api-header .arrow{color:var(--text2);transition:transform .3s cubic-bezier(.4,0,.2,1)}
    .api-header.active .arrow{transform:rotate(180deg);color:var(--accent)}
    .api-endpoints{display:none;border-top:1px solid var(--border)}
    .api-endpoints.show{display:block;animation:slideDown .3s ease}
    @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
    .ep-item{border-bottom:1px solid var(--border)}
    .ep-item:last-child{border-bottom:none}
    .ep-header{display:flex;align-items:center;gap:12px;padding:14px 24px;cursor:pointer;transition:all .2s}
    .ep-header:hover{background:var(--bg3)}
    .ep-header.active{background:rgba(0,212,255,.08)}
    .ep-console{display:none;padding:20px 24px;background:var(--bg);border-top:1px solid var(--border)}
    .ep-console.show{display:block;animation:fadeIn .3s ease}
    @keyframes fadeIn{from{opacity:0}to{opacity:1}}
    @media(max-width:600px){.api-header{padding:14px 18px}.ep-header{padding:12px 18px}.ep-console{padding:16px 18px}}
    .method{font-family:'JetBrains Mono',monospace;font-size:10px;font-weight:600;padding:5px 10px;border-radius:8px;min-width:48px;text-align:center;text-transform:uppercase;letter-spacing:.5px}
    .method.get{background:rgba(0,255,136,.15);color:var(--green);box-shadow:0 0 10px rgba(0,255,136,.1)}
    .method.post{background:rgba(0,212,255,.15);color:var(--blue);box-shadow:0 0 10px rgba(0,212,255,.1)}
    .method.delete{background:rgba(255,68,102,.15);color:var(--red);box-shadow:0 0 10px rgba(255,68,102,.1)}
    .ep-path{font-family:'JetBrains Mono',monospace;font-size:13px;color:var(--text2);flex:1}
    .ep-desc{font-size:12px;color:var(--text2);display:none}
    @media(min-width:600px){.ep-desc{display:block}}
    .ep-arrow{color:var(--text2);font-size:12px;transition:all .3s}
    .ep-header.active .ep-arrow{transform:rotate(180deg);color:var(--accent)}
    .console-bar{display:flex;gap:10px;margin-bottom:14px;flex-wrap:wrap}
    .url-input{flex:1;min-width:150px;background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:12px 16px;color:var(--text);font-family:'JetBrains Mono',monospace;font-size:12px;transition:all .3s}
    .url-input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 20px rgba(0,212,255,.15)}
    .send-btn{background:linear-gradient(135deg,var(--accent),var(--purple));color:#fff;border:none;padding:12px 28px;border-radius:12px;font-weight:600;font-size:13px;cursor:pointer;transition:all .3s cubic-bezier(.4,0,.2,1);box-shadow:0 4px 15px rgba(0,212,255,.3)}
    .send-btn:hover{transform:translateY(-2px);box-shadow:0 6px 25px rgba(0,212,255,.4)}
    .send-btn:active{transform:translateY(0)}
    @media(max-width:600px){.console-bar{flex-direction:column}.url-input{min-width:100%}.send-btn{width:100%}}
    .params-row{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
    .param-item{display:flex;align-items:center;gap:8px;background:var(--bg2);padding:8px 14px;border-radius:10px;font-size:12px;border:1px solid var(--border);transition:all .2s}
    .param-item:hover{border-color:var(--accent)}
    .param-item label{color:var(--text2);font-weight:500}
    .param-item input{background:transparent;border:none;color:var(--accent);font-family:'JetBrains Mono',monospace;font-size:12px;width:70px}
    .param-item input:focus{outline:none}
    .res-header{display:flex;align-items:center;gap:12px;margin-bottom:10px;font-size:12px;font-weight:500}
    .res-body{background:var(--bg2);border:1px solid var(--border);border-radius:12px;padding:16px;max-height:350px;overflow:auto;font-family:'JetBrains Mono',monospace;font-size:12px;line-height:1.7;white-space:pre-wrap;word-break:break-all}
    .res-body .k{color:var(--purple)}
    .res-body .s{color:var(--green)}
    .res-body .n{color:var(--accent)}
    .res-body .b{color:var(--yellow)}
    .res-body .null{color:var(--text2)}
    .status{padding:4px 10px;border-radius:6px;font-size:11px;font-weight:600;font-family:'JetBrains Mono',monospace}
    .status.s2{background:rgba(0,255,136,.15);color:var(--green)}
    .status.s4,.status.s5{background:rgba(255,68,102,.15);color:var(--red)}
    footer{text-align:center;padding:40px 16px;margin-top:40px;border-top:1px solid var(--border);color:var(--text2);font-size:14px;background:var(--glass);backdrop-filter:blur(10px)}
    footer a{color:var(--accent);text-decoration:none;transition:all .2s}
    footer a:hover{color:var(--purple);text-decoration:underline}
    footer .copy{font-size:12px;margin-top:10px;opacity:.6}
    .loading{display:inline-block;width:16px;height:16px;border:2px solid var(--border);border-top-color:var(--accent);border-radius:50%;animation:spin .6s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    ::-webkit-scrollbar{width:8px;height:8px}
    ::-webkit-scrollbar-track{background:var(--bg);border-radius:4px}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px}
    ::-webkit-scrollbar-thumb:hover{background:var(--text2)}
    @media(min-width:1024px){.container{padding:32px 40px}.api-section{border-radius:24px}.api-header{padding:20px 28px}.api-header .name{font-size:17px}.ep-header{padding:16px 28px}.ep-path{font-size:14px}.ep-console{padding:24px 28px}.url-input{font-size:13px;padding:14px 18px}.send-btn{padding:14px 32px;font-size:14px}.res-body{font-size:13px;max-height:400px;padding:20px}.param-item{padding:10px 16px}.param-item input{width:80px}}
    @media(min-width:1400px){.container{max-width:1600px;padding:40px 60px}h1{font-size:48px}.subtitle{font-size:16px}.api-header .name{font-size:18px}.ep-path{font-size:15px}}
  </style>
</head>
<body>
<div class="container">
  <header>
    <h1><i class="fas fa-play-circle"></i> Drama APIs Explorer</h1>
    <p class="subtitle"><i class="fas fa-code"></i> Interactive documentation for 15 drama streaming APIs</p>
    <p class="notice"><i class="fas fa-exclamation-triangle"></i> API dapat berubah sewaktu-waktu. Join group untuk info terbaru!</p>
    <a href="https://t.me/nanomilkiss" target="_blank" class="tg-btn">
      <i class="fab fa-telegram"></i>
      Join Telegram
    </a>
  </header>

  <div class="api-tabs" id="apiTabs"></div>

  <div class="layout" id="layout"></div>
  <footer>
    <p>Made with <i class="fas fa-heart" style="color:var(--red)"></i> by <a href="https://t.me/nanomilkiss" target="_blank"><i class="fab fa-telegram"></i> @nanomilkiss</a></p>
    <p class="copy"><i class="far fa-copyright"></i> 2026 Drama APIs Explorer</p>
  </footer>
</div>

<script>
const H=location.hostname,P=`${location.protocol}//${H}/api`;
const APIS=[
  {n:'RadReel',k:'radreel',p:3027,e:[
    {m:'GET',u:'/health',d:'Health check + supported languages'},
    {m:'GET',u:'/api/v1/home',d:'Homepage drama',q:{lang:'id',tab:'17',page:'1',limit:'10'}},
    {m:'GET',u:'/api/v1/search',d:'Cari drama',q:{q:'cinta',lang:'id',page:'1'}},
    {m:'GET',u:'/api/v1/rank',d:'Drama ranking',q:{type:'1',page:'1',lang:'id'}},
    {m:'GET',u:'/api/v1/drama/VYmk',d:'Detail drama',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/episodes/VYmk',d:'Episode list + videoFakeId',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/play/VYmk',d:'Video URL langsung',q:{seq:'0'}},
    {m:'GET',u:'/api/v1/recommend',d:'For you recommended'}
  ]},
  {n:'FlickReels',k:'flick',p:3000,e:[
    {m:'GET',u:'/home',d:'Home navigation drama',q:{page:'1',page_size:'10',lang:'6'}},
    {m:'GET',u:'/latest',d:'Drama terbaru',q:{page:'1',page_size:'10',lang:'6'}},
    {m:'GET',u:'/exchange',d:'Exchange drama'},
    {m:'GET',u:'/search',d:'Cari drama',q:{keyword:'cinta',lang:'6'}},
    {m:'GET',u:'/nexthome',d:'Next home page'},
    {m:'GET',u:'/trending',d:'Trending drama'},
    {m:'GET',u:'/drama/3108',d:'Detail drama + episode',q:{lang:'6'}}
  ]},
  {n:'DotDrama',k:'dotdrama',p:3001,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/drama/list',d:'Daftar semua drama',q:{page:'1',limit:'10',lang:'id'}},
    {m:'GET',u:'/api/collections',d:'Drama collections'},
    {m:'GET',u:'/api/categories',d:'Drama categories'},
    {m:'GET',u:'/api/drama/44',d:'Detail drama'},
    {m:'GET',u:'/api/search',d:'Cari drama',q:{q:'cinta',lang:'id'}},
    {m:'GET',u:'/api/v1/info',d:'API info'},
    {m:'GET',u:'/api/languages',d:'Supported languages'},
    {m:'GET',u:'/api/cache/stats',d:'Cache statistics'}
  ]},
  {n:'NetShort',k:'netshort',p:3028,e:[
    {m:'GET',u:'/api/drama/find',d:'Search drama',q:{q:'love',page:'1',size:'10'}},
    {m:'GET',u:'/api/drama/discover',d:'Discover drama'},
    {m:'GET',u:'/api/drama/explore',d:'Homepage content',q:{offset:'0',limit:'10'}},
    {m:'GET',u:'/api/drama/categories',d:'Drama categories'},
    {m:'GET',u:'/api/drama/meta/tags',d:'Meta tags'},
    {m:'GET',u:'/api/drama/meta/regions',d:'Meta regions'},
    {m:'GET',u:'/api/drama/meta/audio',d:'Meta audio'},
    {m:'GET',u:'/api/drama/config/constants',d:'Config constants'},
    {m:'GET',u:'/api/drama/info/1994614483446874114',d:'Detail drama'},
    {m:'GET',u:'/api/drama/view/1994614483446874114/ep/1',d:'Watch episode'}
  ]},
  {n:'ShortMax',k:'shortmax',p:3003,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/v1/languages',d:'Supported languages'},
    {m:'GET',u:'/api/v1/home',d:'Drama featured/populer',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/search',d:'Cari drama',q:{q:'love',lang:'id',page:'1'}},
    {m:'GET',u:'/api/v1/episodes/748119',d:'Episode list',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/play/748119',d:'Video URL',q:{lang:'id',ep:'1'}},
    {m:'GET',u:'/api/v1/batch/748119',d:'Batch info',q:{lang:'id'}}
  ]},
  {n:'StarShort',k:'starshort',p:3006,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/v1/languages',d:'Supported languages'},
    {m:'GET',u:'/api/v1/home',d:'Homepage drama',q:{lang:'4'}},
    {m:'GET',u:'/api/v1/search',d:'Cari drama',q:{q:'cinta',lang:'4'}},
    {m:'GET',u:'/api/v1/drama/myn',d:'Detail drama',q:{lang:'4'}},
    {m:'GET',u:'/api/v1/episodes/myn',d:'Episode list',q:{lang:'4'}},
    {m:'GET',u:'/api/v1/play/myn',d:'Video URL',q:{ep:'1',lang:'4'}},
    {m:'GET',u:'/api/v1/rank',d:'Drama ranking',q:{lang:'4'}},
    {m:'GET',u:'/api/v1/unlock/myn',d:'Unlock drama',q:{lang:'4'}}
  ]},
  {n:'StardustTV',k:'stardusttv',p:3005,e:[
    {m:'GET',u:'/home',d:'Homepage drama'},
    {m:'GET',u:'/search',d:'Cari drama',q:{q:'love'}},
    {m:'GET',u:'/episodes/14411',d:'Episode list + video URL'}
  ]},
  {n:'DramaDash',k:'dramadash',p:3007,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/home',d:'Homepage: banner, trending, drama'},
    {m:'GET',u:'/api/tabs/1',d:'Drama by tab ID'},
    {m:'GET',u:'/api/drama/44',d:'Detail drama + episodes'},
    {m:'GET',u:'/api/search/cinta',d:'Search drama'},
    {m:'GET',u:'/api/episode/44/1',d:'Episode video URL'},
    {m:'GET',u:'/api/cache/stats',d:'Cache statistics'},
    {m:'GET',u:'/api/endpoints',d:'List all endpoints'}
  ]},
  {n:'DramaWave',k:'dramawave',p:3015,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/v1/languages',d:'Supported languages'},
    {m:'GET',u:'/api/v1/search/hot',d:'Hot search keywords',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/search',d:'Cari drama',q:{q:'love',lang:'id',page:'1'}},
    {m:'GET',u:'/api/v1/feed/popular',d:'Feed drama populer',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/feed/free',d:'Feed drama gratis',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/feed/new',d:'Feed drama baru',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/dramas/xuyr3DtXPt',d:'Detail drama',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/dramas/xuyr3DtXPt/play/1',d:'Video URL (unlocked)',q:{lang:'id'}}
  ]},
  {n:'Dramabox',k:'dramabox',p:3002,e:[
    {m:'GET',u:'/api/foryou/1',d:'For You - drama rekomendasi',q:{lang:'in'}},
    {m:'GET',u:'/api/new/1',d:'Drama terbaru',q:{lang:'in'}},
    {m:'GET',u:'/api/suggest/cinta',d:'Suggest keyword',q:{lang:'in'}},
    {m:'GET',u:'/api/rank/1',d:'Drama ranking',q:{lang:'in'}},
    {m:'GET',u:'/api/classify',d:'Classify drama',q:{lang:'in'}},
    {m:'GET',u:'/api/chapters/42000003547',d:'Chapter list',q:{lang:'in'}},
    {m:'GET',u:'/api/drama/42000001693',d:'Detail drama',q:{lang:'in'}},
    {m:'GET',u:'/api/watch/player',d:'Video URL',q:{bookId:'42000003547',index:'1',lang:'in'}},
    {m:'GET',u:'/api/monitor',d:'Monitor status'}
  ]},
  {n:'Viglo',k:'viglo',p:3008,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/v1/home',d:'Homepage drama',q:{lang:'id',limit:'20'}},
    {m:'GET',u:'/api/v1/search',d:'Cari drama',q:{q:'cinta',lang:'id'}},
    {m:'GET',u:'/api/v1/rank',d:'Drama ranking',q:{lang:'id'}},
    {m:'GET',u:'/api/v1/program/15000794',d:'Program detail'},
    {m:'GET',u:'/api/v1/program/15000794/seasons',d:'Program seasons'},
    {m:'GET',u:'/api/v1/pool/status',d:'Pool status (accounts & coins)'},
    {m:'GET',u:'/api/v1/pool/accounts',d:'Pool accounts list'},
    {m:'GET',u:'/api/v1/pool/play',d:'Play video (bypass)',q:{seasonId:'15000761',ep:'1'}},
    {m:'GET',u:'/api/v1/proxy/status',d:'Proxy status'}
  ]},
  {n:'Micro',k:'micro',p:3031,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/v1/list',d:'List drama',q:{lang:'id',page:'1',limit:'10'}},
    {m:'GET',u:'/api/v1/search',d:'Search drama',q:{q:'love',lang:'en',limit:'10'}},
    {m:'GET',u:'/api/v1/drama/2008052547485241345',d:'Detail drama'}
  ]},
  {n:'Melolo',k:'melolo',p:3009,e:[
    {m:'GET',u:'/health',d:'Health check'},
    {m:'GET',u:'/api/v1/home',d:'Homepage drama Indonesia (pagination)',q:{offset:'0',count:'18',lang:'id'}},
    {m:'GET',u:'/api/v1/search',d:'Cari drama',q:{q:'judi',offset:'0',count:'10'}},
    {m:'GET',u:'/api/v1/detail/7582204628406651909',d:'Detail series + episodes'},
    {m:'GET',u:'/api/v1/video/7582232554074278965',d:'Video URL streaming'}
  ]},
  {n:'MeloShort',k:'meloshort',p:3032,e:[
    {m:'GET',u:'/api/home',d:'Drama list (all)',q:{page:'1',page_size:'20'}},
    {m:'GET',u:'/api/topn',d:'Top picks/recommended',q:{page:'1',page_size:'20'}},
    {m:'GET',u:'/api/ranking',d:'Ranking drama',q:{page:'1',page_size:'20'}},
    {m:'GET',u:'/api/recommend',d:'Recommendations',q:{page:'1',page_size:'20'}},
    {m:'GET',u:'/api/search',d:'Search drama',q:{q:'cinta'}},
    {m:'GET',u:'/api/drama/68104df23a6ac6589c4be9b8',d:'Drama detail + chapters'},
    {m:'GET',u:'/api/play/68104df23a6ac6589c4be9b8/3',d:'Play by episode number (bypass)'},
    {m:'GET',u:'/api/episode/68104df23a6ac6589c4be9b8/68104df73a6ac6589c4be9bb',d:'Play by chapter ID (bypass)'}
  ]},
  {n:'Reelife',k:'reelife',p:4234,e:[
    {m:'GET',u:'/v1/init',d:'Initialize device'},
    {m:'GET',u:'/v1/home',d:'Home dramas (14/page)',q:{page:'1'}},
    {m:'GET',u:'/v1/browse',d:'Browse dramas (15/page)',q:{page:'1',letter:'a'}},
    {m:'GET',u:'/v1/search',d:'Search drama',q:{q:'cinta',page:'1'}},
    {m:'GET',u:'/v1/suggest',d:'Search autocomplete',q:{q:'love'}},
    {m:'GET',u:'/v1/rank',d:'All rankings'},
    {m:'GET',u:'/v1/book/41000116901',d:'Drama detail'},
    {m:'GET',u:'/v1/book/41000116901/chapters',d:'Chapter list'},
    {m:'GET',u:'/v1/book/41000116901/episode/1',d:'Episode detail'},
    {m:'GET',u:'/v1/play/41000116901/1',d:'Video URL'}
  ]},
  {n:'HiShort',k:'hishort',p:3020,e:[
    {m:'GET',u:'/api/v1/tabs',d:'Tab list'},
    {m:'GET',u:'/api/v1/modules',d:'Module list',q:{tab:'4'}},
    {m:'GET',u:'/api/v1/home',d:'Home videos',q:{module:'12',page:'1'}},
    {m:'GET',u:'/api/v1/search',d:'Search videos',q:{q:'love'}},
    {m:'GET',u:'/api/v1/search/recommend',d:'Search recommendations'},
    {m:'GET',u:'/api/v1/video/626',d:'Video details + episode URL',q:{ep:'1'}},
    {m:'GET',u:'/api/v1/video/626/playlist',d:'Episode list'}
  ]}
];

let openApi=-1,openEp={};

function render(){
  document.getElementById('layout').innerHTML=APIS.map((a,ai)=>`
    <div class="api-section">
      <div class="api-header${openApi===ai?' active':''}" onclick="toggleApi(${ai})">
        <span class="dot"></span>
        <span class="name"><i class="fas fa-server"></i> ${a.n}</span>
        <span class="arrow"><i class="fas fa-chevron-down"></i></span>
      </div>
      <div class="api-endpoints${openApi===ai?' show':''}">
        ${a.e.map((e,ei)=>`
          <div class="ep-item">
            <div class="ep-header${openEp[ai]===ei?' active':''}" onclick="toggleEp(${ai},${ei})">
              <span class="method ${e.m.toLowerCase()}">${e.m}</span>
              <span class="ep-path">${e.u}</span>
              <span class="ep-desc">${e.d}</span>
              <span class="ep-arrow"><i class="fas fa-chevron-down"></i></span>
            </div>
            <div class="ep-console${openEp[ai]===ei?' show':''}" id="console_${ai}_${ei}">
              ${renderConsole(a,e,ai,ei)}
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderConsole(a,e,ai,ei){
  const q=e.q||{};
  const keys=Object.keys(q);
  const params=keys.length?`<div class="params-row">${keys.map(k=>`<div class="param-item"><label>${k}:</label><input id="p_${ai}_${ei}_${k}" value="${q[k]}" onchange="updEpUrl(${ai},${ei})"></div>`).join('')}</div>`:'';
  return `
    ${params}
    <div class="console-bar">
      <input class="url-input" id="url_${ai}_${ei}" value="${getUrl(a,e,ai,ei)}" readonly>
      <button class="send-btn" onclick="sendReq(${ai},${ei})"><i class="fas fa-paper-plane"></i> Send</button>
    </div>
    <div class="res-header"><span><i class="fas fa-terminal"></i> Response</span><span class="status" id="stat_${ai}_${ei}"></span><span id="time_${ai}_${ei}"></span></div>
    <div class="res-body" id="res_${ai}_${ei}">// Click Send to test</div>
  `;
}

function getUrl(a,e,ai,ei){
  const q=e.q||{};
  const qp=Object.keys(q).map(k=>{
    const el=document.getElementById(`p_${ai}_${ei}_${k}`);
    return `${k}=${encodeURIComponent(el?el.value:q[k])}`;
  });
  let url=`${P}/${a.k}${e.u}`;
  if(qp.length)url+='?'+qp.join('&');
  return url;
}

function updEpUrl(ai,ei){
  const a=APIS[ai],e=a.e[ei];
  document.getElementById(`url_${ai}_${ei}`).value=getUrl(a,e,ai,ei);
}

function toggleApi(i){openApi=openApi===i?-1:i;render();}
function toggleEp(ai,ei){openEp[ai]=openEp[ai]===ei?-1:ei;render();}

async function sendReq(ai,ei){
  const a=APIS[ai],e=a.e[ei];
  const url=document.getElementById(`url_${ai}_${ei}`).value;
  const res=document.getElementById(`res_${ai}_${ei}`);
  const stat=document.getElementById(`stat_${ai}_${ei}`);
  const time=document.getElementById(`time_${ai}_${ei}`);
  res.innerHTML='<span class="loading"></span> Loading...';
  stat.textContent='';stat.className='status';time.textContent='';
  const t0=Date.now();
  try{
    const r=await fetch(url,{method:e.m,headers:{'Content-Type':'application/json'}});
    const ms=Date.now()-t0;
    const txt=await r.text();
    let d;try{d=JSON.parse(txt)}catch{d=txt}
    stat.textContent=r.status;stat.className=`status s${Math.floor(r.status/100)}`;
    time.textContent=`${ms}ms`;
    res.innerHTML=typeof d==='object'?hl(JSON.stringify(d,null,2)):d;
  }catch(err){
    stat.textContent='Error';stat.className='status s5';
    time.textContent=`${Date.now()-t0}ms`;res.textContent=err.message;
  }
}

function hl(j){
  return j.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,m=>{
    let c='n';if(/^"/.test(m))c=/:$/.test(m)?'k':'s';
    else if(/true|false/.test(m))c='b';else if(/null/.test(m))c='null';
    return `<span class="${c}">${m}</span>`;
  });
}
render();
</script>
</body>
</html>
