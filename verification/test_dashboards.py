import urllib.request,urllib.error,urllib.parse,http.cookiejar,json,pathlib,sys
sys.stdout.reconfigure(encoding='utf-8');base=sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:8788';results=[]
opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
opener.open(urllib.request.Request(base+'/uk.html',headers={'User-Agent':'Mozilla/5.0'}),timeout=40).read()
def call(path,method='GET',data=None,token=None,origin=None):
 headers={'Content-Type':'application/json','User-Agent':'Mozilla/5.0'}
 if token:headers['X-Ticket-Token']=token
 if origin:headers['Origin']=origin
 req=urllib.request.Request(base+'/api/'+urllib.parse.quote(path,safe='/'),data=json.dumps(data,ensure_ascii=False).encode() if data is not None else None,headers=headers,method=method)
 try:
  r=opener.open(req,timeout=40);return r.status,json.loads(r.read())
 except urllib.error.HTTPError as e:return e.code,json.loads(e.read())
def check(name,condition):
 results.append({'name':name,'pass':bool(condition)})
 if not condition:raise AssertionError(name)
s,queue=call('tickets');check('Общая очередь импортирует 150 учебных записей',s==200 and len(queue.get('tickets',[]))>=150)
s,new=call('tickets','POST',{'text':'Учебная проверка: из электрощитка идёт дым и пахнет гарью.','house':'Д-01','category':'Уборка и благоустройство'},origin=base);check('Житель создаёт аварийную заявку',s==201 and new['ticket']['urgency']=='Авария' and new['ticket']['category']=='Электричество')
tid=new['ticket']['id'];token=new['token'];s,j=call('resident/'+tid,token=token);check('Персональная ссылка открывает заявку без аккаунта',s==200)
s,j=call('resident/'+tid,token='incorrect-but-long-token-value');check('Неверный ключ не открывает личную карточку',s==403)
s,q=call('tickets');check('Новая заявка появилась в общей очереди УК',s==200 and any(t['id']==tid for t in q['tickets']))
payload={'category':'Электричество','additional':'','urgency':'Авария','recipient':'Инженерная служба','status':'Назначена','note':'Тест неверной маршрутизации','version':1}
s,j=call('tickets/'+tid,'PATCH',payload);check('Авария не уходит в обычную службу',s==400)
payload['recipient']='Аварийно-диспетчерская служба';payload['note']='Учебная заявка принята диспетчером';s,j=call('tickets/'+tid,'PATCH',payload);check('УК назначает подразделение и статус',s==200 and j['ticket']['status']=='Назначена')
s,stale=call('tickets/'+tid,'PATCH',payload);check('Устаревшая версия не перезаписывает чужие изменения',s==409)
s,view=call('resident/'+tid,token=token);check('Житель видит назначение УК и комментарий',s==200 and view['ticket']['status']=='Назначена' and any('принята диспетчером' in e['note'] for e in view['events']))
payload['version']=view['ticket']['version'];payload['status']='Нужно уточнение';payload['note']='Учебный вопрос: дым идёт сейчас?';s,j=call('tickets/'+tid,'PATCH',payload);check('УК запрашивает уточнение',s==200)
s,j=call('resident/'+tid,'POST',{'note':'Учебный ответ: дым продолжается сейчас.'},token);check('Житель отправляет уточнение, заявка возвращается в обработку',s==200 and j['ticket']['status']=='Назначена')
payload['version']=j['ticket']['version'];payload['status']='Выполнена';payload['note']='Учебный сценарий проверки завершён';s,j=call('tickets/'+tid,'PATCH',payload);check('Завершение видно в общей истории',s==200 and j['ticket']['status']=='Выполнена')
s,j=call('resident/'+tid,'POST',{'note':'После закрытия нельзя добавлять новое событие'},token);check('Закрытая заявка не принимает продолжение новой проблемы',s==400)
s,j=call('tickets','POST',{'text':'Учебное обращение о воде','house':'Д-99'});check('Проверка кода дома на сервере',s==400)
s,j=call('tickets','POST',{'text':'Учебное обращение о воде','house':'Д-01'},origin='https://other.example');check('Чужой сайт не отправляет изменение от имени посетителя',s==403)
out=pathlib.Path(__file__).resolve().parents[1]/'outputs';out.mkdir(exist_ok=True);report={'target':base,'authenticated_account':False,'passed':sum(r['pass'] for r in results),'total':len(results),'results':results};(out/('dashboard_api_tests_public.json' if base.startswith('https:') else 'dashboard_api_tests_local.json')).write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8');print(json.dumps(report,ensure_ascii=False,indent=2))
