"use strict"

	var daysNames=[];
	var monthsNames=[];
	monthsNames["en"]=["january","february","march","april","may","june","july","august","september","october","november","december"];
	monthsNames["en-GB"]=monthsNames["en"];
	monthsNames["fr"]=["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
	monthsNames["fr-FR"]=monthsNames["fr"];

	daysNames["en"]=["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
	daysNames["en-GB"]=daysNames["en"];
	daysNames["fr"]=["dimanche","lundi","mardi","mercredi","jeudi","vendredi","samedi"];
	daysNames["fr-FR"]=daysNames["fr"];

window.dateMgr={
	fmt: function fmt(){return ["Weeks","Days","Hours","Minutes","Seconds","Milliseconds"]},
	daysNames:function daysNames(d){
		var _name=window.daysNames[this.lang];
		var _d=(!VarIsDef(d))?this:d;	

		return _name[(className(_d)==='DATE')?_d.getDay():(className(_d)==='NUMBER')?_d:(isNaN(_d))?-1:parseFloat(_d)] || '';
	},
	monthsNames:function monthsNames(d){
		var _name=window.monthsNames[this.langUse] || window.monthsNames['en'];
		var _d=(!VarIsDef(d))?this:d;		

		return _name[(className(_d)==='DATE')?_d.getMonth():(className(_d)==='NUMBER')?_d:(isNaN(_d))?-1:parseFloat(_d)] || _name;
	},
	add:function add(d)	{

	},
	holidays:function holidays(d){
		var _holyday=function(y,m,d,label){return {date:new Date(y,m,d),label:label};}
		var _d=d || this;
		var Y=(className(_d)==='DATE')?_d.getFullYear():(className(_d)==='NUMBER')?_d:(isNaN(_d))?0:parseFloat(_d);
		var easter=new Date().easter(d)
		return [
				new _holyday(Y,"00","01","jour de l'an"),	
				new _holyday(Y,"04","01","jour du travail"),
				new _holyday(Y,"04","08","armistice 1945"),
				new _holyday(Y,"06","14","fête nationale"),
				new _holyday(Y,"07","15","assomption"),
				new _holyday(Y,"10","01","toussaint"),
				new _holyday(Y,"10","11","armistice 1914"),
				new _holyday(Y,"11","25","noël"),
				new _holyday(Y, easter.getMonth(), easter.getDate()+1,"paques"),
				new _holyday(Y, easter.getMonth(), easter.getDate()+39,"ascencion"),
				new _holyday(Y, easter.getMonth(), easter.getDate()+50,"pentecôte")
			   ].sort(function(a,b){
				return a.date.getTime()-b.date.getTime();
				})
	},
	isHoliday:function isHoliday(d){
		var _d=d || this;
		if(className(_d)!=='DATE')return false;
		var is=false;
		var iLoop=0;
		var _holidays=this.holidays(_d)
		while (!is && iLoop<_holidays.length){
			is=(_holidays[iLoop].date.toString()===_d.toString());
			iLoop+=+(!is);
		}
		return is;
	},
	easter:function easter(d){
		var _d=d || this;
		var Y=(className(_d)==='DATE')?_d.getFullYear():(className(_d)==='NUMBER')?_d:(isNaN(_d))?0:parseFloat(_d);
		if (Y==0)return Y;

		var G = Y%19;
		var C = Math.floor(Y/100);
		var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30;
		var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11));
		var J = (Y*1 + Math.floor(Y/4) + I + 2 - C + Math.floor(C/4))%7;
		var L = I - J;
		var easterMonth = 3 + Math.floor((L + 40)/44);
		var easterDay = L + 28 - 31*Math.floor(easterMonth/4);
		return new Date(Y, easterMonth-1, easterDay);
	},
	quantum:function quantum(d){
		var _d=d || this;
		var retVal=0;
		if (className(_d)!='DATE')return retVal;
		var y=_d.getFullYear(),m=_d.getMonth();
		for (var iLoop=0 ; iLoop<m ; iLoop++)retVal+=this.monthSize(new Date(y,iLoop));
		return retVal+_d.getDate();
	},
	isLeapYear:function isLeapYear(d){
		var _d=d || this;
		var y=(className(_d)==='DATE')?_d.getFullYear():(className(_d)==='NUMBER')?_d:(isNaN(_d))?0:parseFloat(_d);
		if (y!=0)return (new Date(y,1,29).getDate()==29);
		return false;
	},
	monthSize:function monthSize(d) {
		var _d=d || this;
		if (className(_d)==='DATE')return new Date(new Date(_d.getFullYear(),_d.getMonth()+1).getTime()-(1000*3600*24)).getDate();
		return 0;
	},
	yearSize:function yearSize(d){
		var _d=d || this;
		var y=(className(_d)==='DATE')?_d.getFullYear():(className(_d)==='NUMBER')?_d:(isNaN(_d))?0:parseFloat(_d);
		if (y!=0)return ((new Date().isLeapYear(y))?366:365);
		return 0;
	},
	interval:function interval(dS,dE,fmt){
		var diff = {millisecondes:0,seconds:0,minutes:0,hours:0,days:0,weeks:0};                           // Initialisation du retour
		if (arguments.length==0)return diff;
		if (arguments.length==1){
			dE=dS;
			dS=this; 
		}
		var _dE=Date.UTC(dE.getFullYear(),dE.getMonth(),dE.getDate(),dE.getHours(),dE.getMinutes(),dE.getSeconds(),dE.getMilliseconds());
		var _dS=Date.UTC(dS.getFullYear(),dS.getMonth(),dS.getDate(),dS.getHours(),dS.getMinutes(),dS.getSeconds(),dS.getMilliseconds());
		var delay=Math.abs(_dE-_dS);


		diff.days=Math.floor(delay/(24*3600*1000));
		delay=delay % (24*3600*1000);

		diff.weeks=Math.floor(diff.days/7);

		diff.hours=Math.floor(delay/(3600*1000));
		delay=delay % (3600*1000);

		diff.minutes=Math.floor(delay/(60*1000));
		delay=delay % (60*1000);

		diff.seconds=Math.floor(delay/1000);
		delay=delay % 1000;

		diff.millisecondes=delay;
		return diff;
	},
	getYearDay:function getYearDay() { //1 - 366
		var year  = this.getFullYear();
		var month = this.getMonth();
		var day   = this.getDate();

		var offset = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];

		//l'année bissextile n'est utile qu'à partir de mars
		var bissextile = (month < 2) ? 0 : (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0));

		return parseInt(day + offset[month] + bissextile);
	},
	getMonday:function getMonday() {
		var offset = (this.getDay() + 6) % 7;
		return new Date(this.getFullYear(), this.getMonth(), this.getDate()-offset);
	},
	getWeek:function getWeek() { //1 - 53
		var year = this.getFullYear();
		var week;

		//dernier lundi de l'année
		var lastMonday = new Date(year, 11, 31).getMonday();

		//la date est dans la dernière semaine de l'année
		//mais cette semaine fait partie de l'année suivante
		if(this >= lastMonday && lastMonday.getDate() > 28) {
			week = 1;
		}
		else {
			//premier lundi de l'année
			var firstMonday = new Date(year, 0, 1).getMonday();

			//correction si nécessaire (le lundi se situe l'année précédente)
			if(firstMonday.getFullYear() < year) firstMonday = new Date(year, 0, 8).getMonday();

			//nombre de jours écoulés depuis le premier lundi
			var days = this.getYearDay() - firstMonday.getYearDay();

			//window.alert(days);

			//si le nombre de jours est négatif on va chercher
			//la dernière semaine de l'année précédente (52 ou 53)
			if(days < 0) {
				week = new Date(year, this.getMonth(), this.getDate()+days).getWeek();
			}
			else {
				//numéro de la semaine
				week = 1 + parseInt(days / 7);

				//on ajoute une semaine si la première semaine
				//de l'année ne fait pas partie de l'année précédente
				week += (new Date(year-1, 11, 31).getMonday().getDate() > 28);
			}
		}

		return parseInt(week);
	},
	month2:function month2(d){
		var _d=d || this;
		return {year:_d.getFullYear(), partItem:Math.floor(_d.getMonth()/2)+1};
	},
	month3:function month3(d){
		var _d=d || this;
		return {year:_d.getFullYear(), partItem:Math.floor(_d.getMonth()/3)+1};
	},
	month4:function month4(d){
		var _d=d || this;
		return {year:_d.getFullYear(), partItem:Math.floor(_d.getMonth()/4)+1};
	},
	month6:function month6(d){
		var _d=d || this;
		return {year:_d.getFullYear(), partItem:Math.floor(_d.getMonth()/6)+1};
	}

}

for (var f in dateMgr){
	if (typeof dateMgr[f]==='function'){
		Date.prototype[f]=Date.prototype[f] || dateMgr[f];
	}
};
Object.defineProperty(Date.prototype,"lang",{get : function(){return this.constructor.prototype._langUsed || 'en-GB';},
                                      set : function(value){
                                      						if (typeof value=='string'){
                                      							this.constructor.prototype._langUsed=value;
                                      						}
                                      					   },
                                      enumerable : false,
                               configurable : true});
delete window.dateMgr;




