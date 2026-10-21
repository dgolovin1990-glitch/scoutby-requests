window.D={
 categories:['Вода и канализация','Электричество','Отопление','Лифт','Дефект в квартире','Уборка и благоустройство','Начисления и оплата','Соседи и порядок','Документы и справки','Не по адресу'],
 recipients:['Аварийно-диспетчерская служба','Инженерная служба','Гарантийный отдел','Клининг и благоустройство','Расчётный центр','Отдел по работе с жителями'],
 statuses:['Новая','Назначена','В работе','Нужно уточнение','Выполнена'],
 descriptions:['Холодная и горячая вода, протечки, засоры, стояки водоснабжения и канализации, счётчики воды.','Свет в квартире и общих помещениях, щитки, розетки, проводка и электросчётчики.','Батареи, стояки отопления и температура в квартире.','Работа лифта, застревание человека и неисправности кабины.','Окна, двери, стены, полы и сантехника, установленная застройщиком.','Уборка подъездов и лифтов, мусор, двор, площадки, снег и сосульки.','Квитанции, начисления, показания счётчиков, перерасчёты и оплата.','Шум, курение, парковка, захват общего имущества и посторонние в доме.','Справки, выписки, копии документов и регистрация.','Вопросы, которыми управляющая компания не занимается.'],
 houses:[['Д-01','2023-03-15'],['Д-02','2023-11-20'],['Д-03','2019-06-10'],['Д-04','2020-02-28'],['Д-05','2024-09-05'],['Д-06','2018-12-25'],['Д-07','2021-08-16'],['Д-08','2025-06-30'],['Д-09','2022-04-12'],['Д-10','2022-10-03'],['Д-11','2025-12-18'],['Д-12','2024-03-22']],
 esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
 date:s=>new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date(s)),
 urgency:s=>`<span class="badge ${s==='Авария'?'emergency':s==='Срочно'?'urgent':''}">${D.esc(s)}</span>`,
 status:s=>`<span class="badge ${['status-new','status-assigned','status-working','status-waiting','status-done'][D.statuses.indexOf(s)]||''}">${D.esc(s)}</span>`,
 async api(path,options={}){const r=await fetch('/api/'+path,{...options,headers:{'Content-Type':'application/json',...options.headers},cache:'no-store'});let j;try{j=await r.json()}catch{throw Error('Сервис пока не ответил. Повторите обновление.')}if(!r.ok)throw Error(j.error||'Не удалось выполнить действие.');return j;},
 toast(s){const e=document.getElementById('toast');e.textContent=s;e.classList.remove('hidden');clearTimeout(D.timer);D.timer=setTimeout(()=>e.classList.add('hidden'),4500)},
 route(category,urgency,house,date=new Date().toISOString().slice(0,10)){if(urgency==='Авария')return D.recipients[0];const i=D.categories.indexOf(category);if(i<4)return D.recipients[1];if(i===4){const h=D.houses.find(h=>h[0]===house);if(!h)return D.recipients[5];const end=(+h[1].slice(0,4)+5)+h[1].slice(4);return date>=h[1]&&date<end?D.recipients[2]:D.recipients[5]}return i===5?D.recipients[3]:i===6?D.recipients[4]:D.recipients[5]},
 options(list,selected){return list.map(x=>`<option ${selected===x?'selected':''}>${D.esc(x)}</option>`).join('')},
 csv(name,rows){const cell=v=>'"'+String(v??'').replace(/^[=+\-@]/,"'$&").replaceAll('"','""')+'"';D.download(name,'\uFEFF'+rows.map(r=>r.map(cell).join(';')).join('\r\n'),'text/csv;charset=utf-8')},
 download(name,text,type){const link=document.createElement('a');link.href=URL.createObjectURL(new Blob([text],{type}));link.download=name;link.click();setTimeout(()=>URL.revokeObjectURL(link.href),500)},
 async copy(text){try{await navigator.clipboard.writeText(text);D.toast('Ссылка скопирована')}catch{D.toast('Скопируйте ссылку из поля в карточке')}}
};
