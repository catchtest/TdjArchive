var v=r=>r.attribute===2&&r.result_type===0&&Number.isFinite(r.hit),m={xun:"迅",lie:"烈",shen:"神",mo:"魔",hun:"魂"};var f=r=>String(r??"").replace(/炎系/g,"火系").replace(/冰凍/g,"凍結").replace(/[＋－＝％～×÷−]/g,o=>({"＋":"+","－":"-","＝":"=","％":"%","～":"~","×":"*","÷":"/","−":"-"})[o]).replace(/[,;:!?()]/g,o=>({",":"，",";":"；",":":"：","!":"！","?":"？","(":"（",")":"）"})[o]);function u(r){let o=r.effect_formula||{};if(o.kind==="no_effect"||o.actual_effect===!1)return null;if(v(r))return{name:"凍結",base:r.hit,freeze:!0,souls:["hun"],available:!0};let p;return o.kind==="ailment"?p=r.other_type===2&&r.other_effect===8?"地縛":{8:"中毒",9:"麻痺",10:"封咒",11:"地縛"}[r.result_effect]:o.power_role==="attached_status_pool"&&(p={3:"麻痺",4:"中毒",5:"封咒"}[r.other_effect]),p?{name:p,base:r.additional_hit,freeze:!1,souls:(r.spirit_additions||[]).filter(i=>i.type!==-1).map(i=>i.spirit),available:Number.isInteger(r.attribute)&&r.attribute>=0&&r.attribute<=5}:null}function j({data:r,main:o,header:p,esc:i,image:$,link:h}){let n=(d,s,t)=>`<section class="formula-section" id="${d}"><h2>${s}</h2>${t}</section>`,e=d=>`<p class="formula-equation">${d}</p>`,c=d=>`<a class="text-link" href="${h("skills",{detail:"skill:"+d})}" data-open="skill:${d}">${i(r.skills[d].name)}</a>`;function b(){return`<details><summary>各技能的五魂修正基準</summary><div class="table-scroll"><table><thead><tr><th>技能</th><th>目標五魂不增減的範圍</th><th>影響項目</th></tr></thead><tbody>${r.skills.filter(s=>(s.player_usable||s.enemy_users.length)&&s.spirit_additions.some(t=>t.type!==-1)&&u(s)?.available!==!1&&([0,1,4].includes(s.result_type)||s.result_type===3&&s.result_effect<=4||s.other_type===0||s.other_type===1&&[3,4,5].includes(s.other_effect)||s.other_type===2&&s.other_effect===8)).map(s=>`<tr><td>${c(s.id)}</td><td>${s.spirit_additions.filter(t=>t.type!==-1).map(t=>`${m[t.spirit]} ${t.requirement}~${t.plus}（${t.type===1?"高於上限：減弱":"高於上限：增強"}）`).join("、")}</td><td>${s.result_type===1?"回復量":s.result_type===0||s.other_type===0?"傷害":"狀態持續量"}</td></tr>`).join("")}</tbody></table></div></details>`}function g(){let s=r.statuses.filter(a=>a.group==="異常").flatMap(a=>a.skills.map(l=>({skill:r.skills[l],effect:u(r.skills[l])}))).filter(a=>a.effect).sort((a,l)=>a.skill.id-l.skill.id).filter(a=>a.effect.available),t=a=>a.skills.filter(l=>a.group!=="異常"||u(r.skills[l])?.available);o.innerHTML=p("狀態")+`<article class="panel status-sheet"><div class="status-head"><span>狀態</span><span>效果</span><span>相關技能</span></div>${r.statuses.map(a=>`<section class="status-row"><div class="status-name">${$(a.image,"status-icon","",!1,{scale:2})}<h2>${i(a.name)}</h2></div><p>${i(f(a.effect))}</p><div class="status-skills">${t(a).map(l=>`<a class="status-skill-link" href="${h("skills",{detail:"skill:"+l})}" data-open="skill:${l}">${i(r.skills[l].name)}</a>`).join("、")||"—"}</div></section>`).join("")}<div class="status-foot"><p>同一種狀態的持續時間不一定相同。多數狀態會隨回合扣除效果量，扣完後解除。</p><a class="text-link" href="${h("formulas")}#chances">查看機率與傷害公式</a></div></article>

  <article class="panel formula-sheet status-probabilities">${n("ailment-chances","會造成異常的技能",`

   <p><strong>凍結：</strong>冰系咒法命中後，以「招式基數-目標魂*2」判定，直接看目標五魂中的<strong>魂</strong>。</p>

   <p><strong>麻痺、中毒、封咒、地縛：</strong>先以「招式基數+運氣修正」判定；五魂改變異常的起始持續量。只有起始持續量大於或等於每次消退量，異常才會成立。目標靈智與抗性也會影響結果，因此下表的初步判定率不等於最終成功率。</p>

   <p>運氣修正 = trunc((施術者運氣 - 目標運氣) / 4)。trunc(x) = sgn(x) * ⌊|x|⌋。各項機率算完後限制在0~100%；物理絕技還須先命中，觸發運氣減傷時不追加異常。</p>

   <div class="table-scroll"><table class="status-chance-table"><caption>技能異常判定與目標五魂</caption><thead><tr><th scope="col">技能</th><th scope="col">異常</th><th scope="col">機率判定</th><th scope="col">影響異常的目標五魂</th></tr></thead><tbody>${s.map(({skill:a,effect:l})=>`<tr><td data-label="技能">${c(a.id)}</td><td data-label="異常">${i(l.name)}</td><td data-label="機率判定">${Number.isFinite(l.base)?l.freeze?`(${l.base}-目標魂*2)%`:`(${l.base}+運氣修正)%`:"資料待更新"}${l.freeze?"":"<small>初步判定</small>"}</td><td data-label="目標五魂">${l.souls.length?l.souls.map(_=>m[_]).join("、"):"無五魂修正"}${l.souls.length?`<small>${l.freeze?"直接扣機率":"修正起始持續量"}</small>`:""}</td></tr>`).join("")}</tbody></table></div>

   <details><summary>五魂如何影響異常成立？</summary>

    <ol><li>先依上表的機率判定是否通過。</li><li>依施術者靈智、技能的基本持續量、亂數、目標五魂及抗性，算出起始持續量。</li><li>依技能的基本消退量、目標靈智及亂數，算出每次消退量。起始持續量不足時，這次異常會被取消。</li></ol>

    ${e("施術基準 = 基本持續量 + ⌊施術者靈智 / 2⌋ + 隨機整數(1~⌊施術者靈智 / 20⌋+1)")}

    ${e("第一段起始量 = trunc(施術基準 * 五魂倍率 * 防具倍率 * 飾品倍率)")}

    ${e("起始持續量 = trunc(第一段起始量 * 目標屬性倍率)")}

    ${e("每次消退量 = 基本消退量 + 2 * ⌊目標靈智 / 隨機整數(5~10)⌋")}

    ${e("異常成立條件:起始持續量 >= 每次消退量")}

    <p>各倍率以1代表100%。施術者有咒法強化時，先把基本持續量乘1.3並取整。五魂倍率的修正範圍依各招設定，<a class="text-link" href="${h("formulas")}#souls">查看各招五魂修正範圍</a>。</p>

    <p>以${c(34)}為例，施術者靈智80、基本持續量300、基本消退量100，裝備與屬性倍率均為100%，並且先通過50%的初步判定。起始量亂數取1，消退量除數取5：</p>

    <div class="table-scroll"><table><thead><tr><th>目標條件</th><th>起始持續量</th><th>每次消退量</th><th>結果</th></tr></thead><tbody><tr><td>靈智80，迅50、魂50</td><td>341</td><td>132</td><td>麻痺成立</td></tr><tr><td>靈智400，迅100、魂100</td><td>204</td><td>260</td><td>麻痺不成立</td></tr></tbody></table></div>

    <p>迅、魂提高使五魂倍率降至60%，起始持續量減少；目標靈智提高又使消退量增加。因此，通過50%的判定也可能沒有麻痺。這些量不是回合數。</p>

   </details>

   <p>特殊狀態優先：上述四種非凍結異常，目標有閃避或對應的物理／咒法免疫時，初步判定為0%；排除這些情況後，目標狂暴時為100%，後續仍須通過異常成立條件。<a class="text-link" href="${h("formulas")}#souls">查看各招五魂的修正範圍</a>。</p>

  `)}</article>`}function y(){let d=t=>{let a=r.skills.find(l=>l.name===t);return a?`<a class="text-link" href="${h("skills",{detail:"skill:"+a.id})}" data-open="skill:${a.id}">${i(t)}</a>`:i(t)};o.innerHTML=p("公式")+`<article class="panel formula-sheet">

  <nav class="formula-index" aria-label="公式章節">${[["chances","命中與觸發"],["physical","物理傷害"],["magic","咒法與回復"],["reduction","減傷"],["souls","五魂與凍結"],["buffs","狀態持續"],["special","吸取與自爆"],["actions","行動與蓄勁"],["medicine","藥品"],["experience","經驗值"],["growth","升級"]].map(([t,a])=>`<a href="#${t}">${a}</a>`).join("")}</nav>

  <p class="formula-guide">以下依原版規則整理。⌊x⌋ 表示不大於 x 的最大整數，⌈x⌉ 表示不小於 x 的最小整數。trunc(x) = sgn(x) * ⌊|x|⌋，例如 trunc(-2.5) = -2；sgn(x) 為正數時是 1、負數時是 -1、0 時是 0。倍率100%表示乘1，50%表示乘0.5。</p>

  ${n("chances","命中與觸發機率",`

   <p>命中決定這次攻擊是否打中；會心、連擊與武器附加效果各有自己的判定。下列機率皆以0%為下限、100%為上限。</p>

   <h3>普通攻擊命中率</h3>

   ${e("裝備命中=自己的武器命中+飾品命中")}

   ${e("目標裝備迴避=目標的防具迴避+飾品迴避")}

   ${e("普通命中率 = 裝備命中 - 目標裝備迴避 + trunc((自己運氣 - 目標運氣) / 4)%")}

   <p>例如裝備命中90%、目標裝備迴避5%，自己運氣比目標低10：運氣修正為-2%，命中率為90-5-2=<strong>83%</strong>。</p>

   <p>目標狀態會優先改變普通攻擊的命中結果，依序判斷：</p>

   <ol><li>有<strong>物理免疫或閃避</strong>：命中率0%。</li><li>沒有上述狀態，但有<strong>狂暴</strong>：命中率100%。</li><li>其餘情況：使用裝備與運氣公式。</li></ol>

   <p>這個順序適用於普通攻擊；咒法仍依各招的命中與免疫規則處理。</p>

   <h3>會心與連擊</h3>

   ${e("會心率=武器會心+飾品會心")}

   ${e("連擊率=武器連擊+飾品連擊")}

   <p>會心與連擊只加總對應裝備數值，角色不另加基本3%，運氣、迅捷與五魂也不提供額外加成。防具的連擊數值不參與計算。</p>

   <p>自己有狂暴時，會心率改為 ⌊原會心率 * 1.5⌋，連擊率不變。例如原本會心3%，狂暴後為<strong>4%</strong>。觸發後如何影響傷害，見<a class="text-link" href="#physical">物理傷害</a>。</p>

   <h3>武器附加效果</h3>

   ${e("附加效果觸發率 = 武器基本機率 + trunc((自己運氣 - 目標運氣) / 10)%")}

   <p>以基本機率10%的封陣劍為例：自己運氣比目標高50，觸發率為15%；低50則為5%。攻擊必須先命中，後續才處理附加效果。</p>

   <p>負面狀態的持續量與消退另行計算，見<a class="text-link" href="#buffs">狀態持續</a>；冰系咒法的凍結另見<a class="text-link" href="#souls">五魂與凍結</a>。</p>`)}

  ${n("physical","物理傷害",`

   <p>先修正攻防，再算基礎傷害，最後依普通攻擊或絕技的分支處理倍率與減傷。</p>

   <h3>1． 先套用攻防狀態</h3>

   <ul><li><strong>攻擊力：</strong>攻擊提升先乘1.2，狂暴再乘2。</li><li><strong>防禦力：</strong>防禦提升先乘1.2；狂暴、攻擊者觸發會心時，再各自減半。</li></ul>

   <p>各步驟都依原版套用 ⌊ ⌋，之後將修正後的攻防代入下式。</p>

   <h3>2． 計算基礎物理傷害</h3>

   ${e("運氣加值 = ⌊自己的運氣 / 隨機整數(10~20)⌋")}

   ${e("基礎物理傷害=修正後攻擊力-修正後目標防禦力+運氣加值，最低0")}

   <p>每次計算會抽取10~20之間的整數作除數。運氣越高，加值通常越多。</p>

   <h3>3． 依攻擊種類計算</h3>

   <div class="table-scroll"><table><thead><tr><th>攻擊種類</th><th>傷害處理</th></tr></thead><tbody>

    <tr><td>普通攻擊</td><td>沿用基礎傷害；觸發連擊時加倍。正常造成傷害時至少1點。</td></tr>

    <tr><td>倍數型物理絕技</td><td>基礎傷害乘招式倍率，例如電射星馳*2、飛星神劍*4。</td></tr>

    <tr><td>附加異常的物理絕技</td><td>物理傷害與異常狀態分別計算；招式的狀態持續量不加進傷害。</td></tr>

   </tbody></table></div>

   <p>若觸發<a class="text-link" href="#reduction">運氣減傷</a>，普通攻擊先合計連擊傷害再減傷；倍數型絕技則先算 ⌊基礎傷害 / 2⌋，之後才乘招式倍率。</p>

   <h3>範例：會心改變防禦，連擊改變傷害</h3>

   <p>假設攻擊100、目標防禦60，這次運氣加值10，沒有其他狀態或減傷：</p>

   <div class="table-scroll"><table><thead><tr><th>觸發結果</th><th>計算</th><th>傷害</th></tr></thead><tbody>

    <tr><td>皆未觸發</td><td>100-60+10</td><td>50</td></tr>

    <tr><td>會心</td><td>100-30+10</td><td>80</td></tr>

    <tr><td>連擊</td><td>50*2</td><td>100</td></tr>

    <tr><td>會心+連擊</td><td>80*2</td><td>160</td></tr>

   </tbody></table></div>

   <p>會心的作用是將目標防禦減半，沒有額外再把傷害乘2。招式倍率也乘在算出的傷害上，不直接乘面板攻擊力。</p>

   <details><summary>其他物理絕技的計算分支</summary>

   <p>部分「普通攻擊基準型」絕技還會加入膂力加值及目標五魂修正，使用下式：</p>

   ${e("傷害 = ⌊(基礎物理傷害 + ⌊自己的膂力 / 隨機整數(8~20)⌋) * 五魂倍率⌋")}

   <p>這個分支若有攻擊提升，會先算 ⌊基礎物理傷害 * 1.2⌋，之後加膂力項、乘五魂倍率；觸發減傷時，再算 ⌊這段結果 / 2⌋。各招走的分支不同，應以招式顯示的效果為準。</p></details>

   <details><summary>附加異常的絕技參數</summary>

   <p>鬼冥劍的200、雙環映月的200、破魔杵的150，都是附加異常的基本持續量。例如鬼冥劍先依攻防計算物理傷害，再以200為起點計算麻痺；200不代表固定傷害、觸發機率或回合數。</p>

   <div class="table-scroll"><table><thead><tr><th>絕技</th><th>附加狀態</th><th>基本持續量</th></tr></thead><tbody>${r.skills.filter(t=>t.effect_formula?.power_role==="attached_status_pool"&&u(t)?.available).map(t=>`<tr><td>${c(t.id)}</td><td>${{3:"麻痺",4:"中毒",5:"封咒"}[t.other_effect]}</td><td>${t.power}</td></tr>`).join("")}</tbody></table></div>

   </details>`)}

  ${n("magic","咒法傷害與體力回復",`

   <p>一般傷害咒法與體力治療術，先計算共同的「施術基準」，再分別套用傷害或回復公式。</p>

   <h3>1． 計算施術基準</h3>

   ${e("隨機加值上限 = ⌊施法者靈智 / 20⌋ + 1")}

   ${e("施術基準 = 招式基本數值 + ⌊施法者靈智 / 2⌋ + 隨機整數(1~加值上限)")}

   <p>咒法強化只先將<strong>⌊招式基本數值 * 1.3⌋</strong>，靈智與隨機加值照常另加。道具施法則以道具自己的基本數值取代招式基本數值。</p>

   <p>例如焚炎之陣基本數值80，施法者靈智80：隨機加值為1~5，施術基準為<strong>121~125</strong>。技能標示的80因此不等於最後傷害。</p>

   <h3>2． 傷害咒法：五魂、裝備、目標屬性</h3>

   ${e("裝備後傷害 = trunc(施術基準 * 五魂倍率 * 防具承傷倍率 * 飾品承傷倍率)")}

   ${e("最後傷害 = trunc(裝備後傷害 * 目標屬性倍率)")}

   <p>裝備承傷倍率=100%-該裝備的屬性修正；五魂倍率看<strong>目標的五魂</strong>，詳見<a class="text-link" href="#souls">五魂與凍結</a>。目標屬性倍率100%照常受傷、50%減半，負值則轉為吸收。</p>

   <p>例如施術基準121、五魂倍率100%，防具與飾品各減少30%，目標屬性倍率100%：先算 ⌊121 * 70% * 70%⌋ = <strong>59</strong>，最後傷害也是59。</p>

   <h3>3． 體力治療：五魂、筋力、中毒</h3>

   ${e("回復倍率 = 五魂倍率 + ⌊目標筋力 / 20⌋%")}

   ${e("回復量 = ⌊施術基準 * 回復倍率⌋")}

   <p>目標中毒時，再算 ⌊回復量 * 80%⌋；實際補回量以目標尚缺的體力為限。</p>

   <p>例如施術基準100、五魂倍率100%、目標筋力100：回復倍率為105%，可補<strong>105點</strong>；中毒時為<strong>84點</strong>。若只缺30點，實際只補30點。</p>`)}

  ${n("reduction","減傷與屬性倍率",`

   <h3>命中後的運氣減傷</h3>

   <p>普通攻擊、反擊與相關物理絕技，在命中後還可能觸發一次減傷。判定看目標與攻擊者的運氣差：</p>

   ${e("減傷機率 = 5% + trunc((目標運氣 - 攻擊者運氣) / 10)%,限制在 0~100%")}

   <p>雙方運氣相同時為5%；目標運氣較高，較容易觸發。觸發後的處理依攻擊種類而異：</p>

   <div class="table-scroll"><table><thead><tr><th>攻擊種類</th><th>觸發減傷後</th></tr></thead><tbody>

    <tr><td>普通攻擊、反擊</td><td>⌊傷害 / 2⌋ - ⌊目標筋力 / 10⌋，最低1點；連擊先合計傷害。</td></tr>

    <tr><td>倍數型物理絕技</td><td>⌊基礎傷害 / 2⌋ * 招式倍率；不額外扣 ⌊筋力 / 10⌋。</td></tr>

    <tr><td>其他物理絕技</td><td>依各招分支處理，見<a class="text-link" href="#physical">物理傷害</a>的展開說明。</td></tr>

   </tbody></table></div>

   <p>普通攻擊原傷害100、目標筋力80，減傷後為50-8=<strong>42</strong>。電射星馳若基礎傷害101，觸發減傷後先取50，再乘2，得到<strong>100</strong>；未觸發時為202。</p>

   <h3>屬性與裝備減傷</h3>

   <p>屬性倍率直接參與傷害計算，不需要抽取上面的運氣減傷判定。防具、飾品與目標本身的倍率<strong>分開相乘</strong>。</p>

   <p>例如原本100點雷傷，防具減少50%、目標雷屬性倍率50%：100*50%*50%=<strong>25點</strong>。兩件裝備各減少30%，則剩70%*70%=<strong>49%</strong>。</p>

   <p>計算與套用符號的先後順序見<a class="text-link" href="#magic">咒法傷害</a>。會心的「防禦減半」、這裡的「傷害減半」，以及免疫造成的落空，是不同的處理。</p>`)}

  ${n("souls","五魂修正與凍結",`

   <p>五魂用於學習條件，也會修正受到技能時的傷害、回復量或狀態持續量。這裡的效果修正，看的是<strong>目標的五魂</strong>。</p>

   <h3>五魂怎麼改變技能效果？</h3>

   <ol><li>查看該招指定的五魂項目，以及各項「不增不減」的範圍。</li><li>在範圍內，該項修正為0；超出上下限時，才按超出的點數增減。</li><li>加總各項修正，與100%相加，最低算到0%。</li></ol>

   ${e("五魂倍率=100%+各項五魂修正,最低0%")}

   <p>例如${d("雷引之術")}看迅10~50、神5~60。目標迅70、神30時，迅比上限高20，這段效果減少20個百分點，五魂倍率為<strong>80%</strong>；迅40、神30時則為100%。</p>

   <details><summary>五魂修正方向與常見用途</summary>

   <p>每招各自決定修正方向。「高於上限時增強」的項目，超出幾點就增加幾個百分點；「高於上限時減弱」則扣除。低於下限時，方向相反；未指定的五魂不計。</p>

   <ul class="soul-explanations">

    <li><strong>迅：</strong>參與部分雷系咒法、麻痺與移動增益的持續量。例如迅較高可減輕雷引之術的五魂傷害修正、縮短奪魄鬼咒的麻痺持續量，或延長攬風神行。它不直接增加行動點或普通攻擊迴避率。</li>

    <li><strong>烈：</strong>參與多種火、冰系咒法及攻防增益。高於各招標準時，可減輕部分傷害，並增加血刃之咒、地禦之陣、狂魔大法的持續量。</li>

    <li><strong>神：</strong>參與治療、雷系咒法及部分增益。高於標準時，可增加受到的治療量、減輕部分雷傷，或延長靈智真法。</li>

    <li><strong>魔：</strong>效果依招式而異。可能減輕部分火、冰傷害、延長增益，也可能減少受到的治療量，或增加群星聚華等光系傷害。</li>

    <li><strong>魂：</strong>參與部分光、暗系咒法、麻痺、封咒與增益持續量；冰系凍結另有下方的獨立機率公式。</li>

   </ul>

   <p>以${d("氣愈之術")}為例，它看神0~70、魔0~50：目標神90、魔30時，五魂倍率為120%；神50、魔70時，則為80%。</p></details>

   ${b()}

   <p>五魂倍率只是計算的一部分，之後仍依招式處理靈智、裝備、屬性或狀態。電射星馳等倍數型物理絕技的傷害不套用這段五魂修正。</p>

   <h3>冰系咒法的凍結機率</h3>

   <p>冰系傷害命中後，另行判定是否凍結。這個判定只取目標五魂中的「魂」，與上面的傷害倍率分開計算。</p>

   ${e("凍結機率=招式基本參數-目標「魂」*2,限制在0~100%")}

   <div class="table-scroll"><table><thead><tr><th>咒法</th><th>基本參數</th><th>目標魂20</th><th>目標魂40</th></tr></thead><tbody>${[16,17,18,19].map(t=>`<tr><td>${c(t)}</td><td>${r.skills[t].hit}</td>${[20,40].map(a=>`<td>${Math.max(0,Math.min(100,r.skills[t].hit-a*2))}%</td>`).join("")}</tr>`).join("")}</tbody></table></div>

   <p>天霜雪舞的80是基本參數；目標魂20時為40%，魂40時為0%。即使基本參數超過100，實際機率仍以100%為上限。</p>`)}

  ${n("buffs","狀態持續與消退",`

   <p>一般增益與中毒、麻痺、封咒、地縛等異常，會保存「剩餘持續量」及「每次消退量」。狀態更新時扣除消退量，剩餘量耗盡後解除。</p>

   ${e("更新後持續量=更新前持續量-每次消退量")}

   <p>判讀狀態時，請分開看<strong>能否觸發、起始持續量、每次消退量</strong>。原始數字100、200、300可能是持續量參數，不能直接讀成機率或回合數。</p>

   <h3>增益持續量受哪些能力影響？</h3>

   <ul><li><strong>施法者靈智：</strong>提高起始持續量。</li><li><strong>受術者五魂：</strong>依招式規則增減起始持續量。</li><li><strong>受術者靈智：</strong>增益每次消退量通常較少，異常狀態則通常消退較快。</li></ul>

   <p>血刃之咒等增益的提升比例固定；持續較久，只代表效果維持較久，攻擊提升20%不會隨時間繼續增加。</p>

   <h3>範例：對自己施放血刃之咒</h3>

   <p>假設五魂倍率100%，起始量與消退量的亂數都取最低值：</p>

   <div class="table-scroll"><table><thead><tr><th>自己的靈智</th><th>起始持續量</th><th>每次消退量</th><th>耗盡所需更新次數</th></tr></thead><tbody><tr><td>40</td><td>121</td><td>84</td><td>2次</td></tr><tr><td>200</td><td>201</td><td>20</td><td>11次</td></tr></tbody></table></div>

   <p>這裡列的是持續量更新次數，不直接換算成固定戰鬥回合。消退量在施法時決定，後續沿用，不是每回合重新抽取。</p>

   <details><summary>增益與異常的完整消退公式</summary>

   ${e("增益起始量 = ⌊(基本持續量 + ⌊施法者靈智 / 2⌋ + 隨機加值) * 五魂倍率⌋")}

   <p>隨機加值為 1~(⌊施法者靈智 / 20⌋ + 1)。已有咒法強化時，先算 ⌊基本持續量 * 1.3⌋。</p>

   ${e("增益每次消退量 = 基本消退量 - 2 * ⌊受術者靈智 / 隨機整數(5~10)⌋")}

   ${e("異常每次消退量 = 基本消退量 + 2 * ⌊受術者靈智 / 隨機整數(5~10)⌋")}

   <p>異常的起始持續量還要經過對應屬性與裝備修正。特殊免疫、凍結與零參數效果各有分支，不一律套用上面的增益公式。</p>

   <p>消退量大於0時，⌈起始量 / 消退量⌉可求出耗盡所需更新次數。消退量也可能為0或負數：例如受術者靈智400，除數取8，基本消退量100時，結果為100-2*50=0；為負數時，這條更新公式反而增加剩餘量。</p>

   <div class="table-scroll"><table><thead><tr><th>增益技能</th><th>基本持續量</th><th>基本消退量</th></tr></thead><tbody>${[28,29,27,30,31].map(t=>`<tr><td>${c(t)}</td><td>${r.skills[t].power}</td><td>${r.skills[t].hit}</td></tr>`).join("")}</tbody></table></div></details>

   <details><summary>武器附加異常的基本參數</summary>

   <div class="table-scroll"><table><thead><tr><th>武器</th><th>基本持續量</th><th>基本消退量</th></tr></thead><tbody><tr><td>封陣劍</td><td>300</td><td>100</td></tr><tr><td>靈蛇劍</td><td>100</td><td>100</td></tr><tr><td>毒龍爪</td><td>150</td><td>100</td></tr></tbody></table></div>

   <p>先用<a class="text-link" href="#chances">武器附加效果公式</a>判定是否觸發，再依能力、抗性與消退參數處理持續效果。</p></details>`)}

  ${n("special","術力吸取與自爆",`

   <h3>${d("攝魂鬼觸")}</h3>

   ${e("術力吸取基準 = ⌊目標術力上限 / 3⌋")}

   <p>實際吸取量以目標目前剩餘術力為限；施術者回復術力時，再以自己的術力上限截斷。</p>

   <p>例如目標術力上限120、目前剩25，吸取基準為40，實際從目標扣25。若施術者只缺10點術力，自己補回10點。</p>

   <h3>自爆</h3>

   ${e("自爆基準 = ⌊(自己的體力上限 - 目前體力) / 2⌋")}

   ${e("自爆傷害 = trunc(自爆基準 * 目標火屬性倍率)")}

   <p>傷害隨已損失的體力增加，施術者會犧牲。例如體力上限1000、目前體力200，目標火屬性倍率100%：自爆基準400，造成400點傷害；滿體力時基準為0。</p>

   <h3>${d("魔天降臨")}</h3>

   <p>原版此招未進入有效的吸取分支，施放只消耗25點術力，沒有實際效果。</p>`)}

  ${n("actions","行動點與蓄勁",`

   <p>人物能力中的「移動點數」，就是移動與出招共用的行動點。每走一格會依角色、地形扣點；施放絕技時，還要留夠該招的「行動消耗」。</p>

   ${e("每回合基本行動點 = 角色的基本點數 + ⌊迅捷 / 25⌋")}

   <p>例如殷劍平的基本點數是23：迅捷22時有23點，迅捷50時有25點。這是點數，不是能走23格或25格。</p>

   <h3>移動後還能不能出招？</h3>

   ${e("移動後剩餘行動點 ≥ 該絕技的行動消耗，才有足夠點數施放")}

   <p>例如目前有46點，移動花掉10點，剩36點：可用行動消耗30的招式，不能用消耗40的招式。術力也必須足夠。行動點多不代表同回合能連續出招，一次攻擊、施法或使用道具仍會結束該次行動。</p>

   <details><summary>移動提升與各角色的基本點數</summary>

   <p>${d("攬風神行")}會令新回合可用點數 = ⌊基本點數 * 1.5⌋ + 先前蓄存點數。例如原本23點，提高後補充34點；若前回合留下23點，這回合合計57點。</p>

   <div class="table-scroll"><table><thead><tr><th>角色</th><th>加入時每回合基本行動點</th></tr></thead><tbody>${r.characters.map(t=>`<tr><td><a href="${h("characters",{character:t.id})}">${i(t.name)}</a></td><td>${t.stats.movement}</td></tr>`).join("")}</tbody></table></div></details>`)}

  ${n("medicine","藥品回復",`

   <p>體力藥看服藥者筋力，術力藥看服藥者靈智；不抽亂數，所以實際回復可以超過道具列出的基本數值。</p>

   ${e("體力藥回復量 = ⌊基本回復量 * (100% + ⌊筋力 / 20⌋%)⌋")}

   ${e("術力藥回復量 = ⌊基本回復量 * (100% + ⌊靈智 / 20⌋%)⌋")}

   <p>例如筋力100使用金創藥，回復100*105%=105點體力。中毒時體力回復量再按 ⌊回復量 * 80%⌋ 計算；實際補回不超過尚缺的體力或術力。</p>`)}

  ${n("experience","經驗值怎麼取得？",`

   <p><strong>打傷敵人、戰勝（擊倒敵人）、治療，確實有不同算法。</strong>打傷看扣掉多少體力；擊倒拿完整基準；治療看實際補回多少。以下的「戰勝」指擊倒單位，不是整關過關獎勵。</p>

   <div class="table-scroll"><table><thead><tr><th>行動</th><th>經驗值計算</th></tr></thead><tbody>

    <tr><td>攻擊，未擊倒</td><td>max(1, ⌊擊倒基準經驗 * 本次傷害 / 目標體力上限⌋)</td></tr>

    <tr><td>擊倒敵人</td><td>完整的擊倒基準經驗；不再乘剩餘體力的比例</td></tr>

    <tr><td>治療體力</td><td>max(1, ⌊200 * 等級倍率 * 實際補回體力 / 目標體力上限⌋)</td></tr>

   </tbody></table></div>

   <h3>打傷與擊倒差多少？</h3>

   <p>假設等級倍率為1、敵人的基礎經驗200、體力上限1000：打掉100點但沒擊倒，得到<strong>20點</strong>；敵人剩100點時打倒，得到<strong>200點</strong>。即使只剩1點體力，最後一擊仍取得200點，並非只按那1點傷害計算。</p>

   <p>普通攻擊、反擊與造成體力傷害的絕技／咒法，都會用到這個原則。各種敵人的基礎經驗不同，並不是每隻都固定200點。</p>

   <h3>治療看補回的比例</h3>

   <p>雙方等級相同時，為體力上限1000的同伴補回100點，得到<strong>20點</strong>；只缺20點，就算招式能補100點，也只拿<strong>4點</strong>。對已滿體力的人使用一般體力治療法術，這段公式仍給最低<strong>1點</strong>。</p>

   <p>治療經驗不看藥品或招式標示的基本回復量，也不把溢出的治療量算進去。<strong>使用道具不會套用這份施法經驗獎勵</strong>；血刃之咒、地禦之陣、靈智真法、狂魔大法等純強化法術，也不會因成功施放就固定得到50點經驗。</p>

   <h3>等級差如何影響經驗？</h3>

   <p><strong>直接比較能力窗顯示的雙方等級。</strong>目標等級越高，經驗倍率越高，最高為2倍；目標等級較低時，倍率會降低。</p>

   ${e("等級差 = 目標等級 - 自己等級")}

   ${e("擊倒基準經驗 = max(1, ⌊敵人基礎經驗 * 等級倍率⌋)")}

   <div class="table-scroll"><table><thead><tr><th>目標的等級</th><th>單一目標的等級倍率</th></tr></thead><tbody>

    <tr><td>比自己低10級以上</td><td>0倍，仍保留最低經驗</td></tr><tr><td>比自己低5級</td><td>0.25倍</td></tr>

    <tr><td>與自己相同</td><td>1倍</td></tr><tr><td>比自己高5級</td><td>1.75倍</td></tr><tr><td>比自己高10級以上</td><td>2倍</td></tr>

   </tbody></table></div>

   <p>例如6級劍平擊倒6級夜魑，等級倍率為1，得到<strong>170點</strong>。77級角色擊倒77級噬魂鬼，同樣是1倍，得到<strong>165點</strong>；比它低10級以上時，倍率最高為2倍，得到330點。</p>

   <details><summary>等級倍率的完整算式</summary>

    <p>令「等級差」=目標等級-自己等級，超過10算10，低於-10算-10。</p>

    ${e("目標不低於自己:倍率=2-(1-等級差/10)^2")}

    ${e("目標低於自己:倍率=(1+等級差/10)^2")}

    <p>攻擊使用 ⌊⌊基礎經驗 * 倍率⌋ * 傷害比例⌋；治療使用 ⌊200 * 倍率 * 實際回復比例⌋。原程式使用浮點數，中間存值及 ⌊ ⌋ 的套用時點可能使臨界結果差1點。</p>

   </details>

   <h3>一次影響多人，不能直接把單體經驗相加</h3>

   <p>範圍攻擊與範圍治療會先找出<strong>單體經驗最高的那個目標</strong>，保留他的經驗；其他目標改用另一個等級倍率計算後加上去。</p>

   <p>例如為兩名等級比自己低5級、體力上限各1000的同伴各補100點：最高的一人算5點，另一人改算2點，合計<strong>7點</strong>，不是10點。若兩人等級都和自己相同，則各20點，合計40點。</p>

   <details><summary>範圍法術的其餘目標怎麼算？</summary>

    <p>沿用上面的等級差，但把平方改成三次方：</p>

    ${e("目標不低於自己:其餘目標倍率=2-(1-等級差/10)^3")}

    ${e("目標低於自己:其餘目標倍率=(1+等級差/10)^3")}

    <p>再按各自的傷害、擊倒或治療公式計算，最後加總。若最高單體經驗相同，取排列中第一個目標作為主要目標。未生效目標在原程式可能保留-1的結果，混在多目標結算時可能使總數少1，不能一概當作每個目標都有最低1點。</p>

   </details>

   <details><summary>敵人的基礎經驗</summary><div class="table-scroll"><table><thead><tr><th>敵人</th><th>基礎經驗</th></tr></thead><tbody>${(r.unit_types||[]).filter(t=>t.id>=14&&t.base_exp>0).map(t=>`<tr><td>${i(t.name)}</td><td>${t.base_exp}</td></tr>`).join("")}</tbody></table></div></details>

   <p>每累積500點經驗升1級，剩餘經驗保留；角色最高99級。</p>`)}

  ${n("growth","升級時的體力與術力",`

   <p>體力成長主要看升級前的筋力，術力成長主要看升級前的靈智，兩者還帶有小幅亂數。筋力或靈智比目前等級高越多，通常長得越多。</p><p>同一批經驗結算若連升多級，原版先累計、最後整批提交；各級體力／術力增加都採這批結算前的筋力、靈智與等級，不逐級重算。例如等級1、筋力及靈智35，連升兩級且兩次隨機項皆為0：體力合計增加6、術力合計增加2。即使各級能力增加會跨過除35門檻，也要等下一批結算才影響這兩項成長。</p>

   <p>例如筋力35、等級1，這次升級體力會增加3~5點。這次升級新增加的筋力、靈智，要到下一次升級才會影響體術成長。</p>

   <details><summary>升級的完整計算方式</summary>

   ${e("體力增加 = 3 + ⌊(筋力 - 等級) / 35⌋ + 隨機整數(0~2)")}

   ${e("術力增加 = 1 + ⌊(靈智 - 等級) / 35⌋ + 隨機整數(0~1)")}

   <p>能力、等級都取升級前的數值。99級後不再升級；原版升級公式沒有把體力、術力截在9999。</p></details>`)}

  </article>`;let s=document.getElementById(location.hash.slice(1));s?.classList.contains("formula-section")&&s.scrollIntoView({block:"start"})}return{render:d=>d==="statuses"?g():y()}}export{j as createFormulas};
