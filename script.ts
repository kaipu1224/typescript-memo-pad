/// <reference path="jquery.d.ts" />

/**
 * アプリのビュー
 */
 class MemoPadView {
 	textarea:JQuery;
 	saveButton:JQuery;
 	clearButton:JQuery;

 	constructor (model:MemoPadModel, controller:MemoPadController, ui:any) {
 		var self = this;
		// 各オブジェクトを設定
		self.textarea = $(ui.textarea);
		self.saveButton = $(ui.saveButton);
		self.clearButton = $(ui.clearButton);

		// 各オブジェクトのイベント設定
		self.saveButton.on('click', ()=> controller.save(self.textarea.val()));
		self.clearButton.on('click', ()=> controller.clear());
		self.render(model.getData());
		model.addEventListener('updated', (event)=> self.render(event.value));
		model.addEventListener('cleared', (event)=> self.render(''));
	}

	/**
	* テキストエリアへの文字列表示処理
	* @param value 表示文字列
	*/
	private render (value:string) {
		this.textarea.val(value);
	}
}

/**
 * イベントディスパッチャー
 */
class EventDispatcher {
 	dispatcher:JQuery;

 	constructor () {
 		this.dispatcher = $({});
 	}

	/**
	 * イベント登録処理
	 */
	public addEventListener(type:string, listener:any) {
		this.dispatcher.on.apply(this.dispatcher, arguments);
	}

	/**
	 * イベント削除処理
	 */
	public removeEventListener(type:string) {
		this.dispatcher.off.apply(this.dispatcher, arguments);
	}

	/**
	 * イベント処理
	 */
	public dispatchEvent(event) {
	 	this.dispatcher.trigger.apply(this.dispatcher, arguments);
	}
}

/**
 * アプリのモデル
 */
class MemoPadModel extends EventDispatcher {
 	namespace:string;

 	constructor (namespace:string) {
 		localStorage.setItem(namespace, localStorage.getItem(namespace) || '');
 		this.namespace = namespace;

 		super();
 	}

	/**
	 * ローカルソストレージからのアイテム取得処理
	 */
	public getData() {
		return localStorage.getItem(this.namespace);
	}

	/**
	 * ローカルソストレージのアイテム更新処理
	 */
	public update(value:any) {
		localStorage.setItem(this.namespace, value);
	 	this.dispatchEvent({type:'updated', value:value});
	}

	/**
	 * ローカルソストレージのアイテム削除処理
	 */
	public destroy() {
	 	this.dispatchEvent({type:'cleared'});
	 	localStorage.setItem(this.namespace, '');
	}
}

/**
 * アプリのコントローラ
 */
 class MemoPadController {
 	model:MemoPadModel;

 	constructor(model:MemoPadModel) {
 		this.model = model;
 	}

	/**
	 * クリア処理
	 */
 	public clear() {
 		this.model.destroy();
 	}

	/**
	 * 保存処理
	 */
 	public save(value:string) {
 		this.model.update(value);
 	}
 }

/**
 * アプリケーション本体<br>
 * アプリで使用するModel/View/Controllerを管理する
 */
 class App {
 	constructor(ui:any) {
 		var model:MemoPadModel = new MemoPadModel('MemoPadApp');
 		var controller:MemoPadController = new MemoPadController(model);
 		var view:MemoPadView = new MemoPadView(model, controller, ui);
 	}
 }

 var ui = {
 	textarea:'#memoArea',
 	saveButton:'#saveButton',
 	clearButton:'#clearButton'
 }

 $(function() {
 	var app = new App(ui);    
});