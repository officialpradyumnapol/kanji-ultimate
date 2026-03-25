import { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext } from "react";


/* KANJI DATABASE — 2135 kanji across JLPT N5-N1 */
const KD = [
  {id:1,k:'一',m:'one',on:'イチ・イツ',ku:'ひと-',lv:'N5',st:1,cat:'number',rad:'一',mn:'Single horizontal stroke = one',ex:[{w:'一人',r:'ひとり',e:'one person'},{w:'一月',r:'いちがつ',e:'January'}]},
  {id:2,k:'二',m:'two',on:'ニ',ku:'ふた-',lv:'N5',st:2,cat:'number',rad:'二',mn:'Two stacked strokes = two',ex:[{w:'二人',r:'ふたり',e:'two people'},{w:'二月',r:'にがつ',e:'February'}]},
  {id:3,k:'三',m:'three',on:'サン',ku:'み-',lv:'N5',st:3,cat:'number',rad:'三',mn:'Three strokes = three',ex:[{w:'三人',r:'さんにん',e:'three people'},{w:'三月',r:'さんがつ',e:'March'}]},
  {id:4,k:'四',m:'four',on:'シ',ku:'よ・よん',lv:'N5',st:5,cat:'number',rad:'囗',mn:'Box with legs = four',ex:[{w:'四人',r:'よにん',e:'four people'},{w:'四月',r:'しがつ',e:'April'}]},
  {id:5,k:'五',m:'five',on:'ゴ',ku:'いつ-',lv:'N5',st:4,cat:'number',rad:'二',mn:'Strokes crossing = five',ex:[{w:'五人',r:'ごにん',e:'five people'},{w:'五月',r:'ごがつ',e:'May'}]},
  {id:6,k:'六',m:'six',on:'ロク',ku:'む-',lv:'N5',st:4,cat:'number',rad:'八',mn:'Hat on two legs = six',ex:[{w:'六人',r:'ろくにん',e:'six people'},{w:'六月',r:'ろくがつ',e:'June'}]},
  {id:7,k:'七',m:'seven',on:'シチ',ku:'なな-',lv:'N5',st:2,cat:'number',rad:'一',mn:'A severed hook = seven',ex:[{w:'七人',r:'しちにん',e:'seven people'},{w:'七月',r:'しちがつ',e:'July'}]},
  {id:8,k:'八',m:'eight',on:'ハチ',ku:'や-',lv:'N5',st:2,cat:'number',rad:'八',mn:'Arms spreading open = eight',ex:[{w:'八人',r:'はちにん',e:'eight people'},{w:'八月',r:'はちがつ',e:'August'}]},
  {id:9,k:'九',m:'nine',on:'ク・キュウ',ku:'ここの-',lv:'N5',st:2,cat:'number',rad:'乙',mn:'Bent arm nearly at ten',ex:[{w:'九人',r:'くにん',e:'nine people'},{w:'九月',r:'くがつ',e:'September'}]},
  {id:10,k:'十',m:'ten',on:'ジュウ',ku:'とお-',lv:'N5',st:2,cat:'number',rad:'十',mn:'Cross = all ten fingers',ex:[{w:'十人',r:'じゅうにん',e:'ten people'},{w:'十月',r:'じゅうがつ',e:'October'}]},
  {id:11,k:'百',m:'hundred',on:'ヒャク',ku:'',lv:'N5',st:6,cat:'number',rad:'白',mn:'Sun on cliff = hundred',ex:[{w:'百人',r:'ひゃくにん',e:'hundred people'},{w:'百円',r:'ひゃくえん',e:'100 yen'}]},
  {id:12,k:'千',m:'thousand',on:'セン',ku:'ち',lv:'N5',st:3,cat:'number',rad:'十',mn:'Person with bar = thousand',ex:[{w:'千人',r:'せんにん',e:'thousand people'},{w:'三千',r:'さんぜん',e:'3000'}]},
  {id:13,k:'万',m:'ten thousand',on:'マン・バン',ku:'',lv:'N5',st:3,cat:'number',rad:'一',mn:'Scorpion shape = vast number',ex:[{w:'一万',r:'いちまん',e:'ten thousand'},{w:'万年',r:'まんねん',e:'10000 years'}]},
  {id:14,k:'日',m:'sun / day',on:'ニチ・ジツ',ku:'ひ・か',lv:'N5',st:4,cat:'nature',rad:'日',mn:'Square with bar = glowing sun',ex:[{w:'日本',r:'にほん',e:'Japan'},{w:'今日',r:'きょう',e:'today'}]},
  {id:15,k:'月',m:'moon / month',on:'ゲツ・ガツ',ku:'つき',lv:'N5',st:4,cat:'nature',rad:'月',mn:'Crescent moon',ex:[{w:'月曜日',r:'げつようび',e:'Monday'},{w:'今月',r:'こんげつ',e:'this month'}]},
  {id:16,k:'年',m:'year',on:'ネン',ku:'とし',lv:'N5',st:6,cat:'time',rad:'干',mn:'Grain at year end',ex:[{w:'今年',r:'ことし',e:'this year'},{w:'来年',r:'らいねん',e:'next year'}]},
  {id:17,k:'火',m:'fire',on:'カ',ku:'ひ',lv:'N5',st:4,cat:'nature',rad:'火',mn:'Rising flames = fire',ex:[{w:'火曜日',r:'かようび',e:'Tuesday'},{w:'火山',r:'かざん',e:'volcano'}]},
  {id:18,k:'水',m:'water',on:'スイ',ku:'みず',lv:'N5',st:4,cat:'nature',rad:'水',mn:'Drops on central line = water',ex:[{w:'水曜日',r:'すいようび',e:'Wednesday'},{w:'水道',r:'すいどう',e:'waterworks'}]},
  {id:19,k:'木',m:'tree / wood',on:'モク・ボク',ku:'き',lv:'N5',st:4,cat:'nature',rad:'木',mn:'Trunk with branches and roots',ex:[{w:'木曜日',r:'もくようび',e:'Thursday'},{w:'木村',r:'きむら',e:'Kimura (name)'}]},
  {id:20,k:'金',m:'gold / money',on:'キン・コン',ku:'かね・かな-',lv:'N5',st:8,cat:'nature',rad:'金',mn:'Metal buried in earth',ex:[{w:'金曜日',r:'きんようび',e:'Friday'},{w:'お金',r:'おかね',e:'money'}]},
  {id:21,k:'土',m:'earth / soil',on:'ド・ト',ku:'つち',lv:'N5',st:3,cat:'nature',rad:'土',mn:'Cross planted in ground',ex:[{w:'土曜日',r:'どようび',e:'Saturday'},{w:'土地',r:'とち',e:'land'}]},
  {id:22,k:'山',m:'mountain',on:'サン',ku:'やま',lv:'N5',st:3,cat:'nature',rad:'山',mn:'Three majestic peaks',ex:[{w:'山田',r:'やまだ',e:'Yamada (name)'},{w:'富士山',r:'ふじさん',e:'Mt. Fuji'}]},
  {id:23,k:'川',m:'river',on:'セン',ku:'かわ',lv:'N5',st:3,cat:'nature',rad:'川',mn:'Three flowing lines',ex:[{w:'川口',r:'かわぐち',e:'Kawaguchi'},{w:'小川',r:'おがわ',e:'stream'}]},
  {id:24,k:'田',m:'rice paddy',on:'デン',ku:'た',lv:'N5',st:5,cat:'nature',rad:'田',mn:'Irrigation grid in field',ex:[{w:'田中',r:'たなか',e:'Tanaka (name)'},{w:'田舎',r:'いなか',e:'countryside'}]},
  {id:25,k:'人',m:'person',on:'ジン・ニン',ku:'ひと',lv:'N5',st:2,cat:'people',rad:'人',mn:'Two legs walking',ex:[{w:'人口',r:'じんこう',e:'population'},{w:'外国人',r:'がいこくじん',e:'foreigner'}]},
  {id:26,k:'大',m:'big / large',on:'ダイ・タイ',ku:'おお-',lv:'N5',st:3,cat:'people',rad:'大',mn:'Person with arms spread wide',ex:[{w:'大学',r:'だいがく',e:'university'},{w:'大切',r:'たいせつ',e:'important'}]},
  {id:27,k:'小',m:'small',on:'ショウ',ku:'ちい- こ- お-',lv:'N5',st:3,cat:'people',rad:'小',mn:'Three dots pinched = small',ex:[{w:'小学校',r:'しょうがっこう',e:'elementary school'},{w:'小さい',r:'ちいさい',e:'small'}]},
  {id:28,k:'中',m:'middle / inside',on:'チュウ',ku:'なか',lv:'N5',st:4,cat:'direction',rad:'丨',mn:'Line piercing box = middle',ex:[{w:'中国',r:'ちゅうごく',e:'China'},{w:'中学校',r:'ちゅうがっこう',e:'middle school'}]},
  {id:29,k:'上',m:'up / above',on:'ジョウ',ku:'うえ・あ-',lv:'N5',st:3,cat:'direction',rad:'一',mn:'Arrow pointing upward',ex:[{w:'上手',r:'じょうず',e:'skilled'},{w:'上る',r:'のぼる',e:'to go up'}]},
  {id:30,k:'下',m:'down / below',on:'カ・ゲ',ku:'した・さ-',lv:'N5',st:3,cat:'direction',rad:'一',mn:'Downward arrow',ex:[{w:'下手',r:'へた',e:'unskilled'},{w:'下る',r:'くだる',e:'to go down'}]},
  {id:31,k:'本',m:'book / origin',on:'ホン',ku:'もと',lv:'N5',st:5,cat:'school',rad:'木',mn:'Tree with root-mark at base',ex:[{w:'日本',r:'にほん',e:'Japan'},{w:'本屋',r:'ほんや',e:'bookstore'}]},
  {id:32,k:'国',m:'country',on:'コク',ku:'くに',lv:'N5',st:8,cat:'place',rad:'囗',mn:'Jewel within border',ex:[{w:'外国',r:'がいこく',e:'foreign country'},{w:'国語',r:'こくご',e:'Japanese class'}]},
  {id:33,k:'語',m:'language',on:'ゴ',ku:'かた-',lv:'N5',st:14,cat:'school',rad:'言',mn:'Words + self = language',ex:[{w:'日本語',r:'にほんご',e:'Japanese'},{w:'英語',r:'えいご',e:'English'}]},
  {id:34,k:'学',m:'study / learn',on:'ガク',ku:'まな-',lv:'N5',st:8,cat:'school',rad:'子',mn:'Child under roof = study',ex:[{w:'学校',r:'がっこう',e:'school'},{w:'大学生',r:'だいがくせい',e:'university student'}]},
  {id:35,k:'校',m:'school',on:'コウ',ku:'',lv:'N5',st:10,cat:'school',rad:'木',mn:'Tree + compare = school',ex:[{w:'学校',r:'がっこう',e:'school'},{w:'高校',r:'こうこう',e:'high school'}]},
  {id:36,k:'先',m:'before / ahead',on:'セン',ku:'さき',lv:'N5',st:6,cat:'school',rad:'儿',mn:'Plant sprouting ahead',ex:[{w:'先生',r:'せんせい',e:'teacher'},{w:'先週',r:'せんしゅう',e:'last week'}]},
  {id:37,k:'生',m:'life / birth',on:'セイ・ショウ',ku:'い- う- なま',lv:'N5',st:5,cat:'school',rad:'生',mn:'Plant pushing through earth',ex:[{w:'先生',r:'せんせい',e:'teacher'},{w:'学生',r:'がくせい',e:'student'}]},
  {id:38,k:'女',m:'woman',on:'ジョ・ニョ',ku:'おんな め-',lv:'N5',st:3,cat:'people',rad:'女',mn:'Graceful kneeling figure',ex:[{w:'女性',r:'じょせい',e:'female'},{w:'彼女',r:'かのじょ',e:'girlfriend / she'}]},
  {id:39,k:'男',m:'man',on:'ダン・ナン',ku:'おとこ',lv:'N5',st:7,cat:'people',rad:'田',mn:'Rice field + strength',ex:[{w:'男性',r:'だんせい',e:'male'},{w:'男子',r:'だんし',e:'boy'}]},
  {id:40,k:'子',m:'child',on:'シ・ス',ku:'こ',lv:'N5',st:3,cat:'people',rad:'子',mn:'Baby with outstretched arms',ex:[{w:'子供',r:'こども',e:'child'},{w:'女子',r:'じょし',e:'girl'}]},
  {id:41,k:'父',m:'father',on:'フ',ku:'ちち',lv:'N5',st:4,cat:'people',rad:'父',mn:'Crossed sticks as tool = father',ex:[{w:'お父さん',r:'おとうさん',e:'father (polite)'},{w:'父親',r:'ちちおや',e:'father'}]},
  {id:42,k:'母',m:'mother',on:'ボ',ku:'はは',lv:'N5',st:5,cat:'people',rad:'母',mn:'Nursing woman with dots',ex:[{w:'お母さん',r:'おかあさん',e:'mother (polite)'},{w:'母親',r:'ははおや',e:'mother'}]},
  {id:43,k:'見',m:'see / look',on:'ケン',ku:'み-',lv:'N5',st:7,cat:'action',rad:'見',mn:'Eye mounted on legs',ex:[{w:'見る',r:'みる',e:'to see'},{w:'見学',r:'けんがく',e:'study tour'}]},
  {id:44,k:'聞',m:'hear / listen',on:'ブン・モン',ku:'き- きこ-',lv:'N5',st:14,cat:'action',rad:'耳',mn:'Ear pressed to gate',ex:[{w:'聞く',r:'きく',e:'to listen'},{w:'新聞',r:'しんぶん',e:'newspaper'}]},
  {id:45,k:'話',m:'speak / story',on:'ワ',ku:'はな- はなし',lv:'N5',st:13,cat:'action',rad:'言',mn:'Words + tongue = speak',ex:[{w:'話す',r:'はなす',e:'to speak'},{w:'電話',r:'でんわ',e:'telephone'}]},
  {id:46,k:'言',m:'say / speak',on:'ゲン・ゴン',ku:'い- こと',lv:'N5',st:7,cat:'action',rad:'言',mn:'Mouth with ripple waves',ex:[{w:'言う',r:'いう',e:'to say'},{w:'言語',r:'げんご',e:'language'}]},
  {id:47,k:'読',m:'read',on:'ドク・トク',ku:'よ-',lv:'N5',st:14,cat:'action',rad:'言',mn:'Words by merchant = read',ex:[{w:'読む',r:'よむ',e:'to read'},{w:'読書',r:'どくしょ',e:'reading books'}]},
  {id:48,k:'書',m:'write',on:'ショ',ku:'か-',lv:'N5',st:10,cat:'action',rad:'曰',mn:'Calligraphy brush on paper',ex:[{w:'書く',r:'かく',e:'to write'},{w:'図書館',r:'としょかん',e:'library'}]},
  {id:49,k:'食',m:'eat / food',on:'ショク・ジキ',ku:'た- く-',lv:'N5',st:9,cat:'action',rad:'食',mn:'Person leaning over table',ex:[{w:'食べる',r:'たべる',e:'to eat'},{w:'食堂',r:'しょくどう',e:'cafeteria'}]},
  {id:50,k:'飲',m:'drink',on:'イン',ku:'の-',lv:'N5',st:12,cat:'action',rad:'食',mn:'Mouth open + yawn = drink',ex:[{w:'飲む',r:'のむ',e:'to drink'},{w:'飲み物',r:'のみもの',e:'beverage'}]},
  {id:51,k:'行',m:'go / travel',on:'コウ・ギョウ',ku:'い- ゆ-',lv:'N5',st:6,cat:'action',rad:'行',mn:'Crossroads = go',ex:[{w:'行く',r:'いく',e:'to go'},{w:'旅行',r:'りょこう',e:'travel'}]},
  {id:52,k:'来',m:'come',on:'ライ',ku:'く- き- こ-',lv:'N5',st:7,cat:'action',rad:'木',mn:'Wheat arriving = come',ex:[{w:'来る',r:'くる',e:'to come'},{w:'来年',r:'らいねん',e:'next year'}]},
  {id:53,k:'出',m:'exit / go out',on:'シュツ・スイ',ku:'で- だ-',lv:'N5',st:5,cat:'action',rad:'凵',mn:'Plant sprouting = emerge',ex:[{w:'出る',r:'でる',e:'to go out'},{w:'出口',r:'でぐち',e:'exit'}]},
  {id:54,k:'入',m:'enter',on:'ニュウ',ku:'い- はい-',lv:'N5',st:2,cat:'action',rad:'入',mn:'Legs stepping inward',ex:[{w:'入る',r:'はいる',e:'to enter'},{w:'入口',r:'いりぐち',e:'entrance'}]},
  {id:55,k:'口',m:'mouth',on:'コウ・ク',ku:'くち',lv:'N5',st:3,cat:'body',rad:'口',mn:'Open square = open mouth',ex:[{w:'出口',r:'でぐち',e:'exit'},{w:'人口',r:'じんこう',e:'population'}]},
  {id:56,k:'手',m:'hand',on:'シュ',ku:'て',lv:'N5',st:4,cat:'body',rad:'手',mn:'Five fingers spread',ex:[{w:'手紙',r:'てがみ',e:'letter'},{w:'手伝う',r:'てつだう',e:'to help'}]},
  {id:57,k:'目',m:'eye',on:'モク・ボク',ku:'め',lv:'N5',st:5,cat:'body',rad:'目',mn:'Oval with pupil dot',ex:[{w:'目玉',r:'めだま',e:'eyeball'},{w:'目的',r:'もくてき',e:'purpose'}]},
  {id:58,k:'耳',m:'ear',on:'ジ',ku:'みみ',lv:'N5',st:6,cat:'body',rad:'耳',mn:'Window-like = outer ear',ex:[{w:'耳元',r:'みみもと',e:'near the ear'},{w:'耳鳴り',r:'みみなり',e:'tinnitus'}]},
  {id:59,k:'気',m:'spirit / energy',on:'キ・ケ',ku:'',lv:'N5',st:6,cat:'nature',rad:'气',mn:'Steam from rice = vital spirit',ex:[{w:'元気',r:'げんき',e:'healthy'},{w:'天気',r:'てんき',e:'weather'}]},
  {id:60,k:'電',m:'electricity',on:'デン',ku:'',lv:'N5',st:13,cat:'tech',rad:'雨',mn:'Rain clouds + lightning',ex:[{w:'電話',r:'でんわ',e:'telephone'},{w:'電車',r:'でんしゃ',e:'train'}]},
  {id:61,k:'車',m:'vehicle',on:'シャ',ku:'くるま',lv:'N5',st:7,cat:'tech',rad:'車',mn:'Wheel with axle from above',ex:[{w:'電車',r:'でんしゃ',e:'train'},{w:'自動車',r:'じどうしゃ',e:'automobile'}]},
  {id:62,k:'駅',m:'station',on:'エキ',ku:'',lv:'N5',st:14,cat:'place',rad:'馬',mn:'Where horses stopped = station',ex:[{w:'駅前',r:'えきまえ',e:'in front of station'},{w:'終点駅',r:'しゅうてんえき',e:'terminal'}]},
  {id:63,k:'時',m:'time / hour',on:'ジ',ku:'とき',lv:'N5',st:10,cat:'time',rad:'日',mn:'Sun + temple = hours',ex:[{w:'時間',r:'じかん',e:'time'},{w:'何時',r:'なんじ',e:'what time'}]},
  {id:64,k:'分',m:'minute / understand',on:'ブン・フン',ku:'わ-',lv:'N5',st:4,cat:'time',rad:'刀',mn:'Knife splitting = minute',ex:[{w:'五分',r:'ごふん',e:'5 minutes'},{w:'分かる',r:'わかる',e:'to understand'}]},
  {id:65,k:'何',m:'what',on:'カ',ku:'なに・なん',lv:'N5',st:7,cat:'other',rad:'人',mn:'Person carrying unknown',ex:[{w:'何時',r:'なんじ',e:'what time'},{w:'何人',r:'なんにん',e:'how many'}]},
  {id:66,k:'今',m:'now',on:'コン・キン',ku:'いま',lv:'N5',st:4,cat:'time',rad:'人',mn:'People gathering = now',ex:[{w:'今日',r:'きょう',e:'today'},{w:'今年',r:'ことし',e:'this year'}]},
  {id:67,k:'東',m:'east',on:'トウ',ku:'ひがし',lv:'N5',st:8,cat:'direction',rad:'木',mn:'Sun rising through tree',ex:[{w:'東京',r:'とうきょう',e:'Tokyo'},{w:'東口',r:'ひがしぐち',e:'east exit'}]},
  {id:68,k:'西',m:'west',on:'セイ・サイ',ku:'にし',lv:'N5',st:6,cat:'direction',rad:'覀',mn:'Bird at nest at sunset',ex:[{w:'西口',r:'にしぐち',e:'west exit'},{w:'関西',r:'かんさい',e:'Kansai'}]},
  {id:69,k:'南',m:'south',on:'ナン',ku:'みなみ',lv:'N5',st:9,cat:'direction',rad:'十',mn:'Tent with cross-frame = warm south',ex:[{w:'南口',r:'みなみぐち',e:'south exit'},{w:'南米',r:'なんべい',e:'South America'}]},
  {id:70,k:'北',m:'north',on:'ホク',ku:'きた',lv:'N5',st:5,cat:'direction',rad:'匕',mn:'Two backs to cold = north',ex:[{w:'北口',r:'きたぐち',e:'north exit'},{w:'北海道',r:'ほっかいどう',e:'Hokkaido'}]},
  {id:71,k:'外',m:'outside',on:'ガイ・ゲ',ku:'そと・はず-',lv:'N5',st:5,cat:'direction',rad:'夕',mn:'Evening + divination = outside',ex:[{w:'外国',r:'がいこく',e:'foreign country'},{w:'外出',r:'がいしゅつ',e:'going out'}]},
  {id:72,k:'天',m:'heaven / sky',on:'テン',ku:'あめ・あま-',lv:'N5',st:4,cat:'nature',rad:'大',mn:'Big person under ceiling = sky',ex:[{w:'天気',r:'てんき',e:'weather'},{w:'天国',r:'てんごく',e:'heaven'}]},
  {id:73,k:'空',m:'sky / empty',on:'クウ',ku:'そら・あ-',lv:'N5',st:8,cat:'nature',rad:'穴',mn:'Hole + work = hollow sky',ex:[{w:'空気',r:'くうき',e:'air'},{w:'空港',r:'くうこう',e:'airport'}]},
  {id:74,k:'花',m:'flower',on:'カ',ku:'はな',lv:'N5',st:7,cat:'nature',rad:'艸',mn:'Plant that transforms = flower',ex:[{w:'花火',r:'はなび',e:'fireworks'},{w:'花壇',r:'かだん',e:'flower bed'}]},
  {id:75,k:'雨',m:'rain',on:'ウ',ku:'あめ・あま-',lv:'N5',st:8,cat:'nature',rad:'雨',mn:'Clouds with falling drops',ex:[{w:'雨天',r:'うてん',e:'rainy weather'},{w:'大雨',r:'おおあめ',e:'heavy rain'}]},
  {id:76,k:'白',m:'white',on:'ハク・ビャク',ku:'しろ・しら-',lv:'N5',st:5,cat:'color',rad:'白',mn:'Sun\'s bright light = white',ex:[{w:'白い',r:'しろい',e:'white'},{w:'白米',r:'はくまい',e:'white rice'}]},
  {id:77,k:'赤',m:'red',on:'セキ・シャク',ku:'あか-',lv:'N5',st:7,cat:'color',rad:'赤',mn:'Big + fire = red',ex:[{w:'赤い',r:'あかい',e:'red'},{w:'赤ちゃん',r:'あかちゃん',e:'baby'}]},
  {id:78,k:'青',m:'blue',on:'セイ・ショウ',ku:'あお-',lv:'N5',st:8,cat:'color',rad:'青',mn:'Living plant color = blue',ex:[{w:'青い',r:'あおい',e:'blue'},{w:'青空',r:'あおぞら',e:'blue sky'}]},
  {id:79,k:'高',m:'tall / expensive',on:'コウ',ku:'たか-',lv:'N5',st:10,cat:'description',rad:'高',mn:'Tall tower on stand',ex:[{w:'高い',r:'たかい',e:'expensive / tall'},{w:'高校',r:'こうこう',e:'high school'}]},
  {id:80,k:'長',m:'long / chief',on:'チョウ',ku:'なが-',lv:'N5',st:8,cat:'description',rad:'長',mn:'Long-haired elder',ex:[{w:'長い',r:'ながい',e:'long'},{w:'社長',r:'しゃちょう',e:'company president'}]},
  {id:81,k:'古',m:'old',on:'コ',ku:'ふる-',lv:'N5',st:5,cat:'description',rad:'口',mn:'Ten generations old',ex:[{w:'古い',r:'ふるい',e:'old'},{w:'古典',r:'こてん',e:'classics'}]},
  {id:82,k:'会',m:'meeting / meet',on:'カイ・エ',ku:'あ-',lv:'N4',st:6,cat:'action',rad:'人',mn:'People gathering under roof',ex:[{w:'会社',r:'かいしゃ',e:'company'},{w:'会議',r:'かいぎ',e:'meeting'}]},
  {id:83,k:'同',m:'same',on:'ドウ',ku:'おな-',lv:'N4',st:6,cat:'description',rad:'囗',mn:'Box with shared content = same',ex:[{w:'同じ',r:'おなじ',e:'same'},{w:'同時',r:'どうじ',e:'simultaneous'}]},
  {id:84,k:'事',m:'matter / thing',on:'ジ・ズ',ku:'こと',lv:'N4',st:8,cat:'other',rad:'亅',mn:'Hand holding brush = affair',ex:[{w:'仕事',r:'しごと',e:'work'},{w:'大事',r:'だいじ',e:'important'}]},
  {id:85,k:'自',m:'self',on:'ジ・シ',ku:'みずか-',lv:'N4',st:6,cat:'people',rad:'自',mn:'Nose pointing to oneself',ex:[{w:'自分',r:'じぶん',e:'oneself'},{w:'自転車',r:'じてんしゃ',e:'bicycle'}]},
  {id:86,k:'社',m:'company / shrine',on:'シャ',ku:'やしろ',lv:'N4',st:7,cat:'place',rad:'示',mn:'Spirit + earth = shrine/company',ex:[{w:'会社',r:'かいしゃ',e:'company'},{w:'神社',r:'じんじゃ',e:'shrine'}]},
  {id:87,k:'発',m:'depart / emit',on:'ハツ・ホツ',ku:'',lv:'N4',st:9,cat:'action',rad:'癶',mn:'Feet + bow launching = emit',ex:[{w:'出発',r:'しゅっぱつ',e:'departure'},{w:'発音',r:'はつおん',e:'pronunciation'}]},
  {id:88,k:'者',m:'person (suffix)',on:'シャ',ku:'もの',lv:'N4',st:8,cat:'people',rad:'老',mn:'Old person with cane',ex:[{w:'医者',r:'いしゃ',e:'doctor'},{w:'作者',r:'さくしゃ',e:'author'}]},
  {id:89,k:'地',m:'ground / earth',on:'チ・ジ',ku:'',lv:'N4',st:6,cat:'nature',rad:'土',mn:'Earth + snake winding = ground',ex:[{w:'地下',r:'ちか',e:'underground'},{w:'土地',r:'とち',e:'land'}]},
  {id:90,k:'業',m:'work / industry',on:'ギョウ・ゴウ',ku:'',lv:'N4',st:13,cat:'work',rad:'木',mn:'Tree with axe = craft/work',ex:[{w:'授業',r:'じゅぎょう',e:'class'},{w:'工業',r:'こうぎょう',e:'industry'}]},
  {id:91,k:'方',m:'direction / way',on:'ホウ',ku:'かた',lv:'N4',st:4,cat:'other',rad:'方',mn:'Square + handle = direction',ex:[{w:'方法',r:'ほうほう',e:'method'},{w:'地方',r:'ちほう',e:'region'}]},
  {id:92,k:'新',m:'new',on:'シン',ku:'あたら- にい-',lv:'N4',st:13,cat:'description',rad:'斤',mn:'Standing tree chopped = new',ex:[{w:'新しい',r:'あたらしい',e:'new'},{w:'新聞',r:'しんぶん',e:'newspaper'}]},
  {id:93,k:'場',m:'place / field',on:'ジョウ',ku:'ば',lv:'N4',st:12,cat:'place',rad:'土',mn:'Sun + earth = open place',ex:[{w:'場所',r:'ばしょ',e:'place'},{w:'工場',r:'こうじょう',e:'factory'}]},
  {id:94,k:'員',m:'member',on:'イン',ku:'',lv:'N4',st:10,cat:'people',rad:'口',mn:'Pot + shell = member of group',ex:[{w:'会員',r:'かいいん',e:'member'},{w:'店員',r:'てんいん',e:'store clerk'}]},
  {id:95,k:'立',m:'stand',on:'リツ・リュウ',ku:'た-',lv:'N4',st:5,cat:'action',rad:'立',mn:'Person standing on ground',ex:[{w:'立つ',r:'たつ',e:'to stand'},{w:'国立',r:'こくりつ',e:'national'}]},
  {id:96,k:'開',m:'open',on:'カイ',ku:'ひら- あ-',lv:'N4',st:12,cat:'action',rad:'門',mn:'Hands opening gate = open',ex:[{w:'開く',r:'ひらく',e:'to open'},{w:'開始',r:'かいし',e:'start'}]},
  {id:97,k:'手',m:'hand',on:'シュ',ku:'て',lv:'N4',st:4,cat:'body',rad:'手',mn:'Five fingers spread',ex:[{w:'手紙',r:'てがみ',e:'letter'},{w:'上手',r:'じょうず',e:'skilled'}]},
  {id:98,k:'力',m:'power / strength',on:'リョク・リキ',ku:'ちから',lv:'N4',st:2,cat:'body',rad:'力',mn:'Flexed muscle = strength',ex:[{w:'力持ち',r:'ちからもち',e:'strong person'},{w:'努力',r:'どりょく',e:'effort'}]},
  {id:99,k:'問',m:'question / problem',on:'モン',ku:'と-',lv:'N4',st:11,cat:'school',rad:'口',mn:'Mouth + gate = to question',ex:[{w:'問題',r:'もんだい',e:'problem'},{w:'質問',r:'しつもん',e:'question'}]},
  {id:100,k:'代',m:'generation / substitute',on:'ダイ・タイ',ku:'か- よ',lv:'N4',st:5,cat:'time',rad:'人',mn:'Person with lance = replace',ex:[{w:'時代',r:'じだい',e:'era'},{w:'代わり',r:'かわり',e:'substitute'}]},
  {id:101,k:'知',m:'know',on:'チ',ku:'し-',lv:'N4',st:8,cat:'action',rad:'矢',mn:'Arrow reaching target = know',ex:[{w:'知る',r:'しる',e:'to know'},{w:'知識',r:'ちしき',e:'knowledge'}]},
  {id:102,k:'気',m:'spirit / energy',on:'キ・ケ',ku:'',lv:'N4',st:6,cat:'nature',rad:'气',mn:'Steam from rice = vital spirit',ex:[{w:'元気',r:'げんき',e:'healthy'},{w:'人気',r:'にんき',e:'popularity'}]},
  {id:103,k:'正',m:'correct / right',on:'セイ・ショウ',ku:'ただ- まさ-',lv:'N4',st:5,cat:'description',rad:'止',mn:'Foot going straight = correct',ex:[{w:'正しい',r:'ただしい',e:'correct'},{w:'正月',r:'しょうがつ',e:'New Year'}]},
  {id:104,k:'道',m:'road / way',on:'ドウ・トウ',ku:'みち',lv:'N4',st:12,cat:'place',rad:'行',mn:'Head + walking = path/way',ex:[{w:'道路',r:'どうろ',e:'road'},{w:'北海道',r:'ほっかいどう',e:'Hokkaido'}]},
  {id:105,k:'意',m:'meaning / intention',on:'イ',ku:'',lv:'N4',st:13,cat:'mind',rad:'心',mn:'Sound from the heart = intention',ex:[{w:'意味',r:'いみ',e:'meaning'},{w:'注意',r:'ちゅうい',e:'caution'}]},
  {id:106,k:'毎',m:'every',on:'マイ',ku:'',lv:'N4',st:6,cat:'time',rad:'母',mn:'Every mother = every time',ex:[{w:'毎日',r:'まいにち',e:'every day'},{w:'毎朝',r:'まいあさ',e:'every morning'}]},
  {id:107,k:'安',m:'cheap / safe',on:'アン',ku:'やす-',lv:'N4',st:6,cat:'description',rad:'女',mn:'Woman under roof = at ease',ex:[{w:'安い',r:'やすい',e:'cheap'},{w:'安全',r:'あんぜん',e:'safety'}]},
  {id:108,k:'多',m:'many',on:'タ',ku:'おお-',lv:'N4',st:6,cat:'number',rad:'夕',mn:'Two evenings = many',ex:[{w:'多い',r:'おおい',e:'many'},{w:'多分',r:'たぶん',e:'probably'}]},
  {id:109,k:'少',m:'few / little',on:'ショウ',ku:'すこ- すくな-',lv:'N4',st:4,cat:'number',rad:'小',mn:'Small thing = few',ex:[{w:'少し',r:'すこし',e:'a little'},{w:'少年',r:'しょうねん',e:'boy'}]},
  {id:110,k:'好',m:'like / fond of',on:'コウ',ku:'す- この-',lv:'N4',st:6,cat:'feeling',rad:'女',mn:'Woman + child = to like',ex:[{w:'好き',r:'すき',e:'to like'},{w:'好物',r:'こうぶつ',e:'favorite food'}]},
  {id:111,k:'思',m:'think',on:'シ',ku:'おも-',lv:'N4',st:9,cat:'mind',rad:'心',mn:'Brain + heart = think',ex:[{w:'思う',r:'おもう',e:'to think'},{w:'思い出',r:'おもいで',e:'memory'}]},
  {id:112,k:'使',m:'use',on:'シ',ku:'つか-',lv:'N4',st:8,cat:'action',rad:'人',mn:'Person following instructions',ex:[{w:'使う',r:'つかう',e:'to use'},{w:'大使',r:'たいし',e:'ambassador'}]},
  {id:113,k:'持',m:'hold / have',on:'ジ',ku:'も-',lv:'N4',st:9,cat:'action',rad:'手',mn:'Hand + temple = hold',ex:[{w:'持つ',r:'もつ',e:'to hold'},{w:'気持ち',r:'きもち',e:'feeling'}]},
  {id:114,k:'作',m:'make / create',on:'サク・サ',ku:'つく-',lv:'N4',st:7,cat:'action',rad:'人',mn:'Person using saw = make',ex:[{w:'作る',r:'つくる',e:'to make'},{w:'作品',r:'さくひん',e:'work of art'}]},
  {id:115,k:'帰',m:'return home',on:'キ',ku:'かえ-',lv:'N4',st:10,cat:'action',rad:'巾',mn:'Broom + return = go home',ex:[{w:'帰る',r:'かえる',e:'to return'},{w:'帰国',r:'きこく',e:'return to country'}]},
  {id:116,k:'起',m:'get up / happen',on:'キ',ku:'お-',lv:'N4',st:10,cat:'action',rad:'走',mn:'Run + oneself = rise up',ex:[{w:'起きる',r:'おきる',e:'to wake up'},{w:'起こす',r:'おこす',e:'to cause'}]},
  {id:117,k:'明',m:'bright / clear',on:'メイ・ミョウ',ku:'あか- あき- あ-',lv:'N4',st:8,cat:'description',rad:'日',mn:'Sun + moon = bright',ex:[{w:'明るい',r:'あかるい',e:'bright'},{w:'説明',r:'せつめい',e:'explanation'}]},
  {id:118,k:'近',m:'near',on:'キン',ku:'ちか-',lv:'N4',st:7,cat:'direction',rad:'辶',mn:'Walking near axe = close',ex:[{w:'近い',r:'ちかい',e:'near'},{w:'近所',r:'きんじょ',e:'neighborhood'}]},
  {id:119,k:'遠',m:'far',on:'エン・オン',ku:'とお-',lv:'N4',st:13,cat:'direction',rad:'辶',mn:'Long road = far away',ex:[{w:'遠い',r:'とおい',e:'far'},{w:'遠足',r:'えんそく',e:'field trip'}]},
  {id:120,k:'早',m:'early / fast',on:'ソウ・サッ',ku:'はや-',lv:'N4',st:6,cat:'time',rad:'日',mn:'Sun barely over horizon = early',ex:[{w:'早い',r:'はやい',e:'early / fast'},{w:'早朝',r:'そうちょう',e:'early morning'}]},
  {id:121,k:'黒',m:'black',on:'コク',ku:'くろ-',lv:'N4',st:11,cat:'color',rad:'黒',mn:'Smudged window = black',ex:[{w:'黒い',r:'くろい',e:'black'},{w:'黒板',r:'こくばん',e:'blackboard'}]},
  {id:122,k:'色',m:'color',on:'ショク・シキ',ku:'いろ',lv:'N4',st:6,cat:'color',rad:'色',mn:'Kneeling person = desire/color',ex:[{w:'色々',r:'いろいろ',e:'various'},{w:'茶色',r:'ちゃいろ',e:'brown'}]},
  {id:123,k:'体',m:'body',on:'タイ・テイ',ku:'からだ',lv:'N4',st:7,cat:'body',rad:'人',mn:'Person + origin = body',ex:[{w:'体育',r:'たいいく',e:'physical education'},{w:'体重',r:'たいじゅう',e:'body weight'}]},
  {id:124,k:'頭',m:'head',on:'トウ・ズ・ト',ku:'あたま・かしら',lv:'N4',st:16,cat:'body',rad:'頁',mn:'Bean + head = head',ex:[{w:'頭痛',r:'ずつう',e:'headache'},{w:'頭がいい',r:'あたまがいい',e:'smart'}]},
  {id:125,k:'足',m:'foot / enough',on:'ソク',ku:'あし た-',lv:'N4',st:7,cat:'body',rad:'足',mn:'Leg + knee = foot',ex:[{w:'足',r:'あし',e:'foot / leg'},{w:'満足',r:'まんぞく',e:'satisfaction'}]},
  {id:126,k:'顔',m:'face',on:'ガン',ku:'かお',lv:'N4',st:18,cat:'body',rad:'頁',mn:'River + head = face',ex:[{w:'顔色',r:'かおいろ',e:'complexion'},{w:'笑顔',r:'えがお',e:'smiling face'}]},
  {id:127,k:'心',m:'heart / mind',on:'シン',ku:'こころ',lv:'N4',st:4,cat:'mind',rad:'心',mn:'Three drops in organ = heart',ex:[{w:'心配',r:'しんぱい',e:'worry'},{w:'安心',r:'あんしん',e:'relief'}]},
  {id:128,k:'声',m:'voice',on:'セイ・ショウ',ku:'こえ',lv:'N4',st:7,cat:'body',rad:'士',mn:'Hammering sound = voice',ex:[{w:'声',r:'こえ',e:'voice'},{w:'大声',r:'おおごえ',e:'loud voice'}]},
  {id:129,k:'名',m:'name / famous',on:'メイ・ミョウ',ku:'な',lv:'N4',st:6,cat:'other',rad:'夕',mn:'Evening + mouth = call by name',ex:[{w:'名前',r:'なまえ',e:'name'},{w:'有名',r:'ゆうめい',e:'famous'}]},
  {id:130,k:'友',m:'friend',on:'ユウ',ku:'とも',lv:'N4',st:4,cat:'people',rad:'又',mn:'Two hands clasping = friend',ex:[{w:'友達',r:'ともだち',e:'friend'},{w:'友人',r:'ゆうじん',e:'friend (formal)'}]},
  {id:131,k:'家',m:'house / family',on:'カ・ケ',ku:'いえ・や',lv:'N4',st:10,cat:'place',rad:'宀',mn:'Pig under roof = household',ex:[{w:'家族',r:'かぞく',e:'family'},{w:'家庭',r:'かてい',e:'home'}]},
  {id:132,k:'店',m:'shop',on:'テン',ku:'みせ',lv:'N4',st:8,cat:'place',rad:'广',mn:'Shelter + divination = shop',ex:[{w:'店員',r:'てんいん',e:'store clerk'},{w:'本店',r:'ほんてん',e:'main shop'}]},
  {id:133,k:'町',m:'town',on:'チョウ',ku:'まち',lv:'N4',st:7,cat:'place',rad:'田',mn:'Rice field + stake = town',ex:[{w:'町',r:'まち',e:'town'},{w:'下町',r:'したまち',e:'old town'}]},
  {id:134,k:'市',m:'city',on:'シ',ku:'いち',lv:'N4',st:5,cat:'place',rad:'巾',mn:'Streets meeting = market/city',ex:[{w:'市場',r:'いちば',e:'market'},{w:'都市',r:'とし',e:'city'}]},
  {id:135,k:'村',m:'village',on:'ソン',ku:'むら',lv:'N4',st:7,cat:'place',rad:'木',mn:'Tree + measurement = village',ex:[{w:'村',r:'むら',e:'village'},{w:'農村',r:'のうそん',e:'farming village'}]},
  {id:136,k:'強',m:'strong',on:'キョウ・ゴウ',ku:'つよ-',lv:'N4',st:11,cat:'description',rad:'弓',mn:'Bow + beetle = strong',ex:[{w:'強い',r:'つよい',e:'strong'},{w:'勉強',r:'べんきょう',e:'study'}]},
  {id:137,k:'弱',m:'weak',on:'ジャク',ku:'よわ-',lv:'N4',st:10,cat:'description',rad:'弓',mn:'Two wilted bows = weak',ex:[{w:'弱い',r:'よわい',e:'weak'},{w:'弱点',r:'じゃくてん',e:'weakness'}]},
  {id:138,k:'太',m:'fat / thick',on:'タイ・タ',ku:'ふと-',lv:'N4',st:4,cat:'description',rad:'大',mn:'Big + dot = fat',ex:[{w:'太い',r:'ふとい',e:'fat / thick'},{w:'太陽',r:'たいよう',e:'sun'}]},
  {id:139,k:'細',m:'thin / detailed',on:'サイ',ku:'ほそ- こま-',lv:'N4',st:11,cat:'description',rad:'糸',mn:'Thread + field = thin',ex:[{w:'細い',r:'ほそい',e:'thin'},{w:'細かい',r:'こまかい',e:'detailed'}]},
  {id:140,k:'重',m:'heavy / important',on:'ジュウ・チョウ',ku:'おも- かさ-',lv:'N4',st:9,cat:'description',rad:'里',mn:'Wrapped person = heavy',ex:[{w:'重い',r:'おもい',e:'heavy'},{w:'重要',r:'じゅうよう',e:'important'}]},
  {id:141,k:'軽',m:'light (weight)',on:'ケイ',ku:'かる-',lv:'N4',st:12,cat:'description',rad:'車',mn:'Cart + flowing water = light',ex:[{w:'軽い',r:'かるい',e:'light'},{w:'軽食',r:'けいしょく',e:'light meal'}]},
  {id:142,k:'暑',m:'hot (weather)',on:'ショ',ku:'あつ-',lv:'N4',st:12,cat:'description',rad:'日',mn:'Sun + person = summer heat',ex:[{w:'暑い',r:'あつい',e:'hot'},{w:'暑さ',r:'あつさ',e:'heat'}]},
  {id:143,k:'寒',m:'cold (weather)',on:'カン',ku:'さむ-',lv:'N4',st:12,cat:'description',rad:'宀',mn:'House with frost = cold',ex:[{w:'寒い',r:'さむい',e:'cold'},{w:'寒さ',r:'さむさ',e:'cold (noun)'}]},
  {id:144,k:'楽',m:'fun / comfortable',on:'ガク・ラク',ku:'たの- らく',lv:'N4',st:13,cat:'feeling',rad:'木',mn:'Bells on stand = music / ease',ex:[{w:'楽しい',r:'たのしい',e:'fun'},{w:'音楽',r:'おんがく',e:'music'}]},
  {id:145,k:'難',m:'difficult',on:'ナン',ku:'むずか- むつか-',lv:'N4',st:18,cat:'description',rad:'隹',mn:'Bird in fire = difficult',ex:[{w:'難しい',r:'むずかしい',e:'difficult'},{w:'困難',r:'こんなん',e:'difficulty'}]},
  {id:146,k:'易',m:'easy / exchange',on:'イ・エキ',ku:'やさ-',lv:'N4',st:8,cat:'description',rad:'日',mn:'Sun changing = easy / exchange',ex:[{w:'易しい',r:'やさしい',e:'easy'},{w:'貿易',r:'ぼうえき',e:'trade'}]},
  {id:147,k:'病',m:'illness',on:'ビョウ・ヘイ',ku:'やまい',lv:'N4',st:10,cat:'health',rad:'疒',mn:'Sickbed = illness',ex:[{w:'病気',r:'びょうき',e:'illness'},{w:'病院',r:'びょういん',e:'hospital'}]},
  {id:148,k:'医',m:'medicine / doctor',on:'イ',ku:'',lv:'N4',st:7,cat:'health',rad:'匸',mn:'Box + arrow = heal',ex:[{w:'医者',r:'いしゃ',e:'doctor'},{w:'医学',r:'いがく',e:'medical science'}]},
  {id:149,k:'薬',m:'medicine',on:'ヤク',ku:'くすり',lv:'N4',st:16,cat:'health',rad:'艸',mn:'Plant + pleasure = medicine',ex:[{w:'薬',r:'くすり',e:'medicine'},{w:'薬局',r:'やっきょく',e:'pharmacy'}]},
  {id:150,k:'急',m:'hurry / sudden',on:'キュウ',ku:'いそ-',lv:'N4',st:9,cat:'action',rad:'心',mn:'Reaching heart = urgency',ex:[{w:'急ぐ',r:'いそぐ',e:'to hurry'},{w:'急行',r:'きゅうこう',e:'express'}]},
  {id:151,k:'走',m:'run',on:'ソウ',ku:'はし-',lv:'N4',st:7,cat:'action',rad:'走',mn:'Person leaping = run',ex:[{w:'走る',r:'はしる',e:'to run'},{w:'競走',r:'きょうそう',e:'race'}]},
  {id:152,k:'泳',m:'swim',on:'エイ',ku:'およ-',lv:'N4',st:8,cat:'action',rad:'水',mn:'Water + flowing = swim',ex:[{w:'泳ぐ',r:'およぐ',e:'to swim'},{w:'水泳',r:'すいえい',e:'swimming'}]},
  {id:153,k:'乗',m:'ride',on:'ジョウ',ku:'の-',lv:'N4',st:9,cat:'action',rad:'丿',mn:'Person on tree = ride',ex:[{w:'乗る',r:'のる',e:'to ride'},{w:'乗り物',r:'のりもの',e:'vehicle'}]},
  {id:154,k:'降',m:'descend',on:'コウ',ku:'お-・ふ-',lv:'N4',st:10,cat:'action',rad:'阜',mn:'Mound + steps = descend',ex:[{w:'降りる',r:'おりる',e:'to get off'},{w:'降る',r:'ふる',e:'to fall (rain)'}]},
  {id:155,k:'着',m:'arrive / wear',on:'チャク',ku:'き- つ-',lv:'N4',st:12,cat:'action',rad:'羊',mn:'Sheep arriving = wear',ex:[{w:'着る',r:'きる',e:'to wear'},{w:'到着',r:'とうちゃく',e:'arrival'}]},
  {id:156,k:'切',m:'cut',on:'セツ・サイ',ku:'き-',lv:'N4',st:4,cat:'action',rad:'刀',mn:'Blade + thread = cut',ex:[{w:'切る',r:'きる',e:'to cut'},{w:'大切',r:'たいせつ',e:'important'}]},
  {id:157,k:'貸',m:'lend',on:'タイ',ku:'か-',lv:'N4',st:12,cat:'action',rad:'貝',mn:'Shell + person on knee = lend',ex:[{w:'貸す',r:'かす',e:'to lend'},{w:'貸し出し',r:'かしだし',e:'lending'}]},
  {id:158,k:'借',m:'borrow',on:'シャク',ku:'か-',lv:'N4',st:10,cat:'action',rad:'人',mn:'Person past = borrow',ex:[{w:'借りる',r:'かりる',e:'to borrow'},{w:'借金',r:'しゃっきん',e:'debt'}]},
  {id:159,k:'買',m:'buy',on:'バイ',ku:'か-',lv:'N4',st:12,cat:'action',rad:'貝',mn:'Net + shell = buy',ex:[{w:'買う',r:'かう',e:'to buy'},{w:'買い物',r:'かいもの',e:'shopping'}]},
  {id:160,k:'売',m:'sell',on:'バイ',ku:'う-',lv:'N4',st:7,cat:'action',rad:'士',mn:'Warrior + shell = sell',ex:[{w:'売る',r:'うる',e:'to sell'},{w:'売り場',r:'うりば',e:'sales area'}]},
  {id:161,k:'飼',m:'raise animals',on:'シ',ku:'か-',lv:'N4',st:13,cat:'action',rad:'食',mn:'Food + snake = raise animals',ex:[{w:'飼う',r:'かう',e:'to raise'},{w:'飼育',r:'しいく',e:'breeding'}]},
  {id:162,k:'教',m:'teach',on:'キョウ',ku:'おし- おそ-',lv:'N4',st:11,cat:'school',rad:'攴',mn:'Child + rod = teach',ex:[{w:'教える',r:'おしえる',e:'to teach'},{w:'教室',r:'きょうしつ',e:'classroom'}]},
  {id:163,k:'習',m:'practice',on:'シュウ',ku:'なら-',lv:'N4',st:11,cat:'school',rad:'羽',mn:'Wings over white = practice',ex:[{w:'習う',r:'ならう',e:'to learn'},{w:'練習',r:'れんしゅう',e:'practice'}]},
  {id:164,k:'勉',m:'study / diligent',on:'ベン',ku:'',lv:'N4',st:10,cat:'school',rad:'力',mn:'Strength + effort = study',ex:[{w:'勉強',r:'べんきょう',e:'study'},{w:'勤勉',r:'きんべん',e:'diligence'}]},
  {id:165,k:'試',m:'try / test',on:'シ',ku:'ため- こころ-',lv:'N4',st:13,cat:'school',rad:'言',mn:'Words + ceremony = try',ex:[{w:'試験',r:'しけん',e:'exam'},{w:'試す',r:'ためす',e:'to try'}]},
  {id:166,k:'験',m:'test / effect',on:'ケン・ゲン',ku:'',lv:'N4',st:18,cat:'school',rad:'馬',mn:'Horse + check = test',ex:[{w:'試験',r:'しけん',e:'exam'},{w:'経験',r:'けいけん',e:'experience'}]},
  {id:167,k:'答',m:'answer',on:'トウ',ku:'こた-',lv:'N4',st:12,cat:'school',rad:'竹',mn:'Bamboo + combine = answer',ex:[{w:'答える',r:'こたえる',e:'to answer'},{w:'回答',r:'かいとう',e:'reply'}]},
  {id:168,k:'質',m:'quality / question',on:'シツ・シチ・チ',ku:'',lv:'N4',st:15,cat:'school',rad:'貝',mn:'Two axes + shell = quality',ex:[{w:'質問',r:'しつもん',e:'question'},{w:'品質',r:'ひんしつ',e:'quality'}]},
  {id:169,k:'研',m:'polish / research',on:'ケン',ku:'と-',lv:'N4',st:9,cat:'school',rad:'石',mn:'Stone + open = polish',ex:[{w:'研究',r:'けんきゅう',e:'research'},{w:'研修',r:'けんしゅう',e:'training'}]},
  {id:170,k:'究',m:'investigate',on:'キュウ',ku:'きわ-',lv:'N4',st:7,cat:'school',rad:'穴',mn:'Cave + person = investigate',ex:[{w:'研究',r:'けんきゅう',e:'research'},{w:'究明',r:'きゅうめい',e:'investigation'}]},
  {id:171,k:'図',m:'diagram / plan',on:'ズ・ト',ku:'はか-',lv:'N4',st:7,cat:'school',rad:'囗',mn:'Territory outline = map',ex:[{w:'図書館',r:'としょかん',e:'library'},{w:'図形',r:'ずけい',e:'figure'}]},
  {id:172,k:'工',m:'work / craft',on:'コウ・ク',ku:'',lv:'N4',st:3,cat:'work',rad:'工',mn:'Ruler connecting two points',ex:[{w:'工場',r:'こうじょう',e:'factory'},{w:'工事',r:'こうじ',e:'construction'}]},
  {id:173,k:'建',m:'build',on:'ケン',ku:'た-',lv:'N4',st:9,cat:'place',rad:'廴',mn:'Move forward to build',ex:[{w:'建物',r:'たてもの',e:'building'},{w:'建設',r:'けんせつ',e:'construction'}]},
  {id:174,k:'住',m:'live / reside',on:'ジュウ',ku:'す-',lv:'N4',st:7,cat:'place',rad:'人',mn:'Person + candle = reside',ex:[{w:'住む',r:'すむ',e:'to live'},{w:'住所',r:'じゅうしょ',e:'address'}]},
  {id:175,k:'引',m:'pull',on:'イン',ku:'ひ-',lv:'N4',st:4,cat:'action',rad:'弓',mn:'Bow + line = pull',ex:[{w:'引く',r:'ひく',e:'to pull'},{w:'引越し',r:'ひっこし',e:'moving house'}]},
  {id:176,k:'押',m:'push',on:'オウ',ku:'お-',lv:'N4',st:8,cat:'action',rad:'手',mn:'Hand + frame = push',ex:[{w:'押す',r:'おす',e:'to push'},{w:'押し入れ',r:'おしいれ',e:'closet'}]},
  {id:177,k:'渡',m:'cross over',on:'ト',ku:'わた-',lv:'N4',st:12,cat:'action',rad:'水',mn:'Water + crossing = cross',ex:[{w:'渡る',r:'わたる',e:'to cross'},{w:'渡す',r:'わたす',e:'to hand over'}]},
  {id:178,k:'泊',m:'stay overnight',on:'ハク',ku:'と-',lv:'N4',st:8,cat:'action',rad:'水',mn:'White water = anchor for night',ex:[{w:'泊まる',r:'とまる',e:'to stay'},{w:'一泊',r:'いっぱく',e:'one night stay'}]},
  {id:179,k:'旅',m:'travel',on:'リョ',ku:'たび',lv:'N4',st:10,cat:'action',rad:'方',mn:'Person + bag = travel',ex:[{w:'旅行',r:'りょこう',e:'travel'},{w:'旅館',r:'りょかん',e:'Japanese inn'}]},
  {id:180,k:'映',m:'reflect / project',on:'エイ',ku:'うつ-',lv:'N4',st:9,cat:'action',rad:'日',mn:'Sun + center = reflect',ex:[{w:'映画',r:'えいが',e:'movie'},{w:'映す',r:'うつす',e:'to project'}]},
  {id:181,k:'写',m:'copy / photograph',on:'シャ',ku:'うつ-',lv:'N4',st:5,cat:'action',rad:'宀',mn:'Nest + bird = copy',ex:[{w:'写真',r:'しゃしん',e:'photograph'},{w:'写す',r:'うつす',e:'to copy'}]},
  {id:182,k:'歌',m:'song',on:'カ',ku:'うた-',lv:'N4',st:14,cat:'art',rad:'欠',mn:'Two mouths + can = sing',ex:[{w:'歌う',r:'うたう',e:'to sing'},{w:'歌手',r:'かしゅ',e:'singer'}]},
  {id:183,k:'絵',m:'picture / drawing',on:'カイ・エ',ku:'',lv:'N4',st:12,cat:'art',rad:'糸',mn:'Thread + combining = picture',ex:[{w:'絵',r:'え',e:'picture'},{w:'絵画',r:'かいが',e:'painting'}]},
  {id:184,k:'音',m:'sound',on:'オン・イン',ku:'おと・ね',lv:'N4',st:9,cat:'art',rad:'日',mn:'Sun + standing = sound',ex:[{w:'音楽',r:'おんがく',e:'music'},{w:'音声',r:'おんせい',e:'audio'}]},
  {id:185,k:'池',m:'pond',on:'チ',ku:'いけ',lv:'N4',st:6,cat:'nature',rad:'水',mn:'Water + snake winding = pond',ex:[{w:'池',r:'いけ',e:'pond'},{w:'電池',r:'でんち',e:'battery'}]},
  {id:186,k:'海',m:'sea / ocean',on:'カイ',ku:'うみ',lv:'N4',st:9,cat:'nature',rad:'水',mn:'Water + every = ocean',ex:[{w:'海',r:'うみ',e:'sea'},{w:'海外',r:'かいがい',e:'overseas'}]},
  {id:187,k:'湖',m:'lake',on:'コ',ku:'みずうみ',lv:'N4',st:12,cat:'nature',rad:'水',mn:'Water + old = lake',ex:[{w:'湖',r:'みずうみ',e:'lake'},{w:'琵琶湖',r:'びわこ',e:'Lake Biwa'}]},
  {id:188,k:'島',m:'island',on:'トウ',ku:'しま',lv:'N4',st:10,cat:'nature',rad:'山',mn:'Bird over mountain = island',ex:[{w:'島',r:'しま',e:'island'},{w:'半島',r:'はんとう',e:'peninsula'}]},
  {id:189,k:'森',m:'forest',on:'シン',ku:'もり',lv:'N4',st:12,cat:'nature',rad:'木',mn:'Three trees = dense forest',ex:[{w:'森',r:'もり',e:'forest'},{w:'森林',r:'しんりん',e:'forest'}]},
  {id:190,k:'林',m:'grove',on:'リン',ku:'はやし',lv:'N4',st:8,cat:'nature',rad:'木',mn:'Two trees = grove',ex:[{w:'林',r:'はやし',e:'grove'},{w:'農林',r:'のうりん',e:'agriculture and forestry'}]},
  {id:191,k:'岩',m:'rock',on:'ガン',ku:'いわ',lv:'N4',st:8,cat:'nature',rad:'山',mn:'Mountain + stone = rock',ex:[{w:'岩',r:'いわ',e:'rock'},{w:'岩石',r:'がんせき',e:'rocks'}]},
  {id:192,k:'石',m:'stone',on:'セキ・シャク・コク',ku:'いし',lv:'N4',st:5,cat:'nature',rad:'石',mn:'Cliff + stone = stone',ex:[{w:'石',r:'いし',e:'stone'},{w:'宝石',r:'ほうせき',e:'jewel'}]},
  {id:193,k:'晴',m:'clear weather',on:'セイ',ku:'は-',lv:'N4',st:12,cat:'nature',rad:'日',mn:'Sun + azure = clear sky',ex:[{w:'晴れ',r:'はれ',e:'clear weather'},{w:'晴天',r:'せいてん',e:'fine weather'}]},
  {id:194,k:'曇',m:'cloudy',on:'ドン',ku:'くも-',lv:'N4',st:16,cat:'nature',rad:'日',mn:'Sun under clouds = cloudy',ex:[{w:'曇り',r:'くもり',e:'cloudy'},{w:'曇る',r:'くもる',e:'to become cloudy'}]},
  {id:195,k:'風',m:'wind',on:'フウ・フ',ku:'かぜ・かざ-',lv:'N4',st:9,cat:'nature',rad:'風',mn:'Insect in sail = wind',ex:[{w:'風',r:'かぜ',e:'wind'},{w:'台風',r:'たいふう',e:'typhoon'}]},
  {id:196,k:'雪',m:'snow',on:'セツ',ku:'ゆき',lv:'N4',st:11,cat:'nature',rad:'雨',mn:'Rain + hand sweeping = snow',ex:[{w:'雪',r:'ゆき',e:'snow'},{w:'大雪',r:'おおゆき',e:'heavy snow'}]},
  {id:197,k:'夏',m:'summer',on:'カ・ゲ',ku:'なつ',lv:'N4',st:10,cat:'time',rad:'夂',mn:'Person + steps = summer',ex:[{w:'夏',r:'なつ',e:'summer'},{w:'夏休み',r:'なつやすみ',e:'summer vacation'}]},
  {id:198,k:'秋',m:'autumn',on:'シュウ',ku:'あき',lv:'N4',st:9,cat:'time',rad:'禾',mn:'Grain + fire = autumn',ex:[{w:'秋',r:'あき',e:'autumn'},{w:'秋分',r:'しゅうぶん',e:'autumnal equinox'}]},
  {id:199,k:'春',m:'spring',on:'シュン',ku:'はる',lv:'N4',st:9,cat:'time',rad:'日',mn:'Sun and growing plants',ex:[{w:'春',r:'はる',e:'spring'},{w:'春休み',r:'はるやすみ',e:'spring vacation'}]},
  {id:200,k:'冬',m:'winter',on:'トウ',ku:'ふゆ',lv:'N4',st:5,cat:'time',rad:'夂',mn:'Ice threads = winter',ex:[{w:'冬',r:'ふゆ',e:'winter'},{w:'冬休み',r:'ふゆやすみ',e:'winter vacation'}]},
  {id:201,k:'朝',m:'morning',on:'チョウ',ku:'あさ',lv:'N4',st:12,cat:'time',rad:'月',mn:'Moon still up at sunrise',ex:[{w:'朝',r:'あさ',e:'morning'},{w:'今朝',r:'けさ',e:'this morning'}]},
  {id:202,k:'昼',m:'noon',on:'チュウ',ku:'ひる',lv:'N4',st:9,cat:'time',rad:'日',mn:'Sun at its peak',ex:[{w:'昼',r:'ひる',e:'noon'},{w:'昼食',r:'ちゅうしょく',e:'lunch'}]},
  {id:203,k:'夜',m:'night',on:'ヤ',ku:'よる・よ',lv:'N4',st:8,cat:'time',rad:'夕',mn:'Evening + dark = night',ex:[{w:'夜',r:'よる',e:'night'},{w:'夜中',r:'よなか',e:'midnight'}]},
  {id:204,k:'週',m:'week',on:'シュウ',ku:'',lv:'N4',st:11,cat:'time',rad:'辶',mn:'Road + encircle = week',ex:[{w:'今週',r:'こんしゅう',e:'this week'},{w:'来週',r:'らいしゅう',e:'next week'}]},
  {id:205,k:'半',m:'half',on:'ハン',ku:'なか-',lv:'N4',st:5,cat:'number',rad:'十',mn:'Stick splitting horns = half',ex:[{w:'半分',r:'はんぶん',e:'half'},{w:'一時半',r:'いちじはん',e:'1:30'}]},
  {id:206,k:'番',m:'turn / number',on:'バン',ku:'',lv:'N4',st:12,cat:'number',rad:'田',mn:'Rice field + hand = watch turn',ex:[{w:'番号',r:'ばんごう',e:'number'},{w:'一番',r:'いちばん',e:'number one'}]},
  {id:207,k:'回',m:'times / rotate',on:'カイ・エ',ku:'まわ-',lv:'N4',st:6,cat:'number',rad:'囗',mn:'Swirl in box = rotate/times',ex:[{w:'回る',r:'まわる',e:'to rotate'},{w:'今回',r:'こんかい',e:'this time'}]},
  {id:208,k:'度',m:'degree / time',on:'ド・ト',ku:'たび',lv:'N4',st:9,cat:'number',rad:'广',mn:'Hand + arrow = measure',ex:[{w:'温度',r:'おんど',e:'temperature'},{w:'今度',r:'こんど',e:'this time / next time'}]},
  {id:209,k:'以',m:'by means of',on:'イ',ku:'',lv:'N4',st:5,cat:'other',rad:'人',mn:'Person + plow = by means of',ex:[{w:'以上',r:'いじょう',e:'above / more than'},{w:'以外',r:'いがい',e:'other than'}]},
  {id:210,k:'お',m:'honorific prefix',on:'',ku:'',lv:'N4',st:0,cat:'other',rad:'',mn:'Respectful prefix',ex:[{w:'お金',r:'おかね',e:'money'},{w:'お願い',r:'おねがい',e:'please'}]},
  {id:211,k:'ご',m:'honorific prefix',on:'',ku:'',lv:'N4',st:0,cat:'other',rad:'',mn:'Respectful prefix (Sino)',ex:[{w:'ご飯',r:'ごはん',e:'rice / meal'},{w:'ご両親',r:'ごりょうしん',e:'parents'}]},
  {id:212,k:'政',m:'politics / government',on:'セイ・ショウ',ku:'まつりごと',lv:'N3',st:9,cat:'society',rad:'攴',mn:'Beat + correct = govern',ex:[{w:'政治',r:'せいじ',e:'politics'},{w:'政府',r:'せいふ',e:'government'}]},
  {id:213,k:'議',m:'discuss / deliberate',on:'ギ',ku:'',lv:'N3',st:20,cat:'society',rad:'言',mn:'Words + righteousness',ex:[{w:'会議',r:'かいぎ',e:'meeting'},{w:'議員',r:'ぎいん',e:'assemblyman'}]},
  {id:214,k:'民',m:'people / nation',on:'ミン',ku:'たみ',lv:'N3',st:5,cat:'society',rad:'氏',mn:'Eye pierced = subject/people',ex:[{w:'国民',r:'こくみん',e:'citizens'},{w:'民主',r:'みんしゅ',e:'democratic'}]},
  {id:215,k:'連',m:'connect / series',on:'レン',ku:'つら- つ-',lv:'N3',st:10,cat:'society',rad:'辶',mn:'Cart + road = connect',ex:[{w:'連絡',r:'れんらく',e:'contact'},{w:'関連',r:'かんれん',e:'relation'}]},
  {id:216,k:'対',m:'versus / pair',on:'タイ・ツイ',ku:'',lv:'N3',st:7,cat:'society',rad:'寸',mn:'Cottage + inch = correspond',ex:[{w:'対話',r:'たいわ',e:'dialogue'},{w:'反対',r:'はんたい',e:'opposition'}]},
  {id:217,k:'部',m:'part / section',on:'ブ',ku:'',lv:'N3',st:11,cat:'society',rad:'邑',mn:'Standing + city = section',ex:[{w:'部分',r:'ぶぶん',e:'part'},{w:'部長',r:'ぶちょう',e:'department chief'}]},
  {id:218,k:'合',m:'combine / suit',on:'ゴウ・ガッ',ku:'あ-',lv:'N3',st:6,cat:'action',rad:'口',mn:'Lid on pot = combine',ex:[{w:'合う',r:'あう',e:'to fit'},{w:'場合',r:'ばあい',e:'case / situation'}]},
  {id:219,k:'市',m:'city / market',on:'シ',ku:'いち',lv:'N3',st:5,cat:'place',rad:'巾',mn:'Streets crossing = city',ex:[{w:'市内',r:'しない',e:'within city'},{w:'市民',r:'しみん',e:'citizen'}]},
  {id:220,k:'内',m:'inside / within',on:'ナイ・ダイ',ku:'うち',lv:'N3',st:4,cat:'direction',rad:'入',mn:'Person inside space = within',ex:[{w:'内容',r:'ないよう',e:'content'},{w:'国内',r:'こくない',e:'domestic'}]},
  {id:221,k:'相',m:'mutual / phase',on:'ソウ・ショウ',ku:'あい',lv:'N3',st:9,cat:'other',rad:'目',mn:'Eye on tree = observe/mutual',ex:[{w:'相談',r:'そうだん',e:'consultation'},{w:'首相',r:'しゅしょう',e:'prime minister'}]},
  {id:222,k:'表',m:'surface / express',on:'ヒョウ',ku:'おもて・あらわ-',lv:'N3',st:8,cat:'other',rad:'衣',mn:'Fur coat surface',ex:[{w:'表す',r:'あらわす',e:'to express'},{w:'発表',r:'はっぴょう',e:'presentation'}]},
  {id:223,k:'制',m:'control / system',on:'セイ',ku:'',lv:'N3',st:8,cat:'society',rad:'刀',mn:'Knife + garment = system',ex:[{w:'制度',r:'せいど',e:'system'},{w:'規制',r:'きせい',e:'regulation'}]},
  {id:224,k:'組',m:'group / assemble',on:'ソ',ku:'く-',lv:'N3',st:11,cat:'society',rad:'糸',mn:'Thread + stack = assemble',ex:[{w:'組む',r:'くむ',e:'to assemble'},{w:'組合',r:'くみあい',e:'union'}]},
  {id:225,k:'特',m:'special',on:'トク',ku:'',lv:'N3',st:10,cat:'description',rad:'牛',mn:'Peculiar ox = special',ex:[{w:'特別',r:'とくべつ',e:'special'},{w:'特徴',r:'とくちょう',e:'characteristic'}]},
  {id:226,k:'活',m:'lively / activity',on:'カツ',ku:'い-',lv:'N3',st:9,cat:'action',rad:'水',mn:'Water + tongue = activity',ex:[{w:'活動',r:'かつどう',e:'activity'},{w:'生活',r:'せいかつ',e:'life / lifestyle'}]},
  {id:227,k:'情',m:'feeling / circumstances',on:'ジョウ・セイ',ku:'なさ-',lv:'N3',st:11,cat:'feeling',rad:'心',mn:'Heart + clean = feeling',ex:[{w:'感情',r:'かんじょう',e:'emotion'},{w:'情報',r:'じょうほう',e:'information'}]},
  {id:228,k:'経',m:'pass through / sutra',on:'ケイ・キョウ',ku:'へ-',lv:'N3',st:11,cat:'other',rad:'糸',mn:'Thread + river = pass through',ex:[{w:'経済',r:'けいざい',e:'economy'},{w:'経験',r:'けいけん',e:'experience'}]},
  {id:229,k:'最',m:'most / extreme',on:'サイ',ku:'もっと-',lv:'N3',st:12,cat:'description',rad:'日',mn:'Take + ear = utmost',ex:[{w:'最も',r:'もっとも',e:'most'},{w:'最後',r:'さいご',e:'last'}]},
  {id:230,k:'現',m:'present / appear',on:'ゲン',ku:'あらわ-',lv:'N3',st:11,cat:'time',rad:'玉',mn:'Gem appearing = present',ex:[{w:'現在',r:'げんざい',e:'present'},{w:'現れる',r:'あらわれる',e:'to appear'}]},
  {id:231,k:'問',m:'question',on:'モン',ku:'と-',lv:'N3',st:11,cat:'school',rad:'口',mn:'Mouth at gate = question',ex:[{w:'問題',r:'もんだい',e:'problem'},{w:'質問',r:'しつもん',e:'question'}]},
  {id:232,k:'関',m:'barrier / relate',on:'カン',ku:'せき・かか-',lv:'N3',st:14,cat:'other',rad:'門',mn:'Gate + thread = barrier',ex:[{w:'関係',r:'かんけい',e:'relationship'},{w:'関心',r:'かんしん',e:'interest'}]},
  {id:233,k:'点',m:'point / score',on:'テン',ku:'',lv:'N3',st:9,cat:'other',rad:'黒',mn:'Black + divination = point',ex:[{w:'点数',r:'てんすう',e:'score'},{w:'欠点',r:'けってん',e:'defect'}]},
  {id:234,k:'報',m:'report / reward',on:'ホウ',ku:'むく-',lv:'N3',st:12,cat:'other',rad:'土',mn:'Kneel + hand = report',ex:[{w:'情報',r:'じょうほう',e:'information'},{w:'報告',r:'ほうこく',e:'report'}]},
  {id:235,k:'場',m:'place',on:'ジョウ',ku:'ば',lv:'N3',st:12,cat:'place',rad:'土',mn:'Sun warming earth = place',ex:[{w:'場合',r:'ばあい',e:'case'},{w:'工場',r:'こうじょう',e:'factory'}]},
  {id:236,k:'開',m:'open',on:'カイ',ku:'ひら- あ-',lv:'N3',st:12,cat:'action',rad:'門',mn:'Hands opening gate',ex:[{w:'開く',r:'ひらく',e:'to open'},{w:'公開',r:'こうかい',e:'public release'}]},
  {id:237,k:'産',m:'produce / birth',on:'サン',ku:'う-',lv:'N3',st:11,cat:'action',rad:'生',mn:'Giving birth on cliff',ex:[{w:'産業',r:'さんぎょう',e:'industry'},{w:'出産',r:'しゅっさん',e:'childbirth'}]},
  {id:238,k:'動',m:'move',on:'ドウ',ku:'うご-',lv:'N3',st:11,cat:'action',rad:'力',mn:'Heavy + strength = move',ex:[{w:'動く',r:'うごく',e:'to move'},{w:'運動',r:'うんどう',e:'exercise'}]},
  {id:239,k:'変',m:'change',on:'ヘン',ku:'か-',lv:'N3',st:9,cat:'action',rad:'攴',mn:'Twisting thread = change',ex:[{w:'変わる',r:'かわる',e:'to change'},{w:'大変',r:'たいへん',e:'terrible / very'}]},
  {id:240,k:'取',m:'take / receive',on:'シュ',ku:'と-',lv:'N3',st:8,cat:'action',rad:'又',mn:'Ear + hand = take',ex:[{w:'取る',r:'とる',e:'to take'},{w:'受け取る',r:'うけとる',e:'to receive'}]},
  {id:241,k:'決',m:'decide',on:'ケツ',ku:'き-',lv:'N3',st:7,cat:'action',rad:'水',mn:'River breaking dam = decide',ex:[{w:'決める',r:'きめる',e:'to decide'},{w:'解決',r:'かいけつ',e:'solution'}]},
  {id:242,k:'送',m:'send',on:'ソウ',ku:'おく-',lv:'N3',st:9,cat:'action',rad:'辶',mn:'Hands throwing = send',ex:[{w:'送る',r:'おくる',e:'to send'},{w:'放送',r:'ほうそう',e:'broadcast'}]},
  {id:243,k:'受',m:'receive',on:'ジュ',ku:'う-',lv:'N3',st:8,cat:'action',rad:'又',mn:'Hand receiving from hand',ex:[{w:'受ける',r:'うける',e:'to receive'},{w:'受付',r:'うけつけ',e:'reception'}]},
  {id:244,k:'感',m:'feeling / sense',on:'カン',ku:'',lv:'N3',st:13,cat:'feeling',rad:'心',mn:'Spear + mouth + heart = feel',ex:[{w:'感じる',r:'かんじる',e:'to feel'},{w:'感謝',r:'かんしゃ',e:'gratitude'}]},
  {id:245,k:'考',m:'think / consider',on:'コウ',ku:'かんが-',lv:'N3',st:6,cat:'mind',rad:'耂',mn:'Old person pondering',ex:[{w:'考える',r:'かんがえる',e:'to think'},{w:'思考',r:'しこう',e:'thought'}]},
  {id:246,k:'全',m:'complete / entire',on:'ゼン',ku:'まった- すべ-',lv:'N3',st:6,cat:'description',rad:'入',mn:'Person + king = complete',ex:[{w:'全部',r:'ぜんぶ',e:'all'},{w:'安全',r:'あんぜん',e:'safety'}]},
  {id:247,k:'加',m:'add',on:'カ',ku:'くわ-',lv:'N3',st:5,cat:'action',rad:'力',mn:'Mouth + strength = add',ex:[{w:'加える',r:'くわえる',e:'to add'},{w:'参加',r:'さんか',e:'participation'}]},
  {id:248,k:'形',m:'shape / form',on:'ケイ・ギョウ',ku:'かたち・かた',lv:'N3',st:7,cat:'description',rad:'彡',mn:'Object + decoration = form',ex:[{w:'形',r:'かたち',e:'shape'},{w:'人形',r:'にんぎょう',e:'doll'}]},
  {id:249,k:'術',m:'art / technique',on:'ジュツ',ku:'',lv:'N3',st:11,cat:'art',rad:'行',mn:'Walking + plant = technique',ex:[{w:'手術',r:'しゅじゅつ',e:'surgery'},{w:'芸術',r:'げいじゅつ',e:'art'}]},
  {id:250,k:'機',m:'machine / opportunity',on:'キ',ku:'はた',lv:'N3',st:16,cat:'tech',rad:'木',mn:'Wood + threads = machine',ex:[{w:'機会',r:'きかい',e:'opportunity'},{w:'飛行機',r:'ひこうき',e:'airplane'}]},
  {id:251,k:'会',m:'meeting',on:'カイ・エ',ku:'あ-',lv:'N3',st:6,cat:'action',rad:'人',mn:'People under roof = meet',ex:[{w:'会う',r:'あう',e:'to meet'},{w:'社会',r:'しゃかい',e:'society'}]},
  {id:252,k:'運',m:'transport / luck',on:'ウン',ku:'はこ-',lv:'N3',st:12,cat:'action',rad:'辶',mn:'Army + road = transport',ex:[{w:'運ぶ',r:'はこぶ',e:'to carry'},{w:'運動',r:'うんどう',e:'exercise'}]},
  {id:253,k:'転',m:'roll / turn',on:'テン',ku:'ころ-',lv:'N3',st:11,cat:'action',rad:'車',mn:'Car + specialist = roll',ex:[{w:'転ぶ',r:'ころぶ',e:'to fall'},{w:'自転車',r:'じてんしゃ',e:'bicycle'}]},
  {id:254,k:'去',m:'go away / past',on:'キョ・コ',ku:'さ-',lv:'N3',st:5,cat:'action',rad:'土',mn:'Mouth going away',ex:[{w:'去る',r:'さる',e:'to leave'},{w:'過去',r:'かこ',e:'the past'}]},
  {id:255,k:'始',m:'begin',on:'シ',ku:'はじ-',lv:'N3',st:8,cat:'action',rad:'女',mn:'Woman + platform = begin',ex:[{w:'始める',r:'はじめる',e:'to begin'},{w:'開始',r:'かいし',e:'start'}]},
  {id:256,k:'終',m:'end',on:'シュウ',ku:'お-',lv:'N3',st:11,cat:'action',rad:'糸',mn:'Thread + winter = end',ex:[{w:'終わる',r:'おわる',e:'to end'},{w:'最終',r:'さいしゅう',e:'final'}]},
  {id:257,k:'続',m:'continue',on:'ゾク',ku:'つづ-',lv:'N3',st:13,cat:'action',rad:'糸',mn:'Thread + sell = continue',ex:[{w:'続く',r:'つづく',e:'to continue'},{w:'継続',r:'けいぞく',e:'continuation'}]},
  {id:258,k:'必',m:'certainly / must',on:'ヒツ',ku:'かなら-',lv:'N3',st:5,cat:'other',rad:'心',mn:'Heart with lance = must',ex:[{w:'必要',r:'ひつよう',e:'necessary'},{w:'必ず',r:'かならず',e:'certainly'}]},
  {id:259,k:'原',m:'original / field',on:'ゲン',ku:'はら',lv:'N3',st:10,cat:'nature',rad:'厂',mn:'Cliff + spring = plain',ex:[{w:'原因',r:'げんいん',e:'cause'},{w:'原料',r:'げんりょう',e:'raw material'}]},
  {id:260,k:'論',m:'argue / theory',on:'ロン',ku:'',lv:'N3',st:15,cat:'school',rad:'言',mn:'Words + threads = argue',ex:[{w:'論文',r:'ろんぶん',e:'thesis'},{w:'理論',r:'りろん',e:'theory'}]},
  {id:261,k:'説',m:'explain / theory',on:'セツ・ゼイ',ku:'と-',lv:'N3',st:14,cat:'school',rad:'言',mn:'Words + exchange = explain',ex:[{w:'説明',r:'せつめい',e:'explanation'},{w:'小説',r:'しょうせつ',e:'novel'}]},
  {id:262,k:'解',m:'untie / understand',on:'カイ・ゲ',ku:'と-',lv:'N3',st:13,cat:'action',rad:'刀',mn:'Knife + horn + ox = untie',ex:[{w:'解決',r:'かいけつ',e:'solution'},{w:'理解',r:'りかい',e:'understanding'}]},
  {id:263,k:'予',m:'beforehand',on:'ヨ',ku:'',lv:'N3',st:4,cat:'time',rad:'子',mn:'Elephant = in advance',ex:[{w:'予定',r:'よてい',e:'schedule'},{w:'予習',r:'よしゅう',e:'preview study'}]},
  {id:264,k:'定',m:'decide / fix',on:'テイ',ku:'さだ-',lv:'N3',st:8,cat:'action',rad:'宀',mn:'Foot under roof = settle',ex:[{w:'予定',r:'よてい',e:'schedule'},{w:'決定',r:'けってい',e:'decision'}]},
  {id:265,k:'準',m:'standard / prepare',on:'ジュン',ku:'',lv:'N3',st:13,cat:'other',rad:'水',mn:'Water + bird = level',ex:[{w:'準備',r:'じゅんび',e:'preparation'},{w:'基準',r:'きじゅん',e:'standard'}]},
  {id:266,k:'際',m:'border / occasion',on:'サイ',ku:'きわ',lv:'N3',st:14,cat:'other',rad:'阜',mn:'Mound + sacrifice = edge',ex:[{w:'国際',r:'こくさい',e:'international'},{w:'実際',r:'じっさい',e:'actually'}]},
  {id:267,k:'格',m:'standard / rank',on:'カク・コウ',ku:'',lv:'N3',st:10,cat:'other',rad:'木',mn:'Wood + footstep = rank',ex:[{w:'格好',r:'かっこう',e:'appearance'},{w:'性格',r:'せいかく',e:'personality'}]},
  {id:268,k:'化',m:'change / convert',on:'カ・ケ',ku:'ば-',lv:'N3',st:4,cat:'action',rad:'人',mn:'Upright + inverted person',ex:[{w:'化学',r:'かがく',e:'chemistry'},{w:'文化',r:'ぶんか',e:'culture'}]},
  {id:269,k:'以',m:'with / from',on:'イ',ku:'',lv:'N3',st:5,cat:'other',rad:'人',mn:'Person + plow = by means of',ex:[{w:'以上',r:'いじょう',e:'more than'},{w:'以下',r:'いか',e:'less than'}]},
  {id:270,k:'当',m:'appropriate / hit',on:'トウ',ku:'あた-',lv:'N3',st:6,cat:'other',rad:'彐',mn:'Pig head = appropriate',ex:[{w:'当たる',r:'あたる',e:'to hit'},{w:'本当',r:'ほんとう',e:'true'}]},
  {id:271,k:'次',m:'next',on:'ジ・シ',ku:'つぎ・つ-',lv:'N3',st:6,cat:'time',rad:'欠',mn:'Open mouth + yawn = next',ex:[{w:'次',r:'つぎ',e:'next'},{w:'次第',r:'しだい',e:'depending on'}]},
  {id:272,k:'共',m:'together / both',on:'キョウ',ku:'とも',lv:'N3',st:6,cat:'other',rad:'八',mn:'Two hands together',ex:[{w:'共通',r:'きょうつう',e:'common'},{w:'共に',r:'ともに',e:'together'}]},
  {id:273,k:'協',m:'cooperate',on:'キョウ',ku:'',lv:'N3',st:8,cat:'action',rad:'十',mn:'Ten + strength = cooperate',ex:[{w:'協力',r:'きょうりょく',e:'cooperation'},{w:'協会',r:'きょうかい',e:'association'}]},
  {id:274,k:'各',m:'each',on:'カク',ku:'おのおの',lv:'N3',st:6,cat:'other',rad:'夂',mn:'Foot + mouth = each one',ex:[{w:'各自',r:'かくじ',e:'each person'},{w:'各地',r:'かくち',e:'various places'}]},
  {id:275,k:'行',m:'conduct / go',on:'コウ・ギョウ',ku:'い- おこな-',lv:'N3',st:6,cat:'action',rad:'行',mn:'Crossroads = go / conduct',ex:[{w:'行動',r:'こうどう',e:'action'},{w:'旅行',r:'りょこう',e:'travel'}]},
  {id:276,k:'手',m:'hand / skill',on:'シュ',ku:'て',lv:'N3',st:4,cat:'body',rad:'手',mn:'Five spread fingers',ex:[{w:'手段',r:'しゅだん',e:'means'},{w:'選手',r:'せんしゅ',e:'athlete'}]},
  {id:277,k:'場',m:'place / occasion',on:'ジョウ',ku:'ば',lv:'N3',st:12,cat:'place',rad:'土',mn:'Sun on earth = place',ex:[{w:'現場',r:'げんば',e:'site'},{w:'立場',r:'たちば',e:'standpoint'}]},
  {id:278,k:'受',m:'receive',on:'ジュ',ku:'う-',lv:'N3',st:8,cat:'action',rad:'又',mn:'Hands passing = receive',ex:[{w:'受験',r:'じゅけん',e:'taking exam'},{w:'受け入れる',r:'うけいれる',e:'to accept'}]},
  {id:279,k:'局',m:'bureau / situation',on:'キョク',ku:'',lv:'N3',st:7,cat:'place',rad:'尸',mn:'Bent + mouth = situation',ex:[{w:'放送局',r:'ほうそうきょく',e:'broadcasting station'},{w:'局長',r:'きょくちょう',e:'bureau chief'}]},
  {id:280,k:'給',m:'supply / salary',on:'キュウ',ku:'',lv:'N3',st:12,cat:'work',rad:'糸',mn:'Thread + combine = supply',ex:[{w:'給料',r:'きゅうりょう',e:'salary'},{w:'給食',r:'きゅうしょく',e:'school lunch'}]},
  {id:281,k:'記',m:'write down / record',on:'キ',ku:'しる-',lv:'N3',st:10,cat:'school',rad:'言',mn:'Words + oneself = record',ex:[{w:'記録',r:'きろく',e:'record'},{w:'日記',r:'にっき',e:'diary'}]},
  {id:282,k:'者',m:'person',on:'シャ',ku:'もの',lv:'N3',st:8,cat:'people',rad:'老',mn:'Old + person = elder',ex:[{w:'患者',r:'かんじゃ',e:'patient'},{w:'若者',r:'わかもの',e:'young person'}]},
  {id:283,k:'別',m:'separate / different',on:'ベツ',ku:'わか-',lv:'N3',st:7,cat:'other',rad:'刀',mn:'Bone + knife = separate',ex:[{w:'特別',r:'とくべつ',e:'special'},{w:'区別',r:'くべつ',e:'distinction'}]},
  {id:284,k:'求',m:'seek / demand',on:'キュウ',ku:'もと-',lv:'N3',st:7,cat:'action',rad:'水',mn:'Fur coat = seek',ex:[{w:'要求',r:'ようきゅう',e:'demand'},{w:'求める',r:'もとめる',e:'to seek'}]},
  {id:285,k:'果',m:'result / fruit',on:'カ',ku:'は- くだ-',lv:'N3',st:8,cat:'nature',rad:'木',mn:'Tree bearing fruit',ex:[{w:'結果',r:'けっか',e:'result'},{w:'果物',r:'くだもの',e:'fruit'}]},
  {id:286,k:'文',m:'writing / sentence',on:'ブン・モン',ku:'ふみ',lv:'N3',st:4,cat:'school',rad:'文',mn:'Crossed patterns = writing',ex:[{w:'文章',r:'ぶんしょう',e:'writing'},{w:'作文',r:'さくぶん',e:'essay'}]},
  {id:287,k:'私',m:'I / private',on:'シ',ku:'わたし・わたくし',lv:'N3',st:7,cat:'people',rad:'禾',mn:'Grain for oneself = private',ex:[{w:'私',r:'わたし',e:'I'},{w:'私立',r:'しりつ',e:'private (school)'}]},
  {id:288,k:'皆',m:'everyone',on:'カイ',ku:'みんな・みな',lv:'N3',st:9,cat:'people',rad:'比',mn:'Comparison + white = everyone',ex:[{w:'皆',r:'みんな',e:'everyone'},{w:'皆さん',r:'みなさん',e:'everyone (polite)'}]},
  {id:289,k:'彼',m:'he / that',on:'カレ・カノ',ku:'かれ・かの-',lv:'N3',st:8,cat:'people',rad:'彳',mn:'Walking + skin = he',ex:[{w:'彼',r:'かれ',e:'he'},{w:'彼女',r:'かのじょ',e:'she'}]},
  {id:290,k:'様',m:'manner / Mr./Ms.',on:'ヨウ',ku:'さま',lv:'N3',st:14,cat:'people',rad:'木',mn:'Water + sheep + oak = manner',ex:[{w:'様子',r:'ようす',e:'appearance'},{w:'皆様',r:'みなさま',e:'everyone (formal)'}]},
  {id:291,k:'氏',m:'Mr. / clan',on:'シ',ku:'うじ',lv:'N3',st:4,cat:'people',rad:'氏',mn:'Kneeling person = clan',ex:[{w:'氏名',r:'しめい',e:'full name'},{w:'田中氏',r:'たなかし',e:'Mr./Ms. Tanaka'}]},
  {id:292,k:'君',m:'you / lord',on:'クン',ku:'きみ',lv:'N3',st:7,cat:'people',rad:'口',mn:'Ruler + mouth = lord',ex:[{w:'君',r:'きみ',e:'you (informal)'},{w:'諸君',r:'しょくん',e:'ladies and gentlemen'}]},
  {id:293,k:'若',m:'young',on:'ジャク・ニャク',ku:'わか-',lv:'N3',st:8,cat:'description',rad:'艸',mn:'Plant + right hand = young',ex:[{w:'若い',r:'わかい',e:'young'},{w:'若者',r:'わかもの',e:'young person'}]},
  {id:294,k:'美',m:'beautiful',on:'ビ',ku:'うつく-',lv:'N3',st:9,cat:'description',rad:'羊',mn:'Large sheep = beautiful',ex:[{w:'美しい',r:'うつくしい',e:'beautiful'},{w:'美術',r:'びじゅつ',e:'fine arts'}]},
  {id:295,k:'楽',m:'enjoyable',on:'ガク・ラク',ku:'たの- らく',lv:'N3',st:13,cat:'feeling',rad:'木',mn:'Bells hanging = music / ease',ex:[{w:'楽しむ',r:'たのしむ',e:'to enjoy'},{w:'気楽',r:'きらく',e:'carefree'}]},
  {id:296,k:'苦',m:'suffering / bitter',on:'ク',ku:'くる- にが-',lv:'N3',st:8,cat:'feeling',rad:'艸',mn:'Plant + old = bitter',ex:[{w:'苦しい',r:'くるしい',e:'painful'},{w:'苦手',r:'にがて',e:'weakness'}]},
  {id:297,k:'悲',m:'sad',on:'ヒ',ku:'かな-',lv:'N3',st:12,cat:'feeling',rad:'心',mn:'Heart + non = sad',ex:[{w:'悲しい',r:'かなしい',e:'sad'},{w:'悲劇',r:'ひげき',e:'tragedy'}]},
  {id:298,k:'嬉',m:'happy / glad',on:'キ',ku:'うれ-',lv:'N3',st:15,cat:'feeling',rad:'女',mn:'Woman + pleased = glad',ex:[{w:'嬉しい',r:'うれしい',e:'happy'},{w:'嬉しさ',r:'うれしさ',e:'happiness'}]},
  {id:299,k:'怒',m:'angry',on:'ド・ヌ',ku:'おこ- いか-',lv:'N3',st:9,cat:'feeling',rad:'心',mn:'Slave + heart = anger',ex:[{w:'怒る',r:'おこる',e:'to get angry'},{w:'怒り',r:'いかり',e:'anger'}]},
  {id:300,k:'恐',m:'fear',on:'キョウ',ku:'おそ-',lv:'N3',st:10,cat:'feeling',rad:'心',mn:'Work + heart = fear',ex:[{w:'恐ろしい',r:'おそろしい',e:'frightening'},{w:'恐怖',r:'きょうふ',e:'fear'}]},
  {id:301,k:'愛',m:'love',on:'アイ',ku:'',lv:'N3',st:13,cat:'feeling',rad:'心',mn:'Walk + heart = love',ex:[{w:'愛',r:'あい',e:'love'},{w:'愛情',r:'あいじょう',e:'affection'}]},
  {id:302,k:'幸',m:'happiness',on:'コウ',ku:'しあわ- さち',lv:'N3',st:8,cat:'feeling',rad:'土',mn:'Shackle = luck (escaped)',ex:[{w:'幸せ',r:'しあわせ',e:'happiness'},{w:'幸運',r:'こううん',e:'good luck'}]},
  {id:303,k:'福',m:'fortune / happiness',on:'フク',ku:'',lv:'N3',st:13,cat:'feeling',rad:'示',mn:'Spirit + full jar = fortune',ex:[{w:'幸福',r:'こうふく',e:'happiness'},{w:'福祉',r:'ふくし',e:'welfare'}]},
  {id:304,k:'願',m:'wish / request',on:'ガン',ku:'ねが-',lv:'N3',st:19,cat:'feeling',rad:'頁',mn:'Spring + head = wish',ex:[{w:'お願い',r:'おねがい',e:'please / request'},{w:'願望',r:'がんぼう',e:'desire'}]},
  {id:305,k:'望',m:'hope / look at',on:'ボウ・モウ',ku:'のぞ-',lv:'N3',st:11,cat:'feeling',rad:'月',mn:'King looking at moon',ex:[{w:'希望',r:'きぼう',e:'hope'},{w:'望む',r:'のぞむ',e:'to hope for'}]},
  {id:306,k:'信',m:'believe / trust',on:'シン',ku:'',lv:'N3',st:9,cat:'feeling',rad:'人',mn:'Person + word = trust',ex:[{w:'信じる',r:'しんじる',e:'to believe'},{w:'信頼',r:'しんらい',e:'trust'}]},
  {id:307,k:'頼',m:'rely / ask',on:'ライ',ku:'たの- たよ-',lv:'N3',st:16,cat:'feeling',rad:'頁',mn:'Bundle + head = rely',ex:[{w:'頼む',r:'たのむ',e:'to ask a favor'},{w:'信頼',r:'しんらい',e:'trust'}]},
  {id:308,k:'比',m:'compare',on:'ヒ',ku:'くら-',lv:'N3',st:4,cat:'other',rad:'比',mn:'Two kneeling persons = compare',ex:[{w:'比べる',r:'くらべる',e:'to compare'},{w:'比較',r:'ひかく',e:'comparison'}]},
  {id:309,k:'例',m:'example',on:'レイ',ku:'たと-',lv:'N3',st:8,cat:'other',rad:'人',mn:'Person + arrange = example',ex:[{w:'例えば',r:'たとえば',e:'for example'},{w:'例外',r:'れいがい',e:'exception'}]},
  {id:310,k:'証',m:'proof / certificate',on:'ショウ',ku:'あかし',lv:'N3',st:12,cat:'other',rad:'言',mn:'Words + ascend = proof',ex:[{w:'証明',r:'しょうめい',e:'proof'},{w:'免許証',r:'めんきょしょう',e:'license'}]},
  {id:311,k:'法',m:'law / method',on:'ホウ・ハッ',ku:'',lv:'N3',st:8,cat:'society',rad:'水',mn:'Water + go = law',ex:[{w:'方法',r:'ほうほう',e:'method'},{w:'法律',r:'ほうりつ',e:'law'}]},
  {id:312,k:'律',m:'rule / law',on:'リツ・リチ',ku:'',lv:'N3',st:9,cat:'society',rad:'彳',mn:'Walking + pen = law',ex:[{w:'法律',r:'ほうりつ',e:'law'},{w:'規律',r:'きりつ',e:'discipline'}]},
  {id:313,k:'税',m:'tax',on:'ゼイ',ku:'',lv:'N3',st:12,cat:'society',rad:'禾',mn:'Grain + exchange = tax',ex:[{w:'消費税',r:'しょうひぜい',e:'consumption tax'},{w:'税金',r:'ぜいきん',e:'tax'}]},
  {id:314,k:'料',m:'fee / material',on:'リョウ',ku:'',lv:'N3',st:10,cat:'other',rad:'米',mn:'Rice + measure = fee',ex:[{w:'料金',r:'りょうきん',e:'fee'},{w:'料理',r:'りょうり',e:'cooking'}]},
  {id:315,k:'品',m:'goods / quality',on:'ヒン',ku:'しな',lv:'N3',st:9,cat:'other',rad:'口',mn:'Three mouths = goods',ex:[{w:'品物',r:'しなもの',e:'goods'},{w:'作品',r:'さくひん',e:'work'}]},
  {id:316,k:'号',m:'number / name',on:'ゴウ',ku:'',lv:'N3',st:5,cat:'other',rad:'口',mn:'Mouth + tiger = signal',ex:[{w:'番号',r:'ばんごう',e:'number'},{w:'信号',r:'しんごう',e:'traffic light'}]},
  {id:317,k:'式',m:'ceremony / formula',on:'シキ',ku:'',lv:'N3',st:6,cat:'other',rad:'工',mn:'Work + axe = ceremony',ex:[{w:'式',r:'しき',e:'ceremony'},{w:'正式',r:'せいしき',e:'formal'}]},
  {id:318,k:'案',m:'plan / idea',on:'アン',ku:'',lv:'N3',st:10,cat:'other',rad:'木',mn:'Tree + woman = idea',ex:[{w:'案内',r:'あんない',e:'guidance'},{w:'提案',r:'ていあん',e:'proposal'}]},
  {id:319,k:'件',m:'matter / item',on:'ケン',ku:'',lv:'N3',st:6,cat:'other',rad:'人',mn:'Person + ox = matter',ex:[{w:'条件',r:'じょうけん',e:'condition'},{w:'事件',r:'じけん',e:'incident'}]},
  {id:320,k:'状',m:'condition / letter',on:'ジョウ',ku:'',lv:'N3',st:7,cat:'other',rad:'犬',mn:'Dog + shape = condition',ex:[{w:'状態',r:'じょうたい',e:'state'},{w:'状況',r:'じょうきょう',e:'situation'}]},
  {id:321,k:'態',m:'condition / attitude',on:'タイ',ku:'',lv:'N3',st:14,cat:'other',rad:'心',mn:'Structure + heart = attitude',ex:[{w:'状態',r:'じょうたい',e:'state'},{w:'態度',r:'たいど',e:'attitude'}]},
  {id:322,k:'的',m:'target / -ish',on:'テキ',ku:'まと',lv:'N3',st:8,cat:'other',rad:'白',mn:'White + spoon = target',ex:[{w:'目的',r:'もくてき',e:'purpose'},{w:'的確',r:'てきかく',e:'precise'}]},
  {id:323,k:'的',m:'target',on:'テキ',ku:'まと',lv:'N3',st:8,cat:'other',rad:'白',mn:'Sun spot = target',ex:[{w:'的',r:'まと',e:'target'},{w:'目的',r:'もくてき',e:'goal'}]},
  {id:324,k:'際',m:'edge / occasion',on:'サイ',ku:'きわ',lv:'N3',st:14,cat:'other',rad:'阜',mn:'Mound + sacrifice = edge',ex:[{w:'実際',r:'じっさい',e:'actually'},{w:'この際',r:'このさい',e:'on this occasion'}]},
  {id:325,k:'割',m:'divide / percentage',on:'カツ',ku:'わ-',lv:'N3',st:12,cat:'action',rad:'刀',mn:'Knife + house = split',ex:[{w:'割る',r:'わる',e:'to divide'},{w:'割合',r:'わりあい',e:'proportion'}]},
  {id:326,k:'減',m:'decrease',on:'ゲン',ku:'へ-',lv:'N3',st:12,cat:'action',rad:'水',mn:'Water + all = decrease',ex:[{w:'減る',r:'へる',e:'to decrease'},{w:'削減',r:'さくげん',e:'reduction'}]},
  {id:327,k:'増',m:'increase',on:'ゾウ',ku:'ふ- ま-',lv:'N3',st:14,cat:'action',rad:'土',mn:'Earth + layer = increase',ex:[{w:'増える',r:'ふえる',e:'to increase'},{w:'増加',r:'ぞうか',e:'increase'}]},
  {id:328,k:'集',m:'gather',on:'シュウ',ku:'あつ-',lv:'N3',st:12,cat:'action',rad:'隹',mn:'Birds on tree = gather',ex:[{w:'集める',r:'あつめる',e:'to collect'},{w:'集中',r:'しゅうちゅう',e:'concentration'}]},
  {id:329,k:'分',m:'divide / part',on:'ブン・フン',ku:'わ-',lv:'N3',st:4,cat:'other',rad:'刀',mn:'Knife splitting = divide',ex:[{w:'分ける',r:'わける',e:'to divide'},{w:'十分',r:'じゅうぶん',e:'enough'}]},
  {id:330,k:'位',m:'rank / position',on:'イ',ku:'くらい',lv:'N3',st:7,cat:'other',rad:'人',mn:'Person + stand = rank',ex:[{w:'地位',r:'ちい',e:'position'},{w:'単位',r:'たんい',e:'unit'}]},
  {id:331,k:'置',m:'place / leave',on:'チ',ku:'お-',lv:'N3',st:13,cat:'action',rad:'网',mn:'Net + straight = place',ex:[{w:'置く',r:'おく',e:'to place'},{w:'位置',r:'いち',e:'position'}]},
  {id:332,k:'働',m:'work',on:'ドウ',ku:'はたら-',lv:'N3',st:13,cat:'work',rad:'人',mn:'Person + move = work',ex:[{w:'働く',r:'はたらく',e:'to work'},{w:'労働',r:'ろうどう',e:'labor'}]},
  {id:333,k:'進',m:'advance',on:'シン',ku:'すす-',lv:'N3',st:11,cat:'action',rad:'隹',mn:'Bird walking forward',ex:[{w:'進む',r:'すすむ',e:'to advance'},{w:'進歩',r:'しんぽ',e:'progress'}]},
  {id:334,k:'退',m:'retreat',on:'タイ',ku:'しりぞ-',lv:'N3',st:9,cat:'action',rad:'辶',mn:'Moon + walking = retreat',ex:[{w:'退く',r:'しりぞく',e:'to retreat'},{w:'引退',r:'いんたい',e:'retirement'}]},
  {id:335,k:'勝',m:'win',on:'ショウ',ku:'か-',lv:'N3',st:12,cat:'action',rad:'力',mn:'Boat + strength = win',ex:[{w:'勝つ',r:'かつ',e:'to win'},{w:'勝利',r:'しょうり',e:'victory'}]},
  {id:336,k:'負',m:'lose / bear',on:'フ',ku:'ま- お-',lv:'N3',st:9,cat:'action',rad:'貝',mn:'Shell on person = bear burden',ex:[{w:'負ける',r:'まける',e:'to lose'},{w:'負担',r:'ふたん',e:'burden'}]},
  {id:337,k:'争',m:'compete / contend',on:'ソウ',ku:'あらそ-',lv:'N3',st:6,cat:'action',rad:'爪',mn:'Two hands pulling',ex:[{w:'争う',r:'あらそう',e:'to compete'},{w:'競争',r:'きょうそう',e:'competition'}]},
  {id:338,k:'戦',m:'war / fight',on:'セン',ku:'たたか-',lv:'N3',st:13,cat:'action',rad:'戈',mn:'Single + spear = battle',ex:[{w:'戦争',r:'せんそう',e:'war'},{w:'挑戦',r:'ちょうせん',e:'challenge'}]},
  {id:339,k:'敗',m:'defeat',on:'ハイ',ku:'やぶ-',lv:'N3',st:11,cat:'action',rad:'攴',mn:'Shell + beat = defeat',ex:[{w:'失敗',r:'しっぱい',e:'failure'},{w:'敗北',r:'はいぼく',e:'defeat'}]},
  {id:340,k:'守',m:'protect / defend',on:'シュ・ス',ku:'まも- もり',lv:'N3',st:6,cat:'action',rad:'宀',mn:'Inch under roof = guard',ex:[{w:'守る',r:'まもる',e:'to protect'},{w:'守備',r:'しゅび',e:'defense'}]},
  {id:341,k:'攻',m:'attack',on:'コウ',ku:'せ-',lv:'N3',st:7,cat:'action',rad:'攴',mn:'Work + beat = attack',ex:[{w:'攻める',r:'せめる',e:'to attack'},{w:'攻撃',r:'こうげき',e:'attack'}]},
  {id:342,k:'仲',m:'relationship / middle',on:'チュウ',ku:'なか',lv:'N3',st:6,cat:'people',rad:'人',mn:'Person + middle = relationship',ex:[{w:'仲間',r:'なかま',e:'companion'},{w:'仲良し',r:'なかよし',e:'close friend'}]},
  {id:343,k:'助',m:'help',on:'ジョ',ku:'たす- すけ',lv:'N3',st:7,cat:'action',rad:'力',mn:'Many strengths = help',ex:[{w:'助ける',r:'たすける',e:'to help'},{w:'助言',r:'じょげん',e:'advice'}]},
  {id:344,k:'困',m:'trouble / difficulty',on:'コン',ku:'こま-',lv:'N3',st:7,cat:'feeling',rad:'木',mn:'Tree in box = stuck/troubled',ex:[{w:'困る',r:'こまる',e:'to be troubled'},{w:'困難',r:'こんなん',e:'difficulty'}]},
  {id:345,k:'怪',m:'strange',on:'カイ・ケ',ku:'あや-',lv:'N3',st:8,cat:'description',rad:'心',mn:'Heart + soil = strange',ex:[{w:'怪しい',r:'あやしい',e:'suspicious'},{w:'怪我',r:'けが',e:'injury'}]},
  {id:346,k:'痛',m:'painful',on:'ツウ',ku:'いた-',lv:'N3',st:12,cat:'health',rad:'疒',mn:'Sickbed + barrel = pain',ex:[{w:'痛い',r:'いたい',e:'painful'},{w:'頭痛',r:'ずつう',e:'headache'}]},
  {id:347,k:'疲',m:'tired',on:'ヒ',ku:'つか-',lv:'N3',st:10,cat:'health',rad:'疒',mn:'Sickbed + leather = tired',ex:[{w:'疲れる',r:'つかれる',e:'to get tired'},{w:'疲労',r:'ひろう',e:'fatigue'}]},
  {id:348,k:'汚',m:'dirty',on:'オ',ku:'よご- きたな-',lv:'N3',st:6,cat:'description',rad:'水',mn:'Water + crow = dirty',ex:[{w:'汚い',r:'きたない',e:'dirty'},{w:'汚れ',r:'よごれ',e:'dirt'}]},
  {id:349,k:'深',m:'deep',on:'シン',ku:'ふか-',lv:'N3',st:11,cat:'description',rad:'水',mn:'Water + penetrating = deep',ex:[{w:'深い',r:'ふかい',e:'deep'},{w:'深夜',r:'しんや',e:'late night'}]},
  {id:350,k:'浅',m:'shallow',on:'セン',ku:'あさ-',lv:'N3',st:9,cat:'description',rad:'水',mn:'Water + remaining = shallow',ex:[{w:'浅い',r:'あさい',e:'shallow'},{w:'浅草',r:'あさくさ',e:'Asakusa'}]},
  {id:351,k:'広',m:'wide / spacious',on:'コウ',ku:'ひろ-',lv:'N3',st:5,cat:'description',rad:'广',mn:'Shelter stretching wide',ex:[{w:'広い',r:'ひろい',e:'wide'},{w:'広場',r:'ひろば',e:'plaza'}]},
  {id:352,k:'狭',m:'narrow',on:'キョウ',ku:'せま-',lv:'N3',st:9,cat:'description',rad:'犬',mn:'Dog + pinched = narrow',ex:[{w:'狭い',r:'せまい',e:'narrow'},{w:'狭義',r:'きょうぎ',e:'strict sense'}]},
  {id:353,k:'温',m:'warm',on:'オン',ku:'あたた-',lv:'N3',st:12,cat:'description',rad:'水',mn:'Water + bowl of food = warm',ex:[{w:'温かい',r:'あたたかい',e:'warm'},{w:'温度',r:'おんど',e:'temperature'}]},
  {id:354,k:'冷',m:'cold',on:'レイ',ku:'つめ- ひ-',lv:'N3',st:7,cat:'description',rad:'冫',mn:'Ice + command = cold',ex:[{w:'冷たい',r:'つめたい',e:'cold (to touch)'},{w:'冷蔵庫',r:'れいぞうこ',e:'refrigerator'}]},
  {id:355,k:'硬',m:'hard / stiff',on:'コウ',ku:'かた-',lv:'N3',st:12,cat:'description',rad:'石',mn:'Stone + normal = hard',ex:[{w:'硬い',r:'かたい',e:'hard'},{w:'硬貨',r:'こうか',e:'coin'}]},
  {id:356,k:'軟',m:'soft',on:'ナン',ku:'やわ-',lv:'N3',st:11,cat:'description',rad:'車',mn:'Car + yawn = soft',ex:[{w:'軟らかい',r:'やわらかい',e:'soft'},{w:'軟化',r:'なんか',e:'softening'}]},
  {id:357,k:'速',m:'fast / quick',on:'ソク',ku:'はや-',lv:'N3',st:10,cat:'description',rad:'辶',mn:'Bundle + road = fast',ex:[{w:'速い',r:'はやい',e:'fast'},{w:'速度',r:'そくど',e:'speed'}]},
  {id:358,k:'遅',m:'slow / late',on:'チ',ku:'おそ- おく-',lv:'N3',st:12,cat:'description',rad:'辶',mn:'Late bird = slow',ex:[{w:'遅い',r:'おそい',e:'slow / late'},{w:'遅れる',r:'おくれる',e:'to be late'}]},
  {id:359,k:'明',m:'clear / bright',on:'メイ',ku:'あか- あき-',lv:'N3',st:8,cat:'description',rad:'日',mn:'Sun + moon = bright',ex:[{w:'明らか',r:'あきらか',e:'clear'},{w:'文明',r:'ぶんめい',e:'civilization'}]},
  {id:360,k:'暗',m:'dark',on:'アン',ku:'くら-',lv:'N3',st:13,cat:'description',rad:'日',mn:'Sun + sound = dark',ex:[{w:'暗い',r:'くらい',e:'dark'},{w:'暗記',r:'あんき',e:'memorization'}]},
  {id:361,k:'平',m:'flat / peaceful',on:'ヘイ・ビョウ',ku:'たい- ひら-',lv:'N3',st:5,cat:'description',rad:'干',mn:'Level water surface = flat',ex:[{w:'平和',r:'へいわ',e:'peace'},{w:'平日',r:'へいじつ',e:'weekday'}]},
  {id:362,k:'静',m:'quiet',on:'セイ・ジョウ',ku:'しず-',lv:'N3',st:14,cat:'description',rad:'青',mn:'Blue + dispute = quiet',ex:[{w:'静か',r:'しずか',e:'quiet'},{w:'静止',r:'せいし',e:'stillness'}]},
  {id:363,k:'賑',m:'lively / bustling',on:'',ku:'にぎ-',lv:'N3',st:13,cat:'description',rad:'貝',mn:'Shell + prosperity = lively',ex:[{w:'賑やか',r:'にぎやか',e:'lively'},{w:'賑わう',r:'にぎわう',e:'to be lively'}]},
  {id:364,k:'得',m:'gain / can do',on:'トク',ku:'え- う-',lv:'N3',st:11,cat:'action',rad:'彳',mn:'Walk + hand = obtain',ex:[{w:'得る',r:'える',e:'to obtain'},{w:'得意',r:'とくい',e:'specialty / pride'}]},
  {id:365,k:'失',m:'lose / mistake',on:'シツ',ku:'うしな-',lv:'N3',st:5,cat:'action',rad:'手',mn:'Hand losing object',ex:[{w:'失う',r:'うしなう',e:'to lose'},{w:'失敗',r:'しっぱい',e:'failure'}]},
  {id:366,k:'認',m:'recognize',on:'ニン',ku:'みと-',lv:'N3',st:14,cat:'action',rad:'言',mn:'Words + patience = recognize',ex:[{w:'認める',r:'みとめる',e:'to recognize'},{w:'確認',r:'かくにん',e:'confirmation'}]},
  {id:367,k:'述',m:'state / describe',on:'ジュツ',ku:'の-',lv:'N3',st:8,cat:'action',rad:'辶',mn:'Move + magic = describe',ex:[{w:'述べる',r:'のべる',e:'to state'},{w:'記述',r:'きじゅつ',e:'description'}]},
  {id:368,k:'示',m:'show / indicate',on:'ジ・シ',ku:'しめ-',lv:'N3',st:5,cat:'action',rad:'示',mn:'Altar table = show',ex:[{w:'示す',r:'しめす',e:'to show'},{w:'指示',r:'しじ',e:'instruction'}]},
  {id:369,k:'伝',m:'convey / tradition',on:'デン',ku:'つた-',lv:'N3',st:6,cat:'action',rad:'人',mn:'Person + cloud = convey',ex:[{w:'伝える',r:'つたえる',e:'to convey'},{w:'伝統',r:'でんとう',e:'tradition'}]},
  {id:370,k:'返',m:'return / reply',on:'ヘン',ku:'かえ-',lv:'N3',st:7,cat:'action',rad:'辶',mn:'Backwards + road = return',ex:[{w:'返す',r:'かえす',e:'to return'},{w:'返事',r:'へんじ',e:'reply'}]},
  {id:371,k:'渡',m:'cross over',on:'ト',ku:'わた-',lv:'N3',st:12,cat:'action',rad:'水',mn:'River crossing',ex:[{w:'渡る',r:'わたる',e:'to cross'},{w:'引き渡す',r:'ひきわたす',e:'to hand over'}]},
  {id:372,k:'測',m:'measure',on:'ソク',ku:'はか-',lv:'N3',st:12,cat:'action',rad:'水',mn:'Water + rule = measure',ex:[{w:'測る',r:'はかる',e:'to measure'},{w:'観測',r:'かんそく',e:'observation'}]},
  {id:373,k:'量',m:'amount / measure',on:'リョウ',ku:'はか-',lv:'N3',st:12,cat:'other',rad:'日',mn:'Sun + weigh = amount',ex:[{w:'量',r:'りょう',e:'quantity'},{w:'大量',r:'たいりょう',e:'large quantity'}]},
  {id:374,k:'費',m:'expense / spend',on:'ヒ',ku:'ついや-',lv:'N3',st:12,cat:'other',rad:'貝',mn:'Shell + abolish = expense',ex:[{w:'費用',r:'ひよう',e:'cost'},{w:'消費',r:'しょうひ',e:'consumption'}]},
  {id:375,k:'価',m:'value / price',on:'カ',ku:'',lv:'N3',st:8,cat:'other',rad:'人',mn:'Person + price = value',ex:[{w:'価格',r:'かかく',e:'price'},{w:'物価',r:'ぶっか',e:'prices'}]},
  {id:376,k:'均',m:'equal / average',on:'キン',ku:'',lv:'N3',st:7,cat:'other',rad:'土',mn:'Earth + even out = even',ex:[{w:'平均',r:'へいきん',e:'average'},{w:'均等',r:'きんとう',e:'equality'}]},
  {id:377,k:'差',m:'difference',on:'サ',ku:'さ-',lv:'N3',st:10,cat:'other',rad:'工',mn:'Work + measure = difference',ex:[{w:'差',r:'さ',e:'difference'},{w:'差別',r:'さべつ',e:'discrimination'}]},
  {id:378,k:'通',m:'pass through / commute',on:'ツウ・ツ',ku:'とお- かよ-',lv:'N3',st:10,cat:'action',rad:'辶',mn:'Road + arrive = pass through',ex:[{w:'通る',r:'とおる',e:'to pass'},{w:'交通',r:'こうつう',e:'traffic'}]},
  {id:379,k:'過',m:'pass / excess',on:'カ',ku:'す- あやま-',lv:'N3',st:12,cat:'action',rad:'辶',mn:'Skull + road = pass',ex:[{w:'過ぎる',r:'すぎる',e:'to exceed'},{w:'通過',r:'つうか',e:'passing'}]},
  {id:380,k:'変',m:'change / strange',on:'ヘン',ku:'か-',lv:'N3',st:9,cat:'action',rad:'攴',mn:'Twist + beat = change',ex:[{w:'変わる',r:'かわる',e:'to change'},{w:'大変',r:'たいへん',e:'very / serious'}]},
  {id:381,k:'続',m:'continue',on:'ゾク',ku:'つづ-',lv:'N3',st:13,cat:'action',rad:'糸',mn:'Thread + sell = continue',ex:[{w:'続ける',r:'つづける',e:'to continue'},{w:'連続',r:'れんぞく',e:'consecutive'}]},
  {id:382,k:'割',m:'split / percentage',on:'カツ',ku:'わ-',lv:'N3',st:12,cat:'action',rad:'刀',mn:'Split knife',ex:[{w:'割れる',r:'われる',e:'to break'},{w:'役割',r:'やくわり',e:'role'}]},
  {id:383,k:'含',m:'include',on:'ガン',ku:'ふく-',lv:'N3',st:7,cat:'action',rad:'口',mn:'Enclosed in mouth = include',ex:[{w:'含む',r:'ふくむ',e:'to include'},{w:'含有',r:'がんゆう',e:'content'}]},
  {id:384,k:'従',m:'follow / obey',on:'ジュウ・ショウ',ku:'したが-',lv:'N3',st:10,cat:'action',rad:'彳',mn:'Walk + follow = obey',ex:[{w:'従う',r:'したがう',e:'to follow'},{w:'従業員',r:'じゅうぎょういん',e:'employee'}]},
  {id:385,k:'反',m:'oppose / against',on:'ハン・ホン',ku:'そ-',lv:'N3',st:4,cat:'other',rad:'厂',mn:'Cliff + hand = push back',ex:[{w:'反対',r:'はんたい',e:'opposition'},{w:'反省',r:'はんせい',e:'reflection'}]},
  {id:386,k:'否',m:'negate / no',on:'ヒ',ku:'いな',lv:'N3',st:7,cat:'other',rad:'口',mn:'Not + mouth = negate',ex:[{w:'否定',r:'ひてい',e:'denial'},{w:'是非',r:'ぜひ',e:'by all means / right or wrong'}]},
  {id:387,k:'由',m:'reason / from',on:'ユ・ユウ・ユイ',ku:'よし',lv:'N3',st:5,cat:'other',rad:'田',mn:'Field with shoot = reason',ex:[{w:'理由',r:'りゆう',e:'reason'},{w:'自由',r:'じゆう',e:'freedom'}]},
  {id:388,k:'因',m:'cause / due to',on:'イン',ku:'よ-',lv:'N3',st:6,cat:'other',rad:'囗',mn:'Large + box = cause',ex:[{w:'原因',r:'げんいん',e:'cause'},{w:'因果',r:'いんが',e:'cause and effect'}]},
  {id:389,k:'効',m:'effect',on:'コウ',ku:'き-',lv:'N3',st:8,cat:'other',rad:'力',mn:'Exchange + strength = effect',ex:[{w:'効果',r:'こうか',e:'effect'},{w:'有効',r:'ゆうこう',e:'valid'}]},
  {id:390,k:'益',m:'benefit / profit',on:'エキ・ヤク',ku:'',lv:'N3',st:10,cat:'other',rad:'皿',mn:'Water + dish = benefit',ex:[{w:'利益',r:'りえき',e:'profit'},{w:'公益',r:'こうえき',e:'public benefit'}]},
  {id:391,k:'害',m:'harm / damage',on:'ガイ',ku:'',lv:'N3',st:10,cat:'other',rad:'宀',mn:'Roof + needle = harm',ex:[{w:'害',r:'がい',e:'harm'},{w:'妨害',r:'ぼうがい',e:'interference'}]},
  {id:392,k:'危',m:'danger',on:'キ',ku:'あぶ- あや-',lv:'N3',st:6,cat:'other',rad:'卩',mn:'Person on cliff edge',ex:[{w:'危険',r:'きけん',e:'danger'},{w:'危ない',r:'あぶない',e:'dangerous'}]},
  {id:393,k:'険',m:'steep / danger',on:'ケン',ku:'けわ-',lv:'N3',st:11,cat:'other',rad:'阜',mn:'Mound + all = steep',ex:[{w:'危険',r:'きけん',e:'danger'},{w:'険しい',r:'けわしい',e:'steep'}]},
  {id:394,k:'与',m:'give / grant',on:'ヨ',ku:'あた-',lv:'N2',st:3,cat:'action',rad:'一',mn:'Rack giving = give',ex:[{w:'与える',r:'あたえる',e:'to give'},{w:'給与',r:'きゅうよ',e:'salary'}]},
  {id:395,k:'依',m:'depend / according to',on:'イ・エ',ku:'よ-',lv:'N2',st:8,cat:'action',rad:'人',mn:'Person + garment = depend',ex:[{w:'依頼',r:'いらい',e:'request'},{w:'依存',r:'いそん',e:'dependence'}]},
  {id:396,k:'価',m:'value / price',on:'カ',ku:'',lv:'N2',st:8,cat:'other',rad:'人',mn:'Person + price',ex:[{w:'価値',r:'かち',e:'value'},{w:'物価',r:'ぶっか',e:'prices'}]},
  {id:397,k:'仮',m:'temporary / false',on:'カ・ケ',ku:'かり',lv:'N2',st:6,cat:'other',rad:'人',mn:'Person + false = temporary',ex:[{w:'仮定',r:'かてい',e:'assumption'},{w:'仮に',r:'かりに',e:'temporarily'}]},
  {id:398,k:'供',m:'supply / accompany',on:'キョウ・ク',ku:'そな- とも',lv:'N2',st:8,cat:'action',rad:'人',mn:'Person standing together',ex:[{w:'提供',r:'ていきょう',e:'provision'},{w:'子供',r:'こども',e:'child'}]},
  {id:399,k:'優',m:'gentle / superior',on:'ユウ',ku:'やさ- すぐ-',lv:'N2',st:17,cat:'description',rad:'人',mn:'Person + worry = gentle',ex:[{w:'優しい',r:'やさしい',e:'gentle'},{w:'優秀',r:'ゆうしゅう',e:'excellent'}]},
  {id:400,k:'倒',m:'fall / topple',on:'トウ',ku:'たお-',lv:'N2',st:10,cat:'action',rad:'人',mn:'Person + arrive = fall',ex:[{w:'倒れる',r:'たおれる',e:'to fall'},{w:'圧倒',r:'あっとう',e:'overwhelming'}]},
  {id:401,k:'傾',m:'lean / tend',on:'ケイ',ku:'かたむ-',lv:'N2',st:13,cat:'action',rad:'人',mn:'Person + tilted = lean',ex:[{w:'傾く',r:'かたむく',e:'to lean'},{w:'傾向',r:'けいこう',e:'tendency'}]},
  {id:402,k:'催',m:'hold / urge',on:'サイ',ku:'もよお-',lv:'N2',st:13,cat:'action',rad:'人',mn:'Person + mountain bird = hold event',ex:[{w:'催す',r:'もよおす',e:'to hold'},{w:'開催',r:'かいさい',e:'holding (event)'}]},
  {id:403,k:'債',m:'debt',on:'サイ',ku:'',lv:'N2',st:13,cat:'other',rad:'人',mn:'Person + responsibility = debt',ex:[{w:'債務',r:'さいむ',e:'debt obligation'},{w:'国債',r:'こくさい',e:'national bond'}]},
  {id:404,k:'像',m:'image / figure',on:'ゾウ',ku:'',lv:'N2',st:14,cat:'art',rad:'人',mn:'Person + elephant = image',ex:[{w:'像',r:'ぞう',e:'statue'},{w:'映像',r:'えいぞう',e:'image/video'}]},
  {id:405,k:'免',m:'exempt / license',on:'メン',ku:'まぬか-',lv:'N2',st:8,cat:'other',rad:'儿',mn:'Person crawling out = exempt',ex:[{w:'免許',r:'めんきょ',e:'license'},{w:'免除',r:'めんじょ',e:'exemption'}]},
  {id:406,k:'充',m:'fill / sufficient',on:'ジュウ',ku:'あ-',lv:'N2',st:6,cat:'other',rad:'儿',mn:'Child growing = sufficient',ex:[{w:'充実',r:'じゅうじつ',e:'fulfillment'},{w:'補充',r:'ほじゅう',e:'replenishment'}]},
  {id:407,k:'典',m:'code / ceremony',on:'テン',ku:'',lv:'N2',st:8,cat:'other',rad:'冊',mn:'Books on stand = code',ex:[{w:'古典',r:'こてん',e:'classic'},{w:'辞典',r:'じてん',e:'dictionary'}]},
  {id:408,k:'冒',m:'risk / venture',on:'ボウ',ku:'おか-',lv:'N2',st:9,cat:'action',rad:'目',mn:'Sun-hat + eye = venture',ex:[{w:'冒険',r:'ぼうけん',e:'adventure'},{w:'冒す',r:'おかす',e:'to risk'}]},
  {id:409,k:'凶',m:'bad luck / evil',on:'キョウ',ku:'',lv:'N2',st:4,cat:'other',rad:'凵',mn:'Container + cross = evil',ex:[{w:'凶悪',r:'きょうあく',e:'vicious'},{w:'凶器',r:'きょうき',e:'weapon'}]},
  {id:410,k:'刺',m:'stab / thorn',on:'シ',ku:'さ-',lv:'N2',st:8,cat:'action',rad:'刀',mn:'Bundle + knife = stab',ex:[{w:'刺す',r:'さす',e:'to stab'},{w:'名刺',r:'めいし',e:'business card'}]},
  {id:411,k:'刻',m:'engrave / moment',on:'コク',ku:'きざ-',lv:'N2',st:8,cat:'action',rad:'刀',mn:'Pig + knife = engrave',ex:[{w:'刻む',r:'きざむ',e:'to engrave'},{w:'時刻',r:'じこく',e:'time (clock)'}]},
  {id:412,k:'剣',m:'sword',on:'ケン',ku:'つるぎ',lv:'N2',st:11,cat:'other',rad:'刀',mn:'All + knife = sword',ex:[{w:'剣道',r:'けんどう',e:'kendo'},{w:'真剣',r:'しんけん',e:'serious'}]},
  {id:413,k:'剰',m:'surplus',on:'ジョウ',ku:'あま-',lv:'N2',st:11,cat:'other',rad:'刀',mn:'Remaining + knife = surplus',ex:[{w:'剰余',r:'じょうよ',e:'surplus'},{w:'過剰',r:'かじょう',e:'excess'}]},
  {id:414,k:'劇',m:'drama / intense',on:'ゲキ',ku:'',lv:'N2',st:15,cat:'art',rad:'刀',mn:'Tiger + pig + knife = drama',ex:[{w:'劇場',r:'げきじょう',e:'theater'},{w:'演劇',r:'えんげき',e:'play/theater'}]},
  {id:415,k:'勧',m:'recommend',on:'カン',ku:'すす-',lv:'N2',st:13,cat:'action',rad:'力',mn:'Bird + strength = recommend',ex:[{w:'勧める',r:'すすめる',e:'to recommend'},{w:'勧誘',r:'かんゆう',e:'solicitation'}]},
  {id:416,k:'勤',m:'work / serve',on:'キン',ku:'つと-',lv:'N2',st:12,cat:'work',rad:'力',mn:'Diligent movement = work',ex:[{w:'勤める',r:'つとめる',e:'to work'},{w:'勤務',r:'きんむ',e:'service/work'}]},
  {id:417,k:'匹',m:'counter for animals',on:'ヒキ・ヒツ',ku:'',lv:'N2',st:4,cat:'other',rad:'匚',mn:'Box with thread = animal unit',ex:[{w:'一匹',r:'いっぴき',e:'one animal'},{w:'匹敵',r:'ひってき',e:'matching'}]},
  {id:418,k:'博',m:'broad / exhibition',on:'ハク・バク',ku:'',lv:'N2',st:12,cat:'other',rad:'十',mn:'Wide + special = broad',ex:[{w:'博士',r:'はかせ',e:'doctor/PhD'},{w:'博物館',r:'はくぶつかん',e:'museum'}]},
  {id:419,k:'占',m:'divine / occupy',on:'セン',ku:'うらな- し-',lv:'N2',st:5,cat:'other',rad:'卜',mn:'Divination rod + mouth',ex:[{w:'占う',r:'うらなう',e:'to divine'},{w:'占める',r:'しめる',e:'to occupy'}]},
  {id:420,k:'印',m:'seal / mark',on:'イン',ku:'しるし',lv:'N2',st:6,cat:'other',rad:'卩',mn:'Hand pressing down = seal',ex:[{w:'印鑑',r:'いんかん',e:'seal/stamp'},{w:'目印',r:'めじるし',e:'landmark'}]},
  {id:421,k:'危',m:'danger',on:'キ',ku:'あぶ-',lv:'N2',st:6,cat:'other',rad:'卩',mn:'Person on precipice',ex:[{w:'危機',r:'きき',e:'crisis'},{w:'危うい',r:'あやうい',e:'precarious'}]},
  {id:422,k:'厳',m:'strict / solemn',on:'ゲン・ゴン',ku:'きび- おごそ-',lv:'N2',st:17,cat:'description',rad:'厂',mn:'Cliff + rock + man = severe',ex:[{w:'厳しい',r:'きびしい',e:'strict'},{w:'厳重',r:'げんじゅう',e:'strict / tight'}]},
  {id:423,k:'参',m:'participate / visit',on:'サン・シン',ku:'まい-',lv:'N2',st:8,cat:'action',rad:'厶',mn:'Three sparkles = come/visit',ex:[{w:'参加',r:'さんか',e:'participation'},{w:'参考',r:'さんこう',e:'reference'}]},
  {id:424,k:'及',m:'reach / and',on:'キュウ',ku:'およ-',lv:'N2',st:3,cat:'action',rad:'又',mn:'Hand catching up = reach',ex:[{w:'及ぶ',r:'およぶ',e:'to reach'},{w:'普及',r:'ふきゅう',e:'spread'}]},
  {id:425,k:'叫',m:'shout',on:'キョウ',ku:'さけ-',lv:'N2',st:6,cat:'action',rad:'口',mn:'Mouth + fork = shout',ex:[{w:'叫ぶ',r:'さけぶ',e:'to shout'},{w:'絶叫',r:'ぜっきょう',e:'scream'}]},
  {id:426,k:'吸',m:'inhale / absorb',on:'キュウ',ku:'す-',lv:'N2',st:6,cat:'action',rad:'口',mn:'Mouth + reach = inhale',ex:[{w:'吸う',r:'すう',e:'to inhale'},{w:'吸収',r:'きゅうしゅう',e:'absorption'}]},
  {id:427,k:'唐',m:'Tang dynasty / foreign',on:'トウ',ku:'から',lv:'N2',st:10,cat:'other',rad:'口',mn:'Mouth + wide = Tang',ex:[{w:'唐辛子',r:'とうがらし',e:'chili pepper'},{w:'唐突',r:'とうとつ',e:'abrupt'}]},
  {id:428,k:'喜',m:'joy / delight',on:'キ',ku:'よろこ-',lv:'N2',st:12,cat:'feeling',rad:'口',mn:'Drum + mouth = joy',ex:[{w:'喜ぶ',r:'よろこぶ',e:'to be delighted'},{w:'喜び',r:'よろこび',e:'joy'}]},
  {id:429,k:'善',m:'good / virtue',on:'ゼン',ku:'よ-',lv:'N2',st:12,cat:'other',rad:'口',mn:'Sheep + two mouths = good',ex:[{w:'善意',r:'ぜんい',e:'good intentions'},{w:'慈善',r:'じぜん',e:'charity'}]},
  {id:430,k:'嘆',m:'sigh / lament',on:'タン',ku:'なげ-',lv:'N2',st:13,cat:'feeling',rad:'口',mn:'Mouth + difficult = lament',ex:[{w:'嘆く',r:'なげく',e:'to lament'},{w:'感嘆',r:'かんたん',e:'admiration'}]},
  {id:431,k:'囲',m:'surround',on:'イ',ku:'かこ-',lv:'N2',st:7,cat:'action',rad:'囗',mn:'Box + surround = encircle',ex:[{w:'囲む',r:'かこむ',e:'to surround'},{w:'範囲',r:'はんい',e:'range'}]},
  {id:432,k:'図',m:'plan / map',on:'ズ・ト',ku:'はか-',lv:'N2',st:7,cat:'other',rad:'囗',mn:'Territory = map',ex:[{w:'図る',r:'はかる',e:'to plan'},{w:'意図',r:'いと',e:'intention'}]},
  {id:433,k:'在',m:'exist / be present',on:'ザイ',ku:'あ-',lv:'N2',st:6,cat:'other',rad:'土',mn:'Grass + earth = exist',ex:[{w:'存在',r:'そんざい',e:'existence'},{w:'現在',r:'げんざい',e:'present'}]},
  {id:434,k:'坂',m:'slope',on:'ハン',ku:'さか',lv:'N2',st:7,cat:'place',rad:'土',mn:'Earth + anti = slope',ex:[{w:'坂',r:'さか',e:'slope'},{w:'急坂',r:'きゅうはん',e:'steep slope'}]},
  {id:435,k:'城',m:'castle',on:'ジョウ',ku:'しろ',lv:'N2',st:9,cat:'place',rad:'土',mn:'Earth + succeed = castle',ex:[{w:'城',r:'しろ',e:'castle'},{w:'城下町',r:'じょうかまち',e:'castle town'}]},
  {id:436,k:'域',m:'area / region',on:'イキ',ku:'',lv:'N2',st:11,cat:'place',rad:'土',mn:'Earth + weapon = region',ex:[{w:'地域',r:'ちいき',e:'area/region'},{w:'領域',r:'りょういき',e:'territory'}]},
  {id:437,k:'基',m:'base / foundation',on:'キ',ku:'もと',lv:'N2',st:11,cat:'other',rad:'土',mn:'Earth carrying basket = base',ex:[{w:'基本',r:'きほん',e:'basics'},{w:'基礎',r:'きそ',e:'foundation'}]},
  {id:438,k:'堂',m:'hall / grand',on:'ドウ',ku:'',lv:'N2',st:11,cat:'place',rad:'土',mn:'High + earth = hall',ex:[{w:'食堂',r:'しょくどう',e:'cafeteria'},{w:'国会議事堂',r:'こっかいぎじどう',e:'Parliament building'}]},
  {id:439,k:'境',m:'boundary',on:'キョウ・ケイ',ku:'さかい',lv:'N2',st:14,cat:'place',rad:'土',mn:'Earth + end = boundary',ex:[{w:'境',r:'さかい',e:'boundary'},{w:'環境',r:'かんきょう',e:'environment'}]},
  {id:440,k:'壁',m:'wall',on:'ヘキ',ku:'かべ',lv:'N2',st:16,cat:'place',rad:'土',mn:'Earth + king\'s choice = wall',ex:[{w:'壁',r:'かべ',e:'wall'},{w:'障壁',r:'しょうへき',e:'barrier'}]},
  {id:441,k:'圧',m:'pressure',on:'アツ',ku:'お-',lv:'N2',st:5,cat:'other',rad:'土',mn:'Cliff + earth = pressure',ex:[{w:'圧力',r:'あつりょく',e:'pressure'},{w:'気圧',r:'きあつ',e:'atmospheric pressure'}]},
  {id:442,k:'奪',m:'seize / take away',on:'ダツ',ku:'うば-',lv:'N2',st:14,cat:'action',rad:'大',mn:'Large bird seizing = snatch',ex:[{w:'奪う',r:'うばう',e:'to seize'},{w:'剥奪',r:'はくだつ',e:'deprivation'}]},
  {id:443,k:'契',m:'contract / promise',on:'ケイ',ku:'ちぎ-',lv:'N2',st:9,cat:'other',rad:'大',mn:'Notch + big = contract',ex:[{w:'契約',r:'けいやく',e:'contract'},{w:'契機',r:'けいき',e:'opportunity'}]},
  {id:444,k:'孤',m:'isolated / lone',on:'コ',ku:'',lv:'N2',st:8,cat:'description',rad:'子',mn:'Child + melon = isolated',ex:[{w:'孤独',r:'こどく',e:'loneliness'},{w:'孤立',r:'こりつ',e:'isolation'}]},
  {id:445,k:'宣',m:'proclaim',on:'セン',ku:'',lv:'N2',st:9,cat:'action',rad:'宀',mn:'Roof + day = proclaim',ex:[{w:'宣言',r:'せんげん',e:'declaration'},{w:'宣伝',r:'せんでん',e:'publicity'}]},
  {id:446,k:'宴',m:'banquet / feast',on:'エン',ku:'うたげ',lv:'N2',st:10,cat:'other',rad:'宀',mn:'Roof + female + sun = banquet',ex:[{w:'宴会',r:'えんかい',e:'banquet'},{w:'宴席',r:'えんせき',e:'banquet seat'}]},
  {id:447,k:'宿',m:'inn / lodge',on:'シュク',ku:'やど',lv:'N2',st:11,cat:'place',rad:'宀',mn:'Person under roof = lodge',ex:[{w:'宿泊',r:'しゅくはく',e:'lodging'},{w:'宿題',r:'しゅくだい',e:'homework'}]},
  {id:448,k:'寄',m:'approach / contribute',on:'キ',ku:'よ-',lv:'N2',st:11,cat:'action',rad:'宀',mn:'Unusual + roof = approach',ex:[{w:'寄る',r:'よる',e:'to approach'},{w:'寄付',r:'きふ',e:'donation'}]},
  {id:449,k:'密',m:'secret / dense',on:'ミツ',ku:'',lv:'N2',st:11,cat:'other',rad:'宀',mn:'Mountain + roof = secret',ex:[{w:'秘密',r:'ひみつ',e:'secret'},{w:'密度',r:'みつど',e:'density'}]},
  {id:450,k:'察',m:'inspect / guess',on:'サツ',ku:'',lv:'N2',st:14,cat:'action',rad:'宀',mn:'Roof + sacrifice = inspect',ex:[{w:'観察',r:'かんさつ',e:'observation'},{w:'警察',r:'けいさつ',e:'police'}]},
  {id:451,k:'尊',m:'respect',on:'ソン',ku:'たっと- とうと-',lv:'N2',st:12,cat:'other',rad:'寸',mn:'Wine vessel + inch = respect',ex:[{w:'尊重',r:'そんちょう',e:'respect'},{w:'自尊心',r:'じそんしん',e:'self-esteem'}]},
  {id:452,k:'就',m:'succeed / take position',on:'シュウ',ku:'つ-',lv:'N2',st:12,cat:'work',rad:'尤',mn:'Capital + dog = take up',ex:[{w:'就く',r:'つく',e:'to take position'},{w:'就職',r:'しゅうしょく',e:'getting a job'}]},
  {id:453,k:'層',m:'layer / stratum',on:'ソウ',ku:'',lv:'N2',st:14,cat:'other',rad:'尸',mn:'Body + repeat = layer',ex:[{w:'層',r:'そう',e:'layer'},{w:'階層',r:'かいそう',e:'stratum'}]},
  {id:454,k:'展',m:'unfold / exhibition',on:'テン',ku:'',lv:'N2',st:10,cat:'action',rad:'尸',mn:'Spread out cloth = unfold',ex:[{w:'展開',r:'てんかい',e:'development'},{w:'展示',r:'てんじ',e:'exhibition'}]},
  {id:455,k:'属',m:'belong to',on:'ゾク',ku:'',lv:'N2',st:12,cat:'other',rad:'尸',mn:'Tail of lizard = belong',ex:[{w:'所属',r:'しょぞく',e:'belonging'},{w:'金属',r:'きんぞく',e:'metal'}]},
  {id:456,k:'帯',m:'belt / carry',on:'タイ',ku:'お-',lv:'N2',st:10,cat:'other',rad:'巾',mn:'Cloth + carry = belt',ex:[{w:'地帯',r:'ちたい',e:'zone'},{w:'携帯',r:'けいたい',e:'mobile phone'}]},
  {id:457,k:'幅',m:'width',on:'フク',ku:'はば',lv:'N2',st:12,cat:'other',rad:'巾',mn:'Cloth + wealth = width',ex:[{w:'幅',r:'はば',e:'width'},{w:'幅広い',r:'はばひろい',e:'wide-ranging'}]},
  {id:458,k:'干',m:'dry / stem',on:'カン',ku:'ほ- い-',lv:'N2',st:3,cat:'action',rad:'一',mn:'Post = dry out',ex:[{w:'干す',r:'ほす',e:'to dry'},{w:'干渉',r:'かんしょう',e:'interference'}]},
  {id:459,k:'座',m:'seat / sit',on:'ザ',ku:'すわ-',lv:'N2',st:10,cat:'action',rad:'广',mn:'Shelter + people = sit',ex:[{w:'座る',r:'すわる',e:'to sit'},{w:'座席',r:'ざせき',e:'seat'}]},
  {id:460,k:'延',m:'extend',on:'エン',ku:'の-',lv:'N2',st:8,cat:'action',rad:'廴',mn:'Road + extend',ex:[{w:'延びる',r:'のびる',e:'to extend'},{w:'延長',r:'えんちょう',e:'extension'}]},
  {id:461,k:'弁',m:'dialect / petal / defend',on:'ベン',ku:'',lv:'N2',st:5,cat:'other',rad:'廾',mn:'Separate + hands = speech',ex:[{w:'弁護士',r:'べんごし',e:'lawyer'},{w:'方言・弁',r:'ほうげん・べん',e:'dialect'}]},
  {id:462,k:'当',m:'appropriate / hit',on:'トウ',ku:'あた-',lv:'N2',st:6,cat:'other',rad:'彐',mn:'Pig = appropriate',ex:[{w:'適当',r:'てきとう',e:'appropriate / vague'},{w:'当然',r:'とうぜん',e:'natural/of course'}]},
  {id:463,k:'彩',m:'color / brilliance',on:'サイ',ku:'いろど-',lv:'N2',st:11,cat:'art',rad:'彡',mn:'Pluck + decoration = color',ex:[{w:'色彩',r:'しきさい',e:'color'},{w:'多彩',r:'たさい',e:'colorful'}]},
  {id:464,k:'役',m:'role / service',on:'ヤク・エキ',ku:'',lv:'N2',st:7,cat:'other',rad:'彳',mn:'Walk + hand = service',ex:[{w:'役割',r:'やくわり',e:'role'},{w:'役者',r:'やくしゃ',e:'actor'}]},
  {id:465,k:'征',m:'conquer',on:'セイ',ku:'',lv:'N2',st:8,cat:'action',rad:'彳',mn:'Walk + right = conquer',ex:[{w:'遠征',r:'えんせい',e:'expedition'},{w:'征服',r:'せいふく',e:'conquest'}]},
  {id:466,k:'徒',m:'on foot / follower',on:'ト',ku:'',lv:'N2',st:10,cat:'other',rad:'彳',mn:'Walk + soil = on foot',ex:[{w:'徒歩',r:'とほ',e:'on foot'},{w:'生徒',r:'せいと',e:'student'}]},
  {id:467,k:'御',m:'honorable / control',on:'ゴ・ギョ',ku:'おん',lv:'N2',st:12,cat:'other',rad:'彳',mn:'Walk + serve = control',ex:[{w:'御',r:'おん',e:'honorific'},{w:'制御',r:'せいぎょ',e:'control'}]},
  {id:468,k:'徳',m:'virtue',on:'トク',ku:'',lv:'N2',st:14,cat:'other',rad:'彳',mn:'Walk + heart = virtue',ex:[{w:'道徳',r:'どうとく',e:'morality'},{w:'美徳',r:'びとく',e:'virtue'}]},
  {id:469,k:'微',m:'slight / minute',on:'ビ',ku:'',lv:'N2',st:13,cat:'description',rad:'彳',mn:'Walk + beat = slight',ex:[{w:'微妙',r:'びみょう',e:'subtle'},{w:'微笑',r:'びしょう',e:'smile'}]},
  {id:470,k:'慰',m:'console / comfort',on:'イ',ku:'なぐさ-',lv:'N2',st:15,cat:'feeling',rad:'心',mn:'Military + heart = console',ex:[{w:'慰める',r:'なぐさめる',e:'to console'},{w:'慰安',r:'いあん',e:'comfort'}]},
  {id:471,k:'懸',m:'hang / stake',on:'ケン',ku:'か-',lv:'N2',st:20,cat:'action',rad:'心',mn:'County + heart = hang',ex:[{w:'懸ける',r:'かける',e:'to hang'},{w:'懸念',r:'けねん',e:'concern'}]},
  {id:472,k:'戒',m:'admonish / precept',on:'カイ',ku:'いまし-',lv:'N2',st:7,cat:'other',rad:'戈',mn:'Two hands on spear = precept',ex:[{w:'戒める',r:'いましめる',e:'to admonish'},{w:'戒律',r:'かいりつ',e:'commandment'}]},
  {id:473,k:'把',m:'grasp',on:'ハ',ku:'',lv:'N2',st:7,cat:'action',rad:'手',mn:'Hand + snake = grasp',ex:[{w:'把握',r:'はあく',e:'grasp'},{w:'把持',r:'はじ',e:'holding'}]},
  {id:474,k:'抑',m:'suppress',on:'ヨク',ku:'おさ-',lv:'N2',st:7,cat:'action',rad:'手',mn:'Hand + kneeling = suppress',ex:[{w:'抑える',r:'おさえる',e:'to suppress'},{w:'抑制',r:'よくせい',e:'suppression'}]},
  {id:475,k:'拒',m:'refuse',on:'キョ',ku:'こば-',lv:'N2',st:8,cat:'action',rad:'手',mn:'Hand + giant = refuse',ex:[{w:'拒否',r:'きょひ',e:'refusal'},{w:'拒絶',r:'きょぜつ',e:'rejection'}]},
  {id:476,k:'拡',m:'expand',on:'カク',ku:'ひろ-',lv:'N2',st:8,cat:'action',rad:'手',mn:'Hand + large = expand',ex:[{w:'拡大',r:'かくだい',e:'expansion'},{w:'拡張',r:'かくちょう',e:'extension'}]},
  {id:477,k:'挑',m:'challenge',on:'チョウ',ku:'いど-',lv:'N2',st:9,cat:'action',rad:'手',mn:'Hand + bird = challenge',ex:[{w:'挑む',r:'いどむ',e:'to challenge'},{w:'挑戦',r:'ちょうせん',e:'challenge'}]},
  {id:478,k:'採',m:'collect / hire',on:'サイ',ku:'と-',lv:'N2',st:11,cat:'action',rad:'手',mn:'Hand + tree = collect',ex:[{w:'採用',r:'さいよう',e:'hiring'},{w:'採集',r:'さいしゅう',e:'collection'}]},
  {id:479,k:'摘',m:'pluck / point out',on:'テキ',ku:'つ-',lv:'N2',st:14,cat:'action',rad:'手',mn:'Hand + enemy = pluck',ex:[{w:'摘む',r:'つむ',e:'to pluck'},{w:'指摘',r:'してき',e:'pointing out'}]},
  {id:480,k:'擦',m:'rub / scrape',on:'サツ',ku:'す-',lv:'N2',st:17,cat:'action',rad:'手',mn:'Hand + inspect = rub',ex:[{w:'擦る',r:'こする',e:'to rub'},{w:'摩擦',r:'まさつ',e:'friction'}]},
  {id:481,k:'支',m:'support / branch',on:'シ',ku:'ささ-',lv:'N2',st:4,cat:'action',rad:'支',mn:'Branch held in hand',ex:[{w:'支える',r:'ささえる',e:'to support'},{w:'支持',r:'しじ',e:'support'}]},
  {id:482,k:'敬',m:'respect',on:'ケイ',ku:'うやま-',lv:'N2',st:12,cat:'feeling',rad:'攴',mn:'Sheep + teacher = respect',ex:[{w:'尊敬',r:'そんけい',e:'respect'},{w:'敬意',r:'けいい',e:'respect'}]},
  {id:483,k:'散',m:'scatter',on:'サン',ku:'ち-',lv:'N2',st:12,cat:'action',rad:'攴',mn:'Scatter + beat = scatter',ex:[{w:'散らかす',r:'ちらかす',e:'to scatter'},{w:'解散',r:'かいさん',e:'dissolution'}]},
  {id:484,k:'旨',m:'aim / purport',on:'シ',ku:'むね',lv:'N2',st:6,cat:'other',rad:'日',mn:'Sun + spoon = purport',ex:[{w:'要旨',r:'ようし',e:'summary'},{w:'趣旨',r:'しゅし',e:'purport'}]},
  {id:485,k:'既',m:'already',on:'キ',ku:'すで-',lv:'N2',st:10,cat:'other',rad:'旡',mn:'Person done eating = already',ex:[{w:'既に',r:'すでに',e:'already'},{w:'既存',r:'きそん',e:'existing'}]},
  {id:486,k:'昇',m:'rise',on:'ショウ',ku:'のぼ-',lv:'N2',st:8,cat:'action',rad:'日',mn:'Sun rising = ascend',ex:[{w:'昇る',r:'のぼる',e:'to rise'},{w:'昇進',r:'しょうしん',e:'promotion'}]},
  {id:487,k:'暮',m:'dusk / live',on:'ボ',ku:'く-',lv:'N2',st:14,cat:'time',rad:'日',mn:'Sun going to grass = dusk',ex:[{w:'暮らす',r:'くらす',e:'to live'},{w:'夕暮れ',r:'ゆうぐれ',e:'dusk'}]},
  {id:488,k:'期',m:'period / expect',on:'キ・ゴ',ku:'',lv:'N2',st:12,cat:'time',rad:'月',mn:'Month + organize = period',ex:[{w:'期間',r:'きかん',e:'period'},{w:'予期',r:'よき',e:'expectation'}]},
  {id:489,k:'柱',m:'pillar',on:'チュウ',ku:'はしら',lv:'N2',st:9,cat:'place',rad:'木',mn:'Wood + master = pillar',ex:[{w:'柱',r:'はしら',e:'pillar'},{w:'電柱',r:'でんちゅう',e:'telephone pole'}]},
  {id:490,k:'構',m:'construct / structure',on:'コウ',ku:'かま-',lv:'N2',st:14,cat:'action',rad:'木',mn:'Wood + communicate = structure',ex:[{w:'構造',r:'こうぞう',e:'structure'},{w:'構成',r:'こうせい',e:'composition'}]},
  {id:491,k:'模',m:'pattern / imitate',on:'モ・ボ',ku:'',lv:'N2',st:14,cat:'art',rad:'木',mn:'Wood + nothing = pattern',ex:[{w:'模様',r:'もよう',e:'pattern'},{w:'規模',r:'きぼ',e:'scale'}]},
  {id:492,k:'権',m:'authority / right',on:'ケン',ku:'',lv:'N2',st:15,cat:'society',rad:'木',mn:'Wood + bird = authority',ex:[{w:'権利',r:'けんり',e:'right'},{w:'権力',r:'けんりょく',e:'power'}]},
  {id:493,k:'欠',m:'lack / absent',on:'ケツ',ku:'か- かけ-',lv:'N2',st:4,cat:'other',rad:'欠',mn:'Person yawning = lack',ex:[{w:'欠ける',r:'かける',e:'to lack'},{w:'欠陥',r:'けっかん',e:'defect'}]},
  {id:494,k:'欲',m:'desire',on:'ヨク',ku:'ほ-',lv:'N2',st:11,cat:'feeling',rad:'欠',mn:'Valley + yawn = desire',ex:[{w:'欲しい',r:'ほしい',e:'to want'},{w:'食欲',r:'しょくよく',e:'appetite'}]},
  {id:495,k:'歓',m:'joy / welcome',on:'カン',ku:'',lv:'N2',st:15,cat:'feeling',rad:'欠',mn:'Bird\'s joy = welcome',ex:[{w:'歓迎',r:'かんげい',e:'welcome'},{w:'歓声',r:'かんせい',e:'cheer'}]},
  {id:496,k:'歴',m:'history / career',on:'レキ',ku:'',lv:'N2',st:14,cat:'other',rad:'止',mn:'Many + stop = history',ex:[{w:'歴史',r:'れきし',e:'history'},{w:'経歴',r:'けいれき',e:'career'}]},
  {id:497,k:'段',m:'step / level',on:'ダン',ku:'',lv:'N2',st:9,cat:'other',rad:'殳',mn:'Hand + weapon = step',ex:[{w:'段階',r:'だんかい',e:'stage'},{w:'手段',r:'しゅだん',e:'means'}]},
  {id:498,k:'永',m:'eternal',on:'エイ',ku:'なが-',lv:'N2',st:5,cat:'time',rad:'水',mn:'Long flowing water = eternal',ex:[{w:'永遠',r:'えいえん',e:'eternity'},{w:'永久',r:'えいきゅう',e:'permanence'}]},
  {id:499,k:'泡',m:'bubble / foam',on:'ホウ',ku:'あわ',lv:'N2',st:8,cat:'nature',rad:'水',mn:'Water + wrap = bubble',ex:[{w:'泡',r:'あわ',e:'bubble'},{w:'泡立てる',r:'あわだてる',e:'to foam'}]},
  {id:500,k:'洗',m:'wash',on:'セン',ku:'あら-',lv:'N2',st:9,cat:'action',rad:'水',mn:'Water + first = wash',ex:[{w:'洗う',r:'あらう',e:'to wash'},{w:'洗濯',r:'せんたく',e:'laundry'}]},
  {id:501,k:'浮',m:'float',on:'フ',ku:'う-',lv:'N2',st:10,cat:'action',rad:'水',mn:'Water + child = float',ex:[{w:'浮く',r:'うく',e:'to float'},{w:'浮かぶ',r:'うかぶ',e:'to float/come to mind'}]},
  {id:502,k:'混',m:'mix',on:'コン',ku:'ま-',lv:'N2',st:11,cat:'action',rad:'水',mn:'Water + elder = mix',ex:[{w:'混ぜる',r:'まぜる',e:'to mix'},{w:'混乱',r:'こんらん',e:'confusion'}]},
  {id:503,k:'液',m:'liquid',on:'エキ',ku:'',lv:'N2',st:11,cat:'nature',rad:'水',mn:'Water + night = liquid',ex:[{w:'液体',r:'えきたい',e:'liquid'},{w:'血液',r:'けつえき',e:'blood'}]},
  {id:504,k:'激',m:'intense / violent',on:'ゲキ',ku:'はげ-',lv:'N2',st:16,cat:'description',rad:'水',mn:'Water + white + strike = intense',ex:[{w:'激しい',r:'はげしい',e:'intense'},{w:'感激',r:'かんげき',e:'deep emotion'}]},
  {id:505,k:'潮',m:'tide / trend',on:'チョウ',ku:'しお',lv:'N2',st:15,cat:'nature',rad:'水',mn:'Water + morning = tide',ex:[{w:'潮',r:'しお',e:'tide'},{w:'潮流',r:'ちょうりゅう',e:'current/trend'}]},
  {id:506,k:'濃',m:'thick / dark',on:'ノウ',ku:'こ-',lv:'N2',st:16,cat:'description',rad:'水',mn:'Water + agriculture = thick',ex:[{w:'濃い',r:'こい',e:'thick/dark'},{w:'濃度',r:'のうど',e:'concentration'}]},
  {id:507,k:'灰',m:'ash',on:'カイ',ku:'はい',lv:'N2',st:6,cat:'nature',rad:'火',mn:'Hand + fire = ash',ex:[{w:'灰',r:'はい',e:'ash'},{w:'灰色',r:'はいいろ',e:'grey'}]},
  {id:508,k:'炎',m:'flame',on:'エン',ku:'ほのお',lv:'N2',st:8,cat:'nature',rad:'火',mn:'Two fires = flame',ex:[{w:'炎',r:'ほのお',e:'flame'},{w:'炎症',r:'えんしょう',e:'inflammation'}]},
  {id:509,k:'煙',m:'smoke',on:'エン',ku:'けむり',lv:'N2',st:13,cat:'nature',rad:'火',mn:'Fire + land + person = smoke',ex:[{w:'煙',r:'けむり',e:'smoke'},{w:'禁煙',r:'きんえん',e:'no smoking'}]},
  {id:510,k:'燃',m:'burn',on:'ネン',ku:'も-',lv:'N2',st:16,cat:'action',rad:'火',mn:'Fire + shape = burn',ex:[{w:'燃える',r:'もえる',e:'to burn'},{w:'燃料',r:'ねんりょう',e:'fuel'}]},
  {id:511,k:'爆',m:'explode',on:'バク',ku:'',lv:'N2',st:19,cat:'action',rad:'火',mn:'Fire + burst = explode',ex:[{w:'爆発',r:'ばくはつ',e:'explosion'},{w:'核爆弾',r:'かくばくだん',e:'nuclear bomb'}]},
  {id:512,k:'牧',m:'pasture / herd',on:'ボク',ku:'まき',lv:'N2',st:8,cat:'nature',rad:'牛',mn:'Ox + beat = herd',ex:[{w:'牧場',r:'まきば',e:'pasture'},{w:'牧師',r:'ぼくし',e:'pastor'}]},
  {id:513,k:'犯',m:'crime / commit',on:'ハン',ku:'おか-',lv:'N2',st:5,cat:'other',rad:'犬',mn:'Dog + bend = crime',ex:[{w:'犯罪',r:'はんざい',e:'crime'},{w:'犯人',r:'はんにん',e:'criminal'}]},
  {id:514,k:'独',m:'alone',on:'ドク',ku:'ひと-',lv:'N2',st:9,cat:'description',rad:'犬',mn:'Dog + worm = alone',ex:[{w:'独り',r:'ひとり',e:'alone'},{w:'独立',r:'どくりつ',e:'independence'}]},
  {id:515,k:'率',m:'rate / lead',on:'ソツ・リツ',ku:'ひき-',lv:'N2',st:11,cat:'other',rad:'玄',mn:'Thread + net = rate',ex:[{w:'率',r:'りつ',e:'rate'},{w:'効率',r:'こうりつ',e:'efficiency'}]},
  {id:516,k:'現',m:'present / appear',on:'ゲン',ku:'あらわ-',lv:'N2',st:11,cat:'time',rad:'玉',mn:'Gem appearing = present',ex:[{w:'現実',r:'げんじつ',e:'reality'},{w:'出現',r:'しゅつげん',e:'appearance'}]},
  {id:517,k:'珍',m:'rare / unusual',on:'チン',ku:'めずら-',lv:'N2',st:9,cat:'description',rad:'玉',mn:'Gem + hair = rare',ex:[{w:'珍しい',r:'めずらしい',e:'rare'},{w:'珍品',r:'ちんぴん',e:'rarity'}]},
  {id:518,k:'産',m:'produce',on:'サン',ku:'う-',lv:'N2',st:11,cat:'action',rad:'生',mn:'Birth on cliff',ex:[{w:'財産',r:'ざいさん',e:'property/assets'},{w:'不動産',r:'ふどうさん',e:'real estate'}]},
  {id:519,k:'略',m:'abbreviate / strategy',on:'リャク',ku:'',lv:'N2',st:11,cat:'other',rad:'田',mn:'Rice field + each = strategy',ex:[{w:'略す',r:'りゃくす',e:'to abbreviate'},{w:'戦略',r:'せんりゃく',e:'strategy'}]},
  {id:520,k:'異',m:'different / unusual',on:'イ',ku:'こと',lv:'N2',st:11,cat:'description',rad:'田',mn:'Different field = unusual',ex:[{w:'異なる',r:'ことなる',e:'to differ'},{w:'異常',r:'いじょう',e:'abnormal'}]},
  {id:521,k:'疑',m:'doubt',on:'ギ',ku:'うたが-',lv:'N2',st:14,cat:'feeling',rad:'疋',mn:'Stop + spear = doubt',ex:[{w:'疑う',r:'うたがう',e:'to doubt'},{w:'疑問',r:'ぎもん',e:'doubt/question'}]},
  {id:522,k:'症',m:'symptom',on:'ショウ',ku:'',lv:'N2',st:10,cat:'health',rad:'疒',mn:'Sickbed + straight = symptom',ex:[{w:'症状',r:'しょうじょう',e:'symptoms'},{w:'炎症',r:'えんしょう',e:'inflammation'}]},
  {id:523,k:'療',m:'treat / heal',on:'リョウ',ku:'',lv:'N2',st:17,cat:'health',rad:'疒',mn:'Sickbed + bright = treat',ex:[{w:'治療',r:'ちりょう',e:'treatment'},{w:'医療',r:'いりょう',e:'medical care'}]},
  {id:524,k:'益',m:'benefit',on:'エキ・ヤク',ku:'',lv:'N2',st:10,cat:'other',rad:'皿',mn:'Water + dish = benefit',ex:[{w:'利益',r:'りえき',e:'profit'},{w:'損益',r:'そんえき',e:'profit and loss'}]},
  {id:525,k:'省',m:'ministry / reflect',on:'セイ・ショウ',ku:'はぶ-',lv:'N2',st:9,cat:'society',rad:'目',mn:'Eye + small = reflect',ex:[{w:'反省',r:'はんせい',e:'reflection'},{w:'省エネ',r:'しょうエネ',e:'energy saving'}]},
  {id:526,k:'眺',m:'gaze / view',on:'チョウ',ku:'なが-',lv:'N2',st:11,cat:'action',rad:'目',mn:'Eye + far = gaze',ex:[{w:'眺める',r:'ながめる',e:'to gaze'},{w:'眺め',r:'ながめ',e:'view'}]},
  {id:527,k:'磁',m:'magnet',on:'ジ',ku:'',lv:'N2',st:14,cat:'other',rad:'石',mn:'Stone + cloth = magnet',ex:[{w:'磁石',r:'じしゃく',e:'magnet'},{w:'電磁',r:'でんじ',e:'electromagnetic'}]},
  {id:528,k:'示',m:'show',on:'ジ・シ',ku:'しめ-',lv:'N2',st:5,cat:'action',rad:'示',mn:'Altar = show',ex:[{w:'指示',r:'しじ',e:'instruction'},{w:'提示',r:'ていじ',e:'presentation'}]},
  {id:529,k:'礎',m:'foundation stone',on:'ソ',ku:'いしずえ',lv:'N2',st:18,cat:'other',rad:'石',mn:'Stone + place = foundation',ex:[{w:'基礎',r:'きそ',e:'foundation'},{w:'礎石',r:'そせき',e:'cornerstone'}]},
  {id:530,k:'稼',m:'earn',on:'カ',ku:'かせ-',lv:'N2',st:15,cat:'work',rad:'禾',mn:'Grain + house = earn',ex:[{w:'稼ぐ',r:'かせぐ',e:'to earn'},{w:'稼働',r:'かどう',e:'operation'}]},
  {id:531,k:'穂',m:'ear of grain',on:'スイ',ku:'ほ',lv:'N2',st:15,cat:'nature',rad:'禾',mn:'Grain + heart = grain head',ex:[{w:'稲穂',r:'いなほ',e:'rice ear'},{w:'穂先',r:'ほさき',e:'tip'}]},
  {id:532,k:'端',m:'end / edge',on:'タン',ku:'はし・は・はた',lv:'N2',st:14,cat:'other',rad:'立',mn:'Stand + cloth = edge',ex:[{w:'端',r:'はし',e:'end/edge'},{w:'極端',r:'きょくたん',e:'extreme'}]},
  {id:533,k:'純',m:'pure',on:'ジュン',ku:'',lv:'N2',st:10,cat:'description',rad:'糸',mn:'Thread + child = pure',ex:[{w:'純粋',r:'じゅんすい',e:'pure'},{w:'単純',r:'たんじゅん',e:'simple'}]},
  {id:534,k:'絡',m:'entangle',on:'ラク',ku:'から-',lv:'N2',st:12,cat:'action',rad:'糸',mn:'Thread + each = entangle',ex:[{w:'連絡',r:'れんらく',e:'contact'},{w:'絡む',r:'からむ',e:'to tangle'}]},
  {id:535,k:'緊',m:'tense / urgent',on:'キン',ku:'',lv:'N2',st:15,cat:'description',rad:'糸',mn:'Captured + thread = tense',ex:[{w:'緊張',r:'きんちょう',e:'tension'},{w:'緊急',r:'きんきゅう',e:'urgent'}]},
  {id:536,k:'繰',m:'reel / repeat',on:'ソウ',ku:'く-',lv:'N2',st:19,cat:'action',rad:'糸',mn:'Thread + nest = reel',ex:[{w:'繰り返す',r:'くりかえす',e:'to repeat'},{w:'繰り越す',r:'くりこす',e:'to carry over'}]},
  {id:537,k:'縮',m:'shrink',on:'シュク',ku:'ちぢ-',lv:'N2',st:17,cat:'action',rad:'糸',mn:'Thread + lodging = shrink',ex:[{w:'縮む',r:'ちぢむ',e:'to shrink'},{w:'短縮',r:'たんしゅく',e:'shortening'}]},
  {id:538,k:'結',m:'tie / result',on:'ケツ',ku:'むす- ゆ-',lv:'N2',st:12,cat:'action',rad:'糸',mn:'Thread + auspicious = tie',ex:[{w:'結ぶ',r:'むすぶ',e:'to tie'},{w:'結果',r:'けっか',e:'result'}]},
  {id:539,k:'絶',m:'cut off / absolute',on:'ゼツ',ku:'た-',lv:'N2',st:12,cat:'action',rad:'糸',mn:'Thread + color = cut off',ex:[{w:'絶対',r:'ぜったい',e:'absolute'},{w:'絶える',r:'たえる',e:'to cease'}]},
  {id:540,k:'総',m:'general / all',on:'ソウ',ku:'すべ-',lv:'N2',st:14,cat:'other',rad:'糸',mn:'Thread + heart = general',ex:[{w:'総合',r:'そうごう',e:'comprehensive'},{w:'総理',r:'そうり',e:'prime minister'}]},
  {id:541,k:'織',m:'weave / organization',on:'ショク・シキ',ku:'お-',lv:'N2',st:18,cat:'action',rad:'糸',mn:'Thread + flag = weave',ex:[{w:'組織',r:'そしき',e:'organization'},{w:'織る',r:'おる',e:'to weave'}]},
  {id:542,k:'罰',m:'punish',on:'バツ・バチ',ku:'',lv:'N2',st:14,cat:'other',rad:'网',mn:'Net + knife = punish',ex:[{w:'罰',r:'ばつ',e:'punishment'},{w:'罰金',r:'ばっきん',e:'fine'}]},
  {id:543,k:'翻',m:'translate / flap',on:'ホン',ku:'ひるがえ-',lv:'N2',st:18,cat:'action',rad:'羽',mn:'Wings + number = translate',ex:[{w:'翻訳',r:'ほんやく',e:'translation'},{w:'翻る',r:'ひるがえる',e:'to flutter'}]},
  {id:544,k:'老',m:'old / elderly',on:'ロウ',ku:'お-',lv:'N2',st:6,cat:'people',rad:'老',mn:'Hunched elder with cane',ex:[{w:'老人',r:'ろうじん',e:'elderly person'},{w:'老化',r:'ろうか',e:'aging'}]},
  {id:545,k:'肩',m:'shoulder',on:'ケン',ku:'かた',lv:'N2',st:8,cat:'body',rad:'月',mn:'Door + body = shoulder',ex:[{w:'肩',r:'かた',e:'shoulder'},{w:'肩書',r:'かたがき',e:'title'}]},
  {id:546,k:'背',m:'back / height',on:'ハイ',ku:'せ・そむ-',lv:'N2',st:9,cat:'body',rad:'月',mn:'North + body = back',ex:[{w:'背',r:'せ',e:'back'},{w:'背中',r:'せなか',e:'back (of body)'}]},
  {id:547,k:'胃',m:'stomach',on:'イ',ku:'',lv:'N2',st:9,cat:'body',rad:'月',mn:'Field + body = stomach',ex:[{w:'胃',r:'い',e:'stomach'},{w:'胃腸',r:'いちょう',e:'stomach and intestines'}]},
  {id:548,k:'腸',m:'intestines',on:'チョウ',ku:'',lv:'N2',st:13,cat:'body',rad:'月',mn:'Body + sun = intestines',ex:[{w:'腸',r:'ちょう',e:'intestines'},{w:'大腸',r:'だいちょう',e:'large intestine'}]},
  {id:549,k:'脂',m:'fat / grease',on:'シ',ku:'あぶら',lv:'N2',st:10,cat:'body',rad:'月',mn:'Body + elder = fat',ex:[{w:'脂肪',r:'しぼう',e:'fat'},{w:'油脂',r:'ゆし',e:'oils and fats'}]},
  {id:550,k:'腹',m:'belly / stomach',on:'フク',ku:'はら',lv:'N2',st:13,cat:'body',rad:'月',mn:'Body + return = belly',ex:[{w:'腹',r:'はら',e:'belly'},{w:'空腹',r:'くうふく',e:'hunger'}]},
  {id:551,k:'膚',m:'skin',on:'フ',ku:'はだ',lv:'N2',st:15,cat:'body',rad:'月',mn:'Body + tiger = skin',ex:[{w:'皮膚',r:'ひふ',e:'skin'},{w:'肌膚',r:'はだ',e:'skin (poetic)'}]},
  {id:552,k:'臓',m:'internal organ',on:'ゾウ',ku:'',lv:'N2',st:19,cat:'body',rad:'月',mn:'Body + store = organ',ex:[{w:'心臓',r:'しんぞう',e:'heart (organ)'},{w:'肝臓',r:'かんぞう',e:'liver'}]},
  {id:553,k:'芝',m:'lawn / turf',on:'シ',ku:'しば',lv:'N2',st:6,cat:'nature',rad:'艸',mn:'Grass + skill = lawn',ex:[{w:'芝生',r:'しばふ',e:'lawn'},{w:'芝居',r:'しばい',e:'play/theater'}]},
  {id:554,k:'茂',m:'flourish',on:'モ',ku:'しげ-',lv:'N2',st:8,cat:'nature',rad:'艸',mn:'Mature + grass = flourish',ex:[{w:'茂る',r:'しげる',e:'to flourish'},{w:'茂み',r:'しげみ',e:'thicket'}]},
  {id:555,k:'荒',m:'rough / desolate',on:'コウ',ku:'あら-',lv:'N2',st:9,cat:'nature',rad:'艸',mn:'River + grass = rough',ex:[{w:'荒い',r:'あらい',e:'rough'},{w:'荒れる',r:'あれる',e:'to be rough'}]},
  {id:556,k:'蒸',m:'steam',on:'ジョウ',ku:'む-',lv:'N2',st:13,cat:'action',rad:'艸',mn:'Grass + fire = steam',ex:[{w:'蒸す',r:'むす',e:'to steam'},{w:'蒸気',r:'じょうき',e:'steam'}]},
  {id:557,k:'蓄',m:'accumulate',on:'チク',ku:'たくわ-',lv:'N2',st:13,cat:'action',rad:'艸',mn:'Grass + flow = accumulate',ex:[{w:'蓄える',r:'たくわえる',e:'to save up'},{w:'蓄積',r:'ちくせき',e:'accumulation'}]},
  {id:558,k:'被',m:'cover / suffer',on:'ヒ',ku:'かぶ- こうむ-',lv:'N2',st:10,cat:'action',rad:'衣',mn:'Garment + skin = cover',ex:[{w:'被る',r:'かぶる',e:'to wear/suffer'},{w:'被害',r:'ひがい',e:'damage'}]},
  {id:559,k:'複',m:'complex / double',on:'フク',ku:'',lv:'N2',st:14,cat:'description',rad:'衣',mn:'Garment + return = double',ex:[{w:'複雑',r:'ふくざつ',e:'complex'},{w:'複数',r:'ふくすう',e:'plural'}]},
  {id:560,k:'補',m:'supplement',on:'ホ',ku:'おぎな-',lv:'N2',st:12,cat:'action',rad:'衣',mn:'Garment + announce = supplement',ex:[{w:'補う',r:'おぎなう',e:'to supplement'},{w:'補助',r:'ほじょ',e:'assistance'}]},
  {id:561,k:'訴',m:'sue / appeal',on:'ソ',ku:'うった-',lv:'N2',st:12,cat:'action',rad:'言',mn:'Words + flow = appeal',ex:[{w:'訴える',r:'うったえる',e:'to appeal'},{w:'起訴',r:'きそ',e:'indictment'}]},
  {id:562,k:'診',m:'diagnose',on:'シン',ku:'み-',lv:'N2',st:12,cat:'action',rad:'言',mn:'Words + reap = diagnose',ex:[{w:'診る',r:'みる',e:'to diagnose'},{w:'診断',r:'しんだん',e:'diagnosis'}]},
  {id:563,k:'誤',m:'mistake',on:'ゴ',ku:'あやま-',lv:'N2',st:14,cat:'other',rad:'言',mn:'Words + self = mistake',ex:[{w:'誤り',r:'あやまり',e:'mistake'},{w:'誤解',r:'ごかい',e:'misunderstanding'}]},
  {id:564,k:'誰',m:'who',on:'スイ',ku:'だれ・たれ',lv:'N2',st:15,cat:'other',rad:'言',mn:'Words + bird = who',ex:[{w:'誰',r:'だれ',e:'who'},{w:'誰も',r:'だれも',e:'everyone / no one'}]},
  {id:565,k:'討',m:'attack / discuss',on:'トウ',ku:'う-',lv:'N2',st:10,cat:'action',rad:'言',mn:'Words + village = discuss',ex:[{w:'討論',r:'とうろん',e:'debate'},{w:'検討',r:'けんとう',e:'examination'}]},
  {id:566,k:'認',m:'recognize',on:'ニン',ku:'みと-',lv:'N2',st:14,cat:'action',rad:'言',mn:'Words + patience = recognize',ex:[{w:'承認',r:'しょうにん',e:'approval'},{w:'認識',r:'にんしき',e:'recognition'}]},
  {id:567,k:'誘',m:'invite / induce',on:'ユウ',ku:'さそ-',lv:'N2',st:14,cat:'action',rad:'言',mn:'Words + reach = invite',ex:[{w:'誘う',r:'さそう',e:'to invite'},{w:'誘惑',r:'ゆうわく',e:'temptation'}]},
  {id:568,k:'調',m:'investigate / tune',on:'チョウ',ku:'しら- ととの-',lv:'N2',st:15,cat:'action',rad:'言',mn:'Words + circumference = investigate',ex:[{w:'調べる',r:'しらべる',e:'to investigate'},{w:'調整',r:'ちょうせい',e:'adjustment'}]},
  {id:569,k:'諸',m:'various',on:'ショ',ku:'もろ',lv:'N2',st:16,cat:'other',rad:'言',mn:'Words + elder = various',ex:[{w:'諸国',r:'しょこく',e:'various countries'},{w:'諸問題',r:'しょもんだい',e:'various problems'}]},
  {id:570,k:'謙',m:'modest',on:'ケン',ku:'',lv:'N2',st:17,cat:'feeling',rad:'言',mn:'Words + combine = modest',ex:[{w:'謙虚',r:'けんきょ',e:'humble'},{w:'謙遜',r:'けんそん',e:'modesty'}]},
  {id:571,k:'警',m:'warn / guard',on:'ケイ',ku:'',lv:'N2',st:19,cat:'other',rad:'言',mn:'Attack + heart + words = warn',ex:[{w:'警察',r:'けいさつ',e:'police'},{w:'警備',r:'けいび',e:'guard'}]},
  {id:572,k:'護',m:'protect',on:'ゴ',ku:'まも-',lv:'N2',st:20,cat:'action',rad:'言',mn:'Words + bird = protect',ex:[{w:'保護',r:'ほご',e:'protection'},{w:'弁護士',r:'べんごし',e:'lawyer'}]},
  {id:573,k:'貢',m:'tribute / contribute',on:'コウ・ク',ku:'みつ-',lv:'N2',st:10,cat:'other',rad:'貝',mn:'Shell + work = tribute',ex:[{w:'貢献',r:'こうけん',e:'contribution'},{w:'貢ぐ',r:'みつぐ',e:'to pay tribute'}]},
  {id:574,k:'財',m:'wealth / property',on:'ザイ',ku:'',lv:'N2',st:10,cat:'other',rad:'貝',mn:'Shell + talent = wealth',ex:[{w:'財産',r:'ざいさん',e:'property'},{w:'財政',r:'ざいせい',e:'finance'}]},
  {id:575,k:'貧',m:'poor',on:'ヒン',ku:'まず-',lv:'N2',st:11,cat:'other',rad:'貝',mn:'Divide + shell = poor',ex:[{w:'貧しい',r:'まずしい',e:'poor'},{w:'貧困',r:'ひんこん',e:'poverty'}]},
  {id:576,k:'賃',m:'wages / rent',on:'チン',ku:'',lv:'N2',st:13,cat:'other',rad:'貝',mn:'Shell + duty = wages',ex:[{w:'賃金',r:'ちんぎん',e:'wages'},{w:'家賃',r:'やちん',e:'rent'}]},
  {id:577,k:'資',m:'resources / funds',on:'シ',ku:'',lv:'N2',st:13,cat:'other',rad:'貝',mn:'Next + shell = resources',ex:[{w:'資金',r:'しきん',e:'funds'},{w:'資源',r:'しげん',e:'resources'}]},
  {id:578,k:'贈',m:'give a gift',on:'ゾウ',ku:'おく-',lv:'N2',st:18,cat:'action',rad:'貝',mn:'Shell + add = give gift',ex:[{w:'贈る',r:'おくる',e:'to give a gift'},{w:'贈り物',r:'おくりもの',e:'gift'}]},
  {id:579,k:'越',m:'exceed / cross',on:'エツ',ku:'こ-',lv:'N2',st:12,cat:'action',rad:'走',mn:'Run + battle = exceed',ex:[{w:'越える',r:'こえる',e:'to exceed'},{w:'超越',r:'ちょうえつ',e:'transcendence'}]},
  {id:580,k:'趣',m:'taste / interest',on:'シュ',ku:'おもむき',lv:'N2',st:15,cat:'feeling',rad:'走',mn:'Run + take = inclination',ex:[{w:'趣味',r:'しゅみ',e:'hobby'},{w:'趣旨',r:'しゅし',e:'purpose'}]},
  {id:581,k:'跡',m:'trace / mark',on:'セキ',ku:'あと',lv:'N2',st:13,cat:'other',rad:'足',mn:'Foot + red = trace',ex:[{w:'跡',r:'あと',e:'trace'},{w:'足跡',r:'あしあと',e:'footprint'}]},
  {id:582,k:'距',m:'distance',on:'キョ',ku:'',lv:'N2',st:12,cat:'other',rad:'足',mn:'Foot + giant = distance',ex:[{w:'距離',r:'きょり',e:'distance'},{w:'近距離',r:'きんきょり',e:'short distance'}]},
  {id:583,k:'踏',m:'step on',on:'トウ',ku:'ふ-',lv:'N2',st:15,cat:'action',rad:'足',mn:'Foot + water = step on',ex:[{w:'踏む',r:'ふむ',e:'to step on'},{w:'踏まえる',r:'ふまえる',e:'to be based on'}]},
  {id:584,k:'軸',m:'axis / axle',on:'ジク',ku:'',lv:'N2',st:12,cat:'other',rad:'車',mn:'Vehicle + middle = axis',ex:[{w:'軸',r:'じく',e:'axis'},{w:'基軸',r:'きじく',e:'key axis'}]},
  {id:585,k:'輸',m:'transport',on:'ユ',ku:'',lv:'N2',st:16,cat:'action',rad:'車',mn:'Vehicle + one who = transport',ex:[{w:'輸送',r:'ゆそう',e:'transport'},{w:'輸入',r:'ゆにゅう',e:'import'}]},
  {id:586,k:'載',m:'load / publish',on:'サイ',ku:'の- のせ-',lv:'N2',st:13,cat:'action',rad:'車',mn:'Vehicle + year = load',ex:[{w:'掲載',r:'けいさい',e:'publication'},{w:'記載',r:'きさい',e:'description'}]},
  {id:587,k:'逃',m:'escape',on:'トウ',ku:'に-',lv:'N2',st:9,cat:'action',rad:'辶',mn:'Spoon + road = escape',ex:[{w:'逃げる',r:'にげる',e:'to escape'},{w:'逃亡',r:'とうぼう',e:'flight'}]},
  {id:588,k:'迷',m:'lost / confused',on:'メイ',ku:'まよ-',lv:'N2',st:9,cat:'action',rad:'辶',mn:'Rice + road = lost',ex:[{w:'迷う',r:'まよう',e:'to be lost'},{w:'迷惑',r:'めいわく',e:'nuisance'}]},
  {id:589,k:'追',m:'chase / pursue',on:'ツイ',ku:'お-',lv:'N2',st:9,cat:'action',rad:'辶',mn:'Mound + road = chase',ex:[{w:'追う',r:'おう',e:'to chase'},{w:'追加',r:'ついか',e:'addition'}]},
  {id:590,k:'選',m:'select / choose',on:'セン',ku:'えら-',lv:'N2',st:15,cat:'action',rad:'辶',mn:'Bend + road = select',ex:[{w:'選ぶ',r:'えらぶ',e:'to choose'},{w:'選挙',r:'せんきょ',e:'election'}]},
  {id:591,k:'遊',m:'play / wander',on:'ユウ',ku:'あそ-',lv:'N2',st:12,cat:'action',rad:'辶',mn:'Child + flag + road = play',ex:[{w:'遊ぶ',r:'あそぶ',e:'to play'},{w:'遊園地',r:'ゆうえんち',e:'amusement park'}]},
  {id:592,k:'遺',m:'leave behind',on:'イ・ユイ',ku:'',lv:'N2',st:15,cat:'other',rad:'辶',mn:'Valuables + road = leave behind',ex:[{w:'遺産',r:'いさん',e:'heritage'},{w:'遺言',r:'ゆいごん',e:'will/testament'}]},
  {id:593,k:'酸',m:'sour / acid',on:'サン',ku:'す-',lv:'N2',st:14,cat:'nature',rad:'酉',mn:'Wine + wriggle = acid',ex:[{w:'酸っぱい',r:'すっぱい',e:'sour'},{w:'酸素',r:'さんそ',e:'oxygen'}]},
  {id:594,k:'釈',m:'explain / release',on:'シャク',ku:'',lv:'N2',st:11,cat:'other',rad:'釆',mn:'Measure + divide = explain',ex:[{w:'解釈',r:'かいしゃく',e:'interpretation'},{w:'釈放',r:'しゃくほう',e:'release'}]},
  {id:595,k:'鉄',m:'iron',on:'テツ',ku:'',lv:'N2',st:13,cat:'other',rad:'金',mn:'Metal + lose = iron',ex:[{w:'鉄道',r:'てつどう',e:'railway'},{w:'鉄',r:'てつ',e:'iron'}]},
  {id:596,k:'鋭',m:'sharp',on:'エイ',ku:'するど-',lv:'N2',st:15,cat:'description',rad:'金',mn:'Metal + exchange = sharp',ex:[{w:'鋭い',r:'するどい',e:'sharp'},{w:'鋭敏',r:'えいびん',e:'keen'}]},
  {id:597,k:'録',m:'record',on:'ロク',ku:'',lv:'N2',st:16,cat:'action',rad:'金',mn:'Metal + colorful = record',ex:[{w:'記録',r:'きろく',e:'record'},{w:'録音',r:'ろくおん',e:'recording'}]},
  {id:598,k:'鏡',m:'mirror',on:'キョウ',ku:'かがみ',lv:'N2',st:19,cat:'other',rad:'金',mn:'Metal + competition = mirror',ex:[{w:'鏡',r:'かがみ',e:'mirror'},{w:'眼鏡',r:'めがね',e:'glasses'}]},
  {id:599,k:'陰',m:'shade / negative',on:'イン',ku:'かげ',lv:'N2',st:11,cat:'nature',rad:'阜',mn:'Mound + dark = shade',ex:[{w:'陰',r:'かげ',e:'shade'},{w:'陰性',r:'いんせい',e:'negative'}]},
  {id:600,k:'陸',m:'land',on:'リク',ku:'',lv:'N2',st:11,cat:'nature',rad:'阜',mn:'Mound + land = land',ex:[{w:'陸地',r:'りくち',e:'land'},{w:'大陸',r:'たいりく',e:'continent'}]},
  {id:601,k:'際',m:'border',on:'サイ',ku:'きわ',lv:'N2',st:14,cat:'other',rad:'阜',mn:'Mound + sacrifice = border',ex:[{w:'国際',r:'こくさい',e:'international'},{w:'境際',r:'さかいきわ',e:'borderline'}]},
  {id:602,k:'障',m:'obstacle / impair',on:'ショウ',ku:'さわ-',lv:'N2',st:14,cat:'other',rad:'阜',mn:'Mound + order = obstacle',ex:[{w:'障害',r:'しょうがい',e:'obstacle'},{w:'故障',r:'こしょう',e:'breakdown'}]},
  {id:603,k:'雄',m:'male / heroic',on:'ユウ',ku:'おす・お',lv:'N2',st:12,cat:'description',rad:'隹',mn:'Arm + bird = male',ex:[{w:'雄',r:'おす',e:'male animal'},{w:'英雄',r:'えいゆう',e:'hero'}]},
  {id:604,k:'難',m:'difficult',on:'ナン',ku:'むずか-',lv:'N2',st:18,cat:'description',rad:'隹',mn:'Bird in fire = difficult',ex:[{w:'困難',r:'こんなん',e:'difficulty'},{w:'難民',r:'なんみん',e:'refugee'}]},
  {id:605,k:'革',m:'leather / reform',on:'カク',ku:'かわ',lv:'N2',st:9,cat:'other',rad:'革',mn:'Hide being stretched = leather',ex:[{w:'革命',r:'かくめい',e:'revolution'},{w:'革新',r:'かくしん',e:'innovation'}]},
  {id:606,k:'頂',m:'peak / top',on:'チョウ',ku:'いただ-',lv:'N2',st:11,cat:'other',rad:'頁',mn:'Nail + head = peak',ex:[{w:'山頂',r:'さんちょう',e:'mountain peak'},{w:'頂点',r:'ちょうてん',e:'apex'}]},
  {id:607,k:'頻',m:'frequent',on:'ヒン',ku:'しき-',lv:'N2',st:17,cat:'other',rad:'頁',mn:'Step + head = frequent',ex:[{w:'頻繁',r:'ひんぱん',e:'frequent'},{w:'頻度',r:'ひんど',e:'frequency'}]},
  {id:608,k:'題',m:'topic / title',on:'ダイ',ku:'',lv:'N2',st:18,cat:'school',rad:'頁',mn:'Is + head = topic',ex:[{w:'題名',r:'だいめい',e:'title'},{w:'問題',r:'もんだい',e:'problem'}]},
  {id:609,k:'額',m:'amount / forehead',on:'ガク',ku:'ひたい',lv:'N2',st:18,cat:'other',rad:'頁',mn:'Guest + head = forehead/amount',ex:[{w:'金額',r:'きんがく',e:'amount of money'},{w:'額',r:'ひたい',e:'forehead'}]},
  {id:610,k:'顧',m:'look back / consider',on:'コ',ku:'かえり-',lv:'N2',st:21,cat:'other',rad:'頁',mn:'Hire + head = consider',ex:[{w:'顧客',r:'こきゃく',e:'customer'},{w:'顧みる',r:'かえりみる',e:'to look back'}]},
  {id:611,k:'飾',m:'decorate',on:'ショク',ku:'かざ-',lv:'N2',st:13,cat:'art',rad:'食',mn:'Food + cloth = decorate',ex:[{w:'飾る',r:'かざる',e:'to decorate'},{w:'装飾',r:'そうしょく',e:'decoration'}]},
  {id:612,k:'養',m:'raise / nourish',on:'ヨウ',ku:'やしな-',lv:'N2',st:15,cat:'action',rad:'食',mn:'Sheep + food = nourish',ex:[{w:'養う',r:'やしなう',e:'to nurture'},{w:'栄養',r:'えいよう',e:'nutrition'}]},
  {id:613,k:'騒',m:'noisy / commotion',on:'ソウ',ku:'さわ-',lv:'N2',st:18,cat:'description',rad:'馬',mn:'Horse + insect = noisy',ex:[{w:'騒ぐ',r:'さわぐ',e:'to make noise'},{w:'騒音',r:'そうおん',e:'noise'}]},
  {id:614,k:'亜',m:'Asia / sub-',on:'ア',ku:'',lv:'N1',st:7,cat:'other',rad:'二',mn:'Two people bowing = Asia',ex:[{w:'亜細亜',r:'アジア',e:'Asia'},{w:'亜流',r:'ありゅう',e:'imitator'}]},
  {id:615,k:'哀',m:'sorrow',on:'アイ',ku:'あわ-',lv:'N1',st:9,cat:'feeling',rad:'口',mn:'Garment over mouth = grieve',ex:[{w:'悲哀',r:'ひあい',e:'sorrow'},{w:'哀れ',r:'あわれ',e:'pathos'}]},
  {id:616,k:'握',m:'grasp / grip',on:'アク',ku:'にぎ-',lv:'N1',st:12,cat:'action',rad:'手',mn:'Hand + standing = grasp',ex:[{w:'握る',r:'にぎる',e:'to grasp'},{w:'握手',r:'あくしゅ',e:'handshake'}]},
  {id:617,k:'扱',m:'handle / deal with',on:'キュウ',ku:'あつか-',lv:'N1',st:6,cat:'action',rad:'手',mn:'Hand + kneel = handle',ex:[{w:'扱う',r:'あつかう',e:'to handle'},{w:'取り扱い',r:'とりあつかい',e:'handling'}]},
  {id:618,k:'安',m:'peaceful / cheap',on:'アン',ku:'やす-',lv:'N1',st:6,cat:'description',rad:'宀',mn:'Woman under roof = peaceful',ex:[{w:'安定',r:'あんてい',e:'stability'},{w:'不安',r:'ふあん',e:'anxiety'}]},
  {id:619,k:'暗',m:'dark',on:'アン',ku:'くら-',lv:'N1',st:13,cat:'description',rad:'日',mn:'Sun + sound = dark',ex:[{w:'暗闇',r:'くらやみ',e:'darkness'},{w:'暗示',r:'あんじ',e:'hint'}]},
  {id:620,k:'威',m:'authority / intimidate',on:'イ',ku:'',lv:'N1',st:9,cat:'other',rad:'女',mn:'Woman + weapon = authority',ex:[{w:'権威',r:'けんい',e:'authority'},{w:'威圧',r:'いあつ',e:'intimidation'}]},
  {id:621,k:'為',m:'for sake of / do',on:'イ',ku:'ため・な-',lv:'N1',st:9,cat:'other',rad:'爪',mn:'Hand + elephant = do',ex:[{w:'為になる',r:'ためになる',e:'beneficial'},{w:'行為',r:'こうい',e:'act'}]},
  {id:622,k:'緯',m:'latitude / weft',on:'イ',ku:'',lv:'N1',st:16,cat:'other',rad:'糸',mn:'Thread + stomach = weft',ex:[{w:'北緯',r:'ほくい',e:'north latitude'},{w:'経緯',r:'いきさつ',e:'circumstances'}]},
  {id:623,k:'遺',m:'leave behind',on:'イ',ku:'',lv:'N1',st:15,cat:'other',rad:'辶',mn:'Valuables on road = bequeath',ex:[{w:'遺族',r:'いぞく',e:'bereaved family'},{w:'遺跡',r:'いせき',e:'ruins'}]},
  {id:624,k:'域',m:'area',on:'イキ',ku:'',lv:'N1',st:11,cat:'place',rad:'土',mn:'Earth + weapon = territory',ex:[{w:'領域',r:'りょういき',e:'domain'},{w:'地域',r:'ちいき',e:'region'}]},
  {id:625,k:'育',m:'raise / nurture',on:'イク',ku:'そだ-',lv:'N1',st:8,cat:'action',rad:'月',mn:'Child + body = nurture',ex:[{w:'教育',r:'きょういく',e:'education'},{w:'育てる',r:'そだてる',e:'to raise'}]},
  {id:626,k:'一',m:'one',on:'イチ・イツ',ku:'ひと-',lv:'N1',st:1,cat:'number',rad:'一',mn:'Single line = one',ex:[{w:'一致',r:'いっち',e:'agreement'},{w:'統一',r:'とういつ',e:'unification'}]},
  {id:627,k:'壱',m:'one (formal)',on:'イチ',ku:'',lv:'N1',st:7,cat:'number',rad:'士',mn:'Formal character for one',ex:[{w:'壱万円',r:'いちまんえん',e:'¥10,000'},{w:'壱番',r:'いちばん',e:'number one'}]},
  {id:628,k:'逸',m:'deviate / superior',on:'イツ',ku:'そ-',lv:'N1',st:11,cat:'other',rad:'辶',mn:'Rabbit on road = escape',ex:[{w:'逸脱',r:'いつだつ',e:'deviation'},{w:'逸品',r:'いっぴん',e:'masterpiece'}]},
  {id:629,k:'稲',m:'rice plant',on:'トウ',ku:'いね・いな-',lv:'N1',st:14,cat:'nature',rad:'禾',mn:'Grain + reaching = rice',ex:[{w:'稲',r:'いね',e:'rice plant'},{w:'稲作',r:'いなさく',e:'rice farming'}]},
  {id:630,k:'茨',m:'thorn / briar',on:'シ',ku:'いばら',lv:'N1',st:9,cat:'nature',rad:'艸',mn:'Grass + next = briar',ex:[{w:'茨城',r:'いばらき',e:'Ibaraki'},{w:'茨',r:'いばら',e:'thorns'}]},
  {id:631,k:'芋',m:'potato',on:'ウ',ku:'いも',lv:'N1',st:6,cat:'nature',rad:'艸',mn:'Grass + soil = taro',ex:[{w:'芋',r:'いも',e:'potato/taro'},{w:'里芋',r:'さといも',e:'taro'}]},
  {id:632,k:'陰',m:'shade / yin',on:'イン',ku:'かげ',lv:'N1',st:11,cat:'nature',rad:'阜',mn:'Mound + dark cloud',ex:[{w:'陰気',r:'いんき',e:'gloomy'},{w:'陰謀',r:'いんぼう',e:'conspiracy'}]},
  {id:633,k:'隠',m:'hide',on:'イン',ku:'かく-',lv:'N1',st:14,cat:'action',rad:'阜',mn:'Mound + careful hand = hide',ex:[{w:'隠す',r:'かくす',e:'to hide'},{w:'隠居',r:'いんきょ',e:'retirement'}]},
  {id:634,k:'韻',m:'rhyme / resonance',on:'イン',ku:'',lv:'N1',st:19,cat:'art',rad:'音',mn:'Sound + army = rhyme',ex:[{w:'韻',r:'いん',e:'rhyme'},{w:'余韻',r:'よいん',e:'lingering sound'}]},
  {id:635,k:'渦',m:'whirlpool',on:'カ',ku:'うず',lv:'N1',st:12,cat:'nature',rad:'水',mn:'Water + snail = whirlpool',ex:[{w:'渦',r:'うず',e:'whirlpool'},{w:'渦巻き',r:'うずまき',e:'spiral'}]},
  {id:636,k:'浦',m:'bay / inlet',on:'ホ',ku:'うら',lv:'N1',st:10,cat:'nature',rad:'水',mn:'Water + spread = bay',ex:[{w:'浦',r:'うら',e:'bay'},{w:'海浦',r:'かいほ',e:'coastal bay'}]},
  {id:637,k:'詠',m:'recite / compose',on:'エイ',ku:'よ-',lv:'N1',st:12,cat:'art',rad:'言',mn:'Words + forever = compose',ex:[{w:'詠む',r:'よむ',e:'to compose (poetry)'},{w:'詠嘆',r:'えいたん',e:'exclamation'}]},
  {id:638,k:'鋭',m:'sharp / keen',on:'エイ',ku:'するど-',lv:'N1',st:15,cat:'description',rad:'金',mn:'Metal + exchange = sharp',ex:[{w:'鋭利',r:'えいり',e:'sharp'},{w:'先鋭',r:'せんえい',e:'leading edge'}]},
  {id:639,k:'衛',m:'guard / defend',on:'エイ',ku:'',lv:'N1',st:16,cat:'action',rad:'行',mn:'Walk + circle = guard',ex:[{w:'衛星',r:'えいせい',e:'satellite'},{w:'防衛',r:'ぼうえい',e:'defense'}]},
  {id:640,k:'謁',m:'audience with',on:'エツ',ku:'',lv:'N1',st:16,cat:'other',rad:'言',mn:'Words + sunlight = audience',ex:[{w:'謁見',r:'えっけん',e:'royal audience'},{w:'拝謁',r:'はいえつ',e:'audience with royalty'}]},
  {id:641,k:'悦',m:'joy',on:'エツ',ku:'',lv:'N1',st:10,cat:'feeling',rad:'心',mn:'Heart + exchange = joy',ex:[{w:'喜悦',r:'きえつ',e:'delight'},{w:'悦に入る',r:'えつにいる',e:'to be pleased'}]},
  {id:642,k:'越',m:'cross / exceed',on:'エツ',ku:'こ-',lv:'N1',st:12,cat:'action',rad:'走',mn:'Run + battle = surpass',ex:[{w:'卓越',r:'たくえつ',e:'excellence'},{w:'優越',r:'ゆうえつ',e:'superiority'}]},
  {id:643,k:'謁',m:'request an audience',on:'エツ',ku:'',lv:'N1',st:16,cat:'other',rad:'言',mn:'Words + bright = audience',ex:[{w:'謁見',r:'えっけん',e:'royal audience'},{w:'拝謁',r:'はいえつ',e:'private audience'}]},
  {id:644,k:'援',m:'aid / support',on:'エン',ku:'',lv:'N1',st:12,cat:'action',rad:'手',mn:'Hand + round = aid',ex:[{w:'支援',r:'しえん',e:'support'},{w:'援助',r:'えんじょ',e:'aid'}]},
  {id:645,k:'炎',m:'flame / inflammation',on:'エン',ku:'ほのお',lv:'N1',st:8,cat:'nature',rad:'火',mn:'Two fires = flame',ex:[{w:'炎上',r:'えんじょう',e:'going up in flames'},{w:'肺炎',r:'はいえん',e:'pneumonia'}]},
  {id:646,k:'嘔',m:'vomit',on:'オウ',ku:'は-',lv:'N1',st:14,cat:'health',rad:'口',mn:'Mouth + cage = vomit',ex:[{w:'嘔吐',r:'おうと',e:'vomiting'},{w:'嘔気',r:'おうき',e:'nausea'}]},
  {id:647,k:'押',m:'push / seal',on:'オウ',ku:'お-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + frame = push',ex:[{w:'押収',r:'おうしゅう',e:'confiscation'},{w:'押し付ける',r:'おしつける',e:'to impose'}]},
  {id:648,k:'奥',m:'inner part / deep',on:'オウ',ku:'おく',lv:'N1',st:12,cat:'place',rad:'大',mn:'Deep inside home = inner',ex:[{w:'奥',r:'おく',e:'inner/depths'},{w:'奥深い',r:'おくぶかい',e:'profound'}]},
  {id:649,k:'臆',m:'timid / fearful',on:'オク',ku:'おく-',lv:'N1',st:17,cat:'feeling',rad:'心',mn:'Organ + heart = timid',ex:[{w:'臆病',r:'おくびょう',e:'timidity'},{w:'臆する',r:'おくする',e:'to be timid'}]},
  {id:650,k:'佳',m:'good / excellent',on:'カ',ku:'',lv:'N1',st:8,cat:'description',rad:'人',mn:'Person + soil = excellent',ex:[{w:'佳作',r:'かさく',e:'good work'},{w:'佳境',r:'かきょう',e:'climax'}]},
  {id:651,k:'架',m:'frame / erect',on:'カ',ku:'か-',lv:'N1',st:9,cat:'action',rad:'木',mn:'Add + wood = rack',ex:[{w:'架ける',r:'かける',e:'to build'},{w:'架空',r:'かくう',e:'fictitious'}]},
  {id:652,k:'禍',m:'calamity',on:'カ',ku:'わざわい',lv:'N1',st:13,cat:'other',rad:'示',mn:'Spirit + bone = calamity',ex:[{w:'禍',r:'わざわい',e:'calamity'},{w:'戦禍',r:'せんか',e:'ravages of war'}]},
  {id:653,k:'花',m:'flower',on:'カ',ku:'はな',lv:'N1',st:7,cat:'nature',rad:'艸',mn:'Plant transforms = flower',ex:[{w:'造花',r:'ぞうか',e:'artificial flower'},{w:'花弁',r:'かべん',e:'petal'}]},
  {id:654,k:'貨',m:'goods / money',on:'カ',ku:'',lv:'N1',st:11,cat:'other',rad:'貝',mn:'Change + shell = goods',ex:[{w:'貨物',r:'かもつ',e:'cargo'},{w:'外貨',r:'がいか',e:'foreign currency'}]},
  {id:655,k:'寡',m:'few / widow',on:'カ',ku:'やもめ',lv:'N1',st:14,cat:'other',rad:'宀',mn:'Roof + head = few',ex:[{w:'寡黙',r:'かもく',e:'taciturn'},{w:'寡婦',r:'かふ',e:'widow'}]},
  {id:656,k:'渦',m:'whirlpool',on:'カ',ku:'うず',lv:'N1',st:12,cat:'nature',rad:'水',mn:'Water + pot = whirlpool',ex:[{w:'渦中',r:'かちゅう',e:'in the midst of'},{w:'渦巻く',r:'うずまく',e:'to swirl'}]},
  {id:657,k:'嫁',m:'bride / marry',on:'カ',ku:'よめ・とつ-',lv:'N1',st:13,cat:'people',rad:'女',mn:'Woman + house = bride',ex:[{w:'嫁',r:'よめ',e:'bride'},{w:'花嫁',r:'はなよめ',e:'bride'}]},
  {id:658,k:'稼',m:'earn',on:'カ',ku:'かせ-',lv:'N1',st:15,cat:'work',rad:'禾',mn:'Grain + house = earn',ex:[{w:'稼ぎ',r:'かせぎ',e:'earnings'},{w:'稼働率',r:'かどうりつ',e:'operation rate'}]},
  {id:659,k:'介',m:'mediate / shell',on:'カイ',ku:'',lv:'N1',st:4,cat:'other',rad:'人',mn:'Two people facing = mediate',ex:[{w:'介護',r:'かいご',e:'nursing care'},{w:'紹介',r:'しょうかい',e:'introduction'}]},
  {id:660,k:'戒',m:'commandment',on:'カイ',ku:'いまし-',lv:'N1',st:7,cat:'other',rad:'戈',mn:'Two hands on spear = precept',ex:[{w:'戒める',r:'いましめる',e:'to warn'},{w:'十戒',r:'じっかい',e:'Ten Commandments'}]},
  {id:661,k:'改',m:'reform',on:'カイ',ku:'あらた-',lv:'N1',st:7,cat:'action',rad:'攴',mn:'Staff + beat = reform',ex:[{w:'改革',r:'かいかく',e:'reform'},{w:'改める',r:'あらためる',e:'to reform'}]},
  {id:662,k:'概',m:'outline / approximately',on:'ガイ',ku:'おおむ-',lv:'N1',st:14,cat:'other',rad:'木',mn:'Wood + how = general',ex:[{w:'概念',r:'がいねん',e:'concept'},{w:'概要',r:'がいよう',e:'outline'}]},
  {id:663,k:'怪',m:'mysterious',on:'カイ',ku:'あや-',lv:'N1',st:8,cat:'description',rad:'心',mn:'Heart + soil = mysterious',ex:[{w:'怪奇',r:'かいき',e:'bizarre'},{w:'妖怪',r:'ようかい',e:'ghost/monster'}]},
  {id:664,k:'悔',m:'regret',on:'カイ',ku:'く- こう-',lv:'N1',st:9,cat:'feeling',rad:'心',mn:'Heart + each = regret',ex:[{w:'悔やむ',r:'くやむ',e:'to regret'},{w:'後悔',r:'こうかい',e:'regret'}]},
  {id:665,k:'拐',m:'kidnap',on:'カイ',ku:'',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + cross = abduct',ex:[{w:'誘拐',r:'ゆうかい',e:'kidnapping'},{w:'拐帯',r:'かいたい',e:'embezzlement'}]},
  {id:666,k:'皆',m:'everyone',on:'カイ',ku:'みんな',lv:'N1',st:9,cat:'people',rad:'比',mn:'Two people + sun = everyone',ex:[{w:'皆無',r:'かいむ',e:'complete absence'},{w:'皆既',r:'かいき',e:'total (eclipse)'}]},
  {id:667,k:'潰',m:'crush / collapse',on:'カイ',ku:'つぶ-',lv:'N1',st:15,cat:'action',rad:'水',mn:'Water + soldier = crush',ex:[{w:'潰れる',r:'つぶれる',e:'to collapse'},{w:'潰瘍',r:'かいよう',e:'ulcer'}]},
  {id:668,k:'賄',m:'bribe / supply',on:'ワイ',ku:'まかな-',lv:'N1',st:13,cat:'action',rad:'貝',mn:'Shell + within = bribe',ex:[{w:'賄賂',r:'わいろ',e:'bribe'},{w:'賄う',r:'まかなう',e:'to supply'}]},
  {id:669,k:'慨',m:'indignant / lament',on:'ガイ',ku:'',lv:'N1',st:13,cat:'feeling',rad:'心',mn:'Heart + concept = indignant',ex:[{w:'慨嘆',r:'がいたん',e:'lamentation'},{w:'憤慨',r:'ふんがい',e:'indignation'}]},
  {id:670,k:'核',m:'nucleus / core',on:'カク',ku:'',lv:'N1',st:10,cat:'other',rad:'木',mn:'Wood + river = nucleus',ex:[{w:'核心',r:'かくしん',e:'core'},{w:'核融合',r:'かくゆうごう',e:'nuclear fusion'}]},
  {id:671,k:'殻',m:'shell / husk',on:'カク',ku:'から',lv:'N1',st:11,cat:'nature',rad:'殳',mn:'Shell + beat = husk',ex:[{w:'貝殻',r:'かいがら',e:'seashell'},{w:'卵殻',r:'らんかく',e:'eggshell'}]},
  {id:672,k:'覚',m:'perceive / remember',on:'カク',ku:'おぼ- さ-',lv:'N1',st:12,cat:'action',rad:'見',mn:'Roof + see = perceive',ex:[{w:'覚える',r:'おぼえる',e:'to remember'},{w:'感覚',r:'かんかく',e:'sense'}]},
  {id:673,k:'赫',m:'bright red',on:'カク',ku:'',lv:'N1',st:14,cat:'color',rad:'赤',mn:'Two fires = crimson',ex:[{w:'赫々',r:'かくかく',e:'brilliant'},{w:'赫怒',r:'かくど',e:'intense anger'}]},
  {id:674,k:'較',m:'compare',on:'カク',ku:'',lv:'N1',st:13,cat:'other',rad:'車',mn:'Vehicle + mix = compare',ex:[{w:'比較',r:'ひかく',e:'comparison'},{w:'較べる',r:'くらべる',e:'to compare'}]},
  {id:675,k:'確',m:'certain / definite',on:'カク',ku:'たし-',lv:'N1',st:15,cat:'description',rad:'石',mn:'Stone + bird = certain',ex:[{w:'確認',r:'かくにん',e:'confirmation'},{w:'確かめる',r:'たしかめる',e:'to confirm'}]},
  {id:676,k:'穫',m:'harvest',on:'カク',ku:'',lv:'N1',st:18,cat:'action',rad:'禾',mn:'Grain + bird = harvest',ex:[{w:'収穫',r:'しゅうかく',e:'harvest'},{w:'収穫祭',r:'しゅうかくさい',e:'harvest festival'}]},
  {id:677,k:'嚇',m:'threaten',on:'カク',ku:'おど-',lv:'N1',st:17,cat:'action',rad:'口',mn:'Mouth + fire = intimidate',ex:[{w:'威嚇',r:'いかく',e:'intimidation'},{w:'恫嚇',r:'どうかく',e:'threat'}]},
  {id:678,k:'括',m:'bundle / include',on:'カツ',ku:'くく-',lv:'N1',st:9,cat:'action',rad:'手',mn:'Hand + tongue = bundle',ex:[{w:'括る',r:'くくる',e:'to bundle'},{w:'一括',r:'いっかつ',e:'lump/batch'}]},
  {id:679,k:'滑',m:'smooth / slide',on:'カツ',ku:'すべ- なめ-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + bone = smooth',ex:[{w:'滑る',r:'すべる',e:'to slide'},{w:'円滑',r:'えんかつ',e:'smooth'}]},
  {id:680,k:'渇',m:'thirst',on:'カツ',ku:'かわ-',lv:'N1',st:11,cat:'health',rad:'水',mn:'Water + lacking = thirst',ex:[{w:'渇く',r:'かわく',e:'to thirst'},{w:'渇望',r:'かつぼう',e:'craving'}]},
  {id:681,k:'喝',m:'scold / shout',on:'カツ',ku:'',lv:'N1',st:12,cat:'action',rad:'口',mn:'Mouth + dry = shout',ex:[{w:'一喝',r:'いっかつ',e:'sharp rebuke'},{w:'喝破',r:'かっぱ',e:'refutation'}]},
  {id:682,k:'褐',m:'brown',on:'カツ',ku:'',lv:'N1',st:13,cat:'color',rad:'衣',mn:'Garment + dry = brown',ex:[{w:'褐色',r:'かっしょく',e:'brown color'},{w:'赤褐色',r:'せきかっしょく',e:'reddish brown'}]},
  {id:683,k:'刈',m:'mow / cut',on:'カイ',ku:'か-',lv:'N1',st:4,cat:'action',rad:'刀',mn:'Knife + person = mow',ex:[{w:'刈る',r:'かる',e:'to mow'},{w:'草刈り',r:'くさかり',e:'mowing'}]},
  {id:684,k:'冠',m:'crown / top',on:'カン',ku:'かんむり',lv:'N1',st:9,cat:'other',rad:'冖',mn:'Inch + cover = crown',ex:[{w:'冠',r:'かんむり',e:'crown'},{w:'栄冠',r:'えいかん',e:'laurels'}]},
  {id:685,k:'勘',m:'intuition / sense',on:'カン',ku:'',lv:'N1',st:11,cat:'other',rad:'力',mn:'Difficult + strength = intuition',ex:[{w:'勘',r:'かん',e:'intuition'},{w:'勘違い',r:'かんちがい',e:'misunderstanding'}]},
  {id:686,k:'巻',m:'roll / volume',on:'カン',ku:'まき ま-',lv:'N1',st:9,cat:'other',rad:'巳',mn:'Person curled up = roll',ex:[{w:'巻く',r:'まく',e:'to roll'},{w:'巻物',r:'まきもの',e:'scroll'}]},
  {id:687,k:'乾',m:'dry',on:'カン',ku:'かわ-',lv:'N1',st:11,cat:'action',rad:'乙',mn:'Tree in sun = dry',ex:[{w:'乾く',r:'かわく',e:'to dry'},{w:'乾燥',r:'かんそう',e:'dryness'}]},
  {id:688,k:'勧',m:'encourage / recommend',on:'カン',ku:'すす-',lv:'N1',st:13,cat:'action',rad:'力',mn:'Bird + strength = encourage',ex:[{w:'勧告',r:'かんこく',e:'recommendation'},{w:'勧め',r:'すすめ',e:'recommendation'}]},
  {id:689,k:'患',m:'suffer / patient',on:'カン',ku:'わずら-',lv:'N1',st:11,cat:'health',rad:'心',mn:'String + heart = suffer',ex:[{w:'患者',r:'かんじゃ',e:'patient'},{w:'患う',r:'わずらう',e:'to suffer'}]},
  {id:690,k:'寛',m:'tolerant / generous',on:'カン',ku:'',lv:'N1',st:13,cat:'feeling',rad:'宀',mn:'Roof + arrow + heart = tolerant',ex:[{w:'寛大',r:'かんだい',e:'generous'},{w:'寛容',r:'かんよう',e:'tolerance'}]},
  {id:691,k:'憾',m:'regret',on:'カン',ku:'',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + feeling = regret',ex:[{w:'遺憾',r:'いかん',e:'regret'},{w:'残憾',r:'ざんかん',e:'remaining regret'}]},
  {id:692,k:'堪',m:'endure / tolerate',on:'カン',ku:'た-',lv:'N1',st:12,cat:'action',rad:'土',mn:'Earth + sweet = endure',ex:[{w:'堪える',r:'たえる',e:'to endure'},{w:'堪能',r:'たんのう',e:'proficiency'}]},
  {id:693,k:'換',m:'exchange / replace',on:'カン',ku:'か-',lv:'N1',st:12,cat:'action',rad:'手',mn:'Hand + change = exchange',ex:[{w:'換える',r:'かえる',e:'to exchange'},{w:'変換',r:'へんかん',e:'conversion'}]},
  {id:694,k:'敢',m:'daring',on:'カン',ku:'',lv:'N1',st:12,cat:'description',rad:'攴',mn:'Staff + ancient = daring',ex:[{w:'果敢',r:'かかん',e:'bold'},{w:'勇敢',r:'ゆうかん',e:'brave'}]},
  {id:695,k:'棺',m:'coffin',on:'カン',ku:'',lv:'N1',st:12,cat:'other',rad:'木',mn:'Wood + official = coffin',ex:[{w:'棺',r:'かん',e:'coffin'},{w:'棺桶',r:'かんおけ',e:'coffin'}]},
  {id:696,k:'歓',m:'joy / welcome',on:'カン',ku:'',lv:'N1',st:15,cat:'feeling',rad:'欠',mn:'Bird + yawn = joy',ex:[{w:'歓迎',r:'かんげい',e:'welcome'},{w:'歓喜',r:'かんき',e:'jubilation'}]},
  {id:697,k:'汗',m:'sweat',on:'カン',ku:'あせ',lv:'N1',st:6,cat:'body',rad:'水',mn:'Water + dry = sweat',ex:[{w:'汗',r:'あせ',e:'sweat'},{w:'発汗',r:'はっかん',e:'perspiration'}]},
  {id:698,k:'漢',m:'Chinese / man',on:'カン',ku:'おとこ',lv:'N1',st:13,cat:'other',rad:'水',mn:'Water + grown = Han/man',ex:[{w:'漢字',r:'かんじ',e:'kanji'},{w:'漢方',r:'かんぽう',e:'Chinese medicine'}]},
  {id:699,k:'環',m:'ring / circle',on:'カン',ku:'',lv:'N1',st:17,cat:'other',rad:'玉',mn:'Ring of jade',ex:[{w:'環境',r:'かんきょう',e:'environment'},{w:'循環',r:'じゅんかん',e:'circulation'}]},
  {id:700,k:'缶',m:'can / tin',on:'カン',ku:'',lv:'N1',st:6,cat:'other',rad:'缶',mn:'Container with lid = can',ex:[{w:'缶',r:'かん',e:'can'},{w:'缶詰',r:'かんづめ',e:'canned food'}]},
  {id:701,k:'艦',m:'warship',on:'カン',ku:'',lv:'N1',st:21,cat:'other',rad:'舟',mn:'Boat + see = warship',ex:[{w:'艦隊',r:'かんたい',e:'fleet'},{w:'潜水艦',r:'せんすいかん',e:'submarine'}]},
  {id:702,k:'岐',m:'fork / branch',on:'キ',ku:'',lv:'N1',st:7,cat:'place',rad:'山',mn:'Mountain + branch = fork',ex:[{w:'岐路',r:'きろ',e:'crossroads'},{w:'岐阜',r:'ぎふ',e:'Gifu'}]},
  {id:703,k:'飢',m:'hunger',on:'キ',ku:'う-',lv:'N1',st:10,cat:'health',rad:'食',mn:'Food + several = starve',ex:[{w:'飢える',r:'うえる',e:'to starve'},{w:'飢饉',r:'ききん',e:'famine'}]},
  {id:704,k:'鬼',m:'demon / ogre',on:'キ',ku:'おに',lv:'N1',st:10,cat:'other',rad:'鬼',mn:'Spirit leaving body = demon',ex:[{w:'鬼',r:'おに',e:'demon'},{w:'鬼ごっこ',r:'おにごっこ',e:'tag (game)'}]},
  {id:705,k:'亀',m:'turtle',on:'キ',ku:'かめ',lv:'N1',st:11,cat:'nature',rad:'亀',mn:'Turtle shape',ex:[{w:'亀',r:'かめ',e:'turtle'},{w:'亀裂',r:'きれつ',e:'crack'}]},
  {id:706,k:'誼',m:'friendship / courtesy',on:'ギ',ku:'よしみ',lv:'N1',st:15,cat:'feeling',rad:'言',mn:'Words + good = friendship',ex:[{w:'誼み',r:'よしみ',e:'friendship'},{w:'交誼',r:'こうぎ',e:'friendship'}]},
  {id:707,k:'欺',m:'deceive',on:'ギ',ku:'あざむ-',lv:'N1',st:12,cat:'action',rad:'欠',mn:'Yawn + period = deceive',ex:[{w:'欺く',r:'あざむく',e:'to deceive'},{w:'詐欺',r:'さぎ',e:'fraud'}]},
  {id:708,k:'犠',m:'sacrifice',on:'ギ',ku:'にえ',lv:'N1',st:17,cat:'other',rad:'牛',mn:'Cow + righteousness = sacrifice',ex:[{w:'犠牲',r:'ぎせい',e:'sacrifice'},{w:'犠牲者',r:'ぎせいしゃ',e:'victim'}]},
  {id:709,k:'祈',m:'pray',on:'キ',ku:'いの-',lv:'N1',st:8,cat:'other',rad:'示',mn:'Spirit + ax = pray',ex:[{w:'祈る',r:'いのる',e:'to pray'},{w:'祈願',r:'きがん',e:'prayer'}]},
  {id:710,k:'忌',m:'mourning / taboo',on:'キ',ku:'い-',lv:'N1',st:7,cat:'other',rad:'心',mn:'Self + heart = taboo',ex:[{w:'忌む',r:'いむ',e:'to avoid'},{w:'忌避',r:'きひ',e:'avoidance'}]},
  {id:711,k:'揮',m:'command / wave',on:'キ',ku:'ふる-',lv:'N1',st:12,cat:'action',rad:'手',mn:'Hand + army = command',ex:[{w:'発揮',r:'はっき',e:'display of ability'},{w:'指揮',r:'しき',e:'command'}]},
  {id:712,k:'棄',m:'abandon',on:'キ',ku:'す-',lv:'N1',st:13,cat:'action',rad:'木',mn:'Tree + birth = abandon',ex:[{w:'廃棄',r:'はいき',e:'disposal'},{w:'放棄',r:'ほうき',e:'abandonment'}]},
  {id:713,k:'毀',m:'damage / defame',on:'キ',ku:'こぼ-',lv:'N1',st:13,cat:'action',rad:'毛',mn:'Destroy + container = damage',ex:[{w:'毀損',r:'きそん',e:'defamation'},{w:'毀誉',r:'きよ',e:'fame and infamy'}]},
  {id:714,k:'奇',m:'strange / odd',on:'キ',ku:'',lv:'N1',st:8,cat:'description',rad:'大',mn:'Person with large head = odd',ex:[{w:'奇妙',r:'きみょう',e:'strange'},{w:'奇跡',r:'きせき',e:'miracle'}]},
  {id:715,k:'輝',m:'shine / radiate',on:'キ',ku:'かがや-',lv:'N1',st:15,cat:'description',rad:'車',mn:'Light + army = shine',ex:[{w:'輝く',r:'かがやく',e:'to shine'},{w:'輝かしい',r:'かがやかしい',e:'brilliant'}]},
  {id:716,k:'飢',m:'starvation',on:'キ',ku:'う-',lv:'N1',st:10,cat:'health',rad:'食',mn:'Food + few = starve',ex:[{w:'飢餓',r:'きが',e:'starvation'},{w:'飢え',r:'うえ',e:'hunger'}]},
  {id:717,k:'騎',m:'ride a horse',on:'キ',ku:'',lv:'N1',st:18,cat:'action',rad:'馬',mn:'Horse + strange = ride',ex:[{w:'騎手',r:'きしゅ',e:'jockey'},{w:'騎兵',r:'きへい',e:'cavalry'}]},
  {id:718,k:'擬',m:'imitate / pseudo',on:'ギ',ku:'',lv:'N1',st:17,cat:'action',rad:'手',mn:'Hand + doubt = imitate',ex:[{w:'擬態',r:'ぎたい',e:'mimicry'},{w:'擬音',r:'ぎおん',e:'sound effect'}]},
  {id:719,k:'凝',m:'congeal / stare',on:'ギョウ',ku:'こ-',lv:'N1',st:16,cat:'action',rad:'冫',mn:'Ice + doubt = congeal',ex:[{w:'凝る',r:'こる',e:'to be absorbed in'},{w:'凝固',r:'ぎょうこ',e:'solidification'}]},
  {id:720,k:'仰',m:'look up / respectful',on:'ギョウ',ku:'あお-',lv:'N1',st:6,cat:'action',rad:'人',mn:'Person + greeting = look up',ex:[{w:'仰ぐ',r:'あおぐ',e:'to look up'},{w:'信仰',r:'しんこう',e:'faith'}]},
  {id:721,k:'虐',m:'abuse / tyranny',on:'ギャク',ku:'しいた-',lv:'N1',st:9,cat:'other',rad:'虍',mn:'Tiger cruelty = abuse',ex:[{w:'虐待',r:'ぎゃくたい',e:'abuse'},{w:'虐殺',r:'ぎゃくさつ',e:'massacre'}]},
  {id:722,k:'拒',m:'refuse',on:'キョ',ku:'こば-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + giant = refuse',ex:[{w:'拒む',r:'こばむ',e:'to refuse'},{w:'抵抗',r:'ていこう',e:'resistance'}]},
  {id:723,k:'矩',m:'carpenter\'s square / rule',on:'ク',ku:'かね',lv:'N1',st:10,cat:'other',rad:'矢',mn:'Arrow + work = rule',ex:[{w:'矩形',r:'くけい',e:'rectangle'},{w:'法矩',r:'ほうく',e:'law and order'}]},
  {id:724,k:'駆',m:'drive / gallop',on:'ク',ku:'か-',lv:'N1',st:14,cat:'action',rad:'馬',mn:'Horse + area = gallop',ex:[{w:'駆ける',r:'かける',e:'to gallop'},{w:'駆除',r:'くじょ',e:'extermination'}]},
  {id:725,k:'掘',m:'dig',on:'クツ',ku:'ほ-',lv:'N1',st:11,cat:'action',rad:'手',mn:'Hand + stoop = dig',ex:[{w:'掘る',r:'ほる',e:'to dig'},{w:'発掘',r:'はっくつ',e:'excavation'}]},
  {id:726,k:'窮',m:'destitute / extreme',on:'キュウ',ku:'きわ-',lv:'N1',st:15,cat:'other',rad:'穴',mn:'Cave + body = cornered',ex:[{w:'窮地',r:'きゅうち',e:'predicament'},{w:'窮乏',r:'きゅうぼう',e:'poverty'}]},
  {id:727,k:'糾',m:'twist / investigate',on:'キュウ',ku:'',lv:'N1',st:9,cat:'action',rad:'糸',mn:'Thread + investigate',ex:[{w:'糾弾',r:'きゅうだん',e:'condemnation'},{w:'紛糾',r:'ふんきゅう',e:'entanglement'}]},
  {id:728,k:'拠',m:'basis / depend on',on:'キョ',ku:'よ-',lv:'N1',st:8,cat:'other',rad:'手',mn:'Hand + standing = basis',ex:[{w:'拠点',r:'きょてん',e:'base'},{w:'証拠',r:'しょうこ',e:'evidence'}]},
  {id:729,k:'虚',m:'empty / false',on:'キョ',ku:'むな-',lv:'N1',st:11,cat:'description',rad:'虍',mn:'Tiger without stripes = empty',ex:[{w:'虚偽',r:'きょぎ',e:'falsehood'},{w:'虚無',r:'きょむ',e:'nihilism'}]},
  {id:730,k:'距',m:'distance',on:'キョ',ku:'',lv:'N1',st:12,cat:'other',rad:'足',mn:'Foot + giant = distance',ex:[{w:'距離',r:'きょり',e:'distance'},{w:'射程距離',r:'しゃていきょり',e:'range'}]},
  {id:731,k:'享',m:'receive / enjoy',on:'キョウ',ku:'う-',lv:'N1',st:8,cat:'feeling',rad:'子',mn:'Child offering = enjoy',ex:[{w:'享受',r:'きょうじゅ',e:'enjoyment'},{w:'享楽',r:'きょうらく',e:'pleasure'}]},
  {id:732,k:'凶',m:'bad omen',on:'キョウ',ku:'',lv:'N1',st:4,cat:'other',rad:'凵',mn:'Container with cross = ill omen',ex:[{w:'凶悪',r:'きょうあく',e:'ferocious'},{w:'吉凶',r:'きっきょう',e:'good and bad luck'}]},
  {id:733,k:'矯',m:'correct / straighten',on:'キョウ',ku:'た-',lv:'N1',st:17,cat:'action',rad:'矢',mn:'Arrow + tall = straighten',ex:[{w:'矯正',r:'きょうせい',e:'correction'},{w:'矯める',r:'ためる',e:'to correct'}]},
  {id:734,k:'脅',m:'threaten',on:'キョウ',ku:'おびや- おど-',lv:'N1',st:10,cat:'action',rad:'月',mn:'Three + body = threaten',ex:[{w:'脅す',r:'おどす',e:'to threaten'},{w:'脅威',r:'きょうい',e:'threat'}]},
  {id:735,k:'驚',m:'surprise',on:'キョウ',ku:'おどろ-',lv:'N1',st:22,cat:'feeling',rad:'馬',mn:'Horse + respect = surprise',ex:[{w:'驚く',r:'おどろく',e:'to be surprised'},{w:'驚異',r:'きょうい',e:'wonder'}]},
  {id:736,k:'巨',m:'giant',on:'キョ',ku:'',lv:'N1',st:5,cat:'description',rad:'工',mn:'Craftsman made huge = giant',ex:[{w:'巨大',r:'きょだい',e:'huge'},{w:'巨匠',r:'きょしょう',e:'master craftsman'}]},
  {id:737,k:'拒',m:'refuse',on:'キョ',ku:'こば-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + giant = refuse',ex:[{w:'拒絶',r:'きょぜつ',e:'rejection'},{w:'拒否権',r:'きょひけん',e:'veto'}]},
  {id:738,k:'均',m:'equal / level',on:'キン',ku:'',lv:'N1',st:7,cat:'other',rad:'土',mn:'Earth + even = equal',ex:[{w:'均衡',r:'きんこう',e:'balance'},{w:'平均化',r:'へいきんか',e:'averaging'}]},
  {id:739,k:'謹',m:'reverent',on:'キン',ku:'つつし-',lv:'N1',st:17,cat:'feeling',rad:'言',mn:'Words + careful = reverent',ex:[{w:'謹慎',r:'きんしん',e:'confinement'},{w:'謹んで',r:'つつしんで',e:'respectfully'}]},
  {id:740,k:'禽',m:'bird / poultry',on:'キン',ku:'とり',lv:'N1',st:13,cat:'nature',rad:'内',mn:'Captured bird = poultry',ex:[{w:'禽獣',r:'きんじゅう',e:'birds and beasts'},{w:'家禽',r:'かきん',e:'poultry'}]},
  {id:741,k:'菌',m:'bacteria / fungus',on:'キン',ku:'',lv:'N1',st:11,cat:'nature',rad:'艸',mn:'Grass + round = fungus',ex:[{w:'細菌',r:'さいきん',e:'bacteria'},{w:'殺菌',r:'さっきん',e:'sterilization'}]},
  {id:742,k:'緊',m:'tense / tight',on:'キン',ku:'',lv:'N1',st:15,cat:'description',rad:'糸',mn:'Capture + thread = tense',ex:[{w:'緊迫',r:'きんぱく',e:'tension'},{w:'緊縮',r:'きんしゅく',e:'austerity'}]},
  {id:743,k:'謹',m:'respectful',on:'キン',ku:'つつし-',lv:'N1',st:17,cat:'feeling',rad:'言',mn:'Words + care = reverent',ex:[{w:'謹告',r:'きんこく',e:'respectful notice'},{w:'謹賀新年',r:'きんがしんねん',e:'Happy New Year (formal)'}]},
  {id:744,k:'駆',m:'gallop',on:'ク',ku:'か-',lv:'N1',st:14,cat:'action',rad:'馬',mn:'Horse + area = gallop',ex:[{w:'駆け足',r:'かけあし',e:'trot'},{w:'先駆け',r:'さきがけ',e:'pioneer'}]},
  {id:745,k:'愚',m:'foolish / dull',on:'グ',ku:'おろ-',lv:'N1',st:13,cat:'description',rad:'心',mn:'Monkey + heart = foolish',ex:[{w:'愚か',r:'おろか',e:'foolish'},{w:'愚痴',r:'ぐち',e:'complaint'}]},
  {id:746,k:'偶',m:'accidental / even number',on:'グウ',ku:'たま-',lv:'N1',st:11,cat:'other',rad:'人',mn:'Person + even = coincidental',ex:[{w:'偶然',r:'ぐうぜん',e:'coincidence'},{w:'偶数',r:'ぐうすう',e:'even number'}]},
  {id:747,k:'隅',m:'corner',on:'グウ',ku:'すみ',lv:'N1',st:12,cat:'place',rad:'阜',mn:'Mound + corner = corner',ex:[{w:'隅',r:'すみ',e:'corner'},{w:'隅々',r:'すみずみ',e:'every corner'}]},
  {id:748,k:'串',m:'skewer',on:'クシ',ku:'くし',lv:'N1',st:7,cat:'other',rad:'丨',mn:'Line through dots = skewer',ex:[{w:'串',r:'くし',e:'skewer'},{w:'串カツ',r:'くしかつ',e:'skewered cutlet'}]},
  {id:749,k:'嵐',m:'storm',on:'ラン',ku:'あらし',lv:'N1',st:12,cat:'nature',rad:'山',mn:'Mountain + wind = storm',ex:[{w:'嵐',r:'あらし',e:'storm'},{w:'嵐のような',r:'あらしのような',e:'stormy'}]},
  {id:750,k:'繰',m:'reel / repeat',on:'ソウ',ku:'く-',lv:'N1',st:19,cat:'action',rad:'糸',mn:'Thread + nest = reel',ex:[{w:'繰り広げる',r:'くりひろげる',e:'to unfold'},{w:'手繰る',r:'たぐる',e:'to pull in'}]},
  {id:751,k:'掲',m:'display / hoist',on:'ケイ',ku:'かか-',lv:'N1',st:11,cat:'action',rad:'手',mn:'Hand + up = display',ex:[{w:'掲示',r:'けいじ',e:'notice'},{w:'掲載',r:'けいさい',e:'publication'}]},
  {id:752,k:'傑',m:'outstanding',on:'ケツ',ku:'',lv:'N1',st:13,cat:'description',rad:'人',mn:'Person + tree fruit = outstanding',ex:[{w:'傑作',r:'けっさく',e:'masterpiece'},{w:'傑出',r:'けっしゅつ',e:'prominence'}]},
  {id:753,k:'訣',m:'formula / farewell',on:'ケツ',ku:'',lv:'N1',st:11,cat:'other',rad:'言',mn:'Words + pierce = formula',ex:[{w:'秘訣',r:'ひけつ',e:'secret tip'},{w:'訣別',r:'けつべつ',e:'final farewell'}]},
  {id:754,k:'牽',m:'lead / drag',on:'ケン',ku:'ひ-',lv:'N1',st:11,cat:'action',rad:'牛',mn:'Ox + cover = drag',ex:[{w:'牽引',r:'けんいん',e:'towing'},{w:'牽制',r:'けんせい',e:'checking'}]},
  {id:755,k:'謙',m:'modest / humble',on:'ケン',ku:'',lv:'N1',st:17,cat:'feeling',rad:'言',mn:'Words + combine = modest',ex:[{w:'謙遜',r:'けんそん',e:'modesty'},{w:'謙虚さ',r:'けんきょさ',e:'humility'}]},
  {id:756,k:'賢',m:'wise',on:'ケン',ku:'かしこ-',lv:'N1',st:16,cat:'description',rad:'貝',mn:'Shell + grasp = wise',ex:[{w:'賢い',r:'かしこい',e:'wise'},{w:'賢明',r:'けんめい',e:'wise/judicious'}]},
  {id:757,k:'顕',m:'appear / conspicuous',on:'ケン',ku:'あらわ-',lv:'N1',st:18,cat:'description',rad:'頁',mn:'Head + thread = conspicuous',ex:[{w:'顕著',r:'けんちょ',e:'remarkable'},{w:'顕微鏡',r:'けんびきょう',e:'microscope'}]},
  {id:758,k:'懸',m:'hang / stake',on:'ケン',ku:'か-',lv:'N1',st:20,cat:'action',rad:'心',mn:'County + heart = stake',ex:[{w:'懸賞',r:'けんしょう',e:'prize'},{w:'懸案',r:'けんあん',e:'pending issue'}]},
  {id:759,k:'拳',m:'fist',on:'ケン',ku:'こぶし',lv:'N1',st:10,cat:'body',rad:'手',mn:'Hand + joint = fist',ex:[{w:'拳',r:'こぶし',e:'fist'},{w:'拳銃',r:'けんじゅう',e:'pistol'}]},
  {id:760,k:'倹',m:'frugal',on:'ケン',ku:'',lv:'N1',st:10,cat:'description',rad:'人',mn:'Person + combine = frugal',ex:[{w:'倹約',r:'けんやく',e:'frugality'},{w:'勤倹',r:'きんけん',e:'diligence and frugality'}]},
  {id:761,k:'遣',m:'send / dispatch',on:'ケン',ku:'つか-',lv:'N1',st:13,cat:'action',rad:'辶',mn:'Send + road = dispatch',ex:[{w:'遣る',r:'やる',e:'to send/do'},{w:'派遣',r:'はけん',e:'dispatch'}]},
  {id:762,k:'鹸',m:'alkali / soap',on:'ケン',ku:'',lv:'N1',st:23,cat:'other',rad:'鹵',mn:'Salt + cut = alkali',ex:[{w:'石鹸',r:'せっけん',e:'soap'},{w:'炭酸鹸',r:'たんさんけん',e:'carbonate soap'}]},
  {id:763,k:'弦',m:'bowstring / string',on:'ゲン',ku:'つる',lv:'N1',st:8,cat:'art',rad:'弓',mn:'Bow + thread = string',ex:[{w:'弦',r:'つる',e:'bowstring'},{w:'弦楽',r:'げんがく',e:'string music'}]},
  {id:764,k:'厳',m:'strict',on:'ゲン',ku:'きび- おごそ-',lv:'N1',st:17,cat:'description',rad:'厂',mn:'Rock + grave = strict',ex:[{w:'厳格',r:'げんかく',e:'strictness'},{w:'荘厳',r:'そうごん',e:'solemn'}]},
  {id:765,k:'孤',m:'solitary',on:'コ',ku:'',lv:'N1',st:8,cat:'description',rad:'子',mn:'Child alone = solitary',ex:[{w:'孤高',r:'ここう',e:'solitary eminence'},{w:'孤島',r:'ことう',e:'isolated island'}]},
  {id:766,k:'拘',m:'detain / adhere',on:'コウ',ku:'こだわ-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + bound = detain',ex:[{w:'拘束',r:'こうそく',e:'restraint'},{w:'拘る',r:'こだわる',e:'to be particular about'}]},
  {id:767,k:'膠',m:'glue / sticky',on:'コウ',ku:'にかわ',lv:'N1',st:15,cat:'other',rad:'月',mn:'Glue made from bone',ex:[{w:'膠着',r:'こうちゃく',e:'deadlock'},{w:'膠質',r:'こうしつ',e:'colloid'}]},
  {id:768,k:'洪',m:'flood',on:'コウ',ku:'',lv:'N1',st:9,cat:'nature',rad:'水',mn:'Water + flood = flood',ex:[{w:'洪水',r:'こうずい',e:'flood'},{w:'洪積',r:'こうせき',e:'diluvial'}]},
  {id:769,k:'恒',m:'constant',on:'コウ',ku:'つね-',lv:'N1',st:9,cat:'other',rad:'心',mn:'Heart + constant = constant',ex:[{w:'恒常',r:'こうじょう',e:'permanence'},{w:'恒久',r:'こうきゅう',e:'permanent'}]},
  {id:770,k:'昂',m:'high / elated',on:'コウ',ku:'たか-',lv:'N1',st:8,cat:'description',rad:'日',mn:'Sun + square = elated',ex:[{w:'昂揚',r:'こうよう',e:'elation'},{w:'意気昂然',r:'いきこうぜん',e:'high-spirited'}]},
  {id:771,k:'硬',m:'hard',on:'コウ',ku:'かた-',lv:'N1',st:12,cat:'description',rad:'石',mn:'Stone + normal = hard',ex:[{w:'硬直',r:'こうちょく',e:'rigidity'},{w:'強硬',r:'きょうこう',e:'hard-line'}]},
  {id:772,k:'綱',m:'rope / principle',on:'コウ',ku:'つな',lv:'N1',st:14,cat:'other',rad:'糸',mn:'Thread + net = rope',ex:[{w:'綱',r:'つな',e:'rope'},{w:'綱領',r:'こうりょう',e:'platform/principles'}]},
  {id:773,k:'酷',m:'cruel / severe',on:'コク',ku:'',lv:'N1',st:14,cat:'description',rad:'酉',mn:'Wine jar + tell = cruel',ex:[{w:'酷い',r:'ひどい',e:'terrible'},{w:'残酷',r:'ざんこく',e:'cruel'}]},
  {id:774,k:'克',m:'overcome',on:'コク',ku:'',lv:'N1',st:7,cat:'action',rad:'儿',mn:'Person + strength = overcome',ex:[{w:'克服',r:'こくふく',e:'overcoming'},{w:'克明',r:'こくめい',e:'meticulous'}]},
  {id:775,k:'刻',m:'engrave / moment',on:'コク',ku:'きざ-',lv:'N1',st:8,cat:'action',rad:'刀',mn:'Pig + knife = engrave',ex:[{w:'深刻',r:'しんこく',e:'serious'},{w:'刻々',r:'こくこく',e:'moment by moment'}]},
  {id:776,k:'獄',m:'prison',on:'ゴク',ku:'',lv:'N1',st:14,cat:'place',rad:'犬',mn:'Two dogs arguing = prison',ex:[{w:'刑務所',r:'けいむしょ',e:'prison'},{w:'地獄',r:'じごく',e:'hell'}]},
  {id:777,k:'墾',m:'cultivate land',on:'コン',ku:'',lv:'N1',st:16,cat:'action',rad:'土',mn:'Pig + hammer + earth = cultivate',ex:[{w:'開墾',r:'かいこん',e:'land clearing'},{w:'墾田',r:'こんでん',e:'cultivated rice field'}]},
  {id:778,k:'昏',m:'dusk / dim',on:'コン',ku:'くら-',lv:'N1',st:8,cat:'time',rad:'日',mn:'Clan + sun = dusk',ex:[{w:'黄昏',r:'たそがれ',e:'twilight'},{w:'昏睡',r:'こんすい',e:'coma'}]},
  {id:779,k:'魂',m:'soul / spirit',on:'コン',ku:'たましい',lv:'N1',st:14,cat:'other',rad:'鬼',mn:'Spirit of the dead',ex:[{w:'魂',r:'たましい',e:'soul'},{w:'霊魂',r:'れいこん',e:'spirit'}]},
  {id:780,k:'渾',m:'all / mix',on:'コン',ku:'',lv:'N1',st:12,cat:'other',rad:'水',mn:'Water + mix = blend',ex:[{w:'渾身',r:'こんしん',e:'whole body'},{w:'渾然',r:'こんぜん',e:'perfectly blended'}]},
  {id:781,k:'懇',m:'sincere / earnest',on:'コン',ku:'ねんご-',lv:'N1',st:17,cat:'feeling',rad:'心',mn:'Heart + wolf = sincere',ex:[{w:'懇切',r:'こんせつ',e:'kind and thorough'},{w:'懇談',r:'こんだん',e:'friendly talk'}]},
  {id:782,k:'坤',m:'earth (trigram)',on:'コン',ku:'',lv:'N1',st:8,cat:'other',rad:'土',mn:'Earth + apply = earth principle',ex:[{w:'乾坤',r:'けんこん',e:'heaven and earth'},{w:'坤位',r:'こんい',e:'earth position'}]},
  {id:783,k:'挫',m:'crush / frustrate',on:'ザ',ku:'くじ-',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + seat = crush',ex:[{w:'挫折',r:'ざせつ',e:'setback'},{w:'骨折挫傷',r:'こっせつざしょう',e:'fracture'}]},
  {id:784,k:'債',m:'debt / bond',on:'サイ',ku:'',lv:'N1',st:13,cat:'other',rad:'人',mn:'Person + blame = debt',ex:[{w:'公債',r:'こうさい',e:'public bond'},{w:'負債',r:'ふさい',e:'liability'}]},
  {id:785,k:'砕',m:'crush / break',on:'サイ',ku:'くだ-',lv:'N1',st:9,cat:'action',rad:'石',mn:'Stone + hit = crush',ex:[{w:'砕く',r:'くだく',e:'to crush'},{w:'粉砕',r:'ふんさい',e:'pulverization'}]},
  {id:786,k:'采',m:'harvest / manage',on:'サイ',ku:'',lv:'N1',st:8,cat:'other',rad:'木',mn:'Plucking fruit from tree',ex:[{w:'采配',r:'さいはい',e:'command'},{w:'采択',r:'さいたく',e:'adoption'}]},
  {id:787,k:'宰',m:'minister / oversee',on:'サイ',ku:'',lv:'N1',st:10,cat:'other',rad:'宀',mn:'Roof + crime = oversee',ex:[{w:'宰相',r:'さいしょう',e:'prime minister'},{w:'主宰',r:'しゅさい',e:'presidency'}]},
  {id:788,k:'錯',m:'confused / intermingled',on:'サク',ku:'',lv:'N1',st:16,cat:'other',rad:'金',mn:'Metal + mix = confused',ex:[{w:'錯覚',r:'さっかく',e:'illusion'},{w:'交錯',r:'こうさく',e:'intermingling'}]},
  {id:789,k:'冊',m:'book / volume',on:'サツ',ku:'',lv:'N1',st:5,cat:'other',rad:'冊',mn:'Bundle of tablets = book',ex:[{w:'冊子',r:'さっし',e:'booklet'},{w:'別冊',r:'べっさつ',e:'separate volume'}]},
  {id:790,k:'刹',m:'moment / Buddhist temple',on:'セツ・サツ',ku:'',lv:'N1',st:8,cat:'time',rad:'刀',mn:'Knife + tree = instant',ex:[{w:'刹那',r:'せつな',e:'instant'},{w:'古刹',r:'こさつ',e:'ancient temple'}]},
  {id:791,k:'撮',m:'photograph / pinch',on:'サツ',ku:'と-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + cover = photograph',ex:[{w:'撮る',r:'とる',e:'to photograph'},{w:'撮影',r:'さつえい',e:'filming'}]},
  {id:792,k:'擦',m:'rub',on:'サツ',ku:'す-',lv:'N1',st:17,cat:'action',rad:'手',mn:'Hand + inspect = rub',ex:[{w:'擦り傷',r:'すりきず',e:'abrasion'},{w:'摩擦音',r:'まさつおん',e:'fricative'}]},
  {id:793,k:'賛',m:'agree / praise',on:'サン',ku:'',lv:'N1',st:15,cat:'other',rad:'貝',mn:'Praise + shell = agree',ex:[{w:'賛成',r:'さんせい',e:'agreement'},{w:'協賛',r:'きょうさん',e:'co-sponsorship'}]},
  {id:794,k:'傘',m:'umbrella',on:'サン',ku:'かさ',lv:'N1',st:12,cat:'other',rad:'人',mn:'Many people under cover',ex:[{w:'傘',r:'かさ',e:'umbrella'},{w:'日傘',r:'ひがさ',e:'parasol'}]},
  {id:795,k:'惨',m:'miserable',on:'サン',ku:'みじ-',lv:'N1',st:11,cat:'feeling',rad:'心',mn:'Heart + forest = miserable',ex:[{w:'惨事',r:'さんじ',e:'disaster'},{w:'惨めな',r:'みじめな',e:'miserable'}]},
  {id:796,k:'暫',m:'for a while',on:'ザン',ku:'しばら-',lv:'N1',st:15,cat:'time',rad:'日',mn:'Battle axe + sun = temporary',ex:[{w:'暫定',r:'ざんてい',e:'provisional'},{w:'暫く',r:'しばらく',e:'for a while'}]},
  {id:797,k:'斬',m:'cut / behead',on:'ザン',ku:'き-',lv:'N1',st:11,cat:'action',rad:'斤',mn:'Axe + vehicle = behead',ex:[{w:'斬る',r:'きる',e:'to behead'},{w:'斬新',r:'ざんしん',e:'novel/fresh'}]},
  {id:798,k:'賜',m:'bestow / grant',on:'シ',ku:'たまわ-',lv:'N1',st:15,cat:'other',rad:'貝',mn:'Shell + easy = grant',ex:[{w:'賜る',r:'たまわる',e:'to receive'},{w:'御賜',r:'おんし',e:'imperial gift'}]},
  {id:799,k:'施',m:'implement / bestow',on:'シ',ku:'ほどこ-',lv:'N1',st:9,cat:'action',rad:'方',mn:'Direction + carry out = implement',ex:[{w:'施設',r:'しせつ',e:'facility'},{w:'実施',r:'じっし',e:'implementation'}]},
  {id:800,k:'嗣',m:'heir / inherit',on:'シ',ku:'',lv:'N1',st:13,cat:'other',rad:'口',mn:'Mouth + official = heir',ex:[{w:'後嗣',r:'こうし',e:'heir'},{w:'嗣子',r:'しし',e:'heir apparent'}]},
  {id:801,k:'しゅん',m:'spring / talented',on:'シュン',ku:'',lv:'N1',st:9,cat:'description',rad:'日',mn:'Sun between plants = spring',ex:[{w:'英俊',r:'えいしゅん',e:'genius'},{w:'俊才',r:'しゅんさい',e:'gifted person'}]},
  {id:802,k:'粛',m:'solemn / strict',on:'シュク',ku:'',lv:'N1',st:11,cat:'other',rad:'米',mn:'Rice + water = solemn',ex:[{w:'厳粛',r:'げんしゅく',e:'solemn'},{w:'粛清',r:'しゅくせい',e:'purge'}]},
  {id:803,k:'呪',m:'curse / spell',on:'ジュ',ku:'のろ-',lv:'N1',st:8,cat:'other',rad:'口',mn:'Mouth + brother = curse',ex:[{w:'呪う',r:'のろう',e:'to curse'},{w:'呪文',r:'じゅもん',e:'incantation'}]},
  {id:804,k:'芝',m:'lawn / turf',on:'シ',ku:'しば',lv:'N1',st:6,cat:'nature',rad:'艸',mn:'Grass + skillful',ex:[{w:'芝居',r:'しばい',e:'performance'},{w:'芝刈り',r:'しばかり',e:'lawn mowing'}]},
  {id:805,k:'縦',m:'vertical / as one likes',on:'ジュウ',ku:'たて',lv:'N1',st:16,cat:'other',rad:'糸',mn:'Thread + follow = vertical',ex:[{w:'縦',r:'たて',e:'vertical'},{w:'縦断',r:'じゅうだん',e:'going through'}]},
  {id:806,k:'粛',m:'solemn',on:'シュク',ku:'',lv:'N1',st:11,cat:'other',rad:'米',mn:'Grain + purify = solemn',ex:[{w:'自粛',r:'じしゅく',e:'self-restraint'},{w:'粛然',r:'しゅくぜん',e:'solemnly'}]},
  {id:807,k:'殉',m:'martyrdom',on:'ジュン',ku:'',lv:'N1',st:10,cat:'other',rad:'歹',mn:'Death + obedience = martyr',ex:[{w:'殉職',r:'じゅんしょく',e:'dying in the line of duty'},{w:'殉教',r:'じゅんきょう',e:'martyrdom'}]},
  {id:808,k:'准',m:'semi / approve',on:'ジュン',ku:'',lv:'N1',st:10,cat:'other',rad:'冫',mn:'Ice + bird = approve',ex:[{w:'准教授',r:'じゅんきょうじゅ',e:'associate professor'},{w:'批准',r:'ひじゅん',e:'ratification'}]},
  {id:809,k:'遵',m:'follow / obey',on:'ジュン',ku:'',lv:'N1',st:15,cat:'action',rad:'辶',mn:'Follow + road = comply',ex:[{w:'遵守',r:'じゅんしゅ',e:'compliance'},{w:'遵法',r:'じゅんぽう',e:'law-abiding'}]},
  {id:810,k:'庶',m:'common / general',on:'ショ',ku:'',lv:'N1',st:11,cat:'other',rad:'广',mn:'Shelter + fire = common',ex:[{w:'庶民',r:'しょみん',e:'common people'},{w:'庶務',r:'しょむ',e:'general affairs'}]},
  {id:811,k:'咄',m:'exclamation / story',on:'トツ',ku:'',lv:'N1',st:8,cat:'art',rad:'口',mn:'Mouth + sprout = exclamation',ex:[{w:'咄嗟',r:'とっさ',e:'moment\'s notice'},{w:'話',r:'はなし',e:'story'}]},
  {id:812,k:'恕',m:'forgiveness',on:'ジョ',ku:'ゆる-',lv:'N1',st:10,cat:'feeling',rad:'心',mn:'Like + heart = forgive',ex:[{w:'恕す',r:'ゆるす',e:'to forgive'},{w:'寛恕',r:'かんじょ',e:'forgiveness'}]},
  {id:813,k:'丈',m:'length / Mr.',on:'ジョウ',ku:'たけ',lv:'N1',st:3,cat:'other',rad:'丿',mn:'Measure + arm = length',ex:[{w:'丈夫',r:'じょうぶ',e:'sturdy'},{w:'背丈',r:'せたけ',e:'height'}]},
  {id:814,k:'剰',m:'surplus',on:'ジョウ',ku:'あま-',lv:'N1',st:11,cat:'other',rad:'刀',mn:'Remaining + knife = surplus',ex:[{w:'余剰',r:'よじょう',e:'surplus'},{w:'剰余金',r:'じょうよきん',e:'surplus funds'}]},
  {id:815,k:'飾',m:'decorate',on:'ショク',ku:'かざ-',lv:'N1',st:13,cat:'art',rad:'食',mn:'Food + cloth = decorate',ex:[{w:'装飾',r:'そうしょく',e:'decoration'},{w:'飾り付け',r:'かざりつけ',e:'decorating'}]},
  {id:816,k:'辱',m:'disgrace',on:'ジョク',ku:'はずかし-',lv:'N1',st:10,cat:'other',rad:'寸',mn:'Inch + disgrace = humiliate',ex:[{w:'屈辱',r:'くつじょく',e:'humiliation'},{w:'侮辱',r:'ぶじょく',e:'insult'}]},
  {id:817,k:'浸',m:'soak / immerse',on:'シン',ku:'ひた-',lv:'N1',st:10,cat:'action',rad:'水',mn:'Water + stop = soak',ex:[{w:'浸す',r:'ひたす',e:'to soak'},{w:'浸透',r:'しんとう',e:'penetration'}]},
  {id:818,k:'尽',m:'exhaust / serve',on:'ジン',ku:'つ-',lv:'N1',st:6,cat:'action',rad:'尸',mn:'Body bent = exhausted',ex:[{w:'尽きる',r:'つきる',e:'to be exhausted'},{w:'尽くす',r:'つくす',e:'to devote'}]},
  {id:819,k:'辛',m:'spicy / bitter',on:'シン',ku:'から-',lv:'N1',st:7,cat:'description',rad:'辛',mn:'Tattoo needle = bitter',ex:[{w:'辛い',r:'からい',e:'spicy'},{w:'辛苦',r:'しんく',e:'hardship'}]},
  {id:820,k:'慎',m:'careful / discreet',on:'シン',ku:'つつし-',lv:'N1',st:13,cat:'feeling',rad:'心',mn:'Heart + truth = careful',ex:[{w:'慎重',r:'しんちょう',e:'careful'},{w:'謹慎',r:'きんしん',e:'confinement'}]},
  {id:821,k:'診',m:'diagnose',on:'シン',ku:'み-',lv:'N1',st:12,cat:'action',rad:'言',mn:'Words + reap = diagnose',ex:[{w:'内診',r:'ないしん',e:'internal examination'},{w:'健診',r:'けんしん',e:'health checkup'}]},
  {id:822,k:'刷',m:'print',on:'サツ',ku:'す-',lv:'N1',st:8,cat:'action',rad:'刀',mn:'Print + knife = print',ex:[{w:'印刷',r:'いんさつ',e:'printing'},{w:'刷り直し',r:'すりなおし',e:'reprint'}]},
  {id:823,k:'鑑',m:'mirror / model',on:'カン',ku:'かがみ',lv:'N1',st:23,cat:'other',rad:'金',mn:'Metal + basin = mirror',ex:[{w:'鑑定',r:'かんてい',e:'appraisal'},{w:'図鑑',r:'ずかん',e:'illustrated reference'}]},
  {id:824,k:'拙',m:'unskilled / my humble',on:'セツ',ku:'つたな-',lv:'N1',st:8,cat:'description',rad:'手',mn:'Hand + out = clumsy',ex:[{w:'拙い',r:'つたない',e:'poor/clumsy'},{w:'稚拙',r:'ちせつ',e:'unsophisticated'}]},
  {id:825,k:'窃',m:'steal / private',on:'セツ',ku:'ぬす-',lv:'N1',st:9,cat:'action',rad:'穴',mn:'Hole + cut = steal',ex:[{w:'窃盗',r:'せっとう',e:'theft'},{w:'窃取',r:'せっしゅ',e:'pilferage'}]},
  {id:826,k:'繊',m:'slender / fiber',on:'セン',ku:'',lv:'N1',st:17,cat:'other',rad:'糸',mn:'Thread + small = fiber',ex:[{w:'繊維',r:'せんい',e:'fiber'},{w:'繊細',r:'せんさい',e:'delicate'}]},
  {id:827,k:'旋',m:'rotate / tour',on:'セン',ku:'',lv:'N1',st:11,cat:'action',rad:'方',mn:'Direction + spin = rotate',ex:[{w:'旋回',r:'せんかい',e:'rotation'},{w:'凱旋',r:'がいせん',e:'triumphal return'}]},
  {id:828,k:'占',m:'divine / occupy',on:'セン',ku:'うらな- し-',lv:'N1',st:5,cat:'other',rad:'卜',mn:'Divination + mouth = occupy',ex:[{w:'占領',r:'せんりょう',e:'occupation'},{w:'独占',r:'どくせん',e:'monopoly'}]},
  {id:829,k:'践',m:'carry out / tread',on:'セン',ku:'ふ-',lv:'N1',st:13,cat:'action',rad:'足',mn:'Foot + simplify = tread',ex:[{w:'実践',r:'じっせん',e:'practice'},{w:'践む',r:'ふむ',e:'to tread'}]},
  {id:830,k:'煎',m:'fry / boil',on:'セン',ku:'い-',lv:'N1',st:13,cat:'action',rad:'火',mn:'Fire + before = fry',ex:[{w:'煎る',r:'いる',e:'to roast'},{w:'煎じる',r:'せんじる',e:'to decoct'}]},
  {id:831,k:'鮮',m:'fresh / vivid',on:'セン',ku:'あざや-',lv:'N1',st:17,cat:'description',rad:'魚',mn:'Fish + sheep = fresh',ex:[{w:'新鮮',r:'しんせん',e:'fresh'},{w:'鮮明',r:'せんめい',e:'vivid'}]},
  {id:832,k:'膳',m:'tray / meal',on:'ゼン',ku:'',lv:'N1',st:16,cat:'other',rad:'月',mn:'Body + good = dining tray',ex:[{w:'膳',r:'ぜん',e:'dining tray'},{w:'朝膳',r:'あさぜん',e:'morning meal'}]},
  {id:833,k:'漸',m:'gradually',on:'ゼン',ku:'',lv:'N1',st:14,cat:'other',rad:'水',mn:'Water + axe = gradually',ex:[{w:'漸次',r:'ぜんじ',e:'gradually'},{w:'漸増',r:'ぜんぞう',e:'gradual increase'}]},
  {id:834,k:'阻',m:'obstruct',on:'ソ',ku:'はば-',lv:'N1',st:8,cat:'action',rad:'阜',mn:'Mound + divide = obstruct',ex:[{w:'阻む',r:'はばむ',e:'to obstruct'},{w:'阻害',r:'そがい',e:'obstruction'}]},
  {id:835,k:'礎',m:'foundation',on:'ソ',ku:'いしずえ',lv:'N1',st:18,cat:'other',rad:'石',mn:'Stone + place = foundation',ex:[{w:'礎石',r:'そせき',e:'cornerstone'},{w:'礎を築く',r:'そをきずく',e:'to lay the foundation'}]},
  {id:836,k:'挿',m:'insert',on:'ソウ',ku:'さ-',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + insert = insert',ex:[{w:'挿す',r:'さす',e:'to insert'},{w:'挿入',r:'そうにゅう',e:'insertion'}]},
  {id:837,k:'窓',m:'window',on:'ソウ',ku:'まど',lv:'N1',st:11,cat:'place',rad:'穴',mn:'Hole + heart = window',ex:[{w:'窓',r:'まど',e:'window'},{w:'窓口',r:'まどぐち',e:'window/counter'}]},
  {id:838,k:'遭',m:'encounter',on:'ソウ',ku:'あ-',lv:'N1',st:14,cat:'action',rad:'辶',mn:'Bundle + road = encounter',ex:[{w:'遭遇',r:'そうぐう',e:'encounter'},{w:'遭難',r:'そうなん',e:'disaster'}]},
  {id:839,k:'漕',m:'row / paddle',on:'ソウ',ku:'こ-',lv:'N1',st:14,cat:'action',rad:'水',mn:'Water + build = row',ex:[{w:'漕ぐ',r:'こぐ',e:'to row/paddle'},{w:'漕艇',r:'そうてい',e:'rowing'}]},
  {id:840,k:'装',m:'wear / pretend',on:'ソウ',ku:'よそお-',lv:'N1',st:12,cat:'action',rad:'衣',mn:'Garment + warrior = dress',ex:[{w:'装う',r:'よそおう',e:'to dress'},{w:'装置',r:'そうち',e:'device'}]},
  {id:841,k:'蒼',m:'blue-green / pale',on:'ソウ',ku:'あお-',lv:'N1',st:13,cat:'color',rad:'艸',mn:'Grass + storage = pale green',ex:[{w:'蒼白',r:'そうはく',e:'pale'},{w:'蒼天',r:'そうてん',e:'blue sky'}]},
  {id:842,k:'爽',m:'refreshing',on:'ソウ',ku:'さわ-',lv:'N1',st:11,cat:'description',rad:'大',mn:'Big + x-pattern = refreshing',ex:[{w:'爽やか',r:'さわやか',e:'refreshing'},{w:'爽快',r:'そうかい',e:'exhilarating'}]},
  {id:843,k:'憎',m:'hate',on:'ゾウ',ku:'にく-',lv:'N1',st:14,cat:'feeling',rad:'心',mn:'Heart + increase = hate',ex:[{w:'憎む',r:'にくむ',e:'to hate'},{w:'憎悪',r:'ぞうお',e:'hatred'}]},
  {id:844,k:'贈',m:'give as gift',on:'ゾウ',ku:'おく-',lv:'N1',st:18,cat:'action',rad:'貝',mn:'Shell + add = give gift',ex:[{w:'贈呈',r:'ぞうてい',e:'presentation'},{w:'贈答',r:'ぞうとう',e:'gift-giving'}]},
  {id:845,k:'促',m:'urge / hasten',on:'ソク',ku:'うなが-',lv:'N1',st:9,cat:'action',rad:'人',mn:'Person + foot = urge',ex:[{w:'促す',r:'うながす',e:'to urge'},{w:'促進',r:'そくしん',e:'promotion'}]},
  {id:846,k:'即',m:'immediate / namely',on:'ソク',ku:'すなわ-',lv:'N1',st:7,cat:'other',rad:'卩',mn:'Kneeling + food = immediate',ex:[{w:'即座',r:'そくざ',e:'immediate'},{w:'即席',r:'そくせき',e:'improvised'}]},
  {id:847,k:'俗',m:'worldly / vulgar',on:'ゾク',ku:'',lv:'N1',st:9,cat:'other',rad:'人',mn:'Person + valley = vulgar',ex:[{w:'風俗',r:'ふうぞく',e:'manners/customs'},{w:'通俗',r:'つうぞく',e:'popular'}]},
  {id:848,k:'堕',m:'fall / degenerate',on:'ダ',ku:'お-',lv:'N1',st:12,cat:'action',rad:'土',mn:'Left + earth = sink',ex:[{w:'堕落',r:'だらく',e:'degeneration'},{w:'堕ちる',r:'おちる',e:'to fall into'}]},
  {id:849,k:'惰',m:'lazy / idle',on:'ダ',ku:'',lv:'N1',st:12,cat:'feeling',rad:'心',mn:'Heart + left = lazy',ex:[{w:'惰性',r:'だせい',e:'inertia'},{w:'怠惰',r:'たいだ',e:'laziness'}]},
  {id:850,k:'互',m:'mutual',on:'ゴ',ku:'たが-',lv:'N1',st:4,cat:'other',rad:'二',mn:'Two opposing = mutual',ex:[{w:'互いに',r:'たがいに',e:'mutually'},{w:'相互',r:'そうご',e:'mutual'}]},
  {id:851,k:'妥',m:'appropriate / settle',on:'ダ',ku:'',lv:'N1',st:7,cat:'other',rad:'女',mn:'Woman + hand = settle',ex:[{w:'妥当',r:'だとう',e:'appropriate'},{w:'妥協',r:'だきょう',e:'compromise'}]},
  {id:852,k:'懈',m:'neglect / lax',on:'カイ',ku:'',lv:'N1',st:17,cat:'feeling',rad:'心',mn:'Heart + resolve = neglect',ex:[{w:'懈怠',r:'けたい',e:'negligence'},{w:'弛懈',r:'しかい',e:'slackness'}]},
  {id:853,k:'端',m:'edge / start',on:'タン',ku:'はし・は',lv:'N1',st:14,cat:'other',rad:'立',mn:'Stand + cloth = edge',ex:[{w:'先端',r:'せんたん',e:'tip/forefront'},{w:'発端',r:'ほったん',e:'beginning'}]},
  {id:854,k:'胆',m:'gallbladder / guts',on:'タン',ku:'',lv:'N1',st:9,cat:'body',rad:'月',mn:'Body + morning = gallbladder',ex:[{w:'胆力',r:'たんりょく',e:'nerve/courage'},{w:'胆嚢',r:'たんのう',e:'gallbladder'}]},
  {id:855,k:'鍛',m:'forge / temper',on:'タン',ku:'きた-',lv:'N1',st:17,cat:'action',rad:'金',mn:'Metal + repeatedly = forge',ex:[{w:'鍛える',r:'きたえる',e:'to forge/train'},{w:'鍛冶',r:'かじ',e:'blacksmithing'}]},
  {id:856,k:'弾',m:'bullet / pluck',on:'ダン',ku:'たま・ひ-',lv:'N1',st:15,cat:'other',rad:'弓',mn:'Bow + single = bullet',ex:[{w:'弾',r:'たま',e:'bullet'},{w:'爆弾',r:'ばくだん',e:'bomb'}]},
  {id:857,k:'恥',m:'shame',on:'チ',ku:'は-',lv:'N1',st:10,cat:'feeling',rad:'心',mn:'Ear + heart = shame',ex:[{w:'恥ずかしい',r:'はずかしい',e:'ashamed'},{w:'恥',r:'はじ',e:'shame'}]},
  {id:858,k:'忠',m:'loyalty',on:'チュウ',ku:'',lv:'N1',st:8,cat:'feeling',rad:'心',mn:'Middle + heart = loyalty',ex:[{w:'忠実',r:'ちゅうじつ',e:'faithful'},{w:'忠義',r:'ちゅうぎ',e:'loyalty'}]},
  {id:859,k:'抽',m:'extract / draw',on:'チュウ',ku:'ぬ-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + rice = extract',ex:[{w:'抽選',r:'ちゅうせん',e:'lottery'},{w:'抽出',r:'ちゅうしゅつ',e:'extraction'}]},
  {id:860,k:'沈',m:'sink / silent',on:'チン',ku:'しず-',lv:'N1',st:7,cat:'action',rad:'水',mn:'Water + pillow = sink',ex:[{w:'沈む',r:'しずむ',e:'to sink'},{w:'沈黙',r:'ちんもく',e:'silence'}]},
  {id:861,k:'陳',m:'old / state',on:'チン',ku:'のべ-',lv:'N1',st:11,cat:'other',rad:'阜',mn:'Mound + old = state/display',ex:[{w:'陳列',r:'ちんれつ',e:'display'},{w:'陳述',r:'ちんじゅつ',e:'statement'}]},
  {id:862,k:'朕',m:'emperor I',on:'チン',ku:'',lv:'N1',st:10,cat:'other',rad:'月',mn:'Boat cracks = imperial I',ex:[{w:'朕',r:'ちん',e:'I (imperial)'},{w:'朕が',r:'ちんが',e:'my imperial'}]},
  {id:863,k:'珍',m:'rare',on:'チン',ku:'めずら-',lv:'N1',st:9,cat:'description',rad:'玉',mn:'Gem + hair = rare',ex:[{w:'珍重',r:'ちんちょう',e:'treasuring'},{w:'珍道中',r:'ちんどうちゅう',e:'eventful journey'}]},
  {id:864,k:'鎮',m:'suppress / calm',on:'チン',ku:'しず-',lv:'N1',st:18,cat:'action',rad:'金',mn:'Metal + true = suppress',ex:[{w:'鎮静',r:'ちんせい',e:'calming'},{w:'鎮圧',r:'ちんあつ',e:'suppression'}]},
  {id:865,k:'墜',m:'fall / crash',on:'ツイ',ku:'お-',lv:'N1',st:15,cat:'action',rad:'土',mn:'Earth + corner = crash',ex:[{w:'墜落',r:'ついらく',e:'crash'},{w:'撃墜',r:'げきつい',e:'shooting down'}]},
  {id:866,k:'捉',m:'catch / grasp',on:'ソク',ku:'とら-',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + foot = catch',ex:[{w:'捉える',r:'とらえる',e:'to catch'},{w:'把捉',r:'はそく',e:'grasp'}]},
  {id:867,k:'坪',m:'tsubo (unit)',on:'ヘイ',ku:'つぼ',lv:'N1',st:8,cat:'other',rad:'土',mn:'Earth + even = unit of area',ex:[{w:'坪',r:'つぼ',e:'tsubo (3.3 m²)'},{w:'坪数',r:'つぼすう',e:'floor area in tsubo'}]},
  {id:868,k:'溺',m:'drown / be addicted',on:'デキ',ku:'おぼ-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + brother = drown',ex:[{w:'溺れる',r:'おぼれる',e:'to drown'},{w:'溺愛',r:'できあい',e:'doting'}]},
  {id:869,k:'哲',m:'wise / philosophy',on:'テツ',ku:'',lv:'N1',st:10,cat:'other',rad:'口',mn:'Axe + mouth = wisdom',ex:[{w:'哲学',r:'てつがく',e:'philosophy'},{w:'哲人',r:'てつじん',e:'philosopher'}]},
  {id:870,k:'徹',m:'penetrate / thorough',on:'テツ',ku:'',lv:'N1',st:15,cat:'action',rad:'彳',mn:'Walk + thorough = penetrate',ex:[{w:'徹底',r:'てってい',e:'thoroughness'},{w:'貫徹',r:'かんてつ',e:'accomplishment'}]},
  {id:871,k:'填',m:'fill / inlay',on:'テン',ku:'は-',lv:'N1',st:13,cat:'action',rad:'土',mn:'Earth + fill = inlay',ex:[{w:'填める',r:'はめる',e:'to fit/fill'},{w:'補填',r:'ほてん',e:'compensation'}]},
  {id:872,k:'悼',m:'mourn',on:'トウ',ku:'いた-',lv:'N1',st:11,cat:'feeling',rad:'心',mn:'Heart + stand = mourn',ex:[{w:'悼む',r:'いたむ',e:'to mourn'},{w:'追悼',r:'ついとう',e:'mourning'}]},
  {id:873,k:'謄',m:'transcribe / copy',on:'トウ',ku:'',lv:'N1',st:17,cat:'other',rad:'言',mn:'Words + rise = copy',ex:[{w:'謄本',r:'とうほん',e:'certified copy'},{w:'謄写',r:'とうしゃ',e:'copying'}]},
  {id:874,k:'騰',m:'rise / jump',on:'トウ',ku:'',lv:'N1',st:20,cat:'other',rad:'馬',mn:'Horse + rise = jump up',ex:[{w:'高騰',r:'こうとう',e:'soaring prices'},{w:'急騰',r:'きゅうとう',e:'sudden rise'}]},
  {id:875,k:'踏',m:'tread / step',on:'トウ',ku:'ふ-',lv:'N1',st:15,cat:'action',rad:'足',mn:'Foot + water = tread',ex:[{w:'踏み台',r:'ふみだい',e:'stepping stool'},{w:'踏切',r:'ふみきり',e:'railroad crossing'}]},
  {id:876,k:'奪',m:'seize',on:'ダツ',ku:'うば-',lv:'N1',st:14,cat:'action',rad:'大',mn:'Large + bird = seize',ex:[{w:'強奪',r:'ごうだつ',e:'robbery'},{w:'略奪',r:'りゃくだつ',e:'plunder'}]},
  {id:877,k:'鈍',m:'dull / slow',on:'ドン',ku:'にぶ-',lv:'N1',st:12,cat:'description',rad:'金',mn:'Metal + retreat = dull',ex:[{w:'鈍い',r:'にぶい',e:'dull'},{w:'鈍感',r:'どんかん',e:'insensitive'}]},
  {id:878,k:'縄',m:'rope / Okinawa',on:'ジョウ',ku:'なわ',lv:'N1',st:15,cat:'other',rad:'糸',mn:'Thread + water = rope',ex:[{w:'縄',r:'なわ',e:'rope'},{w:'縄文',r:'じょうもん',e:'Jomon'}]},
  {id:879,k:'軟',m:'soft',on:'ナン',ku:'やわ-',lv:'N1',st:11,cat:'description',rad:'車',mn:'Cart + yawn = soft',ex:[{w:'軟化',r:'なんか',e:'softening'},{w:'柔軟',r:'じゅうなん',e:'flexible'}]},
  {id:880,k:'謎',m:'riddle / mystery',on:'メイ',ku:'なぞ',lv:'N1',st:17,cat:'other',rad:'言',mn:'Words + lost = mystery',ex:[{w:'謎',r:'なぞ',e:'mystery'},{w:'謎めく',r:'なぞめく',e:'to be mysterious'}]},
  {id:881,k:'粘',m:'sticky / persevere',on:'ネン',ku:'ねば-',lv:'N1',st:11,cat:'description',rad:'米',mn:'Rice + divination = sticky',ex:[{w:'粘る',r:'ねばる',e:'to be sticky/persist'},{w:'粘液',r:'ねんえき',e:'mucus'}]},
  {id:882,k:'濃',m:'thick / rich',on:'ノウ',ku:'こ-',lv:'N1',st:16,cat:'description',rad:'水',mn:'Water + harvest = thick',ex:[{w:'濃縮',r:'のうしゅく',e:'concentration'},{w:'濃密',r:'のうみつ',e:'dense'}]},
  {id:883,k:'把',m:'grasp',on:'ハ',ku:'',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + snake = grasp',ex:[{w:'把握',r:'はあく',e:'grasp'},{w:'一把',r:'いちわ',e:'a bundle'}]},
  {id:884,k:'廃',m:'abolish / ruin',on:'ハイ',ku:'すた-',lv:'N1',st:12,cat:'action',rad:'广',mn:'Shelter + strike = abolish',ex:[{w:'廃止',r:'はいし',e:'abolition'},{w:'廃墟',r:'はいきょ',e:'ruins'}]},
  {id:885,k:'排',m:'exclude / push out',on:'ハイ',ku:'',lv:'N1',st:11,cat:'action',rad:'手',mn:'Hand + non = exclude',ex:[{w:'排除',r:'はいじょ',e:'exclusion'},{w:'排気',r:'はいき',e:'exhaust'}]},
  {id:886,k:'輩',m:'companion / generation',on:'ハイ',ku:'',lv:'N1',st:15,cat:'people',rad:'車',mn:'Vehicle + non = fellows',ex:[{w:'同輩',r:'どうはい',e:'contemporary'},{w:'先輩',r:'せんぱい',e:'senior'}]},
  {id:887,k:'拍',m:'beat / clap',on:'ハク',ku:'',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + white = clap',ex:[{w:'拍手',r:'はくしゅ',e:'applause'},{w:'拍子',r:'ひょうし',e:'rhythm'}]},
  {id:888,k:'柏',m:'oak / cypress',on:'ハク',ku:'かしわ',lv:'N1',st:9,cat:'nature',rad:'木',mn:'Wood + white = cypress',ex:[{w:'柏',r:'かしわ',e:'oak'},{w:'柏餅',r:'かしわもち',e:'oak-leaf rice cake'}]},
  {id:889,k:'薄',m:'thin / pale',on:'ハク',ku:'うす-',lv:'N1',st:16,cat:'description',rad:'艸',mn:'Grass + water + special = thin',ex:[{w:'薄い',r:'うすい',e:'thin/pale'},{w:'薄暗い',r:'うすぐらい',e:'dim'}]},
  {id:890,k:'肌',m:'skin',on:'キ',ku:'はだ',lv:'N1',st:6,cat:'body',rad:'月',mn:'Body + several = skin',ex:[{w:'肌',r:'はだ',e:'skin'},{w:'素肌',r:'すはだ',e:'bare skin'}]},
  {id:891,k:'畑',m:'field (dry)',on:'',ku:'はた・はたけ',lv:'N1',st:9,cat:'nature',rad:'火',mn:'Fire + field = dry field',ex:[{w:'畑',r:'はたけ',e:'dry field'},{w:'畑違い',r:'はたけちがい',e:'out of one\'s field'}]},
  {id:892,k:'罰',m:'punishment',on:'バツ',ku:'',lv:'N1',st:14,cat:'other',rad:'网',mn:'Net + knife = punish',ex:[{w:'罰する',r:'ばっする',e:'to punish'},{w:'天罰',r:'てんばつ',e:'divine punishment'}]},
  {id:893,k:'抜',m:'pull out / extract',on:'バツ',ku:'ぬ-',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + dog = pull out',ex:[{w:'抜く',r:'ぬく',e:'to pull out'},{w:'抜粋',r:'ばっすい',e:'excerpt'}]},
  {id:894,k:'閥',m:'clique / faction',on:'バツ',ku:'',lv:'N1',st:14,cat:'other',rad:'門',mn:'Gate + battle = faction',ex:[{w:'派閥',r:'はばつ',e:'faction'},{w:'財閥',r:'ざいばつ',e:'zaibatsu'}]},
  {id:895,k:'藩',m:'domain / clan',on:'ハン',ku:'',lv:'N1',st:18,cat:'other',rad:'艸',mn:'Water + marsh = domain',ex:[{w:'藩',r:'はん',e:'domain'},{w:'廃藩',r:'はいはん',e:'abolition of domains'}]},
  {id:896,k:'頒',m:'distribute',on:'ハン',ku:'わか-',lv:'N1',st:13,cat:'other',rad:'頁',mn:'Head + distribute = distribute',ex:[{w:'頒布',r:'はんぷ',e:'distribution'},{w:'頒価',r:'はんか',e:'distribution price'}]},
  {id:897,k:'帆',m:'sail',on:'ハン',ku:'ほ',lv:'N1',st:6,cat:'other',rad:'巾',mn:'Cloth + breath = sail',ex:[{w:'帆',r:'ほ',e:'sail'},{w:'帆船',r:'はんせん',e:'sailboat'}]},
  {id:898,k:'繁',m:'thriving / frequent',on:'ハン',ku:'',lv:'N1',st:16,cat:'description',rad:'糸',mn:'Thread + fire = thriving',ex:[{w:'繁盛',r:'はんじょう',e:'prosperity'},{w:'繁栄',r:'はんえい',e:'prosperity'}]},
  {id:899,k:'蛮',m:'barbarian',on:'バン',ku:'',lv:'N1',st:12,cat:'other',rad:'虫',mn:'Southern insect = barbarian',ex:[{w:'野蛮',r:'やばん',e:'barbarous'},{w:'蛮勇',r:'ばんゆう',e:'reckless courage'}]},
  {id:900,k:'卑',m:'low / humble',on:'ヒ',ku:'いや-',lv:'N1',st:8,cat:'description',rad:'十',mn:'Ladle = low',ex:[{w:'卑しい',r:'いやしい',e:'humble/vulgar'},{w:'卑怯',r:'ひきょう',e:'cowardly'}]},
  {id:901,k:'披',m:'open / disclose',on:'ヒ',ku:'',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + skin = open',ex:[{w:'披露',r:'ひろう',e:'disclosure'},{w:'披露宴',r:'ひろうえん',e:'reception'}]},
  {id:902,k:'肥',m:'fat / fertile',on:'ヒ',ku:'こ- ふと-',lv:'N1',st:8,cat:'description',rad:'月',mn:'Body + ba = fat',ex:[{w:'肥える',r:'こえる',e:'to get fat'},{w:'肥料',r:'ひりょう',e:'fertilizer'}]},
  {id:903,k:'秘',m:'secret',on:'ヒ',ku:'ひ-',lv:'N1',st:10,cat:'other',rad:'禾',mn:'Grain + must = secret',ex:[{w:'秘密',r:'ひみつ',e:'secret'},{w:'秘書',r:'ひしょ',e:'secretary'}]},
  {id:904,k:'匹',m:'one (small animal)',on:'ヒキ',ku:'',lv:'N1',st:4,cat:'other',rad:'匚',mn:'Box + thread = animal counter',ex:[{w:'一匹',r:'いっぴき',e:'one (animal)'},{w:'匹敵',r:'ひってき',e:'match'}]},
  {id:905,k:'批',m:'criticize',on:'ヒ',ku:'',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + skin = criticize',ex:[{w:'批判',r:'ひはん',e:'criticism'},{w:'批准',r:'ひじゅん',e:'ratification'}]},
  {id:906,k:'漂',m:'drift / float',on:'ヒョウ',ku:'ただよ-',lv:'N1',st:14,cat:'action',rad:'水',mn:'Water + sign = drift',ex:[{w:'漂う',r:'ただよう',e:'to drift'},{w:'漂流',r:'ひょうりゅう',e:'drifting'}]},
  {id:907,k:'苗',m:'seedling',on:'ビョウ',ku:'なえ・なわ',lv:'N1',st:8,cat:'nature',rad:'艸',mn:'Grass + rice paddy = seedling',ex:[{w:'苗',r:'なえ',e:'seedling'},{w:'苗字',r:'みょうじ',e:'family name'}]},
  {id:908,k:'賦',m:'tax / compose',on:'フ',ku:'',lv:'N1',st:15,cat:'other',rad:'貝',mn:'Shell + move = assign',ex:[{w:'賦与',r:'ふよ',e:'endowment'},{w:'月賦',r:'げっぷ',e:'monthly installment'}]},
  {id:909,k:'撫',m:'stroke / caress',on:'ブ',ku:'な-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + nothing = stroke',ex:[{w:'撫でる',r:'なでる',e:'to stroke'},{w:'撫子',r:'なでしこ',e:'pink flower'}]},
  {id:910,k:'憤',m:'indignant',on:'フン',ku:'いきどお-',lv:'N1',st:15,cat:'feeling',rad:'心',mn:'Heart + full = indignant',ex:[{w:'憤る',r:'いきどおる',e:'to be indignant'},{w:'義憤',r:'ぎふん',e:'righteous indignation'}]},
  {id:911,k:'吻',m:'lips / tip',on:'フン',ku:'くちびる',lv:'N1',st:7,cat:'body',rad:'口',mn:'Mouth + divide = lips',ex:[{w:'口吻',r:'こうふん',e:'manner of speaking'},{w:'嘴吻',r:'しふん',e:'beak'}]},
  {id:912,k:'聘',m:'invite / engage',on:'ヘイ',ku:'',lv:'N1',st:13,cat:'action',rad:'耳',mn:'Ear + hire = engage',ex:[{w:'招聘',r:'しょうへい',e:'invitation'},{w:'聘用',r:'へいよう',e:'employment'}]},
  {id:913,k:'弊',m:'abuse / worn out',on:'ヘイ',ku:'',lv:'N1',st:15,cat:'other',rad:'廾',mn:'Tie + abuse = abuse',ex:[{w:'弊害',r:'へいがい',e:'harmful effects'},{w:'疲弊',r:'ひへい',e:'exhaustion'}]},
  {id:914,k:'偏',m:'partial / lean',on:'ヘン',ku:'かたよ-',lv:'N1',st:11,cat:'description',rad:'人',mn:'Person + slant = partial',ex:[{w:'偏る',r:'かたよる',e:'to be biased'},{w:'偏見',r:'へんけん',e:'prejudice'}]},
  {id:915,k:'遍',m:'everywhere / generally',on:'ヘン',ku:'',lv:'N1',st:12,cat:'other',rad:'辶',mn:'Everywhere + road = general',ex:[{w:'普遍',r:'ふへん',e:'universal'},{w:'遍歴',r:'へんれき',e:'travels'}]},
  {id:916,k:'弁',m:'dialect / valve',on:'ベン',ku:'',lv:'N1',st:5,cat:'other',rad:'廾',mn:'Two hands speaking = speech',ex:[{w:'弁当',r:'べんとう',e:'lunch box'},{w:'弁解',r:'べんかい',e:'excuse'}]},
  {id:917,k:'泡',m:'bubble',on:'ホウ',ku:'あわ',lv:'N1',st:8,cat:'nature',rad:'水',mn:'Water + wrap = bubble',ex:[{w:'気泡',r:'きほう',e:'air bubble'},{w:'泡沫',r:'ほうまつ',e:'bubble/foam'}]},
  {id:918,k:'飽',m:'bored / satiated',on:'ホウ',ku:'あ-',lv:'N1',st:13,cat:'feeling',rad:'食',mn:'Food + wrap = satiated',ex:[{w:'飽きる',r:'あきる',e:'to get bored'},{w:'飽和',r:'ほうわ',e:'saturation'}]},
  {id:919,k:'縫',m:'sew',on:'ホウ',ku:'ぬ-',lv:'N1',st:16,cat:'action',rad:'糸',mn:'Thread + path = sew',ex:[{w:'縫う',r:'ぬう',e:'to sew'},{w:'縫製',r:'ほうせい',e:'sewing'}]},
  {id:920,k:'奉',m:'offer / serve',on:'ホウ',ku:'たてまつ-',lv:'N1',st:8,cat:'action',rad:'大',mn:'Offer in both hands = dedicate',ex:[{w:'奉仕',r:'ほうし',e:'service'},{w:'奉る',r:'たてまつる',e:'to offer'}]},
  {id:921,k:'墓',m:'grave',on:'ボ',ku:'はか',lv:'N1',st:13,cat:'place',rad:'土',mn:'Sunset over earth = grave',ex:[{w:'墓',r:'はか',e:'grave'},{w:'墓地',r:'ぼち',e:'cemetery'}]},
  {id:922,k:'芳',m:'fragrant',on:'ホウ',ku:'かんば-',lv:'N1',st:7,cat:'nature',rad:'艸',mn:'Grass + direction = fragrant',ex:[{w:'芳しい',r:'かんばしい',e:'fragrant'},{w:'芳名',r:'ほうめい',e:'your good name'}]},
  {id:923,k:'倣',m:'imitate',on:'ホウ',ku:'なら-',lv:'N1',st:10,cat:'action',rad:'人',mn:'Person + visit = imitate',ex:[{w:'倣う',r:'ならう',e:'to imitate'},{w:'模倣',r:'もほう',e:'imitation'}]},
  {id:924,k:'傍',m:'side / nearby',on:'ボウ',ku:'かたわ-',lv:'N1',st:12,cat:'place',rad:'人',mn:'Person + direction = side',ex:[{w:'傍ら',r:'かたわら',e:'beside'},{w:'傍観',r:'ぼうかん',e:'looking on'}]},
  {id:925,k:'剖',m:'dissect',on:'ボウ',ku:'',lv:'N1',st:10,cat:'action',rad:'刀',mn:'Half + knife = dissect',ex:[{w:'解剖',r:'かいぼう',e:'dissection'},{w:'剖検',r:'ぼうけん',e:'autopsy'}]},
  {id:926,k:'膨',m:'swell / expand',on:'ボウ',ku:'ふく-',lv:'N1',st:16,cat:'action',rad:'月',mn:'Body + drum = swell',ex:[{w:'膨らむ',r:'ふくらむ',e:'to swell'},{w:'膨張',r:'ぼうちょう',e:'expansion'}]},
  {id:927,k:'忘',m:'forget',on:'ボウ',ku:'わす-',lv:'N1',st:7,cat:'action',rad:'心',mn:'Death + heart = forget',ex:[{w:'忘れる',r:'わすれる',e:'to forget'},{w:'健忘',r:'けんぼう',e:'forgetfulness'}]},
  {id:928,k:'某',m:'certain / someone',on:'ボウ',ku:'それがし',lv:'N1',st:9,cat:'other',rad:'木',mn:'Lumber + taste = certain',ex:[{w:'某',r:'ぼう',e:'certain (person)'},{w:'某氏',r:'ぼうし',e:'a certain person'}]},
  {id:929,k:'邦',m:'home country',on:'ホウ',ku:'くに',lv:'N1',st:7,cat:'place',rad:'邑',mn:'Planted + city = country',ex:[{w:'邦楽',r:'ほうがく',e:'Japanese music'},{w:'連邦',r:'れんぽう',e:'federation'}]},
  {id:930,k:'俸',m:'salary',on:'ホウ',ku:'',lv:'N1',st:10,cat:'work',rad:'人',mn:'Person + offer = salary',ex:[{w:'俸給',r:'ほうきゅう',e:'salary'},{w:'年俸',r:'ねんぽう',e:'annual salary'}]},
  {id:931,k:'僕',m:'I (male) / servant',on:'ボク',ku:'しもべ',lv:'N1',st:14,cat:'people',rad:'人',mn:'Person + servant = servant',ex:[{w:'僕',r:'ぼく',e:'I (male)'},{w:'下僕',r:'げぼく',e:'servant'}]},
  {id:932,k:'撲',m:'beat / hit',on:'ボク',ku:'う-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + attack = beat',ex:[{w:'撲滅',r:'ぼくめつ',e:'eradication'},{w:'撲殺',r:'ぼくさつ',e:'beating to death'}]},
  {id:933,k:'没',m:'sink / die',on:'ボツ',ku:'',lv:'N1',st:7,cat:'action',rad:'水',mn:'Water + collapse = sink',ex:[{w:'没頭',r:'ぼっとう',e:'absorption'},{w:'没収',r:'ぼっしゅう',e:'confiscation'}]},
  {id:934,k:'堀',m:'moat / trench',on:'コツ',ku:'ほり',lv:'N1',st:11,cat:'place',rad:'土',mn:'Earth + dig = moat',ex:[{w:'堀',r:'ほり',e:'moat'},{w:'お堀',r:'おほり',e:'castle moat'}]},
  {id:935,k:'魔',m:'magic / demon',on:'マ',ku:'',lv:'N1',st:21,cat:'other',rad:'鬼',mn:'Hemp + demon = magic',ex:[{w:'魔法',r:'まほう',e:'magic'},{w:'悪魔',r:'あくま',e:'demon'}]},
  {id:936,k:'埋',m:'bury',on:'マイ',ku:'う-',lv:'N1',st:10,cat:'action',rad:'土',mn:'Earth + bear = bury',ex:[{w:'埋める',r:'うめる',e:'to bury'},{w:'埋蔵',r:'まいぞう',e:'buried treasure'}]},
  {id:937,k:'幕',m:'curtain / act',on:'バク・マク',ku:'',lv:'N1',st:13,cat:'other',rad:'巾',mn:'Cloth + dark = curtain',ex:[{w:'幕',r:'まく',e:'curtain'},{w:'幕府',r:'ばくふ',e:'shogunate'}]},
  {id:938,k:'摩',m:'rub / wear',on:'マ',ku:'',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hemp + hand = rub',ex:[{w:'摩擦',r:'まさつ',e:'friction'},{w:'按摩',r:'あんま',e:'massage'}]},
  {id:939,k:'魅',m:'charm / bewitch',on:'ミ',ku:'',lv:'N1',st:15,cat:'feeling',rad:'鬼',mn:'Demon + not yet = charm',ex:[{w:'魅力',r:'みりょく',e:'charm'},{w:'魅了',r:'みりょう',e:'fascination'}]},
  {id:940,k:'眠',m:'sleep',on:'ミン',ku:'ねむ-',lv:'N1',st:10,cat:'action',rad:'目',mn:'Eye + people = sleep',ex:[{w:'眠る',r:'ねむる',e:'to sleep'},{w:'不眠',r:'ふみん',e:'sleeplessness'}]},
  {id:941,k:'銘',m:'inscription / brand',on:'メイ',ku:'',lv:'N1',st:14,cat:'other',rad:'金',mn:'Metal + name = inscription',ex:[{w:'銘柄',r:'めいがら',e:'brand'},{w:'座右の銘',r:'ざゆうのめい',e:'motto'}]},
  {id:942,k:'滅',m:'destroy / perish',on:'メツ',ku:'ほろ-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + fire + blade = destroy',ex:[{w:'滅ぼす',r:'ほろぼす',e:'to destroy'},{w:'絶滅',r:'ぜつめつ',e:'extinction'}]},
  {id:943,k:'免',m:'exempt',on:'メン',ku:'まぬか-',lv:'N1',st:8,cat:'other',rad:'儿',mn:'Person escaping = exempt',ex:[{w:'免疫',r:'めんえき',e:'immunity'},{w:'不免',r:'ふめん',e:'non-exemption'}]},
  {id:944,k:'茂',m:'lush / thrive',on:'モ',ku:'しげ-',lv:'N1',st:8,cat:'nature',rad:'艸',mn:'Grass + axe = lush',ex:[{w:'茂る',r:'しげる',e:'to be lush'},{w:'茂み',r:'しげみ',e:'thicket'}]},
  {id:945,k:'妄',m:'reckless / deluded',on:'モウ・ボウ',ku:'',lv:'N1',st:6,cat:'other',rad:'女',mn:'Dead + woman = deluded',ex:[{w:'妄想',r:'もうそう',e:'delusion'},{w:'妄言',r:'もうげん',e:'reckless remark'}]},
  {id:946,k:'猛',m:'fierce / brave',on:'モウ',ku:'',lv:'N1',st:11,cat:'description',rad:'犬',mn:'Dog + chief = fierce',ex:[{w:'猛烈',r:'もうれつ',e:'fierce'},{w:'猛獣',r:'もうじゅう',e:'fierce animal'}]},
  {id:947,k:'躍',m:'leap / jump',on:'ヤク',ku:'おど-',lv:'N1',st:21,cat:'action',rad:'足',mn:'Foot + bird = leap',ex:[{w:'躍る',r:'おどる',e:'to leap'},{w:'活躍',r:'かつやく',e:'active role'}]},
  {id:948,k:'喩',m:'metaphor',on:'ユ',ku:'たと-',lv:'N1',st:12,cat:'art',rad:'口',mn:'Mouth + container = metaphor',ex:[{w:'比喩',r:'ひゆ',e:'metaphor'},{w:'隠喩',r:'いんゆ',e:'implied metaphor'}]},
  {id:949,k:'癒',m:'heal / cure',on:'ユ',ku:'い-',lv:'N1',st:18,cat:'health',rad:'疒',mn:'Sickbed + container = heal',ex:[{w:'癒す',r:'いやす',e:'to heal'},{w:'治癒',r:'ちゆ',e:'recovery'}]},
  {id:950,k:'誘',m:'tempt / invite',on:'ユウ',ku:'さそ-',lv:'N1',st:14,cat:'action',rad:'言',mn:'Words + reach = tempt',ex:[{w:'誘惑',r:'ゆうわく',e:'temptation'},{w:'勧誘',r:'かんゆう',e:'solicitation'}]},
  {id:951,k:'幽',m:'faint / quiet',on:'ユウ',ku:'',lv:'N1',st:9,cat:'description',rad:'幺',mn:'Two threads + mountain = faint',ex:[{w:'幽霊',r:'ゆうれい',e:'ghost'},{w:'幽玄',r:'ゆうげん',e:'mysterious beauty'}]},
  {id:952,k:'猶',m:'still more / hesitate',on:'ユウ',ku:'なお',lv:'N1',st:12,cat:'other',rad:'犬',mn:'Dog + strange = hesitate',ex:[{w:'猶予',r:'ゆうよ',e:'grace period'},{w:'猶も',r:'なおも',e:'still more'}]},
  {id:953,k:'融',m:'melt / circulate',on:'ユウ',ku:'と-',lv:'N1',st:16,cat:'action',rad:'鬲',mn:'Vessel + insect = melt',ex:[{w:'融合',r:'ゆうごう',e:'fusion'},{w:'金融',r:'きんゆう',e:'finance'}]},
  {id:954,k:'抑',m:'restrain',on:'ヨク',ku:'おさ-',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + kneeling = suppress',ex:[{w:'抑揚',r:'よくよう',e:'intonation'},{w:'抑圧',r:'よくあつ',e:'oppression'}]},
  {id:955,k:'翼',m:'wing',on:'ヨク',ku:'つばさ',lv:'N1',st:17,cat:'nature',rad:'羽',mn:'Wings + different = wing',ex:[{w:'翼',r:'つばさ',e:'wing'},{w:'両翼',r:'りょうよく',e:'both wings'}]},
  {id:956,k:'羅',m:'gauze / list',on:'ラ',ku:'',lv:'N1',st:19,cat:'other',rad:'网',mn:'Net + bird = list',ex:[{w:'羅列',r:'られつ',e:'enumeration'},{w:'修羅場',r:'しゅらば',e:'scene of carnage'}]},
  {id:957,k:'欄',m:'column / railing',on:'ラン',ku:'',lv:'N1',st:20,cat:'other',rad:'木',mn:'Wood + look = railing',ex:[{w:'欄',r:'らん',e:'column'},{w:'欄外',r:'らんがい',e:'margin'}]},
  {id:958,k:'濫',m:'overflow / excessive',on:'ラン',ku:'',lv:'N1',st:18,cat:'action',rad:'水',mn:'Water + see = overflow',ex:[{w:'濫用',r:'らんよう',e:'abuse'},{w:'氾濫',r:'はんらん',e:'overflow'}]},
  {id:959,k:'吏',m:'official / officer',on:'リ',ku:'',lv:'N1',st:6,cat:'other',rad:'一',mn:'Person serving = official',ex:[{w:'官吏',r:'かんり',e:'government official'},{w:'吏員',r:'りいん',e:'official member'}]},
  {id:960,k:'履',m:'footwear / carry out',on:'リ',ku:'は-',lv:'N1',st:15,cat:'action',rad:'尸',mn:'Body + carry = carry out',ex:[{w:'履く',r:'はく',e:'to wear (footwear)'},{w:'履歴',r:'りれき',e:'career history'}]},
  {id:961,k:'裂',m:'tear / split',on:'レツ',ku:'さ-',lv:'N1',st:12,cat:'action',rad:'衣',mn:'Clothes + split = tear',ex:[{w:'裂く',r:'さく',e:'to tear'},{w:'分裂',r:'ぶんれつ',e:'split'}]},
  {id:962,k:'廉',m:'cheap / pure',on:'レン',ku:'',lv:'N1',st:13,cat:'description',rad:'广',mn:'Shelter + all = frugal',ex:[{w:'廉価',r:'れんか',e:'low price'},{w:'清廉',r:'せいれん',e:'integrity'}]},
  {id:963,k:'錬',m:'refine / temper',on:'レン',ku:'ね-',lv:'N1',st:16,cat:'action',rad:'金',mn:'Metal + beam = refine',ex:[{w:'練る',r:'ねる',e:'to train'},{w:'精錬',r:'せいれん',e:'refining'}]},
  {id:964,k:'弄',m:'play with / tamper',on:'ロウ',ku:'もてあそ-',lv:'N1',st:7,cat:'action',rad:'廾',mn:'King + hands = play with',ex:[{w:'弄ぶ',r:'もてあそぶ',e:'to play with'},{w:'愚弄',r:'ぐろう',e:'making a fool of'}]},
  {id:965,k:'聾',m:'deaf',on:'ロウ',ku:'つんぼ',lv:'N1',st:22,cat:'health',rad:'耳',mn:'Dragon + ear = deaf',ex:[{w:'聾者',r:'ろうしゃ',e:'deaf person'},{w:'聾唖',r:'ろうあ',e:'deaf-mute'}]},
  {id:966,k:'濾',m:'filter',on:'ロ',ku:'こ-',lv:'N1',st:18,cat:'action',rad:'水',mn:'Water + tiger = filter',ex:[{w:'濾過',r:'ろか',e:'filtration'},{w:'濾紙',r:'ろし',e:'filter paper'}]},
  {id:967,k:'賄',m:'bribe',on:'ワイ',ku:'まかな-',lv:'N1',st:13,cat:'other',rad:'貝',mn:'Shell + within = bribe',ex:[{w:'収賄',r:'しゅうわい',e:'bribery'},{w:'贈賄',r:'ぞうわい',e:'giving a bribe'}]},
  {id:968,k:'惑',m:'confuse / tempt',on:'ワク',ku:'まど-',lv:'N1',st:12,cat:'feeling',rad:'心',mn:'Or + heart = confuse',ex:[{w:'惑わす',r:'まどわす',e:'to mislead'},{w:'迷惑',r:'めいわく',e:'nuisance'}]},
  {id:969,k:'湾',m:'bay / gulf',on:'ワン',ku:'',lv:'N1',st:12,cat:'nature',rad:'水',mn:'Water + winding = bay',ex:[{w:'湾岸',r:'わんがん',e:'gulf coast'},{w:'東京湾',r:'とうきょうわん',e:'Tokyo Bay'}]},
  {id:970,k:'腕',m:'arm / skill',on:'ワン',ku:'うで',lv:'N1',st:12,cat:'body',rad:'月',mn:'Body + sound = arm',ex:[{w:'腕',r:'うで',e:'arm'},{w:'腕前',r:'うでまえ',e:'skill'}]},
  {id:971,k:'泳',m:'swim',on:'エイ',ku:'およ-',lv:'N4',st:8,cat:'action',rad:'水',mn:'Water + eternal = swim',ex:[{w:'泳ぐ',r:'およぐ',e:'to swim'},{w:'水泳',r:'すいえい',e:'swimming'}]},
  {id:972,k:'押',m:'push',on:'オウ',ku:'お-',lv:'N4',st:8,cat:'action',rad:'手',mn:'Hand + press = push',ex:[{w:'押す',r:'おす',e:'to push'},{w:'押入れ',r:'おしいれ',e:'closet'}]},
  {id:973,k:'温',m:'warm',on:'オン',ku:'あたた-',lv:'N4',st:13,cat:'description',rad:'水',mn:'Water + sun + dish = warm',ex:[{w:'温かい',r:'あたたかい',e:'warm'},{w:'気温',r:'きおん',e:'temperature'}]},
  {id:974,k:'荷',m:'load / luggage',on:'カ',ku:'に',lv:'N4',st:10,cat:'other',rad:'艸',mn:'Grass + what = luggage',ex:[{w:'荷物',r:'にもつ',e:'luggage'},{w:'荷台',r:'にだい',e:'cargo bed'}]},
  {id:975,k:'彼',m:'he / that',on:'ヒ',ku:'かれ・かの',lv:'N4',st:8,cat:'person',rad:'彳',mn:'Walk + skin = he',ex:[{w:'彼',r:'かれ',e:'he'},{w:'彼女',r:'かのじょ',e:'she / girlfriend'}]},
  {id:976,k:'皮',m:'skin / peel',on:'ヒ',ku:'かわ',lv:'N4',st:5,cat:'body',rad:'皮',mn:'Peeling hand = skin',ex:[{w:'皮',r:'かわ',e:'skin / leather'},{w:'皮膚',r:'ひふ',e:'skin'}]},
  {id:977,k:'悲',m:'sad',on:'ヒ',ku:'かな-',lv:'N4',st:12,cat:'feeling',rad:'心',mn:'Not + heart = sad',ex:[{w:'悲しい',r:'かなしい',e:'sad'},{w:'悲劇',r:'ひげき',e:'tragedy'}]},
  {id:978,k:'疲',m:'tired',on:'ヒ',ku:'つか-',lv:'N4',st:10,cat:'health',rad:'疒',mn:'Sickbed + skin = tired',ex:[{w:'疲れる',r:'つかれる',e:'to get tired'},{w:'疲労',r:'ひろう',e:'fatigue'}]},
  {id:979,k:'鼻',m:'nose',on:'ビ',ku:'はな',lv:'N4',st:14,cat:'body',rad:'鼻',mn:'Self + nose shape = nose',ex:[{w:'鼻',r:'はな',e:'nose'},{w:'鼻水',r:'はなみず',e:'runny nose'}]},
  {id:980,k:'品',m:'goods / quality',on:'ヒン',ku:'しな',lv:'N4',st:9,cat:'other',rad:'口',mn:'Three mouths = goods',ex:[{w:'品物',r:'しなもの',e:'goods'},{w:'品質',r:'ひんしつ',e:'quality'}]},
  {id:981,k:'不',m:'not / un-',on:'フ・ブ',ku:'',lv:'N4',st:4,cat:'other',rad:'一',mn:'Bird flying up = not',ex:[{w:'不安',r:'ふあん',e:'anxiety'},{w:'不便',r:'ふべん',e:'inconvenient'}]},
  {id:982,k:'夫',m:'husband / man',on:'フ・フウ',ku:'おっと',lv:'N4',st:4,cat:'person',rad:'大',mn:'Big man with hat = husband',ex:[{w:'夫',r:'おっと',e:'husband'},{w:'夫婦',r:'ふうふ',e:'married couple'}]},
  {id:983,k:'付',m:'attach / give',on:'フ',ku:'つ-',lv:'N4',st:5,cat:'action',rad:'人',mn:'Person + inch = attach',ex:[{w:'付ける',r:'つける',e:'to attach'},{w:'受付',r:'うけつけ',e:'reception'}]},
  {id:984,k:'服',m:'clothes / obey',on:'フク',ku:'',lv:'N4',st:8,cat:'other',rad:'月',mn:'Boat + kneeling = obey',ex:[{w:'服',r:'ふく',e:'clothes'},{w:'服用',r:'ふくよう',e:'taking medicine'}]},
  {id:985,k:'物',m:'thing / object',on:'ブツ・モツ',ku:'もの',lv:'N4',st:8,cat:'other',rad:'牛',mn:'Cow + color = thing',ex:[{w:'物',r:'もの',e:'thing'},{w:'食べ物',r:'たべもの',e:'food'}]},
  {id:986,k:'文',m:'writing / sentence',on:'ブン・モン',ku:'ふみ',lv:'N4',st:4,cat:'art',rad:'文',mn:'Crossed lines = writing',ex:[{w:'文章',r:'ぶんしょう',e:'sentence'},{w:'文化',r:'ぶんか',e:'culture'}]},
  {id:987,k:'平',m:'flat / peace',on:'ヘイ・ビョウ',ku:'たいら・ひら',lv:'N4',st:5,cat:'description',rad:'干',mn:'Balanced scale = flat',ex:[{w:'平和',r:'へいわ',e:'peace'},{w:'平ら',r:'たいら',e:'flat'}]},
  {id:988,k:'別',m:'separate / different',on:'ベツ',ku:'わか-',lv:'N4',st:7,cat:'other',rad:'刀',mn:'Bone + knife = separate',ex:[{w:'別れる',r:'わかれる',e:'to separate'},{w:'特別',r:'とくべつ',e:'special'}]},
  {id:989,k:'辺',m:'area / vicinity',on:'ヘン',ku:'あた-・べ',lv:'N4',st:5,cat:'place',rad:'辵',mn:'Walk + cut = vicinity',ex:[{w:'辺り',r:'あたり',e:'vicinity'},{w:'この辺',r:'このへん',e:'around here'}]},
  {id:990,k:'返',m:'return',on:'ヘン',ku:'かえ-',lv:'N4',st:7,cat:'action',rad:'辵',mn:'Walk + anti = return',ex:[{w:'返す',r:'かえす',e:'to return'},{w:'返事',r:'へんじ',e:'reply'}]},
  {id:991,k:'便',m:'convenient / mail',on:'ベン・ビン',ku:'たよ-',lv:'N4',st:9,cat:'other',rad:'人',mn:'Person + change = convenient',ex:[{w:'便利',r:'べんり',e:'convenient'},{w:'郵便',r:'ゆうびん',e:'mail'}]},
  {id:992,k:'放',m:'release / fire',on:'ホウ',ku:'はな-・はな-す',lv:'N4',st:8,cat:'action',rad:'攴',mn:'Square + strike = release',ex:[{w:'放す',r:'はなす',e:'to release'},{w:'放送',r:'ほうそう',e:'broadcast'}]},
  {id:993,k:'忘',m:'forget',on:'ボウ',ku:'わす-',lv:'N4',st:7,cat:'feeling',rad:'心',mn:'Dead + heart = forget',ex:[{w:'忘れる',r:'わすれる',e:'to forget'},{w:'忘れ物',r:'わすれもの',e:'lost item'}]},
  {id:994,k:'味',m:'taste / flavor',on:'ミ',ku:'あじ',lv:'N4',st:8,cat:'other',rad:'口',mn:'Mouth + not yet = taste',ex:[{w:'味',r:'あじ',e:'taste'},{w:'意味',r:'いみ',e:'meaning'}]},
  {id:995,k:'眠',m:'sleep',on:'ミン',ku:'ねむ-',lv:'N4',st:10,cat:'action',rad:'目',mn:'Eye + people = sleep',ex:[{w:'眠る',r:'ねむる',e:'to sleep'},{w:'睡眠',r:'すいみん',e:'sleep'}]},
  {id:996,k:'娘',m:'daughter / young woman',on:'ジョウ',ku:'むすめ',lv:'N4',st:10,cat:'person',rad:'女',mn:'Woman + good = daughter',ex:[{w:'娘',r:'むすめ',e:'daughter'},{w:'お嬢さん',r:'おじょうさん',e:'young lady'}]},
  {id:997,k:'戻',m:'return / revert',on:'レイ',ku:'もど-',lv:'N4',st:7,cat:'action',rad:'戸',mn:'Door + dog = return',ex:[{w:'戻る',r:'もどる',e:'to return'},{w:'戻す',r:'もどす',e:'to put back'}]},
  {id:998,k:'笑',m:'laugh / smile',on:'ショウ',ku:'わら-・え-',lv:'N4',st:10,cat:'feeling',rad:'竹',mn:'Bamboo + heaven = laugh',ex:[{w:'笑う',r:'わらう',e:'to laugh'},{w:'笑顔',r:'えがお',e:'smiling face'}]},
  {id:999,k:'泣',m:'cry / weep',on:'キュウ',ku:'な-',lv:'N4',st:8,cat:'feeling',rad:'水',mn:'Water + stand = cry',ex:[{w:'泣く',r:'なく',e:'to cry'},{w:'泣き声',r:'なきごえ',e:'crying voice'}]},
  {id:1000,k:'踊',m:'dance',on:'ヨウ',ku:'おど-',lv:'N4',st:14,cat:'art',rad:'足',mn:'Foot + brave = dance',ex:[{w:'踊る',r:'おどる',e:'to dance'},{w:'踊り',r:'おどり',e:'dance'}]},
  {id:1001,k:'歌',m:'song / sing',on:'カ',ku:'うた-',lv:'N4',st:14,cat:'art',rad:'欠',mn:'Mouth + yawn = sing',ex:[{w:'歌う',r:'うたう',e:'to sing'},{w:'歌手',r:'かしゅ',e:'singer'}]},
  {id:1002,k:'借',m:'borrow',on:'シャク',ku:'か-',lv:'N4',st:10,cat:'action',rad:'人',mn:'Person + former = borrow',ex:[{w:'借りる',r:'かりる',e:'to borrow'},{w:'借金',r:'しゃっきん',e:'debt'}]},
  {id:1003,k:'貸',m:'lend',on:'タイ',ku:'か-',lv:'N4',st:12,cat:'action',rad:'貝',mn:'Money + substitute = lend',ex:[{w:'貸す',r:'かす',e:'to lend'},{w:'賃貸',r:'ちんたい',e:'rental'}]},
  {id:1004,k:'払',m:'pay',on:'フツ',ku:'はら-',lv:'N4',st:5,cat:'action',rad:'手',mn:'Hand + remove = pay',ex:[{w:'払う',r:'はらう',e:'to pay'},{w:'支払い',r:'しはらい',e:'payment'}]},
  {id:1005,k:'渡',m:'cross / hand over',on:'ト',ku:'わた-',lv:'N4',st:12,cat:'action',rad:'水',mn:'Water + many = cross',ex:[{w:'渡る',r:'わたる',e:'to cross'},{w:'渡す',r:'わたす',e:'to hand over'}]},
  {id:1006,k:'困',m:'troubled / in difficulty',on:'コン',ku:'こま-',lv:'N4',st:7,cat:'feeling',rad:'木',mn:'Tree in box = trapped',ex:[{w:'困る',r:'こまる',e:'to be troubled'},{w:'困難',r:'こんなん',e:'difficulty'}]},
  {id:1007,k:'痛',m:'painful',on:'ツウ',ku:'いた-',lv:'N4',st:12,cat:'health',rad:'疒',mn:'Sickbed + through = painful',ex:[{w:'痛い',r:'いたい',e:'painful'},{w:'頭痛',r:'ずつう',e:'headache'}]},
  {id:1008,k:'危',m:'dangerous',on:'キ',ku:'あぶ-',lv:'N4',st:6,cat:'description',rad:'人',mn:'Person on cliff = dangerous',ex:[{w:'危ない',r:'あぶない',e:'dangerous'},{w:'危険',r:'きけん',e:'danger'}]},
  {id:1009,k:'汚',m:'dirty / pollute',on:'オ・ウ',ku:'よご-・きたな-',lv:'N4',st:6,cat:'description',rad:'水',mn:'Water + upon = dirty',ex:[{w:'汚い',r:'きたない',e:'dirty'},{w:'汚れ',r:'よごれ',e:'dirt / stain'}]},
  {id:1010,k:'緑',m:'green',on:'リョク',ku:'みどり',lv:'N4',st:14,cat:'color',rad:'糸',mn:'Thread + record = green',ex:[{w:'緑',r:'みどり',e:'green'},{w:'緑色',r:'みどりいろ',e:'green color'}]},
  {id:1011,k:'橙',m:'orange (color)',on:'トウ',ku:'だいだい',lv:'N4',st:16,cat:'color',rad:'木',mn:'Wood + lamp = orange',ex:[{w:'橙色',r:'だいだいいろ',e:'orange color'},{w:'橙',r:'だいだい',e:'bitter orange'}]},
  {id:1012,k:'紫',m:'purple',on:'シ',ku:'むらさき',lv:'N4',st:12,cat:'color',rad:'糸',mn:'Thread + this = purple',ex:[{w:'紫',r:'むらさき',e:'purple'},{w:'紫外線',r:'しがいせん',e:'ultraviolet rays'}]},
  {id:1013,k:'茶',m:'tea / brown',on:'チャ・サ',ku:'',lv:'N4',st:9,cat:'food',rad:'艸',mn:'Grass + tree = tea',ex:[{w:'お茶',r:'おちゃ',e:'tea'},{w:'茶色',r:'ちゃいろ',e:'brown'}]},
  {id:1014,k:'漫',m:'comic / random',on:'マン',ku:'',lv:'N4',st:14,cat:'art',rad:'水',mn:'Water + long = random',ex:[{w:'漫画',r:'まんが',e:'manga / comics'},{w:'漫才',r:'まんざい',e:'comedy duo'}]},
  {id:1015,k:'映',m:'reflect / project',on:'エイ',ku:'うつ-・は-',lv:'N4',st:9,cat:'art',rad:'日',mn:'Sun + center = reflect',ex:[{w:'映画',r:'えいが',e:'movie'},{w:'映す',r:'うつす',e:'to project'}]},
  {id:1016,k:'演',m:'perform / act',on:'エン',ku:'',lv:'N4',st:14,cat:'art',rad:'水',mn:'Water + wide = perform',ex:[{w:'演じる',r:'えんじる',e:'to perform'},{w:'演奏',r:'えんそう',e:'musical performance'}]},
  {id:1017,k:'曲',m:'music / bend',on:'キョク',ku:'ま-',lv:'N4',st:6,cat:'art',rad:'曰',mn:'Winding box = bend',ex:[{w:'曲',r:'きょく',e:'music piece'},{w:'作曲',r:'さっきょく',e:'composing music'}]},
  {id:1018,k:'速',m:'fast / speed',on:'ソク',ku:'はや-',lv:'N4',st:10,cat:'description',rad:'辵',mn:'Walk + bundle = fast',ex:[{w:'速い',r:'はやい',e:'fast'},{w:'速度',r:'そくど',e:'speed'}]},
  {id:1019,k:'遅',m:'slow / late',on:'チ',ku:'おそ-・おく-',lv:'N4',st:12,cat:'description',rad:'辵',mn:'Walk + rhinoceros = slow',ex:[{w:'遅い',r:'おそい',e:'slow / late'},{w:'遅刻',r:'ちこく',e:'being late'}]},
  {id:1020,k:'正',m:'correct / right',on:'セイ・ショウ',ku:'ただ-・まさ',lv:'N4',st:5,cat:'description',rad:'止',mn:'Stop at one = correct',ex:[{w:'正しい',r:'ただしい',e:'correct'},{w:'正直',r:'しょうじき',e:'honest'}]},
  {id:1021,k:'残',m:'remain / cruel',on:'ザン',ku:'のこ-',lv:'N4',st:10,cat:'other',rad:'歹',mn:'Bone + spear = remain',ex:[{w:'残る',r:'のこる',e:'to remain'},{w:'残念',r:'ざんねん',e:'regret'}]},
  {id:1022,k:'割',m:'divide / proportion',on:'カツ',ku:'わ-',lv:'N4',st:12,cat:'action',rad:'刀',mn:'Knife + harm = divide',ex:[{w:'割る',r:'わる',e:'to divide'},{w:'割合',r:'わりあい',e:'proportion'}]},
  {id:1023,k:'例',m:'example',on:'レイ',ku:'たと-',lv:'N4',st:8,cat:'other',rad:'人',mn:'Person + rows = example',ex:[{w:'例えば',r:'たとえば',e:'for example'},{w:'例外',r:'れいがい',e:'exception'}]},
  {id:1024,k:'様',m:'way / appearance',on:'ヨウ',ku:'さま',lv:'N4',st:14,cat:'other',rad:'木',mn:'Wood + sheep = appearance',ex:[{w:'様子',r:'ようす',e:'appearance / situation'},{w:'お客様',r:'おきゃくさま',e:'customer / guest'}]},
  {id:1025,k:'親',m:'parent / close',on:'シン',ku:'おや・した-',lv:'N4',st:16,cat:'person',rad:'見',mn:'Stand + tree + see = parent',ex:[{w:'親',r:'おや',e:'parent'},{w:'親切',r:'しんせつ',e:'kindness'}]},
  {id:1026,k:'祖',m:'ancestor',on:'ソ',ku:'',lv:'N4',st:9,cat:'person',rad:'示',mn:'Altar + earth = ancestor',ex:[{w:'祖父',r:'そふ',e:'grandfather'},{w:'祖母',r:'そぼ',e:'grandmother'}]},
  {id:1027,k:'孫',m:'grandchild',on:'ソン',ku:'まご',lv:'N4',st:10,cat:'person',rad:'子',mn:'Child + thread = grandchild',ex:[{w:'孫',r:'まご',e:'grandchild'},{w:'子孫',r:'しそん',e:'descendants'}]},
  {id:1028,k:'夢',m:'dream',on:'ム',ku:'ゆめ',lv:'N4',st:13,cat:'feeling',rad:'夕',mn:'Evening + cover = dream',ex:[{w:'夢',r:'ゆめ',e:'dream'},{w:'夢中',r:'むちゅう',e:'absorbed / crazy about'}]},
  {id:1029,k:'涙',m:'tears',on:'ルイ',ku:'なみだ',lv:'N4',st:10,cat:'feeling',rad:'水',mn:'Water + 戻 = tears',ex:[{w:'涙',r:'なみだ',e:'tears'},{w:'涙声',r:'なみだごえ',e:'tearful voice'}]},
  {id:1030,k:'祈',m:'pray',on:'キ',ku:'いの-',lv:'N4',st:8,cat:'action',rad:'示',mn:'Altar + axe = pray',ex:[{w:'祈る',r:'いのる',e:'to pray'},{w:'祈願',r:'きがん',e:'prayer'}]},
  {id:1031,k:'探',m:'search / seek',on:'タン',ku:'さが-・さぐ-',lv:'N4',st:11,cat:'action',rad:'手',mn:'Hand + deep = search',ex:[{w:'探す',r:'さがす',e:'to search'},{w:'探偵',r:'たんてい',e:'detective'}]},
  {id:1032,k:'叫',m:'shout / cry out',on:'キョウ',ku:'さけ-',lv:'N4',st:6,cat:'action',rad:'口',mn:'Mouth + twist = shout',ex:[{w:'叫ぶ',r:'さけぶ',e:'to shout'},{w:'絶叫',r:'ぜっきょう',e:'scream'}]},
  {id:1033,k:'驚',m:'surprised / astonished',on:'キョウ',ku:'おどろ-',lv:'N4',st:22,cat:'feeling',rad:'馬',mn:'Horse + respect = astonished',ex:[{w:'驚く',r:'おどろく',e:'to be surprised'},{w:'驚き',r:'おどろき',e:'surprise'}]},
  {id:1034,k:'慌',m:'panic / confused',on:'コウ',ku:'あわ-',lv:'N4',st:12,cat:'feeling',rad:'心',mn:'Heart + bright = panic',ex:[{w:'慌てる',r:'あわてる',e:'to panic'},{w:'慌ただしい',r:'あわただしい',e:'hectic'}]},
  {id:1035,k:'嬉',m:'glad / happy',on:'キ',ku:'うれ-',lv:'N4',st:15,cat:'feeling',rad:'女',mn:'Woman + pleasure = glad',ex:[{w:'嬉しい',r:'うれしい',e:'glad / happy'},{w:'嬉しさ',r:'うれしさ',e:'happiness'}]},
  {id:1036,k:'恥',m:'shame',on:'チ',ku:'は-・はじ',lv:'N4',st:10,cat:'feeling',rad:'心',mn:'Ear + heart = shame',ex:[{w:'恥ずかしい',r:'はずかしい',e:'embarrassing'},{w:'恥',r:'はじ',e:'shame'}]},
  {id:1037,k:'珍',m:'rare / unusual',on:'チン',ku:'めずら-',lv:'N4',st:9,cat:'description',rad:'玉',mn:'Jewel + split = rare',ex:[{w:'珍しい',r:'めずらしい',e:'rare / unusual'},{w:'珍品',r:'ちんぴん',e:'rare item'}]},
  {id:1038,k:'若',m:'young',on:'ジャク・ニャク',ku:'わか-・も-',lv:'N4',st:8,cat:'description',rad:'艸',mn:'Grass + right = young',ex:[{w:'若い',r:'わかい',e:'young'},{w:'若者',r:'わかもの',e:'young person'}]},
  {id:1039,k:'偉',m:'great / admirable',on:'イ',ku:'えら-',lv:'N4',st:12,cat:'description',rad:'人',mn:'Person + strange = great',ex:[{w:'偉い',r:'えらい',e:'great / admirable'},{w:'偉大',r:'いだい',e:'greatness'}]},
  {id:1040,k:'厳',m:'strict / severe',on:'ゲン・ゴン',ku:'きび-・おごそ-',lv:'N4',st:17,cat:'description',rad:'厂',mn:'Cliff + many = severe',ex:[{w:'厳しい',r:'きびしい',e:'strict'},{w:'厳格',r:'げんかく',e:'strictness'}]},
  {id:1041,k:'握',m:'grip / hold',on:'アク',ku:'にぎ-',lv:'N3',st:12,cat:'action',rad:'手',mn:'Hand + I = grip',ex:[{w:'握る',r:'にぎる',e:'to grip'},{w:'握手',r:'あくしゅ',e:'handshake'}]},
  {id:1042,k:'扱',m:'handle / treat',on:'キュウ・コウ',ku:'あつか-',lv:'N3',st:6,cat:'action',rad:'手',mn:'Hand + reach = handle',ex:[{w:'扱う',r:'あつかう',e:'to handle'},{w:'取り扱い',r:'とりあつかい',e:'handling'}]},
  {id:1043,k:'依',m:'rely on / according to',on:'イ',ku:'よ-',lv:'N3',st:8,cat:'action',rad:'人',mn:'Person + clothing = rely on',ex:[{w:'依頼',r:'いらい',e:'request'},{w:'依存',r:'いぞん',e:'dependence'}]},
  {id:1044,k:'域',m:'area / region',on:'イキ',ku:'',lv:'N3',st:11,cat:'place',rad:'土',mn:'Earth + weapon + area = region',ex:[{w:'地域',r:'ちいき',e:'region'},{w:'域外',r:'いきがい',e:'outside the area'}]},
  {id:1045,k:'因',m:'cause / reason',on:'イン',ku:'よ-',lv:'N3',st:6,cat:'other',rad:'囗',mn:'Box + big = cause',ex:[{w:'原因',r:'げんいん',e:'cause'},{w:'因果',r:'いんが',e:'cause and effect'}]},
  {id:1046,k:'隠',m:'hide / conceal',on:'イン',ku:'かく-',lv:'N3',st:14,cat:'action',rad:'阜',mn:'Mound + hand + heart = hide',ex:[{w:'隠す',r:'かくす',e:'to hide'},{w:'隠れる',r:'かくれる',e:'to be hidden'}]},
  {id:1047,k:'宇',m:'eave / universe',on:'ウ',ku:'',lv:'N3',st:6,cat:'other',rad:'宀',mn:'Roof + around = universe',ex:[{w:'宇宙',r:'うちゅう',e:'universe'},{w:'宇宙人',r:'うちゅうじん',e:'alien'}]},
  {id:1048,k:'衛',m:'guard / defend',on:'エイ',ku:'まも-',lv:'N3',st:16,cat:'action',rad:'行',mn:'Walk + guard = defend',ex:[{w:'衛星',r:'えいせい',e:'satellite'},{w:'防衛',r:'ぼうえい',e:'defense'}]},
  {id:1049,k:'援',m:'aid / support',on:'エン',ku:'',lv:'N3',st:12,cat:'action',rad:'手',mn:'Hand + extend = aid',ex:[{w:'支援',r:'しえん',e:'support'},{w:'援助',r:'えんじょ',e:'aid'}]},
  {id:1050,k:'汚',m:'dirty',on:'オ',ku:'よご-',lv:'N3',st:6,cat:'description',rad:'水',mn:'Water + upon = dirty',ex:[{w:'汚れる',r:'よごれる',e:'to get dirty'},{w:'汚染',r:'おせん',e:'contamination'}]},
  {id:1051,k:'奥',m:'interior / deep',on:'オウ',ku:'おく',lv:'N3',st:12,cat:'place',rad:'大',mn:'Reach inside = interior',ex:[{w:'奥',r:'おく',e:'interior / back'},{w:'奥さん',r:'おくさん',e:'wife / ma\'am'}]},
  {id:1052,k:'億',m:'100 million',on:'オク',ku:'',lv:'N3',st:15,cat:'number',rad:'人',mn:'Person + idea = 100 million',ex:[{w:'億',r:'おく',e:'100 million'},{w:'何億',r:'なんおく',e:'hundreds of millions'}]},
  {id:1053,k:'卸',m:'wholesale',on:'シャ',ku:'おろ-',lv:'N3',st:9,cat:'other',rad:'卩',mn:'Seal + self = wholesale',ex:[{w:'卸す',r:'おろす',e:'to wholesale'},{w:'卸売り',r:'おろしうり',e:'wholesale'}]},
  {id:1054,k:'賢',m:'wise / clever',on:'ケン',ku:'かしこ-',lv:'N3',st:16,cat:'description',rad:'貝',mn:'Shell + hard + seen = wise',ex:[{w:'賢い',r:'かしこい',e:'wise'},{w:'賢者',r:'けんじゃ',e:'wise person'}]},
  {id:1055,k:'軒',m:'eave / house counter',on:'ケン',ku:'のき',lv:'N3',st:10,cat:'other',rad:'車',mn:'Cart + dry = eave',ex:[{w:'軒',r:'のき',e:'eave'},{w:'一軒家',r:'いっけんや',e:'detached house'}]},
  {id:1056,k:'幸',m:'happiness',on:'コウ',ku:'しあわ-・さち',lv:'N3',st:8,cat:'feeling',rad:'土',mn:'Earth + standing = happiness',ex:[{w:'幸せ',r:'しあわせ',e:'happiness'},{w:'幸運',r:'こううん',e:'good luck'}]},
  {id:1057,k:'混',m:'mix / confuse',on:'コン',ku:'ま-',lv:'N3',st:11,cat:'action',rad:'水',mn:'Water + elder brother = mix',ex:[{w:'混ぜる',r:'まぜる',e:'to mix'},{w:'混雑',r:'こんざつ',e:'congestion'}]},
  {id:1058,k:'再',m:'again / re-',on:'サイ・サ',ku:'ふたた-',lv:'N3',st:6,cat:'other',rad:'冂',mn:'Two + one = again',ex:[{w:'再び',r:'ふたたび',e:'again'},{w:'再開',r:'さいかい',e:'resumption'}]},
  {id:1059,k:'採',m:'pick / adopt',on:'サイ',ku:'と-',lv:'N3',st:11,cat:'action',rad:'手',mn:'Hand + tree + claw = pick',ex:[{w:'採る',r:'とる',e:'to pick'},{w:'採用',r:'さいよう',e:'adoption / hiring'}]},
  {id:1060,k:'察',m:'guess / inspect',on:'サツ',ku:'',lv:'N3',st:14,cat:'action',rad:'宀',mn:'Roof + sacrifice = inspect',ex:[{w:'観察',r:'かんさつ',e:'observation'},{w:'察する',r:'さっする',e:'to guess'}]},
  {id:1061,k:'刷',m:'print / brush',on:'サツ',ku:'す-',lv:'N3',st:8,cat:'action',rad:'刀',mn:'Knife + cloth = print',ex:[{w:'印刷',r:'いんさつ',e:'printing'},{w:'刷る',r:'する',e:'to print'}]},
  {id:1062,k:'殺',m:'kill',on:'サツ・セツ',ku:'ころ-',lv:'N3',st:10,cat:'action',rad:'殳',mn:'Lance + tree = kill',ex:[{w:'殺す',r:'ころす',e:'to kill'},{w:'殺人',r:'さつじん',e:'murder'}]},
  {id:1063,k:'酸',m:'acid / sour',on:'サン',ku:'す-',lv:'N3',st:14,cat:'other',rad:'酉',mn:'Wine + mountain = sour',ex:[{w:'酸素',r:'さんそ',e:'oxygen'},{w:'酸っぱい',r:'すっぱい',e:'sour'}]},
  {id:1064,k:'刺',m:'stab / pierce',on:'シ',ku:'さ-・とげ',lv:'N3',st:8,cat:'action',rad:'刀',mn:'Knife + bundle = stab',ex:[{w:'刺す',r:'さす',e:'to stab'},{w:'刺激',r:'しげき',e:'stimulation'}]},
  {id:1065,k:'誌',m:'magazine / record',on:'シ',ku:'',lv:'N3',st:14,cat:'other',rad:'言',mn:'Words + will = record',ex:[{w:'雑誌',r:'ざっし',e:'magazine'},{w:'日誌',r:'にっし',e:'diary'}]},
  {id:1066,k:'射',m:'shoot / radiate',on:'シャ',ku:'い-',lv:'N3',st:10,cat:'action',rad:'寸',mn:'Body + inch = shoot',ex:[{w:'射る',r:'いる',e:'to shoot'},{w:'注射',r:'ちゅうしゃ',e:'injection'}]},
  {id:1067,k:'捨',m:'throw away',on:'シャ',ku:'す-',lv:'N3',st:11,cat:'action',rad:'手',mn:'Hand + many = throw away',ex:[{w:'捨てる',r:'すてる',e:'to throw away'},{w:'捨て身',r:'すてみ',e:'self-sacrifice'}]},
  {id:1068,k:'縮',m:'shrink / reduce',on:'シュク',ku:'ちぢ-',lv:'N3',st:17,cat:'action',rad:'糸',mn:'Thread + compress = shrink',ex:[{w:'縮む',r:'ちぢむ',e:'to shrink'},{w:'短縮',r:'たんしゅく',e:'shortening'}]},
  {id:1069,k:'術',m:'art / technique',on:'ジュツ',ku:'',lv:'N3',st:11,cat:'art',rad:'行',mn:'Walk + millet = technique',ex:[{w:'技術',r:'ぎじゅつ',e:'technology'},{w:'手術',r:'しゅじゅつ',e:'surgery'}]},
  {id:1070,k:'述',m:'mention / state',on:'ジュツ',ku:'の-',lv:'N3',st:8,cat:'action',rad:'辵',mn:'Walk + axle = state',ex:[{w:'述べる',r:'のべる',e:'to state'},{w:'記述',r:'きじゅつ',e:'description'}]},
  {id:1071,k:'純',m:'pure / innocent',on:'ジュン',ku:'',lv:'N3',st:10,cat:'description',rad:'糸',mn:'Thread + river = pure',ex:[{w:'純粋',r:'じゅんすい',e:'pure'},{w:'純白',r:'じゅんぱく',e:'pure white'}]},
  {id:1072,k:'署',m:'station / sign',on:'ショ',ku:'',lv:'N3',st:13,cat:'place',rad:'网',mn:'Net + person = station',ex:[{w:'警察署',r:'けいさつしょ',e:'police station'},{w:'署名',r:'しょめい',e:'signature'}]},
  {id:1073,k:'諸',m:'various / all',on:'ショ',ku:'もろ',lv:'N3',st:15,cat:'other',rad:'言',mn:'Words + person = various',ex:[{w:'諸国',r:'しょこく',e:'various countries'},{w:'諸問題',r:'しょもんだい',e:'various problems'}]},
  {id:1074,k:'触',m:'touch / contact',on:'ショク',ku:'ふ-・さわ-',lv:'N3',st:13,cat:'action',rad:'角',mn:'Horn + insect = touch',ex:[{w:'触れる',r:'ふれる',e:'to touch'},{w:'接触',r:'せっしょく',e:'contact'}]},
  {id:1075,k:'伸',m:'stretch / extend',on:'シン',ku:'の-',lv:'N3',st:7,cat:'action',rad:'人',mn:'Person + report = stretch',ex:[{w:'伸びる',r:'のびる',e:'to stretch'},{w:'伸ばす',r:'のばす',e:'to extend'}]},
  {id:1076,k:'侵',m:'invade',on:'シン',ku:'おか-',lv:'N3',st:9,cat:'action',rad:'人',mn:'Person + broom = invade',ex:[{w:'侵略',r:'しんりゃく',e:'invasion'},{w:'侵入',r:'しんにゅう',e:'intrusion'}]},
  {id:1077,k:'震',m:'tremble / shake',on:'シン',ku:'ふる-',lv:'N3',st:15,cat:'action',rad:'雨',mn:'Rain + battle = tremble',ex:[{w:'震える',r:'ふるえる',e:'to tremble'},{w:'地震',r:'じしん',e:'earthquake'}]},
  {id:1078,k:'推',m:'push / recommend',on:'スイ',ku:'お-',lv:'N3',st:11,cat:'action',rad:'手',mn:'Hand + bird = push / recommend',ex:[{w:'推薦',r:'すいせん',e:'recommendation'},{w:'推測',r:'すいそく',e:'guess'}]},
  {id:1079,k:'酔',m:'drunk',on:'スイ',ku:'よ-',lv:'N3',st:11,cat:'action',rad:'酉',mn:'Wine + soldier = drunk',ex:[{w:'酔う',r:'よう',e:'to get drunk'},{w:'泥酔',r:'でいすい',e:'dead drunk'}]},
  {id:1080,k:'素',m:'element / plain',on:'ソ・ス',ku:'',lv:'N3',st:10,cat:'other',rad:'糸',mn:'Thread + tree = element',ex:[{w:'素材',r:'そざい',e:'material'},{w:'素直',r:'すなお',e:'honest / gentle'}]},
  {id:1081,k:'増',m:'increase',on:'ゾウ',ku:'ふ-・ま-',lv:'N3',st:14,cat:'action',rad:'土',mn:'Earth + many layers = increase',ex:[{w:'増える',r:'ふえる',e:'to increase'},{w:'増加',r:'ぞうか',e:'increase'}]},
  {id:1082,k:'測',m:'measure',on:'ソク',ku:'はか-',lv:'N3',st:12,cat:'action',rad:'水',mn:'Water + side = measure',ex:[{w:'測る',r:'はかる',e:'to measure'},{w:'測定',r:'そくてい',e:'measurement'}]},
  {id:1083,k:'損',m:'damage / loss',on:'ソン',ku:'そこ-',lv:'N3',st:13,cat:'action',rad:'手',mn:'Hand + employee = damage',ex:[{w:'損する',r:'そんする',e:'to lose'},{w:'損害',r:'そんがい',e:'damage'}]},
  {id:1084,k:'帯',m:'belt / carry',on:'タイ',ku:'お-',lv:'N3',st:10,cat:'other',rad:'巾',mn:'Cloth + river = belt',ex:[{w:'帯',r:'おび',e:'belt / sash'},{w:'地帯',r:'ちたい',e:'zone / belt'}]},
  {id:1085,k:'逮',m:'arrest',on:'タイ',ku:'',lv:'N3',st:11,cat:'action',rad:'辵',mn:'Walk + reach = arrest',ex:[{w:'逮捕',r:'たいほ',e:'arrest'},{w:'逮捕状',r:'たいほじょう',e:'arrest warrant'}]},
  {id:1086,k:'断',m:'cut off / refuse',on:'ダン',ku:'た-・ことわ-',lv:'N3',st:11,cat:'action',rad:'斤',mn:'Axe + rice = cut off',ex:[{w:'断る',r:'ことわる',e:'to refuse'},{w:'断言',r:'だんげん',e:'assertion'}]},
  {id:1087,k:'痴',m:'foolish / senile',on:'チ',ku:'',lv:'N3',st:13,cat:'description',rad:'疒',mn:'Sickbed + know = foolish',ex:[{w:'痴呆',r:'ちほう',e:'dementia'},{w:'痴漢',r:'ちかん',e:'groper'}]},
  {id:1088,k:'蓄',m:'store up / save',on:'チク',ku:'たくわ-',lv:'N3',st:13,cat:'action',rad:'艸',mn:'Grass + animal = store up',ex:[{w:'蓄積',r:'ちくせき',e:'accumulation'},{w:'貯蓄',r:'ちょちく',e:'savings'}]},
  {id:1089,k:'著',m:'conspicuous / write',on:'チョ・チャク',ku:'いちじる-・あらわ-',lv:'N3',st:11,cat:'action',rad:'艸',mn:'Grass + person = write / conspicuous',ex:[{w:'著書',r:'ちょしょ',e:'one\'s book'},{w:'著しい',r:'いちじるしい',e:'remarkable'}]},
  {id:1090,k:'徴',m:'sign / levy',on:'チョウ',ku:'',lv:'N3',st:14,cat:'other',rad:'彳',mn:'Walk + king + beat = sign',ex:[{w:'特徴',r:'とくちょう',e:'characteristic'},{w:'徴収',r:'ちょうしゅう',e:'collection / levy'}]},
  {id:1091,k:'提',m:'present / lift',on:'テイ',ku:'さ-',lv:'N3',st:12,cat:'action',rad:'手',mn:'Hand + correct = present',ex:[{w:'提案',r:'ていあん',e:'proposal'},{w:'提供',r:'ていきょう',e:'provision'}]},
  {id:1092,k:'停',m:'stop / halt',on:'テイ',ku:'',lv:'N3',st:11,cat:'action',rad:'人',mn:'Person + pavilion = stop',ex:[{w:'停止',r:'ていし',e:'stop'},{w:'停車',r:'ていしゃ',e:'stopping a vehicle'}]},
  {id:1093,k:'適',m:'suitable / fit',on:'テキ',ku:'',lv:'N3',st:14,cat:'description',rad:'辵',mn:'Walk + enemy = suitable',ex:[{w:'適切',r:'てきせつ',e:'appropriate'},{w:'適当',r:'てきとう',e:'suitable'}]},
  {id:1094,k:'展',m:'unfold / exhibition',on:'テン',ku:'',lv:'N3',st:10,cat:'other',rad:'尸',mn:'Body + unfold = unfold',ex:[{w:'展覧会',r:'てんらんかい',e:'exhibition'},{w:'発展',r:'はってん',e:'development'}]},
  {id:1095,k:'党',m:'party / faction',on:'トウ',ku:'',lv:'N3',st:10,cat:'other',rad:'黒',mn:'Black + elder = party',ex:[{w:'政党',r:'せいとう',e:'political party'},{w:'与党',r:'よとう',e:'ruling party'}]},
  {id:1096,k:'討',m:'attack / discuss',on:'トウ',ku:'う-',lv:'N3',st:10,cat:'action',rad:'言',mn:'Words + inch = attack',ex:[{w:'討論',r:'とうろん',e:'debate'},{w:'検討',r:'けんとう',e:'examination'}]},
  {id:1097,k:'得',m:'gain / acquire',on:'トク',ku:'え-・う-',lv:'N3',st:11,cat:'action',rad:'彳',mn:'Walk + shell = gain',ex:[{w:'得る',r:'える',e:'to gain'},{w:'得意',r:'とくい',e:'good at'}]},
  {id:1098,k:'毒',m:'poison',on:'ドク',ku:'',lv:'N3',st:8,cat:'other',rad:'母',mn:'Mother + plant = poison',ex:[{w:'毒',r:'どく',e:'poison'},{w:'中毒',r:'ちゅうどく',e:'poisoning'}]},
  {id:1099,k:'奈',m:'what? (exclamation)',on:'ナ・ナイ',ku:'',lv:'N3',st:8,cat:'other',rad:'大',mn:'Big + tree = what?',ex:[{w:'奈良',r:'なら',e:'Nara (place)'},{w:'奈落',r:'ならく',e:'abyss'}]},
  {id:1100,k:'難',m:'difficult / hard',on:'ナン',ku:'むずか-・かた-',lv:'N3',st:18,cat:'description',rad:'隹',mn:'Bird + clay = difficult',ex:[{w:'難しい',r:'むずかしい',e:'difficult'},{w:'困難',r:'こんなん',e:'difficulty'}]},
  {id:1101,k:'任',m:'duty / appoint',on:'ニン',ku:'まか-',lv:'N3',st:6,cat:'action',rad:'人',mn:'Person + stretch = appoint',ex:[{w:'任せる',r:'まかせる',e:'to entrust'},{w:'責任',r:'せきにん',e:'responsibility'}]},
  {id:1102,k:'認',m:'recognize / admit',on:'ニン',ku:'みと-',lv:'N3',st:14,cat:'action',rad:'言',mn:'Words + endure = recognize',ex:[{w:'認める',r:'みとめる',e:'to recognize'},{w:'確認',r:'かくにん',e:'confirmation'}]},
  {id:1103,k:'脳',m:'brain',on:'ノウ',ku:'',lv:'N3',st:11,cat:'body',rad:'月',mn:'Body + crown = brain',ex:[{w:'脳',r:'のう',e:'brain'},{w:'頭脳',r:'ずのう',e:'brainpower'}]},
  {id:1104,k:'敗',m:'defeat / fail',on:'ハイ',ku:'やぶ-',lv:'N3',st:11,cat:'action',rad:'攴',mn:'Shell + strike = defeat',ex:[{w:'敗れる',r:'やぶれる',e:'to be defeated'},{w:'失敗',r:'しっぱい',e:'failure'}]},
  {id:1105,k:'輩',m:'comrade / fellow',on:'ハイ',ku:'やから',lv:'N3',st:15,cat:'person',rad:'車',mn:'Cart + non = fellow',ex:[{w:'先輩',r:'せんぱい',e:'senior'},{w:'後輩',r:'こうはい',e:'junior'}]},
  {id:1106,k:'爆',m:'explode',on:'バク',ku:'',lv:'N3',st:19,cat:'action',rad:'火',mn:'Fire + burst = explode',ex:[{w:'爆発',r:'ばくはつ',e:'explosion'},{w:'爆弾',r:'ばくだん',e:'bomb'}]},
  {id:1107,k:'抜',m:'extract / surpass',on:'バツ',ku:'ぬ-',lv:'N3',st:7,cat:'action',rad:'手',mn:'Hand + friend = extract',ex:[{w:'抜く',r:'ぬく',e:'to extract'},{w:'抜け出る',r:'ぬけでる',e:'to get out'}]},
  {id:1108,k:'犯',m:'crime / offend',on:'ハン',ku:'おか-',lv:'N3',st:5,cat:'other',rad:'犬',mn:'Dog + roll = crime',ex:[{w:'犯罪',r:'はんざい',e:'crime'},{w:'犯人',r:'はんにん',e:'criminal'}]},
  {id:1109,k:'比',m:'compare / ratio',on:'ヒ',ku:'くら-',lv:'N3',st:4,cat:'action',rad:'匕',mn:'Two spoons side by side = compare',ex:[{w:'比べる',r:'くらべる',e:'to compare'},{w:'比率',r:'ひりつ',e:'ratio'}]},
  {id:1110,k:'批',m:'criticize',on:'ヒ',ku:'',lv:'N3',st:7,cat:'action',rad:'手',mn:'Hand + compare = criticize',ex:[{w:'批判',r:'ひはん',e:'criticism'},{w:'批評',r:'ひひょう',e:'critique'}]},
  {id:1111,k:'避',m:'avoid / escape',on:'ヒ',ku:'さ-',lv:'N3',st:16,cat:'action',rad:'辵',mn:'Walk + crime = avoid',ex:[{w:'避ける',r:'さける',e:'to avoid'},{w:'回避',r:'かいひ',e:'avoidance'}]},
  {id:1112,k:'評',m:'assess / comment',on:'ヒョウ',ku:'',lv:'N3',st:12,cat:'action',rad:'言',mn:'Words + equal = assess',ex:[{w:'評価',r:'ひょうか',e:'evaluation'},{w:'批評',r:'ひひょう',e:'critique'}]},
  {id:1113,k:'貧',m:'poor / poverty',on:'ヒン・ビン',ku:'まず-',lv:'N3',st:11,cat:'other',rad:'貝',mn:'Shell + divide = poor',ex:[{w:'貧しい',r:'まずしい',e:'poor'},{w:'貧困',r:'ひんこん',e:'poverty'}]},
  {id:1114,k:'普',m:'general / widespread',on:'フ',ku:'',lv:'N3',st:12,cat:'description',rad:'日',mn:'Sun + side by side = widespread',ex:[{w:'普通',r:'ふつう',e:'ordinary'},{w:'普及',r:'ふきゅう',e:'spread / diffusion'}]},
  {id:1115,k:'浮',m:'float',on:'フ',ku:'う-',lv:'N3',st:10,cat:'action',rad:'水',mn:'Water + child = float',ex:[{w:'浮く',r:'うく',e:'to float'},{w:'浮かぶ',r:'うかぶ',e:'to come to mind'}]},
  {id:1116,k:'変',m:'change / strange',on:'ヘン',ku:'か-',lv:'N3',st:9,cat:'action',rad:'夂',mn:'Walk + thread = change',ex:[{w:'変わる',r:'かわる',e:'to change'},{w:'変化',r:'へんか',e:'change'}]},
  {id:1117,k:'保',m:'protect / keep',on:'ホ',ku:'たも-',lv:'N3',st:9,cat:'action',rad:'人',mn:'Person + tree = protect',ex:[{w:'保つ',r:'たもつ',e:'to maintain'},{w:'保護',r:'ほご',e:'protection'}]},
  {id:1118,k:'報',m:'report / repay',on:'ホウ',ku:'むく-',lv:'N3',st:12,cat:'action',rad:'土',mn:'Earth + hand = repay',ex:[{w:'報告',r:'ほうこく',e:'report'},{w:'情報',r:'じょうほう',e:'information'}]},
  {id:1119,k:'豊',m:'abundant / rich',on:'ホウ',ku:'ゆた-',lv:'N3',st:18,cat:'description',rad:'豆',mn:'Bean + drum = abundant',ex:[{w:'豊か',r:'ゆたか',e:'abundant'},{w:'豊富',r:'ほうふ',e:'richness'}]},
  {id:1120,k:'膨',m:'swell / expand',on:'ボウ',ku:'ふく-',lv:'N3',st:16,cat:'action',rad:'月',mn:'Body + drum = swell',ex:[{w:'膨らむ',r:'ふくらむ',e:'to swell'},{w:'膨大',r:'ぼうだい',e:'enormous'}]},
  {id:1121,k:'盛',m:'prosper / heap up',on:'セイ',ku:'も-・さか-',lv:'N3',st:11,cat:'action',rad:'皿',mn:'Dish + become = prosper',ex:[{w:'盛る',r:'もる',e:'to heap up'},{w:'繁盛',r:'はんじょう',e:'prosperity'}]},
  {id:1122,k:'誠',m:'sincerity',on:'セイ',ku:'まこと',lv:'N3',st:13,cat:'feeling',rad:'言',mn:'Words + become = sincerity',ex:[{w:'誠実',r:'せいじつ',e:'sincere'},{w:'誠意',r:'せいい',e:'sincerity'}]},
  {id:1123,k:'禁',m:'forbid / prohibit',on:'キン',ku:'',lv:'N3',st:13,cat:'action',rad:'示',mn:'Altar + forest = forbid',ex:[{w:'禁止',r:'きんし',e:'prohibition'},{w:'禁煙',r:'きんえん',e:'no smoking'}]},
  {id:1124,k:'敬',m:'respect',on:'ケイ',ku:'うやま-',lv:'N3',st:12,cat:'feeling',rad:'攴',mn:'Strike + sheep = respect',ex:[{w:'敬語',r:'けいご',e:'honorific language'},{w:'尊敬',r:'そんけい',e:'respect'}]},
  {id:1125,k:'激',m:'violent / extreme',on:'ゲキ',ku:'はげ-',lv:'N3',st:16,cat:'description',rad:'水',mn:'Water + white + beat = violent',ex:[{w:'激しい',r:'はげしい',e:'violent / intense'},{w:'激励',r:'げきれい',e:'encouragement'}]},
  {id:1126,k:'絶',m:'cut off / cease',on:'ゼツ',ku:'た-',lv:'N3',st:12,cat:'action',rad:'糸',mn:'Thread + color = cut off',ex:[{w:'絶える',r:'たえる',e:'to cease'},{w:'絶対',r:'ぜったい',e:'absolute'}]},
  {id:1127,k:'存',m:'exist / know',on:'ソン・ゾン',ku:'',lv:'N3',st:6,cat:'other',rad:'子',mn:'Child + spoon = exist',ex:[{w:'存在',r:'そんざい',e:'existence'},{w:'存知',r:'ぞんじ',e:'knowing (polite)'}]},
  {id:1128,k:'弱',m:'weak',on:'ジャク',ku:'よわ-',lv:'N3',st:10,cat:'description',rad:'弓',mn:'Two weak bows = weak',ex:[{w:'弱い',r:'よわい',e:'weak'},{w:'弱点',r:'じゃくてん',e:'weak point'}]},
  {id:1129,k:'末',m:'end / tip',on:'マツ・バツ',ku:'すえ',lv:'N3',st:5,cat:'other',rad:'木',mn:'Tree with top mark = tip',ex:[{w:'末',r:'すえ',e:'end'},{w:'週末',r:'しゅうまつ',e:'weekend'}]},
  {id:1130,k:'望',m:'hope / gaze',on:'ボウ・モウ',ku:'のぞ-',lv:'N3',st:11,cat:'feeling',rad:'月',mn:'Moon + king + look = hope',ex:[{w:'望む',r:'のぞむ',e:'to hope'},{w:'希望',r:'きぼう',e:'hope'}]},
  {id:1131,k:'幅',m:'width',on:'フク',ku:'はば',lv:'N3',st:12,cat:'other',rad:'巾',mn:'Cloth + fortune = width',ex:[{w:'幅',r:'はば',e:'width'},{w:'幅広い',r:'はばひろい',e:'wide-ranging'}]},
  {id:1132,k:'愛',m:'love / affection',on:'アイ',ku:'',lv:'N2',st:13,cat:'feeling',rad:'心',mn:'Heart + receive = love',ex:[{w:'愛',r:'あい',e:'love'},{w:'愛情',r:'あいじょう',e:'affection'}]},
  {id:1133,k:'暖',m:'warm (weather)',on:'ダン',ku:'あたた-',lv:'N2',st:13,cat:'description',rad:'日',mn:'Sun + warm = warm',ex:[{w:'暖かい',r:'あたたかい',e:'warm'},{w:'温暖',r:'おんだん',e:'warm climate'}]},
  {id:1134,k:'威',m:'intimidate / dignity',on:'イ',ku:'',lv:'N2',st:9,cat:'other',rad:'女',mn:'Woman + weapon = intimidate',ex:[{w:'威張る',r:'いばる',e:'to be arrogant'},{w:'権威',r:'けんい',e:'authority'}]},
  {id:1135,k:'胃',m:'stomach',on:'イ',ku:'',lv:'N2',st:9,cat:'body',rad:'月',mn:'Field + body = stomach',ex:[{w:'胃',r:'い',e:'stomach'},{w:'胃腸',r:'いちょう',e:'stomach and intestines'}]},
  {id:1136,k:'緯',m:'latitude / horizontal',on:'イ',ku:'',lv:'N2',st:16,cat:'other',rad:'糸',mn:'Thread + officer = latitude',ex:[{w:'緯度',r:'いど',e:'latitude'},{w:'経緯',r:'いきさつ',e:'details / circumstances'}]},
  {id:1137,k:'浦',m:'bay / inlet',on:'ホ',ku:'うら',lv:'N2',st:10,cat:'place',rad:'水',mn:'Water + wide = bay',ex:[{w:'浦',r:'うら',e:'bay / inlet'},{w:'浦風',r:'うらかぜ',e:'sea breeze'}]},
  {id:1138,k:'鋭',m:'sharp / keen',on:'エイ',ku:'するど-',lv:'N2',st:15,cat:'description',rad:'金',mn:'Metal + exchange = sharp',ex:[{w:'鋭い',r:'するどい',e:'sharp'},{w:'鋭利',r:'えいり',e:'sharp / acute'}]},
  {id:1139,k:'円滑',m:'smooth',on:'エンカツ',ku:'',lv:'N2',st:0,cat:'description',rad:'',mn:'',ex:[{w:'円滑',r:'えんかつ',e:'smooth'},{w:'円滑化',r:'えんかつか',e:'smoothing'}]},
  {id:1140,k:'凡',m:'ordinary / mediocre',on:'ボン・ハン',ku:'',lv:'N2',st:3,cat:'description',rad:'几',mn:'Small table = ordinary',ex:[{w:'平凡',r:'へいぼん',e:'ordinary'},{w:'非凡',r:'ひぼん',e:'extraordinary'}]},
  {id:1141,k:'奪',m:'seize / rob',on:'ダツ',ku:'うば-',lv:'N2',st:14,cat:'action',rad:'大',mn:'Big + bird + inch = seize',ex:[{w:'奪う',r:'うばう',e:'to seize'},{w:'略奪',r:'りゃくだつ',e:'plunder'}]},
  {id:1142,k:'鈍',m:'dull / slow',on:'ドン',ku:'にぶ-',lv:'N2',st:12,cat:'description',rad:'金',mn:'Metal + retreat = dull',ex:[{w:'鈍い',r:'にぶい',e:'dull'},{w:'鈍感',r:'どんかん',e:'insensitivity'}]},
  {id:1143,k:'縁',m:'edge / fate',on:'エン',ku:'ふち',lv:'N2',st:15,cat:'other',rad:'糸',mn:'Thread + pig = edge / fate',ex:[{w:'縁',r:'えん',e:'fate / edge'},{w:'縁側',r:'えんがわ',e:'veranda'}]},
  {id:1144,k:'炎',m:'flame',on:'エン',ku:'ほのお',lv:'N2',st:8,cat:'nature',rad:'火',mn:'Two fires = flame',ex:[{w:'炎',r:'ほのお',e:'flame'},{w:'炎症',r:'えんしょう',e:'inflammation'}]},
  {id:1145,k:'汚染',m:'contamination',on:'オセン',ku:'',lv:'N2',st:0,cat:'other',rad:'',mn:'',ex:[{w:'汚染',r:'おせん',e:'contamination'},{w:'汚染物質',r:'おせんぶっしつ',e:'pollutant'}]},
  {id:1146,k:'穏',m:'calm / gentle',on:'オン',ku:'おだ-',lv:'N2',st:16,cat:'description',rad:'禾',mn:'Grain + heart = calm',ex:[{w:'穏やか',r:'おだやか',e:'calm'},{w:'穏健',r:'おんけん',e:'moderate'}]},
  {id:1147,k:'嫁',m:'bride / marry into',on:'カ',ku:'よめ・とつ-',lv:'N2',st:13,cat:'person',rad:'女',mn:'Woman + house = bride',ex:[{w:'嫁',r:'よめ',e:'bride'},{w:'嫁ぐ',r:'とつぐ',e:'to marry (woman)'}]},
  {id:1148,k:'菓',m:'sweet / confectionery',on:'カ',ku:'',lv:'N2',st:11,cat:'food',rad:'艸',mn:'Grass + fruit = sweet',ex:[{w:'菓子',r:'かし',e:'confectionery'},{w:'和菓子',r:'わがし',e:'Japanese sweets'}]},
  {id:1149,k:'寡',m:'few / widow',on:'カ',ku:'',lv:'N2',st:14,cat:'description',rad:'宀',mn:'Roof + divided = few',ex:[{w:'寡黙',r:'かもく',e:'taciturn'},{w:'寡婦',r:'かふ',e:'widow'}]},
  {id:1150,k:'渇',m:'thirst / dry up',on:'カツ',ku:'かわ-',lv:'N2',st:11,cat:'action',rad:'水',mn:'Water + dry = thirst',ex:[{w:'渇く',r:'かわく',e:'to be thirsty'},{w:'渴望',r:'かつぼう',e:'craving'}]},
  {id:1151,k:'括',m:'fasten / include',on:'カツ',ku:'くく-',lv:'N2',st:9,cat:'action',rad:'手',mn:'Hand + tongue = fasten',ex:[{w:'括る',r:'くくる',e:'to tie up'},{w:'一括',r:'いっかつ',e:'lump together'}]},
  {id:1152,k:'乾',m:'dry',on:'カン',ku:'かわ-・かわ-く',lv:'N2',st:11,cat:'action',rad:'乙',mn:'Dried plant = dry',ex:[{w:'乾く',r:'かわく',e:'to dry'},{w:'乾燥',r:'かんそう',e:'dryness'}]},
  {id:1153,k:'緩',m:'loose / slow',on:'カン',ku:'ゆる-',lv:'N2',st:15,cat:'description',rad:'糸',mn:'Thread + baboon = loose',ex:[{w:'緩い',r:'ゆるい',e:'loose'},{w:'緩和',r:'かんわ',e:'easing / relaxation'}]},
  {id:1154,k:'監',m:'oversee / supervise',on:'カン',ku:'',lv:'N2',st:15,cat:'action',rad:'皿',mn:'Dish + person kneeling = oversee',ex:[{w:'監督',r:'かんとく',e:'supervision / director'},{w:'監視',r:'かんし',e:'surveillance'}]},
  {id:1155,k:'慣',m:'accustomed to',on:'カン',ku:'な-',lv:'N2',st:14,cat:'action',rad:'心',mn:'Heart + pierce = accustomed',ex:[{w:'慣れる',r:'なれる',e:'to get used to'},{w:'習慣',r:'しゅうかん',e:'habit'}]},
  {id:1156,k:'勧',m:'recommend / encourage',on:'カン',ku:'すす-',lv:'N2',st:13,cat:'action',rad:'力',mn:'Force + bird = recommend',ex:[{w:'勧める',r:'すすめる',e:'to recommend'},{w:'勧誘',r:'かんゆう',e:'solicitation'}]},
  {id:1157,k:'寛',m:'tolerant / generous',on:'カン',ku:'くつろ-',lv:'N2',st:13,cat:'description',rad:'宀',mn:'Roof + wide = tolerant',ex:[{w:'寛大',r:'かんだい',e:'tolerant'},{w:'寛容',r:'かんよう',e:'generosity'}]},
  {id:1158,k:'貫',m:'pierce / penetrate',on:'カン',ku:'つらぬ-',lv:'N2',st:11,cat:'action',rad:'貝',mn:'Shell + mother = pierce',ex:[{w:'貫く',r:'つらぬく',e:'to pierce through'},{w:'一貫',r:'いっかん',e:'consistency'}]},
  {id:1159,k:'岸',m:'shore / bank',on:'ガン',ku:'きし',lv:'N2',st:8,cat:'place',rad:'山',mn:'Mountain + cliff + rock = shore',ex:[{w:'岸',r:'きし',e:'shore / bank'},{w:'海岸',r:'かいがん',e:'coast'}]},
  {id:1160,k:'菊',m:'chrysanthemum',on:'キク',ku:'',lv:'N2',st:11,cat:'nature',rad:'艸',mn:'Grass + rice = chrysanthemum',ex:[{w:'菊',r:'きく',e:'chrysanthemum'},{w:'菊花',r:'きっか',e:'chrysanthemum flower'}]},
  {id:1161,k:'吸',m:'inhale / absorb',on:'キュウ',ku:'す-',lv:'N2',st:6,cat:'action',rad:'口',mn:'Mouth + reach = inhale',ex:[{w:'吸う',r:'すう',e:'to inhale'},{w:'吸収',r:'きゅうしゅう',e:'absorption'}]},
  {id:1162,k:'拒',m:'refuse / resist',on:'キョ',ku:'こば-',lv:'N2',st:8,cat:'action',rad:'手',mn:'Hand + giant = refuse',ex:[{w:'拒否',r:'きょひ',e:'refusal'},{w:'拒絶',r:'きょぜつ',e:'rejection'}]},
  {id:1163,k:'距',m:'distance',on:'キョ',ku:'',lv:'N2',st:12,cat:'other',rad:'足',mn:'Foot + giant = distance',ex:[{w:'距離',r:'きょり',e:'distance'},{w:'近距離',r:'きんきょり',e:'short distance'}]},
  {id:1164,k:'凝',m:'congeal / concentrate',on:'ギョウ',ku:'こ-',lv:'N2',st:16,cat:'action',rad:'冫',mn:'Ice + doubt = congeal',ex:[{w:'凝る',r:'こる',e:'to be absorbed in'},{w:'凝縮',r:'ぎょうしゅく',e:'condensation'}]},
  {id:1165,k:'恐',m:'fear / dread',on:'キョウ',ku:'おそ-',lv:'N2',st:10,cat:'feeling',rad:'心',mn:'Work + heart = fear',ex:[{w:'恐れる',r:'おそれる',e:'to fear'},{w:'恐怖',r:'きょうふ',e:'fear'}]},
  {id:1166,k:'脅',m:'threaten',on:'キョウ',ku:'おびや-・おど-',lv:'N2',st:10,cat:'action',rad:'月',mn:'Three powers + body = threaten',ex:[{w:'脅す',r:'おどす',e:'to threaten'},{w:'脅迫',r:'きょうはく',e:'threat'}]},
  {id:1167,k:'矯',m:'correct / straighten',on:'キョウ',ku:'た-',lv:'N2',st:17,cat:'action',rad:'矢',mn:'Arrow + tall = straighten',ex:[{w:'矯正',r:'きょうせい',e:'correction'},{w:'矯める',r:'ためる',e:'to correct'}]},
  {id:1168,k:'禦',m:'resist / repel',on:'ギョ',ku:'',lv:'N2',st:17,cat:'action',rad:'示',mn:'Altar + horse = resist',ex:[{w:'防禦',r:'ぼうぎょ',e:'defense'},{w:'禦ぐ',r:'ふせぐ',e:'to defend'}]},
  {id:1169,k:'謹',m:'respectful / careful',on:'キン',ku:'つつし-',lv:'N2',st:17,cat:'action',rad:'言',mn:'Words + careful = respectful',ex:[{w:'謹慎',r:'きんしん',e:'confinement'},{w:'謹んで',r:'つつしんで',e:'respectfully'}]},
  {id:1170,k:'偶',m:'chance / even number',on:'グウ',ku:'',lv:'N2',st:11,cat:'other',rad:'人',mn:'Person + strange = chance',ex:[{w:'偶然',r:'ぐうぜん',e:'by chance'},{w:'偶数',r:'ぐうすう',e:'even number'}]},
  {id:1171,k:'掘',m:'dig',on:'クツ',ku:'ほ-',lv:'N2',st:11,cat:'action',rad:'手',mn:'Hand + pit = dig',ex:[{w:'掘る',r:'ほる',e:'to dig'},{w:'発掘',r:'はっくつ',e:'excavation'}]},
  {id:1172,k:'傾',m:'tilt / lean',on:'ケイ',ku:'かたむ-',lv:'N2',st:13,cat:'action',rad:'人',mn:'Person + head = tilt',ex:[{w:'傾く',r:'かたむく',e:'to tilt'},{w:'傾向',r:'けいこう',e:'tendency'}]},
  {id:1173,k:'刑',m:'punishment',on:'ケイ',ku:'',lv:'N2',st:6,cat:'other',rad:'刀',mn:'Knife + open = punishment',ex:[{w:'刑事',r:'けいじ',e:'detective / criminal'},{w:'刑罰',r:'けいばつ',e:'punishment'}]},
  {id:1174,k:'掲',m:'hoist / publish',on:'ケイ',ku:'かか-',lv:'N2',st:11,cat:'action',rad:'手',mn:'Hand + sunrise = hoist',ex:[{w:'掲示',r:'けいじ',e:'notice'},{w:'掲載',r:'けいさい',e:'publication'}]},
  {id:1175,k:'欠',m:'lack / absent',on:'ケツ',ku:'か-',lv:'N2',st:4,cat:'other',rad:'欠',mn:'Yawning person = lack',ex:[{w:'欠ける',r:'かける',e:'to be lacking'},{w:'欠如',r:'けつじょ',e:'lack'}]},
  {id:1176,k:'肩',m:'shoulder',on:'ケン',ku:'かた',lv:'N2',st:8,cat:'body',rad:'月',mn:'Roof + body = shoulder',ex:[{w:'肩',r:'かた',e:'shoulder'},{w:'肩書き',r:'かたがき',e:'title / position'}]},
  {id:1177,k:'剣',m:'sword / serious',on:'ケン',ku:'つるぎ',lv:'N2',st:10,cat:'other',rad:'刀',mn:'Two men + knife = sword',ex:[{w:'剣',r:'つるぎ',e:'sword'},{w:'剣道',r:'けんどう',e:'kendo'}]},
  {id:1178,k:'懸',m:'hang / depend on',on:'ケン・ケ',ku:'か-',lv:'N2',st:20,cat:'action',rad:'心',mn:'Heart + hanging = depend on',ex:[{w:'懸ける',r:'かける',e:'to stake on'},{w:'懸念',r:'けねん',e:'concern'}]},
  {id:1179,k:'鋼',m:'steel',on:'コウ',ku:'はがね',lv:'N2',st:16,cat:'other',rad:'金',mn:'Metal + hill = steel',ex:[{w:'鋼',r:'はがね',e:'steel'},{w:'鉄鋼',r:'てっこう',e:'steel'}]},
  {id:1180,k:'耕',m:'plow / cultivate',on:'コウ',ku:'たがや-',lv:'N2',st:10,cat:'action',rad:'耒',mn:'Plow + well = cultivate',ex:[{w:'耕す',r:'たがやす',e:'to cultivate'},{w:'農耕',r:'のうこう',e:'farming'}]},
  {id:1181,k:'恒',m:'constant / always',on:'コウ',ku:'つね',lv:'N2',st:9,cat:'description',rad:'心',mn:'Heart + extend = constant',ex:[{w:'恒久',r:'こうきゅう',e:'permanent'},{w:'恒例',r:'こうれい',e:'customary'}]},
  {id:1182,k:'荒',m:'rough / waste',on:'コウ',ku:'あ-',lv:'N2',st:9,cat:'description',rad:'艸',mn:'Grass + river = rough',ex:[{w:'荒い',r:'あらい',e:'rough'},{w:'荒廃',r:'こうはい',e:'devastation'}]},
  {id:1183,k:'項',m:'clause / section',on:'コウ',ku:'うなじ',lv:'N2',st:12,cat:'other',rad:'頁',mn:'Page + craft = clause',ex:[{w:'項目',r:'こうもく',e:'item / clause'},{w:'条項',r:'じょうこう',e:'provision'}]},
  {id:1184,k:'酵',m:'ferment',on:'コウ',ku:'',lv:'N2',st:14,cat:'other',rad:'酉',mn:'Wine + filial = ferment',ex:[{w:'酵母',r:'こうぼ',e:'yeast'},{w:'発酵',r:'はっこう',e:'fermentation'}]},
  {id:1185,k:'拘',m:'arrest / adhere',on:'コウ',ku:'かか-',lv:'N2',st:8,cat:'action',rad:'手',mn:'Hand + enough = adhere',ex:[{w:'拘束',r:'こうそく',e:'restraint'},{w:'拘置',r:'こうち',e:'detention'}]},
  {id:1186,k:'梗',m:'stem / outline',on:'コウ',ku:'',lv:'N2',st:11,cat:'other',rad:'木',mn:'Wood + more = stem',ex:[{w:'梗塞',r:'こうそく',e:'infarction'},{w:'心筋梗塞',r:'しんきんこうそく',e:'myocardial infarction'}]},
  {id:1187,k:'互',m:'mutually / each other',on:'ゴ',ku:'たが-',lv:'N2',st:4,cat:'other',rad:'一',mn:'Lines crossing = mutual',ex:[{w:'互い',r:'たがい',e:'each other'},{w:'互角',r:'ごかく',e:'equal match'}]},
  {id:1188,k:'誤',m:'mistake / error',on:'ゴ',ku:'あやま-',lv:'N2',st:14,cat:'action',rad:'言',mn:'Words + I = mistake',ex:[{w:'誤り',r:'あやまり',e:'mistake'},{w:'誤解',r:'ごかい',e:'misunderstanding'}]},
  {id:1189,k:'溝',m:'ditch / groove',on:'コウ',ku:'みぞ',lv:'N2',st:13,cat:'place',rad:'水',mn:'Water + meet = ditch',ex:[{w:'溝',r:'みぞ',e:'ditch / groove'},{w:'溝を埋める',r:'みぞをうめる',e:'to bridge a gap'}]},
  {id:1190,k:'購',m:'buy / purchase',on:'コウ',ku:'',lv:'N2',st:17,cat:'action',rad:'貝',mn:'Shell + build = purchase',ex:[{w:'購入',r:'こうにゅう',e:'purchase'},{w:'購読',r:'こうどく',e:'subscription'}]},
  {id:1191,k:'剛',m:'strong / sturdy',on:'ゴウ',ku:'',lv:'N2',st:10,cat:'description',rad:'刀',mn:'Knife + hill = sturdy',ex:[{w:'剛健',r:'ごうけん',e:'sturdy'},{w:'剛力',r:'ごうりき',e:'great strength'}]},
  {id:1192,k:'傲',m:'arrogant',on:'ゴウ',ku:'おご-',lv:'N2',st:13,cat:'description',rad:'人',mn:'Person + pride = arrogant',ex:[{w:'傲慢',r:'ごうまん',e:'arrogance'},{w:'傲る',r:'おごる',e:'to be arrogant'}]},
  {id:1193,k:'穀',m:'grain / cereal',on:'コク',ku:'',lv:'N2',st:14,cat:'food',rad:'禾',mn:'Grain + shell = grain',ex:[{w:'穀物',r:'こくもつ',e:'grain'},{w:'穀類',r:'こくるい',e:'cereals'}]},
  {id:1194,k:'酷',m:'cruel / severe',on:'コク',ku:'',lv:'N2',st:14,cat:'description',rad:'酉',mn:'Wine + tell = cruel',ex:[{w:'酷い',r:'ひどい',e:'cruel / terrible'},{w:'残酷',r:'ざんこく',e:'cruel'}]},
  {id:1195,k:'昆',m:'descendant / insect',on:'コン',ku:'',lv:'N2',st:8,cat:'nature',rad:'日',mn:'Sun + compare = insect',ex:[{w:'昆虫',r:'こんちゅう',e:'insect'},{w:'昆布',r:'こんぶ',e:'kelp'}]},
  {id:1196,k:'砂',m:'sand',on:'サ・シャ',ku:'すな',lv:'N2',st:9,cat:'nature',rad:'石',mn:'Stone + small = sand',ex:[{w:'砂',r:'すな',e:'sand'},{w:'砂漠',r:'さばく',e:'desert'}]},
  {id:1197,k:'鎖',m:'chain / lock',on:'サ',ku:'くさり',lv:'N2',st:18,cat:'other',rad:'金',mn:'Metal + small = chain',ex:[{w:'鎖',r:'くさり',e:'chain'},{w:'封鎖',r:'ふうさ',e:'blockade'}]},
  {id:1198,k:'栽',m:'plant / cultivate',on:'サイ',ku:'',lv:'N2',st:10,cat:'action',rad:'木',mn:'Wood + spear = plant',ex:[{w:'栽培',r:'さいばい',e:'cultivation'},{w:'盆栽',r:'ぼんさい',e:'bonsai'}]},
  {id:1199,k:'債',m:'debt / bond',on:'サイ',ku:'',lv:'N2',st:13,cat:'other',rad:'人',mn:'Person + request = debt',ex:[{w:'債務',r:'さいむ',e:'debt'},{w:'国債',r:'こくさい',e:'government bond'}]},
  {id:1200,k:'催',m:'urge / sponsor',on:'サイ',ku:'もよお-',lv:'N2',st:13,cat:'action',rad:'人',mn:'Person + mountain = sponsor',ex:[{w:'催す',r:'もよおす',e:'to hold (event)'},{w:'開催',r:'かいさい',e:'holding an event'}]},
  {id:1201,k:'錯',m:'confused / mixed',on:'サク',ku:'',lv:'N2',st:16,cat:'action',rad:'金',mn:'Metal + former = confused',ex:[{w:'錯覚',r:'さっかく',e:'illusion'},{w:'錯誤',r:'さくご',e:'error'}]},
  {id:1202,k:'澄',m:'clear / pure',on:'チョウ',ku:'す-',lv:'N2',st:15,cat:'description',rad:'水',mn:'Water + ascend = clear',ex:[{w:'澄む',r:'すむ',e:'to become clear'},{w:'清澄',r:'せいちょう',e:'clear'}]},
  {id:1203,k:'桟',m:'scaffold / bar',on:'サン',ku:'さん',lv:'N2',st:10,cat:'other',rad:'木',mn:'Wood + carry = scaffold',ex:[{w:'桟橋',r:'さんばし',e:'pier'},{w:'桟敷',r:'さじき',e:'gallery seating'}]},
  {id:1204,k:'暫',m:'temporary / a while',on:'ザン',ku:'しばら-',lv:'N2',st:15,cat:'other',rad:'日',mn:'Sun + cutting = temporary',ex:[{w:'暫く',r:'しばらく',e:'for a while'},{w:'暫定',r:'ざんてい',e:'provisional'}]},
  {id:1205,k:'施',m:'execute / give',on:'シ・セ',ku:'ほどこ-',lv:'N2',st:9,cat:'action',rad:'方',mn:'Direction + who = execute',ex:[{w:'施す',r:'ほどこす',e:'to give / execute'},{w:'実施',r:'じっし',e:'implementation'}]},
  {id:1206,k:'嗣',m:'heir / successor',on:'シ',ku:'',lv:'N2',st:13,cat:'person',rad:'口',mn:'Mouth + continuation = heir',ex:[{w:'嗣子',r:'しし',e:'heir'},{w:'皇嗣',r:'こうし',e:'crown prince'}]},
  {id:1207,k:'諮',m:'consult / ask advice',on:'シ',ku:'はか-',lv:'N2',st:16,cat:'action',rad:'言',mn:'Words + next = consult',ex:[{w:'諮問',r:'しもん',e:'inquiry'},{w:'諮る',r:'はかる',e:'to consult'}]},
  {id:1208,k:'執',m:'hold / carry out',on:'シツ・シュウ',ku:'と-',lv:'N2',st:11,cat:'action',rad:'土',mn:'Earth + seize = hold',ex:[{w:'執行',r:'しっこう',e:'execution'},{w:'執着',r:'しゅうちゃく',e:'attachment'}]},
  {id:1209,k:'湿',m:'damp / humid',on:'シツ',ku:'しめ-',lv:'N2',st:12,cat:'description',rad:'水',mn:'Water + display = damp',ex:[{w:'湿気',r:'しっけ',e:'humidity'},{w:'湿る',r:'しめる',e:'to become damp'}]},
  {id:1210,k:'釈',m:'explain / release',on:'シャク',ku:'',lv:'N2',st:11,cat:'action',rad:'米',mn:'Rice + release = explain',ex:[{w:'解釈',r:'かいしゃく',e:'interpretation'},{w:'釈明',r:'しゃくめい',e:'explanation'}]},
  {id:1211,k:'遮',m:'block / intercept',on:'シャ',ku:'さえぎ-',lv:'N2',st:14,cat:'action',rad:'辵',mn:'Walk + this = block',ex:[{w:'遮る',r:'さえぎる',e:'to block'},{w:'遮断',r:'しゃだん',e:'interruption'}]},
  {id:1212,k:'儒',m:'Confucian / scholar',on:'ジュ',ku:'',lv:'N2',st:16,cat:'person',rad:'人',mn:'Person + need = scholar',ex:[{w:'儒教',r:'じゅきょう',e:'Confucianism'},{w:'儒学',r:'じゅがく',e:'Confucian studies'}]},
  {id:1213,k:'渋',m:'astringent / reluctant',on:'ジュウ',ku:'しぶ-',lv:'N2',st:11,cat:'description',rad:'水',mn:'Water + stop = astringent',ex:[{w:'渋い',r:'しぶい',e:'astringent'},{w:'渋滞',r:'じゅうたい',e:'traffic jam'}]},
  {id:1214,k:'従',m:'follow / obey',on:'ジュウ・ショウ',ku:'したが-',lv:'N2',st:10,cat:'action',rad:'彳',mn:'Walk + from = follow',ex:[{w:'従う',r:'したがう',e:'to follow'},{w:'服従',r:'ふくじゅう',e:'obedience'}]},
  {id:1215,k:'充',m:'fill / enough',on:'ジュウ',ku:'あ-',lv:'N2',st:6,cat:'action',rad:'儿',mn:'Person + top = fill',ex:[{w:'充実',r:'じゅうじつ',e:'fulfillment'},{w:'充電',r:'じゅうでん',e:'charging'}]},
  {id:1216,k:'需',m:'demand / need',on:'ジュ',ku:'',lv:'N2',st:14,cat:'other',rad:'雨',mn:'Rain + beard = demand',ex:[{w:'需要',r:'じゅよう',e:'demand'},{w:'需給',r:'じゅきゅう',e:'supply and demand'}]},
  {id:1217,k:'叙',m:'narrate / confer',on:'ジョ',ku:'',lv:'N2',st:9,cat:'action',rad:'攴',mn:'Strike + spread = narrate',ex:[{w:'叙述',r:'じょじゅつ',e:'description'},{w:'叙情',r:'じょじょう',e:'lyricism'}]},
  {id:1218,k:'嬢',m:'young lady / daughter',on:'ジョウ',ku:'',lv:'N2',st:17,cat:'person',rad:'女',mn:'Woman + allow = young lady',ex:[{w:'令嬢',r:'れいじょう',e:'young lady'},{w:'お嬢様',r:'おじょうさま',e:'young lady (honorific)'}]},
  {id:1219,k:'浄',m:'pure / clean',on:'ジョウ',ku:'きよ-',lv:'N2',st:9,cat:'description',rad:'水',mn:'Water + dispute = pure',ex:[{w:'浄化',r:'じょうか',e:'purification'},{w:'清浄',r:'せいじょう',e:'purity'}]},
  {id:1220,k:'剰',m:'surplus / excess',on:'ジョウ',ku:'あま-',lv:'N2',st:11,cat:'other',rad:'刀',mn:'Knife + multiply = surplus',ex:[{w:'剰余',r:'じょうよ',e:'surplus'},{w:'過剰',r:'かじょう',e:'excess'}]},
  {id:1221,k:'丈',m:'length / strong',on:'ジョウ',ku:'たけ',lv:'N2',st:3,cat:'other',rad:'十',mn:'Ten + stroke = length',ex:[{w:'丈',r:'たけ',e:'length'},{w:'丈夫',r:'じょうぶ',e:'sturdy'}]},
  {id:1222,k:'冗',m:'superfluous',on:'ジョウ',ku:'',lv:'N2',st:4,cat:'other',rad:'冖',mn:'Cover + person = superfluous',ex:[{w:'冗談',r:'じょうだん',e:'joke'},{w:'冗長',r:'じょうちょう',e:'verbose'}]},
  {id:1223,k:'迅',m:'swift',on:'ジン',ku:'',lv:'N2',st:6,cat:'description',rad:'辵',mn:'Walk + snake = swift',ex:[{w:'迅速',r:'じんそく',e:'swift'},{w:'迅雷',r:'じんらい',e:'quick thunder'}]},
  {id:1224,k:'尋',m:'ask / search',on:'ジン',ku:'たず-',lv:'N2',st:12,cat:'action',rad:'工',mn:'Work + hands = ask',ex:[{w:'尋ねる',r:'たずねる',e:'to ask'},{w:'尋問',r:'じんもん',e:'interrogation'}]},
  {id:1225,k:'酢',m:'vinegar',on:'サク',ku:'す',lv:'N2',st:12,cat:'food',rad:'酉',mn:'Wine + former = vinegar',ex:[{w:'酢',r:'す',e:'vinegar'},{w:'酢酸',r:'さくさん',e:'acetic acid'}]},
  {id:1226,k:'据',m:'place / set',on:'キョ',ku:'す-',lv:'N2',st:11,cat:'action',rad:'手',mn:'Hand + pig = place',ex:[{w:'据える',r:'すえる',e:'to place'},{w:'据置き',r:'すえおき',e:'leaving as is'}]},
  {id:1227,k:'煤',m:'soot',on:'バイ',ku:'すす',lv:'N2',st:13,cat:'other',rad:'火',mn:'Fire + every = soot',ex:[{w:'煤',r:'すす',e:'soot'},{w:'煤煙',r:'ばいえん',e:'smoke and soot'}]},
  {id:1228,k:'成',m:'become / achieve',on:'セイ・ジョウ',ku:'な-',lv:'N2',st:6,cat:'action',rad:'戈',mn:'Spear + mouth = become',ex:[{w:'成る',r:'なる',e:'to become'},{w:'成功',r:'せいこう',e:'success'}]},
  {id:1229,k:'誓',m:'vow / oath',on:'セイ',ku:'ちか-',lv:'N2',st:14,cat:'action',rad:'言',mn:'Words + fold = vow',ex:[{w:'誓う',r:'ちかう',e:'to vow'},{w:'宣誓',r:'せんせい',e:'oath'}]},
  {id:1230,k:'是',m:'right / correct',on:'ゼ',ku:'',lv:'N2',st:9,cat:'description',rad:'日',mn:'Sun + spoon = correct',ex:[{w:'是非',r:'ぜひ',e:'by all means'},{w:'是正',r:'ぜせい',e:'correction'}]},
  {id:1231,k:'摂',m:'take in / govern',on:'セツ',ku:'と-',lv:'N2',st:13,cat:'action',rad:'手',mn:'Hand + ear = take in',ex:[{w:'摂取',r:'せっしゅ',e:'intake'},{w:'摂政',r:'せっしょう',e:'regent'}]},
  {id:1232,k:'繊',m:'fiber / slender',on:'セン',ku:'',lv:'N2',st:17,cat:'other',rad:'糸',mn:'Thread + slender = fiber',ex:[{w:'繊維',r:'せんい',e:'fiber'},{w:'繊細',r:'せんさい',e:'delicate'}]},
  {id:1233,k:'占',m:'occupy / fortune',on:'セン',ku:'し-',lv:'N2',st:5,cat:'action',rad:'卜',mn:'Divination + mouth = fortune',ex:[{w:'占める',r:'しめる',e:'to occupy'},{w:'占い',r:'うらない',e:'fortune-telling'}]},
  {id:1234,k:'宣',m:'declare / proclaim',on:'セン',ku:'',lv:'N2',st:9,cat:'action',rad:'宀',mn:'Roof + extend = proclaim',ex:[{w:'宣言',r:'せんげん',e:'declaration'},{w:'宣伝',r:'せんでん',e:'propaganda'}]},
  {id:1235,k:'潜',m:'lurk / dive',on:'セン',ku:'もぐ-・ひそ-',lv:'N2',st:15,cat:'action',rad:'水',mn:'Water + sign = lurk',ex:[{w:'潜る',r:'もぐる',e:'to dive'},{w:'潜在',r:'せんざい',e:'potential / latent'}]},
  {id:1236,k:'遷',m:'move / change',on:'セン',ku:'うつ-',lv:'N2',st:15,cat:'action',rad:'辵',mn:'Walk + big + one = move',ex:[{w:'変遷',r:'へんせん',e:'change'},{w:'遷都',r:'せんと',e:'moving the capital'}]},
  {id:1237,k:'喪',m:'mourning / lose',on:'ソウ',ku:'も',lv:'N2',st:12,cat:'other',rad:'口',mn:'Mouth + tree = mourning',ex:[{w:'喪',r:'も',e:'mourning'},{w:'喪失',r:'そうしつ',e:'loss'}]},
  {id:1238,k:'壮',m:'robust / grand',on:'ソウ',ku:'',lv:'N2',st:6,cat:'description',rad:'士',mn:'Samurai + bed = robust',ex:[{w:'壮大',r:'そうだい',e:'grand'},{w:'壮健',r:'そうけん',e:'robust'}]},
  {id:1239,k:'窓',m:'window',on:'ソウ',ku:'まど',lv:'N2',st:11,cat:'other',rad:'穴',mn:'Hole + heart = window',ex:[{w:'窓',r:'まど',e:'window'},{w:'車窓',r:'しゃそう',e:'train window'}]},
  {id:1240,k:'双',m:'pair / both',on:'ソウ',ku:'ふた-',lv:'N2',st:4,cat:'other',rad:'又',mn:'Two hands = pair',ex:[{w:'双子',r:'ふたご',e:'twins'},{w:'双方',r:'そうほう',e:'both parties'}]},
  {id:1241,k:'霜',m:'frost',on:'ソウ',ku:'しも',lv:'N2',st:17,cat:'nature',rad:'雨',mn:'Rain + similar = frost',ex:[{w:'霜',r:'しも',e:'frost'},{w:'霜降り',r:'しもふり',e:'marbled meat'}]},
  {id:1242,k:'騒',m:'noisy / commotion',on:'ソウ',ku:'さわ-',lv:'N2',st:18,cat:'other',rad:'馬',mn:'Horse + flea = noisy',ex:[{w:'騒ぐ',r:'さわぐ',e:'to make noise'},{w:'騒音',r:'そうおん',e:'noise'}]},
  {id:1243,k:'卓',m:'table / superior',on:'タク',ku:'',lv:'N2',st:8,cat:'other',rad:'十',mn:'Ten + early = superior',ex:[{w:'卓球',r:'たっきゅう',e:'table tennis'},{w:'卓越',r:'たくえつ',e:'excellence'}]},
  {id:1244,k:'択',m:'choose / select',on:'タク',ku:'',lv:'N2',st:7,cat:'action',rad:'手',mn:'Hand + release = choose',ex:[{w:'選択',r:'せんたく',e:'selection'},{w:'択一',r:'たくいつ',e:'multiple choice'}]},
  {id:1245,k:'担',m:'bear / carry',on:'タン',ku:'にな-・かつ-',lv:'N2',st:8,cat:'action',rad:'手',mn:'Hand + morning = bear',ex:[{w:'担う',r:'になう',e:'to bear'},{w:'担当',r:'たんとう',e:'in charge'}]},
  {id:1246,k:'端',m:'edge / tip',on:'タン',ku:'はし・は',lv:'N2',st:14,cat:'other',rad:'立',mn:'Stand + mountain = edge',ex:[{w:'端',r:'はし',e:'edge'},{w:'端末',r:'たんまつ',e:'terminal'}]},
  {id:1247,k:'嘆',m:'sigh / lament',on:'タン',ku:'なげ-',lv:'N2',st:14,cat:'feeling',rad:'口',mn:'Mouth + sigh = lament',ex:[{w:'嘆く',r:'なげく',e:'to lament'},{w:'嘆息',r:'たんそく',e:'sigh'}]},
  {id:1248,k:'弾',m:'bullet / play',on:'ダン',ku:'たま・ひ-',lv:'N2',st:12,cat:'other',rad:'弓',mn:'Bow + single = bullet',ex:[{w:'弾',r:'たま',e:'bullet'},{w:'弾く',r:'ひく',e:'to play (string instrument)'}]},
  {id:1249,k:'恥',m:'shame / embarrassment',on:'チ',ku:'は-',lv:'N2',st:10,cat:'feeling',rad:'耳',mn:'Ear + heart = shame',ex:[{w:'恥ずかしい',r:'はずかしい',e:'embarrassing'},{w:'恥',r:'はじ',e:'shame'}]},
  {id:1250,k:'鋳',m:'cast / mold',on:'チュウ',ku:'い-',lv:'N2',st:15,cat:'action',rad:'金',mn:'Metal + tree = cast',ex:[{w:'鋳る',r:'いる',e:'to cast'},{w:'鋳造',r:'ちゅうぞう',e:'casting'}]},
  {id:1251,k:'彫',m:'carve / sculpt',on:'チョウ',ku:'ほ-',lv:'N2',st:11,cat:'art',rad:'彡',mn:'Hair + bird = carve',ex:[{w:'彫る',r:'ほる',e:'to carve'},{w:'彫刻',r:'ちょうこく',e:'sculpture'}]},
  {id:1252,k:'徹',m:'penetrate / thorough',on:'テツ',ku:'',lv:'N2',st:15,cat:'description',rad:'彳',mn:'Walk + child + beat = penetrate',ex:[{w:'徹底',r:'てってい',e:'thorough'},{w:'徹夜',r:'てつや',e:'all-nighter'}]},
  {id:1253,k:'添',m:'add / supplement',on:'テン',ku:'そ-',lv:'N2',st:11,cat:'action',rad:'水',mn:'Water + go = add',ex:[{w:'添える',r:'そえる',e:'to add'},{w:'添付',r:'てんぷ',e:'attachment'}]},
  {id:1254,k:'塗',m:'paint / coat',on:'ト',ku:'ぬ-',lv:'N2',st:13,cat:'action',rad:'土',mn:'Earth + water + hands = paint',ex:[{w:'塗る',r:'ぬる',e:'to paint'},{w:'塗料',r:'とりょう',e:'paint'}]},
  {id:1255,k:'吐',m:'vomit / express',on:'ト',ku:'は-',lv:'N2',st:6,cat:'action',rad:'口',mn:'Mouth + earth = vomit',ex:[{w:'吐く',r:'はく',e:'to vomit'},{w:'吐露',r:'とろ',e:'disclosure'}]},
  {id:1256,k:'渡',m:'cross / hand over',on:'ト',ku:'わた-',lv:'N2',st:12,cat:'action',rad:'水',mn:'Water + many = cross',ex:[{w:'渡す',r:'わたす',e:'to hand over'},{w:'渡航',r:'とこう',e:'voyage'}]},
  {id:1257,k:'途',m:'way / en route',on:'ト',ku:'',lv:'N2',st:10,cat:'other',rad:'辵',mn:'Walk + give = on the way',ex:[{w:'途中',r:'とちゅう',e:'on the way'},{w:'途絶',r:'とぜつ',e:'interruption'}]},
  {id:1258,k:'唐',m:'China / sudden',on:'トウ',ku:'から',lv:'N2',st:10,cat:'other',rad:'口',mn:'Mouth + hand = Tang China',ex:[{w:'唐',r:'から',e:'China (old)'},{w:'唐突',r:'とうとつ',e:'sudden'}]},
  {id:1259,k:'銅',m:'copper',on:'ドウ',ku:'',lv:'N2',st:14,cat:'other',rad:'金',mn:'Metal + same = copper',ex:[{w:'銅',r:'どう',e:'copper'},{w:'銅メダル',r:'どうメダル',e:'bronze medal'}]},
  {id:1260,k:'洞',m:'cave / see through',on:'ドウ',ku:'ほら',lv:'N2',st:9,cat:'place',rad:'水',mn:'Water + same = cave',ex:[{w:'洞窟',r:'どうくつ',e:'cave'},{w:'洞察',r:'どうさつ',e:'insight'}]},
  {id:1261,k:'鈍',m:'blunt / dull',on:'ドン',ku:'にぶ-',lv:'N2',st:12,cat:'description',rad:'金',mn:'Metal + retreat = blunt',ex:[{w:'鈍い',r:'にぶい',e:'blunt'},{w:'鈍化',r:'どんか',e:'slowing down'}]},
  {id:1262,k:'軟',m:'soft / flexible',on:'ナン',ku:'やわ-',lv:'N2',st:11,cat:'description',rad:'車',mn:'Cart + yawn = soft',ex:[{w:'軟らかい',r:'やわらかい',e:'soft'},{w:'軟化',r:'なんか',e:'softening'}]},
  {id:1263,k:'荷',m:'luggage / burden',on:'カ',ku:'に',lv:'N2',st:10,cat:'other',rad:'艸',mn:'Grass + what = luggage',ex:[{w:'荷物',r:'にもつ',e:'luggage'},{w:'荷台',r:'にだい',e:'cargo bed'}]},
  {id:1264,k:'阿',m:'corner / flatter',on:'ア・オ',ku:'くま',lv:'N1',st:8,cat:'other',rad:'阜',mn:'Mound + can = flatter',ex:[{w:'阿呆',r:'あほう',e:'fool'},{w:'阿弥陀',r:'あみだ',e:'Amitabha Buddha'}]},
  {id:1265,k:'亜',m:'Asia / sub-',on:'ア',ku:'',lv:'N1',st:7,cat:'other',rad:'二',mn:'Two + cross = Asia',ex:[{w:'亜細亜',r:'アジア',e:'Asia'},{w:'亜熱帯',r:'あねったい',e:'subtropical'}]},
  {id:1266,k:'哀',m:'sorrow / pathos',on:'アイ',ku:'あわ-・かな-',lv:'N1',st:9,cat:'feeling',rad:'口',mn:'Mouth + clothing = sorrow',ex:[{w:'哀れ',r:'あわれ',e:'pathos'},{w:'悲哀',r:'ひあい',e:'grief'}]},
  {id:1267,k:'曖',m:'unclear / vague',on:'アイ',ku:'',lv:'N1',st:17,cat:'description',rad:'日',mn:'Sun + dark = vague',ex:[{w:'曖昧',r:'あいまい',e:'vague'},{w:'曖昧さ',r:'あいまいさ',e:'vagueness'}]},
  {id:1268,k:'挨',m:'push / approach',on:'アイ',ku:'',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + close = approach',ex:[{w:'挨拶',r:'あいさつ',e:'greeting'},{w:'挨拶状',r:'あいさつじょう',e:'greeting card'}]},
  {id:1269,k:'嵐',m:'storm',on:'ラン',ku:'あらし',lv:'N1',st:12,cat:'nature',rad:'山',mn:'Mountain + wind = storm',ex:[{w:'嵐',r:'あらし',e:'storm'},{w:'砂嵐',r:'すなあらし',e:'sandstorm'}]},
  {id:1270,k:'葦',m:'reed / rush',on:'イ',ku:'あし',lv:'N1',st:13,cat:'nature',rad:'艸',mn:'Grass + reed = reed',ex:[{w:'葦',r:'あし',e:'reed'},{w:'葦原',r:'あしはら',e:'reed field'}]},
  {id:1271,k:'畏',m:'awe / fear',on:'イ',ku:'おそ-',lv:'N1',st:9,cat:'feeling',rad:'田',mn:'Field + ghost = awe',ex:[{w:'畏れ',r:'おそれ',e:'awe'},{w:'畏敬',r:'いけい',e:'reverence'}]},
  {id:1272,k:'違',m:'differ / wrong',on:'イ',ku:'ちが-',lv:'N1',st:13,cat:'action',rad:'辵',mn:'Walk + straddle = differ',ex:[{w:'違う',r:'ちがう',e:'to differ'},{w:'違反',r:'いはん',e:'violation'}]},
  {id:1273,k:'萎',m:'wither / droop',on:'イ',ku:'しお-',lv:'N1',st:11,cat:'nature',rad:'艸',mn:'Grass + woman = wither',ex:[{w:'萎える',r:'なえる',e:'to wither'},{w:'萎縮',r:'いしゅく',e:'atrophy'}]},
  {id:1274,k:'彙',m:'collection / category',on:'イ',ku:'',lv:'N1',st:13,cat:'other',rad:'彡',mn:'Hair + hedgehog = collection',ex:[{w:'語彙',r:'ごい',e:'vocabulary'},{w:'彙報',r:'いほう',e:'bulletin'}]},
  {id:1275,k:'逸',m:'deviate / excel',on:'イツ',ku:'それ-',lv:'N1',st:11,cat:'action',rad:'辵',mn:'Walk + rabbit = deviate',ex:[{w:'逸脱',r:'いつだつ',e:'deviation'},{w:'逸話',r:'いつわ',e:'anecdote'}]},
  {id:1276,k:'淫',m:'lewd / excessive',on:'イン',ku:'みだ-',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + extend = excessive',ex:[{w:'淫ら',r:'みだら',e:'lewd'},{w:'淫雨',r:'いんう',e:'prolonged rain'}]},
  {id:1277,k:'陰',m:'shade / yin',on:'イン',ku:'かげ',lv:'N1',st:11,cat:'nature',rad:'阜',mn:'Mound + cloud = shade',ex:[{w:'陰',r:'かげ',e:'shade / shadow'},{w:'陰陽',r:'いんよう',e:'yin and yang'}]},
  {id:1278,k:'韻',m:'rhyme / rhythm',on:'イン',ku:'',lv:'N1',st:19,cat:'art',rad:'音',mn:'Sound + military = rhyme',ex:[{w:'韻',r:'いん',e:'rhyme'},{w:'押韻',r:'おういん',e:'rhyming'}]},
  {id:1279,k:'詠',m:'recite / compose',on:'エイ',ku:'よ-',lv:'N1',st:12,cat:'art',rad:'言',mn:'Words + eternal = compose',ex:[{w:'詠む',r:'よむ',e:'to compose'},{w:'詠唱',r:'えいしょう',e:'chant'}]},
  {id:1280,k:'閲',m:'review / inspect',on:'エツ',ku:'',lv:'N1',st:15,cat:'action',rad:'門',mn:'Gate + joy = inspect',ex:[{w:'閲覧',r:'えつらん',e:'reading / inspection'},{w:'検閲',r:'けんえつ',e:'censorship'}]},
  {id:1281,k:'謁',m:'audience / meet',on:'エツ',ku:'',lv:'N1',st:15,cat:'action',rad:'言',mn:'Words + day = audience',ex:[{w:'謁見',r:'えっけん',e:'audience with royalty'},{w:'拝謁',r:'はいえつ',e:'having an audience'}]},
  {id:1282,k:'怨',m:'grudge / resent',on:'エン・オン',ku:'うら-',lv:'N1',st:9,cat:'feeling',rad:'心',mn:'Heart + death = grudge',ex:[{w:'怨む',r:'うらむ',e:'to resent'},{w:'怨恨',r:'えんこん',e:'grudge'}]},
  {id:1283,k:'艶',m:'glossy / charming',on:'エン',ku:'つや',lv:'N1',st:19,cat:'description',rad:'色',mn:'Color + cover = glossy',ex:[{w:'艶',r:'つや',e:'gloss / charm'},{w:'艶やか',r:'つややか',e:'glossy'}]},
  {id:1284,k:'謳',m:'sing / praise',on:'オウ',ku:'うた-',lv:'N1',st:17,cat:'art',rad:'言',mn:'Words + sing = praise',ex:[{w:'謳う',r:'うたう',e:'to praise'},{w:'謳歌',r:'おうか',e:'celebration of life'}]},
  {id:1285,k:'旺',m:'prosperous / vigorous',on:'オウ',ku:'',lv:'N1',st:8,cat:'description',rad:'日',mn:'Sun + king = prosperous',ex:[{w:'旺盛',r:'おうせい',e:'vigorous'},{w:'旺気',r:'おうき',e:'vigor'}]},
  {id:1286,k:'翁',m:'old man',on:'オウ',ku:'おきな',lv:'N1',st:10,cat:'person',rad:'羽',mn:'Wings + father = old man',ex:[{w:'翁',r:'おきな',e:'old man'},{w:'老翁',r:'ろうおう',e:'old man'}]},
  {id:1287,k:'穏',m:'calm / gentle',on:'オン',ku:'おだ-',lv:'N1',st:16,cat:'description',rad:'禾',mn:'Grain + heart = calm',ex:[{w:'穏やか',r:'おだやか',e:'calm'},{w:'穏健',r:'おんけん',e:'moderate'}]},
  {id:1288,k:'佳',m:'fine / good',on:'カ',ku:'',lv:'N1',st:8,cat:'description',rad:'人',mn:'Person + earth = fine',ex:[{w:'佳作',r:'かさく',e:'fine work'},{w:'佳境',r:'かきょう',e:'best part'}]},
  {id:1289,k:'嘉',m:'praise / good',on:'カ',ku:'',lv:'N1',st:14,cat:'description',rad:'口',mn:'Mouth + good = praise',ex:[{w:'嘉する',r:'かする',e:'to praise'},{w:'嘉納',r:'かのう',e:'acceptance with joy'}]},
  {id:1290,k:'禍',m:'disaster / calamity',on:'カ',ku:'わざわ-',lv:'N1',st:13,cat:'other',rad:'示',mn:'Altar + hole = disaster',ex:[{w:'禍',r:'わざわい',e:'disaster'},{w:'戦禍',r:'せんか',e:'war damage'}]},
  {id:1291,k:'蚊',m:'mosquito',on:'ブン',ku:'か',lv:'N1',st:10,cat:'nature',rad:'虫',mn:'Insect + writing = mosquito',ex:[{w:'蚊',r:'か',e:'mosquito'},{w:'蚊帳',r:'かや',e:'mosquito net'}]},
  {id:1292,k:'樺',m:'birch tree',on:'カ',ku:'かば',lv:'N1',st:14,cat:'nature',rad:'木',mn:'Wood + beautiful = birch',ex:[{w:'樺',r:'かば',e:'birch tree'},{w:'白樺',r:'しらかば',e:'white birch'}]},
  {id:1293,k:'彼',m:'he / that',on:'ヒ',ku:'かれ・かの',lv:'N1',st:8,cat:'person',rad:'彳',mn:'Walk + skin = he',ex:[{w:'彼',r:'かれ',e:'he'},{w:'彼岸',r:'ひがん',e:'equinox'}]},
  {id:1294,k:'雅',m:'elegant / refined',on:'ガ',ku:'みや-',lv:'N1',st:13,cat:'description',rad:'隹',mn:'Bird + tooth = elegant',ex:[{w:'雅',r:'みやび',e:'elegant'},{w:'優雅',r:'ゆうが',e:'graceful'}]},
  {id:1295,k:'涯',m:'horizon / limit',on:'ガイ',ku:'',lv:'N1',st:11,cat:'other',rad:'水',mn:'Water + cliff = horizon',ex:[{w:'涯',r:'はて',e:'limit / horizon'},{w:'生涯',r:'しょうがい',e:'lifetime'}]},
  {id:1296,k:'劾',m:'impeach',on:'ガイ',ku:'',lv:'N1',st:8,cat:'action',rad:'力',mn:'Force + reason = impeach',ex:[{w:'弾劾',r:'だんがい',e:'impeachment'},{w:'劾奏',r:'がいそう',e:'impeachment report'}]},
  {id:1297,k:'骸',m:'skeleton / frame',on:'ガイ',ku:'むくろ',lv:'N1',st:16,cat:'body',rad:'骨',mn:'Bone + each = skeleton',ex:[{w:'骸骨',r:'がいこつ',e:'skeleton'},{w:'残骸',r:'ざんがい',e:'remains'}]},
  {id:1298,k:'蓋',m:'lid / cover',on:'ガイ',ku:'ふた',lv:'N1',st:13,cat:'other',rad:'艸',mn:'Grass + together = lid',ex:[{w:'蓋',r:'ふた',e:'lid'},{w:'蓋然',r:'がいぜん',e:'probability'}]},
  {id:1299,k:'獲',m:'catch / obtain',on:'カク',ku:'え-',lv:'N1',st:16,cat:'action',rad:'犬',mn:'Dog + obtain = catch',ex:[{w:'獲る',r:'える',e:'to catch'},{w:'捕獲',r:'ほかく',e:'capture'}]},
  {id:1300,k:'廓',m:'circumference / brothel',on:'カク',ku:'くるわ',lv:'N1',st:14,cat:'place',rad:'广',mn:'Shelter + surround = circumference',ex:[{w:'廓',r:'くるわ',e:'red-light district'},{w:'輪廓',r:'りんかく',e:'outline'}]},
  {id:1301,k:'掛',m:'hang / multiply',on:'カイ',ku:'か-',lv:'N1',st:11,cat:'action',rad:'手',mn:'Hand + divine = hang',ex:[{w:'掛ける',r:'かける',e:'to hang'},{w:'掛け算',r:'かけざん',e:'multiplication'}]},
  {id:1302,k:'嚇',m:'intimidate / threat',on:'カク',ku:'おど-',lv:'N1',st:17,cat:'action',rad:'口',mn:'Mouth + fire = intimidate',ex:[{w:'脅嚇',r:'きょうかく',e:'intimidation'},{w:'威嚇',r:'いかく',e:'threat'}]},
  {id:1303,k:'鍛',m:'forge / train',on:'タン',ku:'きた-',lv:'N1',st:17,cat:'action',rad:'金',mn:'Metal + forge = train',ex:[{w:'鍛える',r:'きたえる',e:'to forge / train'},{w:'鍛冶',r:'かじ',e:'blacksmith'}]},
  {id:1304,k:'喝',m:'scold / shout',on:'カツ',ku:'',lv:'N1',st:12,cat:'action',rad:'口',mn:'Mouth + dry = scold',ex:[{w:'喝',r:'かつ',e:'shout of rebuke'},{w:'一喝',r:'いっかつ',e:'sharp rebuke'}]},
  {id:1305,k:'渇',m:'thirst',on:'カツ',ku:'かわ-',lv:'N1',st:11,cat:'health',rad:'水',mn:'Water + dry = thirst',ex:[{w:'渇く',r:'かわく',e:'to be thirsty'},{w:'渇望',r:'かつぼう',e:'craving'}]},
  {id:1306,k:'褐',m:'brown / dark',on:'カツ',ku:'',lv:'N1',st:13,cat:'color',rad:'衣',mn:'Clothes + dry = brown',ex:[{w:'褐色',r:'かっしょく',e:'brown color'},{w:'褐炭',r:'かったん',e:'lignite coal'}]},
  {id:1307,k:'轄',m:'control / jurisdiction',on:'カツ',ku:'',lv:'N1',st:17,cat:'other',rad:'車',mn:'Cart + manage = jurisdiction',ex:[{w:'管轄',r:'かんかつ',e:'jurisdiction'},{w:'直轄',r:'ちょっかつ',e:'direct control'}]},
  {id:1308,k:'且',m:'moreover / also',on:'ショ・ソ',ku:'かつ',lv:'N1',st:5,cat:'other',rad:'一',mn:'Layered = moreover',ex:[{w:'且つ',r:'かつ',e:'moreover'},{w:'且又',r:'かつまた',e:'furthermore'}]},
  {id:1309,k:'芳',m:'fragrant / virtuous',on:'ホウ',ku:'かんば-',lv:'N1',st:7,cat:'description',rad:'艸',mn:'Grass + direction = fragrant',ex:[{w:'芳しい',r:'かんばしい',e:'fragrant'},{w:'芳香',r:'ほうこう',e:'fragrance'}]},
  {id:1310,k:'刈',m:'cut / mow',on:'ガイ',ku:'か-',lv:'N1',st:4,cat:'action',rad:'刀',mn:'Knife + curved = cut',ex:[{w:'刈る',r:'かる',e:'to mow'},{w:'稲刈り',r:'いねかり',e:'rice harvesting'}]},
  {id:1311,k:'瓦',m:'tile / roof tile',on:'ガ',ku:'かわら',lv:'N1',st:5,cat:'other',rad:'瓦',mn:'Curved tile shape = tile',ex:[{w:'瓦',r:'かわら',e:'roof tile'},{w:'瓦礫',r:'がれき',e:'rubble'}]},
  {id:1312,k:'冠',m:'crown',on:'カン',ku:'かんむり',lv:'N1',st:9,cat:'other',rad:'冖',mn:'Cover + inch = crown',ex:[{w:'冠',r:'かんむり',e:'crown'},{w:'冠婚葬祭',r:'かんこんそうさい',e:'rites of passage'}]},
  {id:1313,k:'緘',m:'seal / close',on:'カン',ku:'',lv:'N1',st:15,cat:'action',rad:'糸',mn:'Thread + bound = seal',ex:[{w:'緘口令',r:'かんこうれい',e:'gag order'},{w:'封緘',r:'ふうかん',e:'sealing'}]},
  {id:1314,k:'勘',m:'intuition / cancel',on:'カン',ku:'',lv:'N1',st:11,cat:'other',rad:'力',mn:'Force + south = intuition',ex:[{w:'勘',r:'かん',e:'intuition'},{w:'勘違い',r:'かんちがい',e:'misunderstanding'}]},
  {id:1315,k:'歓',m:'joy / welcome',on:'カン',ku:'よろこ-',lv:'N1',st:15,cat:'feeling',rad:'欠',mn:'Yawn + bird = joy',ex:[{w:'歓迎',r:'かんげい',e:'welcome'},{w:'歓声',r:'かんせい',e:'cheer'}]},
  {id:1316,k:'贋',m:'fake / counterfeit',on:'ガン',ku:'にせ',lv:'N1',st:19,cat:'other',rad:'貝',mn:'Shell + wild goose = fake',ex:[{w:'贋物',r:'にせもの',e:'fake'},{w:'贋作',r:'がんさく',e:'forgery'}]},
  {id:1317,k:'翫',m:'play with / toy',on:'ガン',ku:'もてあそ-',lv:'N1',st:15,cat:'action',rad:'羽',mn:'Wings + play = toy with',ex:[{w:'翫ぶ',r:'もてあそぶ',e:'to play with'},{w:'玩翫',r:'がんがん',e:'playing with'}]},
  {id:1318,k:'頑',m:'stubborn / firm',on:'ガン',ku:'かたく-な',lv:'N1',st:13,cat:'description',rad:'頁',mn:'Page + original = stubborn',ex:[{w:'頑固',r:'がんこ',e:'stubborn'},{w:'頑張る',r:'がんばる',e:'to do one\'s best'}]},
  {id:1319,k:'企',m:'plan / scheme',on:'キ',ku:'くわだ-',lv:'N1',st:6,cat:'action',rad:'人',mn:'Person + stop = plan',ex:[{w:'企てる',r:'くわだてる',e:'to plan'},{w:'企業',r:'きぎょう',e:'company'}]},
  {id:1320,k:'棄',m:'abandon / discard',on:'キ',ku:'す-',lv:'N1',st:13,cat:'action',rad:'木',mn:'Wood + abandon = discard',ex:[{w:'棄てる',r:'すてる',e:'to abandon'},{w:'廃棄',r:'はいき',e:'disposal'}]},
  {id:1321,k:'軌',m:'track / rut',on:'キ',ku:'',lv:'N1',st:9,cat:'other',rad:'車',mn:'Cart + worm = track',ex:[{w:'軌道',r:'きどう',e:'orbit / track'},{w:'軌跡',r:'きせき',e:'trajectory'}]},
  {id:1322,k:'輝',m:'shine / radiate',on:'キ',ku:'かがや-',lv:'N1',st:15,cat:'nature',rad:'光',mn:'Light + army = shine',ex:[{w:'輝く',r:'かがやく',e:'to shine'},{w:'輝き',r:'かがやき',e:'brilliance'}]},
  {id:1323,k:'誼',m:'friendship / good relations',on:'ギ',ku:'よしみ',lv:'N1',st:15,cat:'other',rad:'言',mn:'Words + proper = friendship',ex:[{w:'誼',r:'よしみ',e:'friendship'},{w:'親誼',r:'しんぎ',e:'close friendship'}]},
  {id:1324,k:'欺',m:'deceive / cheat',on:'ギ',ku:'あざむ-',lv:'N1',st:12,cat:'action',rad:'欠',mn:'Yawn + its = deceive',ex:[{w:'欺く',r:'あざむく',e:'to deceive'},{w:'詐欺',r:'さぎ',e:'fraud'}]},
  {id:1325,k:'毀',m:'destroy / slander',on:'キ',ku:'こわ-',lv:'N1',st:13,cat:'action',rad:'殳',mn:'Lance + destroy = destroy',ex:[{w:'毀す',r:'こわす',e:'to destroy'},{w:'毀損',r:'きそん',e:'defamation'}]},
  {id:1326,k:'亀',m:'turtle',on:'キ',ku:'かめ',lv:'N1',st:11,cat:'nature',rad:'亀',mn:'Turtle shape = turtle',ex:[{w:'亀',r:'かめ',e:'turtle'},{w:'亀裂',r:'きれつ',e:'crack'}]},
  {id:1327,k:'姫',m:'princess / girl',on:'キ',ku:'ひめ',lv:'N1',st:10,cat:'person',rad:'女',mn:'Woman + arm = princess',ex:[{w:'姫',r:'ひめ',e:'princess'},{w:'姫路',r:'ひめじ',e:'Himeji (city)'}]},
  {id:1328,k:'朽',m:'decay / rot',on:'キュウ',ku:'く-',lv:'N1',st:6,cat:'nature',rad:'木',mn:'Wood + ladle = decay',ex:[{w:'朽ちる',r:'くちる',e:'to decay'},{w:'不朽',r:'ふきゅう',e:'immortal'}]},
  {id:1329,k:'臼',m:'mortar',on:'キュウ',ku:'うす',lv:'N1',st:6,cat:'other',rad:'臼',mn:'Mortar shape = mortar',ex:[{w:'臼',r:'うす',e:'mortar'},{w:'石臼',r:'いしうす',e:'stone mortar'}]},
  {id:1330,k:'糾',m:'investigate / twist',on:'キュウ',ku:'',lv:'N1',st:8,cat:'action',rad:'糸',mn:'Thread + twist = investigate',ex:[{w:'糾弾',r:'きゅうだん',e:'accusation'},{w:'糾明',r:'きゅうめい',e:'investigation'}]},
  {id:1331,k:'窮',m:'destitute / distress',on:'キュウ',ku:'きわ-',lv:'N1',st:15,cat:'other',rad:'穴',mn:'Hole + body = distress',ex:[{w:'窮地',r:'きゅうち',e:'predicament'},{w:'困窮',r:'こんきゅう',e:'destitution'}]},
  {id:1332,k:'嬉',m:'glad',on:'キ',ku:'うれ-',lv:'N1',st:15,cat:'feeling',rad:'女',mn:'Woman + pleasure = glad',ex:[{w:'嬉しい',r:'うれしい',e:'glad'},{w:'嬉々',r:'きき',e:'gleefully'}]},
  {id:1333,k:'稀',m:'rare / dilute',on:'キ',ku:'まれ',lv:'N1',st:12,cat:'description',rad:'禾',mn:'Grain + cloth = rare',ex:[{w:'稀',r:'まれ',e:'rare'},{w:'稀有',r:'けう',e:'rare / unusual'}]},
  {id:1334,k:'幾',m:'how many / some',on:'キ',ku:'いく-',lv:'N1',st:12,cat:'other',rad:'幺',mn:'Thread + spear = how many',ex:[{w:'幾つ',r:'いくつ',e:'how many'},{w:'幾ら',r:'いくら',e:'how much'}]},
  {id:1335,k:'忌',m:'mourning / dislike',on:'キ',ku:'い-',lv:'N1',st:7,cat:'other',rad:'心',mn:'Heart + self = dislike',ex:[{w:'忌む',r:'いむ',e:'to dislike'},{w:'忌避',r:'きひ',e:'avoidance'}]},
  {id:1336,k:'几',m:'desk / table',on:'キ',ku:'',lv:'N1',st:2,cat:'other',rad:'几',mn:'Small table shape = table',ex:[{w:'几帳面',r:'きちょうめん',e:'meticulous'},{w:'几案',r:'きあん',e:'desk'}]},
  {id:1337,k:'騎',m:'ride (horse) / horseman',on:'キ',ku:'',lv:'N1',st:18,cat:'action',rad:'馬',mn:'Horse + strange = ride horse',ex:[{w:'騎手',r:'きしゅ',e:'jockey'},{w:'騎馬',r:'きば',e:'horseback riding'}]},
  {id:1338,k:'欣',m:'joy / delight',on:'キン',ku:'よろこ-',lv:'N1',st:8,cat:'feeling',rad:'欠',mn:'Yawn + axe = joy',ex:[{w:'欣喜',r:'きんき',e:'great joy'},{w:'欣然',r:'きんぜん',e:'joyfully'}]},
  {id:1339,k:'琴',m:'harp / koto',on:'キン',ku:'こと',lv:'N1',st:12,cat:'art',rad:'玉',mn:'Jewel + now = harp',ex:[{w:'琴',r:'こと',e:'koto'},{w:'琴線',r:'きんせん',e:'heartstrings'}]},
  {id:1340,k:'謹',m:'respectful',on:'キン',ku:'つつし-',lv:'N1',st:17,cat:'feeling',rad:'言',mn:'Words + care = respectful',ex:[{w:'謹慎',r:'きんしん',e:'confinement'},{w:'謹賀',r:'きんが',e:'respectful celebration'}]},
  {id:1341,k:'欽',m:'revere / admire',on:'キン',ku:'',lv:'N1',st:12,cat:'feeling',rad:'欠',mn:'Yawn + metal = revere',ex:[{w:'欽慕',r:'きんぼ',e:'reverence'},{w:'欽定',r:'きんてい',e:'imperial sanction'}]},
  {id:1342,k:'僅',m:'slightly / barely',on:'キン',ku:'わず-',lv:'N1',st:13,cat:'description',rad:'人',mn:'Person + careful = barely',ex:[{w:'僅か',r:'わずか',e:'slight / barely'},{w:'僅差',r:'きんさ',e:'narrow margin'}]},
  {id:1343,k:'窟',m:'cave / den',on:'クツ',ku:'',lv:'N1',st:13,cat:'place',rad:'穴',mn:'Hole + exit = cave',ex:[{w:'洞窟',r:'どうくつ',e:'cave'},{w:'岩窟',r:'がんくつ',e:'rock cave'}]},
  {id:1344,k:'薫',m:'fragrant / scent',on:'クン',ku:'かお-',lv:'N1',st:16,cat:'nature',rad:'艸',mn:'Grass + military = fragrant',ex:[{w:'薫る',r:'かおる',e:'to be fragrant'},{w:'薫風',r:'くんぷう',e:'fragrant breeze'}]},
  {id:1345,k:'繰',m:'reel / wind',on:'ソウ',ku:'く-',lv:'N1',st:19,cat:'action',rad:'糸',mn:'Thread + nest = reel',ex:[{w:'繰る',r:'くる',e:'to reel'},{w:'繰り返す',r:'くりかえす',e:'to repeat'}]},
  {id:1346,k:'桑',m:'mulberry',on:'ソウ',ku:'くわ',lv:'N1',st:10,cat:'nature',rad:'木',mn:'Three hands + tree = mulberry',ex:[{w:'桑',r:'くわ',e:'mulberry'},{w:'桑畑',r:'くわばたけ',e:'mulberry field'}]},
  {id:1347,k:'鍬',m:'hoe',on:'シュウ',ku:'くわ',lv:'N1',st:17,cat:'other',rad:'金',mn:'Metal + gather = hoe',ex:[{w:'鍬',r:'くわ',e:'hoe'},{w:'鍬入れ',r:'くわいれ',e:'groundbreaking ceremony'}]},
  {id:1348,k:'稽',m:'think / detain',on:'ケイ',ku:'',lv:'N1',st:15,cat:'action',rad:'禾',mn:'Grain + old = think',ex:[{w:'稽古',r:'けいこ',e:'practice'},{w:'滑稽',r:'こっけい',e:'comical'}]},
  {id:1349,k:'詣',m:'visit (a shrine)',on:'ケイ',ku:'もう-',lv:'N1',st:13,cat:'action',rad:'言',mn:'Words + reach = visit shrine',ex:[{w:'詣でる',r:'もうでる',e:'to visit a shrine'},{w:'参詣',r:'さんけい',e:'shrine visit'}]},
  {id:1350,k:'憩',m:'rest / repose',on:'ケイ',ku:'いこ-',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + self = rest',ex:[{w:'憩う',r:'いこう',e:'to rest'},{w:'休憩',r:'きゅうけい',e:'rest break'}]},
  {id:1351,k:'蛍',m:'firefly',on:'ケイ',ku:'ほたる',lv:'N1',st:11,cat:'nature',rad:'虫',mn:'Insect + fire = firefly',ex:[{w:'蛍',r:'ほたる',e:'firefly'},{w:'蛍光',r:'けいこう',e:'fluorescence'}]},
  {id:1352,k:'惧',m:'fear / dread',on:'グ',ku:'おそ-',lv:'N1',st:11,cat:'feeling',rad:'心',mn:'Heart + bird = fear',ex:[{w:'危惧',r:'きぐ',e:'apprehension'},{w:'懸念惧',r:'けねんぐ',e:'concern'}]},
  {id:1353,k:'拳',m:'fist',on:'ケン',ku:'こぶし',lv:'N1',st:10,cat:'body',rad:'手',mn:'Hand + rice = fist',ex:[{w:'拳',r:'こぶし',e:'fist'},{w:'拳銃',r:'けんじゅう',e:'pistol'}]},
  {id:1354,k:'繭',m:'cocoon',on:'ケン',ku:'まゆ',lv:'N1',st:18,cat:'nature',rad:'糸',mn:'Thread + grass = cocoon',ex:[{w:'繭',r:'まゆ',e:'cocoon'},{w:'繭玉',r:'まゆだま',e:'cocoon ball'}]},
  {id:1355,k:'硯',m:'inkstone',on:'ケン',ku:'すずり',lv:'N1',st:12,cat:'art',rad:'石',mn:'Stone + see = inkstone',ex:[{w:'硯',r:'すずり',e:'inkstone'},{w:'硯箱',r:'すずりばこ',e:'inkstone box'}]},
  {id:1356,k:'弦',m:'bowstring / chord',on:'ゲン',ku:'つる',lv:'N1',st:8,cat:'art',rad:'弓',mn:'Bow + private = bowstring',ex:[{w:'弦',r:'つる',e:'bowstring'},{w:'三味線',r:'しゃみせん',e:'shamisen'}]},
  {id:1357,k:'玄',m:'dark / mysterious',on:'ゲン',ku:'',lv:'N1',st:5,cat:'description',rad:'玄',mn:'Twisted thread = dark',ex:[{w:'玄関',r:'げんかん',e:'entrance hall'},{w:'玄人',r:'くろうと',e:'expert'}]},
  {id:1358,k:'虎',m:'tiger',on:'コ',ku:'とら',lv:'N1',st:8,cat:'nature',rad:'虎',mn:'Tiger shape = tiger',ex:[{w:'虎',r:'とら',e:'tiger'},{w:'虎の穴',r:'とらのあな',e:'tiger\'s den'}]},
  {id:1359,k:'股',m:'crotch / thigh',on:'コ',ku:'また',lv:'N1',st:8,cat:'body',rad:'月',mn:'Body + branch = crotch',ex:[{w:'股',r:'また',e:'crotch'},{w:'股関節',r:'こかんせつ',e:'hip joint'}]},
  {id:1360,k:'弧',m:'arc / bow',on:'コ',ku:'',lv:'N1',st:9,cat:'other',rad:'弓',mn:'Bow + melon = arc',ex:[{w:'弧',r:'こ',e:'arc'},{w:'弧を描く',r:'こをえがく',e:'to draw an arc'}]},
  {id:1361,k:'糊',m:'paste / starch',on:'コ',ku:'のり',lv:'N1',st:15,cat:'other',rad:'米',mn:'Rice + lake = paste',ex:[{w:'糊',r:'のり',e:'paste'},{w:'糊口',r:'ここう',e:'barely making a living'}]},
  {id:1362,k:'鼓',m:'drum',on:'コ',ku:'つづみ',lv:'N1',st:13,cat:'art',rad:'壴',mn:'Drum + branch = drum',ex:[{w:'鼓',r:'つづみ',e:'hand drum'},{w:'太鼓',r:'たいこ',e:'drum'}]},
  {id:1363,k:'倣',m:'imitate / copy',on:'ホウ',ku:'なら-',lv:'N1',st:10,cat:'action',rad:'人',mn:'Person + direction = imitate',ex:[{w:'倣う',r:'ならう',e:'to imitate'},{w:'模倣',r:'もほう',e:'imitation'}]},
  {id:1364,k:'勾',m:'hook / curve',on:'コウ',ku:'',lv:'N1',st:4,cat:'other',rad:'勺',mn:'Ladle shape = hook',ex:[{w:'勾配',r:'こうばい',e:'gradient'},{w:'勾留',r:'こうりゅう',e:'detention'}]},
  {id:1365,k:'垢',m:'dirt / filth',on:'コウ',ku:'あか',lv:'N1',st:9,cat:'other',rad:'土',mn:'Earth + reach = dirt',ex:[{w:'垢',r:'あか',e:'dirt / grime'},{w:'無垢',r:'むく',e:'pure / innocent'}]},
  {id:1366,k:'坑',m:'pit / mine',on:'コウ',ku:'',lv:'N1',st:7,cat:'place',rad:'土',mn:'Earth + oppose = pit',ex:[{w:'坑道',r:'こうどう',e:'mine tunnel'},{w:'坑夫',r:'こうふ',e:'miner'}]},
  {id:1367,k:'梗',m:'outline / infarction',on:'コウ',ku:'',lv:'N1',st:11,cat:'other',rad:'木',mn:'Wood + more = outline',ex:[{w:'梗概',r:'こうがい',e:'outline'},{w:'脳梗塞',r:'のうこうそく',e:'cerebral infarction'}]},
  {id:1368,k:'綱',m:'rope / principle',on:'コウ',ku:'つな',lv:'N1',st:14,cat:'other',rad:'糸',mn:'Thread + hill = rope',ex:[{w:'綱',r:'つな',e:'rope'},{w:'綱領',r:'こうりょう',e:'platform / principles'}]},
  {id:1369,k:'酷',m:'cruel',on:'コク',ku:'ひど-',lv:'N1',st:14,cat:'description',rad:'酉',mn:'Wine + tell = cruel',ex:[{w:'酷い',r:'ひどい',e:'cruel'},{w:'酷使',r:'こくし',e:'overuse'}]},
  {id:1370,k:'惚',m:'fall in love / senile',on:'コツ',ku:'ほれ-',lv:'N1',st:11,cat:'feeling',rad:'心',mn:'Heart + nothing = fall in love',ex:[{w:'惚れる',r:'ほれる',e:'to fall in love'},{w:'惚け',r:'ぼけ',e:'senility'}]},
  {id:1371,k:'渾',m:'all / muddy',on:'コン',ku:'',lv:'N1',st:12,cat:'other',rad:'水',mn:'Water + military = all',ex:[{w:'渾身',r:'こんしん',e:'with all one\'s might'},{w:'渾然',r:'こんぜん',e:'all together'}]},
  {id:1372,k:'墾',m:'reclaim land',on:'コン',ku:'',lv:'N1',st:16,cat:'action',rad:'土',mn:'Earth + wild boar = reclaim',ex:[{w:'開墾',r:'かいこん',e:'land reclamation'},{w:'墾田',r:'こんでん',e:'reclaimed land'}]},
  {id:1373,k:'些',m:'trivial / a little',on:'サ',ku:'',lv:'N1',st:7,cat:'description',rad:'二',mn:'Two + work = trivial',ex:[{w:'些細',r:'ささい',e:'trivial'},{w:'些少',r:'さしょう',e:'trifling amount'}]},
  {id:1374,k:'嵯',m:'steep / rugged',on:'サ',ku:'',lv:'N1',st:13,cat:'description',rad:'山',mn:'Mountain + left = steep',ex:[{w:'嵯峨',r:'さが',e:'rugged'},{w:'嵯峨野',r:'さがの',e:'Sagano area'}]},
  {id:1375,k:'坐',m:'sit / be located',on:'ザ',ku:'すわ-',lv:'N1',st:7,cat:'action',rad:'土',mn:'Earth + people = sit',ex:[{w:'坐る',r:'すわる',e:'to sit'},{w:'坐禅',r:'ざぜん',e:'Zen meditation'}]},
  {id:1376,k:'擦',m:'rub / scrape',on:'サツ',ku:'こす-・す-',lv:'N1',st:17,cat:'action',rad:'手',mn:'Hand + inspect = rub',ex:[{w:'擦る',r:'こする',e:'to rub'},{w:'摩擦',r:'まさつ',e:'friction'}]},
  {id:1377,k:'撒',m:'scatter / sprinkle',on:'サン',ku:'ま-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + release = scatter',ex:[{w:'撒く',r:'まく',e:'to scatter'},{w:'撒布',r:'さんぷ',e:'sprinkling'}]},
  {id:1378,k:'斬',m:'cut / behead',on:'ザン',ku:'き-',lv:'N1',st:11,cat:'action',rad:'斤',mn:'Axe + vehicle = cut',ex:[{w:'斬る',r:'きる',e:'to cut (with sword)'},{w:'斬新',r:'ざんしん',e:'novel / innovative'}]},
  {id:1379,k:'伺',m:'visit / ask humbly',on:'シ',ku:'うかが-',lv:'N1',st:7,cat:'action',rad:'人',mn:'Person + next = visit humbly',ex:[{w:'伺う',r:'うかがう',e:'to visit humbly'},{w:'伺い',r:'うかがい',e:'inquiry (humble)'}]},
  {id:1380,k:'嗜',m:'have a taste for',on:'シ',ku:'たしな-',lv:'N1',st:13,cat:'action',rad:'口',mn:'Mouth + taste = have taste for',ex:[{w:'嗜む',r:'たしなむ',e:'to have a taste for'},{w:'嗜好',r:'しこう',e:'taste / preference'}]},
  {id:1381,k:'摯',m:'sincere / earnest',on:'シ',ku:'',lv:'N1',st:15,cat:'description',rad:'手',mn:'Hand + sincere = earnest',ex:[{w:'真摯',r:'しんし',e:'sincere'},{w:'摯実',r:'しじつ',e:'earnest and faithful'}]},
  {id:1382,k:'賜',m:'bestow / grant',on:'シ',ku:'たまわ-',lv:'N1',st:15,cat:'action',rad:'貝',mn:'Shell + easy = bestow',ex:[{w:'賜る',r:'たまわる',e:'to be bestowed'},{w:'下賜',r:'かし',e:'imperial grant'}]},
  {id:1383,k:'肆',m:'four / freely',on:'シ',ku:'',lv:'N1',st:13,cat:'number',rad:'聿',mn:'Pen + four = four',ex:[{w:'肆',r:'し',e:'four (formal)'},{w:'放肆',r:'ほうし',e:'recklessness'}]},
  {id:1384,k:'疾',m:'illness / swift',on:'シツ',ku:'',lv:'N1',st:10,cat:'health',rad:'疒',mn:'Sickbed + arrow = swift illness',ex:[{w:'疾病',r:'しっぺい',e:'disease'},{w:'疾走',r:'しっそう',e:'sprint'}]},
  {id:1385,k:'芝',m:'lawn / sod',on:'シ',ku:'しば',lv:'N1',st:6,cat:'nature',rad:'艸',mn:'Grass + arm = lawn',ex:[{w:'芝生',r:'しばふ',e:'lawn'},{w:'芝居',r:'しばい',e:'theater / play'}]},
  {id:1386,k:'縞',m:'stripe / plaid',on:'コウ',ku:'しま',lv:'N1',st:16,cat:'art',rad:'糸',mn:'Thread + island = stripe',ex:[{w:'縞',r:'しま',e:'stripe'},{w:'縞模様',r:'しまもよう',e:'striped pattern'}]},
  {id:1387,k:'雫',m:'drop (of water)',on:'ダ',ku:'しずく',lv:'N1',st:11,cat:'nature',rad:'雨',mn:'Rain + under = drop',ex:[{w:'雫',r:'しずく',e:'drop of water'},{w:'水雫',r:'みずしずく',e:'water drop'}]},
  {id:1388,k:'慕',m:'yearn / long for',on:'ボ',ku:'した-',lv:'N1',st:14,cat:'feeling',rad:'心',mn:'Heart + cover = yearn',ex:[{w:'慕う',r:'したう',e:'to yearn for'},{w:'思慕',r:'しぼ',e:'yearning'}]},
  {id:1389,k:'渋',m:'astringent',on:'ジュウ',ku:'しぶ-',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + stop = astringent',ex:[{w:'渋い',r:'しぶい',e:'astringent / refined'},{w:'渋滞',r:'じゅうたい',e:'traffic jam'}]},
  {id:1390,k:'蛇',m:'snake',on:'ジャ・ダ',ku:'へび',lv:'N1',st:11,cat:'nature',rad:'虫',mn:'Insect + snake = snake',ex:[{w:'蛇',r:'へび',e:'snake'},{w:'蛇口',r:'じゃぐち',e:'faucet'}]},
  {id:1391,k:'邪',m:'evil / wicked',on:'ジャ',ku:'',lv:'N1',st:8,cat:'other',rad:'邑',mn:'Town + can = evil',ex:[{w:'邪魔',r:'じゃま',e:'obstacle'},{w:'邪悪',r:'じゃあく',e:'evil'}]},
  {id:1392,k:'煮',m:'boil / cook',on:'シャ',ku:'に-',lv:'N1',st:12,cat:'food',rad:'火',mn:'Fire + person = boil',ex:[{w:'煮る',r:'にる',e:'to boil'},{w:'煮物',r:'にもの',e:'boiled dish'}]},
  {id:1393,k:'遮',m:'block / obstruct',on:'シャ',ku:'さえぎ-',lv:'N1',st:14,cat:'action',rad:'辵',mn:'Walk + this = block',ex:[{w:'遮る',r:'さえぎる',e:'to block'},{w:'遮光',r:'しゃこう',e:'light blocking'}]},
  {id:1394,k:'謝',m:'apologize / thank',on:'シャ',ku:'あやま-',lv:'N1',st:17,cat:'action',rad:'言',mn:'Words + shoot = apologize',ex:[{w:'謝る',r:'あやまる',e:'to apologize'},{w:'感謝',r:'かんしゃ',e:'gratitude'}]},
  {id:1395,k:'灼',m:'burn / blaze',on:'シャク',ku:'や-',lv:'N1',st:7,cat:'action',rad:'火',mn:'Fire + spoon = burn',ex:[{w:'灼熱',r:'しゃくねつ',e:'blazing heat'},{w:'灼ける',r:'やける',e:'to burn'}]},
  {id:1396,k:'錫',m:'tin / staff',on:'シャク',ku:'すず',lv:'N1',st:16,cat:'other',rad:'金',mn:'Metal + easy = tin',ex:[{w:'錫',r:'すず',e:'tin'},{w:'錫杖',r:'しゃくじょう',e:'monk\'s staff'}]},
  {id:1397,k:'釈',m:'explain',on:'シャク',ku:'とく-',lv:'N1',st:11,cat:'action',rad:'米',mn:'Rice + explain = explain',ex:[{w:'解釈',r:'かいしゃく',e:'interpretation'},{w:'釈迦',r:'しゃか',e:'Shakyamuni / Buddha'}]},
  {id:1398,k:'爵',m:'peerage / rank',on:'シャク',ku:'',lv:'N1',st:17,cat:'other',rad:'爪',mn:'Claw + ceremony = rank',ex:[{w:'爵位',r:'しゃくい',e:'peerage'},{w:'伯爵',r:'はくしゃく',e:'count / earl'}]},
  {id:1399,k:'充',m:'fill',on:'ジュウ',ku:'あ-',lv:'N1',st:6,cat:'action',rad:'儿',mn:'Person + top = fill',ex:[{w:'充実',r:'じゅうじつ',e:'fulfillment'},{w:'補充',r:'ほじゅう',e:'replenishment'}]},
  {id:1400,k:'縦',m:'vertical / at will',on:'ジュウ',ku:'たて',lv:'N1',st:16,cat:'other',rad:'糸',mn:'Thread + follow = vertical',ex:[{w:'縦',r:'たて',e:'vertical'},{w:'縦断',r:'じゅうだん',e:'cutting through vertically'}]},
  {id:1401,k:'汁',m:'juice / soup',on:'ジュウ',ku:'しる',lv:'N1',st:5,cat:'food',rad:'水',mn:'Water + ten = juice',ex:[{w:'汁',r:'しる',e:'juice / soup'},{w:'果汁',r:'かじゅう',e:'fruit juice'}]},
  {id:1402,k:'盾',m:'shield',on:'ジュン',ku:'たて',lv:'N1',st:9,cat:'other',rad:'目',mn:'Eye + ten = shield',ex:[{w:'盾',r:'たて',e:'shield'},{w:'矛盾',r:'むじゅん',e:'contradiction'}]},
  {id:1403,k:'殉',m:'die for / martyr',on:'ジュン',ku:'',lv:'N1',st:10,cat:'action',rad:'歹',mn:'Bone + follow = martyr',ex:[{w:'殉職',r:'じゅんしょく',e:'dying in the line of duty'},{w:'殉教',r:'じゅんきょう',e:'martyrdom'}]},
  {id:1404,k:'淳',m:'pure / honest',on:'ジュン',ku:'',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + honest = pure',ex:[{w:'淳朴',r:'じゅんぼく',e:'simple and honest'},{w:'淳化',r:'じゅんか',e:'purification'}]},
  {id:1405,k:'醸',m:'brew / ferment',on:'ジョウ',ku:'かも-',lv:'N1',st:20,cat:'action',rad:'酉',mn:'Wine + let = brew',ex:[{w:'醸造',r:'じょうぞう',e:'brewing'},{w:'醸成',r:'じょうせい',e:'creating / brewing'}]},
  {id:1406,k:'升',m:'measuring box',on:'ショウ',ku:'ます',lv:'N1',st:4,cat:'other',rad:'升',mn:'Measuring box shape = measure',ex:[{w:'升',r:'ます',e:'measuring box'},{w:'一升',r:'いっしょう',e:'one sho (unit)'}]},
  {id:1407,k:'彰',m:'manifest / honor',on:'ショウ',ku:'',lv:'N1',st:14,cat:'other',rad:'彡',mn:'Hair + bright = honor',ex:[{w:'表彰',r:'ひょうしょう',e:'commendation'},{w:'彰徳',r:'しょうとく',e:'recognizing virtue'}]},
  {id:1408,k:'憧',m:'yearn / admire',on:'ドウ',ku:'あこが-',lv:'N1',st:15,cat:'feeling',rad:'心',mn:'Heart + child = yearn',ex:[{w:'憧れる',r:'あこがれる',e:'to yearn for'},{w:'憧憬',r:'しょうけい',e:'longing'}]},
  {id:1409,k:'宵',m:'evening / night',on:'ショウ',ku:'よい',lv:'N1',st:10,cat:'other',rad:'宀',mn:'Roof + small = evening',ex:[{w:'宵',r:'よい',e:'evening'},{w:'宵闇',r:'よいやみ',e:'dusk'}]},
  {id:1410,k:'哨',m:'sentinel / outpost',on:'ショウ',ku:'',lv:'N1',st:10,cat:'other',rad:'口',mn:'Mouth + cut = sentinel',ex:[{w:'哨戒',r:'しょうかい',e:'patrol'},{w:'歩哨',r:'ほしょう',e:'sentry'}]},
  {id:1411,k:'樵',m:'woodcutter',on:'ショウ',ku:'きこり',lv:'N1',st:16,cat:'person',rad:'木',mn:'Wood + burn = woodcutter',ex:[{w:'樵',r:'きこり',e:'woodcutter'},{w:'樵夫',r:'しょうふ',e:'woodcutter'}]},
  {id:1412,k:'礁',m:'reef',on:'ショウ',ku:'',lv:'N1',st:17,cat:'nature',rad:'石',mn:'Stone + burnt = reef',ex:[{w:'暗礁',r:'あんしょう',e:'hidden reef'},{w:'珊瑚礁',r:'さんごしょう',e:'coral reef'}]},
  {id:1413,k:'詔',m:'imperial decree',on:'ショウ',ku:'みことのり',lv:'N1',st:12,cat:'other',rad:'言',mn:'Words + call = decree',ex:[{w:'詔',r:'みことのり',e:'imperial decree'},{w:'詔勅',r:'しょうちょく',e:'imperial edict'}]},
  {id:1414,k:'奨',m:'encourage / prize',on:'ショウ',ku:'',lv:'N1',st:13,cat:'action',rad:'大',mn:'Big + dog = encourage',ex:[{w:'奨励',r:'しょうれい',e:'encouragement'},{w:'奨学金',r:'しょうがくきん',e:'scholarship'}]},
  {id:1415,k:'湘',m:'river name',on:'ショウ',ku:'',lv:'N1',st:12,cat:'place',rad:'水',mn:'Water + assist = river',ex:[{w:'湘南',r:'しょうなん',e:'Shonan region'},{w:'湘江',r:'しょうこう',e:'Xiang River'}]},
  {id:1416,k:'硝',m:'saltpeter / glass',on:'ショウ',ku:'',lv:'N1',st:12,cat:'other',rad:'石',mn:'Stone + small = saltpeter',ex:[{w:'硝酸',r:'しょうさん',e:'nitric acid'},{w:'硝子',r:'ガラス',e:'glass'}]},
  {id:1417,k:'称',m:'name / praise',on:'ショウ',ku:'たた-',lv:'N1',st:10,cat:'action',rad:'禾',mn:'Grain + voice = name',ex:[{w:'称える',r:'たたえる',e:'to praise'},{w:'名称',r:'めいしょう',e:'name'}]},
  {id:1418,k:'醤',m:'soy sauce / paste',on:'ショウ',ku:'ひしお',lv:'N1',st:17,cat:'food',rad:'酉',mn:'Wine + tree = paste',ex:[{w:'醤油',r:'しょうゆ',e:'soy sauce'},{w:'醤',r:'ひしお',e:'fermented paste'}]},
  {id:1419,k:'祥',m:'auspicious',on:'ショウ',ku:'',lv:'N1',st:10,cat:'other',rad:'示',mn:'Altar + sheep = auspicious',ex:[{w:'吉祥',r:'きっしょう',e:'good omen'},{w:'発祥',r:'はっしょう',e:'origin'}]},
  {id:1420,k:'肖',m:'resemble / small',on:'ショウ',ku:'',lv:'N1',st:7,cat:'description',rad:'月',mn:'Body + small = resemble',ex:[{w:'肖像',r:'しょうぞう',e:'portrait'},{w:'不肖',r:'ふしょう',e:'unworthy'}]},
  {id:1421,k:'梢',m:'treetop / tip',on:'ショウ',ku:'こずえ',lv:'N1',st:11,cat:'nature',rad:'木',mn:'Wood + little = treetop',ex:[{w:'梢',r:'こずえ',e:'treetop'},{w:'木梢',r:'こずえ',e:'treetop'}]},
  {id:1422,k:'浸',m:'soak / permeate',on:'シン',ku:'ひた-・し-',lv:'N1',st:10,cat:'action',rad:'水',mn:'Water + broom = soak',ex:[{w:'浸す',r:'ひたす',e:'to soak'},{w:'浸透',r:'しんとう',e:'permeation'}]},
  {id:1423,k:'深',m:'deep',on:'シン',ku:'ふか-',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + cave = deep',ex:[{w:'深い',r:'ふかい',e:'deep'},{w:'深夜',r:'しんや',e:'late night'}]},
  {id:1424,k:'辛',m:'spicy / painful',on:'シン',ku:'から-・つら-',lv:'N1',st:7,cat:'description',rad:'辛',mn:'Standing needle = spicy',ex:[{w:'辛い',r:'からい',e:'spicy'},{w:'辛抱',r:'しんぼう',e:'endurance'}]},
  {id:1425,k:'娠',m:'pregnancy',on:'シン',ku:'',lv:'N1',st:10,cat:'health',rad:'女',mn:'Woman + vibrate = pregnancy',ex:[{w:'妊娠',r:'にんしん',e:'pregnancy'},{w:'娠動',r:'しんどう',e:'fetal movement'}]},
  {id:1426,k:'審',m:'judge / examine',on:'シン',ku:'',lv:'N1',st:15,cat:'action',rad:'宀',mn:'Roof + divide = judge',ex:[{w:'審判',r:'しんぱん',e:'referee / judgment'},{w:'審査',r:'しんさ',e:'examination'}]},
  {id:1427,k:'薪',m:'firewood',on:'シン',ku:'たきぎ',lv:'N1',st:16,cat:'nature',rad:'艸',mn:'Grass + new = firewood',ex:[{w:'薪',r:'たきぎ',e:'firewood'},{w:'薪水',r:'しんすい',e:'firewood and water'}]},
  {id:1428,k:'迅',m:'swift',on:'ジン',ku:'',lv:'N1',st:6,cat:'description',rad:'辵',mn:'Walk + snake = swift',ex:[{w:'迅速',r:'じんそく',e:'swift'},{w:'迅雷',r:'じんらい',e:'quick thunder'}]},
  {id:1429,k:'尽',m:'exhaust / all',on:'ジン',ku:'つ-',lv:'N1',st:6,cat:'action',rad:'尸',mn:'Body + fire = exhaust',ex:[{w:'尽くす',r:'つくす',e:'to do one\'s best'},{w:'無尽蔵',r:'むじんぞう',e:'inexhaustible'}]},
  {id:1430,k:'甚',m:'extreme / very',on:'ジン',ku:'はなは-',lv:'N1',st:9,cat:'description',rad:'甘',mn:'Sweet + spoon = extreme',ex:[{w:'甚だしい',r:'はなはだしい',e:'extreme'},{w:'甚大',r:'じんだい',e:'enormous'}]},
  {id:1431,k:'壬',m:'9th stem / north',on:'ジン',ku:'みずのえ',lv:'N1',st:4,cat:'other',rad:'士',mn:'Samurai + one = stem',ex:[{w:'壬',r:'じん',e:'9th stem'},{w:'壬申',r:'じんしん',e:'Jinshin War'}]},
  {id:1432,k:'粋',m:'pure / chic',on:'スイ',ku:'いき',lv:'N1',st:10,cat:'description',rad:'米',mn:'Rice + ten = pure',ex:[{w:'粋',r:'いき',e:'chic'},{w:'純粋',r:'じゅんすい',e:'pure'}]},
  {id:1433,k:'帥',m:'commander',on:'スイ',ku:'',lv:'N1',st:9,cat:'person',rad:'巾',mn:'Cloth + lead = commander',ex:[{w:'総帥',r:'そうすい',e:'commander-in-chief'},{w:'師帥',r:'しすい',e:'commander'}]},
  {id:1434,k:'翠',m:'green / kingfisher',on:'スイ',ku:'みどり',lv:'N1',st:14,cat:'color',rad:'羽',mn:'Wings + short = kingfisher',ex:[{w:'翠',r:'みどり',e:'green'},{w:'翡翠',r:'ひすい',e:'jade'}]},
  {id:1435,k:'枢',m:'pivot / hinge',on:'スウ',ku:'くるる',lv:'N1',st:8,cat:'other',rad:'木',mn:'Wood + zone = pivot',ex:[{w:'枢機',r:'すうき',e:'pivot / cardinal'},{w:'枢密',r:'すうみつ',e:'privy council'}]},
  {id:1436,k:'崇',m:'worship / revere',on:'スウ',ku:'あが-',lv:'N1',st:11,cat:'feeling',rad:'山',mn:'Mountain + show = worship',ex:[{w:'崇拝',r:'すうはい',e:'worship'},{w:'崇める',r:'あがめる',e:'to revere'}]},
  {id:1437,k:'裾',m:'hem / foot of mountain',on:'キョ',ku:'すそ',lv:'N1',st:13,cat:'other',rad:'衣',mn:'Clothes + residence = hem',ex:[{w:'裾',r:'すそ',e:'hem'},{w:'裾野',r:'すその',e:'foot of a mountain'}]},
  {id:1438,k:'錘',m:'spindle / weight',on:'スイ',ku:'つむ',lv:'N1',st:16,cat:'other',rad:'金',mn:'Metal + heavy = spindle',ex:[{w:'錘',r:'つむ',e:'spindle'},{w:'重錘',r:'おもり',e:'counterweight'}]},
  {id:1439,k:'醒',m:'sober up / wake',on:'セイ',ku:'さ-',lv:'N1',st:16,cat:'action',rad:'酉',mn:'Wine + bright = sober up',ex:[{w:'醒める',r:'さめる',e:'to sober up'},{w:'覚醒',r:'かくせい',e:'awakening'}]},
  {id:1440,k:'脊',m:'spine / backbone',on:'セキ',ku:'せ',lv:'N1',st:10,cat:'body',rad:'月',mn:'Body + cross = spine',ex:[{w:'脊椎',r:'せきつい',e:'spine'},{w:'脊髄',r:'せきずい',e:'spinal cord'}]},
  {id:1441,k:'跡',m:'trace / footprint',on:'セキ',ku:'あと',lv:'N1',st:13,cat:'other',rad:'足',mn:'Foot + transform = trace',ex:[{w:'跡',r:'あと',e:'trace'},{w:'痕跡',r:'こんせき',e:'trace / mark'}]},
  {id:1442,k:'拙',m:'unskilled / my (humble)',on:'セツ',ku:'つたな-',lv:'N1',st:8,cat:'description',rad:'手',mn:'Hand + exit = unskilled',ex:[{w:'拙い',r:'つたない',e:'unskilled'},{w:'拙者',r:'せっしゃ',e:'I (humble samurai)'}]},
  {id:1443,k:'摂',m:'take in',on:'セツ',ku:'と-',lv:'N1',st:13,cat:'action',rad:'手',mn:'Hand + ear = take in',ex:[{w:'摂取',r:'せっしゅ',e:'intake'},{w:'摂食',r:'せっしょく',e:'eating'}]},
  {id:1444,k:'甥',m:'nephew',on:'セイ',ku:'おい',lv:'N1',st:12,cat:'person',rad:'生',mn:'Born + man = nephew',ex:[{w:'甥',r:'おい',e:'nephew'},{w:'甥御',r:'おいご',e:'nephew (honorific)'}]},
  {id:1445,k:'繕',m:'mend / repair',on:'ゼン',ku:'つくろ-',lv:'N1',st:18,cat:'action',rad:'糸',mn:'Thread + good = mend',ex:[{w:'繕う',r:'つくろう',e:'to mend'},{w:'修繕',r:'しゅうぜん',e:'repair'}]},
  {id:1446,k:'膳',m:'meal tray',on:'ゼン',ku:'',lv:'N1',st:16,cat:'other',rad:'月',mn:'Body + good = tray',ex:[{w:'膳',r:'ぜん',e:'meal tray'},{w:'お膳立て',r:'おぜんだて',e:'preparation'}]},
  {id:1447,k:'噌',m:'miso',on:'ソ',ku:'',lv:'N1',st:15,cat:'food',rad:'口',mn:'Mouth + ancestor = miso',ex:[{w:'味噌',r:'みそ',e:'miso'},{w:'味噌汁',r:'みそしる',e:'miso soup'}]},
  {id:1448,k:'遡',m:'go upstream / trace back',on:'ソ',ku:'さかのぼ-',lv:'N1',st:16,cat:'action',rad:'辵',mn:'Walk + reverse = go upstream',ex:[{w:'遡る',r:'さかのぼる',e:'to go upstream'},{w:'遡及',r:'そきゅう',e:'retroactivity'}]},
  {id:1449,k:'蘇',m:'revive / perilla',on:'ソ',ku:'よみがえ-',lv:'N1',st:20,cat:'action',rad:'艸',mn:'Grass + fish = revive',ex:[{w:'蘇る',r:'よみがえる',e:'to revive'},{w:'蘇生',r:'そせい',e:'resuscitation'}]},
  {id:1450,k:'礎',m:'foundation stone',on:'ソ',ku:'いしずえ',lv:'N1',st:18,cat:'other',rad:'石',mn:'Stone + ancestor = foundation',ex:[{w:'礎',r:'いしずえ',e:'foundation stone'},{w:'基礎',r:'きそ',e:'foundation'}]},
  {id:1451,k:'訴',m:'appeal / sue',on:'ソ',ku:'うった-',lv:'N1',st:12,cat:'action',rad:'言',mn:'Words + reach = appeal',ex:[{w:'訴える',r:'うったえる',e:'to appeal / sue'},{w:'訴訟',r:'そしょう',e:'lawsuit'}]},
  {id:1452,k:'租',m:'tax / rent',on:'ソ',ku:'',lv:'N1',st:10,cat:'other',rad:'禾',mn:'Grain + elder = tax',ex:[{w:'租税',r:'そぜい',e:'taxation'},{w:'租借',r:'そしゃく',e:'lease'}]},
  {id:1453,k:'疎',m:'estranged / neglect',on:'ソ',ku:'うと-',lv:'N1',st:12,cat:'description',rad:'疋',mn:'Foot + beam = estranged',ex:[{w:'疎い',r:'うとい',e:'unfamiliar with'},{w:'疎遠',r:'そえん',e:'estrangement'}]},
  {id:1454,k:'爪',m:'claw / nail',on:'ソウ',ku:'つめ',lv:'N1',st:4,cat:'body',rad:'爪',mn:'Claw shape = claw',ex:[{w:'爪',r:'つめ',e:'nail / claw'},{w:'爪先',r:'つまさき',e:'tiptoe'}]},
  {id:1455,k:'唾',m:'saliva / spit',on:'ダ',ku:'つば',lv:'N1',st:11,cat:'body',rad:'口',mn:'Mouth + earth = saliva',ex:[{w:'唾',r:'つば',e:'saliva'},{w:'唾棄',r:'だき',e:'contempt'}]},
  {id:1456,k:'堕',m:'fall / degenerate',on:'ダ',ku:'お-',lv:'N1',st:12,cat:'action',rad:'土',mn:'Earth + left = fall',ex:[{w:'堕落',r:'だらく',e:'degeneration'},{w:'堕胎',r:'だたい',e:'abortion'}]},
  {id:1457,k:'但',m:'however / only',on:'タン',ku:'ただ-し',lv:'N1',st:7,cat:'other',rad:'人',mn:'Person + morning = however',ex:[{w:'但し',r:'ただし',e:'however'},{w:'但書き',r:'ただしがき',e:'proviso'}]},
  {id:1458,k:'棚',m:'shelf',on:'ホウ',ku:'たな',lv:'N1',st:12,cat:'other',rad:'木',mn:'Wood + friend = shelf',ex:[{w:'棚',r:'たな',e:'shelf'},{w:'棚上げ',r:'たなあげ',e:'shelving'}]},
  {id:1459,k:'弛',m:'slacken / loose',on:'チ',ku:'たる-',lv:'N1',st:6,cat:'description',rad:'弓',mn:'Bow + private = slacken',ex:[{w:'弛む',r:'たるむ',e:'to slacken'},{w:'弛緩',r:'しかん',e:'relaxation'}]},
  {id:1460,k:'綻',m:'come apart / bud',on:'タン',ku:'ほころ-',lv:'N1',st:14,cat:'action',rad:'糸',mn:'Thread + end = come apart',ex:[{w:'綻びる',r:'ほころびる',e:'to come apart'},{w:'破綻',r:'はたん',e:'collapse'}]},
  {id:1461,k:'嘲',m:'mock / ridicule',on:'チョウ',ku:'あざけ-',lv:'N1',st:15,cat:'action',rad:'口',mn:'Mouth + tide = mock',ex:[{w:'嘲る',r:'あざける',e:'to mock'},{w:'嘲笑',r:'ちょうしょう',e:'ridicule'}]},
  {id:1462,k:'猟',m:'hunt / search',on:'リョウ',ku:'',lv:'N1',st:11,cat:'action',rad:'犬',mn:'Dog + woods = hunt',ex:[{w:'猟',r:'りょう',e:'hunting'},{w:'狩猟',r:'しゅりょう',e:'hunting'}]},
  {id:1463,k:'塚',m:'mound / tumulus',on:'チョウ',ku:'つか',lv:'N1',st:12,cat:'place',rad:'土',mn:'Earth + pig = mound',ex:[{w:'塚',r:'つか',e:'mound'},{w:'貝塚',r:'かいづか',e:'shell mound'}]},
  {id:1464,k:'漬',m:'pickle / soak',on:'シ',ku:'つ-',lv:'N1',st:14,cat:'food',rad:'水',mn:'Water + seven = pickle',ex:[{w:'漬ける',r:'つける',e:'to pickle'},{w:'漬物',r:'つけもの',e:'pickled food'}]},
  {id:1465,k:'紡',m:'spin / weave',on:'ボウ',ku:'つむ-',lv:'N1',st:10,cat:'action',rad:'糸',mn:'Thread + direction = spin',ex:[{w:'紡ぐ',r:'つむぐ',e:'to spin'},{w:'紡績',r:'ぼうせき',e:'spinning'}]},
  {id:1466,k:'艇',m:'small boat',on:'テイ',ku:'',lv:'N1',st:13,cat:'other',rad:'舟',mn:'Boat + go = small boat',ex:[{w:'艇',r:'てい',e:'small boat'},{w:'潜水艇',r:'せんすいてい',e:'submarine'}]},
  {id:1467,k:'填',m:'fill in / inlay',on:'テン',ku:'',lv:'N1',st:13,cat:'action',rad:'土',mn:'Earth + true = fill in',ex:[{w:'填める',r:'はめる',e:'to fill in'},{w:'充填',r:'じゅうてん',e:'filling'}]},
  {id:1468,k:'凸',m:'convex / protruding',on:'トツ',ku:'',lv:'N1',st:5,cat:'description',rad:'凸',mn:'Protruding shape = convex',ex:[{w:'凸',r:'とつ',e:'convex'},{w:'凸凹',r:'でこぼこ',e:'bumpy'}]},
  {id:1469,k:'凹',m:'concave / hollow',on:'オウ',ku:'',lv:'N1',st:5,cat:'description',rad:'凹',mn:'Hollow shape = concave',ex:[{w:'凹',r:'おう',e:'concave'},{w:'凸凹',r:'でこぼこ',e:'bumpy'}]},
  {id:1470,k:'洞',m:'cave',on:'ドウ',ku:'ほら',lv:'N1',st:9,cat:'place',rad:'水',mn:'Water + same = cave',ex:[{w:'洞穴',r:'ほらあな',e:'cave'},{w:'洞察力',r:'どうさつりょく',e:'insight'}]},
  {id:1471,k:'峠',m:'mountain pass',on:'トウ',ku:'とうげ',lv:'N1',st:9,cat:'place',rad:'山',mn:'Mountain + up/down = pass',ex:[{w:'峠',r:'とうげ',e:'mountain pass'},{w:'峠道',r:'とうげみち',e:'pass road'}]},
  {id:1472,k:'謄',m:'copy / transcribe',on:'トウ',ku:'',lv:'N1',st:17,cat:'action',rad:'言',mn:'Words + rise = copy',ex:[{w:'謄本',r:'とうほん',e:'certified copy'},{w:'謄写',r:'とうしゃ',e:'transcription'}]},
  {id:1473,k:'撞',m:'strike / bump',on:'ドウ',ku:'つ-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + child = strike',ex:[{w:'撞く',r:'つく',e:'to strike (bell)'},{w:'撞木',r:'しゅもく',e:'mallet'}]},
  {id:1474,k:'屯',m:'stationed / gather',on:'トン',ku:'',lv:'N1',st:4,cat:'other',rad:'屮',mn:'Shoot + ground = gather',ex:[{w:'駐屯',r:'ちゅうとん',e:'stationing troops'},{w:'屯所',r:'とんしょ',e:'station'}]},
  {id:1475,k:'呑',m:'swallow / drink',on:'ドン',ku:'の-',lv:'N1',st:7,cat:'action',rad:'口',mn:'Mouth + heaven = swallow',ex:[{w:'呑む',r:'のむ',e:'to swallow'},{w:'呑気',r:'のんき',e:'easygoing'}]},
  {id:1476,k:'那',m:'what? / name',on:'ナ',ku:'',lv:'N1',st:8,cat:'other',rad:'邑',mn:'Town + can = what?',ex:[{w:'那覇',r:'なは',e:'Naha (city)'},{w:'旦那',r:'だんな',e:'husband / master'}]},
  {id:1477,k:'謎',m:'riddle / mystery',on:'メイ',ku:'なぞ',lv:'N1',st:17,cat:'other',rad:'言',mn:'Words + rice = riddle',ex:[{w:'謎',r:'なぞ',e:'riddle'},{w:'謎めく',r:'なぞめく',e:'to be mysterious'}]},
  {id:1478,k:'嘗',m:'taste / lick',on:'ショウ',ku:'な-',lv:'N1',st:14,cat:'action',rad:'口',mn:'Mouth + once = taste',ex:[{w:'嘗める',r:'なめる',e:'to lick'},{w:'嘗て',r:'かつて',e:'once upon a time'}]},
  {id:1479,k:'拗',m:'twist / sulk',on:'ヨウ',ku:'ねじ-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + turn = twist',ex:[{w:'拗れる',r:'こじれる',e:'to get complicated'},{w:'拗ねる',r:'すねる',e:'to sulk'}]},
  {id:1480,k:'濡',m:'get wet',on:'ジュ',ku:'ぬ-',lv:'N1',st:17,cat:'action',rad:'水',mn:'Water + need = get wet',ex:[{w:'濡れる',r:'ぬれる',e:'to get wet'},{w:'濡れ衣',r:'ぬれぎぬ',e:'false accusation'}]},
  {id:1481,k:'寝',m:'sleep / lie down',on:'シン',ku:'ね-',lv:'N1',st:13,cat:'action',rad:'宀',mn:'Roof + tree = sleep',ex:[{w:'寝る',r:'ねる',e:'to sleep'},{w:'寝室',r:'しんしつ',e:'bedroom'}]},
  {id:1482,k:'捻',m:'twist / turn',on:'ネン',ku:'ひね-',lv:'N1',st:11,cat:'action',rad:'手',mn:'Hand + think = twist',ex:[{w:'捻る',r:'ひねる',e:'to twist'},{w:'捻挫',r:'ねんざ',e:'sprain'}]},
  {id:1483,k:'濃',m:'thick / dark',on:'ノウ',ku:'こ-',lv:'N1',st:16,cat:'description',rad:'水',mn:'Water + abundant = thick',ex:[{w:'濃い',r:'こい',e:'thick / dark'},{w:'濃度',r:'のうど',e:'concentration'}]},
  {id:1484,k:'覇',m:'domination / champion',on:'ハ',ku:'',lv:'N1',st:19,cat:'other',rad:'雨',mn:'Rain + west + horse = dominate',ex:[{w:'覇者',r:'はしゃ',e:'champion'},{w:'制覇',r:'せいは',e:'conquest'}]},
  {id:1485,k:'廃',m:'abolish / ruin',on:'ハイ',ku:'すた-',lv:'N1',st:12,cat:'action',rad:'广',mn:'Shelter + hair = ruin',ex:[{w:'廃止',r:'はいし',e:'abolition'},{w:'廃墟',r:'はいきょ',e:'ruins'}]},
  {id:1486,k:'拝',m:'bow / worship',on:'ハイ',ku:'おが-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + white = bow',ex:[{w:'拝む',r:'おがむ',e:'to bow / pray'},{w:'参拝',r:'さんぱい',e:'visit to shrine'}]},
  {id:1487,k:'媒',m:'intermediary / go-between',on:'バイ',ku:'',lv:'N1',st:12,cat:'person',rad:'女',mn:'Woman + every = go-between',ex:[{w:'媒介',r:'ばいかい',e:'intermediary'},{w:'媒体',r:'ばいたい',e:'medium'}]},
  {id:1488,k:'漠',m:'vast / vague',on:'バク',ku:'',lv:'N1',st:13,cat:'description',rad:'水',mn:'Water + desert = vast',ex:[{w:'漠然',r:'ばくぜん',e:'vague'},{w:'砂漠',r:'さばく',e:'desert'}]},
  {id:1489,k:'縛',m:'bind / tie',on:'バク',ku:'しば-',lv:'N1',st:16,cat:'action',rad:'糸',mn:'Thread + white = bind',ex:[{w:'縛る',r:'しばる',e:'to bind'},{w:'束縛',r:'そくばく',e:'restraint'}]},
  {id:1490,k:'肌',m:'skin / texture',on:'キ',ku:'はだ',lv:'N1',st:6,cat:'body',rad:'月',mn:'Body + several = skin',ex:[{w:'肌',r:'はだ',e:'skin'},{w:'肌触り',r:'はだざわり',e:'texture'}]},
  {id:1491,k:'鉢',m:'bowl / pot',on:'ハツ',ku:'',lv:'N1',st:13,cat:'other',rad:'金',mn:'Metal + bowl = bowl',ex:[{w:'鉢',r:'はち',e:'bowl / pot'},{w:'植木鉢',r:'うえきばち',e:'flower pot'}]},
  {id:1492,k:'斑',m:'spot / patch',on:'ハン',ku:'まだら',lv:'N1',st:12,cat:'description',rad:'文',mn:'Writing + knife = patch',ex:[{w:'斑',r:'まだら',e:'spots'},{w:'斑点',r:'はんてん',e:'spot'}]},
  {id:1493,k:'氾',m:'overflow / flood',on:'ハン',ku:'',lv:'N1',st:5,cat:'action',rad:'水',mn:'Water + few = overflow',ex:[{w:'氾濫',r:'はんらん',e:'overflow / flood'},{w:'氾用',r:'はんよう',e:'widespread use'}]},
  {id:1494,k:'汎',m:'widespread / general',on:'ハン',ku:'',lv:'N1',st:6,cat:'description',rad:'水',mn:'Water + craft = widespread',ex:[{w:'汎用',r:'はんよう',e:'general purpose'},{w:'広汎',r:'こうはん',e:'widespread'}]},
  {id:1495,k:'煩',m:'vexed / troubled',on:'ハン・ボン',ku:'わずら-',lv:'N1',st:13,cat:'feeling',rad:'火',mn:'Fire + page = vexed',ex:[{w:'煩わしい',r:'わずらわしい',e:'troublesome'},{w:'煩悩',r:'ぼんのう',e:'earthly desires'}]},
  {id:1496,k:'伴',m:'accompany / partner',on:'ハン',ku:'ともな-',lv:'N1',st:7,cat:'action',rad:'人',mn:'Person + half = accompany',ex:[{w:'伴う',r:'ともなう',e:'to accompany'},{w:'同伴',r:'どうはん',e:'accompanying'}]},
  {id:1497,k:'繁',m:'busy / prosperous',on:'ハン',ku:'しげ-',lv:'N1',st:16,cat:'description',rad:'糸',mn:'Thread + every = busy',ex:[{w:'繁盛',r:'はんじょう',e:'prosperity'},{w:'繁栄',r:'はんえい',e:'prosperity'}]},
  {id:1498,k:'盤',m:'tray / disc',on:'バン',ku:'',lv:'N1',st:15,cat:'other',rad:'皿',mn:'Dish + transport = tray',ex:[{w:'盤',r:'ばん',e:'disc / tray'},{w:'基盤',r:'きばん',e:'foundation'}]},
  {id:1499,k:'扉',m:'door / page',on:'ヒ',ku:'とびら',lv:'N1',st:12,cat:'other',rad:'戸',mn:'Door + non = door',ex:[{w:'扉',r:'とびら',e:'door'},{w:'本扉',r:'ほんとびら',e:'title page'}]},
  {id:1500,k:'彼岸',m:'other shore / equinox',on:'ヒガン',ku:'',lv:'N1',st:0,cat:'other',rad:'',mn:'',ex:[{w:'彼岸',r:'ひがん',e:'equinox'},{w:'此岸',r:'しがん',e:'this world'}]},
  {id:1501,k:'碑',m:'stone monument',on:'ヒ',ku:'',lv:'N1',st:14,cat:'other',rad:'石',mn:'Stone + carve = monument',ex:[{w:'碑',r:'ひ',e:'monument'},{w:'記念碑',r:'きねんひ',e:'memorial'}]},
  {id:1502,k:'肥',m:'fat / fertile',on:'ヒ',ku:'こ-',lv:'N1',st:8,cat:'nature',rad:'月',mn:'Body + snake = fat',ex:[{w:'肥える',r:'こえる',e:'to become fat'},{w:'肥料',r:'ひりょう',e:'fertilizer'}]},
  {id:1503,k:'眉',m:'eyebrow',on:'ビ',ku:'まゆ',lv:'N1',st:9,cat:'body',rad:'目',mn:'Eye + over = eyebrow',ex:[{w:'眉',r:'まゆ',e:'eyebrow'},{w:'眉毛',r:'まゆげ',e:'eyebrow'}]},
  {id:1504,k:'膝',m:'knee',on:'シツ',ku:'ひざ',lv:'N1',st:15,cat:'body',rad:'月',mn:'Body + lacquer = knee',ex:[{w:'膝',r:'ひざ',e:'knee'},{w:'膝枕',r:'ひざまくら',e:'lap pillow'}]},
  {id:1505,k:'匹',m:'counter for animals / equal',on:'ヒツ',ku:'',lv:'N1',st:4,cat:'other',rad:'匚',mn:'Box + eight = equal',ex:[{w:'匹',r:'ひき',e:'(counter for animals)'},{w:'匹敵',r:'ひってき',e:'equal to'}]},
  {id:1506,k:'俵',m:'bale / bag',on:'ヒョウ',ku:'たわら',lv:'N1',st:10,cat:'other',rad:'人',mn:'Person + surface = bale',ex:[{w:'俵',r:'たわら',e:'straw bale'},{w:'土俵',r:'どひょう',e:'sumo ring'}]},
  {id:1507,k:'賦',m:'poem / tribute',on:'フ',ku:'',lv:'N1',st:15,cat:'art',rad:'貝',mn:'Shell + warrior = tribute',ex:[{w:'賦課',r:'ふか',e:'levy'},{w:'天賦',r:'てんぷ',e:'natural gift'}]},
  {id:1508,k:'奮',m:'rouse / stir up',on:'フン',ku:'ふる-',lv:'N1',st:16,cat:'action',rad:'大',mn:'Big + field + bird = rouse',ex:[{w:'奮う',r:'ふるう',e:'to rouse'},{w:'奮発',r:'ふんぱつ',e:'exertion'}]},
  {id:1509,k:'紛',m:'confused / dispute',on:'フン',ku:'まぎ-',lv:'N1',st:10,cat:'other',rad:'糸',mn:'Thread + divide = confused',ex:[{w:'紛れる',r:'まぎれる',e:'to be confused'},{w:'紛争',r:'ふんそう',e:'dispute'}]},
  {id:1510,k:'噴',m:'spout / gush',on:'フン',ku:'ふ-',lv:'N1',st:15,cat:'action',rad:'口',mn:'Mouth + source = spout',ex:[{w:'噴く',r:'ふく',e:'to spout'},{w:'噴火',r:'ふんか',e:'volcanic eruption'}]},
  {id:1511,k:'憤',m:'indignant / angry',on:'フン',ku:'いきどお-',lv:'N1',st:15,cat:'feeling',rad:'心',mn:'Heart + source = indignant',ex:[{w:'憤る',r:'いきどおる',e:'to be indignant'},{w:'憤慨',r:'ふんがい',e:'indignation'}]},
  {id:1512,k:'併',m:'combine / annex',on:'ヘイ',ku:'あわ-',lv:'N1',st:8,cat:'action',rad:'人',mn:'Person + stand = combine',ex:[{w:'合併',r:'がっぺい',e:'merger'},{w:'併合',r:'へいごう',e:'annexation'}]},
  {id:1513,k:'壁',m:'wall',on:'ヘキ',ku:'かべ',lv:'N1',st:16,cat:'other',rad:'土',mn:'Earth + avoid = wall',ex:[{w:'壁',r:'かべ',e:'wall'},{w:'障壁',r:'しょうへき',e:'barrier'}]},
  {id:1514,k:'蔑',m:'despise / belittle',on:'ベツ',ku:'さげす-',lv:'N1',st:14,cat:'action',rad:'艸',mn:'Grass + small = despise',ex:[{w:'蔑む',r:'さげすむ',e:'to despise'},{w:'軽蔑',r:'けいべつ',e:'contempt'}]},
  {id:1515,k:'偏',m:'partial / lean',on:'ヘン',ku:'かたよ-',lv:'N1',st:11,cat:'description',rad:'人',mn:'Person + scroll = partial',ex:[{w:'偏る',r:'かたよる',e:'to be partial'},{w:'偏見',r:'へんけん',e:'prejudice'}]},
  {id:1516,k:'辺',m:'vicinity',on:'ヘン',ku:'あた-',lv:'N1',st:5,cat:'place',rad:'辵',mn:'Walk + cut = vicinity',ex:[{w:'辺り',r:'あたり',e:'vicinity'},{w:'辺境',r:'へんきょう',e:'frontier'}]},
  {id:1517,k:'捕',m:'catch / arrest',on:'ホ',ku:'とら-・つか-',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + father = catch',ex:[{w:'捕まえる',r:'つかまえる',e:'to catch'},{w:'逮捕',r:'たいほ',e:'arrest'}]},
  {id:1518,k:'舗',m:'pave / shop',on:'ホ',ku:'',lv:'N1',st:15,cat:'other',rad:'舌',mn:'Tongue + father = pave',ex:[{w:'舗装',r:'ほそう',e:'paving'},{w:'老舗',r:'しにせ',e:'long-established shop'}]},
  {id:1519,k:'崩',m:'collapse / crumble',on:'ホウ',ku:'くずれ-',lv:'N1',st:11,cat:'action',rad:'山',mn:'Mountain + friend = collapse',ex:[{w:'崩れる',r:'くずれる',e:'to collapse'},{w:'崩壊',r:'ほうかい',e:'collapse'}]},
  {id:1520,k:'奉',m:'serve / dedicate',on:'ホウ',ku:'たてまつ-',lv:'N1',st:8,cat:'action',rad:'大',mn:'Big + plant = dedicate',ex:[{w:'奉る',r:'たてまつる',e:'to dedicate'},{w:'奉仕',r:'ほうし',e:'service'}]},
  {id:1521,k:'縫',m:'sew / stitch',on:'ホウ',ku:'ぬ-',lv:'N1',st:16,cat:'action',rad:'糸',mn:'Thread + path = sew',ex:[{w:'縫う',r:'ぬう',e:'to sew'},{w:'縫製',r:'ほうせい',e:'sewing'}]},
  {id:1522,k:'朴',m:'simple / plain',on:'ボク',ku:'',lv:'N1',st:6,cat:'description',rad:'木',mn:'Wood + divination = simple',ex:[{w:'朴訥',r:'ぼくとつ',e:'simple and honest'},{w:'素朴',r:'そぼく',e:'simple'}]},
  {id:1523,k:'墨',m:'ink / black',on:'ボク',ku:'すみ',lv:'N1',st:14,cat:'art',rad:'土',mn:'Earth + black = ink',ex:[{w:'墨',r:'すみ',e:'ink'},{w:'水墨画',r:'すいぼくが',e:'ink painting'}]},
  {id:1524,k:'奔',m:'run / flee',on:'ホン',ku:'はし-',lv:'N1',st:8,cat:'action',rad:'大',mn:'Big + road = run',ex:[{w:'奔走',r:'ほんそう',e:'running about'},{w:'出奔',r:'しゅっぽん',e:'fleeing'}]},
  {id:1525,k:'魔',m:'demon / magic',on:'マ',ku:'',lv:'N1',st:21,cat:'other',rad:'鬼',mn:'Demon + hemp = demon',ex:[{w:'魔法',r:'まほう',e:'magic'},{w:'悪魔',r:'あくま',e:'devil'}]},
  {id:1526,k:'麻',m:'hemp / numb',on:'マ',ku:'あさ',lv:'N1',st:11,cat:'nature',rad:'广',mn:'Shelter + plant = hemp',ex:[{w:'麻',r:'あさ',e:'hemp'},{w:'麻酔',r:'ますい',e:'anesthesia'}]},
  {id:1527,k:'膜',m:'membrane',on:'マク',ku:'',lv:'N1',st:14,cat:'body',rad:'月',mn:'Body + cover = membrane',ex:[{w:'膜',r:'まく',e:'membrane'},{w:'鼓膜',r:'こまく',e:'eardrum'}]},
  {id:1528,k:'又',m:'also / again',on:'ユウ',ku:'また',lv:'N1',st:2,cat:'other',rad:'又',mn:'Right hand shape = also',ex:[{w:'又は',r:'または',e:'or'},{w:'又聞き',r:'またぎき',e:'hearsay'}]},
  {id:1529,k:'抹',m:'erase / rub',on:'マツ',ku:'',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + not = erase',ex:[{w:'抹消',r:'まっしょう',e:'erasure'},{w:'抹殺',r:'まっさつ',e:'obliteration'}]},
  {id:1530,k:'眩',m:'dazzling / dizzy',on:'ゲン',ku:'まぶ-・くら-',lv:'N1',st:10,cat:'health',rad:'目',mn:'Eye + exchange = dazzling',ex:[{w:'眩しい',r:'まぶしい',e:'dazzling'},{w:'眩暈',r:'めまい',e:'dizziness'}]},
  {id:1531,k:'蔓',m:'vine / spread',on:'マン',ku:'つる',lv:'N1',st:14,cat:'nature',rad:'艸',mn:'Grass + spread = vine',ex:[{w:'蔓',r:'つる',e:'vine'},{w:'蔓延',r:'まんえん',e:'spread'}]},
  {id:1532,k:'岬',m:'cape / promontory',on:'コウ',ku:'みさき',lv:'N1',st:8,cat:'place',rad:'山',mn:'Mountain + armor = cape',ex:[{w:'岬',r:'みさき',e:'cape'},{w:'室戸岬',r:'むろとみさき',e:'Cape Muroto'}]},
  {id:1533,k:'溝',m:'ditch / gap',on:'コウ',ku:'みぞ',lv:'N1',st:13,cat:'place',rad:'水',mn:'Water + meet = ditch',ex:[{w:'溝',r:'みぞ',e:'ditch'},{w:'溝が深い',r:'みぞがふかい',e:'deep rift'}]},
  {id:1534,k:'蜜',m:'honey',on:'ミツ',ku:'',lv:'N1',st:14,cat:'food',rad:'虫',mn:'Insect + cover = honey',ex:[{w:'蜂蜜',r:'はちみつ',e:'honey'},{w:'蜜月',r:'みつき',e:'honeymoon'}]},
  {id:1535,k:'妙',m:'strange / wonderful',on:'ミョウ',ku:'たえ',lv:'N1',st:7,cat:'description',rad:'女',mn:'Woman + small = wonderful',ex:[{w:'妙',r:'みょう',e:'strange'},{w:'絶妙',r:'ぜつみょう',e:'exquisite'}]},
  {id:1536,k:'冥',m:'dark / underworld',on:'メイ',ku:'',lv:'N1',st:10,cat:'other',rad:'冖',mn:'Cover + small = dark',ex:[{w:'冥土',r:'めいど',e:'underworld'},{w:'冥福',r:'めいふく',e:'rest in peace'}]},
  {id:1537,k:'滅',m:'destroy',on:'メツ',ku:'ほろ-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + fire + blade = destroy',ex:[{w:'滅ぼす',r:'ほろぼす',e:'to destroy'},{w:'絶滅',r:'ぜつめつ',e:'extinction'}]},
  {id:1538,k:'茂',m:'lush',on:'モ',ku:'しげ-',lv:'N1',st:8,cat:'nature',rad:'艸',mn:'Grass + axe = lush',ex:[{w:'茂る',r:'しげる',e:'to be lush'},{w:'繁茂',r:'はんも',e:'luxuriant growth'}]},
  {id:1539,k:'妄',m:'reckless / deluded',on:'モウ',ku:'',lv:'N1',st:6,cat:'other',rad:'女',mn:'Dead + woman = deluded',ex:[{w:'妄想',r:'もうそう',e:'delusion'},{w:'妄言',r:'もうげん',e:'reckless talk'}]},
  {id:1540,k:'餅',m:'rice cake',on:'ヘイ',ku:'もち',lv:'N1',st:15,cat:'food',rad:'食',mn:'Food + soldier = rice cake',ex:[{w:'餅',r:'もち',e:'rice cake'},{w:'餅米',r:'もちごめ',e:'glutinous rice'}]},
  {id:1541,k:'籾',m:'unhulled rice',on:'ベイ',ku:'もみ',lv:'N1',st:10,cat:'food',rad:'米',mn:'Rice + protect = unhulled rice',ex:[{w:'籾',r:'もみ',e:'unhulled rice'},{w:'籾殻',r:'もみがら',e:'rice husk'}]},
  {id:1542,k:'紋',m:'crest / pattern',on:'モン',ku:'',lv:'N1',st:10,cat:'art',rad:'糸',mn:'Thread + writing = pattern',ex:[{w:'家紋',r:'かもん',e:'family crest'},{w:'指紋',r:'しもん',e:'fingerprint'}]},
  {id:1543,k:'倭',m:'Japan (old) / dwarf',on:'ワ',ku:'やまと',lv:'N1',st:10,cat:'other',rad:'人',mn:'Person + rice = Japan',ex:[{w:'倭',r:'やまと',e:'old name for Japan'},{w:'倭国',r:'わこく',e:'ancient Japan'}]},
  {id:1544,k:'輪',m:'wheel / ring',on:'リン',ku:'わ',lv:'N1',st:15,cat:'other',rad:'車',mn:'Cart + divide = wheel',ex:[{w:'輪',r:'わ',e:'wheel / ring'},{w:'指輪',r:'ゆびわ',e:'ring'}]},
  {id:1545,k:'歪',m:'crooked / distorted',on:'ワイ',ku:'いびつ・ゆが-',lv:'N1',st:9,cat:'description',rad:'正',mn:'Not + correct = distorted',ex:[{w:'歪む',r:'ゆがむ',e:'to distort'},{w:'歪曲',r:'わいきょく',e:'distortion'}]},
  {id:1546,k:'侘',m:'lonely / rustic',on:'タ',ku:'わび',lv:'N1',st:8,cat:'feeling',rad:'人',mn:'Person + other = lonely',ex:[{w:'侘び',r:'わび',e:'rustic simplicity'},{w:'侘しい',r:'わびしい',e:'lonely'}]},
  {id:1547,k:'脇',m:'side / armpit',on:'キョウ',ku:'わき',lv:'N1',st:10,cat:'body',rad:'月',mn:'Body + together = side',ex:[{w:'脇',r:'わき',e:'side / armpit'},{w:'脇役',r:'わきやく',e:'supporting role'}]},
  {id:1548,k:'惰',m:'lazy / sluggish',on:'ダ',ku:'',lv:'N1',st:12,cat:'description',rad:'心',mn:'Heart + left = lazy',ex:[{w:'惰性',r:'だせい',e:'inertia'},{w:'怠惰',r:'たいだ',e:'laziness'}]},
  {id:1549,k:'圧',m:'pressure',on:'アツ',ku:'お-',lv:'N2',st:5,cat:'action',rad:'土',mn:'Earth + cliff = pressure',ex:[{w:'圧力',r:'あつりょく',e:'pressure'},{w:'圧縮',r:'あっしゅく',e:'compression'}]},
  {id:1550,k:'維',m:'maintain / fiber',on:'イ',ku:'',lv:'N2',st:14,cat:'other',rad:'糸',mn:'Thread + bird = maintain',ex:[{w:'維持',r:'いじ',e:'maintenance'},{w:'繊維',r:'せんい',e:'fiber'}]},
  {id:1551,k:'渦',m:'whirlpool / vortex',on:'カ',ku:'うず',lv:'N2',st:12,cat:'nature',rad:'水',mn:'Water + over = whirlpool',ex:[{w:'渦',r:'うず',e:'whirlpool'},{w:'渦巻き',r:'うずまき',e:'spiral'}]},
  {id:1552,k:'架',m:'put across / rack',on:'カ',ku:'か-',lv:'N2',st:9,cat:'other',rad:'木',mn:'Wood + add = rack',ex:[{w:'架ける',r:'かける',e:'to put across'},{w:'架空',r:'かくう',e:'fictitious'}]},
  {id:1553,k:'該',m:'applicable / that',on:'ガイ',ku:'',lv:'N2',st:13,cat:'other',rad:'言',mn:'Words + person = applicable',ex:[{w:'該当',r:'がいとう',e:'applicable'},{w:'該博',r:'がいはく',e:'extensive knowledge'}]},
  {id:1554,k:'穫',m:'harvest',on:'カク',ku:'',lv:'N2',st:18,cat:'action',rad:'禾',mn:'Grain + obtain = harvest',ex:[{w:'収穫',r:'しゅうかく',e:'harvest'},{w:'穫る',r:'とる',e:'to harvest'}]},
  {id:1555,k:'括',m:'fasten',on:'カツ',ku:'くく-',lv:'N2',st:9,cat:'action',rad:'手',mn:'Hand + tongue = fasten',ex:[{w:'括る',r:'くくる',e:'to fasten'},{w:'包括',r:'ほうかつ',e:'inclusive'}]},
  {id:1556,k:'渓',m:'mountain stream',on:'ケイ',ku:'たに',lv:'N2',st:11,cat:'nature',rad:'水',mn:'Water + valley = stream',ex:[{w:'渓谷',r:'けいこく',e:'gorge'},{w:'渓流',r:'けいりゅう',e:'mountain stream'}]},
  {id:1557,k:'兼',m:'combine / double as',on:'ケン',ku:'か-',lv:'N2',st:10,cat:'other',rad:'八',mn:'Eight + hand = combine',ex:[{w:'兼ねる',r:'かねる',e:'to combine'},{w:'兼業',r:'けんぎょう',e:'side business'}]},
  {id:1558,k:'堅',m:'hard / firm',on:'ケン',ku:'かた-',lv:'N2',st:12,cat:'description',rad:'土',mn:'Earth + captive = hard',ex:[{w:'堅い',r:'かたい',e:'hard'},{w:'堅固',r:'けんご',e:'firm'}]},
  {id:1559,k:'鍵',m:'key / lock',on:'ケン',ku:'かぎ',lv:'N2',st:17,cat:'other',rad:'金',mn:'Metal + firm = key',ex:[{w:'鍵',r:'かぎ',e:'key'},{w:'鍵盤',r:'けんばん',e:'keyboard'}]},
  {id:1560,k:'顕',m:'manifest / obvious',on:'ケン',ku:'あきら-',lv:'N2',st:18,cat:'description',rad:'頁',mn:'Page + show = manifest',ex:[{w:'顕著',r:'けんちょ',e:'remarkable'},{w:'顕微鏡',r:'けんびきょう',e:'microscope'}]},
  {id:1561,k:'謙',m:'humble / modest',on:'ケン',ku:'',lv:'N2',st:17,cat:'description',rad:'言',mn:'Words + combine = modest',ex:[{w:'謙虚',r:'けんきょ',e:'humble'},{w:'謙遜',r:'けんそん',e:'modesty'}]},
  {id:1562,k:'絹',m:'silk',on:'ケン',ku:'きぬ',lv:'N2',st:13,cat:'other',rad:'糸',mn:'Thread + worm = silk',ex:[{w:'絹',r:'きぬ',e:'silk'},{w:'絹糸',r:'きぬいと',e:'silk thread'}]},
  {id:1563,k:'懸',m:'hang / concern',on:'ケン',ku:'かか-',lv:'N2',st:20,cat:'action',rad:'心',mn:'Heart + county = concern',ex:[{w:'懸念',r:'けねん',e:'concern'},{w:'懸賞',r:'けんしょう',e:'prize'}]},
  {id:1564,k:'弦',m:'bowstring',on:'ゲン',ku:'つる',lv:'N2',st:8,cat:'other',rad:'弓',mn:'Bow + private = bowstring',ex:[{w:'弦',r:'つる',e:'bowstring'},{w:'弦楽',r:'げんがく',e:'string music'}]},
  {id:1565,k:'幻',m:'illusion / phantom',on:'ゲン',ku:'まぼろし',lv:'N2',st:4,cat:'other',rad:'幺',mn:'Small thread = illusion',ex:[{w:'幻',r:'まぼろし',e:'illusion'},{w:'幻想',r:'げんそう',e:'fantasy'}]},
  {id:1566,k:'己',m:'self / oneself',on:'コ・キ',ku:'おのれ',lv:'N2',st:3,cat:'other',rad:'己',mn:'Coiled snake = self',ex:[{w:'自己',r:'じこ',e:'self'},{w:'己',r:'おのれ',e:'oneself'}]},
  {id:1567,k:'克',m:'overcome',on:'コク',ku:'',lv:'N2',st:7,cat:'action',rad:'儿',mn:'Person + nail = overcome',ex:[{w:'克服',r:'こくふく',e:'overcoming'},{w:'克己',r:'こっき',e:'self-control'}]},
  {id:1568,k:'込',m:'込む: be crowded',on:'コム',ku:'こ-',lv:'N2',st:5,cat:'action',rad:'辵',mn:'Walk + enter = crowded',ex:[{w:'込む',r:'こむ',e:'to be crowded'},{w:'混み合う',r:'こみあう',e:'to be packed'}]},
  {id:1569,k:'困',m:'troubled',on:'コン',ku:'こま-',lv:'N2',st:7,cat:'feeling',rad:'木',mn:'Tree in box = trapped',ex:[{w:'困る',r:'こまる',e:'to be troubled'},{w:'困惑',r:'こんわく',e:'bewilderment'}]},
  {id:1570,k:'砕',m:'break / crush',on:'サイ',ku:'くだ-',lv:'N2',st:9,cat:'action',rad:'石',mn:'Stone + nine = crush',ex:[{w:'砕く',r:'くだく',e:'to crush'},{w:'粉砕',r:'ふんさい',e:'pulverization'}]},
  {id:1571,k:'妻',m:'wife',on:'サイ',ku:'つま',lv:'N2',st:8,cat:'person',rad:'女',mn:'Woman + hand = wife',ex:[{w:'妻',r:'つま',e:'wife'},{w:'夫妻',r:'ふさい',e:'husband and wife'}]},
  {id:1572,k:'歳',m:'year / age',on:'サイ',ku:'とし',lv:'N2',st:13,cat:'other',rad:'止',mn:'Stop + blade = year',ex:[{w:'歳',r:'さい',e:'age'},{w:'歳月',r:'さいげつ',e:'years and months'}]},
  {id:1573,k:'搾',m:'squeeze / press',on:'サク',ku:'しぼ-',lv:'N2',st:13,cat:'action',rad:'手',mn:'Hand + narrow = squeeze',ex:[{w:'搾る',r:'しぼる',e:'to squeeze'},{w:'搾取',r:'さくしゅ',e:'exploitation'}]},
  {id:1574,k:'殺',m:'kill',on:'サツ',ku:'ころ-',lv:'N2',st:10,cat:'action',rad:'殳',mn:'Lance + tree = kill',ex:[{w:'殺す',r:'ころす',e:'to kill'},{w:'殺菌',r:'さっきん',e:'sterilization'}]},
  {id:1575,k:'傘',m:'umbrella',on:'サン',ku:'かさ',lv:'N2',st:12,cat:'other',rad:'人',mn:'Person + small people = umbrella',ex:[{w:'傘',r:'かさ',e:'umbrella'},{w:'日傘',r:'ひがさ',e:'parasol'}]},
  {id:1576,k:'暫',m:'temporary',on:'ザン',ku:'しばら-',lv:'N2',st:15,cat:'other',rad:'日',mn:'Sun + cutting = temporary',ex:[{w:'暫く',r:'しばらく',e:'for a while'},{w:'暫定',r:'ざんてい',e:'provisional'}]},
  {id:1577,k:'刺',m:'pierce / stab',on:'シ',ku:'さ-',lv:'N2',st:8,cat:'action',rad:'刀',mn:'Knife + bundle = stab',ex:[{w:'刺す',r:'さす',e:'to stab'},{w:'刺身',r:'さしみ',e:'sashimi'}]},
  {id:1578,k:'滋',m:'nourish / grow',on:'ジ',ku:'',lv:'N2',st:12,cat:'action',rad:'水',mn:'Water + grow = nourish',ex:[{w:'滋養',r:'じよう',e:'nourishment'},{w:'滋賀',r:'しが',e:'Shiga (prefecture)'}]},
  {id:1579,k:'執',m:'hold',on:'シツ',ku:'と-',lv:'N2',st:11,cat:'action',rad:'土',mn:'Earth + seize = hold',ex:[{w:'執る',r:'とる',e:'to take'},{w:'固執',r:'こしつ',e:'persistence'}]},
  {id:1580,k:'湿',m:'damp',on:'シツ',ku:'しめ-',lv:'N2',st:12,cat:'description',rad:'水',mn:'Water + display = damp',ex:[{w:'湿気',r:'しっけ',e:'humidity'},{w:'湿度',r:'しつど',e:'humidity level'}]},
  {id:1581,k:'粛',m:'solemn / strict',on:'シュク',ku:'',lv:'N2',st:11,cat:'description',rad:'聿',mn:'Pen + rice = solemn',ex:[{w:'厳粛',r:'げんしゅく',e:'solemn'},{w:'粛清',r:'しゅくせい',e:'purge'}]},
  {id:1582,k:'循',m:'follow / circulate',on:'ジュン',ku:'',lv:'N2',st:12,cat:'action',rad:'彳',mn:'Walk + follow = circulate',ex:[{w:'循環',r:'じゅんかん',e:'circulation'},{w:'悪循環',r:'あくじゅんかん',e:'vicious cycle'}]},
  {id:1583,k:'旬',m:'10-day period / season',on:'ジュン',ku:'',lv:'N2',st:6,cat:'other',rad:'日',mn:'Sun + wrap = 10 days',ex:[{w:'旬',r:'じゅん',e:'10-day period'},{w:'旬の食材',r:'しゅんのしょくざい',e:'seasonal ingredients'}]},
  {id:1584,k:'称',m:'name / praise',on:'ショウ',ku:'たた-',lv:'N2',st:10,cat:'action',rad:'禾',mn:'Grain + voice = praise',ex:[{w:'称える',r:'たたえる',e:'to praise'},{w:'総称',r:'そうしょう',e:'general term'}]},
  {id:1585,k:'剰',m:'surplus',on:'ジョウ',ku:'あま-',lv:'N2',st:11,cat:'other',rad:'刀',mn:'Knife + multiply = surplus',ex:[{w:'余剰',r:'よじょう',e:'surplus'},{w:'過剰',r:'かじょう',e:'excess'}]},
  {id:1586,k:'蒸',m:'steam / evaporate',on:'ジョウ',ku:'む-',lv:'N2',st:13,cat:'action',rad:'艸',mn:'Grass + fire = steam',ex:[{w:'蒸す',r:'むす',e:'to steam'},{w:'蒸発',r:'じょうはつ',e:'evaporation'}]},
  {id:1587,k:'嬢',m:'young lady',on:'ジョウ',ku:'',lv:'N2',st:17,cat:'person',rad:'女',mn:'Woman + allow = young lady',ex:[{w:'令嬢',r:'れいじょう',e:'young lady'},{w:'嬢',r:'じょう',e:'young lady'}]},
  {id:1588,k:'浸',m:'soak',on:'シン',ku:'ひた-',lv:'N2',st:10,cat:'action',rad:'水',mn:'Water + broom = soak',ex:[{w:'浸す',r:'ひたす',e:'to soak'},{w:'浸食',r:'しんしょく',e:'erosion'}]},
  {id:1589,k:'寸',m:'unit of length / inch',on:'スン',ku:'',lv:'N2',st:3,cat:'other',rad:'寸',mn:'Finger measure = inch',ex:[{w:'寸法',r:'すんぽう',e:'dimensions'},{w:'寸前',r:'すんぜん',e:'just before'}]},
  {id:1590,k:'斉',m:'uniform / equal',on:'セイ',ku:'',lv:'N2',st:8,cat:'description',rad:'斉',mn:'Even grain = equal',ex:[{w:'一斉',r:'いっせい',e:'all at once'},{w:'斉唱',r:'せいしょう',e:'unison singing'}]},
  {id:1591,k:'摂',m:'take / govern',on:'セツ',ku:'と-',lv:'N2',st:13,cat:'action',rad:'手',mn:'Hand + ear = govern',ex:[{w:'摂取',r:'せっしゅ',e:'intake'},{w:'摂生',r:'せっせい',e:'healthy living'}]},
  {id:1592,k:'繊',m:'fiber',on:'セン',ku:'',lv:'N2',st:17,cat:'other',rad:'糸',mn:'Thread + slender = fiber',ex:[{w:'繊維',r:'せんい',e:'fiber'},{w:'化学繊維',r:'かがくせんい',e:'synthetic fiber'}]},
  {id:1593,k:'奏',m:'play music / report',on:'ソウ',ku:'かな-',lv:'N2',st:9,cat:'art',rad:'大',mn:'Big + spring = play music',ex:[{w:'奏でる',r:'かなでる',e:'to play music'},{w:'演奏',r:'えんそう',e:'performance'}]},
  {id:1594,k:'葬',m:'funeral / bury',on:'ソウ',ku:'ほうむ-',lv:'N2',st:12,cat:'other',rad:'艸',mn:'Grass + death = funeral',ex:[{w:'葬式',r:'そうしき',e:'funeral'},{w:'埋葬',r:'まいそう',e:'burial'}]},
  {id:1595,k:'蔵',m:'warehouse / store',on:'ゾウ',ku:'くら',lv:'N2',st:15,cat:'other',rad:'艸',mn:'Grass + hidden = store',ex:[{w:'蔵',r:'くら',e:'warehouse'},{w:'宝蔵',r:'ほうぞう',e:'treasure house'}]},
  {id:1596,k:'俗',m:'worldly / common',on:'ゾク',ku:'',lv:'N2',st:9,cat:'other',rad:'人',mn:'Person + valley = worldly',ex:[{w:'俗',r:'ぞく',e:'worldly'},{w:'風俗',r:'ふうぞく',e:'customs'}]},
  {id:1597,k:'賊',m:'thief / rebel',on:'ゾク',ku:'',lv:'N2',st:13,cat:'other',rad:'貝',mn:'Shell + spear = thief',ex:[{w:'賊',r:'ぞく',e:'thief'},{w:'海賊',r:'かいぞく',e:'pirate'}]},
  {id:1598,k:'耐',m:'endure / resist',on:'タイ',ku:'た-',lv:'N2',st:9,cat:'action',rad:'而',mn:'Whiskers + earth = endure',ex:[{w:'耐える',r:'たえる',e:'to endure'},{w:'耐久',r:'たいきゅう',e:'durability'}]},
  {id:1599,k:'滞',m:'stagnate / delay',on:'タイ',ku:'とどこお-',lv:'N2',st:13,cat:'action',rad:'水',mn:'Water + belt = stagnate',ex:[{w:'滞る',r:'とどこおる',e:'to stagnate'},{w:'渋滞',r:'じゅうたい',e:'traffic jam'}]},
  {id:1600,k:'脱',m:'remove / escape',on:'ダツ',ku:'ぬ-',lv:'N2',st:11,cat:'action',rad:'月',mn:'Body + divide = remove',ex:[{w:'脱ぐ',r:'ぬぐ',e:'to remove'},{w:'脱出',r:'だっしゅつ',e:'escape'}]},
  {id:1601,k:'択',m:'choose',on:'タク',ku:'',lv:'N2',st:7,cat:'action',rad:'手',mn:'Hand + release = choose',ex:[{w:'選択',r:'せんたく',e:'selection'},{w:'二者択一',r:'にしゃたくいつ',e:'either or'}]},
  {id:1602,k:'嘆',m:'lament',on:'タン',ku:'なげ-',lv:'N2',st:14,cat:'feeling',rad:'口',mn:'Mouth + sigh = lament',ex:[{w:'嘆く',r:'なげく',e:'to lament'},{w:'感嘆',r:'かんたん',e:'admiration'}]},
  {id:1603,k:'畜',m:'livestock / raise',on:'チク',ku:'',lv:'N2',st:10,cat:'other',rad:'田',mn:'Field + thread = livestock',ex:[{w:'家畜',r:'かちく',e:'livestock'},{w:'畜産',r:'ちくさん',e:'stock farming'}]},
  {id:1604,k:'緻',m:'fine / minute',on:'チ',ku:'',lv:'N2',st:16,cat:'description',rad:'糸',mn:'Thread + reach = fine',ex:[{w:'緻密',r:'ちみつ',e:'minute / detailed'},{w:'精緻',r:'せいち',e:'elaborate'}]},
  {id:1605,k:'跳',m:'jump / skip',on:'チョウ',ku:'は-・と-',lv:'N2',st:13,cat:'action',rad:'足',mn:'Foot + sign = jump',ex:[{w:'跳ぶ',r:'とぶ',e:'to jump'},{w:'跳躍',r:'ちょうやく',e:'jump'}]},
  {id:1606,k:'陳',m:'state / display',on:'チン',ku:'',lv:'N2',st:11,cat:'action',rad:'阜',mn:'Mound + east = display',ex:[{w:'陳列',r:'ちんれつ',e:'display'},{w:'陳述',r:'ちんじゅつ',e:'statement'}]},
  {id:1607,k:'椎',m:'hammer / spine',on:'ツイ',ku:'つち',lv:'N2',st:12,cat:'other',rad:'木',mn:'Wood + bird = hammer',ex:[{w:'椎',r:'つち',e:'mallet'},{w:'脊椎',r:'せきつい',e:'spine'}]},
  {id:1608,k:'慎',m:'careful / discreet',on:'シン',ku:'つつし-',lv:'N2',st:13,cat:'action',rad:'心',mn:'Heart + true = careful',ex:[{w:'慎む',r:'つつしむ',e:'to be careful'},{w:'謹慎',r:'きんしん',e:'confinement / suspension'}]},
  {id:1609,k:'坪',m:'unit of area',on:'ヘイ',ku:'つぼ',lv:'N2',st:8,cat:'other',rad:'土',mn:'Earth + flat = area unit',ex:[{w:'坪',r:'つぼ',e:'tsubo (area unit)'},{w:'坪数',r:'つぼすう',e:'area in tsubo'}]},
  {id:1610,k:'鶴',m:'crane (bird)',on:'カク',ku:'つる',lv:'N2',st:21,cat:'nature',rad:'鳥',mn:'Bird + crane = crane',ex:[{w:'鶴',r:'つる',e:'crane'},{w:'千羽鶴',r:'せんばづる',e:'thousand paper cranes'}]},
  {id:1611,k:'呈',m:'present / show',on:'テイ',ku:'',lv:'N2',st:7,cat:'action',rad:'口',mn:'Mouth + king = present',ex:[{w:'呈する',r:'ていする',e:'to present'},{w:'露呈',r:'ろてい',e:'exposure'}]},
  {id:1612,k:'徹',m:'thorough',on:'テツ',ku:'',lv:'N2',st:15,cat:'description',rad:'彳',mn:'Walk + pierce = thorough',ex:[{w:'徹底',r:'てってい',e:'thorough'},{w:'貫徹',r:'かんてつ',e:'accomplishment'}]},
  {id:1613,k:'哲',m:'wisdom',on:'テツ',ku:'',lv:'N2',st:10,cat:'description',rad:'口',mn:'Mouth + axe = wisdom',ex:[{w:'哲学',r:'てつがく',e:'philosophy'},{w:'哲人',r:'てつじん',e:'philosopher'}]},
  {id:1614,k:'殿',m:'palace / lord',on:'デン',ku:'との・どの',lv:'N2',st:13,cat:'other',rad:'殳',mn:'Lance + roof = palace',ex:[{w:'殿',r:'との',e:'lord'},{w:'宮殿',r:'きゅうでん',e:'palace'}]},
  {id:1615,k:'透',m:'transparent / pass through',on:'トウ',ku:'す-',lv:'N2',st:10,cat:'action',rad:'辵',mn:'Walk + show = pass through',ex:[{w:'透明',r:'とうめい',e:'transparent'},{w:'透ける',r:'すける',e:'to be transparent'}]},
  {id:1616,k:'騰',m:'rise / jump up',on:'トウ',ku:'',lv:'N2',st:20,cat:'action',rad:'馬',mn:'Horse + rise = jump up',ex:[{w:'高騰',r:'こうとう',e:'surge in price'},{w:'騰貴',r:'とうき',e:'rise in price'}]},
  {id:1617,k:'匿',m:'hide / conceal',on:'トク',ku:'',lv:'N2',st:10,cat:'action',rad:'匚',mn:'Box + night = hide',ex:[{w:'匿名',r:'とくめい',e:'anonymity'},{w:'秘匿',r:'ひとく',e:'concealment'}]},
  {id:1618,k:'貪',m:'greedy',on:'ドン・タン',ku:'むさぼ-',lv:'N2',st:11,cat:'description',rad:'貝',mn:'Shell + now = greedy',ex:[{w:'貪る',r:'むさぼる',e:'to covet'},{w:'貪欲',r:'どんよく',e:'greed'}]},
  {id:1619,k:'軟',m:'soft',on:'ナン',ku:'やわ-',lv:'N2',st:11,cat:'description',rad:'車',mn:'Cart + yawn = soft',ex:[{w:'軟らかい',r:'やわらかい',e:'soft'},{w:'軟弱',r:'なんじゃく',e:'weak'}]},
  {id:1620,k:'尿',m:'urine',on:'ニョウ',ku:'',lv:'N2',st:7,cat:'body',rad:'尸',mn:'Body + water = urine',ex:[{w:'尿',r:'にょう',e:'urine'},{w:'尿素',r:'にょうそ',e:'urea'}]},
  {id:1621,k:'粘',m:'sticky / persist',on:'ネン',ku:'ねば-',lv:'N2',st:11,cat:'description',rad:'米',mn:'Rice + occupy = sticky',ex:[{w:'粘る',r:'ねばる',e:'to be sticky'},{w:'粘膜',r:'ねんまく',e:'mucous membrane'}]},
  {id:1622,k:'把',m:'grasp / bundle',on:'ハ',ku:'',lv:'N2',st:7,cat:'action',rad:'手',mn:'Hand + snake = grasp',ex:[{w:'把握',r:'はあく',e:'grasp'},{w:'把',r:'は',e:'bundle'}]},
  {id:1623,k:'拍',m:'beat / clap',on:'ハク',ku:'',lv:'N2',st:8,cat:'action',rad:'手',mn:'Hand + white = beat',ex:[{w:'拍子',r:'ひょうし',e:'beat / rhythm'},{w:'拍手',r:'はくしゅ',e:'applause'}]},
  {id:1624,k:'泊',m:'stay / anchor',on:'ハク',ku:'と-',lv:'N2',st:8,cat:'action',rad:'水',mn:'Water + white = anchor',ex:[{w:'泊まる',r:'とまる',e:'to stay'},{w:'宿泊',r:'しゅくはく',e:'lodging'}]},
  {id:1625,k:'薄',m:'thin / pale',on:'ハク',ku:'うす-',lv:'N2',st:16,cat:'description',rad:'水',mn:'Water + sparse = thin',ex:[{w:'薄い',r:'うすい',e:'thin / pale'},{w:'薄暗い',r:'うすぐらい',e:'dim'}]},
  {id:1626,k:'泡',m:'bubble / foam',on:'ホウ',ku:'あわ',lv:'N2',st:8,cat:'nature',rad:'水',mn:'Water + wrap = bubble',ex:[{w:'泡',r:'あわ',e:'bubble'},{w:'気泡',r:'きほう',e:'air bubble'}]},
  {id:1627,k:'謀',m:'plan / plot',on:'ボウ・ム',ku:'はか-',lv:'N2',st:16,cat:'action',rad:'言',mn:'Words + plum = plot',ex:[{w:'謀る',r:'はかる',e:'to plot'},{w:'陰謀',r:'いんぼう',e:'conspiracy'}]},
  {id:1628,k:'没',m:'sink / die',on:'ボツ',ku:'',lv:'N2',st:7,cat:'action',rad:'水',mn:'Water + roll = sink',ex:[{w:'没する',r:'もっする',e:'to die'},{w:'没落',r:'ぼつらく',e:'decline'}]},
  {id:1629,k:'翻',m:'flip / translate',on:'ホン',ku:'ひるがえ-',lv:'N2',st:18,cat:'action',rad:'羽',mn:'Wings + number = flip',ex:[{w:'翻訳',r:'ほんやく',e:'translation'},{w:'翻す',r:'ひるがえす',e:'to flip over'}]},
  {id:1630,k:'枚',m:'counter for flat things',on:'マイ',ku:'',lv:'N2',st:8,cat:'other',rad:'木',mn:'Wood + strike = flat thing',ex:[{w:'枚',r:'まい',e:'(counter)'},{w:'枚数',r:'まいすう',e:'number of sheets'}]},
  {id:1631,k:'慢',m:'arrogant / idle',on:'マン',ku:'',lv:'N2',st:14,cat:'description',rad:'心',mn:'Heart + long = arrogant',ex:[{w:'傲慢',r:'ごうまん',e:'arrogance'},{w:'自慢',r:'じまん',e:'pride'}]},
  {id:1632,k:'蓄',m:'store up',on:'チク',ku:'たくわ-',lv:'N2',st:13,cat:'action',rad:'艸',mn:'Grass + animal = store up',ex:[{w:'蓄える',r:'たくわえる',e:'to store up'},{w:'蓄積',r:'ちくせき',e:'accumulation'}]},
  {id:1633,k:'滅',m:'perish',on:'メツ',ku:'ほろ-',lv:'N2',st:13,cat:'action',rad:'水',mn:'Water + fire = perish',ex:[{w:'滅びる',r:'ほろびる',e:'to perish'},{w:'消滅',r:'しょうめつ',e:'disappearance'}]},
  {id:1634,k:'網',m:'net / network',on:'モウ',ku:'あみ',lv:'N2',st:14,cat:'other',rad:'糸',mn:'Thread + king = net',ex:[{w:'網',r:'あみ',e:'net'},{w:'通信網',r:'つうしんもう',e:'communication network'}]},
  {id:1635,k:'雄',m:'male / brave',on:'ユウ',ku:'おす・お',lv:'N2',st:12,cat:'nature',rad:'隹',mn:'Bird + left = male',ex:[{w:'雄',r:'おす',e:'male animal'},{w:'英雄',r:'えいゆう',e:'hero'}]},
  {id:1636,k:'抑',m:'suppress',on:'ヨク',ku:'おさ-',lv:'N2',st:7,cat:'action',rad:'手',mn:'Hand + kneeling = suppress',ex:[{w:'抑える',r:'おさえる',e:'to suppress'},{w:'抑制',r:'よくせい',e:'suppression'}]},
  {id:1637,k:'裕',m:'abundant / ease',on:'ユウ',ku:'',lv:'N2',st:12,cat:'description',rad:'衣',mn:'Clothes + valley = abundant',ex:[{w:'裕福',r:'ゆうふく',e:'wealthy'},{w:'余裕',r:'よゆう',e:'margin / ease'}]},
  {id:1638,k:'慢',m:'idle',on:'マン',ku:'',lv:'N2',st:14,cat:'description',rad:'心',mn:'Heart + long = slow',ex:[{w:'怠慢',r:'たいまん',e:'negligence'},{w:'緩慢',r:'かんまん',e:'slow'}]},
  {id:1639,k:'欄',m:'column',on:'ラン',ku:'',lv:'N2',st:20,cat:'other',rad:'木',mn:'Wood + look = column',ex:[{w:'欄',r:'らん',e:'column'},{w:'欄外',r:'らんがい',e:'margin'}]},
  {id:1640,k:'覧',m:'see / view',on:'ラン',ku:'',lv:'N2',st:17,cat:'action',rad:'見',mn:'See + display = view',ex:[{w:'展覧会',r:'てんらんかい',e:'exhibition'},{w:'回覧',r:'かいらん',e:'circular'}]},
  {id:1641,k:'離',m:'separate / leave',on:'リ',ku:'はな-',lv:'N2',st:19,cat:'action',rad:'隹',mn:'Bird + separation = separate',ex:[{w:'離れる',r:'はなれる',e:'to separate'},{w:'距離',r:'きょり',e:'distance'}]},
  {id:1642,k:'竜',m:'dragon',on:'リュウ',ku:'たつ',lv:'N2',st:10,cat:'nature',rad:'龍',mn:'Dragon shape = dragon',ex:[{w:'龍',r:'りゅう',e:'dragon'},{w:'竜巻',r:'たつまき',e:'tornado'}]},
  {id:1643,k:'塁',m:'base / rampart',on:'ルイ',ku:'',lv:'N2',st:12,cat:'other',rad:'土',mn:'Earth + thread = base',ex:[{w:'塁',r:'るい',e:'base (baseball)'},{w:'本塁打',r:'ほんるいだ',e:'home run'}]},
  {id:1644,k:'励',m:'encourage / strive',on:'レイ',ku:'はげ-',lv:'N2',st:7,cat:'action',rad:'力',mn:'Force + strong = encourage',ex:[{w:'励む',r:'はげむ',e:'to strive'},{w:'激励',r:'げきれい',e:'encouragement'}]},
  {id:1645,k:'麗',m:'beautiful / graceful',on:'レイ',ku:'うるわ-',lv:'N2',st:19,cat:'description',rad:'鹿',mn:'Deer + net = beautiful',ex:[{w:'麗しい',r:'うるわしい',e:'beautiful'},{w:'華麗',r:'かれい',e:'gorgeous'}]},
  {id:1646,k:'廉',m:'cheap / pure',on:'レン',ku:'',lv:'N2',st:13,cat:'description',rad:'广',mn:'Shelter + all = frugal',ex:[{w:'廉価',r:'れんか',e:'low price'},{w:'清廉',r:'せいれん',e:'integrity'}]},
  {id:1647,k:'炉',m:'furnace / fireplace',on:'ロ',ku:'',lv:'N2',st:8,cat:'other',rad:'火',mn:'Fire + tiger = furnace',ex:[{w:'炉',r:'ろ',e:'furnace'},{w:'原子炉',r:'げんしろ',e:'nuclear reactor'}]},
  {id:1648,k:'浪',m:'wave / wandering',on:'ロウ',ku:'',lv:'N2',st:10,cat:'nature',rad:'水',mn:'Water + good = wave',ex:[{w:'浪人',r:'ろうにん',e:'ronin'},{w:'浪費',r:'ろうひ',e:'waste'}]},
  {id:1649,k:'弄',m:'play with',on:'ロウ',ku:'もてあそ-',lv:'N2',st:7,cat:'action',rad:'廾',mn:'King + hands = play with',ex:[{w:'弄ぶ',r:'もてあそぶ',e:'to play with'},{w:'愚弄',r:'ぐろう',e:'making a fool of'}]},
  {id:1650,k:'渥',m:'moist / grace',on:'アク',ku:'',lv:'N1',st:12,cat:'description',rad:'水',mn:'Water + give = moist',ex:[{w:'渥美',r:'あつみ',e:'Atsumi (place)'},{w:'渥恵',r:'あっけい',e:'gracious favor'}]},
  {id:1651,k:'斡',m:'manage / intermediary',on:'アツ',ku:'',lv:'N1',st:14,cat:'action',rad:'斗',mn:'Dipper + officer = manage',ex:[{w:'斡旋',r:'あっせん',e:'mediation'},{w:'斡旋業',r:'あっせんぎょう',e:'brokerage'}]},
  {id:1652,k:'闇',m:'darkness / black market',on:'アン',ku:'やみ',lv:'N1',st:17,cat:'other',rad:'門',mn:'Gate + sound = darkness',ex:[{w:'闇',r:'やみ',e:'darkness'},{w:'闇市',r:'やみいち',e:'black market'}]},
  {id:1653,k:'粟',m:'millet',on:'ゾク',ku:'あわ',lv:'N1',st:12,cat:'food',rad:'米',mn:'Rice + west = millet',ex:[{w:'粟',r:'あわ',e:'millet'},{w:'粟粒',r:'あわつぶ',e:'grain of millet'}]},
  {id:1654,k:'按',m:'press down / arrange',on:'アン',ku:'',lv:'N1',st:9,cat:'action',rad:'手',mn:'Hand + peaceful = press',ex:[{w:'按摩',r:'あんま',e:'massage'},{w:'按配',r:'あんばい',e:'arrangement'}]},
  {id:1655,k:'庵',m:'hermitage / hut',on:'アン',ku:'いおり',lv:'N1',st:11,cat:'place',rad:'广',mn:'Shelter + sound = hermitage',ex:[{w:'庵',r:'いおり',e:'hermitage'},{w:'草庵',r:'そうあん',e:'thatched hut'}]},
  {id:1656,k:'鞍',m:'saddle',on:'アン',ku:'くら',lv:'N1',st:15,cat:'other',rad:'革',mn:'Leather + peaceful = saddle',ex:[{w:'鞍',r:'くら',e:'saddle'},{w:'鞍馬',r:'くらま',e:'saddle horse'}]},
  {id:1657,k:'惟',m:'think / consider',on:'イ',ku:'',lv:'N1',st:11,cat:'action',rad:'心',mn:'Heart + bird = consider',ex:[{w:'惟う',r:'おもう',e:'to think'},{w:'惟神',r:'かんながら',e:'divine'}]},
  {id:1658,k:'威',m:'dignity / intimidate',on:'イ',ku:'',lv:'N1',st:9,cat:'other',rad:'女',mn:'Woman + weapon = dignity',ex:[{w:'威圧',r:'いあつ',e:'intimidation'},{w:'威厳',r:'いげん',e:'dignity'}]},
  {id:1659,k:'尉',m:'officer / comfort',on:'イ',ku:'',lv:'N1',st:11,cat:'person',rad:'寸',mn:'Inch + hand = officer',ex:[{w:'尉官',r:'いかん',e:'officer rank'},{w:'大尉',r:'たいい',e:'captain'}]},
  {id:1660,k:'姻',m:'marriage / relative by marriage',on:'イン',ku:'',lv:'N1',st:9,cat:'other',rad:'女',mn:'Woman + reason = marriage',ex:[{w:'姻戚',r:'いんせき',e:'relative by marriage'},{w:'婚姻',r:'こんいん',e:'matrimony'}]},
  {id:1661,k:'胤',m:'lineage / blood line',on:'イン',ku:'たね',lv:'N1',st:9,cat:'other',rad:'月',mn:'Body + son = lineage',ex:[{w:'後胤',r:'こういん',e:'descendant'},{w:'血胤',r:'けついん',e:'bloodline'}]},
  {id:1662,k:'淫',m:'licentious',on:'イン',ku:'みだ-',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + extend = licentious',ex:[{w:'淫乱',r:'いんらん',e:'licentious'},{w:'姦淫',r:'かんいん',e:'adultery'}]},
  {id:1663,k:'堰',m:'weir / dam',on:'エン',ku:'せき',lv:'N1',st:12,cat:'other',rad:'土',mn:'Earth + restrict = weir',ex:[{w:'堰',r:'せき',e:'weir / dam'},{w:'堰を切る',r:'せきをきる',e:'to burst forth'}]},
  {id:1664,k:'焔',m:'flame',on:'エン',ku:'ほのお',lv:'N1',st:11,cat:'nature',rad:'火',mn:'Fire + replace = flame',ex:[{w:'焔',r:'ほのお',e:'flame'},{w:'火焔',r:'かえん',e:'flames'}]},
  {id:1665,k:'鉛',m:'lead (metal)',on:'エン',ku:'なまり',lv:'N1',st:13,cat:'other',rad:'金',mn:'Metal + extend = lead',ex:[{w:'鉛',r:'なまり',e:'lead'},{w:'鉛筆',r:'えんぴつ',e:'pencil'}]},
  {id:1666,k:'謁',m:'audience',on:'エツ',ku:'',lv:'N1',st:15,cat:'action',rad:'言',mn:'Words + day = audience',ex:[{w:'謁見',r:'えっけん',e:'imperial audience'},{w:'拝謁',r:'はいえつ',e:'audience'}]},
  {id:1667,k:'縁',m:'fate / edge',on:'エン',ku:'ふち',lv:'N1',st:15,cat:'other',rad:'糸',mn:'Thread + pig = fate',ex:[{w:'縁',r:'えん',e:'fate'},{w:'縁側',r:'えんがわ',e:'veranda'}]},
  {id:1668,k:'旺',m:'prosperous',on:'オウ',ku:'',lv:'N1',st:8,cat:'description',rad:'日',mn:'Sun + king = prosperous',ex:[{w:'旺盛',r:'おうせい',e:'vigorous'},{w:'旺気',r:'おうき',e:'vigor'}]},
  {id:1669,k:'往',m:'go / past',on:'オウ',ku:'い-',lv:'N1',st:8,cat:'action',rad:'彳',mn:'Walk + king = go',ex:[{w:'往復',r:'おうふく',e:'round trip'},{w:'往来',r:'おうらい',e:'coming and going'}]},
  {id:1670,k:'殴',m:'beat / strike',on:'オウ',ku:'なぐ-',lv:'N1',st:8,cat:'action',rad:'殳',mn:'Lance + cage = beat',ex:[{w:'殴る',r:'なぐる',e:'to beat'},{w:'殴打',r:'おうだ',e:'beating'}]},
  {id:1671,k:'臆',m:'timid / mind',on:'オク',ku:'',lv:'N1',st:17,cat:'feeling',rad:'心',mn:'Heart + recall = timid',ex:[{w:'臆病',r:'おくびょう',e:'cowardice'},{w:'臆測',r:'おくそく',e:'speculation'}]},
  {id:1672,k:'牡',m:'male animal',on:'ボ',ku:'おす',lv:'N1',st:7,cat:'nature',rad:'牛',mn:'Cow + earth = male animal',ex:[{w:'牡',r:'おす',e:'male'},{w:'牡牛',r:'おうし',e:'bull'}]},
  {id:1673,k:'朧',m:'hazy / misty',on:'ロウ',ku:'おぼろ',lv:'N1',st:20,cat:'description',rad:'月',mn:'Moon + cage = hazy',ex:[{w:'朧月',r:'おぼろづき',e:'hazy moon'},{w:'朧げ',r:'おぼろげ',e:'hazy / vague'}]},
  {id:1674,k:'俺',m:'I / me (rough)',on:'エン',ku:'おれ',lv:'N1',st:10,cat:'person',rad:'人',mn:'Person + high = I (rough)',ex:[{w:'俺',r:'おれ',e:'I (rough male speech)'},{w:'俺様',r:'おれさま',e:'I (arrogant)'}]},
  {id:1675,k:'俤',m:'face / image',on:'テイ',ku:'おもかげ',lv:'N1',st:9,cat:'person',rad:'人',mn:'Person + elder = image',ex:[{w:'俤',r:'おもかげ',e:'face / image'},{w:'面影',r:'おもかげ',e:'image'}]},
  {id:1676,k:'折',m:'fold / bend',on:'セツ',ku:'お-',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + axe = fold',ex:[{w:'折る',r:'おる',e:'to fold'},{w:'骨折',r:'こっせつ',e:'fracture'}]},
  {id:1677,k:'尾',m:'tail / end',on:'ビ',ku:'お',lv:'N1',st:7,cat:'other',rad:'尸',mn:'Body + hair = tail',ex:[{w:'尾',r:'お',e:'tail'},{w:'尾根',r:'おね',e:'ridge'}]},
  {id:1678,k:'穏',m:'calm',on:'オン',ku:'おだ-',lv:'N1',st:16,cat:'description',rad:'禾',mn:'Grain + heart = calm',ex:[{w:'穏やか',r:'おだやか',e:'calm'},{w:'平穏',r:'へいおん',e:'peace and quiet'}]},
  {id:1679,k:'嘔',m:'vomit',on:'オウ',ku:'は-',lv:'N1',st:14,cat:'health',rad:'口',mn:'Mouth + area = vomit',ex:[{w:'嘔吐',r:'おうと',e:'vomiting'},{w:'嘔く',r:'はく',e:'to vomit'}]},
  {id:1680,k:'苛',m:'harsh / torment',on:'カ',ku:'いじ-',lv:'N1',st:8,cat:'description',rad:'艸',mn:'Grass + can = harsh',ex:[{w:'苛める',r:'いじめる',e:'to bully'},{w:'苛酷',r:'かこく',e:'harsh'}]},
  {id:1681,k:'蚊',m:'mosquito',on:'ブン',ku:'か',lv:'N1',st:10,cat:'nature',rad:'虫',mn:'Insect + writing = mosquito',ex:[{w:'蚊',r:'か',e:'mosquito'},{w:'蚊帳',r:'かや',e:'mosquito net'}]},
  {id:1682,k:'貝',m:'shell',on:'バイ',ku:'かい',lv:'N1',st:7,cat:'nature',rad:'目',mn:'Eye + legs = shell',ex:[{w:'貝',r:'かい',e:'shell'},{w:'貝殻',r:'かいがら',e:'shell'}]},
  {id:1683,k:'柿',m:'persimmon',on:'シ',ku:'かき',lv:'N1',st:9,cat:'food',rad:'木',mn:'Wood + city = persimmon',ex:[{w:'柿',r:'かき',e:'persimmon'},{w:'柿の木',r:'かきのき',e:'persimmon tree'}]},
  {id:1684,k:'嚇',m:'intimidate',on:'カク',ku:'',lv:'N1',st:17,cat:'action',rad:'口',mn:'Mouth + fire = intimidate',ex:[{w:'威嚇',r:'いかく',e:'intimidation'},{w:'嚇す',r:'おどす',e:'to intimidate'}]},
  {id:1685,k:'柩',m:'coffin',on:'キュウ',ku:'ひつぎ',lv:'N1',st:9,cat:'other',rad:'木',mn:'Wood + prisoner = coffin',ex:[{w:'柩',r:'ひつぎ',e:'coffin'},{w:'霊柩車',r:'れいきゅうしゃ',e:'hearse'}]},
  {id:1686,k:'頬',m:'cheek',on:'キョウ',ku:'ほお',lv:'N1',st:15,cat:'body',rad:'頁',mn:'Page + bound = cheek',ex:[{w:'頬',r:'ほお',e:'cheek'},{w:'頬杖',r:'ほおづえ',e:'resting chin on hand'}]},
  {id:1687,k:'僑',m:'living abroad',on:'キョウ',ku:'',lv:'N1',st:14,cat:'person',rad:'人',mn:'Person + tall = overseas',ex:[{w:'華僑',r:'かきょう',e:'overseas Chinese'},{w:'僑居',r:'きょうきょ',e:'living abroad'}]},
  {id:1688,k:'鏡',m:'mirror',on:'キョウ',ku:'かがみ',lv:'N1',st:19,cat:'other',rad:'金',mn:'Metal + compete = mirror',ex:[{w:'鏡',r:'かがみ',e:'mirror'},{w:'手鏡',r:'てかがみ',e:'hand mirror'}]},
  {id:1689,k:'藻',m:'seaweed / algae',on:'ソウ',ku:'も',lv:'N1',st:19,cat:'nature',rad:'艸',mn:'Grass + water = seaweed',ex:[{w:'藻',r:'も',e:'seaweed'},{w:'海藻',r:'かいそう',e:'seaweed'}]},
  {id:1690,k:'暁',m:'dawn / daybreak',on:'ギョウ',ku:'あかつき',lv:'N1',st:12,cat:'nature',rad:'日',mn:'Sun + dawn = daybreak',ex:[{w:'暁',r:'あかつき',e:'dawn'},{w:'払暁',r:'ふつぎょう',e:'daybreak'}]},
  {id:1691,k:'錦',m:'brocade / beauty',on:'キン',ku:'にしき',lv:'N1',st:16,cat:'art',rad:'金',mn:'Metal + white cloth = brocade',ex:[{w:'錦',r:'にしき',e:'brocade'},{w:'錦絵',r:'にしきえ',e:'woodblock print'}]},
  {id:1692,k:'巾',m:'cloth / turban',on:'キン',ku:'',lv:'N1',st:3,cat:'other',rad:'巾',mn:'Cloth shape = cloth',ex:[{w:'巾',r:'きん',e:'cloth'},{w:'雑巾',r:'ぞうきん',e:'cleaning cloth'}]},
  {id:1693,k:'僅',m:'slight',on:'キン',ku:'わず-',lv:'N1',st:13,cat:'description',rad:'人',mn:'Person + careful = slight',ex:[{w:'僅か',r:'わずか',e:'slight'},{w:'僅差',r:'きんさ',e:'narrow margin'}]},
  {id:1694,k:'矩',m:'square / rule',on:'ク',ku:'かね',lv:'N1',st:10,cat:'other',rad:'矢',mn:'Arrow + carpenter = square',ex:[{w:'矩形',r:'くけい',e:'rectangle'},{w:'矩尺',r:'かねじゃく',e:'carpenter\'s square'}]},
  {id:1695,k:'供',m:'offer / accompany',on:'キョウ',ku:'そな-・とも',lv:'N1',st:8,cat:'action',rad:'人',mn:'Person + together = offer',ex:[{w:'供える',r:'そなえる',e:'to offer'},{w:'子供',r:'こども',e:'child'}]},
  {id:1696,k:'鎖',m:'chain',on:'サ',ku:'くさり',lv:'N1',st:18,cat:'other',rad:'金',mn:'Metal + small = chain',ex:[{w:'鎖',r:'くさり',e:'chain'},{w:'連鎖',r:'れんさ',e:'chain'}]},
  {id:1697,k:'楔',m:'wedge',on:'セツ',ku:'くさび',lv:'N1',st:13,cat:'other',rad:'木',mn:'Wood + contract = wedge',ex:[{w:'楔',r:'くさび',e:'wedge'},{w:'楔形',r:'くさびがた',e:'wedge-shaped'}]},
  {id:1698,k:'朽',m:'rot / decay',on:'キュウ',ku:'く-',lv:'N1',st:6,cat:'nature',rad:'木',mn:'Wood + ladle = decay',ex:[{w:'朽ちる',r:'くちる',e:'to decay'},{w:'老朽',r:'ろうきゅう',e:'aging / worn out'}]},
  {id:1699,k:'鞭',m:'whip',on:'ベン',ku:'むち',lv:'N1',st:18,cat:'other',rad:'革',mn:'Leather + whip = whip',ex:[{w:'鞭',r:'むち',e:'whip'},{w:'鞭打ち',r:'むちうち',e:'whipping'}]},
  {id:1700,k:'閾',m:'threshold',on:'イキ',ku:'しきい',lv:'N1',st:16,cat:'other',rad:'門',mn:'Gate + force = threshold',ex:[{w:'閾値',r:'しきいち',e:'threshold value'},{w:'閾',r:'しきい',e:'threshold'}]},
  {id:1701,k:'桁',m:'digit / girder',on:'コウ',ku:'けた',lv:'N1',st:10,cat:'other',rad:'木',mn:'Wood + row = digit',ex:[{w:'桁',r:'けた',e:'digit / girder'},{w:'一桁',r:'ひとけた',e:'single digit'}]},
  {id:1702,k:'獄',m:'prison',on:'ゴク',ku:'',lv:'N1',st:14,cat:'other',rad:'犬',mn:'Dog + words = prison',ex:[{w:'獄中',r:'ごくちゅう',e:'in prison'},{w:'監獄',r:'かんごく',e:'prison'}]},
  {id:1703,k:'轟',m:'rumble / roar',on:'ゴウ',ku:'とどろ-',lv:'N1',st:21,cat:'other',rad:'車',mn:'Three carts = roar',ex:[{w:'轟く',r:'とどろく',e:'to roar'},{w:'轟音',r:'ごうおん',e:'thunderous sound'}]},
  {id:1704,k:'傲',m:'arrogant',on:'ゴウ',ku:'おご-',lv:'N1',st:13,cat:'description',rad:'人',mn:'Person + proudly = arrogant',ex:[{w:'傲慢',r:'ごうまん',e:'arrogance'},{w:'傲る',r:'おごる',e:'to be arrogant'}]},
  {id:1705,k:'碁',m:'go (board game)',on:'ゴ',ku:'',lv:'N1',st:13,cat:'art',rad:'石',mn:'Stone + its = go',ex:[{w:'囲碁',r:'いご',e:'go (game)'},{w:'碁盤',r:'ごばん',e:'go board'}]},
  {id:1706,k:'崖',m:'cliff',on:'ガイ',ku:'がけ',lv:'N1',st:11,cat:'nature',rad:'山',mn:'Mountain + soil = cliff',ex:[{w:'崖',r:'がけ',e:'cliff'},{w:'断崖',r:'だんがい',e:'precipice'}]},
  {id:1707,k:'蟹',m:'crab',on:'カイ',ku:'かに',lv:'N1',st:19,cat:'nature',rad:'虫',mn:'Insect + crab = crab',ex:[{w:'蟹',r:'かに',e:'crab'},{w:'蟹座',r:'かにざ',e:'Cancer (zodiac)'}]},
  {id:1708,k:'灘',m:'rough sea',on:'タン',ku:'なだ',lv:'N1',st:21,cat:'nature',rad:'水',mn:'Water + difficult = rough sea',ex:[{w:'灘',r:'なだ',e:'rough sea'},{w:'灘の酒',r:'なだのさけ',e:'Nada sake'}]},
  {id:1709,k:'謀',m:'plot',on:'ボウ',ku:'はか-',lv:'N1',st:16,cat:'action',rad:'言',mn:'Words + plum = plot',ex:[{w:'謀略',r:'ぼうりゃく',e:'scheme'},{w:'共謀',r:'きょうぼう',e:'conspiracy'}]},
  {id:1710,k:'蹴',m:'kick',on:'シュウ',ku:'け-',lv:'N1',st:19,cat:'action',rad:'足',mn:'Foot + autumn = kick',ex:[{w:'蹴る',r:'ける',e:'to kick'},{w:'蹴球',r:'しゅっきゅう',e:'soccer'}]},
  {id:1711,k:'詮',m:'investigate / explain',on:'セン',ku:'',lv:'N1',st:13,cat:'action',rad:'言',mn:'Words + complete = investigate',ex:[{w:'詮索',r:'せんさく',e:'investigation'},{w:'所詮',r:'しょせん',e:'after all'}]},
  {id:1712,k:'贈',m:'give / present',on:'ゾウ',ku:'おく-',lv:'N1',st:18,cat:'action',rad:'貝',mn:'Shell + increase = give',ex:[{w:'贈る',r:'おくる',e:'to give'},{w:'贈り物',r:'おくりもの',e:'gift'}]},
  {id:1713,k:'辿',m:'follow / trace',on:'テン',ku:'たど-',lv:'N1',st:7,cat:'action',rad:'辵',mn:'Walk + along = trace',ex:[{w:'辿る',r:'たどる',e:'to trace'},{w:'辿り着く',r:'たどりつく',e:'to reach after effort'}]},
  {id:1714,k:'溺',m:'drown / indulge',on:'デキ',ku:'おぼ-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + weak = drown',ex:[{w:'溺れる',r:'おぼれる',e:'to drown'},{w:'溺愛',r:'できあい',e:'doting love'}]},
  {id:1715,k:'眺',m:'gaze / view',on:'チョウ',ku:'なが-',lv:'N1',st:11,cat:'action',rad:'目',mn:'Eye + jump = gaze',ex:[{w:'眺める',r:'ながめる',e:'to gaze'},{w:'眺望',r:'ちょうぼう',e:'view'}]},
  {id:1716,k:'鍋',m:'pot / pan',on:'カ',ku:'なべ',lv:'N1',st:17,cat:'food',rad:'金',mn:'Metal + harmony = pot',ex:[{w:'鍋',r:'なべ',e:'pot'},{w:'鍋料理',r:'なべりょうり',e:'hot pot dish'}]},
  {id:1717,k:'滑',m:'slippery / smooth',on:'カツ',ku:'すべ-・なめ-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + bone = slippery',ex:[{w:'滑る',r:'すべる',e:'to slide'},{w:'滑らか',r:'なめらか',e:'smooth'}]},
  {id:1718,k:'那',m:'that / what',on:'ナ',ku:'',lv:'N1',st:8,cat:'other',rad:'邑',mn:'Town + can = what',ex:[{w:'那覇',r:'なは',e:'Naha'},{w:'旦那',r:'だんな',e:'husband / master'}]},
  {id:1719,k:'鈍',m:'dull',on:'ドン',ku:'にぶ-',lv:'N1',st:12,cat:'description',rad:'金',mn:'Metal + retreat = dull',ex:[{w:'鈍る',r:'なまる',e:'to become dull'},{w:'鈍感',r:'どんかん',e:'insensitivity'}]},
  {id:1720,k:'詫',m:'apologize',on:'タ',ku:'わび-',lv:'N1',st:12,cat:'action',rad:'言',mn:'Words + other = apologize',ex:[{w:'詫びる',r:'わびる',e:'to apologize'},{w:'詫び状',r:'わびじょう',e:'letter of apology'}]},
  {id:1721,k:'這',m:'crawl / creep',on:'ハイ',ku:'は-',lv:'N1',st:11,cat:'action',rad:'辵',mn:'Walk + flower = crawl',ex:[{w:'這う',r:'はう',e:'to crawl'},{w:'這い回る',r:'はいまわる',e:'to crawl around'}]},
  {id:1722,k:'狭',m:'narrow / small',on:'キョウ',ku:'せま-・せば-',lv:'N1',st:9,cat:'description',rad:'犬',mn:'Dog + narrow = narrow',ex:[{w:'狭い',r:'せまい',e:'narrow'},{w:'狭める',r:'せばめる',e:'to narrow'}]},
  {id:1723,k:'孵',m:'hatch',on:'フ',ku:'かえ-',lv:'N1',st:19,cat:'nature',rad:'卵',mn:'Egg + hatch = hatch',ex:[{w:'孵化',r:'ふか',e:'hatching'},{w:'孵る',r:'かえる',e:'to hatch'}]},
  {id:1724,k:'蛹',m:'pupa / chrysalis',on:'ヨウ',ku:'さなぎ',lv:'N1',st:13,cat:'nature',rad:'虫',mn:'Insect + container = pupa',ex:[{w:'蛹',r:'さなぎ',e:'pupa'},{w:'蛹化',r:'ようか',e:'pupation'}]},
  {id:1725,k:'奢',m:'extravagant',on:'シャ',ku:'おご-',lv:'N1',st:11,cat:'description',rad:'大',mn:'Big + person = extravagant',ex:[{w:'奢る',r:'おごる',e:'to be extravagant'},{w:'奢侈',r:'しゃし',e:'luxury'}]},
  {id:1726,k:'遥',m:'far / distant',on:'ヨウ',ku:'はる-',lv:'N1',st:13,cat:'description',rad:'辵',mn:'Walk + shake = distant',ex:[{w:'遥か',r:'はるか',e:'far'},{w:'遥遠',r:'ようえん',e:'faraway'}]},
  {id:1727,k:'聡',m:'clever / alert',on:'ソウ',ku:'さと-',lv:'N1',st:17,cat:'description',rad:'耳',mn:'Ear + window = clever',ex:[{w:'聡明',r:'そうめい',e:'clever'},{w:'聡い',r:'さとい',e:'alert'}]},
  {id:1728,k:'穿',m:'pierce / wear',on:'セン',ku:'うが-・は-',lv:'N1',st:9,cat:'action',rad:'穴',mn:'Hole + teeth = pierce',ex:[{w:'穿く',r:'はく',e:'to wear (bottoms)'},{w:'穿つ',r:'うがつ',e:'to pierce'}]},
  {id:1729,k:'憐',m:'pity / sympathize',on:'レン',ku:'あわ-',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + nearby = pity',ex:[{w:'憐れむ',r:'あわれむ',e:'to pity'},{w:'可憐',r:'かれん',e:'lovely'}]},
  {id:1730,k:'凛',m:'cold / dignified',on:'リン',ku:'',lv:'N1',st:15,cat:'description',rad:'冫',mn:'Ice + aware = dignified',ex:[{w:'凛々しい',r:'りりしい',e:'dignified'},{w:'凛とした',r:'りんとした',e:'dignified'}]},
  {id:1731,k:'濯',m:'wash / rinse',on:'タク',ku:'すす-',lv:'N1',st:17,cat:'action',rad:'水',mn:'Water + sheep = wash',ex:[{w:'洗濯',r:'せんたく',e:'laundry'},{w:'濯ぐ',r:'すすぐ',e:'to rinse'}]},
  {id:1732,k:'藤',m:'wisteria / vine',on:'トウ',ku:'ふじ',lv:'N1',st:18,cat:'nature',rad:'艸',mn:'Grass + rise = wisteria',ex:[{w:'藤',r:'ふじ',e:'wisteria'},{w:'藤色',r:'ふじいろ',e:'wisteria purple'}]},
  {id:1733,k:'淡',m:'light / faint',on:'タン',ku:'あわ-',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + flame = light',ex:[{w:'淡い',r:'あわい',e:'faint / light'},{w:'淡水',r:'たんすい',e:'fresh water'}]},
  {id:1734,k:'壇',m:'platform / altar',on:'ダン',ku:'',lv:'N1',st:16,cat:'other',rad:'土',mn:'Earth + single = platform',ex:[{w:'壇',r:'だん',e:'platform'},{w:'仏壇',r:'ぶつだん',e:'Buddhist altar'}]},
  {id:1735,k:'弔',m:'condolence / mourn',on:'チョウ',ku:'とむら-',lv:'N1',st:4,cat:'other',rad:'弓',mn:'Bow + hanging = mourn',ex:[{w:'弔う',r:'とむらう',e:'to mourn'},{w:'弔問',r:'ちょうもん',e:'condolence visit'}]},
  {id:1736,k:'跪',m:'kneel',on:'キ',ku:'ひざまず-',lv:'N1',st:13,cat:'action',rad:'足',mn:'Foot + strange = kneel',ex:[{w:'跪く',r:'ひざまずく',e:'to kneel'},{w:'跪礼',r:'きれい',e:'kneeling bow'}]},
  {id:1737,k:'苑',m:'garden / park',on:'エン',ku:'その',lv:'N1',st:8,cat:'place',rad:'艸',mn:'Grass + garden = park',ex:[{w:'苑',r:'その',e:'garden'},{w:'楽苑',r:'がくえん',e:'garden of pleasure'}]},
  {id:1738,k:'唄',m:'song / ballad',on:'ハイ',ku:'うた',lv:'N1',st:10,cat:'art',rad:'口',mn:'Mouth + shell = song',ex:[{w:'唄',r:'うた',e:'song'},{w:'小唄',r:'こうた',e:'ballad'}]},
  {id:1739,k:'肘',m:'elbow',on:'チュウ',ku:'ひじ',lv:'N1',st:7,cat:'body',rad:'月',mn:'Body + inch = elbow',ex:[{w:'肘',r:'ひじ',e:'elbow'},{w:'肘掛け',r:'ひじかけ',e:'armrest'}]},
  {id:1740,k:'紐',m:'string / cord',on:'チュウ',ku:'ひも',lv:'N1',st:10,cat:'other',rad:'糸',mn:'Thread + button = cord',ex:[{w:'紐',r:'ひも',e:'cord'},{w:'紐解く',r:'ひもとく',e:'to unravel'}]},
  {id:1741,k:'痺',m:'numb / tingle',on:'ヒ',ku:'しび-',lv:'N1',st:13,cat:'health',rad:'疒',mn:'Sickbed + humble = numb',ex:[{w:'痺れる',r:'しびれる',e:'to go numb'},{w:'麻痺',r:'まひ',e:'paralysis'}]},
  {id:1742,k:'牒',m:'document / tablet',on:'チョウ',ku:'',lv:'N1',st:13,cat:'other',rad:'片',mn:'Slice + tree = tablet',ex:[{w:'諜報',r:'ちょうほう',e:'intelligence'},{w:'牒状',r:'ちょうじょう',e:'document'}]},
  {id:1743,k:'樽',m:'barrel / cask',on:'ソン',ku:'たる',lv:'N1',st:16,cat:'other',rad:'木',mn:'Wood + honor = barrel',ex:[{w:'樽',r:'たる',e:'barrel'},{w:'樽酒',r:'たるざけ',e:'barrel sake'}]},
  {id:1744,k:'抄',m:'excerpt / skim',on:'ショウ',ku:'',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + few = excerpt',ex:[{w:'抄録',r:'しょうろく',e:'excerpt'},{w:'鈔',r:'しょう',e:'excerpt'}]},
  {id:1745,k:'韓',m:'Korea',on:'カン',ku:'',lv:'N1',st:18,cat:'other',rad:'韋',mn:'Leather + morning = Korea',ex:[{w:'韓国',r:'かんこく',e:'South Korea'},{w:'日韓',r:'にっかん',e:'Japan-Korea'}]},
  {id:1746,k:'苔',m:'moss',on:'タイ',ku:'こけ',lv:'N1',st:8,cat:'nature',rad:'艸',mn:'Grass + old = moss',ex:[{w:'苔',r:'こけ',e:'moss'},{w:'岩苔',r:'いわごけ',e:'rock moss'}]},
  {id:1747,k:'箸',m:'chopsticks',on:'チョ',ku:'はし',lv:'N1',st:15,cat:'other',rad:'竹',mn:'Bamboo + boil = chopsticks',ex:[{w:'箸',r:'はし',e:'chopsticks'},{w:'割り箸',r:'わりばし',e:'disposable chopsticks'}]},
  {id:1748,k:'脛',m:'shin / shins',on:'ケイ',ku:'すね',lv:'N1',st:11,cat:'body',rad:'月',mn:'Body + path = shin',ex:[{w:'脛',r:'すね',e:'shin'},{w:'脛をかじる',r:'すねをかじる',e:'to sponge off parents'}]},
  {id:1749,k:'錠',m:'lock / pill',on:'ジョウ',ku:'',lv:'N1',st:16,cat:'other',rad:'金',mn:'Metal + establish = lock',ex:[{w:'錠',r:'じょう',e:'lock'},{w:'錠剤',r:'じょうざい',e:'pill / tablet'}]},
  {id:1750,k:'硫',m:'sulfur',on:'リュウ',ku:'',lv:'N1',st:12,cat:'other',rad:'石',mn:'Stone + flow = sulfur',ex:[{w:'硫黄',r:'いおう',e:'sulfur'},{w:'硫酸',r:'りゅうさん',e:'sulfuric acid'}]},
  {id:1751,k:'燐',m:'phosphorus',on:'リン',ku:'',lv:'N1',st:16,cat:'other',rad:'火',mn:'Fire + scale = phosphorus',ex:[{w:'燐',r:'りん',e:'phosphorus'},{w:'燐酸',r:'りんさん',e:'phosphoric acid'}]},
  {id:1752,k:'坦',m:'level / frank',on:'タン',ku:'',lv:'N1',st:8,cat:'description',rad:'土',mn:'Earth + morning = level',ex:[{w:'坦々',r:'たんたん',e:'calmly'},{w:'平坦',r:'へいたん',e:'flat'}]},
  {id:1753,k:'嗅',m:'smell / sniff',on:'キュウ',ku:'か-',lv:'N1',st:13,cat:'action',rad:'口',mn:'Mouth + dog nose = sniff',ex:[{w:'嗅ぐ',r:'かぐ',e:'to sniff'},{w:'嗅覚',r:'きゅうかく',e:'sense of smell'}]},
  {id:1754,k:'羨',m:'envy',on:'セン',ku:'うらや-',lv:'N1',st:13,cat:'feeling',rad:'羊',mn:'Sheep + next = envy',ex:[{w:'羨む',r:'うらやむ',e:'to envy'},{w:'羨望',r:'せんぼう',e:'envy'}]},
  {id:1755,k:'怠',m:'lazy / neglect',on:'タイ',ku:'おこた-・なま-',lv:'N1',st:9,cat:'description',rad:'心',mn:'Heart + platform = lazy',ex:[{w:'怠ける',r:'なまける',e:'to be lazy'},{w:'怠慢',r:'たいまん',e:'negligence'}]},
  {id:1756,k:'騙',m:'deceive / cheat',on:'ヘン',ku:'だま-',lv:'N1',st:16,cat:'action',rad:'馬',mn:'Horse + flat = deceive',ex:[{w:'騙す',r:'だます',e:'to deceive'},{w:'詐騙',r:'さへん',e:'fraud'}]},
  {id:1757,k:'諦',m:'give up / truth',on:'テイ',ku:'あきら-',lv:'N1',st:16,cat:'action',rad:'言',mn:'Words + emperor = truth',ex:[{w:'諦める',r:'あきらめる',e:'to give up'},{w:'真諦',r:'しんてい',e:'true meaning'}]},
  {id:1758,k:'吟',m:'recite / groan',on:'ギン',ku:'',lv:'N1',st:7,cat:'art',rad:'口',mn:'Mouth + now = recite',ex:[{w:'吟じる',r:'ぎんじる',e:'to recite'},{w:'吟味',r:'ぎんみ',e:'scrutiny'}]},
  {id:1759,k:'錯',m:'illusion / mix up',on:'サク',ku:'',lv:'N1',st:16,cat:'other',rad:'金',mn:'Metal + former = mix up',ex:[{w:'錯覚',r:'さっかく',e:'illusion'},{w:'錯乱',r:'さくらん',e:'confusion'}]},
  {id:1760,k:'唆',m:'instigate / incite',on:'サ',ku:'そそのか-',lv:'N1',st:10,cat:'action',rad:'口',mn:'Mouth + left = instigate',ex:[{w:'唆す',r:'そそのかす',e:'to instigate'},{w:'示唆',r:'しさ',e:'suggestion'}]},
  {id:1761,k:'詐',m:'deceive / fraud',on:'サ',ku:'',lv:'N1',st:12,cat:'action',rad:'言',mn:'Words + assistant = fraud',ex:[{w:'詐欺',r:'さぎ',e:'fraud'},{w:'詐称',r:'さしょう',e:'false claim'}]},
  {id:1762,k:'砦',m:'fort / stronghold',on:'サイ',ku:'とりで',lv:'N1',st:11,cat:'place',rad:'石',mn:'Stone + wood = fort',ex:[{w:'砦',r:'とりで',e:'fort'},{w:'山砦',r:'やまとりで',e:'mountain fort'}]},
  {id:1763,k:'晒',m:'bleach / expose',on:'サイ',ku:'さら-',lv:'N1',st:10,cat:'action',rad:'日',mn:'Sun + west = bleach',ex:[{w:'晒す',r:'さらす',e:'to expose'},{w:'晒し',r:'さらし',e:'bleached cloth'}]},
  {id:1764,k:'柵',m:'fence / railing',on:'サク',ku:'さく',lv:'N1',st:9,cat:'other',rad:'木',mn:'Wood + bundle = fence',ex:[{w:'柵',r:'さく',e:'fence'},{w:'防柵',r:'ぼうさく',e:'fence / barrier'}]},
  {id:1765,k:'嗄',m:'hoarse',on:'サ',ku:'しわが-',lv:'N1',st:13,cat:'health',rad:'口',mn:'Mouth + reduce = hoarse',ex:[{w:'嗄れる',r:'しゃがれる',e:'to become hoarse'},{w:'嗄声',r:'させい',e:'hoarse voice'}]},
  {id:1766,k:'挫',m:'crush / sprain',on:'ザ',ku:'くじ-',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + sit = crush',ex:[{w:'挫く',r:'くじく',e:'to crush'},{w:'挫折',r:'ざせつ',e:'setback'}]},
  {id:1767,k:'錆',m:'rust',on:'ショウ',ku:'さび',lv:'N1',st:16,cat:'other',rad:'金',mn:'Metal + green = rust',ex:[{w:'錆',r:'さび',e:'rust'},{w:'錆びる',r:'さびる',e:'to rust'}]},
  {id:1768,k:'鯖',m:'mackerel',on:'セイ',ku:'さば',lv:'N1',st:19,cat:'nature',rad:'魚',mn:'Fish + blue = mackerel',ex:[{w:'鯖',r:'さば',e:'mackerel'},{w:'鯖寿司',r:'さばずし',e:'mackerel sushi'}]},
  {id:1769,k:'鮫',m:'shark',on:'コウ',ku:'さめ',lv:'N1',st:17,cat:'nature',rad:'魚',mn:'Fish + exchange = shark',ex:[{w:'鮫',r:'さめ',e:'shark'},{w:'鮫肌',r:'さめはだ',e:'rough skin'}]},
  {id:1770,k:'皿',m:'plate / dish',on:'ベイ',ku:'さら',lv:'N1',st:5,cat:'other',rad:'皿',mn:'Plate shape = plate',ex:[{w:'皿',r:'さら',e:'plate'},{w:'灰皿',r:'はいざら',e:'ashtray'}]},
  {id:1771,k:'汐',m:'evening tide',on:'セキ',ku:'しお',lv:'N1',st:6,cat:'nature',rad:'水',mn:'Water + evening = tide',ex:[{w:'汐',r:'しお',e:'evening tide'},{w:'潮汐',r:'ちょうせき',e:'tide'}]},
  {id:1772,k:'軋',m:'creak / discord',on:'アツ',ku:'きし-',lv:'N1',st:8,cat:'other',rad:'車',mn:'Cart + clash = creak',ex:[{w:'軋む',r:'きしむ',e:'to creak'},{w:'軋轢',r:'あつれき',e:'friction'}]},
  {id:1773,k:'漸',m:'gradually',on:'ゼン',ku:'',lv:'N1',st:14,cat:'other',rad:'水',mn:'Water + cut = gradually',ex:[{w:'漸次',r:'ぜんじ',e:'gradually'},{w:'漸進',r:'ぜんしん',e:'gradual progress'}]},
  {id:1774,k:'膿',m:'pus',on:'ノウ',ku:'うみ',lv:'N1',st:17,cat:'health',rad:'月',mn:'Body + dense = pus',ex:[{w:'膿',r:'うみ',e:'pus'},{w:'膿む',r:'うむ',e:'to fester'}]},
  {id:1775,k:'鎮',m:'calm / suppress',on:'チン',ku:'しず-',lv:'N1',st:18,cat:'action',rad:'金',mn:'Metal + true = suppress',ex:[{w:'鎮める',r:'しずめる',e:'to suppress'},{w:'鎮静',r:'ちんせい',e:'sedation'}]},
  {id:1776,k:'暢',m:'stretch / joyful',on:'チョウ',ku:'',lv:'N1',st:14,cat:'description',rad:'日',mn:'Sun + extend = joyful',ex:[{w:'暢気',r:'のんき',e:'carefree'},{w:'伸暢',r:'しんちょう',e:'stretching'}]},
  {id:1777,k:'鳥',m:'bird',on:'チョウ',ku:'とり',lv:'N1',st:11,cat:'nature',rad:'鳥',mn:'Bird shape = bird',ex:[{w:'鳥',r:'とり',e:'bird'},{w:'鳥居',r:'とりい',e:'torii gate'}]},
  {id:1778,k:'彫',m:'carve',on:'チョウ',ku:'ほ-',lv:'N1',st:11,cat:'art',rad:'彡',mn:'Hair + bird = carve',ex:[{w:'彫る',r:'ほる',e:'to carve'},{w:'彫刻',r:'ちょうこく',e:'sculpture'}]},
  {id:1779,k:'脹',m:'swell',on:'チョウ',ku:'ふく-',lv:'N1',st:12,cat:'health',rad:'月',mn:'Body + spread = swell',ex:[{w:'膨脹',r:'ぼうちょう',e:'expansion'},{w:'脹れる',r:'ふくれる',e:'to swell'}]},
  {id:1780,k:'鶏',m:'chicken',on:'ケイ',ku:'にわとり',lv:'N1',st:19,cat:'nature',rad:'鳥',mn:'Bird + system = chicken',ex:[{w:'鶏',r:'にわとり',e:'chicken'},{w:'鶏卵',r:'けいらん',e:'egg'}]},
  {id:1781,k:'壷',m:'jar / pot',on:'コ',ku:'つぼ',lv:'N1',st:12,cat:'other',rad:'土',mn:'Earth + container = jar',ex:[{w:'壷',r:'つぼ',e:'jar'},{w:'急所',r:'きゅうしょ',e:'vital spot'}]},
  {id:1782,k:'漆',m:'lacquer',on:'シツ',ku:'うるし',lv:'N1',st:14,cat:'art',rad:'水',mn:'Water + tree = lacquer',ex:[{w:'漆',r:'うるし',e:'lacquer'},{w:'漆器',r:'しっき',e:'lacquerware'}]},
  {id:1783,k:'桐',m:'paulownia',on:'ドウ',ku:'きり',lv:'N1',st:10,cat:'nature',rad:'木',mn:'Wood + same = paulownia',ex:[{w:'桐',r:'きり',e:'paulownia'},{w:'桐箪笥',r:'きりたんす',e:'paulownia chest'}]},
  {id:1784,k:'楠',m:'camphor tree',on:'ナン',ku:'くすのき',lv:'N1',st:13,cat:'nature',rad:'木',mn:'Wood + south = camphor',ex:[{w:'楠',r:'くすのき',e:'camphor tree'},{w:'楠木',r:'くすのき',e:'camphor wood'}]},
  {id:1785,k:'橘',m:'mandarin orange',on:'キツ',ku:'たちばな',lv:'N1',st:16,cat:'nature',rad:'木',mn:'Wood + orange = mandarin',ex:[{w:'橘',r:'たちばな',e:'mandarin orange'},{w:'橘色',r:'たちばないろ',e:'tangerine color'}]},
  {id:1786,k:'椹',m:'cherry tree timber',on:'シン',ku:'さわら',lv:'N1',st:13,cat:'nature',rad:'木',mn:'Wood + deep = cypress',ex:[{w:'椹',r:'さわら',e:'sawara cypress'},{w:'椹木',r:'さわらぎ',e:'cypress wood'}]},
  {id:1787,k:'藪',m:'thicket / bush',on:'ソウ',ku:'やぶ',lv:'N1',st:18,cat:'nature',rad:'艸',mn:'Grass + thin = thicket',ex:[{w:'藪',r:'やぶ',e:'thicket'},{w:'藪医者',r:'やぶいしゃ',e:'quack doctor'}]},
  {id:1788,k:'葛',m:'arrowroot vine',on:'カツ',ku:'くず',lv:'N1',st:12,cat:'nature',rad:'艸',mn:'Grass + coil = arrowroot',ex:[{w:'葛',r:'くず',e:'arrowroot'},{w:'葛藤',r:'かっとう',e:'conflict'}]},
  {id:1789,k:'蕨',m:'bracken / fern',on:'ケツ',ku:'わらび',lv:'N1',st:15,cat:'nature',rad:'艸',mn:'Grass + coil = fern',ex:[{w:'蕨',r:'わらび',e:'bracken'},{w:'蕨餅',r:'わらびもち',e:'bracken starch cake'}]},
  {id:1790,k:'菅',m:'sedge / rush',on:'カン',ku:'すげ・すが',lv:'N1',st:11,cat:'nature',rad:'艸',mn:'Grass + official = sedge',ex:[{w:'菅',r:'すが',e:'sedge'},{w:'菅笠',r:'すがさ',e:'sedge hat'}]},
  {id:1791,k:'茄',m:'eggplant',on:'カ',ku:'なす',lv:'N1',st:8,cat:'food',rad:'艸',mn:'Grass + add = eggplant',ex:[{w:'茄子',r:'なす',e:'eggplant'},{w:'焼き茄子',r:'やきなす',e:'grilled eggplant'}]},
  {id:1792,k:'葱',m:'green onion',on:'ソウ',ku:'ねぎ',lv:'N1',st:13,cat:'food',rad:'艸',mn:'Grass + window = green onion',ex:[{w:'葱',r:'ねぎ',e:'green onion'},{w:'葱油',r:'ねぎあぶら',e:'scallion oil'}]},
  {id:1793,k:'蕎',m:'buckwheat',on:'キョウ',ku:'そば',lv:'N1',st:15,cat:'food',rad:'艸',mn:'Grass + bridge = buckwheat',ex:[{w:'蕎麦',r:'そば',e:'soba noodles'},{w:'蕎麦屋',r:'そばや',e:'soba restaurant'}]},
  {id:1794,k:'椀',m:'wooden bowl',on:'ワン',ku:'',lv:'N1',st:12,cat:'other',rad:'木',mn:'Wood + perfection = wooden bowl',ex:[{w:'椀',r:'わん',e:'wooden bowl'},{w:'お椀',r:'おわん',e:'bowl'}]},
  {id:1795,k:'籠',m:'cage / basket',on:'ロウ',ku:'かご',lv:'N1',st:22,cat:'other',rad:'竹',mn:'Bamboo + dragon = cage',ex:[{w:'籠',r:'かご',e:'basket / cage'},{w:'籠もる',r:'こもる',e:'to confine oneself'}]},
  {id:1796,k:'盃',m:'cup / sake cup',on:'ハイ',ku:'さかずき',lv:'N1',st:9,cat:'other',rad:'皿',mn:'Dish + not = cup',ex:[{w:'盃',r:'さかずき',e:'sake cup'},{w:'盃を交わす',r:'さかずきをかわす',e:'to exchange cups'}]},
  {id:1797,k:'茅',m:'miscanthus / thatching',on:'ボウ',ku:'かや',lv:'N1',st:8,cat:'nature',rad:'艸',mn:'Grass + spear = thatching',ex:[{w:'茅',r:'かや',e:'thatch grass'},{w:'茅葺き',r:'かやぶき',e:'thatched roof'}]},
  {id:1798,k:'蒲',m:'cattail / bulrush',on:'ホ',ku:'がま',lv:'N1',st:13,cat:'nature',rad:'艸',mn:'Grass + wide = cattail',ex:[{w:'蒲',r:'がま',e:'cattail'},{w:'蒲団',r:'ふとん',e:'futon'}]},
  {id:1799,k:'囲',m:'surround / encircle',on:'イ',ku:'かこ-',lv:'N1',st:7,cat:'action',rad:'囗',mn:'Box + well = surround',ex:[{w:'囲む',r:'かこむ',e:'to surround'},{w:'包囲',r:'ほうい',e:'encirclement'}]},
  {id:1800,k:'彼方',m:'beyond / over there',on:'ヒ',ku:'あちら',lv:'N1',st:0,cat:'place',rad:'',mn:'',ex:[{w:'彼方',r:'あちら',e:'over there'},{w:'彼方此方',r:'あちこち',e:'here and there'}]},
  {id:1801,k:'剥',m:'peel / strip',on:'ハク',ku:'む-・は-',lv:'N1',st:10,cat:'action',rad:'刀',mn:'Knife + peel = peel',ex:[{w:'剥く',r:'むく',e:'to peel'},{w:'剥奪',r:'はくだつ',e:'deprivation'}]},
  {id:1802,k:'挟',m:'hold between / sandwich',on:'キョウ',ku:'はさ-',lv:'N1',st:9,cat:'action',rad:'手',mn:'Hand + narrow = hold between',ex:[{w:'挟む',r:'はさむ',e:'to hold between'},{w:'板挟み',r:'いたばさみ',e:'dilemma'}]},
  {id:1803,k:'貼',m:'paste / affix',on:'チョウ',ku:'は-',lv:'N1',st:12,cat:'action',rad:'貝',mn:'Shell + divination = paste',ex:[{w:'貼る',r:'はる',e:'to paste'},{w:'貼付',r:'てんぷ',e:'attachment'}]},
  {id:1804,k:'跳',m:'jump',on:'チョウ',ku:'は-・と-',lv:'N1',st:13,cat:'action',rad:'足',mn:'Foot + sign = jump',ex:[{w:'跳ねる',r:'はねる',e:'to jump'},{w:'跳躍',r:'ちょうやく',e:'leap'}]},
  {id:1805,k:'剃',m:'shave',on:'テイ',ku:'そ-',lv:'N1',st:9,cat:'action',rad:'刀',mn:'Knife + younger = shave',ex:[{w:'剃る',r:'そる',e:'to shave'},{w:'剃刀',r:'かみそり',e:'razor'}]},
  {id:1806,k:'貌',m:'appearance / face',on:'ボウ',ku:'',lv:'N1',st:14,cat:'description',rad:'豸',mn:'Cat + white = appearance',ex:[{w:'容貌',r:'ようぼう',e:'appearance'},{w:'全貌',r:'ぜんぼう',e:'full picture'}]},
  {id:1807,k:'弄',m:'tamper',on:'ロウ',ku:'もてあそ-',lv:'N1',st:7,cat:'action',rad:'廾',mn:'Hands + king = tamper',ex:[{w:'弄ぶ',r:'もてあそぶ',e:'to play with'},{w:'翻弄',r:'ほんろう',e:'tossing about'}]},
  {id:1808,k:'矛',m:'spear / halberd',on:'ム',ku:'ほこ',lv:'N1',st:5,cat:'other',rad:'矛',mn:'Spear shape = spear',ex:[{w:'矛',r:'ほこ',e:'spear'},{w:'矛盾',r:'むじゅん',e:'contradiction'}]},
  {id:1809,k:'籍',m:'register / book',on:'セキ',ku:'',lv:'N1',st:20,cat:'other',rad:'竹',mn:'Bamboo + register = register',ex:[{w:'国籍',r:'こくせき',e:'nationality'},{w:'書籍',r:'しょせき',e:'books'}]},
  {id:1810,k:'葬',m:'bury / funeral',on:'ソウ',ku:'ほうむ-',lv:'N1',st:12,cat:'other',rad:'艸',mn:'Grass + death = funeral',ex:[{w:'葬る',r:'ほうむる',e:'to bury'},{w:'火葬',r:'かそう',e:'cremation'}]},
  {id:1811,k:'笹',m:'bamboo grass',on:'ショウ',ku:'ささ',lv:'N1',st:11,cat:'nature',rad:'竹',mn:'Bamboo + small = bamboo grass',ex:[{w:'笹',r:'ささ',e:'bamboo grass'},{w:'笹の葉',r:'ささのは',e:'bamboo leaf'}]},
  {id:1812,k:'綺',m:'beautiful / figured',on:'キ',ku:'あや',lv:'N1',st:14,cat:'art',rad:'糸',mn:'Thread + strange = figured',ex:[{w:'綺麗',r:'きれい',e:'beautiful / clean'},{w:'綺羅',r:'きら',e:'gorgeous attire'}]},
  {id:1813,k:'縋',m:'cling to / hang on',on:'スイ',ku:'すが-',lv:'N1',st:17,cat:'action',rad:'糸',mn:'Thread + hang = cling',ex:[{w:'縋る',r:'すがる',e:'to cling to'},{w:'縋り付く',r:'すがりつく',e:'to cling to'}]},
  {id:1814,k:'曝',m:'expose to sun',on:'バク',ku:'さら-',lv:'N1',st:19,cat:'action',rad:'日',mn:'Sun + violent = expose',ex:[{w:'曝す',r:'さらす',e:'to expose'},{w:'曝露',r:'ばくろ',e:'exposure'}]},
  {id:1815,k:'聘',m:'invite / engage',on:'ヘイ',ku:'',lv:'N1',st:13,cat:'action',rad:'耳',mn:'Ear + go = invite',ex:[{w:'招聘',r:'しょうへい',e:'invitation'},{w:'聘用',r:'へいよう',e:'employment'}]},
  {id:1816,k:'憬',m:'yearn / admire',on:'ケイ',ku:'あこが-',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + bright = yearn',ex:[{w:'憧憬',r:'しょうけい',e:'longing'},{w:'憬れ',r:'あこがれ',e:'yearning'}]},
  {id:1817,k:'褒',m:'praise / admire',on:'ホウ',ku:'ほ-',lv:'N1',st:15,cat:'action',rad:'衣',mn:'Clothes + joy = praise',ex:[{w:'褒める',r:'ほめる',e:'to praise'},{w:'褒賞',r:'ほうしょう',e:'commendation'}]},
  {id:1818,k:'揶',m:'mock / tease',on:'ヤ',ku:'からか-',lv:'N1',st:12,cat:'action',rad:'手',mn:'Hand + sound = tease',ex:[{w:'揶揄',r:'やゆ',e:'ridicule'},{w:'揶揄う',r:'からかう',e:'to tease'}]},
  {id:1819,k:'臥',m:'lie down',on:'ガ',ku:'ふ-',lv:'N1',st:8,cat:'action',rad:'臣',mn:'Retainer + person = lie down',ex:[{w:'臥せる',r:'ふせる',e:'to lie down'},{w:'病臥',r:'びょうが',e:'lying ill'}]},
  {id:1820,k:'佇',m:'stand / loiter',on:'チョ',ku:'たたず-',lv:'N1',st:7,cat:'action',rad:'人',mn:'Person + upright = stand',ex:[{w:'佇む',r:'たたずむ',e:'to stand'},{w:'佇立',r:'ちょりつ',e:'standing still'}]},
  {id:1821,k:'伽',m:'accompany / story',on:'カ',ku:'とぎ',lv:'N1',st:7,cat:'other',rad:'人',mn:'Person + add = accompany',ex:[{w:'伽',r:'とぎ',e:'companionship'},{w:'お伽話',r:'おとぎばなし',e:'fairy tale'}]},
  {id:1822,k:'吃',m:'stutter / eat',on:'キツ',ku:'ども-',lv:'N1',st:6,cat:'action',rad:'口',mn:'Mouth + spoon = stutter',ex:[{w:'吃音',r:'きつおん',e:'stuttering'},{w:'吃驚',r:'びっくり',e:'surprised'}]},
  {id:1823,k:'叱',m:'scold',on:'シツ',ku:'しか-',lv:'N1',st:5,cat:'action',rad:'口',mn:'Mouth + spoon = scold',ex:[{w:'叱る',r:'しかる',e:'to scold'},{w:'叱責',r:'しっせき',e:'scolding'}]},
  {id:1824,k:'呆',m:'dumbfounded / stupid',on:'ボウ',ku:'あき-・ほう-',lv:'N1',st:7,cat:'description',rad:'口',mn:'Mouth + tree = dumbfounded',ex:[{w:'呆れる',r:'あきれる',e:'to be dumbfounded'},{w:'痴呆',r:'ちほう',e:'dementia'}]},
  {id:1825,k:'囃',m:'hayashi music / jeer',on:'ソウ',ku:'はやし',lv:'N1',st:23,cat:'art',rad:'口',mn:'Mouth + music = hayashi',ex:[{w:'囃子',r:'はやし',e:'hayashi music'},{w:'囃す',r:'はやす',e:'to jeer'}]},
  {id:1826,k:'噛',m:'bite / chew',on:'ゴウ',ku:'か-',lv:'N1',st:16,cat:'action',rad:'口',mn:'Mouth + high = bite',ex:[{w:'噛む',r:'かむ',e:'to bite'},{w:'噛み砕く',r:'かみくだく',e:'to chew up'}]},
  {id:1827,k:'囁',m:'whisper',on:'ショウ',ku:'ささや-',lv:'N1',st:21,cat:'action',rad:'口',mn:'Three mouths = whisper',ex:[{w:'囁く',r:'ささやく',e:'to whisper'},{w:'囁き',r:'ささやき',e:'whisper'}]},
  {id:1828,k:'喚',m:'shout / call',on:'カン',ku:'わめ-',lv:'N1',st:12,cat:'action',rad:'口',mn:'Mouth + exchange = shout',ex:[{w:'喚く',r:'わめく',e:'to shout'},{w:'喚起',r:'かんき',e:'arousal'}]},
  {id:1829,k:'嫉',m:'jealous',on:'シツ',ku:'ねた-',lv:'N1',st:13,cat:'feeling',rad:'女',mn:'Woman + illness = jealous',ex:[{w:'嫉妬',r:'しっと',e:'jealousy'},{w:'嫉む',r:'ねたむ',e:'to be jealous'}]},
  {id:1830,k:'娼',m:'prostitute',on:'ショウ',ku:'',lv:'N1',st:11,cat:'person',rad:'女',mn:'Woman + flourish = prostitute',ex:[{w:'娼婦',r:'しょうふ',e:'prostitute'},{w:'売春婦',r:'ばいしゅんふ',e:'prostitute'}]},
  {id:1831,k:'孕',m:'pregnant',on:'ヨウ',ku:'はら-',lv:'N1',st:5,cat:'health',rad:'子',mn:'Child + wrap = pregnant',ex:[{w:'孕む',r:'はらむ',e:'to become pregnant'},{w:'孕み',r:'はらみ',e:'pregnancy'}]},
  {id:1832,k:'聾',m:'deaf',on:'ロウ',ku:'つんぼ',lv:'N1',st:22,cat:'health',rad:'耳',mn:'Dragon + ear = deaf',ex:[{w:'聾',r:'ろう',e:'deaf'},{w:'聾唖',r:'ろうあ',e:'deaf-mute'}]},
  {id:1833,k:'濾',m:'filter',on:'ロ',ku:'こ-',lv:'N1',st:18,cat:'action',rad:'水',mn:'Water + tiger = filter',ex:[{w:'濾過',r:'ろか',e:'filtration'},{w:'濾紙',r:'ろし',e:'filter paper'}]},
  {id:1834,k:'攪',m:'stir / disturb',on:'カク',ku:'かき-',lv:'N1',st:23,cat:'action',rad:'手',mn:'Hand + confirm = stir',ex:[{w:'攪拌',r:'かくはん',e:'stirring'},{w:'攪乱',r:'かくらん',e:'disturbance'}]},
  {id:1835,k:'拉',m:'drag / pull',on:'ラ',ku:'ら-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + stand = drag',ex:[{w:'拉致',r:'らち',e:'abduction'},{w:'拉する',r:'らっする',e:'to drag away'}]},
  {id:1836,k:'嗤',m:'sneer / mock',on:'シ',ku:'わら-',lv:'N1',st:14,cat:'action',rad:'口',mn:'Mouth + know = sneer',ex:[{w:'嗤う',r:'わらう',e:'to sneer'},{w:'嗤笑',r:'しょう',e:'sneer'}]},
  {id:1837,k:'炙',m:'roast / sear',on:'シャ',ku:'あぶ-',lv:'N1',st:8,cat:'food',rad:'火',mn:'Fire + meat = roast',ex:[{w:'炙る',r:'あぶる',e:'to roast'},{w:'炙り',r:'あぶり',e:'grilling'}]},
  {id:1838,k:'煎',m:'roast / decoct',on:'セン',ku:'い-',lv:'N1',st:13,cat:'food',rad:'火',mn:'Fire + before = roast',ex:[{w:'煎る',r:'いる',e:'to roast'},{w:'煎じる',r:'せんじる',e:'to decoct'}]},
  {id:1839,k:'牟',m:'cry of cattle',on:'ム・ボウ',ku:'',lv:'N1',st:6,cat:'nature',rad:'牛',mn:'Cow + cover = moo',ex:[{w:'牟田',r:'むた',e:'Muta (surname)'},{w:'牟婁',r:'むろ',e:'Muro (place)'}]},
  {id:1840,k:'轍',m:'wheel rut / path',on:'テツ',ku:'わだち',lv:'N1',st:19,cat:'other',rad:'車',mn:'Cart + path = rut',ex:[{w:'轍',r:'わだち',e:'wheel rut'},{w:'同じ轍',r:'おなじてつ',e:'same mistake'}]},
  {id:1841,k:'辻',m:'crossroads / street corner',on:'ジュウ',ku:'つじ',lv:'N1',st:7,cat:'place',rad:'辵',mn:'Walk + cross = crossroads',ex:[{w:'辻',r:'つじ',e:'crossroads'},{w:'辻褄',r:'つじつま',e:'consistency'}]},
  {id:1842,k:'逞',m:'bold / sturdy',on:'テイ',ku:'たくま-',lv:'N1',st:10,cat:'description',rad:'辵',mn:'Walk + king = bold',ex:[{w:'逞しい',r:'たくましい',e:'bold / sturdy'},{w:'逞しさ',r:'たくましさ',e:'sturdiness'}]},
  {id:1843,k:'遁',m:'escape / flee',on:'トン',ku:'のが-',lv:'N1',st:12,cat:'action',rad:'辵',mn:'Walk + order = escape',ex:[{w:'遁走',r:'とんそう',e:'flight'},{w:'逃遁',r:'とうとん',e:'escape'}]},
  {id:1844,k:'遜',m:'humble / inferior',on:'ソン',ku:'へりくだ-',lv:'N1',st:13,cat:'description',rad:'辵',mn:'Walk + grandchild = humble',ex:[{w:'遜る',r:'へりくだる',e:'to be humble'},{w:'謙遜',r:'けんそん',e:'humility'}]},
  {id:1845,k:'邂',m:'unexpected meeting',on:'カイ',ku:'',lv:'N1',st:14,cat:'action',rad:'辵',mn:'Walk + separate = chance meeting',ex:[{w:'邂逅',r:'かいこう',e:'chance meeting'},{w:'邂逅する',r:'かいこうする',e:'to meet by chance'}]},
  {id:1846,k:'陶',m:'pottery / delight',on:'トウ',ku:'',lv:'N1',st:11,cat:'art',rad:'阜',mn:'Mound + wrap = pottery',ex:[{w:'陶器',r:'とうき',e:'pottery'},{w:'陶酔',r:'とうすい',e:'intoxication'}]},
  {id:1847,k:'隼',m:'falcon',on:'シュン',ku:'はやぶさ',lv:'N1',st:10,cat:'nature',rad:'隹',mn:'Bird + ten = falcon',ex:[{w:'隼',r:'はやぶさ',e:'falcon'},{w:'隼人',r:'はやと',e:'Hayato (name)'}]},
  {id:1848,k:'熊',m:'bear',on:'ユウ',ku:'くま',lv:'N1',st:14,cat:'nature',rad:'火',mn:'Fire + bear = bear',ex:[{w:'熊',r:'くま',e:'bear'},{w:'白熊',r:'しろくま',e:'polar bear'}]},
  {id:1849,k:'鷹',m:'hawk / falcon',on:'オウ',ku:'たか',lv:'N1',st:24,cat:'nature',rad:'鳥',mn:'Bird + hawk = hawk',ex:[{w:'鷹',r:'たか',e:'hawk'},{w:'鷹揚',r:'おうよう',e:'generous / magnanimous'}]},
  {id:1850,k:'鯉',m:'carp',on:'リ',ku:'こい',lv:'N1',st:18,cat:'nature',rad:'魚',mn:'Fish + reason = carp',ex:[{w:'鯉',r:'こい',e:'carp'},{w:'鯉のぼり',r:'こいのぼり',e:'carp streamer'}]},
  {id:1851,k:'亀',m:'turtle',on:'キ',ku:'かめ',lv:'N1',st:11,cat:'nature',rad:'亀',mn:'Turtle shape = turtle',ex:[{w:'亀',r:'かめ',e:'turtle'},{w:'亀の甲',r:'かめのこう',e:'tortoise shell'}]},
  {id:1852,k:'蝶',m:'butterfly',on:'チョウ',ku:'ちょう',lv:'N1',st:15,cat:'nature',rad:'虫',mn:'Insect + leaf = butterfly',ex:[{w:'蝶',r:'ちょう',e:'butterfly'},{w:'蝶々',r:'ちょうちょ',e:'butterfly'}]},
  {id:1853,k:'蛍',m:'firefly',on:'ケイ',ku:'ほたる',lv:'N1',st:11,cat:'nature',rad:'虫',mn:'Insect + fire = firefly',ex:[{w:'蛍',r:'ほたる',e:'firefly'},{w:'蛍光灯',r:'けいこうとう',e:'fluorescent lamp'}]},
  {id:1854,k:'蟻',m:'ant',on:'ギ',ku:'あり',lv:'N1',st:19,cat:'nature',rad:'虫',mn:'Insect + just = ant',ex:[{w:'蟻',r:'あり',e:'ant'},{w:'蟻地獄',r:'ありじごく',e:'antlion'}]},
  {id:1855,k:'蝿',m:'fly (insect)',on:'ヨウ',ku:'はえ',lv:'N1',st:14,cat:'nature',rad:'虫',mn:'Insect + stretch = fly',ex:[{w:'蝿',r:'はえ',e:'fly'},{w:'蝿取り',r:'はえとり',e:'fly trap'}]},
  {id:1856,k:'蚕',m:'silkworm',on:'サン',ku:'かいこ',lv:'N1',st:10,cat:'nature',rad:'虫',mn:'Heavenly insect = silkworm',ex:[{w:'蚕',r:'かいこ',e:'silkworm'},{w:'養蚕',r:'ようさん',e:'sericulture'}]},
  {id:1857,k:'蜂',m:'bee / wasp',on:'ホウ',ku:'はち',lv:'N1',st:13,cat:'nature',rad:'虫',mn:'Insect + seal = bee',ex:[{w:'蜂',r:'はち',e:'bee'},{w:'蜂蜜',r:'はちみつ',e:'honey'}]},
  {id:1858,k:'蜘',m:'spider',on:'チ',ku:'くも',lv:'N1',st:14,cat:'nature',rad:'虫',mn:'Insect + know = spider',ex:[{w:'蜘蛛',r:'くも',e:'spider'},{w:'蜘蛛の巣',r:'くものす',e:'spiderweb'}]},
  {id:1859,k:'蠅',m:'fly',on:'ヨウ',ku:'はえ',lv:'N1',st:20,cat:'nature',rad:'虫',mn:'Insect + flying = fly',ex:[{w:'蠅',r:'はえ',e:'fly (insect)'},{w:'蠅叩き',r:'はえたたき',e:'flyswatter'}]},
  {id:1860,k:'栗',m:'chestnut',on:'リツ',ku:'くり',lv:'N1',st:10,cat:'food',rad:'木',mn:'Wood + west = chestnut',ex:[{w:'栗',r:'くり',e:'chestnut'},{w:'栗色',r:'くりいろ',e:'chestnut brown'}]},
  {id:1861,k:'梨',m:'pear',on:'リ',ku:'なし',lv:'N1',st:11,cat:'food',rad:'木',mn:'Wood + benefit = pear',ex:[{w:'梨',r:'なし',e:'pear'},{w:'梨地',r:'なしじ',e:'pear skin finish'}]},
  {id:1862,k:'桃',m:'peach',on:'トウ',ku:'もも',lv:'N1',st:10,cat:'food',rad:'木',mn:'Wood + escape = peach',ex:[{w:'桃',r:'もも',e:'peach'},{w:'桃色',r:'ももいろ',e:'pink'}]},
  {id:1863,k:'苺',m:'strawberry',on:'マイ',ku:'いちご',lv:'N1',st:8,cat:'food',rad:'艸',mn:'Grass + each = strawberry',ex:[{w:'苺',r:'いちご',e:'strawberry'},{w:'苺狩り',r:'いちごがり',e:'strawberry picking'}]},
  {id:1864,k:'葡',m:'grape vine',on:'ブ',ku:'',lv:'N1',st:12,cat:'food',rad:'艸',mn:'Grass + wide = grape vine',ex:[{w:'葡萄',r:'ぶどう',e:'grape'},{w:'葡萄酒',r:'ぶどうしゅ',e:'wine'}]},
  {id:1865,k:'萄',m:'grape',on:'ドウ',ku:'',lv:'N1',st:11,cat:'food',rad:'艸',mn:'Grass + lead = grape',ex:[{w:'葡萄',r:'ぶどう',e:'grape'},{w:'葡萄園',r:'ぶどうえん',e:'vineyard'}]},
  {id:1866,k:'芋',m:'potato / taro',on:'ウ',ku:'いも',lv:'N1',st:6,cat:'food',rad:'艸',mn:'Grass + brother = potato',ex:[{w:'芋',r:'いも',e:'potato'},{w:'里芋',r:'さといも',e:'taro'}]},
  {id:1867,k:'蓮',m:'lotus',on:'レン',ku:'はす',lv:'N1',st:13,cat:'nature',rad:'艸',mn:'Grass + connect = lotus',ex:[{w:'蓮',r:'はす',e:'lotus'},{w:'蓮根',r:'れんこん',e:'lotus root'}]},
  {id:1868,k:'菖',m:'iris / calamus',on:'ショウ',ku:'',lv:'N1',st:11,cat:'nature',rad:'艸',mn:'Grass + rise = iris',ex:[{w:'菖蒲',r:'しょうぶ',e:'iris'},{w:'花菖蒲',r:'はなしょうぶ',e:'Japanese iris'}]},
  {id:1869,k:'椿',m:'camellia',on:'チン',ku:'つばき',lv:'N1',st:13,cat:'nature',rad:'木',mn:'Wood + spring = camellia',ex:[{w:'椿',r:'つばき',e:'camellia'},{w:'椿事',r:'ちんじ',e:'unexpected event'}]},
  {id:1870,k:'薔',m:'rose',on:'ショウ',ku:'ばら',lv:'N1',st:16,cat:'nature',rad:'艸',mn:'Grass + rose = rose',ex:[{w:'薔薇',r:'ばら',e:'rose'},{w:'野薔薇',r:'のばら',e:'wild rose'}]},
  {id:1871,k:'刹',m:'temple / instant',on:'セツ・サツ',ku:'',lv:'N1',st:8,cat:'place',rad:'刀',mn:'Knife + wood = temple',ex:[{w:'刹那',r:'せつな',e:'moment / instant'},{w:'古刹',r:'こさつ',e:'old temple'}]},
  {id:1872,k:'宵',m:'evening',on:'ショウ',ku:'よい',lv:'N1',st:10,cat:'other',rad:'宀',mn:'Roof + small = evening',ex:[{w:'宵',r:'よい',e:'evening'},{w:'宵越し',r:'よいごし',e:'overnight'}]},
  {id:1873,k:'霞',m:'haze / mist',on:'カ',ku:'かすみ',lv:'N1',st:17,cat:'nature',rad:'雨',mn:'Rain + cover = haze',ex:[{w:'霞',r:'かすみ',e:'haze'},{w:'春霞',r:'はるがすみ',e:'spring haze'}]},
  {id:1874,k:'靄',m:'mist / haze',on:'アイ',ku:'もや',lv:'N1',st:24,cat:'nature',rad:'雨',mn:'Rain + dark = mist',ex:[{w:'靄',r:'もや',e:'mist'},{w:'朝靄',r:'あさもや',e:'morning mist'}]},
  {id:1875,k:'霙',m:'sleet / snow',on:'エイ',ku:'みぞれ',lv:'N1',st:20,cat:'nature',rad:'雨',mn:'Rain + baby = sleet',ex:[{w:'霙',r:'みぞれ',e:'sleet'},{w:'霙が降る',r:'みぞれがふる',e:'sleet falls'}]},
  {id:1876,k:'霜',m:'frost',on:'ソウ',ku:'しも',lv:'N1',st:17,cat:'nature',rad:'雨',mn:'Rain + similar = frost',ex:[{w:'霜',r:'しも',e:'frost'},{w:'初霜',r:'はつしも',e:'first frost'}]},
  {id:1877,k:'霰',m:'hail / arare',on:'サン',ku:'あられ',lv:'N1',st:20,cat:'nature',rad:'雨',mn:'Rain + scatter = hail',ex:[{w:'霰',r:'あられ',e:'hail'},{w:'霰餅',r:'あられもち',e:'arare rice crackers'}]},
  {id:1878,k:'朝',m:'morning / dynasty',on:'チョウ',ku:'あさ',lv:'N1',st:12,cat:'time',rad:'月',mn:'Moon + direction = morning',ex:[{w:'朝',r:'あさ',e:'morning'},{w:'朝日',r:'あさひ',e:'morning sun'}]},
  {id:1879,k:'暮',m:'dusk / spend time',on:'ボ',ku:'く-',lv:'N1',st:14,cat:'time',rad:'日',mn:'Sun + grass = dusk',ex:[{w:'暮れ',r:'くれ',e:'dusk'},{w:'暮らす',r:'くらす',e:'to live / spend time'}]},
  {id:1880,k:'黎',m:'dark / black',on:'レイ',ku:'',lv:'N1',st:15,cat:'description',rad:'黍',mn:'Millet + people = dark',ex:[{w:'黎明',r:'れいめい',e:'dawn'},{w:'黎民',r:'れいみん',e:'common people'}]},
  {id:1881,k:'漣',m:'ripple',on:'レン',ku:'さざなみ',lv:'N1',st:14,cat:'nature',rad:'水',mn:'Water + connect = ripple',ex:[{w:'漣',r:'さざなみ',e:'ripple'},{w:'漣々',r:'れんれん',e:'rippling'}]},
  {id:1882,k:'澪',m:'channel / wake',on:'レイ',ku:'みお',lv:'N1',st:16,cat:'place',rad:'水',mn:'Water + zero = channel',ex:[{w:'澪',r:'みお',e:'water channel'},{w:'澪標',r:'みおつくし',e:'channel marker'}]},
  {id:1883,k:'鱗',m:'scale (fish)',on:'リン',ku:'うろこ',lv:'N1',st:23,cat:'nature',rad:'魚',mn:'Fish + scales = scale',ex:[{w:'鱗',r:'うろこ',e:'scale'},{w:'鱗雲',r:'うろこぐも',e:'altocumulus cloud'}]},
  {id:1884,k:'闊',m:'wide / bold',on:'カツ',ku:'',lv:'N1',st:17,cat:'description',rad:'門',mn:'Gate + active = wide',ex:[{w:'闊歩',r:'かっぽ',e:'striding'},{w:'豪闊',r:'ごうかつ',e:'bold'}]},
  {id:1885,k:'蓬',m:'mugwort / unkempt',on:'ホウ',ku:'よもぎ',lv:'N1',st:13,cat:'nature',rad:'艸',mn:'Grass + reach = mugwort',ex:[{w:'蓬',r:'よもぎ',e:'mugwort'},{w:'蓬莱',r:'ほうらい',e:'fairyland'}]},
  {id:1886,k:'醍',m:'cream / top',on:'ダイ',ku:'',lv:'N1',st:16,cat:'food',rad:'酉',mn:'Wine + topic = cream',ex:[{w:'醍醐',r:'だいご',e:'finest taste'},{w:'醍醐味',r:'だいごみ',e:'true delight'}]},
  {id:1887,k:'醐',m:'cream',on:'ゴ',ku:'',lv:'N1',st:19,cat:'food',rad:'酉',mn:'Wine + lake = cream',ex:[{w:'醍醐',r:'だいご',e:'finest taste'},{w:'醍醐味',r:'だいごみ',e:'true pleasure'}]},
  {id:1888,k:'頗',m:'very / inclined',on:'ハ',ku:'すこぶ-',lv:'N1',st:14,cat:'description',rad:'頁',mn:'Page + skin = very',ex:[{w:'頗る',r:'すこぶる',e:'very / considerably'},{w:'頗る評判',r:'すこぶるひょうばん',e:'highly acclaimed'}]},
  {id:1889,k:'惺',m:'wise / clear-headed',on:'セイ',ku:'さと-',lv:'N1',st:12,cat:'description',rad:'心',mn:'Heart + star = wise',ex:[{w:'惺惺',r:'せいせい',e:'intelligent'},{w:'惺かす',r:'さとかす',e:'to enlighten'}]},
  {id:1890,k:'嫋',m:'slender / graceful',on:'ジョウ',ku:'たお-',lv:'N1',st:14,cat:'description',rad:'女',mn:'Woman + wrap = graceful',ex:[{w:'嫋やか',r:'たおやか',e:'graceful'},{w:'嫋々',r:'じょうじょう',e:'graceful'}]},
  {id:1891,k:'孜',m:'diligent',on:'シ',ku:'',lv:'N1',st:7,cat:'description',rad:'子',mn:'Child + strike = diligent',ex:[{w:'孜々',r:'しし',e:'diligently'},{w:'孜孜',r:'しし',e:'working hard'}]},
  {id:1892,k:'杞',m:'willow / anxiety',on:'キ',ku:'',lv:'N1',st:7,cat:'nature',rad:'木',mn:'Wood + self = willow',ex:[{w:'杞憂',r:'きゆう',e:'groundless worry'},{w:'杞柳',r:'きりゅう',e:'willow'}]},
  {id:1893,k:'忸',m:'shame / accustomed',on:'ジク',ku:'',lv:'N1',st:8,cat:'feeling',rad:'心',mn:'Heart + livestock = shame',ex:[{w:'忸怩',r:'じくじ',e:'feeling ashamed'},{w:'忸怩たる',r:'じくじたる',e:'feeling remorse'}]},
  {id:1894,k:'怩',m:'shame',on:'ジ',ku:'',lv:'N1',st:9,cat:'feeling',rad:'心',mn:'Heart + you = shame',ex:[{w:'忸怩',r:'じくじ',e:'feeling ashamed'},{w:'怩として',r:'じとして',e:'with shame'}]},
  {id:1895,k:'蹂',m:'trample',on:'ジュウ',ku:'',lv:'N1',st:16,cat:'action',rad:'足',mn:'Foot + soft = trample',ex:[{w:'蹂躙',r:'じゅうりん',e:'trampling'},{w:'蹂践',r:'じゅうせん',e:'trampling underfoot'}]},
  {id:1896,k:'躙',m:'trample / push through',on:'リン',ku:'',lv:'N1',st:22,cat:'action',rad:'足',mn:'Foot + press = trample',ex:[{w:'蹂躙',r:'じゅうりん',e:'trampling'},{w:'躙る',r:'にじる',e:'to shuffle forward'}]},
  {id:1897,k:'諜',m:'spy / intelligence',on:'チョウ',ku:'',lv:'N1',st:16,cat:'other',rad:'言',mn:'Words + fold = spy',ex:[{w:'諜報',r:'ちょうほう',e:'intelligence'},{w:'間諜',r:'かんちょう',e:'spy'}]},
  {id:1898,k:'叢',m:'thicket / gathered',on:'ソウ',ku:'くさむら',lv:'N1',st:18,cat:'nature',rad:'艸',mn:'Grass + gather = thicket',ex:[{w:'叢',r:'くさむら',e:'thicket'},{w:'叢書',r:'そうしょ',e:'series of books'}]},
  {id:1899,k:'聚',m:'gather / collect',on:'シュ',ku:'あつ-',lv:'N1',st:14,cat:'action',rad:'耳',mn:'Ear + take = gather',ex:[{w:'聚落',r:'しゅうらく',e:'settlement'},{w:'聚める',r:'あつめる',e:'to gather'}]},
  {id:1900,k:'毬',m:'ball',on:'キュウ',ku:'まり',lv:'N1',st:11,cat:'other',rad:'毛',mn:'Hair + ball = ball',ex:[{w:'毬',r:'まり',e:'ball'},{w:'毬栗',r:'いがぐり',e:'burr chestnut'}]},
  {id:1901,k:'彗',m:'comet',on:'スイ',ku:'ほうき',lv:'N1',st:11,cat:'nature',rad:'彡',mn:'Hair + broom = comet',ex:[{w:'彗星',r:'すいせい',e:'comet'},{w:'彗',r:'ほうき',e:'broom'}]},
  {id:1902,k:'禅',m:'zen / meditation',on:'ゼン',ku:'',lv:'N1',st:16,cat:'action',rad:'示',mn:'Altar + single = zen',ex:[{w:'禅',r:'ぜん',e:'zen'},{w:'禅寺',r:'ぜんでら',e:'zen temple'}]},
  {id:1903,k:'詣',m:'visit shrine',on:'ケイ',ku:'もう-',lv:'N1',st:13,cat:'action',rad:'言',mn:'Words + reach = visit',ex:[{w:'参詣',r:'さんけい',e:'shrine visit'},{w:'詣でる',r:'もうでる',e:'to visit'}]},
  {id:1904,k:'憚',m:'fear / hesitate',on:'タン',ku:'はばか-',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + difficult = hesitate',ex:[{w:'憚る',r:'はばかる',e:'to hesitate'},{w:'遠慮憚る',r:'えんりょはばかる',e:'to be reserved'}]},
  {id:1905,k:'臍',m:'navel / belly button',on:'セイ',ku:'へそ',lv:'N1',st:18,cat:'body',rad:'月',mn:'Body + uniform = navel',ex:[{w:'臍',r:'へそ',e:'navel'},{w:'臍の緒',r:'へそのお',e:'umbilical cord'}]},
  {id:1906,k:'踵',m:'heel',on:'ショウ',ku:'かかと',lv:'N1',st:16,cat:'body',rad:'足',mn:'Foot + heavy = heel',ex:[{w:'踵',r:'かかと',e:'heel'},{w:'踵を返す',r:'かかとをかえす',e:'to turn on one\'s heel'}]},
  {id:1907,k:'踝',m:'ankle',on:'カ',ku:'くるぶし',lv:'N1',st:15,cat:'body',rad:'足',mn:'Foot + fruit = ankle',ex:[{w:'踝',r:'くるぶし',e:'ankle'},{w:'内踝',r:'うちくるぶし',e:'inner ankle'}]},
  {id:1908,k:'鬢',m:'temple hair',on:'ビン',ku:'',lv:'N1',st:23,cat:'body',rad:'髟',mn:'Hair + frequency = temple hair',ex:[{w:'鬢',r:'びん',e:'temple hair'},{w:'鬢付け油',r:'びんつけあぶら',e:'pomade'}]},
  {id:1909,k:'髭',m:'beard / moustache',on:'シ',ku:'ひげ',lv:'N1',st:17,cat:'body',rad:'髟',mn:'Hair + beard = beard',ex:[{w:'髭',r:'ひげ',e:'beard'},{w:'顎髭',r:'あごひげ',e:'chin beard'}]},
  {id:1910,k:'碗',m:'bowl',on:'ワン',ku:'',lv:'N1',st:13,cat:'other',rad:'石',mn:'Stone + perfection = bowl',ex:[{w:'茶碗',r:'ちゃわん',e:'teacup / rice bowl'},{w:'丼碗',r:'どんぶりわん',e:'donburi bowl'}]},
  {id:1911,k:'蓋',m:'lid',on:'ガイ',ku:'ふた',lv:'N1',st:13,cat:'other',rad:'艸',mn:'Grass + together = lid',ex:[{w:'蓋をする',r:'ふたをする',e:'to put a lid on'},{w:'お蓋',r:'おふた',e:'lid (polite)'}]},
  {id:1912,k:'爪',m:'nail / claw',on:'ソウ',ku:'つめ',lv:'N1',st:4,cat:'body',rad:'爪',mn:'Claw shape = claw',ex:[{w:'爪',r:'つめ',e:'nail'},{w:'爪楊枝',r:'つまようじ',e:'toothpick'}]},
  {id:1913,k:'瞳',m:'pupil / eye',on:'ドウ',ku:'ひとみ',lv:'N1',st:17,cat:'body',rad:'目',mn:'Eye + child = pupil',ex:[{w:'瞳',r:'ひとみ',e:'pupil of eye'},{w:'瞳孔',r:'どうこう',e:'pupil'}]},
  {id:1914,k:'睫',m:'eyelash',on:'セツ',ku:'まつげ',lv:'N1',st:13,cat:'body',rad:'目',mn:'Eye + intercept = eyelash',ex:[{w:'睫',r:'まつげ',e:'eyelash'},{w:'逆睫',r:'さかまつげ',e:'ingrown eyelash'}]},
  {id:1915,k:'顎',m:'jaw / chin',on:'ガク',ku:'あご',lv:'N1',st:18,cat:'body',rad:'頁',mn:'Page + jaw = jaw',ex:[{w:'顎',r:'あご',e:'jaw / chin'},{w:'顎関節',r:'がくかんせつ',e:'jaw joint'}]},
  {id:1916,k:'腋',m:'armpit',on:'エキ',ku:'わき',lv:'N1',st:12,cat:'body',rad:'月',mn:'Body + also = armpit',ex:[{w:'腋',r:'わき',e:'armpit'},{w:'腋臭',r:'えきしゅう',e:'body odor'}]},
  {id:1917,k:'鼠',m:'rat / mouse',on:'ソ',ku:'ねずみ',lv:'N1',st:13,cat:'nature',rad:'鼠',mn:'Rat shape = rat',ex:[{w:'鼠',r:'ねずみ',e:'mouse / rat'},{w:'鼠色',r:'ねずみいろ',e:'gray'}]},
  {id:1918,k:'狸',m:'raccoon dog / tanuki',on:'リ',ku:'たぬき',lv:'N1',st:10,cat:'nature',rad:'犬',mn:'Dog + fox = raccoon dog',ex:[{w:'狸',r:'たぬき',e:'raccoon dog'},{w:'狸寝入り',r:'たぬきねいり',e:'feigning sleep'}]},
  {id:1919,k:'狐',m:'fox',on:'コ',ku:'きつね',lv:'N1',st:9,cat:'nature',rad:'犬',mn:'Dog + melon = fox',ex:[{w:'狐',r:'きつね',e:'fox'},{w:'狐火',r:'きつねび',e:'foxfire'}]},
  {id:1920,k:'獺',m:'otter',on:'ダツ',ku:'かわうそ',lv:'N1',st:19,cat:'nature',rad:'犬',mn:'Dog + dry = otter',ex:[{w:'獺',r:'かわうそ',e:'otter'},{w:'海獺',r:'らっこ',e:'sea otter'}]},
  {id:1921,k:'貂',m:'sable / marten',on:'テン',ku:'てん',lv:'N1',st:11,cat:'nature',rad:'豸',mn:'Cat + morning = marten',ex:[{w:'貂',r:'てん',e:'marten'},{w:'貂の毛皮',r:'てんのけがわ',e:'marten fur'}]},
  {id:1922,k:'麝',m:'musk deer',on:'ジャ',ku:'',lv:'N1',st:21,cat:'nature',rad:'鹿',mn:'Deer + shoot = musk deer',ex:[{w:'麝香',r:'じゃこう',e:'musk'},{w:'麝香鹿',r:'じゃこうじか',e:'musk deer'}]},
  {id:1923,k:'驢',m:'donkey',on:'ロ',ku:'ろば',lv:'N1',st:26,cat:'nature',rad:'馬',mn:'Horse + virtuous = donkey',ex:[{w:'驢馬',r:'ろば',e:'donkey'},{w:'驢鳴',r:'ろめい',e:'donkey\'s bray'}]},
  {id:1924,k:'碌',m:'proper / worthless',on:'ロク',ku:'',lv:'N1',st:13,cat:'description',rad:'石',mn:'Stone + green = proper',ex:[{w:'碌な',r:'ろくな',e:'decent'},{w:'碌でなし',r:'ろくでなし',e:'good-for-nothing'}]},
  {id:1925,k:'睦',m:'friendly / harmonious',on:'ボク',ku:'むつ-',lv:'N1',st:13,cat:'feeling',rad:'目',mn:'Eye + cattle = friendly',ex:[{w:'睦まじい',r:'むつまじい',e:'harmonious'},{w:'親睦',r:'しんぼく',e:'friendship'}]},
  {id:1926,k:'諧',m:'harmonious / humorous',on:'カイ',ku:'',lv:'N1',st:16,cat:'description',rad:'言',mn:'Words + all = harmonious',ex:[{w:'諧謔',r:'かいぎゃく',e:'humor'},{w:'諧調',r:'かいちょう',e:'harmony'}]},
  {id:1927,k:'誹',m:'slander / defame',on:'ヒ',ku:'そし-',lv:'N1',st:15,cat:'action',rad:'言',mn:'Words + non = slander',ex:[{w:'誹る',r:'そしる',e:'to slander'},{w:'誹謗',r:'ひぼう',e:'slander'}]},
  {id:1928,k:'謗',m:'slander',on:'ボウ',ku:'そし-',lv:'N1',st:17,cat:'action',rad:'言',mn:'Words + direction = slander',ex:[{w:'謗る',r:'そしる',e:'to slander'},{w:'誹謗中傷',r:'ひぼうちゅうしょう',e:'slander and libel'}]},
  {id:1929,k:'讒',m:'slander / false charge',on:'ザン',ku:'',lv:'N1',st:24,cat:'action',rad:'言',mn:'Words + false = slander',ex:[{w:'讒言',r:'ざんげん',e:'slander'},{w:'讒謗',r:'ざんぼう',e:'defamation'}]},
  {id:1930,k:'諫',m:'remonstrate / admonish',on:'カン',ku:'いさ-',lv:'N1',st:16,cat:'action',rad:'言',mn:'Words + branch = admonish',ex:[{w:'諫める',r:'いさめる',e:'to admonish'},{w:'諫言',r:'かんげん',e:'remonstrance'}]},
  {id:1931,k:'藹',m:'peaceful / lush',on:'アイ',ku:'',lv:'N1',st:20,cat:'description',rad:'艸',mn:'Grass + peaceful = lush',ex:[{w:'和気藹々',r:'わきあいあい',e:'harmonious'},{w:'藹然',r:'あいぜん',e:'friendly'}]},
  {id:1932,k:'欝',m:'depression / dense',on:'ウツ',ku:'',lv:'N1',st:29,cat:'feeling',rad:'木',mn:'Many trees = dense',ex:[{w:'鬱',r:'うつ',e:'depression'},{w:'憂鬱',r:'ゆううつ',e:'melancholy'}]},
  {id:1933,k:'鬱',m:'depression',on:'ウツ',ku:'',lv:'N1',st:29,cat:'feeling',rad:'鬯',mn:'Ritual wine + dense = depression',ex:[{w:'鬱',r:'うつ',e:'depression'},{w:'鬱病',r:'うつびょう',e:'depressive illness'}]},
  {id:1934,k:'焰',m:'flame',on:'エン',ku:'ほのお',lv:'N1',st:12,cat:'nature',rad:'火',mn:'Fire + replace = flame',ex:[{w:'焰',r:'ほのお',e:'flame'},{w:'火焰',r:'かえん',e:'flame'}]},
  {id:1935,k:'灸',m:'moxibustion',on:'キュウ',ku:'',lv:'N1',st:7,cat:'health',rad:'火',mn:'Fire + long = moxibustion',ex:[{w:'灸',r:'きゅう',e:'moxibustion'},{w:'お灸',r:'おきゅう',e:'moxibustion'}]},
  {id:1936,k:'畳',m:'tatami / fold',on:'ジョウ',ku:'たたみ',lv:'N1',st:12,cat:'other',rad:'田',mn:'Field + repeat = tatami',ex:[{w:'畳',r:'たたみ',e:'tatami mat'},{w:'畳む',r:'たたむ',e:'to fold'}]},
  {id:1937,k:'璃',m:'glass / lapis lazuli',on:'リ',ku:'',lv:'N1',st:14,cat:'other',rad:'玉',mn:'Jewel + glass = glass',ex:[{w:'瑠璃',r:'るり',e:'lapis lazuli'},{w:'瑠璃色',r:'るりいろ',e:'ultramarine'}]},
  {id:1938,k:'瑠',m:'lapis lazuli',on:'ル',ku:'',lv:'N1',st:14,cat:'other',rad:'玉',mn:'Jewel + flow = lapis lazuli',ex:[{w:'瑠璃',r:'るり',e:'lapis lazuli'},{w:'瑠璃色',r:'るりいろ',e:'ultramarine blue'}]},
  {id:1939,k:'珊',m:'coral',on:'サン',ku:'',lv:'N1',st:9,cat:'nature',rad:'玉',mn:'Jewel + delete = coral',ex:[{w:'珊瑚',r:'さんご',e:'coral'},{w:'珊瑚礁',r:'さんごしょう',e:'coral reef'}]},
  {id:1940,k:'瑚',m:'coral',on:'コ',ku:'',lv:'N1',st:13,cat:'nature',rad:'玉',mn:'Jewel + old = coral',ex:[{w:'珊瑚',r:'さんご',e:'coral'},{w:'珊瑚色',r:'さんごいろ',e:'coral color'}]},
  {id:1941,k:'碧',m:'blue-green / jade',on:'ヘキ',ku:'あお',lv:'N1',st:14,cat:'color',rad:'石',mn:'Stone + blue = blue-green',ex:[{w:'碧',r:'あお',e:'blue-green'},{w:'碧海',r:'へきかい',e:'blue ocean'}]},
  {id:1942,k:'蒼',m:'blue / pale',on:'ソウ',ku:'あお-',lv:'N1',st:13,cat:'color',rad:'艸',mn:'Grass + window = blue-green',ex:[{w:'蒼い',r:'あおい',e:'pale / blue'},{w:'蒼天',r:'そうてん',e:'blue sky'}]},
  {id:1943,k:'紺',m:'dark blue / navy',on:'コン',ku:'',lv:'N1',st:11,cat:'color',rad:'糸',mn:'Thread + sweet = dark blue',ex:[{w:'紺',r:'こん',e:'navy blue'},{w:'紺色',r:'こんいろ',e:'dark blue'}]},
  {id:1944,k:'茜',m:'madder / deep red',on:'セン',ku:'あかね',lv:'N1',st:9,cat:'color',rad:'艸',mn:'Grass + west = deep red',ex:[{w:'茜',r:'あかね',e:'madder'},{w:'茜色',r:'あかねいろ',e:'madder red'}]},
  {id:1945,k:'橙',m:'orange color',on:'トウ',ku:'だいだい',lv:'N1',st:16,cat:'color',rad:'木',mn:'Wood + lamp = orange',ex:[{w:'橙',r:'だいだい',e:'bitter orange'},{w:'橙色',r:'だいだいいろ',e:'orange color'}]},
  {id:1946,k:'鳶',m:'kite / brown',on:'エン',ku:'とび',lv:'N1',st:14,cat:'nature',rad:'鳥',mn:'Bird + kite = kite bird',ex:[{w:'鳶',r:'とび',e:'black kite'},{w:'鳶色',r:'とびいろ',e:'reddish brown'}]},
  {id:1947,k:'銀',m:'silver',on:'ギン',ku:'しろがね',lv:'N1',st:14,cat:'other',rad:'金',mn:'Metal + stubborn = silver',ex:[{w:'銀',r:'ぎん',e:'silver'},{w:'銀行',r:'ぎんこう',e:'bank'}]},
  {id:1948,k:'雀',m:'sparrow',on:'シャク',ku:'すずめ',lv:'N1',st:11,cat:'nature',rad:'隹',mn:'Bird + small = sparrow',ex:[{w:'雀',r:'すずめ',e:'sparrow'},{w:'雀荘',r:'じゃんそう',e:'mahjong parlor'}]},
  {id:1949,k:'鴨',m:'duck',on:'オウ',ku:'かも',lv:'N1',st:16,cat:'nature',rad:'鳥',mn:'Bird + armor = duck',ex:[{w:'鴨',r:'かも',e:'duck'},{w:'鴨鍋',r:'かもなべ',e:'duck hot pot'}]},
  {id:1950,k:'鷺',m:'heron / egret',on:'ロ',ku:'さぎ',lv:'N1',st:24,cat:'nature',rad:'鳥',mn:'Bird + dew = heron',ex:[{w:'鷺',r:'さぎ',e:'heron'},{w:'詐欺師',r:'さぎし',e:'swindler'}]},
  {id:1951,k:'雉',m:'pheasant',on:'チ',ku:'きじ',lv:'N1',st:13,cat:'nature',rad:'隹',mn:'Bird + know = pheasant',ex:[{w:'雉',r:'きじ',e:'pheasant'},{w:'雉子',r:'きじ',e:'pheasant'}]},
  {id:1952,k:'鵜',m:'cormorant',on:'ウ',ku:'う',lv:'N1',st:13,cat:'nature',rad:'鳥',mn:'Bird + bird = cormorant',ex:[{w:'鵜',r:'う',e:'cormorant'},{w:'鵜飼い',r:'うかい',e:'cormorant fishing'}]},
  {id:1953,k:'鳩',m:'dove / pigeon',on:'キュウ',ku:'はと',lv:'N1',st:13,cat:'nature',rad:'鳥',mn:'Nine + bird = pigeon',ex:[{w:'鳩',r:'はと',e:'pigeon'},{w:'鳩時計',r:'はとどけい',e:'cuckoo clock'}]},
  {id:1954,k:'梟',m:'owl',on:'キョウ',ku:'ふくろう',lv:'N1',st:11,cat:'nature',rad:'木',mn:'Wood + bird = owl',ex:[{w:'梟',r:'ふくろう',e:'owl'},{w:'梟雄',r:'きょうゆう',e:'warlord'}]},
  {id:1955,k:'翡',m:'kingfisher',on:'ヒ',ku:'',lv:'N1',st:14,cat:'nature',rad:'羽',mn:'Wings + non = kingfisher',ex:[{w:'翡翠',r:'ひすい',e:'jade / kingfisher'},{w:'翡翠色',r:'ひすいいろ',e:'jade green'}]},
  {id:1956,k:'翠',m:'kingfisher / jade',on:'スイ',ku:'みどり',lv:'N1',st:14,cat:'color',rad:'羽',mn:'Wings + short = kingfisher',ex:[{w:'翠',r:'みどり',e:'green'},{w:'翡翠',r:'ひすい',e:'jade'}]},
  {id:1957,k:'鱒',m:'trout',on:'ソン',ku:'ます',lv:'N1',st:23,cat:'nature',rad:'魚',mn:'Fish + sign = trout',ex:[{w:'鱒',r:'ます',e:'trout'},{w:'鱒寿司',r:'ますずし',e:'trout sushi'}]},
  {id:1958,k:'鮎',m:'sweetfish / ayu',on:'デン',ku:'あゆ',lv:'N1',st:16,cat:'nature',rad:'魚',mn:'Fish + sign = sweetfish',ex:[{w:'鮎',r:'あゆ',e:'sweetfish'},{w:'鮎釣り',r:'あゆつり',e:'sweetfish fishing'}]},
  {id:1959,k:'鰻',m:'eel',on:'マン',ku:'うなぎ',lv:'N1',st:21,cat:'food',rad:'魚',mn:'Fish + long = eel',ex:[{w:'鰻',r:'うなぎ',e:'eel'},{w:'鰻丼',r:'うなどん',e:'eel bowl'}]},
  {id:1960,k:'鯛',m:'sea bream',on:'チョウ',ku:'たい',lv:'N1',st:21,cat:'food',rad:'魚',mn:'Fish + whole = sea bream',ex:[{w:'鯛',r:'たい',e:'sea bream'},{w:'鯛焼き',r:'たいやき',e:'taiyaki'}]},
  {id:1961,k:'鮪',m:'tuna',on:'ユ',ku:'まぐろ',lv:'N1',st:17,cat:'food',rad:'魚',mn:'Fish + keeper = tuna',ex:[{w:'鮪',r:'まぐろ',e:'tuna'},{w:'鮪の刺身',r:'まぐろのさしみ',e:'tuna sashimi'}]},
  {id:1962,k:'鰤',m:'yellowtail',on:'シ',ku:'ぶり',lv:'N1',st:20,cat:'food',rad:'魚',mn:'Fish + young = yellowtail',ex:[{w:'鰤',r:'ぶり',e:'yellowtail'},{w:'鰤大根',r:'ぶりだいこん',e:'yellowtail and daikon'}]},
  {id:1963,k:'蛸',m:'octopus',on:'ショウ',ku:'たこ',lv:'N1',st:13,cat:'food',rad:'虫',mn:'Insect + high = octopus',ex:[{w:'蛸',r:'たこ',e:'octopus'},{w:'蛸壺',r:'たこつぼ',e:'octopus pot'}]},
  {id:1964,k:'蟹',m:'crab',on:'カイ',ku:'かに',lv:'N1',st:19,cat:'food',rad:'虫',mn:'Insect + crab shape = crab',ex:[{w:'蟹',r:'かに',e:'crab'},{w:'蟹鍋',r:'かになべ',e:'crab hot pot'}]},
  {id:1965,k:'貝',m:'shellfish',on:'バイ',ku:'かい',lv:'N1',st:7,cat:'food',rad:'目',mn:'Eye + legs = shell',ex:[{w:'貝',r:'かい',e:'shellfish'},{w:'貝類',r:'かいるい',e:'shellfish'}]},
  {id:1966,k:'帆',m:'sail',on:'ハン',ku:'ほ',lv:'N1',st:6,cat:'other',rad:'巾',mn:'Cloth + wind = sail',ex:[{w:'帆',r:'ほ',e:'sail'},{w:'帆船',r:'はんせん',e:'sailing ship'}]},
  {id:1967,k:'楫',m:'oar / rudder',on:'シュウ',ku:'かじ',lv:'N1',st:13,cat:'other',rad:'木',mn:'Wood + collect = oar',ex:[{w:'楫',r:'かじ',e:'rudder'},{w:'楫取り',r:'かじとり',e:'helmsman'}]},
  {id:1968,k:'碇',m:'anchor',on:'テイ',ku:'いかり',lv:'N1',st:14,cat:'other',rad:'石',mn:'Stone + lower = anchor',ex:[{w:'碇',r:'いかり',e:'anchor'},{w:'碇を下ろす',r:'いかりをおろす',e:'to drop anchor'}]},
  {id:1969,k:'舷',m:'gunwale / side of ship',on:'ゲン',ku:'',lv:'N1',st:11,cat:'other',rad:'舟',mn:'Boat + dark = side of ship',ex:[{w:'舷',r:'げん',e:'side of ship'},{w:'左舷',r:'さげん',e:'port side'}]},
  {id:1970,k:'艫',m:'stern / bow',on:'ロ',ku:'とも',lv:'N1',st:22,cat:'other',rad:'舟',mn:'Boat + tiger = stern',ex:[{w:'艫',r:'とも',e:'stern'},{w:'艫綱',r:'ともづな',e:'mooring rope'}]},
  {id:1971,k:'舵',m:'rudder',on:'ダ',ku:'かじ',lv:'N1',st:11,cat:'other',rad:'舟',mn:'Boat + earth = rudder',ex:[{w:'舵',r:'かじ',e:'rudder'},{w:'舵を切る',r:'かじをきる',e:'to steer'}]},
  {id:1972,k:'錨',m:'anchor',on:'ビョウ',ku:'いかり',lv:'N1',st:17,cat:'other',rad:'金',mn:'Metal + seedling = anchor',ex:[{w:'錨',r:'いかり',e:'anchor'},{w:'錨を打つ',r:'いかりをうつ',e:'to drop anchor'}]},
  {id:1973,k:'渚',m:'shore / beach',on:'ショ',ku:'なぎさ',lv:'N1',st:11,cat:'place',rad:'水',mn:'Water + person = shore',ex:[{w:'渚',r:'なぎさ',e:'shore'},{w:'渚辺',r:'なぎさべ',e:'by the shore'}]},
  {id:1974,k:'磯',m:'rocky shore',on:'キ',ku:'いそ',lv:'N1',st:17,cat:'place',rad:'石',mn:'Stone + machine = rocky shore',ex:[{w:'磯',r:'いそ',e:'rocky shore'},{w:'磯釣り',r:'いそつり',e:'rock fishing'}]},
  {id:1975,k:'浜',m:'beach',on:'ヒン',ku:'はま',lv:'N1',st:10,cat:'place',rad:'水',mn:'Water + various = beach',ex:[{w:'浜',r:'はま',e:'beach'},{w:'砂浜',r:'すなはま',e:'sandy beach'}]},
  {id:1976,k:'崗',m:'ridge / hill',on:'コウ',ku:'',lv:'N1',st:8,cat:'place',rad:'山',mn:'Mountain + ridge = hill',ex:[{w:'崗',r:'こう',e:'hill'},{w:'崗位',r:'こうい',e:'post / position'}]},
  {id:1977,k:'嶺',m:'mountain peak',on:'レイ',ku:'みね',lv:'N1',st:17,cat:'place',rad:'山',mn:'Mountain + orders = peak',ex:[{w:'嶺',r:'みね',e:'peak'},{w:'山嶺',r:'さんれい',e:'mountain peak'}]},
  {id:1978,k:'麓',m:'foot of mountain',on:'ロク',ku:'ふもと',lv:'N1',st:19,cat:'place',rad:'山',mn:'Mountain + forest = foot',ex:[{w:'麓',r:'ふもと',e:'foot of mountain'},{w:'山麓',r:'さんろく',e:'foot of a mountain'}]},
  {id:1979,k:'洞',m:'cave',on:'ドウ',ku:'ほら',lv:'N1',st:9,cat:'place',rad:'水',mn:'Water + same = cave',ex:[{w:'洞窟',r:'どうくつ',e:'cave'},{w:'洞穴',r:'ほらあな',e:'cave'}]},
  {id:1980,k:'窪',m:'hollow / low ground',on:'カ',ku:'くぼ',lv:'N1',st:14,cat:'place',rad:'穴',mn:'Hole + low = hollow',ex:[{w:'窪',r:'くぼ',e:'hollow'},{w:'窪地',r:'くぼち',e:'depression'}]},
  {id:1981,k:'淵',m:'abyss / deep pool',on:'エン',ku:'ふち',lv:'N1',st:12,cat:'nature',rad:'水',mn:'Water + abyss = abyss',ex:[{w:'淵',r:'ふち',e:'abyss'},{w:'奈落の底',r:'ならくのそこ',e:'depths of hell'}]},
  {id:1982,k:'汀',m:'water\'s edge',on:'テイ',ku:'みぎわ',lv:'N1',st:5,cat:'place',rad:'水',mn:'Water + stop = water\'s edge',ex:[{w:'汀',r:'みぎわ',e:'water\'s edge'},{w:'汀線',r:'ていせん',e:'shoreline'}]},
  {id:1983,k:'湊',m:'port / gather',on:'ソウ',ku:'みなと',lv:'N1',st:12,cat:'place',rad:'水',mn:'Water + gather = port',ex:[{w:'湊',r:'みなと',e:'port'},{w:'湊町',r:'みなとまち',e:'port town'}]},
  {id:1984,k:'巌',m:'rock / crag',on:'ガン',ku:'いわお',lv:'N1',st:20,cat:'nature',rad:'山',mn:'Mountain + rock = crag',ex:[{w:'巌',r:'いわお',e:'crag'},{w:'巌窟',r:'がんくつ',e:'cave'}]},
  {id:1985,k:'礫',m:'pebble / gravel',on:'レキ',ku:'つぶて',lv:'N1',st:20,cat:'nature',rad:'石',mn:'Stone + history = pebble',ex:[{w:'礫',r:'つぶて',e:'pebble'},{w:'瓦礫',r:'がれき',e:'rubble'}]},
  {id:1986,k:'苔',m:'moss',on:'タイ',ku:'こけ',lv:'N1',st:8,cat:'nature',rad:'艸',mn:'Grass + old = moss',ex:[{w:'苔',r:'こけ',e:'moss'},{w:'苔むす',r:'こけむす',e:'to be moss-covered'}]},
  {id:1987,k:'蔦',m:'ivy',on:'チョウ',ku:'つた',lv:'N1',st:15,cat:'nature',rad:'艸',mn:'Grass + bird = ivy',ex:[{w:'蔦',r:'つた',e:'ivy'},{w:'蔦紅葉',r:'つたもみじ',e:'ivy autumn leaves'}]},
  {id:1988,k:'薫',m:'fragrant',on:'クン',ku:'かお-',lv:'N1',st:16,cat:'nature',rad:'艸',mn:'Grass + military = fragrant',ex:[{w:'薫る',r:'かおる',e:'to be fragrant'},{w:'薫製',r:'くんせい',e:'smoked food'}]},
  {id:1989,k:'馨',m:'fragrant / fragrance',on:'ケイ',ku:'かお-',lv:'N1',st:20,cat:'nature',rad:'香',mn:'Fragrant + sound = fragrance',ex:[{w:'馨しい',r:'かぐわしい',e:'fragrant'},{w:'馨香',r:'けいこう',e:'fragrance'}]},
  {id:1990,k:'凧',m:'kite',on:'カ',ku:'たこ',lv:'N1',st:6,cat:'other',rad:'風',mn:'Wind + cloth = kite',ex:[{w:'凧',r:'たこ',e:'kite'},{w:'凧揚げ',r:'たこあげ',e:'kite flying'}]},
  {id:1991,k:'箒',m:'broom',on:'ソウ',ku:'ほうき',lv:'N1',st:14,cat:'other',rad:'竹',mn:'Bamboo + broom = broom',ex:[{w:'箒',r:'ほうき',e:'broom'},{w:'箒草',r:'ほうきぐさ',e:'kochia'}]},
  {id:1992,k:'簾',m:'bamboo blind / screen',on:'レン',ku:'すだれ',lv:'N1',st:19,cat:'other',rad:'竹',mn:'Bamboo + connect = blind',ex:[{w:'簾',r:'すだれ',e:'bamboo blind'},{w:'御簾',r:'みす',e:'bamboo blind (honorific)'}]},
  {id:1993,k:'暖簾',m:'shop curtain',on:'ノレン',ku:'',lv:'N1',st:0,cat:'other',rad:'',mn:'',ex:[{w:'暖簾',r:'のれん',e:'shop curtain'},{w:'暖簾分け',r:'のれんわけ',e:'setting up a branch shop'}]},
  {id:1994,k:'扇',m:'fan',on:'セン',ku:'おうぎ',lv:'N1',st:10,cat:'other',rad:'戸',mn:'Door + feathers = fan',ex:[{w:'扇',r:'おうぎ',e:'fan'},{w:'扇風機',r:'せんぷうき',e:'electric fan'}]},
  {id:1995,k:'釜',m:'pot / kettle',on:'フ',ku:'かま',lv:'N1',st:10,cat:'other',rad:'金',mn:'Metal + father = kettle',ex:[{w:'釜',r:'かま',e:'pot / kettle'},{w:'茶釜',r:'ちゃがま',e:'tea kettle'}]},
  {id:1996,k:'甕',m:'jar / jug',on:'オウ',ku:'かめ',lv:'N1',st:22,cat:'other',rad:'瓦',mn:'Tile + container = jar',ex:[{w:'甕',r:'かめ',e:'jar'},{w:'甕棺',r:'かめかん',e:'jar coffin'}]},
  {id:1997,k:'筆',m:'brush / writing',on:'ヒツ',ku:'ふで',lv:'N1',st:12,cat:'art',rad:'竹',mn:'Bamboo + brush = writing brush',ex:[{w:'筆',r:'ふで',e:'brush'},{w:'筆記',r:'ひっき',e:'writing'}]},
  {id:1998,k:'硯',m:'inkstone',on:'ケン',ku:'すずり',lv:'N1',st:12,cat:'art',rad:'石',mn:'Stone + see = inkstone',ex:[{w:'硯',r:'すずり',e:'inkstone'},{w:'硯箱',r:'すずりばこ',e:'inkstone box'}]},
  {id:1999,k:'巻',m:'scroll / roll',on:'カン',ku:'まき・ま-',lv:'N1',st:9,cat:'art',rad:'己',mn:'Self + knife = scroll',ex:[{w:'巻',r:'まき',e:'roll'},{w:'絵巻',r:'えまき',e:'picture scroll'}]},
  {id:2000,k:'棟',m:'ridge / building',on:'トウ',ku:'むね',lv:'N1',st:12,cat:'other',rad:'木',mn:'Wood + east = ridge',ex:[{w:'棟',r:'むね',e:'ridge'},{w:'棟上げ',r:'むねあげ',e:'roofing ceremony'}]},
  {id:2001,k:'梁',m:'beam / rafter',on:'リョウ',ku:'はり',lv:'N1',st:11,cat:'other',rad:'木',mn:'Wood + water = beam',ex:[{w:'梁',r:'はり',e:'beam'},{w:'大黒柱',r:'だいこくばしら',e:'central pillar'}]},
  {id:2002,k:'礎',m:'foundation',on:'ソ',ku:'いしずえ',lv:'N1',st:18,cat:'other',rad:'石',mn:'Stone + ancestor = foundation',ex:[{w:'礎',r:'いしずえ',e:'foundation stone'},{w:'礎石',r:'そせき',e:'foundation stone'}]},
  {id:2003,k:'閾',m:'threshold',on:'イキ',ku:'しきい',lv:'N1',st:16,cat:'other',rad:'門',mn:'Gate + force = threshold',ex:[{w:'敷居',r:'しきい',e:'threshold'},{w:'閾値',r:'しきいち',e:'threshold value'}]},
  {id:2004,k:'甍',m:'roof tiles',on:'ボウ',ku:'いらか',lv:'N1',st:17,cat:'other',rad:'瓦',mn:'Tile + roof = roof tiles',ex:[{w:'甍',r:'いらか',e:'roof tiles'},{w:'甍の波',r:'いらかのなみ',e:'waves of rooftops'}]},
  {id:2005,k:'鐘',m:'bell / gong',on:'ショウ',ku:'かね',lv:'N1',st:20,cat:'art',rad:'金',mn:'Metal + child = bell',ex:[{w:'鐘',r:'かね',e:'bell'},{w:'除夜の鐘',r:'じょやのかね',e:'New Year\'s Eve bell'}]},
  {id:2006,k:'琵',m:'lute',on:'ビ',ku:'',lv:'N1',st:12,cat:'art',rad:'玉',mn:'Jewel + compare = lute',ex:[{w:'琵琶',r:'びわ',e:'biwa lute'},{w:'琵琶湖',r:'びわこ',e:'Lake Biwa'}]},
  {id:2007,k:'琶',m:'lute',on:'ハ',ku:'',lv:'N1',st:12,cat:'art',rad:'玉',mn:'Jewel + put = lute',ex:[{w:'琵琶',r:'びわ',e:'biwa lute'},{w:'琵琶法師',r:'びわほうし',e:'biwa priest'}]},
  {id:2008,k:'笙',m:'sho (instrument)',on:'ショウ',ku:'',lv:'N1',st:11,cat:'art',rad:'竹',mn:'Bamboo + born = sho',ex:[{w:'笙',r:'しょう',e:'sho (wind instrument)'},{w:'雅楽',r:'ががく',e:'Japanese court music'}]},
  {id:2009,k:'篳',m:'bamboo flute',on:'ヒツ',ku:'',lv:'N1',st:17,cat:'art',rad:'竹',mn:'Bamboo + strict = bamboo flute',ex:[{w:'篳篥',r:'ひちりき',e:'hichiriki flute'},{w:'篳篥奏者',r:'ひちりきそうしゃ',e:'hichiriki player'}]},
  {id:2010,k:'篥',m:'flute',on:'リツ',ku:'',lv:'N1',st:15,cat:'art',rad:'竹',mn:'Bamboo + arrive = flute',ex:[{w:'篳篥',r:'ひちりき',e:'hichiriki flute'},{w:'篥奏',r:'りつそう',e:'flute performance'}]},
  {id:2011,k:'謡',m:'noh chant / song',on:'ヨウ',ku:'うたい',lv:'N1',st:16,cat:'art',rad:'言',mn:'Words + shake = noh chant',ex:[{w:'謡',r:'うたい',e:'noh chant'},{w:'謡曲',r:'ようきょく',e:'noh music'}]},
  {id:2012,k:'囃',m:'hayashi / noise',on:'ソウ',ku:'はやし',lv:'N1',st:23,cat:'art',rad:'口',mn:'Many voices = hayashi',ex:[{w:'囃子',r:'はやし',e:'hayashi music'},{w:'お囃子',r:'おはやし',e:'festival music'}]},
  {id:2013,k:'錦',m:'brocade',on:'キン',ku:'にしき',lv:'N1',st:16,cat:'art',rad:'金',mn:'Metal + white silk = brocade',ex:[{w:'錦',r:'にしき',e:'brocade'},{w:'錦絵',r:'にしきえ',e:'color woodblock print'}]},
  {id:2014,k:'緞',m:'satin / damask',on:'ドン',ku:'',lv:'N1',st:15,cat:'art',rad:'糸',mn:'Thread + step = satin',ex:[{w:'緞帳',r:'どんちょう',e:'stage curtain'},{w:'緞子',r:'どんす',e:'damask'}]},
  {id:2015,k:'綸',m:'thread / fishing line',on:'リン',ku:'',lv:'N1',st:14,cat:'other',rad:'糸',mn:'Thread + wheel = fishing line',ex:[{w:'綸',r:'りん',e:'fishing line'},{w:'綸言',r:'りんげん',e:'imperial word'}]},
  {id:2016,k:'彩',m:'color / decorate',on:'サイ',ku:'いろど-',lv:'N1',st:11,cat:'art',rad:'彡',mn:'Hair + tree = color',ex:[{w:'彩る',r:'いろどる',e:'to color'},{w:'色彩',r:'しきさい',e:'color'}]},
  {id:2017,k:'粧',m:'adorn / makeup',on:'ショウ',ku:'',lv:'N1',st:12,cat:'art',rad:'米',mn:'Rice + village = adorn',ex:[{w:'化粧',r:'けしょう',e:'makeup'},{w:'粧す',r:'けます',e:'to adorn'}]},
  {id:2018,k:'麗',m:'beautiful',on:'レイ',ku:'うるわ-',lv:'N1',st:19,cat:'description',rad:'鹿',mn:'Deer + net = beautiful',ex:[{w:'麗しい',r:'うるわしい',e:'beautiful'},{w:'華麗',r:'かれい',e:'gorgeous'}]},
  {id:2019,k:'艶',m:'luster / charm',on:'エン',ku:'つや',lv:'N1',st:19,cat:'description',rad:'色',mn:'Color + cover = luster',ex:[{w:'艶',r:'つや',e:'luster'},{w:'艶やか',r:'つややか',e:'lustrous'}]},
  {id:2020,k:'粋',m:'chic / pure',on:'スイ',ku:'いき',lv:'N1',st:10,cat:'description',rad:'米',mn:'Rice + ten = chic',ex:[{w:'粋',r:'いき',e:'chic'},{w:'粋人',r:'すいじん',e:'person of taste'}]},
  {id:2021,k:'侘',m:'wabi / loneliness',on:'タ',ku:'わび',lv:'N1',st:8,cat:'feeling',rad:'人',mn:'Person + other = wabi',ex:[{w:'侘び',r:'わび',e:'wabi'},{w:'侘び寂び',r:'わびさび',e:'wabi-sabi'}]},
  {id:2022,k:'寂',m:'lonely / quiet',on:'ジャク',ku:'さびし-',lv:'N1',st:11,cat:'feeling',rad:'宀',mn:'Roof + small = lonely',ex:[{w:'寂しい',r:'さびしい',e:'lonely'},{w:'閑寂',r:'かんじゃく',e:'quiet and lonely'}]},
  {id:2023,k:'雅',m:'elegant',on:'ガ',ku:'みや-',lv:'N1',st:13,cat:'description',rad:'隹',mn:'Bird + tooth = elegant',ex:[{w:'雅',r:'みやび',e:'elegant'},{w:'雅楽',r:'ががく',e:'court music'}]},
  {id:2024,k:'粋',m:'pure',on:'スイ',ku:'いき',lv:'N1',st:10,cat:'description',rad:'米',mn:'Rice + ten = pure',ex:[{w:'純粋',r:'じゅんすい',e:'pure'},{w:'粋狂',r:'すいきょう',e:'eccentric'}]},
  {id:2025,k:'儚',m:'fleeting / transient',on:'ボウ',ku:'はかな-',lv:'N1',st:16,cat:'description',rad:'人',mn:'Person + dream = fleeting',ex:[{w:'儚い',r:'はかない',e:'fleeting'},{w:'儚さ',r:'はかなさ',e:'transience'}]},
  {id:2026,k:'慟',m:'wail / lament',on:'ドウ',ku:'なげ-',lv:'N1',st:15,cat:'feeling',rad:'心',mn:'Heart + move = wail',ex:[{w:'慟哭',r:'どうこく',e:'wailing'},{w:'慟く',r:'なげく',e:'to wail'}]},
  {id:2027,k:'嗚',m:'sobbing',on:'オ',ku:'',lv:'N1',st:13,cat:'feeling',rad:'口',mn:'Mouth + bird = sobbing',ex:[{w:'嗚咽',r:'おえつ',e:'sobbing'},{w:'嗚呼',r:'ああ',e:'alas'}]},
  {id:2028,k:'咽',m:'throat / choke',on:'イン',ku:'のど',lv:'N1',st:9,cat:'body',rad:'口',mn:'Mouth + cause = throat',ex:[{w:'咽喉',r:'いんこう',e:'throat'},{w:'嗚咽',r:'おえつ',e:'sobbing'}]},
  {id:2029,k:'喉',m:'throat',on:'コウ',ku:'のど',lv:'N1',st:12,cat:'body',rad:'口',mn:'Mouth + hook = throat',ex:[{w:'喉',r:'のど',e:'throat'},{w:'喉仏',r:'のどぼとけ',e:'Adam\'s apple'}]},
  {id:2030,k:'頸',m:'neck',on:'ケイ',ku:'くび',lv:'N1',st:16,cat:'body',rad:'頁',mn:'Page + path = neck',ex:[{w:'頸',r:'くび',e:'neck'},{w:'頸動脈',r:'けいどうみゃく',e:'carotid artery'}]},
  {id:2031,k:'項',m:'nape of neck',on:'コウ',ku:'うなじ',lv:'N1',st:12,cat:'body',rad:'頁',mn:'Page + craft = nape',ex:[{w:'項',r:'うなじ',e:'nape of neck'},{w:'頸項',r:'けいこう',e:'neck'}]},
  {id:2032,k:'鎖骨',m:'collarbone',on:'サコツ',ku:'',lv:'N1',st:0,cat:'body',rad:'',mn:'',ex:[{w:'鎖骨',r:'さこつ',e:'collarbone'},{w:'鎖骨骨折',r:'さこつこっせつ',e:'collarbone fracture'}]},
  {id:2033,k:'腱',m:'tendon',on:'ケン',ku:'',lv:'N1',st:13,cat:'body',rad:'月',mn:'Body + healthy = tendon',ex:[{w:'腱',r:'けん',e:'tendon'},{w:'アキレス腱',r:'アキレスけん',e:'Achilles tendon'}]},
  {id:2034,k:'靭',m:'flexible / tough',on:'ジン',ku:'',lv:'N1',st:13,cat:'description',rad:'革',mn:'Leather + blade = tough',ex:[{w:'靭帯',r:'じんたい',e:'ligament'},{w:'靭やか',r:'しなやか',e:'flexible'}]},
  {id:2035,k:'脆',m:'fragile / brittle',on:'ゼイ',ku:'もろ-',lv:'N1',st:10,cat:'description',rad:'月',mn:'Body + danger = fragile',ex:[{w:'脆い',r:'もろい',e:'fragile'},{w:'脆弱',r:'ぜいじゃく',e:'fragile'}]},
  {id:2036,k:'萎',m:'wither',on:'イ',ku:'な-',lv:'N1',st:11,cat:'nature',rad:'艸',mn:'Grass + woman = wither',ex:[{w:'萎える',r:'なえる',e:'to wither'},{w:'萎縮',r:'いしゅく',e:'shrinkage'}]},
  {id:2037,k:'朽',m:'decay',on:'キュウ',ku:'く-',lv:'N1',st:6,cat:'nature',rad:'木',mn:'Wood + ladle = decay',ex:[{w:'朽ちる',r:'くちる',e:'to decay'},{w:'不朽',r:'ふきゅう',e:'immortal'}]},
  {id:2038,k:'腐',m:'rot / decay',on:'フ',ku:'くさ-',lv:'N1',st:14,cat:'nature',rad:'府',mn:'Office + meat = rot',ex:[{w:'腐る',r:'くさる',e:'to rot'},{w:'腐敗',r:'ふはい',e:'corruption'}]},
  {id:2039,k:'溶',m:'melt / dissolve',on:'ヨウ',ku:'と-',lv:'N1',st:13,cat:'action',rad:'水',mn:'Water + valley = melt',ex:[{w:'溶ける',r:'とける',e:'to melt'},{w:'溶解',r:'ようかい',e:'dissolution'}]},
  {id:2040,k:'凝',m:'congeal',on:'ギョウ',ku:'こ-',lv:'N1',st:16,cat:'action',rad:'冫',mn:'Ice + look = congeal',ex:[{w:'凝る',r:'こる',e:'to be stiff'},{w:'凝固',r:'ぎょうこ',e:'solidification'}]},
  {id:2041,k:'滲',m:'seep / ooze',on:'シン',ku:'にじ-',lv:'N1',st:14,cat:'action',rad:'水',mn:'Water + forest = seep',ex:[{w:'滲む',r:'にじむ',e:'to seep'},{w:'浸滲',r:'しんしん',e:'permeation'}]},
  {id:2042,k:'漲',m:'overflow / swell',on:'チョウ',ku:'みなぎ-',lv:'N1',st:14,cat:'action',rad:'水',mn:'Water + spread = overflow',ex:[{w:'漲る',r:'みなぎる',e:'to overflow'},{w:'気力が漲る',r:'きりょくがみなぎる',e:'brimming with energy'}]},
  {id:2043,k:'澱',m:'sediment / stagnate',on:'デン',ku:'おり',lv:'N1',st:16,cat:'other',rad:'水',mn:'Water + palace = sediment',ex:[{w:'澱',r:'おり',e:'sediment'},{w:'澱粉',r:'でんぷん',e:'starch'}]},
  {id:2044,k:'濁',m:'muddy / turbid',on:'ダク',ku:'にご-',lv:'N1',st:16,cat:'description',rad:'水',mn:'Water + insect = muddy',ex:[{w:'濁る',r:'にごる',e:'to become muddy'},{w:'濁流',r:'だくりゅう',e:'muddy stream'}]},
  {id:2045,k:'淀',m:'pool / stagnate',on:'テン',ku:'よど-',lv:'N1',st:11,cat:'action',rad:'水',mn:'Water + grow = stagnate',ex:[{w:'淀む',r:'よどむ',e:'to stagnate'},{w:'淀川',r:'よどがわ',e:'Yodo River'}]},
  {id:2046,k:'謙',m:'humble',on:'ケン',ku:'',lv:'N1',st:17,cat:'description',rad:'言',mn:'Words + combine = modest',ex:[{w:'謙虚',r:'けんきょ',e:'humble'},{w:'謙譲語',r:'けんじょうご',e:'humble language'}]},
  {id:2047,k:'遜',m:'humble',on:'ソン',ku:'',lv:'N1',st:13,cat:'description',rad:'辵',mn:'Walk + grandchild = humble',ex:[{w:'謙遜',r:'けんそん',e:'humility'},{w:'遜色',r:'そんしょく',e:'inferiority'}]},
  {id:2048,k:'慇',m:'kind / attentive',on:'イン',ku:'',lv:'N1',st:14,cat:'feeling',rad:'心',mn:'Heart + cause = attentive',ex:[{w:'慇懃',r:'いんぎん',e:'courteous'},{w:'慇懃無礼',r:'いんぎんぶれい',e:'polite on the surface'}]},
  {id:2049,k:'懃',m:'diligent / attentive',on:'キン',ku:'',lv:'N1',st:17,cat:'feeling',rad:'心',mn:'Heart + diligent = attentive',ex:[{w:'慇懃',r:'いんぎん',e:'courteous'},{w:'勤懃',r:'きんきん',e:'diligent'}]},
  {id:2050,k:'叮',m:'careful / attentive',on:'テイ',ku:'',lv:'N1',st:5,cat:'description',rad:'口',mn:'Mouth + nail = careful',ex:[{w:'叮嚀',r:'ていねい',e:'polite'},{w:'叮嚀に',r:'ていねいに',e:'carefully'}]},
  {id:2051,k:'嚀',m:'attentive / careful',on:'ネイ',ku:'',lv:'N1',st:19,cat:'description',rad:'口',mn:'Mouth + peaceful = careful',ex:[{w:'丁寧',r:'ていねい',e:'polite'},{w:'叮嚀',r:'ていねい',e:'careful'}]},
  {id:2052,k:'偲',m:'think fondly of',on:'シ',ku:'しの-',lv:'N1',st:11,cat:'feeling',rad:'人',mn:'Person + think = think fondly',ex:[{w:'偲ぶ',r:'しのぶ',e:'to think fondly of'},{w:'偲び草',r:'しのびぐさ',e:'keepsake'}]},
  {id:2053,k:'彷',m:'wander / roam',on:'ホウ',ku:'さまよ-',lv:'N1',st:7,cat:'action',rad:'彳',mn:'Walk + direction = wander',ex:[{w:'彷徨う',r:'さまよう',e:'to wander'},{w:'彷彿',r:'ほうふつ',e:'vividly resembling'}]},
  {id:2054,k:'徨',m:'wander',on:'コウ',ku:'さまよ-',lv:'N1',st:12,cat:'action',rad:'彳',mn:'Walk + emperor = wander',ex:[{w:'彷徨',r:'ほうこう',e:'wandering'},{w:'徨う',r:'さまよう',e:'to wander'}]},
  {id:2055,k:'蠢',m:'wriggle / stir',on:'シュン',ku:'うごめ-',lv:'N1',st:21,cat:'action',rad:'虫',mn:'Two insects + spring = wriggle',ex:[{w:'蠢く',r:'うごめく',e:'to wriggle'},{w:'蠢動',r:'しゅんどう',e:'stirring'}]},
  {id:2056,k:'蹲',m:'squat / crouch',on:'ソン',ku:'つくば-',lv:'N1',st:19,cat:'action',rad:'足',mn:'Foot + village = squat',ex:[{w:'蹲る',r:'つくばう',e:'to squat'},{w:'蹲踞',r:'そんきょ',e:'squatting posture'}]},
  {id:2057,k:'蹌',m:'stagger / totter',on:'ソウ',ku:'よろめ-',lv:'N1',st:17,cat:'action',rad:'足',mn:'Foot + storehouse = stagger',ex:[{w:'蹌踉',r:'そうろう',e:'staggering'},{w:'蹌踉めく',r:'よろめく',e:'to stagger'}]},
  {id:2058,k:'躓',m:'stumble / trip',on:'チ',ku:'つまず-',lv:'N1',st:20,cat:'action',rad:'足',mn:'Foot + wisdom = stumble',ex:[{w:'躓く',r:'つまずく',e:'to stumble'},{w:'躓き',r:'つまずき',e:'stumble / setback'}]},
  {id:2059,k:'猫',m:'cat',on:'ビョウ',ku:'ねこ',lv:'N1',st:11,cat:'nature',rad:'犬',mn:'Dog + seedling = cat',ex:[{w:'猫',r:'ねこ',e:'cat'},{w:'猫背',r:'ねこぜ',e:'hunched back'}]},
  {id:2060,k:'犬',m:'dog',on:'ケン',ku:'いぬ',lv:'N1',st:4,cat:'nature',rad:'犬',mn:'Dog shape = dog',ex:[{w:'犬',r:'いぬ',e:'dog'},{w:'番犬',r:'ばんけん',e:'guard dog'}]},
  {id:2061,k:'兎',m:'rabbit',on:'ト',ku:'うさぎ',lv:'N1',st:8,cat:'nature',rad:'兎',mn:'Rabbit shape = rabbit',ex:[{w:'兎',r:'うさぎ',e:'rabbit'},{w:'兎に角',r:'とにかく',e:'anyway'}]},
  {id:2062,k:'鹿',m:'deer',on:'ロク',ku:'しか',lv:'N1',st:11,cat:'nature',rad:'鹿',mn:'Deer shape = deer',ex:[{w:'鹿',r:'しか',e:'deer'},{w:'鹿児島',r:'かごしま',e:'Kagoshima'}]},
  {id:2063,k:'猪',m:'wild boar',on:'チョ',ku:'いのしし',lv:'N1',st:11,cat:'nature',rad:'犬',mn:'Dog + pig = wild boar',ex:[{w:'猪',r:'いのしし',e:'wild boar'},{w:'猪突猛進',r:'ちょとつもうしん',e:'rushing headlong'}]},
  {id:2064,k:'豚',m:'pig',on:'トン',ku:'ぶた',lv:'N1',st:11,cat:'nature',rad:'豕',mn:'Pig + meat = pig',ex:[{w:'豚',r:'ぶた',e:'pig'},{w:'豚肉',r:'ぶたにく',e:'pork'}]},
  {id:2065,k:'羊',m:'sheep',on:'ヨウ',ku:'ひつじ',lv:'N1',st:6,cat:'nature',rad:'羊',mn:'Sheep horns = sheep',ex:[{w:'羊',r:'ひつじ',e:'sheep'},{w:'羊毛',r:'ようもう',e:'wool'}]},
  {id:2066,k:'馬',m:'horse',on:'バ',ku:'うま',lv:'N1',st:10,cat:'nature',rad:'馬',mn:'Horse shape = horse',ex:[{w:'馬',r:'うま',e:'horse'},{w:'馬力',r:'ばりき',e:'horsepower'}]},
  {id:2067,k:'牛',m:'cow',on:'ギュウ',ku:'うし',lv:'N1',st:4,cat:'nature',rad:'牛',mn:'Cow horns = cow',ex:[{w:'牛',r:'うし',e:'cow'},{w:'牛乳',r:'ぎゅうにゅう',e:'milk'}]},
  {id:2068,k:'猿',m:'monkey',on:'エン',ku:'さる',lv:'N1',st:13,cat:'nature',rad:'犬',mn:'Dog + ape = monkey',ex:[{w:'猿',r:'さる',e:'monkey'},{w:'猿知恵',r:'さるぢえ',e:'shallow wisdom'}]},
  {id:2069,k:'鷗',m:'seagull',on:'オウ',ku:'かもめ',lv:'N1',st:22,cat:'nature',rad:'鳥',mn:'Bird + area = seagull',ex:[{w:'鷗',r:'かもめ',e:'seagull'},{w:'鷗外',r:'おうがい',e:'Ogai (author\'s name)'}]},
  {id:2070,k:'雛',m:'chick / doll',on:'スウ',ku:'ひな',lv:'N1',st:18,cat:'nature',rad:'隹',mn:'Bird + ugly = chick',ex:[{w:'雛',r:'ひな',e:'chick / doll'},{w:'雛祭り',r:'ひなまつり',e:'Doll Festival'}]},
  {id:2071,k:'蛙',m:'frog',on:'ア',ku:'かえる',lv:'N1',st:12,cat:'nature',rad:'虫',mn:'Insect + skin = frog',ex:[{w:'蛙',r:'かえる',e:'frog'},{w:'蛙の子は蛙',r:'かえるのこはかえる',e:'like father like son'}]},
  {id:2072,k:'蝦',m:'shrimp / prawn',on:'カ',ku:'えび',lv:'N1',st:15,cat:'food',rad:'虫',mn:'Insect + get = shrimp',ex:[{w:'蝦',r:'えび',e:'shrimp'},{w:'伊勢海老',r:'いせえび',e:'lobster'}]},
  {id:2073,k:'蛤',m:'clam',on:'コウ',ku:'はまぐり',lv:'N1',st:13,cat:'food',rad:'虫',mn:'Insect + clam = clam',ex:[{w:'蛤',r:'はまぐり',e:'clam'},{w:'蛤御門',r:'はまぐりごもん',e:'Hamaguri Gate'}]},
  {id:2074,k:'蜆',m:'freshwater clam',on:'ケン',ku:'しじみ',lv:'N1',st:13,cat:'food',rad:'虫',mn:'Insect + county = clam',ex:[{w:'蜆',r:'しじみ',e:'freshwater clam'},{w:'蜆汁',r:'しじみじる',e:'clam soup'}]},
  {id:2075,k:'鰹',m:'bonito',on:'ケン',ku:'かつお',lv:'N1',st:22,cat:'food',rad:'魚',mn:'Fish + brave = bonito',ex:[{w:'鰹',r:'かつお',e:'bonito'},{w:'鰹節',r:'かつおぶし',e:'dried bonito'}]},
  {id:2076,k:'鯵',m:'horse mackerel',on:'サン',ku:'あじ',lv:'N1',st:17,cat:'food',rad:'魚',mn:'Fish + three = horse mackerel',ex:[{w:'鯵',r:'あじ',e:'horse mackerel'},{w:'鯵の開き',r:'あじのひらき',e:'dried horse mackerel'}]},
  {id:2077,k:'鰆',m:'Spanish mackerel',on:'シュン',ku:'さわら',lv:'N1',st:21,cat:'food',rad:'魚',mn:'Fish + spring = Spanish mackerel',ex:[{w:'鰆',r:'さわら',e:'Spanish mackerel'},{w:'鰆の西京焼き',r:'さわらのさいきょうやき',e:'miso-marinated mackerel'}]},
  {id:2078,k:'牡蠣',m:'oyster',on:'カキ',ku:'',lv:'N1',st:0,cat:'food',rad:'',mn:'',ex:[{w:'牡蠣',r:'かき',e:'oyster'},{w:'牡蠣フライ',r:'かきフライ',e:'fried oyster'}]},
  {id:2079,k:'薩',m:'Satsuma / Bodhisattva',on:'サツ',ku:'',lv:'N1',st:17,cat:'other',rad:'艸',mn:'Grass + reach = Bodhisattva',ex:[{w:'菩薩',r:'ぼさつ',e:'Bodhisattva'},{w:'薩摩',r:'さつま',e:'Satsuma'}]},
  {id:2080,k:'摩',m:'rub / grind',on:'マ',ku:'',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hemp + hand = rub',ex:[{w:'摩擦',r:'まさつ',e:'friction'},{w:'按摩',r:'あんま',e:'massage'}]},
  {id:2081,k:'磨',m:'polish / grind',on:'マ',ku:'みが-',lv:'N1',st:16,cat:'action',rad:'石',mn:'Stone + hemp = polish',ex:[{w:'磨く',r:'みがく',e:'to polish'},{w:'研磨',r:'けんま',e:'polishing'}]},
  {id:2082,k:'麻',m:'hemp / numb',on:'マ',ku:'あさ',lv:'N1',st:11,cat:'nature',rad:'广',mn:'Shelter + plant = hemp',ex:[{w:'麻',r:'あさ',e:'hemp'},{w:'麻痺',r:'まひ',e:'paralysis'}]},
  {id:2083,k:'痲',m:'numb / hemp',on:'マ',ku:'',lv:'N1',st:13,cat:'health',rad:'疒',mn:'Sickbed + hemp = numb',ex:[{w:'痲痺',r:'まひ',e:'paralysis'},{w:'痲酔',r:'ますい',e:'anesthesia'}]},
  {id:2084,k:'俣',m:'fork / junction',on:'サ',ku:'また',lv:'N1',st:9,cat:'place',rad:'人',mn:'Person + fork = fork',ex:[{w:'俣',r:'また',e:'fork in road'},{w:'水俣',r:'みなまた',e:'Minamata'}]},
  {id:2085,k:'坂',m:'slope / hill',on:'ハン',ku:'さか',lv:'N1',st:7,cat:'place',rad:'土',mn:'Earth + anti = slope',ex:[{w:'坂',r:'さか',e:'slope'},{w:'坂道',r:'さかみち',e:'sloping road'}]},
  {id:2086,k:'峡',m:'gorge / strait',on:'キョウ',ku:'',lv:'N1',st:9,cat:'place',rad:'山',mn:'Mountain + narrow = gorge',ex:[{w:'峡谷',r:'きょうこく',e:'gorge'},{w:'海峡',r:'かいきょう',e:'strait'}]},
  {id:2087,k:'棚',m:'shelf / rack',on:'ホウ',ku:'たな',lv:'N1',st:12,cat:'other',rad:'木',mn:'Wood + friend = shelf',ex:[{w:'棚',r:'たな',e:'shelf'},{w:'大陸棚',r:'たいりくだな',e:'continental shelf'}]},
  {id:2088,k:'廊',m:'corridor / hall',on:'ロウ',ku:'',lv:'N1',st:12,cat:'place',rad:'广',mn:'Shelter + main = corridor',ex:[{w:'廊下',r:'ろうか',e:'corridor'},{w:'画廊',r:'がろう',e:'art gallery'}]},
  {id:2089,k:'塀',m:'fence / wall',on:'ヘイ',ku:'',lv:'N1',st:12,cat:'other',rad:'土',mn:'Earth + flat = fence',ex:[{w:'塀',r:'へい',e:'fence'},{w:'板塀',r:'いたべい',e:'wooden fence'}]},
  {id:2090,k:'樋',m:'gutter / pipe',on:'コウ',ku:'とい',lv:'N1',st:15,cat:'other',rad:'木',mn:'Wood + pass = gutter',ex:[{w:'樋',r:'とい',e:'gutter'},{w:'雨樋',r:'あまどい',e:'rain gutter'}]},
  {id:2091,k:'梯',m:'ladder / steps',on:'テイ',ku:'はしご',lv:'N1',st:11,cat:'other',rad:'木',mn:'Wood + younger = ladder',ex:[{w:'梯子',r:'はしご',e:'ladder'},{w:'梯子酒',r:'はしござけ',e:'bar hopping'}]},
  {id:2092,k:'縁側',m:'veranda',on:'エンガワ',ku:'',lv:'N1',st:0,cat:'place',rad:'',mn:'',ex:[{w:'縁側',r:'えんがわ',e:'veranda'},{w:'縁側に座る',r:'えんがわにすわる',e:'to sit on the veranda'}]},
  {id:2093,k:'欄干',m:'railing / balustrade',on:'ランカン',ku:'',lv:'N1',st:0,cat:'other',rad:'',mn:'',ex:[{w:'欄干',r:'らんかん',e:'railing'},{w:'橋の欄干',r:'はしのらんかん',e:'bridge railing'}]},
  {id:2094,k:'柵',m:'fence',on:'サク',ku:'さく',lv:'N1',st:9,cat:'other',rad:'木',mn:'Wood + bundle = fence',ex:[{w:'柵',r:'さく',e:'fence'},{w:'鉄柵',r:'てっさく',e:'iron fence'}]},
  {id:2095,k:'撫',m:'stroke / soothe',on:'ブ',ku:'な-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + nothing = stroke',ex:[{w:'撫でる',r:'なでる',e:'to stroke'},{w:'撫子',r:'なでしこ',e:'pink / dianthus'}]},
  {id:2096,k:'擽',m:'tickle',on:'ロウ',ku:'くすぐ-',lv:'N1',st:17,cat:'action',rad:'手',mn:'Hand + strategy = tickle',ex:[{w:'擽る',r:'くすぐる',e:'to tickle'},{w:'擽ったい',r:'くすぐったい',e:'ticklish'}]},
  {id:2097,k:'擦',m:'rub / scrape',on:'サツ',ku:'こす-',lv:'N1',st:17,cat:'action',rad:'手',mn:'Hand + inspect = rub',ex:[{w:'擦る',r:'こする',e:'to rub'},{w:'擦り傷',r:'すりきず',e:'abrasion'}]},
  {id:2098,k:'揉',m:'rub / massage',on:'ジュウ',ku:'も-',lv:'N1',st:12,cat:'action',rad:'手',mn:'Hand + soft = massage',ex:[{w:'揉む',r:'もむ',e:'to massage'},{w:'揉め事',r:'もめごと',e:'trouble'}]},
  {id:2099,k:'捏',m:'knead / fabricate',on:'ネツ',ku:'こね-',lv:'N1',st:10,cat:'action',rad:'手',mn:'Hand + day = knead',ex:[{w:'捏ねる',r:'こねる',e:'to knead'},{w:'捏造',r:'ねつぞう',e:'fabrication'}]},
  {id:2100,k:'掻',m:'scratch',on:'ソウ',ku:'か-',lv:'N1',st:11,cat:'action',rad:'手',mn:'Hand + bone = scratch',ex:[{w:'掻く',r:'かく',e:'to scratch'},{w:'掻き回す',r:'かきまわす',e:'to stir up'}]},
  {id:2101,k:'抉',m:'gouge / pry out',on:'ケツ',ku:'えぐ-',lv:'N1',st:7,cat:'action',rad:'手',mn:'Hand + decide = gouge',ex:[{w:'抉る',r:'えぐる',e:'to gouge'},{w:'抉り出す',r:'えぐりだす',e:'to dig out'}]},
  {id:2102,k:'拗',m:'perverse',on:'ヨウ',ku:'ねじ-',lv:'N1',st:8,cat:'action',rad:'手',mn:'Hand + turn = perverse',ex:[{w:'拗れる',r:'こじれる',e:'to get complicated'},{w:'拗ねる',r:'すねる',e:'to sulk'}]},
  {id:2103,k:'撚',m:'twist / twine',on:'ネン',ku:'よ-',lv:'N1',st:15,cat:'action',rad:'手',mn:'Hand + twirl = twist',ex:[{w:'撚る',r:'よる',e:'to twist'},{w:'撚り糸',r:'よりいと',e:'twisted thread'}]},
  {id:2104,k:'纏',m:'wrap / entangle',on:'テン',ku:'まと-',lv:'N1',st:21,cat:'action',rad:'糸',mn:'Thread + fill = wrap',ex:[{w:'纏める',r:'まとめる',e:'to wrap up'},{w:'纏わる',r:'まつわる',e:'to cling to'}]},
  {id:2105,k:'綾',m:'figured cloth / twill',on:'リョウ',ku:'あや',lv:'N1',st:11,cat:'art',rad:'糸',mn:'Thread + beautiful = twill',ex:[{w:'綾',r:'あや',e:'twill'},{w:'綾取り',r:'あやとり',e:'cat\'s cradle'}]},
  {id:2106,k:'縺',m:'entangle',on:'レン',ku:'もつれ-',lv:'N1',st:17,cat:'action',rad:'糸',mn:'Thread + connect = entangle',ex:[{w:'縺れる',r:'もつれる',e:'to get entangled'},{w:'縺れ',r:'もつれ',e:'tangle'}]},
  {id:2107,k:'靡',m:'sway / yield',on:'ビ',ku:'なび-',lv:'N1',st:11,cat:'action',rad:'非',mn:'Not + wind = sway',ex:[{w:'靡く',r:'なびく',e:'to sway'},{w:'風靡',r:'ふうび',e:'sweeping the world'}]},
  {id:2108,k:'靱',m:'tough / flexible',on:'ジン',ku:'',lv:'N1',st:13,cat:'description',rad:'革',mn:'Leather + blade = tough',ex:[{w:'靱帯',r:'じんたい',e:'ligament'},{w:'靱やか',r:'しなやか',e:'supple'}]},
  {id:2109,k:'瞑',m:'close eyes / meditate',on:'メイ',ku:'つむ-',lv:'N1',st:15,cat:'action',rad:'目',mn:'Eye + dark = close eyes',ex:[{w:'瞑る',r:'つむる',e:'to close eyes'},{w:'瞑想',r:'めいそう',e:'meditation'}]},
  {id:2110,k:'睨',m:'glare / stare',on:'ゲイ',ku:'にら-',lv:'N1',st:13,cat:'action',rad:'目',mn:'Eye + sound = glare',ex:[{w:'睨む',r:'にらむ',e:'to glare'},{w:'睨み合う',r:'にらみあう',e:'to glare at each other'}]},
  {id:2111,k:'覗',m:'peep / look into',on:'シ',ku:'のぞ-',lv:'N1',st:11,cat:'action',rad:'見',mn:'See + department = peek',ex:[{w:'覗く',r:'のぞく',e:'to peek'},{w:'覗き見',r:'のぞきみ',e:'peeping'}]},
  {id:2112,k:'瞥',m:'glance / glimpse',on:'ベツ',ku:'',lv:'N1',st:17,cat:'action',rad:'目',mn:'Eye + separate = glance',ex:[{w:'瞥見',r:'べっけん',e:'glance'},{w:'一瞥',r:'いちべつ',e:'one glance'}]},
  {id:2113,k:'矚',m:'gaze / look at',on:'ショク',ku:'',lv:'N1',st:22,cat:'action',rad:'目',mn:'Eye + gaze = gaze',ex:[{w:'注矚',r:'ちゅうしょく',e:'close attention'},{w:'矚目',r:'しょくもく',e:'to watch closely'}]},
  {id:2114,k:'傅',m:'tutor / attendant',on:'フ',ku:'',lv:'N1',st:12,cat:'person',rad:'人',mn:'Person + spread = tutor',ex:[{w:'傅く',r:'かしずく',e:'to serve'},{w:'傅育',r:'ふいく',e:'tutoring'}]},
  {id:2115,k:'倦',m:'tired / weary',on:'ケン',ku:'う-',lv:'N1',st:10,cat:'feeling',rad:'人',mn:'Person + roll = weary',ex:[{w:'倦む',r:'うむ',e:'to weary of'},{w:'倦怠',r:'けんたい',e:'fatigue'}]},
  {id:2116,k:'憊',m:'exhausted',on:'ハイ',ku:'つか-',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + double = exhausted',ex:[{w:'疲憊',r:'ひはい',e:'exhaustion'},{w:'憊れる',r:'つかれる',e:'to be exhausted'}]},
  {id:2117,k:'懊',m:'anguished / worried',on:'オウ',ku:'',lv:'N1',st:16,cat:'feeling',rad:'心',mn:'Heart + match = anguished',ex:[{w:'懊悩',r:'おうのう',e:'anguish'},{w:'懊しい',r:'おそろしい',e:'dreadful'}]},
  {id:2118,k:'悶',m:'anguish / writhe',on:'モン',ku:'もだ-',lv:'N1',st:12,cat:'feeling',rad:'心',mn:'Heart + gate = anguish',ex:[{w:'悶える',r:'もだえる',e:'to writhe'},{w:'苦悶',r:'くもん',e:'agony'}]},
  {id:2119,k:'惘',m:'disappointed / dazed',on:'ボウ',ku:'',lv:'N1',st:11,cat:'feeling',rad:'心',mn:'Heart + lost = dazed',ex:[{w:'惘然',r:'ぼうぜん',e:'dazed'},{w:'茫惘',r:'ぼうぼう',e:'blank'}]},
  {id:2120,k:'茫',m:'vast / vague',on:'ボウ',ku:'',lv:'N1',st:9,cat:'description',rad:'水',mn:'Water + grass = vast',ex:[{w:'茫然',r:'ぼうぜん',e:'absent-minded'},{w:'茫漠',r:'ぼうばく',e:'vast and vague'}]},
  {id:2121,k:'漫',m:'random / comic',on:'マン',ku:'',lv:'N1',st:14,cat:'art',rad:'水',mn:'Water + long = random',ex:[{w:'漫画',r:'まんが',e:'manga'},{w:'漫然',r:'まんぜん',e:'vague / aimless'}]},
  {id:2122,k:'漠',m:'vague / desert',on:'バク',ku:'',lv:'N1',st:13,cat:'description',rad:'水',mn:'Water + desert = vague',ex:[{w:'漠然',r:'ばくぜん',e:'vague'},{w:'砂漠',r:'さばく',e:'desert'}]},
  {id:2123,k:'惚',m:'senile / in love',on:'コツ',ku:'ほ-',lv:'N1',st:11,cat:'feeling',rad:'心',mn:'Heart + nothing = infatuated',ex:[{w:'惚れる',r:'ほれる',e:'to fall for'},{w:'惚け',r:'ぼけ',e:'senility'}]},
  {id:2124,k:'呆',m:'stupefied',on:'ボウ',ku:'あっけ-',lv:'N1',st:7,cat:'feeling',rad:'口',mn:'Mouth + tree = stupefied',ex:[{w:'呆れる',r:'あきれる',e:'to be amazed'},{w:'呆然',r:'ぼうぜん',e:'stunned'}]},
  {id:2125,k:'昧',m:'dark / ignorant',on:'マイ',ku:'',lv:'N1',st:9,cat:'description',rad:'日',mn:'Sun + not yet = dark',ex:[{w:'愚昧',r:'ぐまい',e:'ignorant'},{w:'三昧',r:'ざんまい',e:'absorbed in'}]},
  {id:2126,k:'冥',m:'dark / underworld',on:'メイ',ku:'',lv:'N1',st:10,cat:'other',rad:'冖',mn:'Cover + small = dark',ex:[{w:'冥土',r:'めいど',e:'underworld'},{w:'冥福',r:'めいふく',e:'eternal bliss'}]},
  {id:2127,k:'玄',m:'dark / mysterious',on:'ゲン',ku:'',lv:'N1',st:5,cat:'description',rad:'玄',mn:'Twisted thread = dark',ex:[{w:'玄関',r:'げんかん',e:'entrance'},{w:'玄米',r:'げんまい',e:'brown rice'}]},
  {id:2128,k:'窈',m:'deep / secluded',on:'ヨウ',ku:'',lv:'N1',st:11,cat:'description',rad:'穴',mn:'Hole + small = secluded',ex:[{w:'窈窕',r:'ようちょう',e:'graceful'},{w:'幽窈',r:'ゆうよう',e:'deep and quiet'}]},
  {id:2129,k:'窕',m:'graceful / slender',on:'チョウ',ku:'',lv:'N1',st:11,cat:'description',rad:'穴',mn:'Hole + long = graceful',ex:[{w:'窈窕',r:'ようちょう',e:'graceful and elegant'},{w:'窕たる',r:'ちょうたる',e:'graceful'}]},
  {id:2130,k:'澹',m:'calm / indifferent',on:'タン',ku:'',lv:'N1',st:15,cat:'description',rad:'水',mn:'Water + dawn = calm',ex:[{w:'澹々',r:'たんたん',e:'calm'},{w:'淡澹',r:'たんたん',e:'light and calm'}]},
  {id:2131,k:'淡',m:'light / faint',on:'タン',ku:'あわ-',lv:'N1',st:11,cat:'description',rad:'水',mn:'Water + flame = light',ex:[{w:'淡い',r:'あわい',e:'light'},{w:'淡水',r:'たんすい',e:'fresh water'}]},
  {id:2132,k:'渺',m:'vast / far away',on:'ビョウ',ku:'',lv:'N1',st:12,cat:'description',rad:'水',mn:'Water + few = vast',ex:[{w:'渺々',r:'びょうびょう',e:'vast'},{w:'渺茫',r:'びょうぼう',e:'boundless'}]},
  {id:2133,k:'溟',m:'dark sea / deep',on:'メイ',ku:'',lv:'N1',st:13,cat:'nature',rad:'水',mn:'Water + dark = dark sea',ex:[{w:'溟界',r:'めいかい',e:'the deep'},{w:'幽溟',r:'ゆうめい',e:'dark sea'}]},
  {id:2134,k:'泡沫',m:'bubble / ephemeral',on:'ホウマツ',ku:'',lv:'N1',st:0,cat:'other',rad:'',mn:'',ex:[{w:'泡沫',r:'ほうまつ',e:'bubble'},{w:'泡沫候補',r:'ほうまつこうほ',e:'fringe candidate'}]},
  {id:2135,k:'夥',m:'numerous / many',on:'カ',ku:'おびただ-',lv:'N1',st:12,cat:'description',rad:'夕',mn:'Evening + add = numerous',ex:[{w:'夥しい',r:'おびただしい',e:'numerous'},{w:'夥多',r:'かた',e:'numerous'}]}
];

/* ═══════════════════════════════════════════════════════════════════════════
   THEME SYSTEM — 6 themes, sky-blue default
═══════════════════════════════════════════════════════════════════════════ */
const THEMES = {

  /* 1 ── SKY BLUE (default) ─────────────────────────────────────────── */
  sky: {
    name:'Sky Blue', emoji:'☀️',
    preview:['#38BDF8','#6366F1','#A855F7','#EFF6FF'],
    dark: false,
    bg: {
      base:'linear-gradient(165deg,#EFF6FF 0%,#E0F2FE 25%,#EEF2FF 55%,#F0F9FF 80%,#DBEAFE 100%)',
      fog:['rgba(56,189,248,0.14)','rgba(99,102,241,0.10)','rgba(168,85,247,0.08)'],
      orbs:['rgba(56,189,248,0.22)','rgba(99,102,241,0.18)','rgba(168,85,247,0.14)','rgba(125,211,252,0.20)'],
      mtn1:'#93C5FD', mtn2:'#BFDBFE', mtn3:'#DBEAFE', ridge:'#6366F1',
      stars:['#A855F7','#38BDF8','#6366F1','#93C5FD'],
    },
    C: {
  /* Backgrounds — soft light, NOT dark */
  void:    '#EFF6FF', abyss:  '#EEF2FF', deep:   '#E0E7FF',
  cosmos:  '#F0F9FF', ocean:  '#E0F2FE', navy:   '#BAE6FD',
  slate:   '#DBEAFE', card:   '#FFFFFF',
  lifted:  '#F0F9FF', hover:  '#E0F2FE', border: '#BAE6FD',
  borderL: '#93C5FD', glass:  '#FFFFFFCC',
  /* Sky blues */
  jade:    '#0EA5E9', jadeD:  '#0369A1', jadeL:  '#7DD3FC', jadeDim:'#E0F2FE',
  teal:    '#38BDF8', tealD:  '#0284C7', tealL:  '#BAE6FD',
  /* Indigo */
  aurora:  '#6366F1', auroraD:'#4338CA', auroraL:'#A5B4FC', auroraDim:'#E0E7FF',
  violet:  '#818CF8', violetD:'#4F46E5',
  /* Purple-indigo */
  sakura:  '#A855F7', sakuraD:'#7E22CE', sakuraL:'#D8B4FE',
  amber:   '#F59E0B', amberD: '#B45309', amberL: '#FCD34D',
  crimson: '#EF4444', crimsonD:'#B91C1C',
  moss:    '#C084FC', gold:   '#38BDF8', sapphire:'#6366F1',
  /* Text — deep navy for readability */
  moonlight:'#1E3A5F', starlight:'#1D4ED8', nebula:'#6366F1', dim:'#A5B4FC',
  /* Semantic */
  success: '#0EA5E9', warning: '#F59E0B', error: '#EF4444', info: '#6366F1',
  },

  STATUS: {
    new:   {color:'#38BDF8', glow:'#0284C7',  dim:'#E0F2FE', label:'New',    icon:'✦', emoji:'🌱'},
    hard:  {color:'#EF4444', glow:'#B91C1C',  dim:'#FEE2E2', label:'Hard',   icon:'✗', emoji:'🔥'},
    ok:    {color:'#A855F7', glow:'#7E22CE',  dim:'#F3E8FF', label:'Review', icon:'≈', emoji:'⚡'},
    known: {color:'#6366F1', glow:'#4338CA',  dim:'#E0E7FF', label:'Known',  icon:'✓', emoji:'⭐'},
  },
},

/* 2 ── MIDNIGHT OCEAN (twilight) ─────────────────────────────────────── */
midnight: {
  name:'Midnight Ocean', emoji:'🌊',
  preview:['#2e285d','#598ad2','#aa6fa8','#0d1b2e'],
  dark: true,
  bg: {
    base:'linear-gradient(165deg,#09100A 0%,#0b1020 20%,#0d1428 45%,#0d1830 70%,#101828 100%)',
    fog:['rgba(170,111,168,0.10)','rgba(89,138,210,0.08)','rgba(138,175,212,0.06)'],
    orbs:['rgba(170,111,168,0.14)','rgba(89,138,210,0.12)','rgba(46,40,93,0.18)','rgba(138,175,212,0.10)'],
    mtn1:'#1a2848', mtn2:'#131d38', mtn3:'#0d1424', ridge:'#598ad2',
    stars:['#c899c8','#8aafd4','#dde8f0','#b8d4ea'],
  },
  C: {
    void:'#090D18',abyss:'#0B1020',deep:'#0D1424',cosmos:'#101828',ocean:'#131D30',
    navy:'#172238',slate:'#1C2A44',card:'#1E2E4A',lifted:'#243550',hover:'#2A3D5E',
    border:'#2E4568',borderL:'#3A5580',glass:'#1A2640EE',
    jade:'#8aafd4',jadeD:'#4a7eb5',jadeL:'#b8d4ea',jadeDim:'#1e3a5f',
    teal:'#598ad2',tealD:'#2e285d',tealL:'#8aafd4',
    aurora:'#aa6fa8',auroraD:'#6b3868',auroraL:'#c899c8',auroraDim:'#3a1f48',
    violet:'#7c6ab8',violetD:'#3d3470',sakura:'#c490b8',sakuraD:'#7a4870',sakuraL:'#e0b8d8',
    amber:'#d4af37',amberD:'#7a6010',amberL:'#f0cc5a',crimson:'#c05870',crimsonD:'#782040',
    moss:'#4a7eb5',gold:'#8aafd4',sapphire:'#598ad2',
    moonlight:'#dde8f0',starlight:'#8aafd4',nebula:'#4a6080',dim:'#2a3850',
    success:'#8aafd4',warning:'#d4af37',error:'#c05870',info:'#598ad2',
  },
  STATUS: {
    new:  {color:'#598ad2',glow:'#2e285d',dim:'#161030', label:'New',   icon:'✦',emoji:'🌱'},
    hard: {color:'#c05870',glow:'#782040',dim:'#301020', label:'Hard',  icon:'✗',emoji:'🔥'},
    ok:   {color:'#aa6fa8',glow:'#6b3868',dim:'#301830', label:'Review',icon:'≈',emoji:'⚡'},
    known:{color:'#8aafd4',glow:'#4a7eb5',dim:'#1e3050', label:'Known', icon:'✓',emoji:'⭐'},
  },
},

/* 3 ── OLD MONEY (forest gold) ──────────────────────────────────────── */
oldmoney: {
  name:'Old Money', emoji:'🏛️',
  preview:['#C9A84C','#8FAF72','#122E24','#F4ECD8'],
  dark: true,
  bg: {
    base:'linear-gradient(165deg,#06100C 0%,#04090A 20%,#030807 45%,#050A05 70%,#030606 100%)',
    fog:['rgba(201,168,76,0.10)','rgba(143,175,114,0.07)','rgba(201,168,76,0.06)'],
    orbs:['rgba(201,168,76,0.12)','rgba(143,175,114,0.09)','rgba(201,168,76,0.08)','rgba(90,128,80,0.08)'],
    mtn1:'#0E1F0C', mtn2:'#091508', mtn3:'#060F05', ridge:'#C9A84C',
    stars:['#C9A84C','#8FAF72','#E8C96A','#D4BC8C'],
  },
  C: {
    void:'#03070A',abyss:'#050D0A',deep:'#060F0C',cosmos:'#081410',ocean:'#0A1A14',
    navy:'#0C1F18',slate:'#0F2820',card:'#122E24',lifted:'#163620',hover:'#1C422A',
    border:'#234D32',borderL:'#2E6040',glass:'#0F2820EE',
    jade:'#C9A84C',jadeD:'#7A6020',jadeL:'#E8C96A',jadeDim:'#3D3010',
    teal:'#8FAF72',tealD:'#4A6038',tealL:'#AECF8E',
    aurora:'#B8A070',auroraD:'#6B5A30',auroraL:'#D4BC8C',auroraDim:'#3A3018',
    violet:'#A07850',violetD:'#5A3E28',sakura:'#C4956A',sakuraD:'#7A4E30',sakuraL:'#DEB898',
    amber:'#D4AF37',amberD:'#7A6010',amberL:'#F0CC5A',crimson:'#B85450',crimsonD:'#6B2820',
    moss:'#5A8050',gold:'#C9A84C',sapphire:'#7A9870',
    moonlight:'#F4ECD8',starlight:'#C8B48C',nebula:'#8A7A5A',dim:'#4A3E2A',
    success:'#C9A84C',warning:'#D4AF37',error:'#B85450',info:'#8FAF72',
  },
  STATUS: {
    new:  {color:'#C9A84C',glow:'#7A6020',dim:'#3D3010', label:'New',   icon:'✦',emoji:'🌱'},
    hard: {color:'#B85450',glow:'#6B2820',dim:'#3B1A18', label:'Hard',  icon:'✗',emoji:'🔥'},
    ok:   {color:'#8FAF72',glow:'#4A6038',dim:'#1E3010', label:'Review',icon:'≈',emoji:'⚡'},
    known:{color:'#E8C96A',glow:'#C9A84C',dim:'#3D3010', label:'Known', icon:'✓',emoji:'⭐'},
  },
},

/* 4 ── DEEP SPACE (original celestial) ─────────────────────────────── */
space: {
  name:'Deep Space', emoji:'🌌',
  preview:['#A78BFA','#00F5A0','#00D4F5','#010208'],
  dark: true,
  bg: {
    base:'linear-gradient(165deg,#010208 0%,#020510 20%,#030714 45%,#050B1A 70%,#060D1F 100%)',
    fog:['rgba(167,139,250,0.14)','rgba(0,212,245,0.10)','rgba(0,245,160,0.08)'],
    orbs:['rgba(167,139,250,0.18)','rgba(0,212,245,0.15)','rgba(0,245,160,0.12)','rgba(255,126,179,0.10)'],
    mtn1:'#0D1630', mtn2:'#080F24', mtn3:'#050B1A', ridge:'#A78BFA',
    stars:['#A78BFA','#00F5A0','#00D4F5','#E8F0FF'],
  },
  C: {
    void:'#010208',abyss:'#02040F',deep:'#030714',cosmos:'#050B1A',ocean:'#060D1F',
    navy:'#080F24',slate:'#0A1228',card:'#0D1630',lifted:'#111E3A',hover:'#162545',
    border:'#1A2E4A',borderL:'#243A5E',glass:'#0E1B35DD',
    jade:'#00F5A0',jadeD:'#00704A',jadeL:'#7AFFD8',jadeDim:'#003D2A',
    teal:'#00D4F5',tealD:'#005A6B',tealL:'#60E8FF',
    aurora:'#A78BFA',auroraD:'#4C3A8A',auroraL:'#C4B5FD',auroraDim:'#2A1F50',
    violet:'#818CF8',violetD:'#3730A3',sakura:'#FF7EB3',sakuraD:'#7A2A55',sakuraL:'#FFB3D3',
    amber:'#FFD047',amberD:'#7A5A00',amberL:'#FFE585',crimson:'#FF4B6E',crimsonD:'#6B1228',
    moss:'#7AE14A',gold:'#FFD700',sapphire:'#4FC3F7',
    moonlight:'#E8F0FF',starlight:'#8BA4CC',nebula:'#4A5E80',dim:'#2A3650',
    success:'#00F5A0',warning:'#FFD047',error:'#FF4B6E',info:'#00D4F5',
  },
  STATUS: {
    new:  {color:'#A78BFA',glow:'#4C3A8A',dim:'#2A1F50', label:'New',   icon:'✦',emoji:'🌱'},
    hard: {color:'#FF4B6E',glow:'#6B1228',dim:'#3B0A14', label:'Hard',  icon:'✗',emoji:'🔥'},
    ok:   {color:'#FFD047',glow:'#7A5A00',dim:'#3D2C00', label:'Review',icon:'≈',emoji:'⚡'},
    known:{color:'#00F5A0',glow:'#00704A',dim:'#003D2A', label:'Known', icon:'✓',emoji:'⭐'},
  },
},

/* 5 ── SAKURA (warm pink) ────────────────────────────────────────────── */
sakura: {
  name:'Sakura', emoji:'🌸',
  preview:['#F9A8D4','#EC4899','#FDF2F8','#831843'],
  dark: false,
  bg: {
    base:'linear-gradient(165deg,#FFF0F6 0%,#FDF2F8 25%,#FCE7F3 55%,#FDF4FF 80%,#FAE8FF 100%)',
    fog:['rgba(249,168,212,0.18)','rgba(192,132,252,0.12)','rgba(236,72,153,0.10)'],
    orbs:['rgba(249,168,212,0.25)','rgba(168,85,247,0.18)','rgba(236,72,153,0.15)','rgba(253,186,234,0.22)'],
    mtn1:'#F5D0FE', mtn2:'#F0ABFC', mtn3:'#E879F9', ridge:'#EC4899',
    stars:['#EC4899','#A855F7','#F9A8D4','#E879F9'],
  },
  C: {
    void:'#FFF0F6',abyss:'#FDF2F8',deep:'#FCE7F3',cosmos:'#FDF4FF',ocean:'#FAE8FF',
    navy:'#F5D0FE',slate:'#F0ABFC',card:'#FFFFFF',lifted:'#FFF0F6',hover:'#FCE7F3',
    border:'#F9A8D4',borderL:'#F472B6',glass:'#FFFFFFCC',
    jade:'#EC4899',jadeD:'#9D174D',jadeL:'#FBCFE8',jadeDim:'#FCE7F3',
    teal:'#F472B6',tealD:'#BE185D',tealL:'#FBCFE8',
    aurora:'#A855F7',auroraD:'#6B21A8',auroraL:'#D8B4FE',auroraDim:'#F3E8FF',
    violet:'#C084FC',violetD:'#7E22CE',sakura:'#F9A8D4',sakuraD:'#EC4899',sakuraL:'#FDF2F8',
    amber:'#FB923C',amberD:'#C2410C',amberL:'#FED7AA',crimson:'#EF4444',crimsonD:'#B91C1C',
    moss:'#E879F9',gold:'#F472B6',sapphire:'#C084FC',
    moonlight:'#831843',starlight:'#9D174D',nebula:'#BE185D',dim:'#F9A8D4',
    success:'#EC4899',warning:'#FB923C',error:'#EF4444',info:'#A855F7',
  },
  STATUS: {
    new:  {color:'#F472B6',glow:'#BE185D',dim:'#FCE7F3', label:'New',   icon:'✦',emoji:'🌱'},
    hard: {color:'#EF4444',glow:'#B91C1C',dim:'#FEE2E2', label:'Hard',  icon:'✗',emoji:'🔥'},
    ok:   {color:'#A855F7',glow:'#6B21A8',dim:'#F3E8FF', label:'Review',icon:'≈',emoji:'⚡'},
    known:{color:'#EC4899',glow:'#9D174D',dim:'#FCE7F3', label:'Known', icon:'✓',emoji:'⭐'},
  },
},

/* 6 ── EMBER (warm dark amber) ──────────────────────────────────────── */
ember: {
  name:'Ember', emoji:'🔥',
  preview:['#F59E0B','#EF4444','#DC2626','#1C0A00'],
  dark: true,
  bg: {
    base:'linear-gradient(165deg,#0C0500 0%,#120800 20%,#180B00 45%,#1F0E02 70%,#271204 100%)',
    fog:['rgba(245,158,11,0.14)','rgba(251,146,60,0.10)','rgba(239,68,68,0.08)'],
    orbs:['rgba(245,158,11,0.18)','rgba(239,68,68,0.15)','rgba(251,146,60,0.12)','rgba(252,211,77,0.14)'],
    mtn1:'#3A1C08', mtn2:'#2E1605', mtn3:'#1F0E02', ridge:'#F59E0B',
    stars:['#F59E0B','#EF4444','#FBBF24','#FEF3C7'],
  },
  C: {
    void:'#0C0500',abyss:'#120800',deep:'#180B00',cosmos:'#1F0E02',ocean:'#271204',
    navy:'#2E1605',slate:'#3A1C08',card:'#44220A',lifted:'#52280C',hover:'#61300F',
    border:'#7A3D12',borderL:'#9A4E18',glass:'#2A1505EE',
    jade:'#F59E0B',jadeD:'#B45309',jadeL:'#FCD34D',jadeDim:'#451A03',
    teal:'#FB923C',tealD:'#C2410C',tealL:'#FDBA74',
    aurora:'#EF4444',auroraD:'#B91C1C',auroraL:'#FCA5A5',auroraDim:'#450A0A',
    violet:'#F97316',violetD:'#C2410C',sakura:'#FBBF24',sakuraD:'#D97706',sakuraL:'#FDE68A',
    amber:'#F59E0B',amberD:'#B45309',amberL:'#FCD34D',crimson:'#EF4444',crimsonD:'#B91C1C',
    moss:'#FB923C',gold:'#F59E0B',sapphire:'#FBBF24',
    moonlight:'#FEF3C7',starlight:'#FCD34D',nebula:'#F59E0B',dim:'#7A3D12',
    success:'#F59E0B',warning:'#FBBF24',error:'#EF4444',info:'#FB923C',
  },
  STATUS: {
    new:  {color:'#F59E0B',glow:'#B45309',dim:'#451A03', label:'New',   icon:'✦',emoji:'🌱'},
    hard: {color:'#EF4444',glow:'#B91C1C',dim:'#450A0A', label:'Hard',  icon:'✗',emoji:'🔥'},
    ok:   {color:'#FB923C',glow:'#C2410C',dim:'#431407', label:'Review',icon:'≈',emoji:'⚡'},
    known:{color:'#FCD34D',glow:'#F59E0B',dim:'#451A03', label:'Known', icon:'✓',emoji:'⭐'},
  },
},

};

// ── Active theme state (starts as sky, default) ──
let _activeTheme = 'sky';
const C = { ...THEMES.sky.C };
const STATUS = { ...THEMES.sky.STATUS };

function applyTheme(key) {
  const t = THEMES[key];
  if(!t) return;
  _activeTheme = key;
  Object.assign(C, t.C);
  Object.assign(STATUS, t.STATUS);
}



/* ═══════════════════════════════════════════════════════════════════════════
   BREAKPOINT HOOK — Phone / Tablet / Large
═══════════════════════════════════════════════════════════════════════════ */
function useBreakpoint() {
  const [w, setW] = useState(() => typeof window!=='undefined'?window.innerWidth:390);
  const [h, setH] = useState(() => typeof window!=='undefined'?window.innerHeight:844);
  useEffect(() => {
    const fn = () => { setW(window.innerWidth); setH(window.innerHeight); };
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return { isPhone:w<520, isTablet:w>=520, isLarge:w>=880, isMed:w>=520&&w<880, w, h };
}

/* ═══════════════════════════════════════════════════════════════════════════
   APP CONTEXT — shared toast + achievements
═══════════════════════════════════════════════════════════════════════════ */
const AppCtx = createContext({});

/* ═══════════════════════════════════════════════════════════════════════════
   DETERMINISTIC PARTICLES
═══════════════════════════════════════════════════════════════════════════ */
// Old Money particles — motes of dust, embers, stars
const STARS = Array.from({length:55},(_,i)=>({
  cx:((i*137.508)%100), cy:((i*97.333)%100),
  r: i%8===0?1.4:i%4===0?0.9:0.45,
  o: 0.08+((i*0.0618)%0.4), tw:4+(i%8),
  col: i%5===0?'#C9A84C':i%3===0?'#7BB8D4':'#D4BC8C',
}));
const SHOOTING = Array.from({length:2},(_,i)=>({
  x:20+i*35, y:5+i*8, dur:4+i*2, delay:i*9+5, len:70+i*20,
}));
const EMBERS = Array.from({length:12},(_,i)=>({
  left:5+i*8, bot:8+i%5*7, dur:4+i*0.6, delay:i*0.7,
  sz:2+i%3, col:i%3===0?C.sakura:i%3===1?C.teal:C.aurora,
}));
const DUST = Array.from({length:18},(_,i)=>({
  left:((i*5.5)%95)+2, top:((i*7.3)%80)+5,
  sz:1+i%2, dur:8+i%6*3, delay:i*0.8,
  op:0.06+i%4*0.03,
}));
const FLOAT_KANJI = Array.from({length:5},(_,i)=>({
  k:['漢','字','心','道','空'][i],
  left:8+i*19, sz:20+i%3*10, dur:26+i*5, delay:i*4.5,
  op:0.025+i%3*0.008,
}));
const SAKURA = Array.from({length:6},(_,i)=>({
  left:((i*14.5)%88)+4, delay:i*2, dur:14+i%4*3, sz:4+i%3, rot:i*30,
}));

/* ═══════════════════════════════════════════════════════════════════════════
   GLOBAL STYLES + KEYFRAMES
═══════════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Zen+Old+Mincho:wght@400;500;600;700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap');
  *, *::before, *::after { box-sizing:border-box; -webkit-tap-highlight-color:transparent; }
  body { margin:0; overflow:hidden; background:${C.void}; font-family:'Cormorant Garamond','Noto Sans JP',serif; -webkit-font-smoothing:antialiased; }
  ::-webkit-scrollbar { width:3px; height:3px; }
  [data-card-back]::-webkit-scrollbar { display:none; }
  ::-webkit-scrollbar-track { background:transparent; }
  ::-webkit-scrollbar-thumb { background:rgba(201,168,76,0.3); border-radius:3px; }
  input::placeholder { color:${C.nebula}; }
  button:active { transform:scale(0.96); }
  /* ── Old Money keyframes ── */
  @keyframes candleFlicker { 0%,100%{opacity:0.85;transform:scaleY(1) translateX(0)} 25%{opacity:0.7;transform:scaleY(0.96) translateX(1px)} 50%{opacity:0.9;transform:scaleY(1.02) translateX(-1px)} 75%{opacity:0.75;transform:scaleY(0.98) translateX(0.5px)} }
  @keyframes emberRise { 0%{transform:translateY(0) translateX(0) scale(1);opacity:0} 15%{opacity:1} 60%{transform:translateY(-60px) translateX(8px) scale(0.8);opacity:0.8} 100%{transform:translateY(-140px) translateX(-5px) scale(0.2);opacity:0} }
  @keyframes dustDrift { 0%{transform:translate(0,0);opacity:0} 20%{opacity:var(--op)} 80%{opacity:calc(var(--op)*0.6)} 100%{transform:translate(var(--dx),var(--dy));opacity:0} }
  @keyframes goldShimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes parchmentBreath { 0%,100%{opacity:0.92} 50%{opacity:1} }
  @keyframes inkDrop { 0%{transform:scale(0);opacity:0.6} 100%{transform:scale(3.5);opacity:0} }
  @keyframes quillWrite { 0%{stroke-dashoffset:1000} 100%{stroke-dashoffset:0} }
  @keyframes sealGlow { 0%,100%{box-shadow:0 0 8px rgba(201,168,76,0.3),0 0 20px rgba(201,168,76,0.1)} 50%{box-shadow:0 0 20px rgba(201,168,76,0.6),0 0 50px rgba(201,168,76,0.25),0 0 80px rgba(201,168,76,0.1)} }
  @keyframes patinaPulse { 0%,100%{filter:brightness(1) saturate(1)} 50%{filter:brightness(1.06) saturate(1.1)} }
  @keyframes fogDrift { 0%{transform:translateX(0) scaleY(1);opacity:0.4} 50%{transform:translateX(-3%) scaleY(1.08);opacity:0.6} 100%{transform:translateX(0) scaleY(1);opacity:0.4} }
  @keyframes leafFall { 0%{transform:translateY(-20px) rotate(0deg) translateX(0);opacity:0} 8%{opacity:0.7} 92%{opacity:0.5} 100%{transform:translateY(105vh) rotate(480deg) translateX(30px);opacity:0} }
  @keyframes energyPulse { 0%,100%{opacity:0.25;transform:scaleX(1)} 50%{opacity:0.7;transform:scaleX(1.02)} }
  @keyframes depthPulse { 0%,100%{box-shadow:0 0 30px rgba(201,168,76,0.1)} 50%{box-shadow:0 0 60px rgba(201,168,76,0.25),0 0 100px rgba(201,168,76,0.08)} }
  @keyframes glitchX { 0%,100%{transform:translateX(0)} }

  @keyframes aFloat { 0%,100%{transform:translateY(0) translateX(0) scale(1);opacity:0.9} 33%{transform:translateY(-22px) translateX(16px) scale(1.1);opacity:0.7} 66%{transform:translateY(10px) translateX(-12px) scale(0.93);opacity:1} }
  @keyframes twinkle { 0%,100%{opacity:0.15} 50%{opacity:0.9} }
  @keyframes shoot { 0%{transform:translateX(0) translateY(0);opacity:0} 5%{opacity:1} 100%{transform:translateX(-300px) translateY(150px);opacity:0} }
  @keyframes petalFall { 0%{transform:translateY(-30px) rotate(0deg) translateX(0);opacity:0} 8%{opacity:0.7} 92%{opacity:0.5} 100%{transform:translateY(105vh) rotate(600deg) translateX(40px);opacity:0} }
  @keyframes fireflyDance { 0%,100%{opacity:0;transform:translate(0,0)} 20%{opacity:1} 50%{opacity:0.4;transform:translate(15px,-20px)} 80%{opacity:0.9;transform:translate(-8px,-10px)} }
  @keyframes floatKanji { 0%,100%{transform:translateY(0) rotate(0deg);opacity:var(--op)} 50%{transform:translateY(-35px) rotate(3deg);opacity:calc(var(--op)*0.4)} }
  @keyframes rain { 0%{transform:translateY(-20px);opacity:0} 10%{opacity:0.8} 90%{opacity:0.4} 100%{transform:translateY(110vh);opacity:0} }
  @keyframes ripple { 0%{transform:scale(0);opacity:0.8} 100%{transform:scale(4);opacity:0} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes fadeIn { from{opacity:0} to{opacity:1} }
  @keyframes slideInLeft  { from{opacity:0;transform:translateX(-30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideInRight { from{opacity:0;transform:translateX(30px)} to{opacity:1;transform:translateX(0)} }
  @keyframes slideInUp    { from{opacity:0;transform:translateY(40px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pop    { 0%{transform:scale(0.8);opacity:0} 60%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes popBig { 0%{transform:scale(0.7)} 50%{transform:scale(1.12)} 100%{transform:scale(1)} }
  @keyframes shimmerOpacity { 0%,100%{opacity:0.4} 50%{opacity:1} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(0,245,160,0.5)} 50%{box-shadow:0 0 0 12px rgba(0,245,160,0)} }
  @keyframes glowPulse { 0%,100%{filter:drop-shadow(0 0 4px currentColor)} 50%{filter:drop-shadow(0 0 18px currentColor) drop-shadow(0 0 36px currentColor)} }
  @keyframes confettiDrop { 0%{transform:translateY(-20px) rotate(0deg);opacity:0} 10%{opacity:1} 100%{transform:translateY(100vh) rotate(800deg);opacity:0} }
  @keyframes countUp { from{opacity:0;transform:scale(0.6)} to{opacity:1;transform:scale(1)} }
  @keyframes heartBeat { 0%,100%{transform:scale(1)} 15%{transform:scale(1.15)} 30%{transform:scale(1)} }
  @keyframes borderGlow { 0%,100%{border-color:rgba(0,245,160,0.3)} 50%{border-color:rgba(0,245,160,0.8)} }
  @keyframes waveFlow { 0%{background-position:0 0} 100%{background-position:200px 0} }
  @keyframes spin { from{transform:rotate(0)} to{transform:rotate(360deg)} }
  @keyframes toastIn { from{opacity:0;transform:translateX(100%)} to{opacity:1;transform:translateX(0)} }
  @keyframes toastOut { from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(100%)} }
  @keyframes splashReveal { 0%{opacity:0;transform:scale(0.85) translateY(30px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes splashKanji { 0%{opacity:0;transform:scale(2) rotate(-15deg)} 60%{opacity:1;transform:scale(1) rotate(0deg)} 100%{opacity:1;transform:scale(1) rotate(0deg)} }
  @keyframes typewriter { from{width:0} to{width:100%} }
  @keyframes blinkCursor { 0%,100%{border-right-color:${C.jade}} 50%{border-right-color:transparent} }
  /* Card transitions fully rAF-driven — no CSS animation keyframes needed */
  @keyframes swipeHintLeft { 0%,100%{transform:translateX(0);opacity:0.4} 50%{transform:translateX(-8px);opacity:0.9} }
  @keyframes swipeHintRight { 0%,100%{transform:translateX(0);opacity:0.4} 50%{transform:translateX(8px);opacity:0.9} }
  @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes kanjiShimmer { 0%{left:-120%} 45%{left:120%} 100%{left:120%} }
  @keyframes kanjiPop { 0%{transform:scale(0.4);opacity:0} 70%{transform:scale(1.08);opacity:1} 100%{transform:scale(1);opacity:1} }
  @keyframes levelBadgePop { 0%{transform:scale(0.7);opacity:0} 70%{transform:scale(1.08)} 100%{transform:scale(1);opacity:1} }
  @keyframes progressFill { from{width:0} to{width:var(--w)} }
  @keyframes achieveIn { 0%{transform:translateY(-80px) scale(0.7);opacity:0} 70%{transform:translateY(10px) scale(1.05)} 100%{transform:translateY(0) scale(1);opacity:1} }
  @keyframes orbFloat { 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(30px,-40px) scale(1.15)} 66%{transform:translate(-20px,20px) scale(0.88)} }
  @keyframes streak { 0%{transform:scaleX(0)} 100%{transform:scaleX(1)} }
  @keyframes progressFill { from{width:0} to{width:var(--target-width)} }
`;

/* ═══════════════════════════════════════════════════════════════════════════
   RAIN DROPS (deterministic)
═══════════════════════════════════════════════════════════════════════════ */
const RAIN = Array.from({length:50},(_,i)=>({
  left:((i*2.033)%99), delay:((i*0.237)%5), dur:1.2+((i*0.07)%1.4), op:0.05+((i*0.009)%0.12),
}));

/* ═══════════════════════════════════════════════════════════════════════════
   NATURE BACKGROUND — Multi-layer parallax + particle systems
═══════════════════════════════════════════════════════════════════════════ */
/* ── Floating Sparkles overlay ── */
/* SparkleField removed — absorbed into MasterBG */
function SparkleField(){ return null; }

function NatureBG({ rainMode, themeBg }) {
  const canvasRef = useRef(null);

  useEffect(()=>{
    const canvas = canvasRef.current;
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let raf, t = 0;
    const resize = ()=>{ canvas.width=window.innerWidth; canvas.height=window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const draw = ()=>{
      t += 0.003;
      const W=canvas.width, H=canvas.height;
      ctx.clearRect(0,0,W,H);

      // ── Slow drifting fog/mist bands ──
      const bg = themeBg || THEMES.sky.bg;
      const fogs = [
        {y:H*0.15, amp:20, freq:0.6, col:bg.fog[0], phase:0},
        {y:H*0.35, amp:14, freq:0.9, col:bg.fog[1], phase:2.1},
        {y:H*0.55, amp:10, freq:0.5, col:bg.fog[2], phase:4.3},
      ];
      fogs.forEach(f=>{
        const g = ctx.createLinearGradient(0, f.y-45, 0, f.y+45);
        g.addColorStop(0,'rgba(0,0,0,0)');
        g.addColorStop(0.5, f.col);
        g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        for(let x=0;x<=W;x+=6){
          const w = Math.sin(x*0.003*f.freq+t+f.phase)*f.amp + Math.sin(x*0.008*f.freq+t*1.4+f.phase)*f.amp*0.3;
          if(x===0) ctx.moveTo(x, f.y+w);
          else ctx.lineTo(x, f.y+w);
        }
        for(let x=W;x>=0;x-=6){
          const w = Math.sin(x*0.003*f.freq+t+f.phase)*f.amp + Math.sin(x*0.008*f.freq+t*1.4+f.phase)*f.amp*0.3;
          ctx.lineTo(x, f.y+w+55);
        }
        ctx.closePath(); ctx.fill();
      });

      // ── Drifting colour orbs ──
      const orbs=[
        {x:W*0.12+Math.sin(t*0.3)*W*0.04,   y:H*0.18+Math.cos(t*0.25)*H*0.03, r:W*0.30, c:bg.orbs[0]},
        {x:W*0.80+Math.cos(t*0.28)*W*0.05,   y:H*0.12+Math.sin(t*0.35)*H*0.04, r:W*0.26, c:bg.orbs[1]},
        {x:W*0.50+Math.sin(t*0.4+1.5)*W*0.06, y:H*0.55+Math.cos(t*0.32+1)*H*0.05,r:W*0.24, c:bg.orbs[2]},
        {x:W*0.25+Math.cos(t*0.22+2)*W*0.04,  y:H*0.72+Math.sin(t*0.38)*H*0.04, r:W*0.20, c:bg.orbs[3]},
      ];
      orbs.forEach(o=>{
        const g=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,o.r);
        g.addColorStop(0,o.c); g.addColorStop(1,'rgba(0,0,0,0)');
        ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
      });

      // ── Oil-painting iridescence layer (ultra subtle) ──
      const shine = ctx.createLinearGradient(
        W*0.3+Math.sin(t*0.15)*W*0.1, 0,
        W*0.7+Math.cos(t*0.12)*W*0.1, H
      );
      shine.addColorStop(0,'rgba(0,0,0,0)');
      shine.addColorStop(0.3,'rgba(255,255,255,0.018)');
      shine.addColorStop(0.5,'rgba(255,255,255,0.012)');
      shine.addColorStop(0.7,'rgba(255,255,255,0.015)');
      shine.addColorStop(1,'rgba(0,0,0,0)');
      ctx.fillStyle=shine; ctx.fillRect(0,0,W,H);

      raf=requestAnimationFrame(draw);
    };
    draw();
    return()=>{ cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  },[]);

  return (
    <div style={{ position:'fixed', inset:0, zIndex:0, overflow:'hidden', pointerEvents:'none' }}>
      <style>{GLOBAL_CSS}</style>

      {/* ── Base: deep forest obsidian ── */}
      <div style={{ position:'absolute', inset:0,
        background:themeBg?.base || THEMES.sky.bg.base }}/>

      {/* ── Canvas: animated fog, warm orbs, oil sheen ── */}
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}/>

      {/* ── Aged vellum texture overlay (pure CSS noise) ── */}
      <div style={{ position:'absolute', inset:0, opacity:0.025,
        backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundSize:'200px 200px' }}/>

      {/* ── Faint star field (amber/gold tinted) ── */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}
           viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {STARS.map((s,i)=>(
          <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={s.col} opacity={s.o}
            style={i%7===0?{animation:`twinkle ${s.tw}s ${(i*0.22)%s.tw}s ease-in-out infinite`}:undefined}/>
        ))}
      </svg>

      {/* ── Subtle shooting stars ── */}
      {SHOOTING.map((ss,i)=>(
        <div key={i} style={{
          position:'absolute', top:`${ss.y}%`, left:`${ss.x}%`,
          width:ss.len, height:1, opacity:0,
          background:`linear-gradient(90deg,transparent,${C.teal} 60%,${C.aurora}CC 85%,transparent)`,
          borderRadius:2,
          animation:`shoot ${ss.dur}s ${ss.delay}s linear infinite`,
          transform:'rotate(-25deg)',
        }}/>
      ))}

      {/* ── Mountain silhouettes: aged ink wash painting style ── */}
      <svg style={{ position:'absolute', bottom:0, width:'100%', height:'48%' }}
           viewBox="0 0 1400 260" preserveAspectRatio="none">
        <defs>
          <linearGradient id="ink1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(themeBg||THEMES.sky.bg).mtn1} stopOpacity="0.88"/>
            <stop offset="100%" stopColor={(themeBg||THEMES.sky.bg).mtn1} stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="ink2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(themeBg||THEMES.sky.bg).mtn2} stopOpacity="0.94"/>
            <stop offset="100%" stopColor={(themeBg||THEMES.sky.bg).mtn3} stopOpacity="0.9"/>
          </linearGradient>
          <linearGradient id="ink3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={(themeBg||THEMES.sky.bg).mtn3} stopOpacity="1"/>
            <stop offset="100%" stopColor="#EEF2FF" stopOpacity="1"/>
          </linearGradient>
          <linearGradient id="goldRim" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0"/>
          </linearGradient>
          <filter id="inkBlur">
            <feGaussianBlur stdDeviation="0.8"/>
          </filter>
        </defs>
        {/* Far range — misty, faint */}
        <path d="M0,175 L70,92 L138,132 L215,58 L300,96 L382,44 L468,82 L558,28 L648,66 L738,38 L828,72 L918,44 L1008,78 L1092,48 L1175,76 L1258,50 L1340,74 L1400,58 L1400,260 L0,260Z"
          fill="url(#ink1)" opacity="0.75" filter="url(#inkBlur)"/>
        {/* Mid range */}
        <path d="M0,192 L88,118 L165,150 L258,78 L352,116 L440,62 L528,102 L622,50 L718,92 L812,60 L908,95 L1000,65 L1092,98 L1175,68 L1262,102 L1340,76 L1400,94 L1400,260 L0,260Z"
          fill="url(#ink2)"/>
        {/* Near ridge */}
        <path d="M0,260 L0,228 L55,210 L115,226 L178,206 L242,222 L305,202 L368,218 L432,198 L496,215 L558,196 L622,212 L686,193 L750,210 L814,191 L878,207 L942,189 L1006,205 L1070,187 L1134,203 L1198,185 L1262,201 L1326,183 L1400,200 L1400,260Z"
          fill="url(#ink3)"/>
        {/* Gold rim light on ridge */}
        <path d="M0,228 L55,210 L115,226 L178,206 L242,222 L305,202 L368,218 L432,198 L496,215 L558,196 L622,212 L686,193 L750,210 L814,191 L878,207 L942,189 L1006,205 L1070,187 L1134,203 L1198,185 L1262,201 L1326,183 L1400,200"
          fill="none" stroke={(themeBg||THEMES.sky.bg).ridge} strokeWidth="1.2" opacity="0.5"
          style={{animation:'energyPulse 5s ease-in-out infinite'}}/>
        {/* Ink wash mist at base of mountains */}
        <path d="M0,230 Q350,215 700,222 Q1050,228 1400,218 L1400,245 Q1050,250 700,244 Q350,238 0,248Z"
          fill={(themeBg||THEMES.sky.bg).mtn2} opacity="0.12"/>
      </svg>

      {/* ── Tall ancient trees (ink painting silhouette) ── */}
      <svg style={{ position:'absolute', bottom:0, left:'2%', height:'42%', width:80, opacity:0.22 }}
           viewBox="0 0 80 220">
        {[10,28,48,66].map((x,i)=>(
          <g key={i}>
            <rect x={x-1.5} y={0} width={3} height={220} rx="1.5"
              fill={`hsl(${220+i*8},55%,${38+i*4}%)`}/>
            {[35,75,115,155,190].map((y,j)=>(
              <ellipse key={j} cx={x+(i%2===0?14:-14)} cy={y-8} rx={10} ry={5}
                fill="#0B1E0A" opacity="0.9"
                transform={`rotate(${i%2===0?-18:18},${x+(i%2===0?14:-14)},${y-8})`}/>
            ))}
          </g>
        ))}
      </svg>

      {/* ── Rising embers (candle/fireplace) ── */}
      {EMBERS.map((e,i)=>(
        <div key={i} style={{
          position:'absolute', bottom:`${e.bot}%`, left:`${e.left}%`,
          width:e.sz, height:e.sz, borderRadius:'50%',
          background:e.col, opacity:0,
          boxShadow:`0 0 ${e.sz*3}px ${e.col}`,
          animation:`emberRise ${e.dur}s ${e.delay}s ease-out infinite`,
        }}/>
      ))}

      {/* ── Floating dust motes ── */}
      {DUST.map((d,i)=>(
        <div key={i} style={{
          position:'absolute', left:`${d.left}%`, top:`${d.top}%`,
          width:d.sz, height:d.sz, borderRadius:'50%',
          background:C.teal, opacity:0,
          '--op':d.op, '--dx':`${-10+i%20}px`, '--dy':`${-30-i%25}px`,
          animation:`dustDrift ${d.dur}s ${d.delay}s ease-in-out infinite`,
        }}/>
      ))}

      {/* ── Falling autumn leaves (replacing sakura) ── */}
      {SAKURA.map((p,i)=>(
        <div key={i} style={{
          position:'absolute', top:'-20px', left:`${p.left}%`,
          width:p.sz+2, height:p.sz,
          background:i%3===0?'radial-gradient(ellipse,${C.tealL}CC,${C.teal}88)'
            :i%3===1?'radial-gradient(ellipse,${C.moss}CC,${C.aurora}AA)'
            :'radial-gradient(ellipse,#A07850CC,#5A3E2866)',
          borderRadius:'60% 20% 60% 20%', opacity:0.7,
          animation:`leafFall ${p.dur}s ${p.delay}s linear infinite`,
          transform:`rotate(${p.rot}deg)`,
        }}/>
      ))}

      {/* ── Floating kanji (ink wash, barely visible) ── */}
      {FLOAT_KANJI.map((fk,i)=>(
        <div key={i} style={{
          position:'absolute', left:`${fk.left}%`, top:'12%',
          fontSize:fk.sz, fontFamily:'serif,"Noto Sans JP"',
          color:fk.k==='漢'||fk.k==='字'?C.teal:C.sakura, opacity:fk.op, userSelect:'none',
          animation:`floatKanji ${fk.dur}s ${fk.delay}s ease-in-out infinite`,
          '--op':fk.op, textShadow:`0 0 24px ${C.teal}B3`,
          fontWeight:900, letterSpacing:'-0.02em',
        }}>{fk.k}</div>
      ))}

      {/* ── Horizon warm glow (fireplace/candle warmth) ── */}
      <div style={{ position:'absolute', bottom:'20%', left:0, right:0, height:30,
        background:'linear-gradient(90deg,transparent 8%,${C.teal}40 25%,${C.aurora}38 50%,${C.sakura}2E 75%,transparent 92%)',
        filter:'blur(12px)' }}/>

      {/* ── Rain ── */}
      {rainMode && RAIN.map((r,i)=>(
        <div key={i} style={{
          position:'absolute', left:`${r.left}%`, top:-20, width:1, height:16, opacity:r.op,
          background:'linear-gradient(180deg,transparent,rgba(201,168,76,0.5),rgba(201,168,76,0.2))',
          animation:`rain ${r.dur}s ${r.delay}s linear infinite`,
        }}/>
      ))}

      {/* ── Film grain texture (aged photograph) ── */}
      <div style={{ position:'absolute', inset:0, opacity:0.02,
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='g'%3E%3CfeTurbulence baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23g)'/%3E%3C/svg%3E")`,
        backgroundSize:'300px 300px' }}/>

      {/* ── Vignette — deep mahogany edges ── */}
      <div style={{ position:'absolute', inset:0,
        background:'radial-gradient(ellipse 100% 100% at 50% 50%,transparent 50%,rgba(186,230,253,0.10) 80%,rgba(224,231,255,0.15) 100%)' }}/>

      {/* ── Top warm atmospheric haze ── */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'30%',
        background:'linear-gradient(180deg,rgba(201,168,76,0.04) 0%,rgba(96,165,200,0.03) 50%,transparent 100%)' }}/>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   SPLASH SCREEN
═══════════════════════════════════════════════════════════════════════════ */
function SplashScreen({ onDone }) {
  const [phase, setPhase] = useState(0); // 0=kanji, 1=title, 2=sub, 3=fade
  useEffect(() => {
    const t1 = setTimeout(()=>setPhase(1), 800);
    const t2 = setTimeout(()=>setPhase(2), 1600);
    const t3 = setTimeout(()=>setPhase(3), 3200);
    const t4 = setTimeout(onDone, 4000);
    return ()=>{ clearTimeout(t1);clearTimeout(t2);clearTimeout(t3);clearTimeout(t4); };
  }, []);
  return (
    <div style={{ position:'fixed', inset:0, zIndex:1000, display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      background:`radial-gradient(ellipse at 50% 40%, ${C.cosmos} 0%, ${C.void} 100%)`,
      transition:'opacity 0.8s ease', opacity:phase===3?0:1 }}>
      <NatureBG rainMode={false} themeBg={THEMES.sky.bg}/>
      <div style={{ position:'relative', zIndex:1, textAlign:'center' }}>
        {/* Giant kanji */}
        <div style={{ fontSize:140, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif', lineHeight:1,
          color:C.moonlight, marginBottom:16,
          textShadow:`0 0 60px #7BB8D490, 0 0 120px #60A5C860, 0 0 200px ${C.jade}30`,
          animation:'splashKanji 1.2s cubic-bezier(0.34,1.4,0.64,1) both',
          filter:`drop-shadow(0 0 30px #7BB8D480)` }}>
          漢字
        </div>
        {phase>=1 && (
          <div style={{ fontSize:28, fontWeight:900, color:C.moonlight, marginBottom:8,
            animation:'fadeUp 0.7s ease both',
            textShadow:`0 0 20px ${C.jade}60` }}>
            Kanji Flashcards
          </div>
        )}
        {phase>=2 && (
          <div style={{ fontSize:13, color:C.nebula, letterSpacing:3,
            animation:'fadeUp 0.6s ease both' }}>
            JLPT N5–N1 · 2135 KANJI · PHD STUDY EDITION
          </div>
        )}
        {phase>=2 && (
          <div style={{ marginTop:40, display:'flex', gap:6, justifyContent:'center' }}>
            {[C.jade,C.aurora,C.teal,C.sakura,C.amber].map((c,i)=>(
              <div key={i} style={{ width:8, height:8, borderRadius:4, background:c,
                boxShadow:`0 0 12px ${c}, 0 0 24px ${c}80`,
                animation:`pop 0.4s ${0.1+i*0.1}s ease both` }}/>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOAST NOTIFICATIONS
═══════════════════════════════════════════════════════════════════════════ */
function ToastContainer({ toasts, removeToast }) {
  return (
    <div style={{ position:'fixed', top:16, right:16, zIndex:999, display:'flex',
      flexDirection:'column', gap:8, maxWidth:280 }}>
      {toasts.map(t=>(
        <div key={t.id} style={{ background:`linear-gradient(135deg, rgba(12,22,8,0.98), rgba(8,16,6,0.96))`,
          border:`1px solid ${t.color}60`, borderLeft:`3px solid ${t.color}`,
          borderRadius:12, padding:'10px 14px',
          backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
          display:'flex', alignItems:'center', gap:10,
          boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${t.color}20`,
          animation:`${t.leaving?'toastOut':'toastIn'} 0.35s cubic-bezier(0.34,1.4,0.64,1) both`,
          cursor:'pointer' }}
          onClick={()=>removeToast(t.id)}>
          <span style={{ fontSize:18 }}>{t.icon}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:12, fontWeight:800, color:t.color }}>{t.title}</div>
            <div style={{ fontSize:10, color:C.starlight, marginTop:1 }}>{t.msg}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACHIEVEMENT POPUP
═══════════════════════════════════════════════════════════════════════════ */
function AchievementPopup({ achievement, onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,3500); return()=>clearTimeout(t); },[]);
  return (
    <div style={{ position:'fixed', top:80, left:'50%', transform:'translateX(-50%)',
      zIndex:998, animation:'achieveIn 0.6s cubic-bezier(0.34,1.5,0.64,1) both',
      maxWidth:320, width:'90%' }}>
      <div style={{ background:`linear-gradient(135deg, ${C.void}, ${C.ocean}, ${C.abyss}, ${C.lifted})`,
        border:`1.5px solid ${C.amber}80`, borderRadius:20,
        padding:'18px 22px', textAlign:'center',
        boxShadow:`0 20px 60px rgba(0,0,0,0.7), 0 0 40px ${C.amber}30` }}>
        <div style={{ fontSize:40 }}>{achievement.icon}</div>
        <div style={{ fontSize:10, color:C.amber, fontWeight:800, letterSpacing:3,
          marginTop:8, marginBottom:4 }}>ACHIEVEMENT UNLOCKED</div>
        <div style={{ fontSize:18, fontWeight:900, color:C.moonlight }}>{achievement.name}</div>
        <div style={{ fontSize:11, color:C.starlight, marginTop:4 }}>{achievement.desc}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   RIPPLE BUTTON
═══════════════════════════════════════════════════════════════════════════ */
function RippleBtn({ onClick, children, style={} }) {
  const [ripples, setRipples] = useState([]);
  const ref = useRef();
  const handleClick = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = e.clientX-r.left, y = e.clientY-r.top;
    const id = Date.now();
    setRipples(rs=>[...rs, {id, x, y}]);
    setTimeout(()=>setRipples(rs=>rs.filter(r=>r.id!==id)), 600);
    onClick?.(e);
  };
  return (
    <button ref={ref} onClick={handleClick}
      style={{ position:'relative', overflow:'hidden', ...style }}>
      {children}
      {ripples.map(rp=>(
        <span key={rp.id} style={{
          position:'absolute', left:rp.x-10, top:rp.y-10,
          width:20, height:20, borderRadius:'50%',
          background:'rgba(255,255,255,0.3)', pointerEvents:'none',
          animation:'ripple 0.6s ease-out forwards',
        }}/>
      ))}
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ANIMATED NUMBER
═══════════════════════════════════════════════════════════════════════════ */
function AnimNum({ value, color, suffix='' }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);
  useEffect(()=>{
    const start=prev.current, end=value, dur=600;
    const t0=Date.now();
    const fn=()=>{
      const p=Math.min((Date.now()-t0)/dur,1);
      const ease=1-Math.pow(1-p,3);
      setDisplay(Math.round(start+(end-start)*ease));
      if(p<1) requestAnimationFrame(fn);
      else prev.current=end;
    };
    requestAnimationFrame(fn);
  },[value]);
  return <span style={{color}}>{display}{suffix}</span>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   CIRCULAR RING (enhanced)
═══════════════════════════════════════════════════════════════════════════ */
function Ring({ pct=0, size=100, stroke=8, color=C.jade, bg=C.border, label='', value='', glowColor }) {
  const r=((size-stroke)/2), circ=2*Math.PI*r, dash=circ*Math.min(pct,1);
  const gc = glowColor || color;
  return (
    <div style={{ position:'relative', width:size, height:size, flexShrink:0 }}>
      <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bg} strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          style={{ transition:'stroke-dasharray 0.8s cubic-bezier(0.34,1.2,0.64,1)',
            filter:`drop-shadow(0 0 6px ${gc}90) drop-shadow(0 0 12px ${gc}50)` }}/>
      </svg>
      <div style={{ position:'absolute', inset:0, display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center', gap:1 }}>
        <span style={{ fontSize:size*0.23, fontWeight:900, color, lineHeight:1,
          textShadow:`0 0 10px ${gc}80` }}>{value}</span>
        {label && <span style={{ fontSize:size*0.11, color:C.nebula, lineHeight:1 }}>{label}</span>}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   TOGGLE SWITCH
═══════════════════════════════════════════════════════════════════════════ */
function Toggle({ on, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width:52, height:29, borderRadius:15,
      background:on?`linear-gradient(90deg, ${C.jade}, #60A5C8)`:`${C.border}88`,
      cursor:'pointer', position:'relative', transition:'background 0.3s ease', flexShrink:0,
      boxShadow:on?`0 2px 14px ${C.jade}60, inset 0 1px 0 rgba(255,255,255,0.2)`:'none',
      border:`1px solid ${on?C.jade+'60':C.border}` }}>
      <div style={{ width:23, height:23, borderRadius:12, background:'#fff',
        position:'absolute', top:2, left:on?26:2,
        transition:'left 0.3s cubic-bezier(0.34,1.6,0.64,1)',
        boxShadow:'0 2px 8px rgba(0,0,0,0.4)' }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   GLASS PANEL
═══════════════════════════════════════════════════════════════════════════ */
function Glass({ children, style={}, glow='', onClick, animate }) {
  return (
    <div onClick={onClick} style={{
      background:`linear-gradient(145deg, ${C.card}E6, ${C.lifted}E0, ${C.abyss}EB)`,
      backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)',
      border:`1px solid ${glow ? glow+'40' : '${C.teal}4C'}`,
      borderRadius:16,
      boxShadow: glow
        ? `0 4px 24px ${C.teal}26, 0 0 0 1px ${glow}25, inset 0 1px 0 rgba(255,255,255,0.8)`
        : `0 4px 24px ${C.aurora}1F, inset 0 1px 0 rgba(255,255,255,0.8), 0 0 0 1px ${C.teal}40`,
      animation:animate?'fadeUp 0.4s ease both':undefined,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STROKE DOTS
═══════════════════════════════════════════════════════════════════════════ */
function StrokeDots({ count, color, size=7 }) {
  return (
    <div style={{ display:'flex', gap:3, alignItems:'center', flexWrap:'wrap', maxWidth:160 }}>
      {Array.from({length:count}).map((_,i)=>(
        <div key={i} style={{ width:size, height:size, borderRadius:size/2,
          background:color, opacity:0.75, boxShadow:`0 0 5px ${color}90`,
          animation:`pop 0.3s ${0.02*i}s ease both` }}/>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CONFETTI BURST — enhanced multi-shape
═══════════════════════════════════════════════════════════════════════════ */
function Confetti({ active }) {
  if (!active) return null;
  const items = Array.from({length:30},(_,i)=>({
    left:10+(i*3.1)%78, color:[C.jade,C.teal,C.aurora,C.sakura,C.amber,C.moss,C.auroraL,C.jadeL,C.gold][i%9],
    sz:3+i%6, delay:i*35, dur:600+i%5*200, shape:i%3===0?'50%':i%3===1?'0%':'30%',
  }));
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:60 }}>
      {items.map((p,i)=>(
        <div key={i} style={{ position:'absolute', left:`${p.left}%`, top:-12,
          width:p.sz, height:p.sz*1.4, background:p.color,
          borderRadius:p.shape, opacity:0,
          boxShadow:`0 0 4px ${p.color}80`,
          animation:`confettiDrop ${p.dur}ms ${p.delay}ms ease-in forwards` }}/>
      ))}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════════
   KANJI CHAR — SVG text with animated linearGradient fill.
   Works on EVERY Android WebView — no background-clip, no CSS tricks.
   The gradient fills only the ink strokes (not background).
   Each theme produces its own 3-color diagonal gradient.
═══════════════════════════════════════════════════════════════════════════ */
function KanjiChar({ k, size, TC }) {
  const uid = useRef('kg' + Math.random().toString(36).slice(2, 6)).current;
  const box = size * 1.2;
  // Theme-specific gradient: pick 3 colors that match the theme palette
  const c1 = TC.aurora;   // top-left  (e.g. indigo, purple, gold, neon)
  const c2 = TC.teal;     // mid       (e.g. sky, teal, green, cyan)
  const c3 = TC.jade;     // bottom-right
  const glow = TC.aurora;

  return (
    <div style={{ position:'relative', zIndex:1, marginBottom:14,
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      animation:'kanjiPop 0.5s cubic-bezier(0.34,1.5,0.64,1) both',
      filter:`drop-shadow(0 0 20px ${glow}99) drop-shadow(0 6px 16px ${c2}66)`,
    }}>
      <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`}
        style={{overflow:'visible', display:'block'}}>
        <defs>
          <linearGradient id={`${uid}_g`}
            x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor={c1}>
              <animate attributeName="stop-color"
                values={`${c1};${c2};${c3};${c1}`}
                dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="50%"  stopColor={c2}>
              <animate attributeName="stop-color"
                values={`${c2};${c3};${c1};${c2}`}
                dur="8s" repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor={c3}>
              <animate attributeName="stop-color"
                values={`${c3};${c1};${c2};${c3}`}
                dur="8s" repeatCount="indefinite"/>
            </stop>
          </linearGradient>
        </defs>
        <text
          x={box/2} y={box/2}
          dominantBaseline="central"
          textAnchor="middle"
          fontSize={size}
          fontWeight="900"
          fontFamily='"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif'
          fill={`url(#${uid}_g)`}
        >{k}</text>
      </svg>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   FLASHCARD — 3D flip with micro animations
═══════════════════════════════════════════════════════════════════════════ */
function FlashCard({ card, cs, flipped, onFlip, onStar, bp, outerRef, theme='sky' }) {
  // Compute live theme colors inside render — avoids stale module-level C snapshot
  const TC = (THEMES[theme]||THEMES.sky).C;
  if (!card) return null;
  const st    = STATUS[cs.status];
  const cardH = bp.isLarge?500:bp.isTablet?440:390;
  const ksize = bp.isLarge?185:bp.isTablet?150:123;
  const faceBase = {
    position:'absolute', inset:0, borderRadius:24, overflow:'hidden',
    backfaceVisibility:'hidden', WebkitBackfaceVisibility:'hidden',
    display:'flex', flexDirection:'column',
  };
  return (
    <div ref={outerRef}
      style={{ width:'100%', height:cardH, cursor:'pointer', position:'relative',
        perspective:1400,
        willChange:'transform,opacity' }}>
      <div style={{ width:'100%', height:'100%', position:'relative',
        transformStyle:'preserve-3d',
        transform:flipped?'rotateY(180deg)':'rotateY(0deg)',
        transition:'transform 0.6s cubic-bezier(0.4,0.2,0.2,1)' }}>

        {/* ──── FRONT ──── */}
        <div style={{ ...faceBase,
          background:`linear-gradient(155deg, ${C.card} 0%, ${C.lifted} 40%, ${C.abyss} 100%)`,
          border:`1.5px solid ${st.color}90`,
          boxShadow:`0 24px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(201,168,76,0.15), inset 0 1px 0 rgba(138,175,212,0.12), inset 0 -1px 0 rgba(0,0,0,0.5)`,
          overflow:'hidden', position:'relative',
        }}>
          {/* Shimmer overlay on drag */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:10,
            background:`linear-gradient(105deg, transparent 40%, ${st.color}08 50%, transparent 60%)`,
            backgroundSize:'200% 100%',
            animation:'shimmer 3s linear infinite', opacity:0.6 }}/>
          {/* Animated gradient stripe at top */}
          <div style={{ height:48, flexShrink:0,
            background:`linear-gradient(90deg, ${st.color}28 0%, ${st.color}12 50%, transparent 100%)`,
            borderBottom:`1px solid ${st.color}30`,
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px',
            position:'relative', overflow:'hidden' }}>
            {/* Animated wave in header */}
            <div style={{ position:'absolute', inset:0, opacity:0.15,
              background:`repeating-linear-gradient(90deg, transparent, transparent 20px, ${st.color}40 20px, ${st.color}40 22px)`,
              animation:'waveFlow 3s linear infinite' }}/>
            <div style={{ display:'flex', gap:8, alignItems:'center', position:'relative' }}>
              <span style={{ background:`${st.color}22`, color:st.color, borderRadius:9,
                padding:'3px 11px', fontSize:11, fontWeight:800, border:`1px solid ${st.color}40`,
                letterSpacing:0.4, boxShadow:`0 2px 8px ${st.color}30` }}>
                #{card.id}
              </span>
              <span style={{ background:`linear-gradient(135deg,${
                card.lv==='N5'?'#60A5C822':card.lv==='N4'?'#7BB8D422':card.lv==='N3'?'#818CF822':card.lv==='N2'?'#8B5CF622':'#C9A84C22'
              },transparent)`,
                color:card.lv==='N5'?'#60A5C8':card.lv==='N4'?'#7BB8D4':card.lv==='N3'?'#818CF8':card.lv==='N2'?'#8B5CF6':'#C9A84C',
                borderRadius:9, padding:'3px 10px', fontSize:11, fontWeight:900,
                border:`1px solid ${card.lv==='N5'?'#60A5C840':card.lv==='N4'?'#7BB8D440':card.lv==='N3'?'#818CF840':card.lv==='N2'?'#8B5CF640':'#C9A84C40'}`,
                letterSpacing:0.5, boxShadow:`0 2px 8px ${card.lv==='N5'?'#60A5C830':card.lv==='N4'?'#7BB8D430':card.lv==='N3'?'#818CF830':card.lv==='N2'?'#8B5CF630':'#C9A84C30'}` }}>
                {card.lv}
              </span>
              <span style={{ fontSize:12, color:st.color, fontWeight:800 }}>
                {st.emoji} {st.label}
              </span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
              <div style={{ textAlign:'center' }}>
                <div style={{ fontSize:9, color:C.nebula, letterSpacing:1 }}>STROKES</div>
                <div style={{ fontSize:13, fontWeight:900, color:st.color,
                  textShadow:`0 0 8px ${st.color}B0` }}>{card.st}</div>
              </div>
              <button onClick={e=>{e.stopPropagation();onStar();}}
                style={{ background:cs.starred?`${C.amber}25`:'transparent',
                  color:cs.starred?C.amber:C.nebula,
                  border:`1px solid ${cs.starred?C.amber+'60':'transparent'}`,
                  borderRadius:9, padding:'5px 9px', fontSize:20, cursor:'pointer',
                  transition:'all 0.25s cubic-bezier(0.34,1.5,0.64,1)',
                  textShadow:cs.starred?`0 0 16px ${C.amber}, 0 0 32px ${C.amber}80`:'none',
                  boxShadow:cs.starred?`0 3px 12px ${C.amber}50`:'none',
                  animation:cs.starred?'heartBeat 0.5s ease':undefined }}>
                {cs.starred?'★':'☆'}
              </button>
            </div>
          </div>

          {/* Main body */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
            justifyContent:'center', padding:'10px 18px', position:'relative', overflow:'hidden' }}>
            {/* Ghosted BG kanji */}
            <div style={{ position:'absolute', fontSize:320, fontFamily:'serif', color:st.color,
              opacity:0.04, lineHeight:1, pointerEvents:'none', userSelect:'none',
              textShadow:`0 0 40px ${st.color}`, transform:'rotate(-5deg)' }}>{card.k}</div>

            {/* Category badge */}
            <div style={{ position:'absolute', top:8, left:14,
              background:`${C.lifted}D9`, borderRadius:7, padding:'2px 9px',
              fontSize:9, color:C.jadeD, fontWeight:700, letterSpacing:1,
              border:`1px solid ${C.teal}4C`, textTransform:'uppercase' }}>
              {card.cat}
            </div>

            {/* Kanji — KanjiChar uses CSS custom-props + color animation, reliable on all Android */}
            <KanjiChar k={card.k} size={ksize} TC={TC} />

            {/* Stroke dots */}
            <div style={{ marginBottom:12, zIndex:1 }}>
              <StrokeDots count={card.st} color={st.color}/>
            </div>

            {/* Readings on front + Radical */}
            <div style={{ display:'flex', gap:6, marginBottom:12, zIndex:1, flexWrap:'wrap', justifyContent:'center' }}>
              {card.on && (
                <span style={{ background:`${C.teal}1F`, borderRadius:7, padding:'3px 11px',
                  fontSize:bp.isLarge?12:10, color:C.jadeD, border:`1px solid rgba(56,189,248,0.35)`,
                  fontFamily:'serif,"Noto Sans JP"', fontWeight:800, letterSpacing:0.3 }}>
                  <span style={{ fontSize:8, color:'#EF4444', marginRight:4, letterSpacing:1.5 }}>音</span>{card.on}
                </span>
              )}
              {card.ku && (
                <span style={{ background:`${C.aurora}1F`, borderRadius:7, padding:'3px 11px',
                  fontSize:bp.isLarge?12:10, color:C.auroraD, border:`1px solid ${C.aurora}59`,
                  fontFamily:'serif,"Noto Sans JP"', fontWeight:800, letterSpacing:0.3 }}>
                  <span style={{ fontSize:8, color:'#60A5C8', marginRight:4, letterSpacing:1.5 }}>訓</span>{card.ku}
                </span>
              )}
              <span style={{ background:`${C.lifted}E6`, borderRadius:6, padding:'3px 10px',
                fontSize:10, color:C.jadeD, border:`1px solid ${C.teal}66`, fontFamily:"'Cinzel',serif" }}>
                Radical: <span style={{ fontFamily:'serif', color:C.moonlight, fontWeight:700,
                  fontSize:13, marginLeft:3 }}>{card.rad}</span>
              </span>
            </div>

            {/* Mnemonic */}
            <div style={{ background:`${C.lifted}CC`, border:`1px solid ${C.teal}66`,
              borderRadius:14, padding:'9px 16px', maxWidth:'97%', textAlign:'center',
              zIndex:1, width:'100%',
              boxShadow:`inset 0 1px 0 rgba(255,255,255,0.05)` }}>
              <span style={{ fontSize:9, color:C.tealD, fontWeight:800, marginRight:6,
                letterSpacing:1.5 }}>💡 MNEMONIC</span>
              <span style={{ fontSize:bp.isLarge?12:11, color:C.moonlight, lineHeight:1.6,
                fontStyle:'italic' }}>{card.mn}</span>
            </div>

            {/* Example words — larger + reading visible */}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', justifyContent:'center',
              marginTop:12, zIndex:1, width:'100%' }}>
              {card.ex.map((ex,i)=>(
                <div key={i} style={{
                  background:`linear-gradient(135deg,${C.lifted}F2,${C.abyss}E6)`,
                  borderRadius:10, padding:'10px 18px', border:`1px solid rgba(201,168,76,0.22)`,
                  textAlign:'center', flex:'1 1 110px', minWidth:100,
                  boxShadow:`0 4px 14px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  animation:`slideInUp 0.3s ${i*0.06}s ease both` }}>
                  <div style={{ color:C.moonlight, fontWeight:900,
                    fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Sans JP",serif',
                    fontSize:bp.isLarge?22:18,
                    textShadow:`0 0 20px ${st.color}`, lineHeight:1.2 }}>{ex.w}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Flip hint */}
          <div style={{ textAlign:'center', padding:'8px 0 12px', fontSize:10, color:C.dim,
            borderTop:`1px solid ${C.border}30`, letterSpacing:2, flexShrink:0 }}>
            ◉ TAP TO REVEAL ANSWER
          </div>
        </div>

        {/* ──── BACK ──── */}
        <div style={{ ...faceBase, transform:'rotateY(180deg)',
          background:`linear-gradient(155deg, ${C.card} 0%, ${C.lifted} 40%, ${C.abyss} 100%)`,
          border:`1.5px solid ${C.aurora}8C`,
          boxShadow:`0 24px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(201,168,76,0.18), inset 0 1px 0 rgba(89,138,210,0.14), inset 0 -1px 0 rgba(0,0,0,0.5)`,
        }}>
          {/* Back header */}
          <div style={{ height:48, flexShrink:0,
            background:`linear-gradient(90deg, rgba(96,165,200,0.16) 0%, rgba(96,165,200,0.07) 50%, transparent 80%)`,
            borderBottom:`1px solid rgba(89,138,210,0.25)`,
            display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 16px',
            position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, opacity:0.12,
              background:`repeating-linear-gradient(90deg, transparent, transparent 18px, ${C.jade}40 18px, ${C.jade}40 20px)`,
              animation:'waveFlow 4s linear infinite' }}/>
            <div style={{ display:'flex', gap:8, alignItems:'center', position:'relative' }}>
              <span style={{ background:`${C.teal}26`, color:C.jadeD, borderRadius:7,
                padding:'3px 11px', fontSize:11, fontWeight:700, fontFamily:"'Cinzel',serif",
                letterSpacing:1, border:`1px solid ${C.teal}80`,
                boxShadow:`0 2px 8px ${C.teal}40` }}>✦ ANSWER</span>
              <span style={{ background:`#7BB8D418`, color:C.aurora, borderRadius:7,
                padding:'3px 10px', fontSize:10, fontWeight:700, border:`1px solid #7BB8D435` }}>
                {card.st} strokes</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', position:'relative' }}>
              <span style={{ fontSize:36, fontFamily:'serif', color:C.jade, opacity:0.22,
                textShadow:`0 0 24px ${C.jade}`, lineHeight:1 }}>{card.k}</span>
              {card.on && <span style={{ fontSize:9, color:C.jade, opacity:0.6, fontFamily:'serif,"Noto Sans JP"', letterSpacing:0.3 }}>{card.on.split('・')[0]}</span>}
            </div>
          </div>

          <div data-card-back="1" style={{ flex:1, display:'flex', flexDirection:'column', padding:'14px 18px',
            overflowY:'auto', overflowX:'hidden', gap:9,
            WebkitOverflowScrolling:'touch',
            scrollbarWidth:'none', msOverflowStyle:'none' }}>
            {/* Meaning + kanji speaker */}
            <div style={{ display:'flex', alignItems:'center', gap:10,
              animation:'slideInLeft 0.4s ease both' }}>
              <div style={{ fontSize:bp.isLarge?36:bp.isTablet?30:25, fontWeight:900,
                color:C.moonlight, lineHeight:1.15,
                textShadow:`0 0 30px ${C.jade}30` }}>
                {card.m}
              </div>
              <SpeakerBtn text={card.k} lang="ja-JP" size={20} color={C.jade}
                style={{ marginLeft:'auto', flexShrink:0 }}/>
            </div>

            {/* Readings */}
            <div style={{ display:'flex', gap:8, flexWrap:'wrap',
              animation:'slideInLeft 0.4s 0.05s ease both' }}>
              {card.on && (
                <div style={{ background:`${C.teal}1A`, border:`1px solid rgba(56,189,248,0.35)`,
                  borderRadius:8, padding:'6px 14px', display:'flex', gap:7, alignItems:'center',
                  boxShadow:`0 2px 10px ${C.teal}1F` }}>
                  <span style={{ fontSize:9, color:C.crimson, fontWeight:900, letterSpacing:1.5 }}>音 ON</span>
                  <span style={{ fontSize:bp.isLarge?15:14, color:'#FF9898', fontWeight:900,
                    fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Sans JP",serif' }}>{card.on}</span>
                </div>
              )}
              {card.ku && (
                <div style={{ background:`${C.aurora}1A`, border:`1px solid rgba(99,102,241,0.32)`,
                  borderRadius:8, padding:'6px 14px', display:'flex', gap:7, alignItems:'center',
                  boxShadow:`0 2px 10px ${C.aurora}1F` }}>
                  <span style={{ fontSize:9, color:'#60A5C8', fontWeight:900, letterSpacing:1.5 }}>訓 KUN</span>
                  <span style={{ fontSize:bp.isLarge?15:14, color:C.jadeL, fontWeight:900,
                    fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Sans JP",serif' }}>{card.ku}</span>
                </div>
              )}
              <div style={{ background:`#7BB8D414`, border:`1px solid #7BB8D435`,
                borderRadius:11, padding:'6px 13px', display:'flex', gap:6, alignItems:'center' }}>
                <span style={{ fontSize:9, color:'#8898B8', fontWeight:700 }}>RADICAL</span>
                <span style={{ fontSize:bp.isLarge?18:16, color:C.aurora, fontWeight:900,
                  fontFamily:'serif', textShadow:`0 0 10px #7BB8D460` }}>{card.rad}</span>
              </div>
            </div>

            <div style={{ height:1, background:`linear-gradient(90deg, rgba(201,168,76,0.35), rgba(96,165,200,0.15), transparent)` }}/>

            {/* Example words — bigger, pronunciation prominent */}
            <div style={{ fontSize:9, color:C.tealD, fontWeight:700, letterSpacing:2, fontFamily:"'Cinzel',serif", display:'flex', alignItems:'center', gap:6 }}>
              <span style={{ width:16, height:1, background:`linear-gradient(90deg,${C.teal}CC,transparent)`, display:'inline-block' }}/>
              ▸ VOCABULARY
              <span style={{ width:16, height:1, background:`linear-gradient(270deg,${C.jade},transparent)`, display:'inline-block' }}/>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {card.ex.map((ex,i)=>(
                <div key={i} style={{ display:'flex', alignItems:'center', gap:10,
                  padding:'10px 14px',
                  background:`linear-gradient(135deg,${C.lifted}E6,${C.abyss}D9)`,
                  borderRadius:14, border:`1px solid ${C.jade}28`,
                  animation:`slideInUp 0.35s ${0.08+i*0.07}s ease both`,
                  boxShadow:`0 4px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)` }}>
                  {/* Speaker for the example word */}
                  <SpeakerBtn text={ex.w} lang="ja-JP" size={14} color={C.teal}/>
                  <div style={{ minWidth:60, flexShrink:0 }}>
                    <div style={{ fontSize:bp.isLarge?22:20, fontWeight:900, color:C.moonlight,
                      fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif',
                      textShadow:`0 0 16px ${C.jade}55`, lineHeight:1.1 }}>{ex.w}</div>
                    <div style={{ fontSize:bp.isLarge?13:12, color:C.tealD, marginTop:3,
                      fontFamily:'serif,"Noto Sans JP"', fontWeight:800,
                      letterSpacing:0.3 }}>{ex.r}</div>
                  </div>
                  <div style={{ width:1, height:36, background:`linear-gradient(180deg, ${C.jade}60, transparent)`, flexShrink:0 }}/>
                  <div style={{ flex:1, fontSize:bp.isLarge?14:13, color:C.auroraD, fontWeight:600, lineHeight:1.3 }}>
                    {ex.e}
                  </div>
                </div>
              ))}
            </div>

            {/* Mnemonic reminder */}
            <div style={{ background:`#7BB8D410`, border:`1px solid #7BB8D422`,
              borderRadius:11, padding:'7px 14px', marginBottom:4, flexShrink:0 }}>
              <span style={{ fontSize:9, color:C.aurora, fontWeight:800 }}>💡 </span>
              <span style={{ fontSize:10, color:C.starlight, fontStyle:'italic' }}>{card.mn}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STUDY VIEW
═══════════════════════════════════════════════════════════════════════════ */
function StudyView({ deck, deckIdx, card, cs, flipped, setFlipped, navigate, mark, toggleStar,
                     mode, setMode, setDeckIdx, shuffled, setShuffled, bp, confettiTrig, theme }) {
  const touchRef   = useRef(null);
  const dragRef    = useRef({active:false, x:0, startY:0});
  const cardRef    = useRef(null);   // ref to FlashCard outer div — JS animates this directly
  const rafRef     = useRef(null);
  const animState  = useRef({busy:false});
  const prog = deck.length>0?(deckIdx+1)/deck.length:0;

  const [shownCard, setShownCard] = useState(card);
  const [shownCs,   setShownCs]   = useState(cs);
  const [dragX,     setDragX]     = useState(0);
  const [isDragging,setIsDragging]= useState(false);
  const shownSt = shownCs ? STATUS[shownCs.status] : STATUS.new;

  // Keep shownCard in sync when not animating
  useEffect(()=>{
    if(!animState.current.busy){ setShownCard(card); setShownCs(cs); }
  },[card,cs]);

  // ── rAF-driven carousel arc ──────────────────────────────────────────────
  // Easing: ease-out cubic
  const ease = t => 1 - Math.pow(1-t, 3);

  // applyFrame: set transform on the cardRef div directly — zero React overhead
  const applyFrame = useCallback((tx, ry, sc, op) => {
    if(!cardRef.current) return;
    cardRef.current.style.transform =
      `translateX(${tx}%) rotateY(${ry}deg) scale(${sc})`;
    cardRef.current.style.opacity = op;
  }, []);

  const runArc = useCallback((fromTx, toTx, fromRy, toRy, fromSc, toSc, fromOp, toOp, dur, onDone) => {
    const start = performance.now();
    const tick = (now) => {
      const raw = Math.min(1, (now - start) / dur);
      const t   = ease(raw);
      applyFrame(
        fromTx + (toTx - fromTx) * t,
        fromRy + (toRy - fromRy) * t,
        fromSc + (toSc - fromSc) * t,
        fromOp + (toOp - fromOp) * t
      );
      if(raw < 1) { rafRef.current = requestAnimationFrame(tick); }
      else        { applyFrame(toTx, toRy, toSc, toOp); onDone && onDone(); }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [applyFrame, ease]);

  const doNav = useCallback((dir) => {
    if(animState.current.busy) return;
    animState.current.busy = true;
    if(rafRef.current) cancelAnimationFrame(rafRef.current);

    // Freeze snapshot of current card for exit
    const snapCard = card;
    const snapCs   = cs;
    setShownCard(snapCard);
    setShownCs(snapCs);

    const exitTo  = dir > 0 ? -115 : 115;   // exit left or right
    const enterFrom = dir > 0 ? 115 : -115; // enter from opposite side
    // Slight rotateY for the carousel-on-a-cylinder feel
    const exitRy  = dir > 0 ? -18 : 18;
    const enterRy = dir > 0 ? 12 : -12;

    // Phase 1: exit current card (220ms)
    runArc(0, exitTo, 0, exitRy, 1, 0.85, 1, 0, 220, () => {
      // Swap card data & instantly reposition new card off-screen
      navigate(dir);
      // Small timeout to let React flush the new card render
      setTimeout(() => {
        setShownCard(null); // triggers re-sync via useEffect after navigate
        applyFrame(enterFrom, enterRy, 0.85, 0);
        // Phase 2: enter new card (280ms)
        runArc(enterFrom, 0, enterRy, 0, 0.85, 1, 0, 1, 280, () => {
          applyFrame(0, 0, 1, 1);
          animState.current.busy = false;
        });
      }, 16); // one frame gap
    });
  }, [card, cs, navigate, runArc, applyFrame]);

  // Sync shownCard after navigate inside doNav
  useEffect(()=>{
    if(animState.current.busy && shownCard === null){
      setShownCard(card); setShownCs(cs);
    }
  },[card, cs, shownCard]);

  // Cleanup rAF on unmount
  useEffect(()=>()=>{ if(rafRef.current) cancelAnimationFrame(rafRef.current); },[]);

  const handleTouchStart = e=>{
    // If touch is on or inside a speaker button, ignore completely
    if(e.target && e.target.closest && e.target.closest('[data-speaker]')) return;
    touchRef.current = {x:e.touches[0].clientX, y:e.touches[0].clientY};
    if(animState.current.busy) return;
    dragRef.current = {x:e.touches[0].clientX, startY:e.touches[0].clientY,
                       active:true, wasDragged:false};
    setIsDragging(false); setDragX(0);
  };
  const handleTouchMove = e=>{
    if(!dragRef.current?.active || animState.current.busy) return;
    const dx = e.touches[0].clientX - dragRef.current.x;
    const dy = e.touches[0].clientY - dragRef.current.startY;
    if(Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10){
      e.preventDefault();
      dragRef.current.wasDragged = true;
      setIsDragging(true);
      const clamped = Math.max(-160, Math.min(160, dx));
      setDragX(clamped);
      if(cardRef.current){
        const ry = clamped * 0.05;
        cardRef.current.style.transform = `translateX(${clamped}px) rotateY(${ry}deg)`;
        cardRef.current.style.opacity   = String(Math.max(0.3, 1 - Math.abs(clamped)/500));
      }
    }
  };
  const handleTouchEnd = e=>{
    if(!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    const ax = Math.abs(dx), ay = Math.abs(dy);
    // Use ref (sync) not state (async) for drag detection
    const wasDragging = dragRef.current?.wasDragged || false;

    setIsDragging(false); setDragX(0);
    dragRef.current = {active:false, x:0, startY:0, wasDragged:false};

    // ── TAP: short movement = flip card ──
    if(ax < 18 && ay < 18) {
      setFlipped(f => !f);
      touchRef.current = null;
      return;
    }

    // ── HORIZONTAL SWIPE ──
    if(ax > ay && ax > 50) {
      doNav(dx > 0 ? -1 : 1);
      touchRef.current = null;
      return;
    }

    // ── SNAP BACK if small drag ──
    if(wasDragging) {
      if(rafRef.current) cancelAnimationFrame(rafRef.current);
      runArc(dx * 0.3, 0, dx * 0.04, 0, 1, 1, 1, 1, 160, null);
    }

    // ── VERTICAL SWIPE ──
    if(!wasDragging && ax <= ay) {
      if(dy < -80) mark('known');
      else if(dy > 80) mark('hard');
    }

    touchRef.current = null;
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Mode chips */}
      <div style={{ display:'flex', gap:6, padding:'8px 14px 7px',
        background:`${C.lifted}F5`, borderBottom:`1px solid ${C.teal}40`,
        overflowX:'auto', scrollbarWidth:'none', flexShrink:0 }}>
        {[['all','📚 All'],['starred','⭐ Starred'],['unknown','❓ Unknown'],['known','✅ Known']].map(([v,l])=>(
          <RippleBtn key={v}
            onClick={()=>{ setMode(v); setDeckIdx(0); setFlipped(false); }}
            style={{ background:mode===v?`${shownSt.color}22`:C.lifted,
              color:mode===v?shownSt.color:C.starlight,
              border:`1px solid ${mode===v?shownSt.color+'55':C.border}`,
              borderRadius:20, padding:'5px 15px', fontSize:11, fontWeight:800,
              cursor:'pointer', whiteSpace:'nowrap', flexShrink:0,
              boxShadow:mode===v?`0 4px 14px ${shownSt.color}35`:'none',
              transition:'all 0.25s' }}>
            {l}
          </RippleBtn>
        ))}
        <RippleBtn onClick={()=>setShuffled(s=>!s)}
          style={{ background:shuffled?`#60A5C822`:C.lifted, color:shuffled?C.teal:C.starlight,
            border:`1px solid ${shuffled?C.teal+'55':C.border}`,
            borderRadius:20, padding:'5px 15px', fontSize:11, fontWeight:800,
            cursor:'pointer', flexShrink:0, transition:'all 0.25s' }}>
          ⇄ {shuffled?'ON':'Shuffle'}
        </RippleBtn>
      </div>

      {/* Progress bar — animated */}
      <div style={{ height:4, background:C.border, flexShrink:0, position:'relative' }}>
        <div style={{ height:'100%', width:`${prog*100}%`,
          background:`linear-gradient(90deg, ${C.teal}, ${C.aurora}, ${C.sakura}, ${C.teal})`,
          transition:'width 0.45s cubic-bezier(0.34,1.2,0.64,1)', borderRadius:2,
          boxShadow:`0 0 10px ${C.jade}70` }}/>
      </div>

      {/* Counter strip */}
      <div style={{ display:'flex', justifyContent:'center', alignItems:'center', gap:12,
        padding:'5px 0', background:`${C.lifted}D9`, backdropFilter:'blur(8px)', flexShrink:0 }}>
        <span style={{ fontSize:12, color:C.starlight, fontWeight:700 }}>
          {deckIdx+1} <span style={{ color:C.nebula }}>/ {deck.length}</span>
        </span>
        <div style={{ width:7, height:7, borderRadius:4, background:shownSt.color,
          boxShadow:`0 0 8px ${shownSt.color}, 0 0 16px ${shownSt.color}60`,
          animation:'glowPulse 2s ease-in-out infinite' }}/>
        <span style={{ fontSize:11, color:shownSt.color, fontWeight:900 }}>{shownSt.emoji} {shownSt.label}</span>
      </div>

      {/* Card zone — rAF-driven, no CSS animation */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:bp.isLarge?'16px 40px':bp.isTablet?'12px 26px':'10px 14px',
        overflow:'hidden', position:'relative' }}
        onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}
        onClick={e=>{
          // Don't flip if clicking speaker, star button, or any other interactive element
          if(e.target && e.target.closest && (
            e.target.closest('[data-speaker]') ||
            e.target.closest('button')
          )) return;
          if(!animState.current.busy) setFlipped(f=>!f);
        }}>

        {/* Swipe direction hint arrows */}
        {isDragging && dragX < -20 && (
          <div style={{ position:'absolute', right:bp.isLarge?50:18, top:'50%',
            transform:'translateY(-50%)', fontSize:26,
            opacity:Math.min(1,(Math.abs(dragX)-20)/60),
            color:C.jade, pointerEvents:'none', zIndex:20,
            filter:`drop-shadow(0 0 10px ${C.jade})` }}>›</div>
        )}
        {isDragging && dragX > 20 && (
          <div style={{ position:'absolute', left:bp.isLarge?50:18, top:'50%',
            transform:'translateY(-50%)', fontSize:26,
            opacity:Math.min(1,(dragX-20)/60),
            color:C.aurora, pointerEvents:'none', zIndex:20,
            filter:`drop-shadow(0 0 10px #7BB8D4)` }}>‹</div>
        )}
        {/* Drag label */}
        {isDragging && (
          <div style={{ position:'absolute', top:8, left:'50%', transform:'translateX(-50%)',
            background: dragX>30?`#7BB8D422`:dragX<-30?`${C.jade}22`:`${C.border}33`,
            border:`1px solid ${dragX>30?C.aurora:dragX<-30?C.jade:C.border}44`,
            borderRadius:20, padding:'3px 14px', fontSize:10, fontWeight:700,
            color: dragX>30?C.aurora:dragX<-30?C.jade:C.nebula,
            pointerEvents:'none', zIndex:20, backdropFilter:'blur(6px)' }}>
            {dragX>50?'◀ Prev':dragX<-50?'Next ▶':'···'}
          </div>
        )}

        {/* Plain container — perspective here so rAF rotateY looks deep */}
        <div style={{ width:'100%', maxWidth:bp.isLarge?560:bp.isTablet?500:430,
          position:'relative', perspective:1200 }}>
          <Confetti active={confettiTrig}/>
          {shownCs?.status==='known' && (
            <div style={{ position:'absolute', inset:-3, borderRadius:26, zIndex:0,
              border:`2px solid ${C.jade}40`,
              boxShadow:`0 0 20px ${C.jade}20, 0 0 40px ${C.jade}10`,
              pointerEvents:'none', animation:'glowPulse 2s ease-in-out infinite' }}/>
          )}
          {shownCs?.status==='hard' && (
            <div style={{ position:'absolute', inset:-3, borderRadius:26, zIndex:0,
              border:`2px solid ${C.crimson}30`, boxShadow:`0 0 20px ${C.crimson}15`,
              pointerEvents:'none' }}/>
          )}
          {shownCard && (
            <FlashCard card={shownCard} cs={shownCs||cs} flipped={flipped} theme={theme||'sky'}
              outerRef={cardRef}
              onFlip={()=>{ if(!animState.current.busy) setFlipped(f=>!f); }}
              onStar={toggleStar} bp={bp} />
          )}
        </div>
      </div>

      {/* Gesture hint bar */}
      <div style={{ textAlign:'center', fontSize:9, color:C.dim, padding:'3px 0 5px',
        letterSpacing:1, flexShrink:0, display:'flex', justifyContent:'center', gap:12 }}>
        {[['←','Prev'],['→','Next'],['↑','Easy'],['↓','Hard'],['●','Flip']].map(([g,l])=>(
          <span key={g}><span style={{ color:C.nebula }}>{g}</span> {l}</span>
        ))}
      </div>

      {/* Controls */}
      <div style={{ padding:bp.isTablet?'10px 26px 14px':'8px 14px 12px',
        background:`${C.card}F7`, borderTop:`1px solid ${C.teal}40`, boxShadow:`0 -4px 16px ${C.aurora}1A, inset 0 1px 0 rgba(255,255,255,0.9)`, flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, marginBottom:8 }}>
          <RippleBtn onClick={()=>doNav(-1)}
            style={{ flex:1, background:`${C.aurora}1A`, color:C.auroraD,
              border:`1px solid ${C.aurora}66`, borderRadius:10, padding:'12px 0',
              fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s',
              fontFamily:"'Cinzel',serif", letterSpacing:'0.05em',
              boxShadow:`0 2px 12px rgba(201,168,76,0.12)` }}>
            ◀ Prev
          </RippleBtn>
          <RippleBtn onClick={()=>setFlipped(f=>!f)}
            style={{ flex:2.2,
              background:`linear-gradient(135deg, ${C.aurora}, ${C.violetD}, ${C.aurora})`,
              color:C.card, border:`1px solid ${C.aurora}99`, borderRadius:10,
              padding:'12px 0', fontSize:13, fontWeight:700, cursor:'pointer',
              fontFamily:"'Cinzel',serif", letterSpacing:'0.08em',
              boxShadow:`0 4px 20px ${C.aurora}59, inset 0 1px 0 ${C.card}4C`,
              transition:'all 0.2s' }}>
            {flipped?'↩ Front':'↻ Flip Card'}
          </RippleBtn>
          <RippleBtn onClick={()=>doNav(1)}
            style={{ flex:1, background:`${C.teal}1A`, color:C.tealD,
              border:`1px solid ${C.teal}66`, borderRadius:10, padding:'12px 0',
              fontSize:12, fontWeight:700, cursor:'pointer', transition:'all 0.2s',
              fontFamily:"'Cinzel',serif", letterSpacing:'0.05em',
              boxShadow:`0 2px 12px ${C.teal}33` }}>
            Next ▶
          </RippleBtn>
        </div>
        <div style={{ display:'flex', gap:7 }}>
          {[['hard','✗ Hard',C.crimson],['ok','≈ Review',C.amber],['known','✓ Easy',C.jade]].map(([s,l,c])=>(
            <RippleBtn key={s} onClick={()=>mark(s)}
              style={{ flex:1, background:`${c}15`, color:c, border:`1px solid ${c}50`,
                fontFamily:"'Cinzel',serif", letterSpacing:'0.04em',
                boxShadow:`0 2px 12px ${c}20`,
                borderRadius:14, padding:'12px 0', fontSize:bp.isLarge?13:12, fontWeight:900,
                cursor:'pointer', transition:'all 0.2s',
                boxShadow:`0 3px 10px ${c}30` }}>
              {l}
            </RippleBtn>
          ))}
          <RippleBtn onClick={toggleStar}
            style={{ background:cs?.starred?`${C.amber}22`:C.lifted,
              color:cs?.starred?C.amber:C.nebula,
              border:`1px solid ${cs?.starred?C.amber+'65':C.border}`,
              borderRadius:14, padding:'12px 15px', fontSize:22, cursor:'pointer',
              transition:'all 0.25s cubic-bezier(0.34,1.5,0.64,1)',
              boxShadow:cs?.starred?`0 4px 16px ${C.amber}50`:'none',
              textShadow:cs?.starred?`0 0 16px ${C.amber}`:'none',
              animation:cs?.starred?'heartBeat 0.5s ease':undefined }}>
            {cs?.starred?'★':'☆'}
          </RippleBtn>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   QUIZ VIEW — 3 modes + countdown + animated feedback
═══════════════════════════════════════════════════════════════════════════ */
function QuizView({ bp }) {
  const [qMode, setQMode]     = useState('meaning');
  const [q,     setQ]         = useState(null);
  const [opts,  setOpts]      = useState([]);
  const [sel,   setSel]       = useState(null);
  const [done,  setDone]      = useState(false);
  const [score, setScore]     = useState({c:0,w:0});
  const [streak,setStreak]    = useState(0);
  const [best,  setBest]      = useState(0);
  const [tLeft, setTLeft]     = useState(15);
  const [tiKey, setTiKey]     = useState(0);
  const [fx,    setFx]        = useState(null); // 'correct'|'wrong'|null
  const ivRef=useRef(), advRef=useRef();

  const genQ = useCallback((m) => {
    const md=m||qMode;
    const qk=KD[Math.floor(Math.random()*KD.length)];
    const others=[...KD].filter(x=>x.id!==qk.id).sort(()=>Math.random()-0.5).slice(0,3);
    setQ(qk); setOpts([...others,qk].sort(()=>Math.random()-0.5));
    setSel(null); setDone(false); setFx(null);
    setTLeft(15); setTiKey(k=>k+1);
    clearTimeout(advRef.current); clearInterval(ivRef.current);
  },[qMode]);

  useEffect(()=>{ genQ(); return()=>{ clearInterval(ivRef.current); clearTimeout(advRef.current); }; },[]);

  useEffect(()=>{
    if(done){ clearInterval(ivRef.current); return; }
    ivRef.current=setInterval(()=>{
      setTLeft(t=>{
        if(t<=1){ clearInterval(ivRef.current); setDone(true); setStreak(0); advRef.current=setTimeout(()=>genQ(),1800); return 0; }
        return t-1;
      });
    },1000);
    return()=>clearInterval(ivRef.current);
  },[tiKey,done]);

  const answer=opt=>{
    if(done) return;
    clearInterval(ivRef.current);
    setSel(opt.id); setDone(true);
    const ok=opt.id===q.id;
    setFx(ok?'correct':'wrong');
    setScore(s=>({c:s.c+(ok?1:0),w:s.w+(ok?0:1)}));
    if(ok){ const ns=streak+1; setStreak(ns); if(ns>best)setBest(ns); } else setStreak(0);
    advRef.current=setTimeout(()=>genQ(),1900);
  };

  if(!q) return <div style={{color:C.moonlight,padding:40,textAlign:'center'}}>Loading…</div>;

  const total=score.c+score.w;
  const acc=total>0?Math.round(score.c/total*100):0;
  const tp=tLeft/15;
  const timerColor=tp>0.5?C.jade:tp>0.25?C.amber:C.crimson;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'auto',
      padding:bp.isLarge?'16px 34px':bp.isTablet?'14px 22px':'12px 14px', gap:10,
      position:'relative' }}>

      {/* Full-screen feedback flash */}
      {fx && (
        <div style={{ position:'absolute', inset:0, zIndex:50, pointerEvents:'none',
          background:fx==='correct'?`${C.jade}12`:`${C.crimson}12`,
          animation:'fadeIn 0.15s ease both', borderRadius:0 }}/>
      )}

      {/* Timer bar */}
      <div style={{ height:5, background:C.border, borderRadius:3, overflow:'hidden', flexShrink:0 }}>
        <div style={{ height:'100%', borderRadius:3,
          background:`linear-gradient(90deg, ${timerColor}, ${timerColor}80)`,
          width:`${tp*100}%`, transition:'width 0.85s linear, background 0.4s',
          boxShadow:`0 0 10px ${timerColor}80` }}/>
      </div>

      {/* Score strip */}
      <Glass style={{ display:'flex', justifyContent:'space-around', padding:'14px 8px', flexShrink:0 }}>
        {[['✓','Correct',score.c,C.jade],['%','Accuracy',acc+'%',C.aurora],
          ['🔥','Streak',streak,C.amber],['🏆','Best',best,C.sakura],['⏱','Time',tLeft+'s',timerColor]].map(([ic,lb,vl,cl])=>(
          <div key={lb} style={{ textAlign:'center' }}>
            <div style={{ fontSize:22, fontWeight:900, color:cl, lineHeight:1,
              animation:lb==='Streak'&&streak>0?'pop 0.3s ease':undefined }}>{vl}</div>
            <div style={{ fontSize:9, color:C.nebula, marginTop:2 }}>{lb}</div>
          </div>
        ))}
      </Glass>

      {/* Mode buttons */}
      <div style={{ display:'flex', gap:7, flexShrink:0 }}>
        {[['meaning','漢 → Meaning'],['kanji','Meaning → 漢'],['reading','漢 → Reading']].map(([m,l])=>(
          <RippleBtn key={m} onClick={()=>{ setQMode(m); genQ(m); }}
            style={{ flex:1, background:qMode===m?`linear-gradient(135deg,#7BB8D4CC,#60A5C888)`:C.lifted,
              color:qMode===m?'#fff':C.starlight, border:`1px solid ${qMode===m?C.aurora+'80':C.border}`,
              borderRadius:13, padding:'10px 4px', fontSize:bp.isLarge?12:10, fontWeight:900,
              cursor:'pointer', transition:'all 0.25s', boxShadow:qMode===m?`0 4px 18px #7BB8D445`:'none' }}>
            {l}
          </RippleBtn>
        ))}
      </div>

      {/* Question card */}
      <Glass glow={C.aurora} style={{ padding:bp.isLarge?30:22, textAlign:'center', flexShrink:0,
        animation:'fadeUp 0.35s ease both' }}>
        <div style={{ fontSize:9, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:12 }}>
          {qMode==='meaning'?'WHAT DOES THIS KANJI MEAN?':qMode==='kanji'?'WHICH KANJI MATCHES?':'SELECT THE READING'}
        </div>
        {qMode!=='kanji' ? (
          <>
            <div style={{ fontSize:bp.isLarge?130:bp.isTablet?108:88, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif',
              color:C.moonlight, lineHeight:1,
              textShadow:`0 0 70px #7BB8D470, 0 0 140px #7BB8D425`, fontWeight:900,
              filter:`drop-shadow(0 0 30px #7BB8D460)` }}>{q.k}</div>
            <div style={{ fontSize:11, color:C.nebula, marginTop:6 }}>{q.st} strokes · {q.lv} · {q.cat}</div>
          </>
        ) : (
          <div style={{ fontSize:bp.isLarge?36:30, fontWeight:900, color:C.moonlight, lineHeight:1.3,
            textShadow:`0 0 20px #7BB8D440` }}>{q.m}</div>
        )}
      </Glass>

      {/* Options */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {opts.map(opt=>{
          const isC=opt.id===q.id, isSel=sel===opt.id;
          let bg=C.lifted, clr=C.moonlight, bdr=C.border, sh='none';
          if(done){
            if(isC)      {bg=`${C.jade}22`;clr=C.jade;bdr=`${C.jade}75`;sh=`0 4px 22px ${C.jade}45`;}
            else if(isSel){bg=`${C.crimson}22`;clr=C.crimson;bdr=`${C.crimson}75`;sh=`0 4px 22px ${C.crimson}45`;}
          }
          const label=qMode==='meaning'?opt.m:qMode==='kanji'?opt.k:(opt.on||opt.ku);
          return (
            <RippleBtn key={opt.id} onClick={()=>answer(opt)}
              style={{ background:bg, color:clr, border:`1.5px solid ${bdr}`, borderRadius:16,
                padding:qMode==='kanji'?'20px 8px':'15px 12px',
                fontSize:qMode==='kanji'?(bp.isLarge?48:38):(bp.isLarge?16:13),
                fontWeight:800, cursor:'pointer', transition:'all 0.28s',
                fontFamily:qMode==='kanji'?'serif,"Noto Sans JP"'  :'inherit',
                boxShadow:sh, textAlign:'center',
                display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                animation:done&&isC?'pop 0.35s ease both':undefined }}>
              {label}
              {done&&isC&&(
                <span style={{ fontSize:11, color:C.jade, fontFamily:'inherit' }}>
                  {qMode==='meaning'?`(${opt.k})`:qMode==='kanji'?`→ ${opt.m}`:`${opt.on}·${opt.ku}`}
                </span>
              )}
            </RippleBtn>
          );
        })}
      </div>

      {done && (
        <RippleBtn onClick={()=>genQ()}
          style={{ background:`linear-gradient(135deg,#7BB8D4,${C.jade}88)`,
            color:'#fff', border:'none', borderRadius:14, padding:15,
            fontSize:14, fontWeight:900, cursor:'pointer',
            boxShadow:`0 6px 28px #7BB8D455`, flexShrink:0,
            animation:'pop 0.35s ease both' }}>
          Next Question →
        </RippleBtn>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   WRITE VIEW — Canvas practice with improved feedback
═══════════════════════════════════════════════════════════════════════════ */
function WriteView({ bp }) {
  const [idx,       setIdx]      = useState(0);
  const [strokes,   setStrokes]  = useState(0);
  const [showGuide, setShow]     = useState(true);
  const [showGrid,  setGrid]     = useState(true);
  const [done,      setDone]     = useState(new Set());
  const [color,     setColor]    = useState(C.jade);
  const canvasRef=useRef(), drawing=useRef(false);

  const k = KD[idx%KD.length];
  const cSz = bp.isLarge?400:bp.isTablet?360:Math.min(bp.w-32, 310);

  const getPos=(e,cv)=>{
    const r=cv.getBoundingClientRect();
    const t=e.touches?.[0]||e.changedTouches?.[0];
    const cx=t?t.clientX:e.clientX, cy=t?t.clientY:e.clientY;
    return {x:(cx-r.left)*(cv.width/r.width), y:(cy-r.top)*(cv.height/r.height)};
  };
  const startDraw=e=>{ e.preventDefault(); const cv=canvasRef.current; const ctx=cv.getContext('2d'); const p=getPos(e,cv); ctx.beginPath(); ctx.moveTo(p.x,p.y); drawing.current=true; setStrokes(s=>s+1); };
  const draw=e=>{ e.preventDefault(); if(!drawing.current) return; const cv=canvasRef.current; const ctx=cv.getContext('2d'); const p=getPos(e,cv); ctx.strokeStyle=color; ctx.lineWidth=8; ctx.lineCap='round'; ctx.lineJoin='round'; ctx.shadowBlur=12; ctx.shadowColor=color; ctx.lineTo(p.x,p.y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const endDraw=e=>{ if(e)e.preventDefault(); drawing.current=false; const cv=canvasRef.current; if(cv){const ctx=cv.getContext('2d');ctx.beginPath();ctx.shadowBlur=0;} };
  const clearCanvas=()=>{ const cv=canvasRef.current; if(!cv)return; cv.getContext('2d').clearRect(0,0,cv.width,cv.height); setStrokes(0); };
  const nextK=(d=1)=>{ clearCanvas(); setDone(p=>new Set([...p,k.id])); setIdx(i=>(i+d+KD.length)%KD.length); setStrokes(0); };

  const match=strokes>0&&strokes===k.st, over=strokes>k.st;
  const COLORS=[C.jade,C.aurora,C.sakura,C.amber,C.teal,C.moonlight];

  return (
    <div style={{ flex:1, overflow:'auto', padding:bp.isLarge?'18px 34px':bp.isTablet?'14px 22px':'12px 14px',
      display:'flex', flexDirection:'column', gap:10 }}>

      {/* Header card */}
      <Glass animate style={{ padding:'14px 20px', display:'flex', alignItems:'center',
        justifyContent:'space-between', flexShrink:0 }}>
        <div>
          <div style={{ fontSize:10, color:C.nebula, letterSpacing:2, marginBottom:4 }}>WRITING PRACTICE</div>
          <div style={{ fontSize:11, color:C.starlight }}>
            Practiced: <span style={{ color:C.jade, fontWeight:900 }}>{done.size}</span> / {KD.length}
          </div>
          <div style={{ height:4, background:C.border, borderRadius:2, marginTop:6, width:120, overflow:'hidden' }}>
            <div style={{ height:'100%', width:`${done.size/KD.length*100}%`,
              background:`linear-gradient(90deg,${C.jade},#60A5C8)`,
              transition:'width 0.5s', boxShadow:`0 0 8px ${C.jade}60` }}/>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ fontSize:72, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif', color:C.moonlight, lineHeight:1,
            textShadow:`0 0 50px #7BB8D480` }}>{k.k}</div>
          <div>
            <div style={{ fontSize:20, fontWeight:900, color:C.moonlight }}>{k.m}</div>
            <div style={{ fontSize:11, color:C.nebula, marginTop:2 }}>{k.lv} · {k.st} strokes</div>
            <StrokeDots count={k.st} color={C.jade} size={6}/>
          </div>
        </div>
      </Glass>

      {/* Canvas */}
      <Glass style={{ padding:0, overflow:'hidden', position:'relative', flexShrink:0, borderRadius:20 }}>
        {/* Guide kanji */}
        {showGuide && (
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
            justifyContent:'center', pointerEvents:'none', userSelect:'none',
            fontSize:cSz*0.72, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif', color:C.jade,
            opacity:0.06, lineHeight:1, zIndex:1 }}>{k.k}</div>
        )}
        {/* Grid */}
        {showGrid && (
          <svg style={{ position:'absolute', inset:0, width:'100%', height:cSz, pointerEvents:'none', zIndex:2 }}
               viewBox={`0 0 ${cSz} ${cSz}`}>
            <line x1={cSz/2} y1={0} x2={cSz/2} y2={cSz} stroke={C.border} strokeWidth="1" strokeDasharray="5,5" opacity="0.5"/>
            <line x1={0} y1={cSz/2} x2={cSz} y2={cSz/2} stroke={C.border} strokeWidth="1" strokeDasharray="5,5" opacity="0.5"/>
            <line x1={cSz/4} y1={0} x2={cSz/4} y2={cSz} stroke={C.border} strokeWidth="0.5" opacity="0.2"/>
            <line x1={cSz*3/4} y1={0} x2={cSz*3/4} y2={cSz} stroke={C.border} strokeWidth="0.5" opacity="0.2"/>
            <line x1={0} y1={cSz/4} x2={cSz} y2={cSz/4} stroke={C.border} strokeWidth="0.5" opacity="0.2"/>
            <line x1={0} y1={cSz*3/4} x2={cSz} y2={cSz*3/4} stroke={C.border} strokeWidth="0.5" opacity="0.2"/>
          </svg>
        )}
        <canvas ref={canvasRef} width={cSz} height={cSz}
          style={{ width:'100%', height:cSz, display:'block', touchAction:'none',
            cursor:'crosshair', position:'relative', zIndex:3 }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}/>

        {/* Stroke counter */}
        <div style={{ position:'absolute', top:10, right:10, zIndex:4,
          background:`${C.abyss}E0`, borderRadius:11, padding:'5px 13px',
          border:`1.5px solid ${match?C.jade:over?C.crimson:C.border}`,
          boxShadow:match?`0 0 16px ${C.jade}60`:over?`0 0 16px ${C.crimson}50`:'none',
          transition:'all 0.3s' }}>
          <span style={{ fontSize:15, fontWeight:900,
            color:match?C.jade:over?C.crimson:C.starlight,
            animation:match?'pop 0.3s ease':undefined }}>{strokes}</span>
          <span style={{ fontSize:11, color:C.nebula }}> / {k.st}</span>
        </div>
        {/* Status badge */}
        {strokes>0 && (
          <div style={{ position:'absolute', bottom:10, left:10, zIndex:4,
            background:`${match?C.jade:over?C.crimson:C.amber}20`,
            border:`1px solid ${match?C.jade:over?C.crimson:C.amber}55`,
            borderRadius:9, padding:'4px 12px', fontSize:11, fontWeight:800,
            color:match?C.jade:over?C.crimson:C.amber,
            animation:match?'pop 0.3s ease':undefined }}>
            {match?'✓ Perfect stroke count!':over?'✗ Too many strokes':`${k.st-strokes} more strokes to go`}
          </div>
        )}
      </Glass>

      {/* Color picker */}
      <div style={{ display:'flex', gap:8, alignItems:'center', flexShrink:0 }}>
        <span style={{ fontSize:10, color:C.nebula, fontWeight:700 }}>INK:</span>
        {COLORS.map(c=>(
          <div key={c} onClick={()=>setColor(c)}
            style={{ width:22, height:22, borderRadius:11, background:c, cursor:'pointer',
              border:`2px solid ${color===c?C.moonlight:'transparent'}`,
              boxShadow:color===c?`0 0 12px ${c}, 0 0 24px ${c}60`:`0 0 6px ${c}50`,
              transform:color===c?'scale(1.2)':'scale(1)', transition:'all 0.2s' }}/>
        ))}
      </div>

      {/* Control buttons */}
      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
        <RippleBtn onClick={()=>nextK(-1)}
          style={{ flex:1, background:C.lifted, color:C.starlight, border:`1px solid ${C.border}`,
            borderRadius:13, padding:'12px 0', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          ← Prev
        </RippleBtn>
        <RippleBtn onClick={clearCanvas}
          style={{ flex:1.4, background:`${C.crimson}18`, color:C.crimson,
            border:`1px solid ${C.crimson}50`, borderRadius:13, padding:'12px 0',
            fontSize:12, fontWeight:900, cursor:'pointer' }}>
          ✕ Clear
        </RippleBtn>
        <RippleBtn onClick={()=>setShow(g=>!g)}
          style={{ flex:1.4, background:showGuide?`#7BB8D418`:C.lifted,
            color:showGuide?C.aurora:C.starlight, border:`1px solid ${showGuide?C.aurora+'55':C.border}`,
            borderRadius:13, padding:'12px 0', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          👁 Guide
        </RippleBtn>
        <RippleBtn onClick={()=>setGrid(g=>!g)}
          style={{ flex:1.2, background:showGrid?`#60A5C818`:C.lifted,
            color:showGrid?C.teal:C.starlight, border:`1px solid ${showGrid?C.teal+'55':C.border}`,
            borderRadius:13, padding:'12px 0', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          ⊞ Grid
        </RippleBtn>
        <RippleBtn onClick={()=>nextK(1)}
          style={{ flex:1, background:C.lifted, color:C.starlight, border:`1px solid ${C.border}`,
            borderRadius:13, padding:'12px 0', fontSize:12, fontWeight:700, cursor:'pointer' }}>
          Next →
        </RippleBtn>
      </div>

      {/* Info panel */}
      <Glass animate style={{ padding:'14px 18px', flexShrink:0 }}>
        <div style={{ fontSize:9, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:10 }}>
          KANJI INFO · {k.k} · {k.m.toUpperCase()}
        </div>
        <div style={{ fontSize:11, color:C.starlight, fontStyle:'italic', marginBottom:10 }}>
          💡 {k.mn}
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
          {k.on&&<span style={{ background:`${C.crimson}16`,color:'#FF9898',border:`1px solid ${C.crimson}40`,borderRadius:9,padding:'3px 11px',fontSize:11,fontWeight:800 }}>音 {k.on}</span>}
          {k.ku&&<span style={{ background:`${C.jade}14`,color:C.jadeL,border:`1px solid ${C.jade}40`,borderRadius:9,padding:'3px 11px',fontSize:11,fontWeight:800 }}>訓 {k.ku}</span>}
          <span style={{ background:`#7BB8D414`,color:C.aurora,border:`1px solid #7BB8D440`,borderRadius:9,padding:'3px 11px',fontSize:11 }}>
            Radical: <span style={{ fontFamily:'serif', fontSize:13, fontWeight:900 }}>{k.rad}</span>
          </span>
          <span style={{ background:`#60A5C814`,color:C.teal,border:`1px solid #60A5C840`,borderRadius:9,padding:'3px 11px',fontSize:11 }}>
            {k.lv} · {k.st} strokes
          </span>
        </div>
        <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
          {k.ex.map((ex,i)=>(
            <div key={i} style={{ background:`${C.lifted}99`,borderRadius:9,padding:'5px 12px',border:`1px solid ${C.border}` }}>
              <span style={{ color:C.moonlight,fontWeight:900,fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif',fontSize:13 }}>{ex.w}</span>
              <span style={{ color:C.nebula,fontSize:9,margin:'0 5px' }}>{ex.r}</span>
              <span style={{ color:C.jade,fontSize:11 }}>· {ex.e}</span>
            </div>
          ))}
        </div>
      </Glass>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SRS VIEW — Spaced Repetition System
═══════════════════════════════════════════════════════════════════════════ */
function SRSView({ cardStates, setCardStates, bp }) {
  const [srsData, setSrsData] = useState(()=>{
    const d={}; KD.forEach(k=>{ d[k.id]={interval:1,ease:2.5,due:Date.now(),reps:0}; }); return d;
  });
  const [current, setCurrent] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [reviewed, setReviewed] = useState(0);

  const dueCards = useMemo(()=>KD.filter(k=>srsData[k.id]?.due<=Date.now()), [srsData]);
  const cs = current ? cardStates[current.id] : {status:'new',starred:false};

  useEffect(()=>{ if(!current&&dueCards.length) setCurrent(dueCards[0]); },[dueCards]);

  const grade=(q)=>{ // q: 0=again, 1=hard, 2=good, 3=easy
    if(!current) return;
    setSrsData(d=>{
      const s={...d[current.id]};
      if(q===0){ s.interval=1; s.reps=0; s.ease=Math.max(1.3,s.ease-0.2); }
      else {
        const mult=[1.2,s.ease,s.ease+0.1][Math.min(q-1,2)];
        s.interval=s.reps<2?1:Math.round(s.interval*mult);
        s.reps+=1;
        s.ease=Math.max(1.3,s.ease+(q===1?-0.15:q===3?0.1:0));
      }
      s.due=Date.now()+s.interval*86400000;
      return {...d,[current.id]:s};
    });
    // update card status
    const stMap=['hard','hard','ok','known'];
    setCardStates(p=>({...p,[current.id]:{...p[current.id],status:stMap[q]||'ok'}}));
    setReviewed(r=>r+1);
    setFlipped(false);
    const nextIdx=dueCards.findIndex(k=>k.id===current.id)+1;
    setCurrent(dueCards[nextIdx]||null);
  };

  if(!current||dueCards.length===0) return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', padding:20, gap:16 }}>
      <div style={{ fontSize:80, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif',
        textShadow:`0 0 40px ${C.jade}80` }}>🎉</div>
      <Glass style={{ padding:'28px 24px', textAlign:'center', maxWidth:320 }}>
        <div style={{ fontSize:20, fontWeight:900, color:C.jade, marginBottom:8 }}>All Caught Up!</div>
        <div style={{ fontSize:13, color:C.starlight, lineHeight:1.6 }}>
          No cards due right now. You reviewed <span style={{ color:C.amber, fontWeight:700 }}>{reviewed}</span> cards this session.
        </div>
        <div style={{ fontSize:11, color:C.nebula, marginTop:12 }}>Check back later for more reviews</div>
      </Glass>
    </div>
  );

  const srs = srsData[current.id];
  const st  = cs?STATUS[cs.status]:STATUS.new;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* SRS Stats bar */}
      <div style={{ padding:'8px 16px', background:`${C.abyss}CC`, borderBottom:`1px solid ${C.border}`,
        display:'flex', gap:16, alignItems:'center', flexShrink:0 }}>
        <span style={{ fontSize:11, color:C.jade, fontWeight:800 }}>📋 {dueCards.length} due</span>
        <span style={{ fontSize:11, color:C.amber, fontWeight:700 }}>✓ {reviewed} reviewed</span>
        <span style={{ fontSize:11, color:C.aurora, fontWeight:700 }}>📅 Interval: {srs?.interval}d</span>
        <span style={{ fontSize:11, color:C.teal, fontWeight:700 }}>⚡ Ease: {srs?.ease?.toFixed(1)}</span>
      </div>

      {/* Card */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center',
        padding:bp.isLarge?'20px 44px':bp.isTablet?'14px 28px':'10px 14px' }}>
        <div style={{ width:'100%', maxWidth:bp.isLarge?560:bp.isTablet?500:430 }}>
          <FlashCard card={current} cs={cs} flipped={flipped} theme={theme||'sky'}
            onFlip={()=>setFlipped(f=>!f)} onStar={()=>{}} bp={bp}/>
        </div>
      </div>

      {/* SRS Grade buttons */}
      {!flipped ? (
        <div style={{ padding:'12px 16px', background:`${C.abyss}EC`, borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
          <RippleBtn onClick={()=>setFlipped(true)}
            style={{ width:'100%', background:`linear-gradient(135deg,#7BB8D4BB,${C.auroraD}DD)`,
              color:'#fff', border:`1px solid #7BB8D460`, borderRadius:14, padding:'14px 0',
              fontSize:14, fontWeight:900, cursor:'pointer', boxShadow:`0 5px 22px #7BB8D450` }}>
            Show Answer
          </RippleBtn>
        </div>
      ) : (
        <div style={{ padding:'12px 16px', background:`${C.abyss}EC`, borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ fontSize:9, color:C.nebula, textAlign:'center', marginBottom:8, letterSpacing:2 }}>
            RATE YOUR RECALL
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {[
              [0,'Again',C.crimson,'Forgot completely'],
              [1,'Hard',C.amber,'Got it, struggled'],
              [2,'Good',C.jade,'Remembered well'],
              [3,'Easy',C.teal,'Perfect recall'],
            ].map(([q,l,c,sub])=>(
              <RippleBtn key={q} onClick={()=>grade(q)}
                style={{ flex:1, background:`${c}18`, color:c, border:`1px solid ${c}55`,
                  borderRadius:14, padding:'10px 4px', cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                <span style={{ fontSize:12, fontWeight:900 }}>{l}</span>
                <span style={{ fontSize:8, color:C.nebula }}>{sub.split(' ')[0]}</span>
              </RippleBtn>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   BROWSE VIEW
═══════════════════════════════════════════════════════════════════════════ */
function BrowseView({ cardStates, bp }) {
  const [q,     setQ]      = useState('');
  const [filt,  setFilt]   = useState('all');
  const [catFilt,setCat]   = useState('all');
  const [sel,   setSel]    = useState(null);
  const cats = useMemo(()=>['all',...new Set(KD.map(k=>k.cat))],[]);

  const filtered = useMemo(()=>KD.filter(k=>{
    const cs=cardStates[k.id];
    const mQ=!q||k.k.includes(q)||k.m.toLowerCase().includes(q.toLowerCase())||k.on.includes(q)||k.ku.includes(q)||k.rad.includes(q);
    const mF=filt==='all'?true:cs?.status===filt||(filt==='starred'&&cs?.starred);
    const mC=catFilt==='all'||k.cat===catFilt;
    return mQ&&mF&&mC;
  }),[q,filt,catFilt,cardStates]);

  const selK=sel?KD.find(k=>k.id===sel):null;
  const selCS=selK?cardStates[selK.id]:null;
  const selSt=selCS?STATUS[selCS.status||'new']:STATUS.new;
  const gCol=bp.isLarge?'repeat(auto-fill,minmax(90px,1fr))':bp.isTablet?'repeat(auto-fill,minmax(80px,1fr))':'repeat(auto-fill,minmax(72px,1fr))';

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
      {/* Search */}
      <div style={{ padding:'10px 14px 8px', background:`${C.abyss}CC`, borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', background:C.lifted,
          border:`1px solid ${C.borderL}`, borderRadius:14, padding:'0 14px', marginBottom:8,
          boxShadow:`inset 0 2px 10px rgba(0,0,0,0.35)` }}>
          <span style={{ color:C.nebula, marginRight:8, fontSize:16 }}>🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)}
            placeholder="Search kanji, meaning, reading, radical…"
            style={{ flex:1, background:'none', border:'none', outline:'none',
              color:C.moonlight, fontSize:13, padding:'11px 0' }}/>
          {q&&<button onClick={()=>setQ('')} style={{ background:'none',border:'none',color:C.nebula,cursor:'pointer',fontSize:18 }}>×</button>}
        </div>
        {/* Status filter */}
        <div style={{ display:'flex', gap:5, overflowX:'auto', scrollbarWidth:'none', marginBottom:6 }}>
          {[['all','All'],['new','New'],['hard','Hard'],['ok','Review'],['known','Known'],['starred','★']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilt(v)}
              style={{ background:filt===v?STATUS[v==='starred'?'known':v==='all'?'new':v]?.color||C.aurora:C.lifted,
                color:filt===v?'#000':C.starlight, border:'none', borderRadius:20,
                padding:'4px 12px', fontSize:10, fontWeight:800, cursor:'pointer', flexShrink:0,
                boxShadow:filt===v?`0 2px 10px rgba(0,0,0,0.4)`:'none', transition:'all 0.2s' }}>
              {l}{filt===v?` (${filtered.length})`:''}
            </button>
          ))}
        </div>
        {/* Category filter */}
        <div style={{ display:'flex', gap:5, overflowX:'auto', scrollbarWidth:'none' }}>
          {cats.map(c=>(
            <button key={c} onClick={()=>setCat(c)}
              style={{ background:catFilt===c?`#60A5C830`:C.lifted,
                color:catFilt===c?C.teal:C.nebula, border:`1px solid ${catFilt===c?C.teal+'55':C.border}`,
                borderRadius:20, padding:'3px 10px', fontSize:10, fontWeight:700,
                cursor:'pointer', flexShrink:0, transition:'all 0.2s', textTransform:'capitalize' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex:1, overflow:'auto', padding:bp.isLarge?'14px 22px':'10px 12px' }}>
        <div style={{ display:'grid', gridTemplateColumns:gCol, gap:8 }}>
          {filtered.map((k,ki)=>{
            const cs=cardStates[k.id];
            const kst=STATUS[cs?.status||'new'];
            const isSel=k.id===sel;
            return (
              <button key={k.id} onClick={()=>setSel(k.id===sel?null:k.id)}
                style={{ background:isSel?`${kst.color}20`:C.card,
                  border:`1.5px solid ${isSel?kst.color+'85':C.border}`,
                  borderRadius:15, padding:'11px 4px', cursor:'pointer',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                  transition:'all 0.25s', position:'relative',
                  boxShadow:isSel?`0 6px 24px ${kst.color}45,inset 0 0 0 1px ${kst.color}25`:'none',
                  animation:`slideInUp 0.3s ${ki*0.02}s ease both` }}>
                {cs?.starred&&<span style={{ position:'absolute',top:3,right:5,fontSize:9,color:C.amber,textShadow:`0 0 8px ${C.amber}` }}>★</span>}
                <span style={{ fontSize:32, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif', color:C.moonlight, lineHeight:1,
                  textShadow:`0 0 16px ${kst.color}60` }}>{k.k}</span>
                <span style={{ fontSize:8, color:C.starlight, maxWidth:'90%', overflow:'hidden',
                  textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{k.m.split('/')[0]}</span>
                <div style={{ width:7,height:7,borderRadius:4,background:kst.color,
                  boxShadow:`0 0 7px ${kst.color}` }}/>
              </button>
            );
          })}
        </div>
        {filtered.length===0&&<div style={{ padding:40,textAlign:'center',color:C.nebula }}>No kanji found</div>}
      </div>

      {/* Detail panel */}
      {selK&&(
        <div style={{ borderTop:`1px solid ${C.border}`,
          background:`linear-gradient(180deg,${C.abyss}F8,${C.deep}FF)`,
          padding:'16px 20px', flexShrink:0, maxHeight:bp.isLarge?280:230, overflow:'auto',
          animation:'fadeUp 0.28s ease both' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:18 }}>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ fontSize:80, fontFamily:'serif,"Noto Sans JP"', color:C.moonlight,
                lineHeight:1, textShadow:`0 0 50px ${selSt.color}80` }}>{selK.k}</div>
              <StrokeDots count={selK.st} color={selSt.color} size={7}/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:22, fontWeight:900, color:C.moonlight, marginBottom:8 }}>{selK.m}</div>
              <div style={{ display:'flex', gap:7, flexWrap:'wrap', marginBottom:8 }}>
                {selK.on&&<span style={{ background:`${C.crimson}18`,color:'#FF9898',border:`1px solid ${C.crimson}40`,borderRadius:9,padding:'3px 12px',fontSize:12,fontWeight:800,fontFamily:'serif' }}>音 {selK.on}</span>}
                {selK.ku&&<span style={{ background:`${C.jade}14`,color:C.jadeL,border:`1px solid ${C.jade}40`,borderRadius:9,padding:'3px 12px',fontSize:12,fontWeight:800,fontFamily:'serif' }}>訓 {selK.ku}</span>}
                <span style={{ background:`#7BB8D414`,color:C.aurora,border:`1px solid #7BB8D440`,borderRadius:9,padding:'3px 12px',fontSize:12 }}>
                  Radical: <span style={{ fontFamily:'serif',fontSize:15,fontWeight:900 }}>{selK.rad}</span>
                </span>
                <span style={{ background:`${selSt.color}18`,color:selSt.color,border:`1px solid ${selSt.color}40`,borderRadius:9,padding:'3px 12px',fontSize:11,fontWeight:800 }}>{selSt.icon} {selSt.label}</span>
              </div>
              <div style={{ fontSize:11,color:C.starlight,fontStyle:'italic',marginBottom:8 }}>💡 {selK.mn}</div>
              <div style={{ display:'flex',gap:7,flexWrap:'wrap' }}>
                {selK.ex.map((ex,i)=>(
                  <div key={i} style={{ background:`${C.lifted}AA`,borderRadius:9,padding:'5px 12px',border:`1px solid ${C.border}` }}>
                    <span style={{ color:C.moonlight,fontWeight:900,fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif',fontSize:13 }}>{ex.w}</span>
                    <span style={{ color:C.nebula,fontSize:9,margin:'0 5px' }}>{ex.r}</span>
                    <span style={{ color:C.jade,fontSize:11 }}>{ex.e}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   STATS VIEW — Enhanced analytics + heatmap
═══════════════════════════════════════════════════════════════════════════ */
function StatsView({ cardStates, sessCorrect, sessWrong, sessOk, seen, sessionTime, bp }) {
  const total=KD.length;
  const known=Object.values(cardStates).filter(s=>s.status==='known').length;
  const hard=Object.values(cardStates).filter(s=>s.status==='hard').length;
  const ok=Object.values(cardStates).filter(s=>s.status==='ok').length;
  const newC=Object.values(cardStates).filter(s=>s.status==='new').length;
  const starred=Object.values(cardStates).filter(s=>s.starred).length;
  const pct=n=>total>0?n/total:0;
  const fmtT=s=>s<60?`${s}s`:`${Math.floor(s/60)}m ${s%60}s`;
  const breakdown=[
    {l:'Known', n:known, color:C.jade,   icon:'✓', emoji:'⭐'},
    {l:'Review',n:ok,    color:C.amber,  icon:'≈', emoji:'⚡'},
    {l:'Hard',  n:hard,  color:C.crimson,icon:'✗', emoji:'🔥'},
    {l:'New',   n:newC,  color:C.aurora, icon:'✦', emoji:'🌱'},
  ];

  // Simulate a study heatmap (7 weeks × 7 days)
  const heatmap=useMemo(()=>Array.from({length:49},(_,i)=>{
    const hash=(i*17+known*3+ok*7+hard*2)%10;
    return hash;
  }),[known,ok,hard]);

  // By category stats
  const catStats=useMemo(()=>{
    const cats={};
    KD.forEach(k=>{ const cs=cardStates[k.id]; if(!cats[k.cat])cats[k.cat]={total:0,known:0,color:C.teal}; cats[k.cat].total++; if(cs?.status==='known')cats[k.cat].known++; });
    return Object.entries(cats).map(([cat,d])=>({cat,...d,pct:d.known/d.total}));
  },[cardStates]);

  return (
    <div style={{ flex:1, overflow:'auto', padding:bp.isLarge?'16px 34px':bp.isTablet?'14px 22px':'12px 14px' }}>

      {/* PhD Banner */}
      <Glass glow={C.aurora} animate style={{ padding:'16px 20px', marginBottom:10,
        background:`linear-gradient(135deg,${C.card}F5,${C.slate}E8,#0A1C2E)` }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <div style={{ fontSize:48, fontFamily:'serif,"Noto Sans JP"',
            textShadow:`0 0 35px #7BB8D490,0 0 70px #60A5C840` }}>漢字</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:900, color:C.moonlight }}>PhD Study Edition</div>
            <div style={{ fontSize:10, color:C.nebula, marginTop:2 }}>JLPT N5–N1 · 2135 Kanji · Session Active</div>
            <div style={{ display:'flex', gap:14, marginTop:8, flexWrap:'wrap' }}>
              <span style={{ fontSize:11, color:C.teal, fontWeight:700 }}>⏱ {fmtT(sessionTime)}</span>
              <span style={{ fontSize:11, color:C.jade, fontWeight:700 }}>👁 {seen.size} reviewed</span>
              <span style={{ fontSize:11, color:C.amber, fontWeight:700 }}>★ {starred} starred</span>
              <span style={{ fontSize:11, color:C.aurora, fontWeight:700 }}>📈 {Math.round(pct(known)*100)}% mastered</span>
            </div>
          </div>
        </div>
      </Glass>

      {/* ── JLPT LEVEL TRACKER ── */}
      <Glass animate style={{ padding:'18px 20px', marginBottom:10,
        background:`linear-gradient(135deg,${C.card}F2,${C.slate}EA)` }}>
        <div style={{ fontSize:10, color:C.aurora, fontWeight:800, letterSpacing:2.5, marginBottom:16,
          display:'flex', alignItems:'center', gap:8 }}>
          <span style={{ display:'inline-block', width:20, height:1, background:`linear-gradient(90deg,#7BB8D4,transparent)` }}/>
          JLPT LEVEL PROGRESS
          <span style={{ display:'inline-block', width:20, height:1, background:`linear-gradient(270deg,#7BB8D4,transparent)` }}/>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[
            { lv:'N5', label:'N5 — Foundation',   color:C.teal, glow:'#38BDF860', desc:'Basic kanji · everyday life' },
            { lv:'N4', label:'N4 — Elementary',   color:C.jade, glow:'#0EA5E960', desc:'Common vocabulary · simple sentences' },
            { lv:'N3', label:'N3 — Intermediate', color:C.teal, glow:'#38BDF860', desc:'Newspaper headlines · daily conversation' },
            { lv:'N2', label:'N2 — Pre-Advanced',  color:C.violet, glow:'#818CF860', desc:'Business Japanese · complex texts' },
            { lv:'N1', label:'N1 — Advanced',      color:'#F472B6', glow:'#F472B660', desc:'Literary · academic · professional' },
          ].map(({ lv, label, color, glow, desc })=>{
            const lvKanji = KD.filter(k=>k.lv===lv);
            const lvTotal = lvKanji.length;
            const lvKnown = lvKanji.filter(k=>cardStates[k.id]?.status==='known').length;
            const lvHard  = lvKanji.filter(k=>cardStates[k.id]?.status==='hard').length;
            const lvOk    = lvKanji.filter(k=>cardStates[k.id]?.status==='ok').length;
            const pct     = lvTotal>0 ? lvKnown/lvTotal : 0;
            const pctHard = lvTotal>0 ? lvHard/lvTotal  : 0;
            const pctOk   = lvTotal>0 ? lvOk/lvTotal    : 0;
            return (
              <div key={lv} style={{ borderRadius:16,
                background:`linear-gradient(135deg, ${color}0A 0%, ${color}04 100%)`,
                border:`1px solid ${color}35`, padding:'14px 16px',
                boxShadow:`inset 0 1px 0 ${color}15, 0 4px 16px rgba(0,0,0,0.25)` }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <span style={{ background:`${color}22`, color:color, fontWeight:900,
                      fontSize:13, borderRadius:9, padding:'4px 12px',
                      border:`1px solid ${color}50`, boxShadow:`0 2px 8px ${glow}`,
                      animation:'levelBadgePop 0.5s ease both' }}>{lv}</span>
                    <div>
                      <div style={{ fontSize:12, fontWeight:800, color:'#E2E8F0' }}>{label}</div>
                      <div style={{ fontSize:9, color:'#94A3B8', marginTop:1 }}>{desc}</div>
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:20, fontWeight:900, color:color,
                      textShadow:`0 0 12px ${glow}`, lineHeight:1 }}>
                      {Math.round(pct*100)}<span style={{ fontSize:11, fontWeight:600, opacity:0.7 }}>%</span>
                    </div>
                    <div style={{ fontSize:9, color:'#94A3B8', marginTop:1 }}>{lvKnown}/{lvTotal}</div>
                  </div>
                </div>
                {/* Stacked progress bar: known / review / hard / new */}
                <div style={{ height:10, background:'rgba(255,255,255,0.06)', borderRadius:6,
                  overflow:'hidden', display:'flex', boxShadow:`inset 0 1px 3px rgba(0,0,0,0.4)` }}>
                  <div style={{ width:`${pct*100}%`, background:`linear-gradient(90deg,${color},${color}CC)`,
                    transition:'width 1s cubic-bezier(0.34,1.2,0.64,1)',
                    boxShadow:`0 0 10px ${glow}` }}/>
                  <div style={{ width:`${pctOk*100}%`, background:`linear-gradient(90deg,#F59E0B,#D97706)`,
                    transition:'width 1s 0.1s cubic-bezier(0.34,1.2,0.64,1)', opacity:0.8 }}/>
                  <div style={{ width:`${pctHard*100}%`, background:`linear-gradient(90deg,#EF4444,#DC2626)`,
                    transition:'width 1s 0.2s cubic-bezier(0.34,1.2,0.64,1)', opacity:0.7 }}/>
                </div>
                {/* Mini legend */}
                <div style={{ display:'flex', gap:14, marginTop:7, flexWrap:'wrap' }}>
                  {[[color,'Known',lvKnown],['#F59E0B','Review',lvOk],['#EF4444','Hard',lvHard],
                    ['#64748B','New',lvTotal-lvKnown-lvOk-lvHard]].map(([c,l,n])=>(
                    <span key={l} style={{ fontSize:9, color:c, display:'flex', alignItems:'center', gap:4 }}>
                      <span style={{ width:6,height:6,borderRadius:3,background:c,display:'inline-block',
                        boxShadow:`0 0 4px ${c}` }}/>
                      {l}: {n}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Glass>

      <div style={{ display:'grid', gridTemplateColumns:bp.isLarge?'1fr 1fr':'1fr', gap:10, marginBottom:10 }}>
        {/* Mastery ring */}
        <Glass animate style={{ padding:'18px 18px', display:'flex', alignItems:'center', gap:18 }}>
          <Ring pct={pct(known)} size={bp.isLarge?118:100} stroke={11}
            color={C.jade} bg={C.border} label="Mastery"
            value={`${Math.round(pct(known)*100)}%`} glowColor={C.jade}/>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:15, fontWeight:900, color:C.moonlight, marginBottom:4 }}>Overall Progress</div>
            <div style={{ fontSize:12, color:C.starlight, marginBottom:10 }}>
              <AnimNum value={known} color={C.jade}/> of {total} mastered
            </div>
            {breakdown.map(({l,n,color})=>(
              <div key={l} style={{ marginBottom:6 }}>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:10, marginBottom:2 }}>
                  <span style={{ color:C.nebula }}>{l}</span>
                  <span style={{ color, fontWeight:700 }}>{n}</span>
                </div>
                <div style={{ height:5, background:C.border, borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${pct(n)*100}%`, background:color,
                    borderRadius:3, transition:'width 0.8s ease', boxShadow:`0 0 8px ${color}60` }}/>
                </div>
              </div>
            ))}
          </div>
        </Glass>

        {/* Session stats */}
        <Glass animate style={{ padding:'18px 18px' }}>
          <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:12 }}>
            THIS SESSION
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[['✓ Easy',sessCorrect,C.jade],['✗ Hard',sessWrong,C.crimson],
              ['≈ Review',sessOk,C.amber],['👁 Seen',seen.size,C.teal]].map(([l,v,c])=>(
              <div key={l} style={{ background:C.lifted, borderRadius:13, padding:'12px 13px',
                border:`1px solid ${c}25`, boxShadow:`inset 0 0 0 1px ${c}12` }}>
                <div style={{ fontSize:26, fontWeight:900, color:c, lineHeight:1,
                  animation:'countUp 0.4s ease both' }}>
                  <AnimNum value={v} color={c}/>
                </div>
                <div style={{ fontSize:10, color:C.nebula, marginTop:2 }}>{l}</div>
              </div>
            ))}
          </div>
        </Glass>
      </div>

      {/* Visual rings */}
      <Glass animate style={{ padding:'18px 20px', marginBottom:10 }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:16 }}>
          VISUAL BREAKDOWN
        </div>
        <div style={{ display:'flex', justifyContent:'space-around', flexWrap:'wrap', gap:14 }}>
          {[...breakdown,{l:'Starred',n:starred,color:C.amber,emoji:'★'}].map(({l,n,color,emoji})=>(
            <div key={l} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
              <Ring pct={pct(n)} size={bp.isLarge?84:70} stroke={8}
                color={color} bg={C.border} label={l} value={n} glowColor={color}/>
            </div>
          ))}
        </div>
      </Glass>

      {/* Category breakdown */}
      <Glass animate style={{ padding:'18px 20px', marginBottom:10 }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:14 }}>
          PROGRESS BY CATEGORY
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {catStats.map(({cat,total:t,known:k,pct:p})=>{
            const c=[C.teal,C.jade,C.aurora,C.sakura,C.amber,C.violet,C.sapphire,C.moss][catStats.findIndex(x=>x.cat===cat)%8];
            return (
              <div key={cat}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5, fontSize:11 }}>
                  <span style={{ color:C.moonlight, fontWeight:700, textTransform:'capitalize' }}>{cat}</span>
                  <span style={{ color:c, fontWeight:800 }}>{k}/{t} <span style={{ color:C.nebula, fontWeight:400 }}>({Math.round(p*100)}%)</span></span>
                </div>
                <div style={{ height:8, background:C.border, borderRadius:4, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${p*100}%`, background:`linear-gradient(90deg,${c},${c}88)`,
                    borderRadius:4, transition:'width 0.9s ease', boxShadow:`0 0 8px ${c}60` }}/>
                </div>
              </div>
            );
          })}
        </div>
      </Glass>

      {/* Heatmap */}
      <Glass animate style={{ padding:'18px 20px', marginBottom:10 }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:14 }}>
          STUDY HEATMAP (SIMULATED)
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:4 }}>
          {heatmap.map((v,i)=>{
            const intensity=v/9;
            const c=intensity>0.6?C.jade:intensity>0.3?C.teal:intensity>0.1?`#60A5C850`:`${C.border}`;
            return (
              <div key={i} style={{ aspectRatio:'1', borderRadius:4, background:c,
                boxShadow:intensity>0.5?`0 0 6px ${C.jade}60`:'none',
                transition:'all 0.3s' }}/>
            );
          })}
        </div>
        <div style={{ display:'flex', gap:8, marginTop:10, alignItems:'center' }}>
          <span style={{ fontSize:9, color:C.nebula }}>Less</span>
          {[0.05,0.2,0.4,0.65,0.9].map((i,n)=>(
            <div key={n} style={{ width:10,height:10,borderRadius:2,
              background:i>0.6?C.jade:i>0.3?C.teal:i>0.1?`#60A5C850`:C.border }}/>
          ))}
          <span style={{ fontSize:9, color:C.nebula }}>More</span>
        </div>
      </Glass>

      {/* Kanji grid quick overview */}
      <Glass animate style={{ padding:'18px 20px' }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:14 }}>
          ALL 2135 KANJI — STATUS MAP
        </div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {KD.map(k=>{
            const cs=cardStates[k.id];
            const kst=STATUS[cs?.status||'new'];
            return (
              <div key={k.id} style={{ display:'flex', flexDirection:'column', alignItems:'center',
                gap:1, padding:'4px 6px', borderRadius:9,
                background:`${kst.color}12`, border:`1px solid ${kst.color}30` }}>
                <span style={{ fontSize:18, fontFamily:'serif,"Noto Sans JP"', color:C.moonlight,
                  lineHeight:1, textShadow:`0 0 8px ${kst.color}40` }}>{k.k}</span>
                <div style={{ width:5,height:5,borderRadius:3,background:kst.color }}/>
              </div>
            );
          })}
        </div>
      </Glass>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   ACHIEVEMENTS VIEW
═══════════════════════════════════════════════════════════════════════════ */
const ALL_ACHIEVEMENTS = [
  {id:'first',   icon:'🌱', name:'First Steps',     desc:'Review your first kanji',      req:cs=>Object.values(cs).some(s=>s.status!=='new')},
  {id:'ten',     icon:'🎯', name:'Getting Started',  desc:'Know 10 kanji',                req:cs=>Object.values(cs).filter(s=>s.status==='known').length>=10},
  {id:'twenty',  icon:'⚡', name:'Momentum',         desc:'Know 20 kanji',                req:cs=>Object.values(cs).filter(s=>s.status==='known').length>=20},
  {id:'half',    icon:'🌙', name:'Halfway There',    desc:'Know 35 kanji',                req:cs=>Object.values(cs).filter(s=>s.status==='known').length>=35},
  {id:'all',     icon:'🌟', name:'N5 Master',        desc:'Know all 70 kanji',            req:cs=>Object.values(cs).filter(s=>s.status==='known').length>=70},
  {id:'star5',   icon:'⭐', name:'Star Collector',   desc:'Bookmark 5 cards',             req:cs=>Object.values(cs).filter(s=>s.starred).length>=5},
  {id:'star20',  icon:'💫', name:'Night Sky',        desc:'Bookmark 20 cards',            req:cs=>Object.values(cs).filter(s=>s.starred).length>=20},
  {id:'natural', icon:'🌿', name:'Nature Reader',    desc:'Know all nature kanji',        req:cs=>KD.filter(k=>k.cat==='nature').every(k=>cs[k.id]?.status==='known')},
  {id:'numbers', icon:'🔢', name:'Number Wizard',    desc:'Know all number kanji',        req:cs=>KD.filter(k=>k.cat==='number').every(k=>cs[k.id]?.status==='known')},
  {id:'people',  icon:'👥', name:'People Person',    desc:'Know all people kanji',        req:cs=>KD.filter(k=>k.cat==='people').every(k=>cs[k.id]?.status==='known')},
  {id:'hard10',  icon:'💪', name:'Challenge Seeker', desc:'Mark 10 kanji as hard',        req:cs=>Object.values(cs).filter(s=>s.status==='hard').length>=10},
  {id:'scholar', icon:'🎓', name:'PhD Scholar',      desc:'Use the SRS system once',      req:()=>false},
];

function AchievementsView({ cardStates, bp }) {
  const unlocked = useMemo(()=>new Set(ALL_ACHIEVEMENTS.filter(a=>a.req(cardStates)).map(a=>a.id)),[cardStates]);
  return (
    <div style={{ flex:1, overflow:'auto', padding:bp.isLarge?'16px 34px':bp.isTablet?'14px 22px':'12px 14px' }}>
      <Glass animate style={{ padding:'16px 20px', marginBottom:12, textAlign:'center' }}>
        <div style={{ fontSize:32 }}>🏆</div>
        <div style={{ fontSize:18, fontWeight:900, color:C.moonlight, marginTop:4 }}>Achievements</div>
        <div style={{ fontSize:11, color:C.nebula, marginTop:4 }}>
          <span style={{ color:C.amber, fontWeight:800 }}>{unlocked.size}</span> / {ALL_ACHIEVEMENTS.length} unlocked
        </div>
        <div style={{ height:6, background:C.border, borderRadius:3, marginTop:12, overflow:'hidden' }}>
          <div style={{ height:'100%', width:`${unlocked.size/ALL_ACHIEVEMENTS.length*100}%`,
            background:`linear-gradient(90deg,${C.amber},${C.gold})`,
            borderRadius:3, transition:'width 0.8s', boxShadow:`0 0 12px ${C.amber}70` }}/>
        </div>
      </Glass>

      <div style={{ display:'grid', gridTemplateColumns:bp.isLarge?'1fr 1fr 1fr':bp.isTablet?'1fr 1fr':'1fr', gap:10 }}>
        {ALL_ACHIEVEMENTS.map((a,i)=>{
          const done=unlocked.has(a.id);
          return (
            <div key={a.id} style={{ background:done?`linear-gradient(135deg,${C.card}F5,${C.lifted}E0)`:C.card,
              border:`1.5px solid ${done?C.amber+'60':C.border}`,
              borderRadius:16, padding:'14px 16px', display:'flex', gap:12, alignItems:'center',
              boxShadow:done?`0 6px 24px ${C.amber}25`:'none',
              opacity:done?1:0.5, transition:'all 0.3s',
              animation:`fadeUp 0.4s ${i*0.04}s ease both` }}>
              <div style={{ fontSize:32, filter:done?undefined:'grayscale(1)',
                textShadow:done?`0 0 16px ${C.amber}80`:'none' }}>{a.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:13, fontWeight:900, color:done?C.moonlight:C.nebula }}>{a.name}</div>
                <div style={{ fontSize:10, color:done?C.starlight:C.dim, marginTop:2 }}>{a.desc}</div>
                {done&&<div style={{ fontSize:9, color:C.amber, fontWeight:800, marginTop:4 }}>✓ UNLOCKED</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   SETTINGS VIEW
═══════════════════════════════════════════════════════════════════════════ */
function SettingsView({ shuffled, setShuffled, mode, setMode, setDeckIdx, setFlipped,
                        resetProgress, rainMode, setRainMode, theme, setTheme, bp }) {
  return (
    <div style={{ flex:1, overflow:'auto', padding:bp.isLarge?'16px 34px':bp.isTablet?'14px 22px':'12px 14px',
      display:'flex', flexDirection:'column', gap:10 }}>

      {/* ── THEME PICKER ── */}
      <Glass animate style={{ padding:'20px 20px' }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:2,
          color:C.nebula, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
          🎨 <span>THEMES</span>
          <span style={{ marginLeft:'auto', fontSize:10, color:C.dim, fontWeight:500 }}>
            tap to apply
          </span>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
          {Object.entries(THEMES).map(([key, th])=>{
            const isActive = theme === key;
            return (
              <RippleBtn key={key} onClick={()=>setTheme(key)}
                style={{ position:'relative', borderRadius:16, padding:'14px 14px',
                  cursor:'pointer', overflow:'hidden', transition:'all 0.25s',
                  border: isActive ? `2px solid ${th.preview[0]}` : `1.5px solid ${th.dark?'rgba(255,255,255,0.12)':'rgba(0,0,0,0.10)'}`,
                  background: th.dark
                    ? `linear-gradient(145deg, ${th.C.card}, ${th.C.slate})`
                    : `linear-gradient(145deg, ${th.C.card}, ${th.C.lifted})`,
                  boxShadow: isActive
                    ? `0 0 0 3px ${th.preview[0]}40, 0 6px 24px ${th.preview[0]}30`
                    : `0 2px 8px rgba(0,0,0,0.12)`,
                }}>
                {/* Active check */}
                {isActive && (
                  <div style={{ position:'absolute', top:8, right:8,
                    width:20, height:20, borderRadius:10,
                    background:th.preview[0], display:'flex', alignItems:'center',
                    justifyContent:'center', fontSize:11, fontWeight:900,
                    color:'#fff', boxShadow:`0 2px 8px ${th.preview[0]}60`,
                    animation:'pop 0.3s cubic-bezier(0.34,1.5,0.64,1) both' }}>✓</div>
                )}
                {/* Colour swatches */}
                <div style={{ display:'flex', gap:4, marginBottom:10 }}>
                  {th.preview.slice(0,3).map((col,i)=>(
                    <div key={i} style={{ flex:1, height:6, borderRadius:3,
                      background:col,
                      boxShadow:`0 1px 4px ${col}50`,
                      animation:isActive?`pop 0.3s ${i*0.06}s ease both`:undefined }}/>
                  ))}
                </div>
                {/* Theme name */}
                <div style={{ fontSize:12, fontWeight:800,
                  color: th.dark ? '#fff' : '#1E3A5F',
                  marginBottom:2 }}>
                  {th.emoji} {th.name}
                </div>
                <div style={{ fontSize:10,
                  color: th.dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)' }}>
                  {isActive ? '● Active' : '○ Select'}
                </div>
              </RippleBtn>
            );
          })}
        </div>
      </Glass>

      {/* Brand */}
      <Glass animate style={{ padding:'26px 22px', textAlign:'center', position:'relative', overflow:'hidden',
        background:`linear-gradient(145deg,${C.card},${C.lifted})` }}>
        <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
          opacity:0.04, fontSize:240, fontFamily:'serif', color:C.jade, pointerEvents:'none' }}>漢</div>
        <div style={{ fontSize:68, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif', position:'relative',
          color: C.jade,
          textShadow:`0 0 24px ${C.jade}99, 0 0 48px ${C.aurora}66`,
          filter:`drop-shadow(0 0 20px ${C.jade}80)` }}>漢字</div>
        <div style={{ fontSize:22, fontWeight:900, color:C.moonlight, marginTop:4 }}>Kanji Flashcards</div>
        <div style={{ fontSize:12, color:C.nebula, marginTop:6 }}>JLPT N5–N1 · 2135 Kanji · PhD Study Edition</div>
        <div style={{ display:'flex', justifyContent:'center', gap:12, marginTop:16 }}>
          {[C.jade,C.aurora,C.teal,C.sakura,C.amber,C.violet].map((c,i)=>(
            <div key={i} style={{ width:10, height:10, borderRadius:5, background:c,
              boxShadow:`0 0 12px ${c},0 0 28px ${c}60`,
              animation:`pop 0.4s ${0.08+i*0.1}s ease both` }}/>
          ))}
        </div>
      </Glass>

      {/* Toggles */}
      {[
        {icon:'⇄', label:'Shuffle Mode', sub:shuffled?'Cards are randomized':'Sequential order', ctrl:<Toggle on={shuffled} onToggle={()=>setShuffled(s=>!s)}/>},
        {icon:'🌧️', label:'Rain Effect',  sub:rainMode?'Rain simulation active':'Background is clear', ctrl:<Toggle on={rainMode} onToggle={()=>setRainMode(r=>!r)}/>},
      ].map(r=>(
        <Glass key={r.label} animate style={{ padding:'16px 18px', display:'flex',
          justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap:13 }}>
            <span style={{ fontSize:26 }}>{r.icon}</span>
            <div>
              <div style={{ fontSize:13, color:C.moonlight, fontWeight:800 }}>{r.label}</div>
              <div style={{ fontSize:11, color:C.nebula, marginTop:1 }}>{r.sub}</div>
            </div>
          </div>
          {r.ctrl}
        </Glass>
      ))}

      {/* Voice picker */}
      <VoicePickerPanel/>

      {/* Study mode */}
      <Glass animate style={{ padding:'16px 18px' }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:12 }}>
          STUDY MODE
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
          {[['all','📚 All Cards'],['starred','⭐ Starred'],['unknown','❓ Unknown'],['known','✅ Known']].map(([v,l])=>(
            <RippleBtn key={v} onClick={()=>{ setMode(v); setDeckIdx(0); setFlipped(false); }}
              style={{ background:mode===v?`linear-gradient(135deg,${C.jade}CC,${C.teal}88)`:C.lifted,
                color:mode===v?C.card:C.starlight, border:`1px solid ${mode===v?C.jade+'80':C.border}`,
                borderRadius:13, padding:'12px 8px', fontSize:12, fontWeight:800,
                cursor:'pointer', transition:'all 0.25s', boxShadow:mode===v?`0 4px 18px ${C.jade}45`:'none' }}>
              {l}
            </RippleBtn>
          ))}
        </div>
      </Glass>

      {/* Gesture guide */}
      <Glass animate style={{ padding:'16px 18px' }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:12 }}>
          GESTURE GUIDE
        </div>
        {[['TAP CARD','Flip to answer'],['SWIPE ←','Previous card'],['SWIPE →','Next card'],
          ['SWIPE ↑','Mark as Easy'],['SWIPE ↓','Mark as Hard'],
          ['★','Bookmark card'],['↻ FLIP','Toggle card face'],['≈ REVIEW','Mark for review']].map(([k,v])=>(
          <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
            padding:'7px 0', borderBottom:`1px solid ${C.border}44` }}>
            <span style={{ fontSize:11, color:C.jade, fontWeight:900, letterSpacing:0.4 }}>{k}</span>
            <span style={{ fontSize:11, color:C.starlight }}>{v}</span>
          </div>
        ))}
      </Glass>

      {/* App info */}
      <Glass animate style={{ padding:'16px 18px' }}>
        <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:12 }}>
          APP FEATURES
        </div>
        {[
          ['📖 Flashcards','3D flip cards with mnemonics'],
          ['🧠 Quiz','3 modes with countdown timer'],
          ['✍️ Writing','Canvas practice with color ink'],
          ['📋 SRS','Spaced repetition system'],
          ['🗂️ Browse','Filter & search all 70 kanji'],
          ['📊 Stats','Heatmap + category analytics'],
          ['🏆 Achievements','12 unlockable badges'],
        ].map(([k,v])=>(
          <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${C.border}44` }}>
            <span style={{ fontSize:11, color:C.starlight }}>{k}</span>
            <span style={{ fontSize:11, color:C.jade, fontWeight:600 }}>{v}</span>
          </div>
        ))}
      </Glass>

      <RippleBtn onClick={resetProgress}
        style={{ background:`${C.crimson}14`, color:C.crimson,
          border:`1px solid ${C.crimson}50`, borderRadius:14, padding:16,
          fontSize:13, fontWeight:900, cursor:'pointer', transition:'all 0.2s' }}>
        ↺  Reset All Progress
      </RippleBtn>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   NAVIGATION
═══════════════════════════════════════════════════════════════════════════ */
const NAV = [
  {id:'study',   icon:'📖', label:'Study'   },
  {id:'quiz',    icon:'🧠', label:'Quiz'    },
  {id:'write',   icon:'✍️', label:'Write'   },
  {id:'srs',     icon:'📋', label:'SRS'     },
  {id:'browse',  icon:'🗂️', label:'Browse'  },
  {id:'stats',   icon:'📊', label:'Stats'   },
  {id:'achieve', icon:'🏆', label:'Awards'  },
  {id:'settings',icon:'⚙️', label:'Settings'},
];

function BottomNav({ tab, setTab }) {
  return (
    <div style={{ display:'flex', background:`${C.abyss}FA`,
      borderTop:`1px solid ${C.border}`,
      flexShrink:0, boxShadow:'0 -6px 28px rgba(0,0,0,0.6)',
      paddingBottom:'env(safe-area-inset-bottom,0px)' }}>
      {NAV.map(({id,icon,label})=>{
        const active=tab===id;
        return (
          <button key={id} onClick={()=>setTab(id)} style={{
            flex:1, background:'none', border:'none', padding:'7px 2px 10px',
            color:active?C.jade:C.nebula, cursor:'pointer', minWidth:0,
            display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            transition:'color 0.2s', position:'relative' }}>
            {active&&(
              <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)',
                width:28, height:3, background:`linear-gradient(90deg,#7BB8D4,${C.jade})`,
                borderRadius:'0 0 4px 4px', boxShadow:`0 0 14px ${C.jade}` }}/>
            )}
            <span style={{ fontSize:18, filter:active?`drop-shadow(0 0 8px ${C.jade})`:'none',
              transition:'filter 0.25s' }}>{icon}</span>
            <span style={{ fontSize:7.5, fontWeight:active?900:400, letterSpacing:0.2,
              opacity:active?1:0.7 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function SideNav({ tab, setTab, bp }) {
  const w=bp.isLarge?80:66;
  return (
    <div style={{ width:w, background:`${C.abyss}FA`, borderRight:`1px solid ${C.border}`,
      display:'flex', flexDirection:'column', alignItems:'center',
      padding:'12px 0', gap:3, flexShrink:0, boxShadow:'4px 0 24px rgba(0,0,0,0.4)' }}>
      <div style={{ fontSize:bp.isLarge?30:24, fontFamily:'serif,"Noto Sans JP"', color:C.jade,
        marginBottom:14, textShadow:`0 0 22px ${C.jade},0 0 44px #60A5C850`, lineHeight:1 }}>漢</div>
      {NAV.map(({id,icon,label})=>{
        const active=tab===id;
        return (
          <button key={id} onClick={()=>setTab(id)} style={{
            width:w-10, padding:'10px 0',
            background:active?`linear-gradient(145deg,${C.jade}1A,#60A5C80E)`:'none',
            border:active?`1px solid ${C.jade}50`:'1px solid transparent',
            borderRadius:15, cursor:'pointer', color:active?C.jade:C.nebula,
            display:'flex', flexDirection:'column', alignItems:'center', gap:2,
            transition:'all 0.25s',
            boxShadow:active?`0 3px 16px ${C.jade}30,inset 0 1px 0 rgba(255,255,255,0.07)`:'none' }}>
            <span style={{ fontSize:bp.isLarge?22:18, filter:active?`drop-shadow(0 0 9px ${C.jade})`:'none', transition:'filter 0.25s' }}>{icon}</span>
            <span style={{ fontSize:bp.isLarge?8:7.5, fontWeight:active?900:400, letterSpacing:0.2, opacity:active?1:0.7 }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   HEADER
═══════════════════════════════════════════════════════════════════════════ */
function Header({ known, total, sessionTime, seen, streak, bp }) {
  const fmtT=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,'0')}`;
  const pct=total>0?Math.round(known/total*100):0;
  const r=bp.isLarge?23:19, svgSz=r*2+8;
  const ringColor=pct>70?C.jade:pct>40?C.amber:C.aurora;
  return (
    <div style={{ background:`${C.abyss}FA`, borderBottom:`1px solid ${C.border}`,
      padding:bp.isLarge?'10px 24px':bp.isTablet?'10px 18px':'9px 14px',
      display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0,
      boxShadow:'0 2px 24px rgba(0,0,0,0.55)' }}>
      {/* Logo */}
      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
        <div style={{ fontSize:bp.isLarge?34:28, fontFamily:'"Zen Old Mincho","Shippori Mincho","Noto Serif JP",serif', lineHeight:1,
          textShadow:`0 0 28px #7BB8D490,0 0 56px #60A5C850,0 0 80px ${C.jade}25`,
          color:C.moonlight, animation:'glowPulse 4s ease-in-out infinite' }}>漢字</div>
        <div>
          <div style={{ fontSize:bp.isLarge?16:bp.isTablet?14:12, fontWeight:900, color:C.moonlight, lineHeight:1 }}>
            Kanji Flashcards
          </div>
          <div style={{ fontSize:9, color:C.nebula, marginTop:2, display:'flex', gap:8, alignItems:'center' }}>
            <span>⏱ {fmtT(sessionTime)}</span>
            <span>·</span>
            <span>👁 {seen.size}</span>
            {streak>0&&<><span>·</span><span style={{ color:C.amber }}>🔥{streak}</span></>}
            {bp.isTablet&&<><span>·</span><span style={{ color:C.jade, fontWeight:700 }}>{known}/{total}</span></>}
          </div>
        </div>
      </div>

      {/* Progress ring */}
      <div style={{ display:'flex', alignItems:'center', gap:bp.isTablet?12:8 }}>
        {bp.isLarge&&(
          <div style={{ textAlign:'right' }}>
            <div style={{ fontSize:11, color:ringColor, fontWeight:800 }}>{known} mastered</div>
            <div style={{ fontSize:9, color:C.nebula }}>{total-known} remaining</div>
          </div>
        )}
        <div style={{ position:'relative', width:svgSz, height:svgSz }}>
          <svg width={svgSz} height={svgSz} style={{ transform:'rotate(-90deg)' }}>
            <circle cx={svgSz/2} cy={svgSz/2} r={r} fill="none" stroke={C.border} strokeWidth={4.5}/>
            <circle cx={svgSz/2} cy={svgSz/2} r={r} fill="none" stroke={ringColor} strokeWidth={4.5}
              strokeDasharray={`${2*Math.PI*r*pct/100} ${2*Math.PI*r}`} strokeLinecap="round"
              style={{ transition:'stroke-dasharray 0.7s ease',
                filter:`drop-shadow(0 0 5px ${ringColor}90)` }}/>
          </svg>
          <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center',
            justifyContent:'center', fontSize:9, fontWeight:900, color:ringColor }}>
            {pct}%
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PERSISTENT STORAGE — works in Claude.ai (window.storage) AND when the
   app is downloaded & opened in a mobile browser (localStorage)
═══════════════════════════════════════════════════════════════════════════ */
const SAVE_KEY = 'kanji_ultimate_v1';

/* ═══════════════════════════════════════════════════════════════════════════
   TEXT-TO-SPEECH — ResponsiveVoice (online, real Japanese) + Web Speech fallback
   6 distinct Japanese voices mapped to the 6 UI presets
═══════════════════════════════════════════════════════════════════════════ */
window._kanjiVoiceCfg = window._kanjiVoiceCfg || { presetId:'f2' };

/* Inject ResponsiveVoice CDN once */
(function(){
  if(window._rvScriptAdded) return;
  window._rvScriptAdded = true;
  const s = document.createElement('script');
  s.src = 'https://code.responsivevoice.org/responsivevoice.js?key=FREE';
  s.async = true;
  document.head.appendChild(s);
})();

/*
  ResponsiveVoice Japanese voice names (all work without any API key on FREE tier):
    "Japanese Female"          — standard female
    "Japanese Male"            — standard male
  We simulate 6 distinct personalities via pitch + rate parameters.
  For devices without ResponsiveVoice (offline), we fall back to Web Speech API.
*/
const RV_PRESETS = {
  f1: { rvVoice:'Japanese Female', rate:0.6,  pitch:1.4,  desc:'Soft · slow & gentle'   },
  f2: { rvVoice:'Japanese Female', rate:0.8,  pitch:1.1,  desc:'Natural · standard pace' },
  f3: { rvVoice:'Japanese Female', rate:1.0,  pitch:1.2,  desc:'Clear · crisp & bright'  },
  m1: { rvVoice:'Japanese Male',   rate:0.55, pitch:0.6,  desc:'Deep · very slow'        },
  m2: { rvVoice:'Japanese Male',   rate:0.78, pitch:0.85, desc:'Natural · standard pace'  },
  m3: { rvVoice:'Japanese Male',   rate:0.95, pitch:0.95, desc:'Clear · confident pace'   },
};

function speak(text) {
  const presetId = (window._kanjiVoiceCfg || {}).presetId || 'f2';
  const cfg = RV_PRESETS[presetId] || RV_PRESETS.f2;

  /* ── Primary: ResponsiveVoice ── */
  if (window.responsiveVoice && window.responsiveVoice.voiceSupport()) {
    window.responsiveVoice.cancel();
    window.responsiveVoice.speak(text, cfg.rvVoice, {
      pitch: cfg.pitch,
      rate:  cfg.rate,
      volume: 1
    });
    return;
  }

  /* ── Fallback: Web Speech API ── */
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang  = 'ja-JP';
  u.rate  = cfg.rate;
  u.pitch = cfg.pitch;
  const voices = window.speechSynthesis.getVoices();
  const jp = voices.find(v => v.lang === 'ja-JP')
          || voices.find(v => v.lang.startsWith('ja'))
          || voices[0];
  if (jp) u.voice = jp;
  window.speechSynthesis.speak(u);
}

/* ─── VoicePickerPanel ──────────────────────────────────────────── */
const VOICE_PRESETS = [
  { id:'f1', label:'Female 1 — Soft',    gender:'F', icon:'👩',    desc:'Slow & gentle'    },
  { id:'f2', label:'Female 2 — Natural', gender:'F', icon:'👩\u200d🦱', desc:'Standard pace'   },
  { id:'f3', label:'Female 3 — Clear',   gender:'F', icon:'👩\u200d🦳', desc:'Crisp & bright'   },
  { id:'m1', label:'Male 1 — Deep',      gender:'M', icon:'👨',    desc:'Very slow & deep' },
  { id:'m2', label:'Male 2 — Natural',   gender:'M', icon:'👨\u200d🦱', desc:'Standard pace'   },
  { id:'m3', label:'Male 3 — Clear',     gender:'M', icon:'👨\u200d🦳', desc:'Confident pace'   },
];

function VoicePickerPanel() {
  const [selPreset, setSelPreset] = useState(
    ()=>{ try{ return localStorage.getItem('kanji_voice_preset')||'f2'; }catch(e){ return 'f2'; } }
  );
  const [playing,  setPlaying]  = useState(null);
  const [rvReady,  setRvReady]  = useState(false);

  // Poll until ResponsiveVoice loads (usually <2s on wifi)
  useEffect(()=>{
    const iv = setInterval(()=>{
      if(window.responsiveVoice && window.responsiveVoice.voiceSupport()){
        setRvReady(true);
        clearInterval(iv);
      }
    }, 300);
    setTimeout(()=>clearInterval(iv), 12000); // stop polling after 12s
    return ()=>clearInterval(iv);
  },[]);

  // Apply saved preset on mount
  useEffect(()=>{
    window._kanjiVoiceCfg = { presetId: selPreset };
  },[]);

  const handlePreset = (preset) => {
    setSelPreset(preset.id);
    window._kanjiVoiceCfg = { presetId: preset.id };
    try{ localStorage.setItem('kanji_voice_preset', preset.id); }catch(e){}
    setPlaying(preset.id);
    speak('こんにちは、漢字を勉強しましょう');
    setTimeout(()=>setPlaying(null), 3000);
  };

  const statusColor  = rvReady ? C.jade   : C.amber;
  const statusIcon   = rvReady ? '🌐'      : '⏳';
  const statusTitle  = rvReady ? 'ONLINE JAPANESE VOICE READY' : 'LOADING JAPANESE VOICE…';
  const statusDesc   = rvReady
    ? 'Authentic Japanese TTS · tap any style to preview'
    : 'Connecting to voice server (needs internet)…';

  return (
    <Glass animate style={{ padding:'18px 18px' }}>
      <div style={{ fontSize:10, color:C.nebula, fontWeight:800, letterSpacing:2, marginBottom:8 }}>
        🔊 VOICE SETTINGS
      </div>

      {/* Status banner */}
      <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:14,
        background:`${statusColor}15`, border:`1px solid ${statusColor}45`,
        borderRadius:10, padding:'9px 13px' }}>
        <span style={{ fontSize:16 }}>{statusIcon}</span>
        <div>
          <div style={{ fontSize:10, fontWeight:800, color:statusColor, letterSpacing:0.5 }}>
            {statusTitle}
          </div>
          <div style={{ fontSize:9, color:C.nebula, marginTop:1 }}>{statusDesc}</div>
        </div>
      </div>

      {/* 6 Voice preset tiles */}
      <div style={{ fontSize:10, color:C.jade, fontWeight:700, letterSpacing:1, marginBottom:8 }}>
        VOICE STYLE — tap to preview 🔊
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:7 }}>
        {VOICE_PRESETS.map(p => {
          const active = selPreset === p.id;
          const isF    = p.gender === 'F';
          const col    = isF ? C.sakura : C.teal;
          const cfg    = RV_PRESETS[p.id];
          return (
            <RippleBtn key={p.id} onClick={()=>handlePreset(p)}
              style={{
                background: active ? `${col}28` : C.lifted,
                border:`1px solid ${active ? col+'70' : C.border}`,
                borderRadius:12, padding:'10px 6px',
                display:'flex', flexDirection:'column', alignItems:'center', gap:3,
                cursor:'pointer', transition:'all 0.2s',
                boxShadow: active ? `0 4px 14px ${col}40` : 'none',
                opacity: playing && playing!==p.id ? 0.6 : 1,
              }}>
              <span style={{ fontSize:22 }}>{p.icon}</span>
              <span style={{ fontSize:9, color:active?col:C.starlight, fontWeight:800,
                letterSpacing:0.3, textAlign:'center' }}>
                {isF?'♀':'♂'} {p.label.split('—')[1].trim()}
              </span>
              <span style={{ fontSize:8, color:active?col+'CC':C.nebula, textAlign:'center', lineHeight:1.3 }}>
                {p.desc}
              </span>
              <span style={{ fontSize:8, color:C.nebula }}>
                {cfg.rate}× · pitch {cfg.pitch}
              </span>
              {active && playing!==p.id &&
                <span style={{ fontSize:8, color:col }}>● active</span>}
              {playing===p.id &&
                <span style={{ fontSize:8, color:col, animation:'pulse 0.6s ease infinite' }}>▶ playing…</span>}
            </RippleBtn>
          );
        })}
      </div>

      <div style={{ fontSize:9, color:C.nebula, textAlign:'center',
        marginTop:12, lineHeight:1.7, borderTop:`1px solid ${C.border}`, paddingTop:8 }}>
        Powered by ResponsiveVoice · Real Japanese pronunciation<br/>
        No voice downloads needed · Works on any device with internet
      </div>
    </Glass>
  );
}

function SpeakerBtn({ text, lang='ja-JP', size=16, color, style={} }) {
  const [active, setActive] = useState(false);
  const fire = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setActive(true);
    speak(text);
    setTimeout(() => setActive(false), 1400);
  };
  return (
    <button
      data-speaker="1"
      onClick={fire}
      onTouchStart={e => { e.stopPropagation(); e.preventDefault(); }}
      onTouchEnd={e => { e.stopPropagation(); e.preventDefault(); fire(e); }}
      style={{
        background: active ? `${color||'#60A5C8'}30` : 'transparent',
        border: `1px solid ${active ? (color||'#60A5C8')+'80' : 'transparent'}`,
        borderRadius: 7, padding: '3px 5px', cursor: 'pointer',
        fontSize: size, lineHeight: 1, transition: 'all 0.2s ease',
        transform: active ? 'scale(1.25)' : 'scale(1)',
        boxShadow: active ? `0 0 10px ${color||'#60A5C8'}60` : 'none',
        flexShrink: 0, display:'inline-flex', alignItems:'center', justifyContent:'center',
        ...style
      }}
    >
      {active ? '🔊' : '🔈'}
    </button>
  );
}

function loadSavedProgress() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return null;
}

async function persistProgress(data) {
  const json = JSON.stringify(data);
  try { localStorage.setItem(SAVE_KEY, json); } catch(e) {}
  try { if (window.storage) await window.storage.set(SAVE_KEY, json); } catch(e) {}
}

async function loadFromArtifactStorage() {
  try {
    if (window.storage) {
      const r = await window.storage.get(SAVE_KEY);
      if (r?.value) return JSON.parse(r.value);
    }
  } catch(e) {}
  return null;
}

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════════════ */
export default function KanjiApp() {
  const bp = useBreakpoint();

  // ── Load saved progress synchronously from localStorage (works on downloaded Android app) ──
  const _saved = loadSavedProgress();

  const [splash,       setSplash]      = useState(true);
  const [tab,          setTab]         = useState(_saved?.tab || 'study');
  const [mode,         setMode]        = useState(_saved?.mode || 'all');
  const [shuffle,      setShuffle]     = useState(_saved?.shuffle || false);
  const [flipped,      setFlipped]     = useState(false);
  const [deckIdx,      setDeckIdx]     = useState(_saved?.deckIdx || 0);
  const [confetti,     setConfetti]    = useState(false);
  const [rainMode,     setRainMode]    = useState(_saved?.rainMode || false);
  const [theme,        setThemeKey]    = useState(_saved?.theme || 'sky');

  const applyThemeAndRender = useCallback((key) => {
    applyTheme(key);
    setThemeKey(key);
  }, []);
  const [toasts,       setToasts]      = useState([]);
  const [achPop,       setAchPop]      = useState(null);
  const [streak,       setStreak]      = useState(_saved?.streak || 0);
  const [prevAchs,     setPrevAchs]    = useState(new Set(_saved?.prevAchs || []));

  const [cardStates, setCardStates] = useState(()=>{
    if (_saved?.cardStates) {
      const s={}; KD.forEach(k=>{ s[k.id]=_saved.cardStates[k.id]||{starred:false,status:'new'}; }); return s;
    }
    const s={}; KD.forEach(k=>{ s[k.id]={starred:false,status:'new'}; }); return s;
  });
  const [sessCorrect,setSessCorrect]=useState(_saved?.sessCorrect||0);
  const [sessWrong,  setSessWrong]  =useState(_saved?.sessWrong||0);
  const [sessOk,     setSessOk]     =useState(_saved?.sessOk||0);
  const [seen,       setSeen]       =useState(new Set(_saved?.seen||[]));
  const [sessionTime,setSessionTime]=useState(0);
  const [progressLoaded, setProgressLoaded] = useState(!!_saved);

  // ── Inject font <link> tags — APK-safe approach ──
  // serif = Android built-in Noto Serif CJK JP (works offline, always available)
  // Google Fonts loaded as enhancement; display=swap prevents blank flash
  useEffect(()=>{
    // Ensure charset meta exists (critical for CJK in WebView)
    if (!document.querySelector('meta[charset]')) {
      const m = document.createElement('meta'); m.setAttribute('charset','UTF-8');
      document.head.insertBefore(m, document.head.firstChild);
    }
    const fonts = [
      'https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;700;900&display=swap',
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&display=swap',
    ];
    // Preconnect
    ['https://fonts.googleapis.com','https://fonts.gstatic.com'].forEach(href=>{
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l=document.createElement('link'); l.rel='preconnect'; l.href=href;
        if (href.includes('gstatic')) l.crossOrigin='anonymous';
        document.head.appendChild(l);
      }
    });
    fonts.forEach(href=>{
      if (!document.querySelector(`link[href="${href}"]`)) {
        const l=document.createElement('link'); l.rel='stylesheet'; l.href=href;
        document.head.appendChild(l);
      }
    });
    // Pre-warm — forces Android WebView to cache the glyph for 一 through 龥
    if (document.fonts && document.fonts.load) {
      document.fonts.load('900 80px "Noto Serif JP"', '漢字一二三');
    }
    // Also try to load from artifact storage (for claude.ai sandbox sessions)
    loadFromArtifactStorage().then(aData=>{
      if (aData && !_saved) {
        // Only apply artifact data if localStorage had nothing
        if (aData.cardStates) setCardStates(()=>{ const s={}; KD.forEach(k=>{ s[k.id]=aData.cardStates[k.id]||{starred:false,status:'new'}; }); return s; });
        if (aData.deckIdx !== undefined) setDeckIdx(aData.deckIdx);
        if (aData.tab) setTab(aData.tab);
        if (aData.theme) { applyTheme(aData.theme); setThemeKey(aData.theme); }
        if (aData.mode) setMode(aData.mode);
        if (aData.streak) setStreak(aData.streak);
        if (aData.seen) setSeen(new Set(aData.seen));
        if (aData.sessCorrect) setSessCorrect(aData.sessCorrect);
        if (aData.sessWrong) setSessWrong(aData.sessWrong);
        if (aData.sessOk) setSessOk(aData.sessOk);
        setProgressLoaded(true);
      }
    });
  },[]);

  // Timer
  useEffect(()=>{ const t=setInterval(()=>setSessionTime(s=>s+1),1000); return()=>clearInterval(t); },[]);

  // Update body background on theme change
  useEffect(()=>{
    const bg = THEMES[theme]?.bg?.base || THEMES.sky.bg.base;
    // Extract first colour from gradient for body bg
    const col = bg.match(/#[A-Fa-f0-9]{6}/)?.[0] || '#EFF6FF';
    document.body.style.background = col;
  }, [theme]);

  // Achievement checker
  useEffect(()=>{
    ALL_ACHIEVEMENTS.forEach(a=>{
      if(!prevAchs.has(a.id)&&a.req(cardStates)){
        setPrevAchs(p=>new Set([...p,a.id]));
        setAchPop(a);
        addToast({icon:a.icon,title:'Achievement!',msg:a.name,color:C.amber});
      }
    });
  },[cardStates]);

  // ── Auto-save progress whenever key state changes ──
  useEffect(()=>{
    const data = {
      cardStates, deckIdx, tab, mode, shuffle, rainMode, theme, streak,
      sessCorrect, sessWrong, sessOk,
      seen: [...seen],
      prevAchs: [...prevAchs],
    };
    persistProgress(data);
  },[cardStates, deckIdx, tab, mode, shuffle, rainMode, theme, streak, sessCorrect, sessWrong, sessOk, seen, prevAchs]);

  const addToast=(t)=>{
    const id=Date.now();
    setToasts(ts=>[...ts,{...t,id,leaving:false}]);
    setTimeout(()=>setToasts(ts=>ts.filter(x=>x.id!==id)),3500);
  };
  const removeToast=id=>setToasts(ts=>ts.filter(x=>x.id!==id));

  // Deck
  const deck=useMemo(()=>{
    let d;
    if(mode==='starred')  d=KD.filter(k=>cardStates[k.id]?.starred);
    else if(mode==='unknown') d=KD.filter(k=>['new','hard'].includes(cardStates[k.id]?.status));
    else if(mode==='known')   d=KD.filter(k=>cardStates[k.id]?.status==='known');
    else d=[...KD];
    if(!d.length) d=[...KD];
    if(shuffle) d=[...d].sort(()=>Math.random()-0.5);
    return d;
  },[mode,cardStates,shuffle]);

  const safeIdx=Math.min(deckIdx,deck.length-1);
  const card=deck[safeIdx]||null;
  const cs=card?cardStates[card.id]:null;

  const navigate=useCallback((dir)=>{
    setFlipped(false);
    setDeckIdx(i=>{ const next=(i+dir+deck.length)%deck.length; setSeen(s=>new Set([...s,deck[next]?.id].filter(Boolean))); return next; });
  },[deck]);

  const mark=useCallback((status)=>{
    if(!card) return;
    setCardStates(p=>({...p,[card.id]:{...p[card.id],status}}));
    setSeen(s=>new Set([...s,card.id]));
    if(status==='hard')  { setSessWrong(w=>w+1); setStreak(0); addToast({icon:'🔥',title:'Hard',msg:card.k+' — keep practising!',color:C.crimson}); }
    if(status==='ok')    { setSessOk(o=>o+1); addToast({icon:'⚡',title:'Review',msg:card.k+' — review soon',color:C.amber}); }
    if(status==='known') {
      setSessCorrect(c=>c+1); setStreak(s=>{const ns=s+1;return ns;});
      setConfetti(true); setTimeout(()=>setConfetti(false),1000);
      addToast({icon:'⭐',title:'Known!',msg:card.k+' — '+card.m,color:C.jade});
    }
    setTimeout(()=>navigate(1),320);
  },[card,navigate]);

  const toggleStar=useCallback(()=>{
    if(!card) return;
    setCardStates(p=>({...p,[card.id]:{...p[card.id],starred:!p[card.id].starred}}));
  },[card]);

  const resetProgress=()=>{
    if(!window.confirm('Reset ALL progress?')) return;
    const s={}; KD.forEach(k=>{ s[k.id]={starred:false,status:'new'}; });
    setCardStates(s); setSessCorrect(0); setSessWrong(0); setSessOk(0);
    setSeen(new Set()); setSessionTime(0); setStreak(0);
  };

  const totalKnown=Object.values(cardStates).filter(s=>s.status==='known').length;

  if(splash) return <SplashScreen onDone={()=>setSplash(false)}/>;

  return (
    <div key={theme} style={{ position:'relative', width:'100%', height:'100vh',
      display:'flex', flexDirection:'column',
      fontFamily:'"Noto Sans JP","SF Pro Display","Segoe UI",system-ui,sans-serif',
      overflow:'hidden', userSelect:'none', touchAction:'pan-y',
      background: THEMES[theme]?.bg?.base?.match(/#[A-Fa-f0-9]{6}/)?.[0] || C.void }}>

      <NatureBG rainMode={rainMode} themeBg={THEMES[theme]?.bg}/>
      <SparkleField/>

      {/* Toast system */}
      <ToastContainer toasts={toasts} removeToast={removeToast}/>

      {/* Achievement popup */}
      {achPop&&<AchievementPopup achievement={achPop} onDone={()=>setAchPop(null)}/>}

      {/* App shell */}
      <div style={{ position:'relative', zIndex:1, flex:1, display:'flex',
        flexDirection:'column', overflow:'hidden',
        maxWidth:bp.isLarge?1200:'100%', margin:'0 auto', width:'100%' }}>

        <Header known={totalKnown} total={KD.length}
          sessionTime={sessionTime} seen={seen} streak={streak} bp={bp}/>

        <div style={{ flex:1, display:'flex', overflow:'hidden' }}>
          {bp.isTablet&&<SideNav tab={tab} setTab={setTab} bp={bp}/>}

          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden',
            animation:'fadeIn 0.3s ease' }} key={tab}>
            {tab==='study' && (
              <StudyView deck={deck} deckIdx={safeIdx} card={card} cs={cs} theme={theme}
                flipped={flipped} setFlipped={setFlipped} navigate={navigate}
                mark={mark} toggleStar={toggleStar} mode={mode} setMode={setMode}
                setDeckIdx={setDeckIdx} shuffled={shuffle} setShuffled={setShuffle}
                bp={bp} confettiTrig={confetti}/>
            )}
            {tab==='quiz'    && <QuizView bp={bp}/>}
            {tab==='write'   && <WriteView bp={bp}/>}
            {tab==='srs'     && <SRSView cardStates={cardStates} setCardStates={setCardStates} bp={bp}/>}
            {tab==='browse'  && <BrowseView cardStates={cardStates} bp={bp}/>}
            {tab==='stats'   && <StatsView cardStates={cardStates} sessCorrect={sessCorrect}
              sessWrong={sessWrong} sessOk={sessOk} seen={seen} sessionTime={sessionTime} bp={bp}/>}
            {tab==='achieve' && <AchievementsView cardStates={cardStates} bp={bp}/>}
            {tab==='settings'&& <SettingsView shuffled={shuffle} setShuffled={setShuffle}
              mode={mode} setMode={setMode} setDeckIdx={setDeckIdx} setFlipped={setFlipped}
              resetProgress={resetProgress} rainMode={rainMode} setRainMode={setRainMode}
              theme={theme} setTheme={applyThemeAndRender} bp={bp}/>}
          </div>
        </div>

        {!bp.isTablet&&<BottomNav tab={tab} setTab={setTab}/>}
      </div>
    </div>
  );
}
