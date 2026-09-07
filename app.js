(function(){
  'use strict';
  const $=(s)=>document.querySelector(s), $$=(s)=>[...document.querySelectorAll(s)];
  const sections=[
    ['home','홈','⌂'],['pos','9품사','1'],['identity','품사 vs 성분','2'],['components','문장 성분','3'],['skeleton','문장 뼈대','4'],['structure','홑·겹문장','5'],['compound','겹문장','6'],['game','땅따먹기','★']
  ];
  const state={teacher:false,current:'home',done:new Set(JSON.parse(localStorage.getItem('sentenceLabDone')||'[]'))};
  const save=()=>localStorage.setItem('sentenceLabDone',JSON.stringify([...state.done]));
  function markDone(id){if(id!=='home'){state.done.add(id);save();updateProgress();}}
  function updateProgress(){const total=sections.length-1;const pct=Math.round((state.done.size/total)*100);$('#progressText').textContent=pct+'%';$('#progressFill').style.width=pct+'%';}
  function go(id){state.current=id;$$('.section').forEach(s=>s.classList.toggle('active',s.dataset.section===id));$$('[data-nav]').forEach(b=>b.classList.toggle('active',b.dataset.nav===id));window.scrollTo({top:0,behavior:'smooth'});if(id!=='home')markDone(id)}
  function navRender(){
    $('#sideNav').innerHTML=sections.map(([id,label,icon])=>`<button class="nav-btn ${id==='home'?'active':''}" data-nav="${id}"><span class="nav-num">${icon}</span>${label}</button>`).join('');
    $('#mobileNav').innerHTML=sections.map(([id,label])=>`<button class="mnav ${id==='home'?'active':''}" data-nav="${id}">${label}</button>`).join('');
    $$('[data-nav]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.nav)));
  }
  const modules=[
    ['pos','🧩','9품사 빠른 복습','단어의 정체를 분류합니다.'],['identity','🔁','품사 vs 문장 성분','정체와 역할을 구분합니다.'],['components','🧱','문장 성분 분석','주성분·부속 성분·독립 성분을 찾습니다.'],['skeleton','🦴','문장 뼈대','서술어를 중심으로 기본 구조를 잡습니다.'],['structure','🔍','홑문장·겹문장','주어·서술어 관계의 횟수를 셉니다.'],['compound','🧬','이어진문장·안은문장','겹문장의 결합 방식을 분석합니다.']
  ];
  $('#moduleGrid').innerHTML=modules.map(m=>`<button class="card module-card" data-go="${m[0]}" style="text-align:left;border:1px solid var(--line)"><div class="icon">${m[1]}</div><h3>${m[2]}</h3><p>${m[3]}</p><div class="go">열기 →</div></button>`).join('');
  $$('[data-go]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.go)));
  navRender();updateProgress();
  $('#teacherModeBtn').addEventListener('click',()=>{state.teacher=!state.teacher;document.body.classList.toggle('teacher-mode',state.teacher);$('#teacherModeBtn').classList.toggle('active',state.teacher);$('#teacherModeBtn').textContent=state.teacher?'교사 모드 ON':'교사 모드'});
  $('#resetBtn').addEventListener('click',()=>{if(confirm('학습 진행 기록을 초기화할까요?')){state.done.clear();save();updateProgress();}});

  const posQs=[
    {w:'책',h:'사물의 이름을 나타냄',a:'명사'},{w:'우리',h:'사람이나 사물을 대신 가리킴',a:'대명사'},{w:'둘째',h:'수량이나 순서를 나타냄',a:'수사'},
    {w:'웃다',h:'움직임을 나타내며 형태가 변함',a:'동사'},{w:'맑다',h:'상태나 성질을 나타내며 형태가 변함',a:'형용사'},{w:'새',h:'체언 앞에서 체언을 꾸밈',a:'관형사'},
    {w:'아주',h:'주로 용언을 꾸밈',a:'부사'},{w:'을/를',h:'다른 말과의 관계를 나타냄',a:'조사'},{w:'어머',h:'감정이나 부름·응답 등을 독립적으로 나타냄',a:'감탄사'}
  ];
  const posChoices=['명사','대명사','수사','동사','형용사','관형사','부사','조사','감탄사']; let posIdx=0;
  function renderPos(){const q=posQs[posIdx];$('#posWord').textContent=q.w;$('#posHint').textContent=q.h;$('#posFeedback').className='feedback';$('#posFeedback').textContent='';$('#posChoices').innerHTML=posChoices.map(c=>`<button class="choice" data-pos="${c}">${c}</button>`).join('');$$('[data-pos]').forEach(b=>b.onclick=()=>{const ok=b.dataset.pos===q.a;$$('[data-pos]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');const correct=$(`[data-pos="${q.a}"]`);if(correct)correct.classList.add('correct');$('#posFeedback').className='feedback show '+(ok?'ok':'no');$('#posFeedback').textContent=ok?'정답입니다. 단어 자체의 갈래를 찾았습니다.':`정답은 ${q.a}입니다.`;});}
  $('#posNext').onclick=()=>{posIdx=(posIdx+1)%posQs.length;renderPos()};renderPos();

  const idExamples=[
    ['동생이 새 옷을 입었다.','새','관형사','관형어'],['예쁜 꽃이 피었다.','예쁜','형용사','관형어'],['꽃이 예쁘다.','예쁘다','형용사','서술어'],['꽃이 예쁘게 피었다.','예쁘게','형용사','부사어']
  ];
  $('#identityExamples').innerHTML=idExamples.map(e=>`<div class="pair-line"><div><strong>${e[0]}</strong><div class="tiny">‘${e[1]}’</div></div><div class="pair-badges"><span class="badge">품사 ${e[2]}</span><span class="badge s">성분 ${e[3]}</span></div></div>`).join('');
  const idQs=[
    {s:'동생이 새 옷을 입었다.',t:'새',p:'관형사',c:'관형어'},{s:'예쁜 꽃이 피었다.',t:'예쁜',p:'형용사',c:'관형어'},{s:'꽃이 예쁘다.',t:'예쁘다',p:'형용사',c:'서술어'},{s:'꽃이 예쁘게 피었다.',t:'예쁘게',p:'형용사',c:'부사어'},{s:'경식아, 저 강아지 정말 귀엽다.',t:'경식아',p:'명사+조사',c:'독립어'}
  ]; let idIdx=0,idP=null,idC=null;
  const idPos=['관형사','형용사','명사+조사','부사']; const idComp=['관형어','서술어','부사어','독립어'];
  function renderId(){const q=idQs[idIdx];idP=idC=null;$('#idSentence').innerHTML=q.s.replace(q.t,`<mark style="background:#fff1a8;padding:0 3px;border-radius:5px">${q.t}</mark>`);$('#idTarget').textContent=`‘${q.t}’의 품사와 문장 성분을 각각 고르세요.`;$('#idFeedback').className='feedback';$('#idPosChoices').innerHTML=idPos.map(x=>`<button class="choice" data-idp="${x}">${x}</button>`).join('');$('#idCompChoices').innerHTML=idComp.map(x=>`<button class="choice" data-idc="${x}">${x}</button>`).join('');$$('[data-idp]').forEach(b=>b.onclick=()=>{$$('[data-idp]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');idP=b.dataset.idp});$$('[data-idc]').forEach(b=>b.onclick=()=>{$$('[data-idc]').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');idC=b.dataset.idc});}
  $('#idCheck').onclick=()=>{const q=idQs[idIdx];if(!idP||!idC){$('#idFeedback').className='feedback show no';$('#idFeedback').textContent='두 항목을 모두 골라 주세요.';return}const ok=idP===q.p&&idC===q.c;$('#idFeedback').className='feedback show '+(ok?'ok':'no');$('#idFeedback').textContent=ok?'정답입니다. 품사는 단어의 갈래, 문장 성분은 문장 안의 역할입니다.':`정답은 품사 ${q.p}, 문장 성분 ${q.c}입니다.`};
  $('#idNext').onclick=()=>{idIdx=(idIdx+1)%idQs.length;renderId()};renderId();

  const compQs=[
    {s:'선호가 숙제를 끝냈다.',t:[['선호가','주어'],['숙제를','목적어'],['끝냈다','서술어']]},
    {s:'소미가 회장이 되었다.',t:[['소미가','주어'],['회장이','보어'],['되었다','서술어']]},
    {s:'진우는 막내가 아니다.',t:[['진우는','주어'],['막내가','보어'],['아니다','서술어']]},
    {s:'찬미가 새 모자를 썼다.',t:[['찬미가','주어'],['새','관형어'],['모자를','목적어'],['썼다','서술어']]},
    {s:'개미가 먹이를 부지런히 나른다.',t:[['개미가','주어'],['먹이를','목적어'],['부지런히','부사어'],['나른다','서술어']]},
    {s:'경식아, 저 강아지 정말 귀엽다.',t:[['경식아,','독립어'],['저','관형어'],['강아지','주어'],['정말','부사어'],['귀엽다','서술어']]}
  ];
  const compLabels=['주어','서술어','목적어','보어','관형어','부사어','독립어']; let compIdx=0,activeToken=null,assign=[];
  const tagClass={주어:'subject',서술어:'predicate',목적어:'object',보어:'complement',관형어:'adnominal',부사어:'adverbial',독립어:'independent'};
  function renderComp(){const q=compQs[compIdx];assign=Array(q.t.length).fill(null);activeToken=null;$('#compSentence').textContent=q.s;$('#compTokens').innerHTML=q.t.map((x,i)=>`<button class="token" data-ti="${i}">${x[0]}<div class="tag" id="tag${i}">미지정</div></button>`).join('');$('#compLabels').innerHTML=compLabels.map(l=>`<button class="choice" data-cl="${l}">${l}</button>`).join('');$('#compFeedback').className='feedback';$$('[data-ti]').forEach(b=>b.onclick=()=>{$$('[data-ti]').forEach(x=>x.classList.remove('tagged'));b.classList.add('tagged');activeToken=+b.dataset.ti});$$('[data-cl]').forEach(b=>b.onclick=()=>{if(activeToken===null){$('#compFeedback').className='feedback show no';$('#compFeedback').textContent='먼저 어절을 하나 선택하세요.';return}assign[activeToken]=b.dataset.cl;const tag=$(`#tag${activeToken}`);tag.textContent=b.dataset.cl;tag.className='tag '+tagClass[b.dataset.cl];});}
  $('#compCheck').onclick=()=>{const q=compQs[compIdx];if(assign.some(x=>!x)){ $('#compFeedback').className='feedback show no';$('#compFeedback').textContent='아직 지정하지 않은 어절이 있습니다.';return;}const wrong=assign.map((x,i)=>x!==q.t[i][1]).filter(Boolean).length;$('#compFeedback').className='feedback show '+(wrong?'no':'ok');$('#compFeedback').textContent=wrong?`${wrong}개를 다시 확인해 보세요. 서술어를 먼저 찾으면 쉽습니다.`:'모두 맞았습니다. 문장의 역할을 정확히 찾았습니다.';};
  $('#compReveal').onclick=()=>{const q=compQs[compIdx];q.t.forEach((x,i)=>{assign[i]=x[1];const tag=$(`#tag${i}`);tag.textContent=x[1];tag.className='tag '+tagClass[x[1]];});$('#compFeedback').className='feedback show ok';$('#compFeedback').textContent='정답을 표시했습니다.'};
  $('#compNext').onclick=()=>{compIdx=(compIdx+1)%compQs.length;renderComp()};renderComp();

  const skQs=[{s:'꽃이 피었다.',a:'어찌하다'},{s:'밤바람이 차갑다.',a:'어떠하다'},{s:'나는 중학생이다.',a:'무엇이다'},{s:'새가 모이를 먹는다.',a:'어찌하다'},{s:'해미는 초등학생이 아니다.',a:'어떠하다'}];let skIdx=0;
  function renderSk(){const q=skQs[skIdx];$('#skSentence').textContent=q.s;$('#skFeedback').className='feedback';$('#skChoices').innerHTML=['어찌하다','어떠하다','무엇이다'].map(c=>`<button class="choice" data-sk="${c}">${c}</button>`).join('');$$('[data-sk]').forEach(b=>b.onclick=()=>{const ok=b.dataset.sk===q.a;$$('[data-sk]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');const correct=$$('[data-sk]').find(x=>x.dataset.sk===q.a);if(correct)correct.classList.add('correct');$('#skFeedback').className='feedback show '+(ok?'ok':'no');$('#skFeedback').textContent=ok?'정답입니다. 서술어의 성격을 잘 찾았습니다.':`정답은 ${q.a}입니다.`;});}
  $('#skNext').onclick=()=>{skIdx=(skIdx+1)%skQs.length;renderSk()};renderSk();

  const stQs=[
    {s:'제비꽃은 정말 예쁘다.',a:'홑문장',pairs:[['제비꽃은','예쁘다']]},
    {s:'나는 어제 극장에서 친구를 만났다.',a:'홑문장',pairs:[['나는','만났다']]},
    {s:'지아는 비가 그치기를 간절히 바랐다.',a:'겹문장',pairs:[['지아는','바랐다'],['비가','그치기']]},
    {s:'정우는 영화를 보고 희수는 책을 읽는다.',a:'겹문장',pairs:[['정우는','보고'],['희수는','읽는다']]},
    {s:'나는 동생이 어지른 방을 치웠다.',a:'겹문장',pairs:[['나는','치웠다'],['동생이','어지른']]}
  ];let stIdx=0;
  function renderSt(){const q=stQs[stIdx];$('#stSentence').textContent=q.s;$('#pairLines').innerHTML='';$('#stFeedback').className='feedback';$('#stChoices').innerHTML=['홑문장','겹문장'].map(c=>`<button class="choice" data-st="${c}">${c}</button>`).join('');$$('[data-st]').forEach(b=>b.onclick=()=>{const ok=b.dataset.st===q.a;$$('[data-st]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');const cor=$$('[data-st]').find(x=>x.dataset.st===q.a);if(cor)cor.classList.add('correct');$('#stFeedback').className='feedback show '+(ok?'ok':'no');$('#stFeedback').textContent=ok?'정답입니다. 주어·서술어 관계의 횟수가 기준입니다.':`정답은 ${q.a}입니다. 짝 보기로 확인해 보세요.`;});}
  $('#stPairs').onclick=()=>{const q=stQs[stIdx];$('#pairLines').innerHTML=q.pairs.map((p,i)=>`<div class="pair-line"><strong>${i+1}번째 관계</strong><div class="pair-badges"><span class="badge s">주어 ${p[0]}</span><span class="badge p">서술어 ${p[1]}</span></div></div>`).join('')};
  $('#stNext').onclick=()=>{stIdx=(stIdx+1)%stQs.length;renderSt()};renderSt();

  const cpQs=[
    {s:'시아는 그림을 그리고 찬호는 글을 쓴다.',a:'대등하게 이어진문장',h:'두 사실을 나란히 나열'},
    {s:'공원에 놀이기구가 많아서 동생의 기분이 좋다.',a:'종속적으로 이어진문장',h:'앞 절이 뒤 절의 원인'},
    {s:'나는 상한 음식을 먹고 배탈이 났다.',a:'종속적으로 이어진문장',h:'‘-고’만 보고 대등하다고 판단하면 안 됨'},
    {s:'나는 그가 오기를 기다렸다.',a:'명사절을 가진 안은문장',h:'‘그가 오기’가 목적어의 기능'},
    {s:'이것은 내가 읽은 소설책이다.',a:'관형절을 가진 안은문장',h:'‘내가 읽은’이 ‘소설책’을 꾸밈'},
    {s:'빙수는 이가 시리도록 차가웠다.',a:'부사절을 가진 안은문장',h:'‘이가 시리도록’이 서술어를 꾸밈'},
    {s:'토끼는 앞발이 짧다.',a:'서술절을 가진 안은문장',h:'‘앞발이 짧다’가 전체 주어의 상태를 풀이'},
    {s:'진호는 “저도 이제 중학생이에요.”라고 말하였다.',a:'인용절을 가진 안은문장',h:'다른 사람의 말을 절의 형식으로 인용'}
  ];
  const cpChoices=['대등하게 이어진문장','종속적으로 이어진문장','명사절을 가진 안은문장','관형절을 가진 안은문장','부사절을 가진 안은문장','서술절을 가진 안은문장','인용절을 가진 안은문장'];let cpIdx=0;
  function renderCp(){const q=cpQs[cpIdx];$('#cpSentence').textContent=q.s;$('#cpHint').textContent=q.h;$('#cpFeedback').className='feedback';$('#cpChoices').innerHTML=cpChoices.map(c=>`<button class="choice" data-cp="${c}">${c}</button>`).join('');$$('[data-cp]').forEach(b=>b.onclick=()=>{const ok=b.dataset.cp===q.a;$$('[data-cp]').forEach(x=>x.disabled=true);b.classList.add(ok?'correct':'wrong');const cor=$$('[data-cp]').find(x=>x.dataset.cp===q.a);if(cor)cor.classList.add('correct');$('#cpFeedback').className='feedback show '+(ok?'ok':'no');$('#cpFeedback').textContent=ok?'정답입니다. 결합 방식과 절의 역할을 함께 확인했습니다.':`정답은 ${q.a}입니다.`;});}
  $('#cpNext').onclick=()=>{cpIdx=(cpIdx+1)%cpQs.length;renderCp()};renderCp();

  const gameQs=[
    {type:'품사',q:'‘새’의 품사는?',choices:['관형사','관형어','형용사','부사'],a:'관형사'},
    {type:'품사·성분',q:'“예쁜 꽃이 피었다.”에서 ‘예쁜’의 문장 성분은?',choices:['관형어','관형사','서술어','부사어'],a:'관형어'},
    {type:'문장 성분',q:'“물이 얼음이 되었다.”에서 ‘얼음이’의 문장 성분은?',choices:['보어','목적어','주어','부사어'],a:'보어'},
    {type:'문장 성분',q:'“경미가 과일을 먹는다.”에서 ‘과일을’의 문장 성분은?',choices:['목적어','보어','관형어','독립어'],a:'목적어'},
    {type:'문장 성분',q:'체언을 꾸며 주는 문장 성분은?',choices:['관형어','부사어','독립어','목적어'],a:'관형어'},
    {type:'문장 성분',q:'주로 용언을 꾸며 주는 문장 성분은?',choices:['부사어','관형어','보어','주어'],a:'부사어'},
    {type:'문장 뼈대',q:'“시냇물이 깨끗하다.”의 기본 구조는?',choices:['무엇이 어떠하다','무엇이 어찌하다','무엇이 무엇이다','무엇이 무엇을 어찌하다'],a:'무엇이 어떠하다'},
    {type:'문장 뼈대',q:'“내일이 토요일이다.”의 기본 구조는?',choices:['무엇이 무엇이다','무엇이 어떠하다','무엇이 어찌하다','무엇이 무엇을 어찌하다'],a:'무엇이 무엇이다'},
    {type:'문장의 짜임',q:'주어와 서술어의 관계가 한 번 나타나는 문장은?',choices:['홑문장','겹문장','안은문장','이어진문장'],a:'홑문장'},
    {type:'문장의 짜임',q:'“지아는 비가 그치기를 바랐다.”는?',choices:['겹문장','홑문장','대등하게 이어진문장','독립어'],a:'겹문장'},
    {type:'이어진문장',q:'“시아는 그림을 그리고 찬호는 글을 쓴다.”는?',choices:['대등하게 이어진문장','종속적으로 이어진문장','관형절을 가진 안은문장','홑문장'],a:'대등하게 이어진문장'},
    {type:'이어진문장',q:'“공원에 놀이기구가 많아서 동생의 기분이 좋다.”는?',choices:['종속적으로 이어진문장','대등하게 이어진문장','명사절을 가진 안은문장','홑문장'],a:'종속적으로 이어진문장'},
    {type:'오개념',q:'연결 어미 ‘-고’가 쓰이면 언제나 대등하게 이어진문장이다.',choices:['맞다','아니다'],a:'아니다'},
    {type:'안은문장',q:'“나는 그가 오기를 기다렸다.”의 안긴문장은 어떤 절?',choices:['명사절','관형절','부사절','서술절'],a:'명사절'},
    {type:'안은문장',q:'“이것은 내가 읽은 소설책이다.”의 안긴문장은 어떤 절?',choices:['관형절','명사절','부사절','인용절'],a:'관형절'},
    {type:'안은문장',q:'“빙수는 이가 시리도록 차가웠다.”의 안긴문장은 어떤 절?',choices:['부사절','서술절','관형절','명사절'],a:'부사절'},
    {type:'안은문장',q:'“토끼는 앞발이 짧다.”의 안긴문장은 어떤 절?',choices:['서술절','부사절','명사절','관형절'],a:'서술절'},
    {type:'안은문장',q:'다른 사람의 말을 절의 형식으로 안긴 것은?',choices:['인용절','명사절','관형절','부사절'],a:'인용절'},
    {type:'품사·성분',q:'“꽃이 예쁘다.”에서 ‘예쁘다’의 품사와 문장 성분은?',choices:['형용사·서술어','형용사·관형어','동사·서술어','부사·부사어'],a:'형용사·서술어'},
    {type:'표현 의도',q:'“국제 대회에서 상을 받은 그 영화는 내일 개봉한다.”에서 관형절을 쓴 효과는?',choices:['어떤 영화인지 구체화','두 사실을 단순 나열','원인과 결과 표시','인용 효과'],a:'어떤 영화인지 구체화'}
  ];
  const specials=['한 번 더','꽝','한 번 더','꽝']; let game={turn:'A',claimed:{},scoreA:0,scoreB:0,currentCell:null};
  function buildBoard(){const values=[...Array(20)].map((_,i)=>String(i+1)).concat(specials,['시작']);values.sort(()=>Math.random()-.5);const si=values.indexOf('시작');[values[si],values[24]]=[values[24],values[si]];$('#board').innerHTML=values.map((v,i)=>`<button class="cell ${v==='시작'?'start':specials.includes(v)?'special':''}" data-cell="${i}" data-val="${v}">${v}<span class="owner"></span></button>`).join('');$$('.cell').forEach(c=>c.onclick=()=>handleCell(c));updateGameUI();}
  function updateGameUI(){$('#scoreA').textContent=game.scoreA;$('#scoreB').textContent=game.scoreB;$('#teamA').classList.toggle('active',game.turn==='A');$('#teamB').classList.toggle('active',game.turn==='B');$('#turnText').textContent=`${game.turn}팀 차례입니다.`}
  function nextTurn(extra=false){if(!extra)game.turn=game.turn==='A'?'B':'A';updateGameUI()}
  function handleCell(c){if(c.classList.contains('claim-a')||c.classList.contains('claim-b')||c.classList.contains('neutral')||c.classList.contains('start'))return;const v=c.dataset.val;if(v==='한 번 더'){c.classList.add(game.turn==='A'?'claim-a':'claim-b');c.querySelector('.owner').textContent=game.turn+'팀';game.turn==='A'?game.scoreA++:game.scoreB++;updateGameUI();alert(`${game.turn}팀 한 번 더!`);return}if(v==='꽝'){c.classList.add('neutral');c.querySelector('.owner').textContent='중립';alert('꽝! 이번 차례는 쉬어 갑니다.');nextTurn();return}openGameQuiz(c,+v-1)}
  const modal=$('#quizModal'); let modalQuestion=null;
  function openGameQuiz(cell,idx){game.currentCell=cell;modalQuestion=gameQs[idx%gameQs.length];$('#qType').textContent=modalQuestion.type;$('#qTitle').textContent=`${game.turn}팀 문제`;$('#qText').textContent=modalQuestion.q;$('#qFeedback').className='feedback';$('#qChoices').innerHTML=modalQuestion.choices.map(c=>`<button class="choice" data-qc="${c}">${c}</button>`).join('');$$('[data-qc]').forEach(b=>b.onclick=()=>answerGame(b.dataset.qc));modal.classList.add('show')}
  function answerGame(choice){const ok=choice===modalQuestion.a;$$('[data-qc]').forEach(x=>x.disabled=true);const btn=$$('[data-qc]').find(x=>x.dataset.qc===choice);if(btn)btn.classList.add(ok?'correct':'wrong');const cor=$$('[data-qc]').find(x=>x.dataset.qc===modalQuestion.a);if(cor)cor.classList.add('correct');$('#qFeedback').className='feedback show '+(ok?'ok':'no');$('#qFeedback').textContent=ok?`정답! ${game.turn}팀이 이 칸을 차지합니다.`:`정답은 ‘${modalQuestion.a}’입니다. 이 칸은 중립이 됩니다.`;const c=game.currentCell;if(ok){c.classList.add(game.turn==='A'?'claim-a':'claim-b');c.querySelector('.owner').textContent=game.turn+'팀';game.turn==='A'?game.scoreA++:game.scoreB++;}else{c.classList.add('neutral');c.querySelector('.owner').textContent='중립';}setTimeout(()=>{modal.classList.remove('show');nextTurn();},900)}
  $('#qReveal').onclick=()=>{$('#qFeedback').className='feedback show ok';$('#qFeedback').textContent=`정답: ${modalQuestion?modalQuestion.a:''}`};$('#modalClose').onclick=()=>modal.classList.remove('show');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('show')};
  $('#randomCell').onclick=()=>{const cells=$$('.cell').filter(c=>!c.classList.contains('claim-a')&&!c.classList.contains('claim-b')&&!c.classList.contains('neutral')&&!c.classList.contains('start'));if(!cells.length){alert('남은 칸이 없습니다.');return}handleCell(cells[Math.floor(Math.random()*cells.length)])};
  $('#resetGame').onclick=()=>{game={turn:'A',claimed:{},scoreA:0,scoreB:0,currentCell:null};buildBoard()};buildBoard();
  document.addEventListener('keydown',e=>{if(e.key==='Escape')modal.classList.remove('show')});
})();
