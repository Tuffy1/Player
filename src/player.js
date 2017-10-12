require('./player.less');
export class Player {
	constructor(config) {
		this.title = config.title;
		this.cover = config.cover;
		this.singer = config.singer;
		this.lyrics = config.lyrics;
		this.url = config.url;
		this.audio = '';
		this.init();
	}
	init() {
		document.getElementById('player-bg').innerHTML = `
			<img src="${ this.cover}" class="bg-img">
		`;
		document.getElementById('player-detail').innerHTML = `
			<img src="${ this.cover}" class="pic">
			<div class="description">
				<div>${this.title}</div>
				<div>${this.singer}</div>
			</div>
			<div class="btn">
				<button class="pre btn-ch">|<</button>
				<button class="pause btn-ch">||</button>
				<button class="next btn-ch">>|</button>
			</div>
			<div class="progress">
				<progress max="100" value="50">进度条</progress>
				<div class="show-lyrics">词<div>
			</div>
		`;
		document.getElementById('lyrics-bg').innerHTML = `
			<img src="${this.cover}" class="bg-img">
		`;
		document.getElementById('lyrics-detail').innerHTML = `
			<p class="song-name">Secret</p>
			<p class="song-singer"><a>Jay</a></p>
			<p class="song-content">
				冷咖啡离开了杯垫 <br>
				我忍住的情绪在很后面 <br>
				拼命想挽回的从前 <br>
				在我脸上依旧清晰可见 <br>
				<span class="now">最美的不是下雨天</span> <br>
				是曾与你躲过雨的屋檐 <br>
				回忆的画面 <br>
				在荡着秋千 <br>
				梦开始不甜 <br>
				你说把爱渐渐放下会走更远 <br>
				又何必去改变已错过的时间 <br>
				你用你的指尖 <br>
				阻止我说再见 <br>
				想象你在身边 <br>
				在完全失去之前 <br>
				你说把爱渐渐放下会走更远 <br>
			</p>
		`;
		
		this.watch();
		this.play(this.url);
		// this.parseLyric(this.lyrics);
		let lyrics = this.lyrics;
		let that = this;
		let lrcArr;
		fetch(lyrics).then((responseText) => {
			return responseText.text();
		}).then(function(response) {
			lrcArr = that.parseLyric(response);
		});
		renderLyric(lrcArr);
	}
	watch() {
		//展开歌词
		document.getElementsByClassName('show-lyrics')[0].addEventListener('click', () => {
			let height = document.getElementById('app').clientHeight;
			if(height === 70) {
				document.getElementById('app').style.height = "520px";
			} else {
				document.getElementById('app').style.height = "70px";
			}
			
		})
		//播放与暂停
		document.getElementsByClassName('pause')[0].addEventListener('click', (e) => {
			if(!this.audio.paused) {
				this.audio.pause();
				e.target.innerHTML = ">";
			} 
			else if(this.audio.paused) {
				this.audio.play();
				e.target.innerHTML = "||";
			}
		})
		//更新进度
		setInterval(() => {
			document.getElementsByTagName('progress')[0].max = this.audio.duration;
			document.getElementsByTagName('progress')[0].value = this.audio.currentTime;
		}, 1000)
	}
	//播放音乐
	play(url){
		let audio = document.createElement('audio');
		let source = document.createElement('source');   
		source.type = "audio/mpeg";
		source.src = url;   
		source.autoplay = "autoplay";
		source.controls = "controls";
		audio.appendChild(source); 
		// audio.play();     
		this.audio = audio;
		this.audio.play();
	}
	showLyrics() {
		document.getElementById('lyrics').style.display = "block";
	}
	renderLyric(music){
	    document.getElementById('lyrics-detail').innerHtml("");
	    var lyricLineHeight = 27,
	        offset = document.getElementById('lyrics-detail').offset().height*0.4;
	    music.lyric.fetch(function(data){
	        music.lyric.parsed = {};
	        var i = 0;
	        for(var k in data){
	            var txt = data[k];
	            if(!txt)txt = "&nbsp;";
	            music.lyric.parsed[k] = {
	                index:i++,
	                text:txt,
	                top: i*lyricLineHeight-offset
	            };
	            var li = $("<li>"+txt+"</li>");
	            lyric.append(li);
	        }
	        $player.bind("timeupdate",updateLyric);
	    },function(){
	        lyric.html("<li style='text-align: center'>歌词加载失败</li>");
	    });
	}
	parseLyric(lyric) {
		let text = lyric;
		console.log("text:" + text);
		lyric = text.split('\n'); //先按行分割
		console.log("lyric:" + lyric);
		let _l = lyric.length; //获取歌词行数
		console.log("_l:" + _l);
		let lrc = new Array(); //新建一个数组存放最后结果
		for(let i=0;i<_l;i++) {
		    var d = lyric[i].match(/\[\d{2}:\d{2}((\.|\:)\d{2})\]/g);  //正则匹配播放时间
		    var t = lyric[i].split(d); //以时间为分割点分割每行歌词，数组最后一个为歌词正文
		    if(d != null) { //过滤掉空行等非歌词正文部分
		        //换算时间，保留两位小数
		        var dt = String(d).split(':'); 
		        var _t = Math.round(parseInt(dt[0].split('[')[1])*60+parseFloat(dt[1].split(']')[0])*100)/100; 
		        lrc.push([_t, t[1]]);
		    }
		console.log(lrc);
		return lrc;
		}
	}
}
// module.exports = Player;