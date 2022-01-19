/**
 * Marksheet App
 *
 * (C) 2022 Slopsink
 */

//import petite-vue
import { createApp } from "https://unpkg.com/petite-vue@0.4.0/dist/petite-vue.es.js?module";

//create vue app
const app = createApp({
	page: "init",
	testTitle: "", //試験の名前
	timer: {
		currentTime: 0, //現在の経過時間（秒）
		setTime: 0 // 設定時間（秒）
	},
	memo: {
		content: "", // メモの内容
		isActive: false // メモ画面が表示されているかどうか
	},
	marksheet: {
		presetItemsCSV: [
			{
				name: "共通テスト　地歴公民・国語・外国語",
				value: "0,1,2,3,4,5,6,7,8,9"
			},
			{
				name: "共通テスト　数学",
				value: "-,±,0,1,2,3,4,5,6,7,8,9,a,b,c,d"
			},
			{
				name: "共通テスト　理科",
				value: "1,2,3,4,5,6,7,8,9,0,a,b"
			},
			{
				name: "TOEIC®・TOEFL® ITP",
				value: "A,B,C,D"
			},
			{
				name: "英検",
				value: "1,2,3,4"
			},
			{
				name: "自動車免許　学科試験",
				value: "正,誤"
			}
		], // プリセットの選択肢のリスト

		itemsCSV: "", // カンマ区切りの選択肢
		items: [], // itemsCSV.split(",")
		answers: [null], // ユーザーが選んだ選択肢（未選択は null, items[0] を選択したときは 0, items[1] を選んだときは 1 ...）
		correctAnswers: [], // 正答の選択肢（データの仕様は answers に同じ）
		correctRate: 0, // 正答率（％）
		numberOfCorrect: 0, // 正解数
		numberOfQuestions: 0 // 問題数
	},

	//解答開始
	startAnswering() {
		if (
			this.marksheet.itemsCSV !== "" &&
			this.timer.setTime > 0 &&
			typeof this.timer.setTime === "number"
		) {
			// itemsCSVを配列に変換
			this.marksheet.items = this.marksheet.itemsCSV.split(",");

			//解答入力ページへ移動
			this.page = "enterAnswer";

			//ページを一番上までスクロール
			document.documentElement.scrollTop = 0;
		} else {
			alert("選択肢 と 制限時間 を入力してください");
		}
	},

	//マークを付ける
	/*
	 * @param
	 * questionIndex: 問題インデックス（マークシート左の数字 - 1)
	 * answerIndex: 解答インデックス（一番左の選択肢から0, 1, 2, ...)
	 */
	setMark(questionIndex, answerIndex) {
		//すでにマーク済みのマークをタップしたときは、マークを取り消す
		if (this.marksheet.answers[questionIndex] === answerIndex) {
			this.marksheet.answers[questionIndex] = null;
		} else {
			//マークを付ける
			this.marksheet.answers[questionIndex] = answerIndex;
		}

		//解答した問題インデックスがマークシートの一番下なら、その下に問題インデックスを追加
		if (questionIndex + 1 === this.marksheet.answers.length) {
			this.marksheet.answers.push(null);

			//ページの一番下までスクロール（要素の追加を待つために100ms待つ）
			setTimeout(function () {
				document.documentElement.scrollTo({
					top: document.documentElement.scrollHeight,
					left: 0,
					behavior: "smooth"
				});
			}, 100);
		}
	},

	//回答終了 → 模範解答入力
	stopAnswering() {
		//marksheet.answers の 末尾が null なら削除
		if (this.marksheet.answers[this.marksheet.answers.length - 1] === null) {
			this.marksheet.answers.pop();
		}

		// marksheet.answers.length と同じ数だけ模範解答インデックスを作る
		for (let i = 0; i < this.marksheet.answers.length; i++) {
			this.marksheet.correctAnswers.push(null);
		}
		//模範解答入力ページへ
		this.page = "enterCorrectAnswer";

		//ページを一番上までスクロール
		document.documentElement.scrollTop = 0;
	},

	//正答率を計算 → 結果ページを表示
	grade() {
		const self = this;

		//正解数
		let numberOfCorrect = 0;
		//正答率の計算
		this.marksheet.answers.forEach(function (answer, questionIndex) {
			if (answer === self.marksheet.correctAnswers[questionIndex]) {
				numberOfCorrect++;
			}
		});
		
		this.marksheet.correctRate =
			Math.round((numberOfCorrect / this.marksheet.answers.length) * 100);
		this.marksheet.numberOfCorrect = numberOfCorrect;
		this.marksheet.numberOfQuestions = this.marksheet.answers.length;

		//結果ページに移動
		this.page = "result";

		//ページを一番上までスクロール
		document.documentElement.scrollTop = 0;
	},
	
	// trueなら"◯", falseなら"×" を返す
	getGradeCharacter(bool){
		if(bool === true) return "◯";
		else return "×";
	}
});

app.mount("#app");

document.documentElement.setAttribute("lang", "ja");
document.title = "マークシートアプリ";