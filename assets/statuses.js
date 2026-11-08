var g=t=>t.attribute===2&&t.result_type===0&&Number.isFinite(t.hit),c={xun:"迅",lie:"烈",shen:"神",mo:"魔",hun:"魂"};var h=t=>String(t??"").replace(/炎系/g,"火系").replace(/冰凍/g,"凍結").replace(/[＋－＝％～×÷−]/g,l=>({"＋":"+","－":"-","＝":"=","％":"%","～":"~","×":"*","÷":"/","−":"-"})[l]).replace(/[,;:!?()]/g,l=>({",":"，",";":"；",":":"：","!":"！","?":"？","(":"（",")":"）"})[l]);function f(t){let l=t.effect_formula||{};if(l.kind==="no_effect"||l.actual_effect===!1)return null;if(g(t))return{name:"凍結",base:t.hit,freeze:!0,souls:["hun"],available:!0};let o;return l.kind==="ailment"?o=t.other_type===2&&t.other_effect===8?"地縛":{8:"中毒",9:"麻痺",10:"封咒",11:"地縛"}[t.result_effect]:l.power_role==="attached_status_pool"&&(o={3:"麻痺",4:"中毒",5:"封咒"}[t.other_effect]),o?{name:o,base:t.additional_hit,freeze:!1,souls:(t.spirit_additions||[]).filter(i=>i.type!==-1).map(i=>i.spirit),available:Number.isInteger(t.attribute)&&t.attribute>=0&&t.attribute<=5}:null}function z({data:t,main:l,header:o,esc:i,image:_,link:d}){let m=(n,e,s)=>`<section class="formula-section" id="${n}"><h2>${e}</h2>${s}</section>`,u=n=>`<p class="formula-equation">${n}</p>`,p=n=>`<a class="text-link" href="${d("skills",{detail:"skill:"+n})}" data-open="skill:${n}">${i(t.skills[n].name)}</a>`;function b(){return`<details><summary>各技能的五魂修正基準</summary><div class="table-scroll"><table><thead><tr><th>技能</th><th>目標五魂不增減的範圍</th><th>影響項目</th></tr></thead><tbody>${t.skills.filter(e=>(e.player_usable||e.enemy_users.length)&&e.spirit_additions.some(s=>s.type!==-1)&&f(e)?.available!==!1&&([0,1,4].includes(e.result_type)||e.result_type===3&&e.result_effect<=4||e.other_type===0||e.other_type===1&&[3,4,5].includes(e.other_effect)||e.other_type===2&&e.other_effect===8)).map(e=>`<tr><td>${p(e.id)}</td><td>${e.spirit_additions.filter(s=>s.type!==-1).map(s=>`${c[s.spirit]} ${s.requirement}~${s.plus}（${s.type===1?"高於上限：減弱":"高於上限：增強"}）`).join("、")}</td><td>${e.result_type===1?"回復量":e.result_type===0||e.other_type===0?"傷害":"狀態持續量"}</td></tr>`).join("")}</tbody></table></div></details>`}function $(){let e=t.statuses.filter(r=>r.group==="異常").flatMap(r=>r.skills.map(a=>({skill:t.skills[a],effect:f(t.skills[a])}))).filter(r=>r.effect).sort((r,a)=>r.skill.id-a.skill.id).filter(r=>r.effect.available),s=r=>r.skills.filter(a=>r.group!=="異常"||f(t.skills[a])?.available);l.innerHTML=o("狀態")+`<article class="panel status-sheet"><div class="status-head"><span>狀態</span><span>效果</span><span>相關技能</span></div>${t.statuses.map(r=>`<section class="status-row"><div class="status-name">${_(r.image,"status-icon","",!1,{scale:2})}<h2>${i(r.name)}</h2></div><p>${i(h(r.effect))}</p><div class="status-skills">${s(r).map(a=>`<a class="status-skill-link" href="${d("skills",{detail:"skill:"+a})}" data-open="skill:${a}">${i(t.skills[a].name)}</a>`).join("、")||"—"}</div></section>`).join("")}<div class="status-foot"><p>同一種狀態的持續時間不一定相同。多數狀態會隨回合扣除效果量，扣完後解除。</p></div></article>

  <article class="panel formula-sheet status-probabilities">${m("ailment-chances","會造成異常的技能",`

   <p><strong>凍結：</strong>冰系咒法命中後，以「招式基數-目標魂*2」判定，直接看目標五魂中的<strong>魂</strong>。</p>

   <p><strong>麻痺、中毒、封咒、地縛：</strong>先以「招式基數+運氣修正」判定；五魂改變異常的起始持續量。只有起始持續量大於或等於每次消退量，異常才會成立。目標靈智與抗性也會影響結果，因此下表的初步判定率不等於最終成功率。</p>

   <p>運氣修正 = trunc((施術者運氣 - 目標運氣) / 4)。trunc(x) = sgn(x) * ⌊|x|⌋。各項機率算完後限制在0~100%；物理絕技還須先命中，觸發運氣減傷時不追加異常。</p>

   <div class="table-scroll"><table class="status-chance-table"><caption>技能異常判定與目標五魂</caption><thead><tr><th scope="col">技能</th><th scope="col">異常</th><th scope="col">機率判定</th><th scope="col">影響異常的目標五魂</th></tr></thead><tbody>${e.map(({skill:r,effect:a})=>`<tr><td data-label="技能">${p(r.id)}</td><td data-label="異常">${i(a.name)}</td><td data-label="機率判定">${Number.isFinite(a.base)?a.freeze?`(${a.base}-目標魂*2)%`:`(${a.base}+運氣修正)%`:"資料待更新"}${a.freeze?"":"<small>初步判定</small>"}</td><td data-label="目標五魂">${a.souls.length?a.souls.map(y=>c[y]).join("、"):"無五魂修正"}${a.souls.length?`<small>${a.freeze?"直接扣機率":"修正起始持續量"}</small>`:""}</td></tr>`).join("")}</tbody></table></div>

   <details><summary>五魂如何影響異常成立？</summary>

    <ol><li>先依上表的機率判定是否通過。</li><li>依施術者靈智、技能的基本持續量、亂數、目標五魂及抗性，算出起始持續量。</li><li>依技能的基本消退量、目標靈智及亂數，算出每次消退量。起始持續量不足時，這次異常會被取消。</li></ol>

    ${u("施術基準 = 基本持續量 + ⌊施術者靈智 / 2⌋ + 隨機整數(1~⌊施術者靈智 / 20⌋+1)")}

    ${u("第一段起始量 = trunc(施術基準 * 五魂倍率 * 防具倍率 * 飾品倍率)")}

    ${u("起始持續量 = trunc(第一段起始量 * 目標屬性倍率)")}

    ${u("每次消退量 = 基本消退量 + 2 * ⌊目標靈智 / 隨機整數(5~10)⌋")}

    ${u("異常成立條件:起始持續量 >= 每次消退量")}

    <p>各倍率以1代表100%。施術者有咒法強化時，先把基本持續量乘1.3並取整。五魂倍率的修正範圍依各招設定，<a class="text-link" href="#souls">查看各招五魂修正範圍</a>。</p>

    <p>以${p(34)}為例，施術者靈智80、基本持續量300、基本消退量100，裝備與屬性倍率均為100%，並且先通過50%的初步判定。起始量亂數取1，消退量除數取5：</p>

    <div class="table-scroll"><table><thead><tr><th>目標條件</th><th>起始持續量</th><th>每次消退量</th><th>結果</th></tr></thead><tbody><tr><td>靈智80，迅50、魂50</td><td>341</td><td>132</td><td>麻痺成立</td></tr><tr><td>靈智400，迅100、魂100</td><td>204</td><td>260</td><td>麻痺不成立</td></tr></tbody></table></div>

    <p>迅、魂提高使五魂倍率降至60%，起始持續量減少；目標靈智提高又使消退量增加。因此，通過50%的判定也可能沒有麻痺。這些量不是回合數。</p>

   </details>

   <p>特殊狀態優先：上述四種非凍結異常，目標有閃避或對應的物理／咒法免疫時，初步判定為0%；排除這些情況後，目標狂暴時為100%，後續仍須通過異常成立條件。<a class="text-link" href="#souls">查看各招五魂的修正範圍</a>。</p>

  `)}${m("souls","各技能的五魂修正範圍",b())}</article>`}return{render:$}}export{z as createStatuses};
