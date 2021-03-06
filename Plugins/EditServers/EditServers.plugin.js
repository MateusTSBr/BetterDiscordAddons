//META{"name":"EditServers"}*//

class EditServers {
	constructor () {
		
		this.labels = {};
    
		this.serverContextObserver = new MutationObserver(() => {});
		this.serverListObserver = new MutationObserver(() => {});
		this.serverDropHandler;
		this.serverListLeaveHandler;
		
		this.urlCheckTimeout;
		this.urlCheckRequest;
		
		this.serverDragged = false;;
		
		this.css = `
			@keyframes animation-editservers-backdrop {
				to { opacity: 0.85; }
			}

			@keyframes animation-editservers-backdrop-closing {
				to { opacity: 0; }
			}

			@keyframes animation-editservers-modal {
				to { transform: scale(1); opacity: 1; }
			}

			@keyframes animation-editservers-modal-closing {
				to { transform: scale(0.7); opacity: 0; }
			}

			.editservers-modal .callout-backdrop {
				animation: animation-editservers-backdrop 250ms ease;
				animation-fill-mode: forwards;
				opacity: 0;
				background-color: rgb(0, 0, 0);
				transform: translateZ(0px);
			}

			.editservers-modal.closing .callout-backdrop {
				animation: animation-editservers-backdrop-closing 200ms linear;
				animation-fill-mode: forwards;
				animation-delay: 50ms;
				opacity: 0.85;
			}
			
			.editservers-modal .modal {
				animation: animation-editservers-modal 250ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
				animation-fill-mode: forwards;
				transform: scale(0.7);
				transform-origin: 50% 50%;
				align-content: space-around;
				align-items: center;
				box-sizing: border-box;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-height: initial;
				max-height: initial;
				opacity: 0;
				pointer-events: none;
				user-select: none;
				height: 100%;
				width: 100%;
				margin: 0;
				padding: 0;
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				z-index: 1000;
			}

			.editservers-modal.closing .modal {
				animation: animation-editservers-modal-closing 250ms cubic-bezier(0.19, 1, 0.22, 1);
				animation-fill-mode: forwards;
				opacity: 1;
				transform: scale(1);
			}
			
			.editservers-modal .form {
				width: 100%;
			}

			.editservers-modal .form-header, .editservers-modal .form-actions {
				background-color: rgba(32,34,37,.3);
				box-shadow: inset 0 1px 0 rgba(32,34,37,.6);
				padding: 20px;
				
			}

			.editservers-modal .form-header {
				color: #f6f6f7;
				cursor: default;
				font-size: 16px;
				font-weight: 600;
				letter-spacing: .3px;
				line-height: 20px;
				text-transform: uppercase;
			}

			.editservers-modal .form-actions {
				display: flex;
				flex-direction: row-reverse;
				flex-wrap: nowrap;
				flex: 0 0 auto;
				padding-right: 32px;
			}

			.editservers-modal .form-inner{
				margin: 10px 0;
				overflow-x: hidden;
				overflow-y: hidden;
				padding: 0 20px;
				height: 350px;
				
			}

			.editservers-modal .modal-inner {
				background-color: #36393E;
				border-radius: 5px;
				box-shadow: 0 0 0 1px rgba(32,34,37,.6),0 2px 10px 0 rgba(0,0,0,.2);
				display: flex;
				min-height: 200px;
				pointer-events: auto;
				width: 500px;
			}
			
			.editservers-modal .inputs {
				width: 430px;
				margin: auto;
			}

			.editservers-modal input {
				color: #f6f6f7;
				background-color: rgba(0,0,0,.1);
				border-color: rgba(0,0,0,.3);
				padding: 10px;
				height: 40px;
				box-sizing: border-box;
				width: 90%;
				margin: 0 5% 10px 5%;
				border-width: 1px;
				border-style: solid;
				border-radius: 3px;
				outline: none;
				transition: background-color .15s ease,border .15s ease;
			}

			.editservers-modal input.valid {
				background-color: rgba(10,167,0,.5);
			}

			.editservers-modal input.invalid {
				background-color: rgba(208,0,0,.5);
			}

			.editservers-modal input:disabled {
				color: #a6a6a7;
				cursor: no-drop;
				background-color: rgba(0,0,0,.5);
			}

			.editservers-modal input[type="checkbox"] {
				margin: 0px 0px 0px 11px;
				width: 10%;
				height: 20px;
			}

			.editservers-modal .checkbox {
				display: inline;
			}

			.editservers-modal .checkboxlabel {
				position: relative;
				top: -6px;
				display: inline;
			}

			.editservers-modal .btn {
				align-items: center;
				background: none;
				border-radius: 3px;
				border: none;
				box-sizing: border-box;
				display: flex;
				font-size: 14px;
				font-weight: 500;
				justify-content: center;
				line-height: 16px;
				min-height: 38px;
				min-width: 96px;
				padding: 2px 16px;
				position: relative;
			}

			.editservers-modal .btn-cancel {
				background-color: #2f3136;
				color: #fff;
			}

			.editservers-modal .btn-save {
				background-color: #3A71C1;
				color: #fff;
			}

			.editservers-modal .control-group label,
			.editservers-modal .form-tab button {
				color: #b9bbbe;
				letter-spacing: .5px;
				text-transform: uppercase;
				flex: 1;
				cursor: default;
				font-weight: 600;
				line-height: 16px;
				font-size: 12px;
			}

			.editservers-modal .control-group {
				margin-top: 10px;
			}
			
			.editservers-modal .form-tab {
				overflow: hidden;
				background-color: #36393E;
				position: absolute;
				z-index: 20px;
			}

			.editservers-modal .form-tablinks {
				background-color: inherit;
				float: left;
				border: none;
				outline: none;
				cursor: pointer;
				padding: 14px 16px;
				transition: 0.3s;
				border-radius: 5px 5px 0px 0px;
			}

			.editservers-modal .form-tablinks:hover {
				background-color: #403F47;
			}

			.editservers-modal .form-tablinks.active {
				background-color: #484B51;
			}

			.editservers-modal .form-tabcontent {
				margin-top: 40px;
				padding: 5px 0px 20px 0px;
				background-color: #484B51;
				display: none;
				border-radius: 5px 5px 5px 5px;
				position: relative;
				z-index: 10px;
			}

			.editservers-modal .form-tabcontent.open {
				display: block;
			}`;


		this.serverContextEntryMarkup =
			`<div class="item-group">
				<div class="item localserversettings-item item-subMenu">
					<span>REPLACE_context_localserversettings_text</span>
					<div class="hint"></div>
				</div>
			</div>`;
			
		this.serverContextSubMenuMarkup = 
			`<div class="context-menu editservers-submenu">
				<div class="item-group">
					<div class="item serversettings-item">
						<span>REPLACE_submenu_serversettings_text</span>
						<div class="hint"></div>
					</div>
					<div class="item resetsettings-item">
						<span>REPLACE_submenu_resetsettings_text</span>
						<div class="hint"></div>
					</div>
				</div>
			</div>`;

		this.serverSettingsModalMarkup =
			`<span class="editservers-modal">
				<div class="backdrop-2ohBEd callout-backdrop"></div>
				<div class="modal">
					<div class="modal-inner">
						<div class="form">
							<div class="form-header">
								<header class="modal-header">REPLACE_modal_header_text</header>
							</div>
							<div class="form-inner">
								<div class="form-tab">
									<button class="form-tablinks active" value="tab-text">REPLACE_modal_tabheader1_text</button>
									<button class="form-tablinks" value="tab-icon">REPLACE_modal_tabheader2_text</button>
									<button class="form-tablinks" value="tab-tooltip">REPLACE_modal_tabheader3_text</button>
								</div>
								<div class="form-tabcontent tab-text open">
									<div class="control-group">
										<div class="input-settings">
											<div class="inputs">
												<label class="modal-text-label" for="modal-nametext">REPLACE_modal_servername_text</label>
												<input type="text" id="modal-nametext" name="nametext">
												<label class="modal-text-label" for="modal-idtext">REPLACE_modal_servershortname_text</label>
												<input type="text" id="modal-idtext" name="idtext">
												<label class="modal-text-label" for="modal-urltext">REPLACE_modal_serverurl_text</label>
												<input type="text" id="modal-urltext" name="urltext">
												<div class="checkbox"><input type="checkbox" id="modal-urlcheck"></div><div class="checkboxlabel"><label class="modal-text-label" for="modal-urlcheck">REPLACE_modal_removeicon_text</label></div>
											</div>
										</div>
									</div>
								</div>
								<div class="form-tabcontent tab-icon">
									<div class="control-group">
										<div class="modal-color-picker">
											<div class="swatches1">
												<label class="color-picker1-label">REPLACE_modal_colorpicker1_text</label>
											</div>
										</div>
									</div>
									<div class="control-group">
										<div class="modal-color-picker">
											<div class="swatches2">
												<label class="color-picker2-label">REPLACE_modal_colorpicker2_text</label>
											</div>
										</div>
									</div>
								</div>
								<div class="form-tabcontent tab-tooltip">
									<div class="control-group">
										<div class="modal-color-picker">
											<div class="swatches3">
												<label class="color-picker3-label">REPLACE_modal_colorpicker3_text</label>
											</div>
										</div>
									</div>
									<div class="control-group">
										<div class="modal-color-picker">
											<div class="swatches4">
												<label class="color-picker4-label">REPLACE_modal_colorpicker4_text</label>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div class="form-actions">
								<button type="button" class="btn btn-cancel">REPLACE_btn_cancel_text</button>
								<button type="button" class="btn btn-save">REPLACE_btn_save_text</button>
							</div>
						</form>
					</div>
				</div>
			</span>`;
	}

	getName () {return "EditServers";}

	getDescription () {return "Allows you to change the icon, name and color of servers.";}

	getVersion () {return "1.5.1";}

	getAuthor () {return "DevilBro";}
	
    getSettingsPanel () {
		if (typeof BDfunctionsDevilBro === "object") {
			return `<button class="` + this.getName() + `ResetBtn" style="height:23px" onclick='` + this.getName() + `.resetAll("` + this.getName() + `")'>Reset all Servers`;
		}
    }

	//legacy
	load () {}

	start () {
		if (typeof BDfunctionsDevilBro === "object") BDfunctionsDevilBro = "";
		$('head script[src="https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]').remove();
		$('head').append("<script src='https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js'></script>");
		if (typeof BDfunctionsDevilBro !== "object") {
			$('head script[src="https://cors-anywhere.herokuapp.com/https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js"]').remove();
			$('head').append("<script src='https://cors-anywhere.herokuapp.com/https://mwittrien.github.io/BetterDiscordAddons/Plugins/BDfunctionsDevilBro.js'></script>");
		}
		if (typeof BDfunctionsDevilBro === "object") {
			BDfunctionsDevilBro.loadMessage(this.getName(), this.getVersion());
			
			this.serverContextObserver = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								if (node.nodeType == 1 && node.className.includes("context-menu")) {
									this.onContextMenu(node);
								}
							});
						}
					}
				);
			});
			if (document.querySelector(".app")) this.serverContextObserver.observe(document.querySelector(".app"), {childList: true});
			
			this.serverListObserver = new MutationObserver((changes, _) => {
				changes.forEach(
					(change, i) => {
						if (change.addedNodes) {
							change.addedNodes.forEach((node) => {
								this.loadServer(node);
							});
						}
					}
				);
			});
			if (document.querySelector(".guilds.scroller")) this.serverListObserver.observe(document.querySelector(".guilds.scroller"), {childList: true});
			
			this.serverDropHandler = (e) => {	
				this.serverDragged = true;
			};
			this.serverListLeaveHandler = (e) => {	
				if (this.serverDragged) this.loadAllServers();
				this.serverDragged = false;
			};
			
			$(".guilds.scroller").bind('drop', this.serverDropHandler);
			$(".guilds.scroller").bind('mouseleave', this.serverListLeaveHandler);
			
			BDfunctionsDevilBro.appendLocalStyle(this.getName(), this.css);
			
			this.loadAllServers();
			
			setTimeout(() => {
				this.labels = this.setLabelsByLanguage();
				this.changeLanguageStrings();
			},5000);
		}
		else {
			console.error(this.getName() + ": Fatal Error: Could not load BD functions!");
		}
	}

	stop () {
		if (typeof BDfunctionsDevilBro === "object") {
			this.serverContextObserver.disconnect();
			this.serverListObserver.disconnect();
			$(".guilds.scroller").unbind('drop', this.serverDropHandler);
			$(".guilds.scroller").unbind('mouseleave', this.serverListLeaveHandler);
			
			$(".custom-editservers").each(
				(i,serverDiv) => {
					var info = BDfunctionsDevilBro.getKeyInformation({"node":serverDiv, "key":"guild"});
					if (info) {
						var serverInner = $(serverDiv).find(".guild-inner");
						var server = $(serverDiv).find(".avatar-small");
						var bgImage = info.icon ? "url('https://cdn.discordapp.com/icons/" + info.id + "/" + info.icon + ".png')" : "";
					
						$(serverDiv)
							.removeClass("custom-editservers");
						$(serverInner)
							.off("mouseenter." + this.getName());
						$(server)
							.text($(server).attr("name"))
							.css("background-image", bgImage)
							.css("background-color", "")
							.css("color", "");
					}
				}
			);
			
			BDfunctionsDevilBro.removeLocalStyle(this.getName());
			
			BDfunctionsDevilBro.unloadMessage(this.getName(), this.getVersion());
		}
	}

	
	// begin of own functions

    static resetAll (pluginName) {
		if (confirm("Are you sure you want to reset all servers?")) {
			BDfunctionsDevilBro.removeAllData(pluginName, "servers");
			
			$(".custom-editservers").each(
				(i,serverDiv) => {
					var info = BDfunctionsDevilBro.getKeyInformation({"node":serverDiv, "key":"guild"});
					if (info) {
						var serverInner = $(serverDiv).find(".guild-inner");
						var server = $(serverDiv).find(".avatar-small");
						var bgImage = info.icon ? "url('https://cdn.discordapp.com/icons/" + info.id + "/" + info.icon + ".png')" : "";
					
						$(serverDiv)
							.removeClass("custom-editservers");
						$(serverInner)
							.off("mouseenter." + pluginName);
						$(server)
							.text($(server).attr("name"))
							.css("background-image", bgImage)
							.css("background-color", "")
							.css("color", "");
					}
				}
			);
		}
    }

	changeLanguageStrings () {
		this.serverContextEntryMarkup = 	this.serverContextEntryMarkup.replace("REPLACE_context_localserversettings_text", this.labels.context_localserversettings_text);
		
		this.serverContextSubMenuMarkup = 	this.serverContextSubMenuMarkup.replace("REPLACE_submenu_serversettings_text", this.labels.submenu_serversettings_text);
		this.serverContextSubMenuMarkup = 	this.serverContextSubMenuMarkup.replace("REPLACE_submenu_resetsettings_text", this.labels.submenu_resetsettings_text);
		
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_header_text", this.labels.modal_header_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_servername_text", this.labels.modal_servername_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_servershortname_text", this.labels.modal_servershortname_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_serverurl_text", this.labels.modal_serverurl_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_removeicon_text", this.labels.modal_removeicon_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_tabheader1_text", this.labels.modal_tabheader1_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_tabheader2_text", this.labels.modal_tabheader2_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_tabheader3_text", this.labels.modal_tabheader3_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_colorpicker1_text", this.labels.modal_colorpicker1_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_colorpicker2_text", this.labels.modal_colorpicker2_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_colorpicker3_text", this.labels.modal_colorpicker3_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_modal_colorpicker4_text", this.labels.modal_colorpicker4_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_btn_cancel_text", this.labels.btn_cancel_text);
		this.serverSettingsModalMarkup = 	this.serverSettingsModalMarkup.replace("REPLACE_btn_save_text", this.labels.btn_save_text);
		
		BDfunctionsDevilBro.translateMessage(this.getName());
	}
	
	onContextMenu (context) {
		if ($(context).find(".localserversettings-item").length == 0) {
			var serverData = BDfunctionsDevilBro.getKeyInformation({"node":context, "key":"guild"});
			var contextType = BDfunctionsDevilBro.getKeyInformation({"node":context, "key":"displayName", "value":"GuildLeaveGroup"});
			
			if (serverData && contextType) {
				var serverDiv = BDfunctionsDevilBro.getDivOfServer(serverData.id);
				var server = $(serverDiv).find(".avatar-small");
				var shortName = $(serverDiv).hasClass("custom-editservers") ? $(server).attr("name") : $(server).text();
				var data = Object.assign({},serverData,{shortName});
				$(context).append(this.serverContextEntryMarkup)
					.on("mouseenter", ".localserversettings-item", data, this.createContextSubMenu.bind(this))
					.on("mouseleave", ".localserversettings-item", data, this.deleteContextSubMenu.bind(this));
			}
		}
	}
	
	createContextSubMenu (e) {
		var theme = BDfunctionsDevilBro.themeIsLightTheme() ? "" : "theme-dark";
		
		var targetDiv = e.target.tagName != "SPAN" ? e.target : e.target.parentNode;
		
		var serverContextSubMenu = $(this.serverContextSubMenuMarkup);
		$(targetDiv).append(serverContextSubMenu)
			.off("click", ".serversettings-item")
			.on("click", ".serversettings-item", e.data, this.showServerSettings.bind(this));
		$(serverContextSubMenu)
			.addClass(theme)
			.css("left", $(targetDiv).offset().left + "px")
			.css("top", $(targetDiv).offset().top + "px");
			
		var info = BDfunctionsDevilBro.loadData(e.data.id, this.getName(), "servers");
		if (!info) {
			$(targetDiv).find(".resetsettings-item").addClass("disabled");
		}
		else {
			$(targetDiv)
				.off("click", ".resetsettings-item")
				.on("click", ".resetsettings-item", e.data, this.resetServer.bind(this));
		}
	}
	
	deleteContextSubMenu (e) {
		$(".editservers-submenu").remove();
	}
	
	showServerSettings (e) {
		$(".context-menu").hide();
		var id = e.data.id;
		if (id) {
			var info = BDfunctionsDevilBro.loadData(id, this.getName(), "servers");
			
			var name = 			info ? info.name : null;
			var shortName = 	info ? info.shortName : null;
			var url = 			info ? info.url : null;
			var removeIcon = 	info ? info.removeIcon : false;
			var color1 = 		info ? info.color1 : null;
			var color2 = 		info ? info.color2 : null;
			var color3 = 		info ? info.color3 : null;
			var color4 = 		info ? info.color4 : null;
		
			var serverDiv = BDfunctionsDevilBro.getDivOfServer(id);
			var server = $(serverDiv).find(".avatar-small");
			
			var serverSettingsModal = $(this.serverSettingsModalMarkup);
			serverSettingsModal.find("#modal-nametext")[0].value = name;
			serverSettingsModal.find("#modal-nametext").attr("placeholder", e.data.name);
			serverSettingsModal.find("#modal-idtext")[0].value = shortName;
			serverSettingsModal.find("#modal-idtext").attr("placeholder", e.data.shortName);
			serverSettingsModal.find("#modal-urltext")[0].value = url;
			serverSettingsModal.find("#modal-urltext").attr("placeholder", e.data.icon ? "https://cdn.discordapp.com/icons/" + e.data.id + "/" + e.data.icon + ".png" : null);
			serverSettingsModal.find("#modal-urltext").addClass(url ? "valid" : "");
			serverSettingsModal.find("#modal-urltext").prop("disabled", removeIcon);
			serverSettingsModal.find("#modal-urlcheck")[0].checked = removeIcon;
			BDfunctionsDevilBro.setColorSwatches(color1, serverSettingsModal.find(".swatches1"), "swatch1");
			BDfunctionsDevilBro.setColorSwatches(color2, serverSettingsModal.find(".swatches2"), "swatch2");
			BDfunctionsDevilBro.setColorSwatches(color3, serverSettingsModal.find(".swatches3"), "swatch3");
			BDfunctionsDevilBro.setColorSwatches(color4, serverSettingsModal.find(".swatches4"), "swatch4");
			serverSettingsModal.appendTo($(".app-XZYfmp"))
				.on("click", ".callout-backdrop,button.btn-cancel", (event) => {
					serverSettingsModal.addClass('closing');
					setTimeout(() => {serverSettingsModal.remove();}, 300);
				})
				.on("click", "#modal-urlcheck", (event) => {
					serverSettingsModal.find("#modal-urltext").prop("disabled", event.target.checked);
				})
				.on("change keyup paste", "#modal-urltext", (event) => {
					this.checkUrl(event, serverSettingsModal);
				})
				.on("mouseenter", "#modal-urltext", (event) => {
					$(event.target).addClass("hovering");
					this.createNoticeTooltip(event);
				})
				.on("mouseleave", "#modal-urltext", (event) => {
					$(event.target).removeClass("hovering");
				})
				.on("click", "button.form-tablinks", (event) => {
					this.changeTab(event, serverSettingsModal);
				})
				.on("click", "button.btn-save", (event) => {
					event.preventDefault();
					
					name = null;
					if (serverSettingsModal.find("#modal-nametext")[0].value) {
						if (serverSettingsModal.find("#modal-nametext")[0].value.trim().length > 0) {
							name = serverSettingsModal.find("#modal-nametext")[0].value.trim();
						}
					}
					
					shortName = null;
					if (serverSettingsModal.find("#modal-idtext")[0].value) {
						if (serverSettingsModal.find("#modal-idtext")[0].value.trim().length > 0) {
							shortName = serverSettingsModal.find("#modal-idtext")[0].value.trim();
						}
					}
					
					if (serverSettingsModal.find("#modal-urltext:not('.invalid')")[0]) {
						url = null;
						if (!serverSettingsModal.find("#modal-urlcheck")[0].checked && serverSettingsModal.find("#modal-urltext")[0].value) {
							if (serverSettingsModal.find("#modal-urltext")[0].value.trim().length > 0) {
								url = serverSettingsModal.find("#modal-urltext")[0].value.trim();
							}
						}
					}
					
					removeIcon = serverSettingsModal.find("#modal-urlcheck")[0].checked;
					
					color1 = BDfunctionsDevilBro.getSwatchColor("swatch1");
					color2 = BDfunctionsDevilBro.getSwatchColor("swatch2");
					color3 = BDfunctionsDevilBro.getSwatchColor("swatch3");
					color4 = BDfunctionsDevilBro.getSwatchColor("swatch4");
					
					if (name == null && shortName == null && url == null && !removeIcon && color1 == null && color2 == null && color3 == null && color4 == null) {
						this.resetServer(e);
					}
					else {
						BDfunctionsDevilBro.saveData(id, {id,name,shortName,url,removeIcon,color1,color2,color3,color4}, this.getName(), "servers");
						this.loadServer(serverDiv);
					}
					
					serverSettingsModal.addClass('closing');
					setTimeout(() => {serverSettingsModal.remove();}, 300);
				});
			serverSettingsModal.find("#modal-nametext")[0].focus();
		}
	}
	
	changeTab (e, modal) {
		var tab = e.target.value;

		$(".form-tabcontent.open",modal)
			.removeClass("open");
			
		$(".form-tablinks.active",modal)
			.removeClass("active");
			
		$(".form-tabcontent." + tab ,modal)
			.addClass("open");
			
		$(e.target)
			.addClass("active");
	}
	
	checkUrl (e, modal) {
		clearTimeout(this.urlCheckTimeout);
		if (typeof this.urlCheckRequest === "object") this.urlCheckRequest.abort();
		if (!e.target.value) {
			$(e.target)
				.removeClass("valid")
				.removeClass("invalid");
			if ($(e.target).hasClass("hovering")) $(".tooltips").find(".notice-tooltip").remove();
		}
		else {
			this.urlCheckTimeout = setTimeout(() => {
				let request = require("request");
				this.urlCheckRequest = request(e.target.value, (error, response, result) => {
					if (response && response.headers["content-type"] && response.headers["content-type"].indexOf("image") != -1) {
						$(e.target)
							.removeClass("invalid")
							.addClass("valid");
					}
					else {
						$(e.target)
							.removeClass("valid")
							.addClass("invalid");
					}
					if ($(e.target).hasClass("hovering")) this.createNoticeTooltip(e);
				});
			},500);
		}
	}
	
	createNoticeTooltip (e) {
		$(".tooltips").find(".notice-tooltip").remove();
		
		var input = e.target;
		var disabled = $(input).prop("disabled");
		var valid = $(input).hasClass("valid");
		var invalid = $(input).hasClass("invalid");
		if (disabled || valid || invalid) {
			var text = disabled ? "Ignore imageurl" : valid ? "Valid imageurl" : "Invalid imageurl";
			var bgColor = disabled ? "#282524" : valid ? "#297828" : "#8C2528";
			var customTooltipCSS = `
				.notice-tooltip {
					background-color: ${bgColor} !important;
				}
				.notice-tooltip:after {
					border-right-color: ${bgColor} !important;
				}`;
			BDfunctionsDevilBro.createTooltip(text, input, {type:"right",selector:"notice-tooltip",css:customTooltipCSS});
		}
	}
	
	resetServer (e) {
		$(".context-menu").hide();
		
		if (e.data.id) {
			var serverDiv = BDfunctionsDevilBro.getDivOfServer(e.data.id);
			var serverInner = $(serverDiv).find(".guild-inner");
			var server = $(serverDiv).find(".avatar-small");
			var bgImage = e.data.icon ? "url('https://cdn.discordapp.com/icons/" + e.data.id + "/" + e.data.icon + ".png')" : "";
			
			$(serverDiv)
				.removeClass("custom-editservers");
			$(serverInner)
				.off("mouseenter." + this.getName());
			$(server)
				.text($(server).attr("name"))
				.removeAttr("name")
				.css("background-image", bgImage)
				.css("background-color", "")
				.css("color", "");
			
			BDfunctionsDevilBro.removeData(e.data.id, this.getName(), "servers");
		}
	}
	
	loadServer (serverDiv) {
		var info = BDfunctionsDevilBro.getKeyInformation({"node":serverDiv, "key":"guild"});
		if (info) {
			var data = BDfunctionsDevilBro.loadData(info.id, this.getName(), "servers");
			if (data) {
				var serverInner = $(serverDiv).find(".guild-inner");
				var server = $(serverDiv).find(".avatar-small");
				if ($(server).attr("name") === undefined) {
					$(server).attr("name", $(server).text());
				}
				
				var name = 			data.name ? data.name : info.name;
				var shortName = 	data.shortName ? data.shortName : $(server).attr("name");
				var bgImage = 		data.url ? "url(" + data.url + ")" : (info.icon ? "url('https://cdn.discordapp.com/icons/" + info.id + "/" + info.icon + ".png')" : "");
				var removeIcon = 	data.removeIcon;
				var color1 = 		data.color1 ? BDfunctionsDevilBro.color2RGB(data.color1) : "";
				var color2 = 		data.color2 ? BDfunctionsDevilBro.color2RGB(data.color2) : "";
				
				$(serverDiv)
					.addClass("custom-editservers");
				$(serverInner)
					.off("mouseenter." + this.getName())
					.on("mouseenter." + this.getName(), {"div":serverDiv,"info":info}, this.createServerToolTip.bind(this));
				$(server)
					.text(shortName)
					.css("background-image", removeIcon ? "" : bgImage)
					.css("background-color", color1)
					.css("color", color2);
			}
		}
	}
	
	loadAllServers () {
		var servers = BDfunctionsDevilBro.readServerList();
		for (var i = 0; i < servers.length; i++) {
			this.loadServer(servers[i]);
		}
	}
	
	createServerToolTip (e) {
		var serverDiv = e.data.div;
		var info = e.data.info;
		var data = BDfunctionsDevilBro.loadData(info.id, this.getName(), "servers");
		if (data) {
			$(".tooltips").find(".tooltip").hide();
			var text = data.name ? data.name : info.name;
			var bgColor = data.color3 ? BDfunctionsDevilBro.color2RGB(data.color3) : "";
			var fontColor = data.color4 ? BDfunctionsDevilBro.color2RGB(data.color4) : "";
			var customTooltipCSS = `
				.guild-custom-tooltip {
					color: ${fontColor} !important;
					background-color: ${bgColor} !important;
				}
				.guild-custom-tooltip:after {
					border-right-color: ${bgColor} !important;
				}`;
				
			BDfunctionsDevilBro.createTooltip(text, serverDiv, {type:"right",selector:"guild-custom-tooltip",css:customTooltipCSS});
		}
	}
	
	setLabelsByLanguage () {
		switch (BDfunctionsDevilBro.getDiscordLanguage().id) {
			case "da": 		//danish
				return {
					context_localserversettings_text: 	"Lokal serverindstillinger",
					submenu_serversettings_text: 		"Skift indstillinger",
					submenu_resetsettings_text: 		"Nulstil server",
					modal_header_text: 	 				"Lokal serverindstillinger",
					modal_servername_text: 				"Lokalt servernavn",
					modal_servershortname_text: 		"Initialer",
					modal_serverurl_text: 				"Ikon",
					modal_removeicon_text: 				"Fjern ikon",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Ikonfarve",
					modal_tabheader3_text: 				"Tooltipfarve",
					modal_colorpicker1_text: 			"Ikonfarve",
					modal_colorpicker2_text: 			"Skriftfarve",
					modal_colorpicker3_text: 			"Tooltipfarve",
					modal_colorpicker4_text: 			"Skriftfarve",
					btn_cancel_text: 					"Afbryde",
					btn_save_text: 						"Spare"
				};
			case "de": 	//german
				return {
					context_localserversettings_text: 	"Lokale Servereinstellungen",
					submenu_serversettings_text: 		"Ändere Einstellungen",
					submenu_resetsettings_text: 		"Server zurücksetzen",
					modal_header_text: 					"Lokale Servereinstellungen",
					modal_servername_text: 				"Lokaler Servername",
					modal_servershortname_text: 		"Serverkürzel",
					modal_serverurl_text: 				"Icon",
					modal_removeicon_text: 				"Entferne Icon",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Iconfarbe",
					modal_tabheader3_text: 				"Tooltipfarbe",
					modal_colorpicker1_text: 			"Iconfarbe",
					modal_colorpicker2_text: 			"Schriftfarbe",
					modal_colorpicker3_text: 			"Tooltipfarbe",
					modal_colorpicker4_text: 			"Schriftfarbe",
					btn_cancel_text: 					"Abbrechen",
					btn_save_text: 						"Speichern"
				};
			case "es": 	//spanish
				return {
					context_localserversettings_text: 	"Ajustes local de servidor",
					submenu_serversettings_text: 		"Cambiar ajustes",
					submenu_resetsettings_text: 		"Restablecer servidor",
					modal_header_text: 					"Ajustes local de servidor",
					modal_servername_text: 				"Nombre local del servidor",
					modal_servershortname_text: 		"Iniciales",
					modal_serverurl_text: 				"Icono",
					modal_removeicon_text: 				"Eliminar icono",
					modal_tabheader1_text: 				"Servidor",
					modal_tabheader2_text: 				"Color del icono",
					modal_tabheader3_text:				"Color de tooltip",
					modal_colorpicker1_text: 			"Color del icono",
					modal_colorpicker2_text: 			"Color de fuente",
					modal_colorpicker3_text: 			"Color de tooltip",
					modal_colorpicker4_text: 			"Color de fuente",
					btn_cancel_text: 					"Cancelar",
					btn_save_text: 						"Guardar"
				};
			case "fr": 	//french
				return {
					context_localserversettings_text: 	"Paramètres locale du serveur",
					submenu_serversettings_text: 		"Modifier les paramètres",
					submenu_resetsettings_text: 		"Réinitialiser le serveur",
					modal_header_text: 					"Paramètres locale du serveur",
					modal_servername_text: 				"Nom local du serveur",
					modal_servershortname_text: 		"Initiales",
					modal_serverurl_text: 				"Icône",
					modal_removeicon_text: 				"Supprimer l'icône",
					modal_tabheader1_text: 				"Serveur",
					modal_tabheader2_text: 				"Couleur de l'icône",
					modal_tabheader3_text:				"Couleur de tooltip",
					modal_colorpicker1_text: 			"Couleur de l'icône",
					modal_colorpicker2_text: 			"Couleur de la police",
					modal_colorpicker3_text:			"Couleur de tooltip",
					modal_colorpicker4_text:			"Couleur de la police",
					btn_cancel_text: 					"Abandonner",
					btn_save_text: 						"Enregistrer"
				};
			case "it": 	//italian
				return {
					context_localserversettings_text: 	"Impostazioni locale server",
					submenu_serversettings_text: 		"Cambia impostazioni",
					submenu_resetsettings_text: 		"Ripristina server",
					modal_header_text: 					"Impostazioni locale server",
					modal_servername_text: 				"Nome locale server",
					modal_servershortname_text: 		"Iniziali",
					modal_serverurl_text: 				"Icona",
					modal_removeicon_text: 				"Rimuova l'icona",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Colore dell'icona",
					modal_tabheader3_text:				"Colore della tooltip",
					modal_colorpicker1_text: 			"Colore dell'icona",
					modal_colorpicker2_text: 			"Colore del carattere",
					modal_colorpicker3_text:			"Colore della tooltip",
					modal_colorpicker4_text:			"Colore del carattere",
					btn_cancel_text: 					"Cancellare",
					btn_save_text: 						"Salvare"
				};
			case "nl": 	//dutch
				return {
					context_localserversettings_text: 	"Lokale serverinstellingen",
					submenu_serversettings_text: 		"Verandere instellingen",
					submenu_resetsettings_text: 		"Reset server",
					modal_header_text: 					"Lokale serverinstellingen",
					modal_servername_text: 				"Lokale servernaam",
					modal_servershortname_text: 		"Initialen",
					modal_serverurl_text: 				"Icoon",
					modal_removeicon_text: 				"Verwijder icoon",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Icoon kleur",
					modal_tabheader3_text:				"Tooltip kleur",
					modal_colorpicker1_text: 			"Icoon kleur",
					modal_colorpicker2_text: 			"Doopvont kleur",
					modal_colorpicker3_text:			"Tooltip kleur",
					modal_colorpicker4_text:			"Doopvont kleur",
					btn_cancel_text: 					"Afbreken",
					btn_save_text: 						"Opslaan"
				};
			case "no": 	//norwegian
				return {
					context_localserversettings_text: 	"Lokal serverinnstillinger",
					submenu_serversettings_text: 		"Endre innstillinger",
					submenu_resetsettings_text: 		"Tilbakestill server",
					modal_header_text: 					"Lokal serverinnstillinger",
					modal_servername_text: 				"Lokalt servernavn",
					modal_servershortname_text: 		"Initialer",
					modal_serverurl_text: 				"Ikon",
					modal_removeicon_text: 				"Fjern ikon",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Ikonfarge",
					modal_tabheader3_text:				"Tooltipfarge",
					modal_colorpicker1_text: 			"Ikonfarge",
					modal_colorpicker2_text: 			"Skriftfarge",
					modal_colorpicker3_text:			"Tooltipfarge",
					modal_colorpicker4_text:			"Skriftfarge",
					btn_cancel_text: 					"Avbryte",
					btn_save_text: 						"Lagre"
				};
			case "pl": 	//polish
				return {
					context_localserversettings_text: 	"Lokalny ustawienia serwera",
					submenu_serversettings_text: 		"Zmień ustawienia",
					submenu_resetsettings_text: 		"Resetuj serwera",
					modal_header_text: 					"Lokalny ustawienia serwera",
					modal_servername_text: 				"Lokalna nazwa serwera",
					modal_servershortname_text: 		"Inicjały",
					modal_serverurl_text: 				"Ikony",
					modal_removeicon_text: 				"Usuń ikonę",
					modal_tabheader1_text: 				"Serwera",
					modal_tabheader2_text: 				"Kolor ikony",
					modal_tabheader3_text:				"Kolor tooltip",
					modal_colorpicker1_text: 			"Kolor ikony",
					modal_colorpicker2_text: 			"Kolor czcionki",
					modal_colorpicker3_text:			"Kolor tooltip",
					modal_colorpicker4_text:			"Kolor czcionki",
					btn_cancel_text: 					"Anuluj",
					btn_save_text: 						"Zapisz"
				};
			case "pt": 	//portuguese (brazil)
				return {
					context_localserversettings_text: 	"Configurações local do servidor",
					submenu_serversettings_text: 		"Mudar configurações",
					submenu_resetsettings_text: 		"Redefinir servidor",
					modal_header_text: 					"Configurações local do servidor",
					modal_servername_text: 				"Nome local do servidor",
					modal_servershortname_text: 		"Iniciais",
					modal_serverurl_text: 				"Icone",
					modal_removeicon_text: 				"Remover ícone",
					modal_tabheader1_text: 				"Servidor",
					modal_tabheader2_text: 				"Cor do ícone",
					modal_tabheader3_text:				"Cor da tooltip",
					modal_colorpicker1_text: 			"Cor do ícone",
					modal_colorpicker2_text: 			"Cor da fonte",
					modal_colorpicker3_text:			"Cor da tooltip",
					modal_colorpicker4_text:			"Cor da fonte",
					btn_cancel_text: 					"Cancelar",
					btn_save_text: 						"Salvar"
				};
			case "fi": 	//finnish
				return {
					context_localserversettings_text: 	"Paikallinen palvelimen asetukset",
					submenu_serversettings_text: 		"Vaihda asetuksia",
					submenu_resetsettings_text: 		"Nollaa palvelimen",
					modal_header_text: 					"Paikallinen palvelimen asetukset",
					modal_servername_text: 				"Paikallinen palvelimenimi",
					modal_servershortname_text: 		"Nimikirjaimet",
					modal_serverurl_text: 				"Ikonin",
					modal_removeicon_text: 				"Poista kuvake",
					modal_tabheader1_text: 				"Palvelimen",
					modal_tabheader2_text: 				"Ikonin väri",
					modal_tabheader3_text:				"Tooltip väri",
					modal_colorpicker1_text: 			"Ikonin väri",
					modal_colorpicker2_text: 			"Fontin väri",
					modal_colorpicker3_text:			"Tooltip väri",
					modal_colorpicker4_text:			"Fontin väri",
					btn_cancel_text: 					"Peruuttaa",
					btn_save_text: 						"Tallentaa"
				};
			case "sv": 	//swedish
				return {
					context_localserversettings_text: 	"Lokal serverinställningar",
					submenu_serversettings_text: 		"Ändra inställningar",
					submenu_resetsettings_text: 		"Återställ server",
					modal_header_text: 					"Lokal serverinställningar",
					modal_servername_text: 				"Lokalt servernamn",
					modal_servershortname_text: 		"Initialer",
					modal_serverurl_text: 				"Ikon",
					modal_removeicon_text: 				"Ta bort ikonen",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Ikonfärg",
					modal_tabheader3_text:				"Tooltipfärg",
					modal_colorpicker1_text: 			"Ikonfärg",
					modal_colorpicker2_text: 			"Fontfärg",
					modal_colorpicker3_text:			"Tooltipfärg",
					modal_colorpicker4_text:			"Fontfärg",
					btn_cancel_text: 					"Avbryta",
					btn_save_text: 						"Spara"
				};
			case "tr": 	//turkish
				return {
					context_localserversettings_text: 	"Yerel Sunucu Ayarları",
					submenu_serversettings_text: 		"Ayarları Değiştir",
					submenu_resetsettings_text: 		"Sunucu Sıfırla",
					modal_header_text: 					"Yerel Sunucu Ayarları",
					modal_servername_text: 				"Yerel Sunucu Adı",
					modal_servershortname_text: 		"Baş harfleri",
					modal_serverurl_text: 				"Simge",
					modal_removeicon_text: 				"Simge kaldır",
					modal_tabheader1_text: 				"Sunucu",
					modal_tabheader2_text: 				"Simge rengi",
					modal_tabheader3_text:				"Tooltip rengi",
					modal_colorpicker1_text: 			"Simge rengi",
					modal_colorpicker2_text: 			"Yazı rengi",
					modal_colorpicker3_text:			"Tooltip rengi",
					modal_colorpicker4_text:			"Yazı rengi",
					btn_cancel_text: 					"Iptal",
					btn_save_text: 						"Kayıt"
				};
			case "cs": 	//czech
				return {
					context_localserversettings_text: 	"Místní nastavení serveru",
					submenu_serversettings_text: 		"Změnit nastavení",
					submenu_resetsettings_text: 		"Obnovit server",
					modal_header_text: 					"Místní nastavení serveru",
					modal_servername_text: 				"Místní název serveru",
					modal_servershortname_text: 		"Iniciály",
					modal_serverurl_text: 				"Ikony",
					modal_removeicon_text: 				"Odstranit ikonu",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Barva ikony",
					modal_tabheader3_text:				"Barva tooltip",
					modal_colorpicker1_text: 			"Barva ikony",
					modal_colorpicker2_text: 			"Barva fontu",
					modal_colorpicker3_text:			"Barva tooltip",
					modal_colorpicker4_text:			"Barva fontu",
					btn_cancel_text: 					"Zrušení",
					btn_save_text: 						"Uložit"
				};
			case "bg": 	//bulgarian
				return {
					context_localserversettings_text: 	"Настройки за локални cървър",
					submenu_serversettings_text: 		"Промяна на настройките",
					submenu_resetsettings_text: 		"Възстановяване на cървър",
					modal_header_text: 					"Настройки за локални cървър",
					modal_servername_text: 				"Локално име на cървър",
					modal_servershortname_text: 		"Инициали",
					modal_serverurl_text: 				"Икона",
					modal_removeicon_text: 				"Премахване на иконата",
					modal_tabheader1_text: 				"Cървър",
					modal_tabheader2_text: 				"Цвят на иконата",
					modal_tabheader3_text:				"Цвят на подсказка",
					modal_colorpicker1_text: 			"Цвят на иконата",
					modal_colorpicker2_text: 			"Цвят на шрифта",
					modal_colorpicker3_text:			"Цвят на подсказка",
					modal_colorpicker4_text:			"Цвят на шрифта",
					btn_cancel_text: 					"Зъбести",
					btn_save_text: 						"Cпасяване"
				};
			case "ru": 	//russian
				return {
					context_localserversettings_text: 	"Настройки локального cервер",
					submenu_serversettings_text: 		"Изменить настройки",
					submenu_resetsettings_text: 		"Сбросить cервер",
					modal_header_text: 					"Настройки локального cервер",
					modal_servername_text: 				"Имя локального cервер",
					modal_servershortname_text: 		"Инициалы",
					modal_serverurl_text: 				"Значок",
					modal_removeicon_text: 				"Удалить значок",
					modal_tabheader1_text: 				"Cервер",
					modal_tabheader2_text: 				"Цвет значков",
					modal_tabheader3_text:				"Цвет подсказка",
					modal_colorpicker1_text: 			"Цвет значков",
					modal_colorpicker2_text: 			"Цвет шрифта",
					modal_colorpicker3_text:			"Цвет подсказка",
					modal_colorpicker4_text:			"Цвет шрифта",
					btn_cancel_text: 					"Отмена",
					btn_save_text: 						"Cпасти"
				};
			case "uk": 	//ukranian
				return {
					context_localserversettings_text: 	"Налаштування локального cервер",
					submenu_serversettings_text: 		"Змінити налаштування",
					submenu_resetsettings_text: 		"Скидання cервер",
					modal_header_text: 					"Налаштування локального cервер",
					modal_servername_text: 				"Локальне ім'я cервер",
					modal_servershortname_text: 		"Ініціали",
					modal_serverurl_text: 				"Іконка",
					modal_removeicon_text: 				"Видалити піктограму",
					modal_tabheader1_text: 				"Cервер",
					modal_tabheader2_text: 				"Колір ікони",
					modal_tabheader3_text:				"Колір підказка",
					modal_colorpicker1_text: 			"Колір ікони",
					modal_colorpicker2_text: 			"Колір шрифту",
					modal_colorpicker3_text:			"Колір підказка",
					modal_colorpicker4_text:			"Колір шрифту",
					btn_cancel_text: 					"Скасувати",
					btn_save_text: 						"Зберегти"
				};
			case "ja": 	//japanese
				return {
					context_localserversettings_text: 	"ローカルサーバー設定",
					submenu_serversettings_text: 		"設定を変更する",
					submenu_resetsettings_text: 		"サーバーをリセットする",
					modal_header_text: 					"ローカルサーバー設定",
					modal_servername_text: 				"ローカルサーバー名",
					modal_servershortname_text: 		"イニシャル",
					modal_serverurl_text: 				"アイコン",
					modal_removeicon_text: 				"アイコンを削除",
					modal_tabheader1_text: 				"サーバー",
					modal_tabheader2_text: 				"アイコンの色",
					modal_tabheader3_text:				"ツールチップの色",
					modal_colorpicker1_text: 			"アイコンの色",
					modal_colorpicker2_text: 			"フォントの色",
					modal_colorpicker3_text:			"ツールチップの色",
					modal_colorpicker4_text:			"フォントの色",
					btn_cancel_text: 					"キャンセル",
					btn_save_text: 						"セーブ"
				};
			case "zh": 	//chinese (traditional)
				return {
					context_localserversettings_text: 	"本地服務器設置",
					submenu_serversettings_text: 		"更改設置",
					submenu_resetsettings_text: 		"重置服務器",
					modal_header_text: 					"本地服務器設置",
					modal_servername_text: 				"服務器名稱",
					modal_servershortname_text: 		"聲母",
					modal_serverurl_text: 				"圖標",
					modal_removeicon_text: 				"刪除圖標",
					modal_tabheader1_text: 				"服務器",
					modal_tabheader2_text: 				"圖標顏色",
					modal_tabheader3_text: 				"工具提示顏色",
					modal_colorpicker1_text: 			"圖標顏色",
					modal_colorpicker2_text: 			"字體顏色",
					modal_colorpicker3_text:			"工具提示顏色",
					modal_colorpicker4_text:			"字體顏色",
					btn_cancel_text: 					"取消",
					btn_save_text: 						"保存"
				};
			case "ko": 	//korean
				return {
					context_localserversettings_text: 	"로컬 서버 설정",
					submenu_serversettings_text: 		"설정 변경",
					submenu_resetsettings_text: 		"서버 재설정",
					modal_header_text: 					"로컬 서버 설정",
					modal_servername_text: 				"로컬 서버 이름",
					modal_servershortname_text: 		"머리 글자",
					modal_serverurl_text: 				"상",
					modal_removeicon_text: 				"상 삭제",
					modal_tabheader1_text: 				"서버",
					modal_tabheader2_text: 				"상 색깔",
					modal_tabheader3_text:				"툴팁 색깔",
					modal_colorpicker1_text: 			"상 색깔",
					modal_colorpicker2_text: 			"글꼴 색깔",
					modal_colorpicker3_text:			"툴팁 색깔",
					modal_colorpicker4_text:			"글꼴 색깔",
					btn_cancel_text: 					"취소",
					btn_save_text: 						"저장"
				};
			default: 	//default: english
				return {
					context_localserversettings_text: 	"Local Serversettings",
					submenu_serversettings_text: 		"Change Settings",
					submenu_resetsettings_text: 		"Reset Server",
					modal_header_text: 					"Local Serversettings",
					modal_servername_text: 				"Local Servername",
					modal_servershortname_text: 		"Initials",
					modal_serverurl_text: 				"Icon",
					modal_removeicon_text: 				"Remove Icon",
					modal_tabheader1_text: 				"Server",
					modal_tabheader2_text: 				"Iconcolor",
					modal_tabheader3_text:				"Tooltipcolor",
					modal_colorpicker1_text: 			"Iconcolor",
					modal_colorpicker2_text: 			"Fontcolor",
					modal_colorpicker3_text:			"Tooltipcolor",
					modal_colorpicker4_text:			"Fontcolor",
					btn_cancel_text: 					"Cancel",
					btn_save_text: 						"Save"
				};
		}
	}
}
