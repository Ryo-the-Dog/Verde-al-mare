var $ = require('jquery');
$(function(){

// ========================================
// ハンバーガーメニュー
// ========================================
var hamburgerMenu = (function(){
	// メニューボタン
	var $navToggle = $('.js-toggle-sp-menu');
	var $navToggleOpen = $('.js-toggle-sp-menu,.js-toggle-sp-menu-target');
	return {
		toggleOpen:function(){
			$navToggleOpen.toggleClass('active');
		},
		toggleClose:function(){
			// ハンバーガーメニューを閉じるための処理
			$navToggleOpen.removeClass('active');
		},
		init:function(){
			$navToggle.on('click',function(){
				hamburgerMenu.toggleOpen();
			});
			var $document = $(document);
			// メニューボタンとリスト要素
			var $clickTarget = $('.js-toggle-sp-menu');
			$document.on('click',function(event){
				// メニューボタンとリスト要素以外がクリックされた場合
				if(!$(event.target).closest($clickTarget).length){
					hamburgerMenu.toggleClose();
				}
			});
		}
	}
})();
hamburgerMenu.init();

// ========================================
// スクロールした時に固定ヘッダーに背景色を付ける
// ========================================
var scrollHeaderColor = (function(){
	// ヘッダー
	var header = $('.js-float-header');
	return {
		headerColor:function(){
			// ヒーロー画像の高さ
			var targetHeight = $('.js-float-header-target').height();
			// スクロール量
			var scroll = $(window).scrollTop();
			header.toggleClass('float-active',scroll >= targetHeight);
		},
		init:function(){
			$(window).on('scroll',function(){
				scrollHeaderColor.headerColor();
			});
		}
	}
})();
scrollHeaderColor.init();

// ========================================
// セクションリンククリックでスクロール移動
// ========================================
var scrollToLink = (function(){
	// ローカル変数(この関数内で定義された変数は関数外からは参照できない。)
	// 移動先セクション
	var $top = $('#top'),
		$news = $('#news'),
		$about = $('#about'),
		$menus = $('#menus'),
		$reserve = $('#reserve'),
		$access = $('#access');
	// セクションへのリンク
	var topLink = $('.js-top-link'),
		newsLink = $('.js-news-link'),
		aboutLink = $('.js-about-link'),
		menusLink = $('.js-menus-link'),
		reserveLink = $('.js-reserve-link'),
		accessLink = $('.js-access-link'),
		// ダウンスクロールボタン
		scrollDown = $('.js-scrollDown');
		// スクロールボタン
		// scrollBtn = $('.js-scroll-btn');
	return {
		scrollToTarget:function(target){
			var targetLink = target.offset().top;
			$('html,body').animate({scrollTop:targetLink},500,"swing");
		},
		init:function(){
			var that = this;
			$(topLink).on('click',function(){
				that.scrollToTarget($top);
			});
			$(newsLink).on('click',function(){
				that.scrollToTarget($news);
			});
			$(aboutLink).on('click',function(){
				that.scrollToTarget($about);
			});
			$(menusLink).on('click',function(){
				that.scrollToTarget($menus);
			});
			$(reserveLink).on('click',function(){
				that.scrollToTarget($reserve);
			});
			$(accessLink).on('click',function(){
				that.scrollToTarget($access);
			});
			// スクロールボタンがクリックされた場合
			$(scrollDown).on('click',function(){
				that.scrollToTarget($news);
			})
			
			// $(scrollBtn).on('click',function(){
			// 	that.scrollToTarget($skillSection);
			// })
		}
	}
})();
scrollToLink.init();

// ========================================
// コンテンツとボーダーの表示アニメーション
// ========================================
var animateShowBorder = (function(){
	// ローカル変数(この関数内で定義された変数は関数外からは参照できない。)
	// ボーダーの要素
	var $borderHide = $('.js-border-hide'),
		$contentHide = $('.js-content-hide'),
		$menuHide = $('.js-menu-hide');
	return {
		showBorder:function(){
			$borderHide.each(function(){
				// 対象のボーダーを変数に格納する
				var that = $(this);
				// スクロールした量
				var scroll = $(window).scrollTop();
				// ページのトップからボーダー上部までの高さ
				var elemPosTop = that.offset().top;
				// ウィンドウの高さ
				var windowHeight = $(window).height();
				/* ボーダーとページのトップまでの高さから、
				ウィンドウの高さを引いた分スクロールしたら発火する。 */
				if(scroll > elemPosTop - windowHeight ){
					that.addClass('border-show');
				};
			})
		},
		showContent:function(){
			$contentHide.each(function(){
				// 対象のコンテンツを変数に格納する
				var that = $(this);
				// スクロールした量
				var scroll = $(window).scrollTop();
				// ページのトップからコンテンツまでの高さ
				var elemPosTop = (that.height()*0.3)+(that.offset().top);
				// ウィンドウの高さ
				var windowHeight = $(window).height();
				/* ボーダーとページのトップまでの高さから、
				ウィンドウの高さを引いた分スクロールしたら発火する。 */
				if(scroll > elemPosTop - windowHeight ){
					that.addClass('content-show');
				};
			})
		},
		init:function(){
			var that = this;
			$(window).on('scroll',function(){
				that.showBorder();
				that.showContent();
				that.showMenu();
			});
		}
	}
})();
animateShowBorder.init();
// ========================================
// 画像スライダー
// ========================================
// ・dataタグはスライダーと丸ポチナビを紐付けるため
/* ・同時に処理されるスライド２つだけ。１つは表示させるためにleft:0%を付与してもう１つは脇に
	寄せるためにleft:-100%を付与する。他のはleft:-100にしたまま何も処理せず。 */
/* ・スライドの仕組みは進むの場合、画像を右端に持っていってからanimateで左へスライドさせることで
画像が連結されているように見せているだけ。本当は表示されていない画像は全部左端に寄せてある。 */
// ・$.fn. でプラグインの作成

var sld_wrap = $('#slider'), // スライダー全体
	sld_navi = '#sld_nav', // 何番目のスライドか表示
	sld = '.sld', // スライド
	sld_max = $(sld).length, // スライドの数を取得して最大数を設定
	sld_pre = 'sld', 
	sld_time = 1000, // スライドの動くスピード
	sld_wait = 5500, // スライドが動くスパン
	sld_timer, 
	goaway_left, 
	from_left, 
	sld_direction;
// 動くだけの関数
$.fn.slide_move = function(options){ /* 引数に{'direction': 'prev'}が入ると
settingsオブジェクトのdirectionプロパティがnextからprevに置き換わる */
    var settings = $.extend( {
      'direction': 'next'
    }, options);
	return this.each(function(i, elem) {
		clearTimeout(sld_timer); // スライドが動いたらスライドのタイマーをリセット
		var sldnum = parseInt(sld_wrap.data('sldnum')); /* slide_wrapセレクタの
		data-sldnumを数値化する */
		if(settings.direction === 'prev'){ /* settingsオブジェクトのderectionプロパティ
			がprevだったら */
			goaway_left = '100%'; //左-100%から右へ100%ズラす(スライダーを逆進する)
			from_left = '-100%';
		} else { //prevじゃなかったら
			goaway_left = '-100%'; //右100%から左へ-100%ズラす(スライダーを進める)
			from_left = '100%';
		}
		$(sld + '.current').stop().animate({'left':goaway_left},sld_time); /* */
		$(sld).not('#' + sld_pre + sldnum).removeClass('current');
		$('#' + sld_pre + sldnum).css({'left':from_left}).addClass('current').stop().animate({'left':0}, sld_time, function(){
			sld_timer = setTimeout(function(){ /* スライドタイマーをsetTimeoutで
			sld_waitおきに動くようにセットする */
				sld_wrap.slide_next(); // スライダー全体にslide_next()を実行する
			}, sld_wait); // スライドが動くスパン
		});
		$('.sld_navi_circle').not('#sld_navi' + sldnum).removeClass('current');
		$('#sld_navi' + sldnum).addClass('current'); //
	});
};
// 次に進む関数
$.fn.slide_next = function(){
	return this.each(function(i, elem) {
		var sldnum = parseInt(sld_wrap.data('sldnum')); 
		sldnum++; // スライド番号を１増やす
		if(sldnum > sld_max){ sldnum = 1; } /* 現在のスライド番号が最大数より大きくなったら
		現在のスライド番号を１にする(リセットする) */
		sld_wrap.data('sldnum', sldnum).slide_move(); /*  */
	});
};
// 前に戻る関数
$.fn.slide_prev = function(){
	return this.each(function(i, elem) {
		var sldnum = parseInt(sld_wrap.data('sldnum'));
		sldnum--; // スライド番号を１減らす
		if(sldnum < 1){ sldnum = sld_max; } /* 現在のスライド番号が１以下になったら
		現在のスライド番号を最大にする(最後の番号に戻る) */
		sld_wrap.data('sldnum', sldnum).slide_move({'direction': 'prev'}); /*
		 */
	});
};
sld_wrap.on('click', '.sld_navi_circle', function(){ // スライダーの中の丸ボタンが押されたら
	var sldnum = parseInt(sld_wrap.data('sldnum'));
	var sldnavi_num = parseInt($(this).data('sldnum'));
	if(sldnum > sldnavi_num){ 
		sld_direction = 'prev';
	} else {
		sld_direction = 'next';
	}
	sld_wrap.data('sldnum', sldnavi_num).slide_move({'direction': sld_direction});
});
$('#sld_next').click(function(){ // nextボタンが押された場合
	sld_wrap.slide_next();
});
$('#sld_prev').click(function(){ // prevボタンが押された場合
	sld_wrap.slide_prev();
});
$(window).on('load',function() {
	var sld_count = 1;
	var sld_navi_class;
	$(sld).each(function(){
		if(sld_count === 1){ 
			sld_navi_class = 'sld_navi_circle current'; 
		} else { 
			sld_navi_class = 'sld_navi_circle' 
		}
		// 丸ナビゲーションを表示する
		$(sld_navi).append('<a id="sld_navi' + sld_count + '" class="' + sld_navi_class +'" data-sldnum="' + sld_count + '">&nbsp;</a>');
		sld_count++;
	});
	var sld_timer = setTimeout(function(){
		sld_wrap.data('sldnum', 1).slide_move();
	}, 0);
});

// ========================================
// Ajax
// ========================================
// バリデーション
// ========================================
// 人数フォーム
var $peopleValidForm = $('.js-formPeople-validate');
var $peopleMsgArea = $('.js-set-msg-people');
// 名前フォーム
var $nameValidForm = $('.js-formName-validate');
var $nameMsgArea = $('.js-set-msg-name');
$peopleValidForm.on('keyup',function(){
	var $that = $(this);
	// Ajaxを実行する
	$.ajax({
	  type: 'post',
	  url: './src/ajax.php',
	  dataType: 'json', // 必ず指定すること。指定しないとエラーが出る＆返却値を文字列と認識してしまう
	  data: {
	    people: $peopleValidForm.val(),
	  }
	 // doneは旧バージョンの書き方。jQuery3以降はthenと書く。
	}).then(function(data) {

	  if(data){
	    console.log(data);

	    // 受け取ったerrorFlgデータがtrueの場合
	    // フォームにメッセージをセットし、背景色を変更する
	    if(data.errorFlgPeople){
	      $peopleMsgArea.addClass('is-error');
	      // $$peopleMsgArea.removeClass('is-success');
	      $that.addClass('is-error');
	      // $that.removeClass('is-success');
	    }else{
	      // $$peopleMsgArea.addClass('is-success');
	      $peopleMsgArea.removeClass('is-error');
	      // $that.addClass('is-success');
	      $that.removeClass('is-error');
	    }
	    // 受け取ったmsgデータを変更する
	    $peopleMsgArea.text(data.msgPeople);
	  }
	});
})
// Emailフォーム
var $emailValidForm = $('.js-formEmail-validate');
var $emailMsgArea = $('.js-set-msg-email');
$emailValidForm.on('keyup',function(){
	var $that = $(this);
	// Ajaxを実行する
	$.ajax({
	  type: 'post',
	  url: './src/ajax.php',
	  dataType: 'json', // 必ず指定すること。指定しないとエラーが出る＆返却値を文字列と認識してしまう
	  data: {
	    email: $emailValidForm.val(),
	  }
	}).then(function(data) {

	  if(data){
	    console.log(data);
	    // 受け取ったerrorFlgデータがtrueの場合
	    // フォームにメッセージをセットし、背景色を変更する
	    if(data.errorFlgEmail){
	      $emailMsgArea.addClass('is-error');
	      // $emailMsgArea.removeClass('is-success');
	      $that.addClass('is-error');
	      // $that.removeClass('is-success');
	    }else{
	      // $emailMsgArea.addClass('is-success');
	      $emailMsgArea.removeClass('is-error');
	      // $that.addClass('is-success');
	      $that.removeClass('is-error');
	    }
	    // 受け取ったmsgデータを変更する
	    $emailMsgArea.text(data.msgEmail);
	  }
	});
})
// 送信された内容の表示
// ========================================
var $formArea = $('.js-formArea');

$formArea.on('submit',function(e){
	e.preventDefault();
	// 入力フォーム
	var $formDate = $('.js-formDate'),
		$formTime = $('.js-formTime'),
		$formPeople = $('.js-formPeople'),
		$formName = $('.js-formName'),
		$formEmail = $('.js-formEmail');
	// メッセージ表示
	var $resultDate = $('.js-set-date'),
		$resultTime = $('.js-set-time'),
		$resultPeople = $('.js-set-people'),
		$resultName = $('.js-set-name'),
		$resultEmail = $('.js-set-email'),
		$resultSubmit = $('.js-set-submit');

	$.ajax({
		type: 'post',
		url: './src/ajax_json.php',
		dataType: 'json',
		data: {
			date: $formDate.val(),
			time: $formTime.val(),
			people: $formPeople.val(),
			name: $formName.val(),
			email: $formEmail.val(),
		}
	}).then(function(data, status){
		console.log(data);
		console.log(status);
		var date = data.date,
			time = data.time,
			people = data.people,
			name = data.name,
			email = data.email;
		// $resultDate.text(date);
		// $resultTime.text(time);
		// $resultPeople.text(people);
		// $resultName.text(name);
		// $resultEmail.text(email);
		$resultSubmit.text(
			name+'様\n'+date+time+'\t'+people+'名様でご予約を承りました。'+email+'宛に確認メールを送信しました。'
		);
	})
})
// ========================================
// ボタン活性・非活性
// ========================================
var $requiredForm = $('.js-formPeople-validate,.js-formName-validate,.js-formEmail-validate');
var $peopleForm = $('.js-formPeople-validate'),
	$nameForm = $('.js-formName-validate'),
	$emailForm = $('.js-formEmail-validate');
	$requiredForm.on('keyup',function(){
	// フォームに中身が入っていれば送信ボタンを活性化する(disabledを外す)
	// if(!$emailForm.hasClass('is-error') && $peopleForm.val() && $nameForm.val() && $emailForm.val() ){
	if($peopleForm.val() && $nameForm.val() && $emailForm.val() && !$emailForm.hasClass('is-error') ){
		$('.js-disabled-submit').prop('disabled',false);
	}else{
		// フォームの中身が空の場合は非活性に戻す
		$('.js-disabled-submit').prop('disabled',true);
	}
})





})

