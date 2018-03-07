﻿!function (a) { "use strict"; function b(a, b) { for (var c = 0; c < a.length; ++c) b(a[c], c) } function c(b, c) { this.$select = a(b), this.options = this.mergeOptions(a.extend({}, c, this.$select.data())), this.$select.attr("data-placeholder") && (this.options.nonSelectedText = this.$select.data("placeholder")), this.originalOptions = this.$select.clone()[0].options, this.query = "", this.searchTimeout = null, this.lastToggledInput = null, this.options.multiple = "multiple" === this.$select.attr("multiple"), this.options.onChange = a.proxy(this.options.onChange, this), this.options.onSelectAll = a.proxy(this.options.onSelectAll, this), this.options.onDeselectAll = a.proxy(this.options.onDeselectAll, this), this.options.onDropdownShow = a.proxy(this.options.onDropdownShow, this), this.options.onDropdownHide = a.proxy(this.options.onDropdownHide, this), this.options.onDropdownShown = a.proxy(this.options.onDropdownShown, this), this.options.onDropdownHidden = a.proxy(this.options.onDropdownHidden, this), this.options.onInitialized = a.proxy(this.options.onInitialized, this), this.options.onFiltering = a.proxy(this.options.onFiltering, this), this.buildContainer(), this.buildButton(), this.buildDropdown(), this.buildSelectAll(), this.buildDropdownOptions(), this.buildFilter(), this.updateButtonText(), this.updateSelectAll(!0), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), this.options.wasDisabled = this.$select.prop("disabled"), this.options.disableIfEmpty && a("option", this.$select).length <= 0 && this.disable(), this.$select.wrap('<span class="multiselect-native-select" />').after(this.$container), this.options.onInitialized(this.$select, this.$container) } "undefined" != typeof ko && ko.bindingHandlers && !ko.bindingHandlers.multiselect && (ko.bindingHandlers.multiselect = { after: ["options", "value", "selectedOptions", "enable", "disable"], init: function (b, c, d, e, f) { var g = a(b), h = ko.toJS(c()); if (g.multiselect(h), d.has("options")) { var i = d.get("options"); ko.isObservable(i) && ko.computed({ read: function () { i(), setTimeout(function () { var a = g.data("multiselect"); a && a.updateOriginalOptions(), g.multiselect("rebuild") }, 1) }, disposeWhenNodeIsRemoved: b }) } if (d.has("value")) { var j = d.get("value"); ko.isObservable(j) && ko.computed({ read: function () { j(), setTimeout(function () { g.multiselect("refresh") }, 1) }, disposeWhenNodeIsRemoved: b }).extend({ rateLimit: 100, notifyWhenChangesStop: !0 }) } if (d.has("selectedOptions")) { var k = d.get("selectedOptions"); ko.isObservable(k) && ko.computed({ read: function () { k(), setTimeout(function () { g.multiselect("refresh") }, 1) }, disposeWhenNodeIsRemoved: b }).extend({ rateLimit: 100, notifyWhenChangesStop: !0 }) } var l = function (a) { setTimeout(function () { a ? g.multiselect("enable") : g.multiselect("disable") }) }; if (d.has("enable")) { var m = d.get("enable"); ko.isObservable(m) ? ko.computed({ read: function () { l(m()) }, disposeWhenNodeIsRemoved: b }).extend({ rateLimit: 100, notifyWhenChangesStop: !0 }) : l(m) } if (d.has("disable")) { var n = d.get("disable"); ko.isObservable(n) ? ko.computed({ read: function () { l(!n()) }, disposeWhenNodeIsRemoved: b }).extend({ rateLimit: 100, notifyWhenChangesStop: !0 }) : l(!n) } ko.utils.domNodeDisposal.addDisposeCallback(b, function () { g.multiselect("destroy") }) }, update: function (b, c, d, e, f) { var g = a(b), h = ko.toJS(c()); g.multiselect("setOptions", h), g.multiselect("rebuild") } }), c.prototype = { defaults: { buttonText: function (b, c) { if (this.disabledText.length > 0 && (c.prop("disabled") || 0 == b.length && this.disableIfEmpty)) return this.disabledText; if (0 === b.length) return this.nonSelectedText; if (this.allSelectedText && b.length === a("option", a(c)).length && 1 !== a("option", a(c)).length && this.multiple) return this.selectAllNumber ? this.allSelectedText + " (" + b.length + ")" : this.allSelectedText; if (b.length > this.numberDisplayed) return b.length + " " + this.nSelectedText; var d = "", e = this.delimiterText; return b.each(function () { var b = void 0 !== a(this).attr("label") ? a(this).attr("label") : a(this).text(); d += b + e }), d.substr(0, d.length - this.delimiterText.length) }, buttonTitle: function (b, c) { if (0 === b.length) return this.nonSelectedText; var d = "", e = this.delimiterText; return b.each(function () { var b = void 0 !== a(this).attr("label") ? a(this).attr("label") : a(this).text(); d += b + e }), d.substr(0, d.length - this.delimiterText.length) }, checkboxName: function (a) { return !1 }, optionLabel: function (b) { return a(b).attr("label") || a(b).text() }, optionClass: function (b) { return a(b).attr("class") || "" }, onChange: function (a, b) { }, onDropdownShow: function (a) { }, onDropdownHide: function (a) { }, onDropdownShown: function (a) { }, onDropdownHidden: function (a) { }, onSelectAll: function () { }, onDeselectAll: function () { }, onInitialized: function (a, b) { }, onFiltering: function (a) { }, enableHTML: !1, buttonClass: "btn btn-default", inheritClass: !1, buttonWidth: "auto", buttonContainer: '<div class="btn-group" />', dropRight: !1, dropUp: !1, selectedClass: "active", maxHeight: !1, includeSelectAllOption: !1, includeSelectAllIfMoreThan: 0, selectAllText: " Select all", selectAllValue: "multiselect-all", selectAllName: !1, selectAllNumber: !0, selectAllJustVisible: !0, enableFiltering: !1, enableCaseInsensitiveFiltering: !1, enableFullValueFiltering: !1, enableClickableOptGroups: !1, enableCollapsibleOptGroups: !1, filterPlaceholder: "Search", filterBehavior: "text", includeFilterClearBtn: !0, preventInputChangeEvent: !1, nonSelectedText: "None selected", nSelectedText: "selected", allSelectedText: "All selected", numberDisplayed: 3, disableIfEmpty: !1, disabledText: "", delimiterText: ", ", templates: { button: '<button type="button" class="multiselect dropdown-toggle" data-toggle="dropdown"><span class="multiselect-selected-text"></span> <b class="caret"></b></button>', ul: '<ul class="multiselect-container dropdown-menu"></ul>', filter: '<li class="multiselect-item multiselect-filter"><div class="input-group"><span class="input-group-addon"><i class="glyphicon glyphicon-search"></i></span><input class="form-control multiselect-search" type="text"></div></li>', filterClearBtn: '<span class="input-group-btn"><button class="btn btn-default multiselect-clear-filter" type="button"><i class="glyphicon glyphicon-remove-circle"></i></button></span>', li: '<li><a tabindex="0"><label></label></a></li>', divider: '<li class="multiselect-item divider"></li>', liGroup: '<li class="multiselect-item multiselect-group"><label></label></li>' } }, constructor: c, buildContainer: function () { this.$container = a(this.options.buttonContainer), this.$container.on("show.bs.dropdown", this.options.onDropdownShow), this.$container.on("hide.bs.dropdown", this.options.onDropdownHide), this.$container.on("shown.bs.dropdown", this.options.onDropdownShown), this.$container.on("hidden.bs.dropdown", this.options.onDropdownHidden) }, buildButton: function () { this.$button = a(this.options.templates.button).addClass(this.options.buttonClass), this.$select.attr("class") && this.options.inheritClass && this.$button.addClass(this.$select.attr("class")), this.$select.prop("disabled") ? this.disable() : this.enable(), this.options.buttonWidth && "auto" !== this.options.buttonWidth && (this.$button.css({ width: "100%", overflow: "hidden", "text-overflow": "ellipsis" }), this.$container.css({ width: this.options.buttonWidth })); var b = this.$select.attr("tabindex"); b && this.$button.attr("tabindex", b), this.$container.prepend(this.$button) }, buildDropdown: function () { if (this.$ul = a(this.options.templates.ul), this.options.dropRight && this.$ul.addClass("pull-right"), this.options.maxHeight && this.$ul.css({ "max-height": this.options.maxHeight + "px", "overflow-y": "auto", "overflow-x": "hidden" }), this.options.dropUp) { var b = Math.min(this.options.maxHeight, 26 * a('option[data-role!="divider"]', this.$select).length + 19 * a('option[data-role="divider"]', this.$select).length + (this.options.includeSelectAllOption ? 26 : 0) + (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering ? 44 : 0)), c = b + 34; this.$ul.css({ "max-height": b + "px", "overflow-y": "auto", "overflow-x": "hidden", "margin-top": "-" + c + "px" }) } this.$container.append(this.$ul) }, buildDropdownOptions: function () { this.$select.children().each(a.proxy(function (b, c) { var d = a(c), e = d.prop("tagName").toLowerCase(); d.prop("value") !== this.options.selectAllValue && ("optgroup" === e ? this.createOptgroup(c) : "option" === e && ("divider" === d.data("role") ? this.createDivider() : this.createOptionValue(c))) }, this)), a("li:not(.multiselect-group) input", this.$ul).on("change", a.proxy(function (b) { var c = a(b.target), d = c.prop("checked") || !1, e = c.val() === this.options.selectAllValue; this.options.selectedClass && (d ? c.closest("li").addClass(this.options.selectedClass) : c.closest("li").removeClass(this.options.selectedClass)); var f = c.val(), g = this.getOptionByValue(f), h = a("option", this.$select).not(g), i = a("input", this.$container).not(c); if (e ? d ? this.selectAll(this.options.selectAllJustVisible, !0) : this.deselectAll(this.options.selectAllJustVisible, !0) : (d ? (g.prop("selected", !0), this.options.multiple ? g.prop("selected", !0) : (this.options.selectedClass && a(i).closest("li").removeClass(this.options.selectedClass), a(i).prop("checked", !1), h.prop("selected", !1), this.$button.click()), "active" === this.options.selectedClass && h.closest("a").css("outline", "")) : g.prop("selected", !1), this.options.onChange(g, d), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups()), this.$select.change(), this.updateButtonText(), this.options.preventInputChangeEvent) return !1 }, this)), a("li a", this.$ul).on("mousedown", function (a) { if (a.shiftKey) return !1 }), a("li a", this.$ul).on("touchstart click", a.proxy(function (b) { b.stopPropagation(); var c = a(b.target); if (b.shiftKey && this.options.multiple) { c.is("label") && (b.preventDefault(), c = c.find("input"), c.prop("checked", !c.prop("checked"))); var d = c.prop("checked") || !1; if (null !== this.lastToggledInput && this.lastToggledInput !== c) { var e = c.closest("li").index(), f = this.lastToggledInput.closest("li").index(); if (e > f) { var g = f; f = e, e = g } ++f; var h = this.$ul.find("li").slice(e, f).find("input"); h.prop("checked", d), this.options.selectedClass && h.closest("li").toggleClass(this.options.selectedClass, d); for (var i = 0, j = h.length; i < j; i++) { var k = a(h[i]), l = this.getOptionByValue(k.val()); l.prop("selected", d) } } c.trigger("change") } c.is("input") && !c.closest("li").is(".multiselect-item") && (this.lastToggledInput = c), c.blur() }, this)), this.$container.off("keydown.multiselect").on("keydown.multiselect", a.proxy(function (b) { if (!a('input[type="text"]', this.$container).is(":focus")) if (9 === b.keyCode && this.$container.hasClass("open")) this.$button.click(); else { var c = a(this.$container).find("li:not(.divider):not(.disabled) a").filter(":visible"); if (!c.length) return; var d = c.index(c.filter(":focus")); 38 === b.keyCode && d > 0 ? d-- : 40 === b.keyCode && d < c.length - 1 ? d++ : ~d || (d = 0); var e = c.eq(d); if (e.focus(), 32 === b.keyCode || 13 === b.keyCode) { var f = e.find("input"); f.prop("checked", !f.prop("checked")), f.change() } b.stopPropagation(), b.preventDefault() } }, this)), this.options.enableClickableOptGroups && this.options.multiple && a("li.multiselect-group input", this.$ul).on("change", a.proxy(function (b) { b.stopPropagation(); var c = a(b.target), d = c.prop("checked") || !1, e = a(b.target).closest("li"), f = e.nextUntil("li.multiselect-group").not(".multiselect-filter-hidden").not(".disabled"), g = f.find("input"), i = []; this.options.selectedClass && (d ? e.addClass(this.options.selectedClass) : e.removeClass(this.options.selectedClass)), a.each(g, a.proxy(function (b, c) { var e = a(c).val(), f = this.getOptionByValue(e); d ? (a(c).prop("checked", !0), a(c).closest("li").addClass(this.options.selectedClass), f.prop("selected", !0)) : (a(c).prop("checked", !1), a(c).closest("li").removeClass(this.options.selectedClass), f.prop("selected", !1)), i.push(this.getOptionByValue(e)) }, this)), this.options.onChange(i, d), this.updateButtonText(), this.updateSelectAll() }, this)), this.options.enableCollapsibleOptGroups && this.options.multiple && (a("li.multiselect-group .caret-container", this.$ul).on("click", a.proxy(function (b) { var c = a(b.target).closest("li"), d = c.nextUntil("li.multiselect-group").not(".multiselect-filter-hidden"), e = !0; d.each(function () { e = e && a(this).is(":visible") }), e ? d.hide().addClass("multiselect-collapsible-hidden") : d.show().removeClass("multiselect-collapsible-hidden") }, this)), a("li.multiselect-all", this.$ul).css("background", "#f3f3f3").css("border-bottom", "1px solid #eaeaea"), a("li.multiselect-all > a > label.checkbox", this.$ul).css("padding", "3px 20px 3px 35px"), a("li.multiselect-group > a > input", this.$ul).css("margin", "4px 0px 5px -20px")) }, createOptionValue: function (b) { var c = a(b); c.is(":selected") && c.prop("selected", !0); var d = this.options.optionLabel(b), e = this.options.optionClass(b), f = c.val(), g = this.options.multiple ? "checkbox" : "radio", h = a(this.options.templates.li), i = a("label", h); i.addClass(g), h.addClass(e), this.options.enableHTML ? i.html(" " + d) : i.text(" " + d); var j = a("<input/>").attr("type", g), k = this.options.checkboxName(c); k && j.attr("name", k), i.prepend(j); var l = c.prop("selected") || !1; j.val(f), f === this.options.selectAllValue && (h.addClass("multiselect-item multiselect-all"), j.parent().parent().addClass("multiselect-all")), i.attr("title", c.attr("title")), this.$ul.append(h), c.is(":disabled") && j.attr("disabled", "disabled").prop("disabled", !0).closest("a").attr("tabindex", "-1").closest("li").addClass("disabled"), j.prop("checked", l), l && this.options.selectedClass && j.closest("li").addClass(this.options.selectedClass) }, createDivider: function (b) { var c = a(this.options.templates.divider); this.$ul.append(c) }, createOptgroup: function (b) { var c = a(b).attr("label"), d = a(b).attr("value"), e = a('<li class="multiselect-item multiselect-group"><a href="javascript:void(0);"><label><b></b></label></a></li>'), f = this.options.optionClass(b); e.addClass(f), this.options.enableHTML ? a("label b", e).html(" " + c) : a("label b", e).text(" " + c), this.options.enableCollapsibleOptGroups && this.options.multiple && a("a", e).append('<span class="caret-container"><b class="caret"></b></span>'), this.options.enableClickableOptGroups && this.options.multiple && a("a label", e).prepend('<input type="checkbox" value="' + d + '"/>'), a(b).is(":disabled") && e.addClass("disabled"), this.$ul.append(e), a("option", b).each(a.proxy(function (a, b) { this.createOptionValue(b) }, this)) }, buildSelectAll: function () { "number" == typeof this.options.selectAllValue && (this.options.selectAllValue = this.options.selectAllValue.toString()); var b = this.hasSelectAll(); if (!b && this.options.includeSelectAllOption && this.options.multiple && a("option", this.$select).length > this.options.includeSelectAllIfMoreThan) { this.options.includeSelectAllDivider && this.$ul.prepend(a(this.options.templates.divider)); var c = a(this.options.templates.li); a("label", c).addClass("checkbox"), this.options.enableHTML ? a("label", c).html(" " + this.options.selectAllText) : a("label", c).text(" " + this.options.selectAllText), this.options.selectAllName ? a("label", c).prepend('<input type="checkbox" name="' + this.options.selectAllName + '" />') : a("label", c).prepend('<input type="checkbox" />'); var d = a("input", c); d.val(this.options.selectAllValue), c.addClass("multiselect-item multiselect-all"), d.parent().parent().addClass("multiselect-all"), this.$ul.prepend(c), d.prop("checked", !1) } }, buildFilter: function () { if (this.options.enableFiltering || this.options.enableCaseInsensitiveFiltering) { var b = Math.max(this.options.enableFiltering, this.options.enableCaseInsensitiveFiltering); if (this.$select.find("option").length >= b) { if (this.$filter = a(this.options.templates.filter), a("input", this.$filter).attr("placeholder", this.options.filterPlaceholder), this.options.includeFilterClearBtn) { var c = a(this.options.templates.filterClearBtn); c.on("click", a.proxy(function (b) { clearTimeout(this.searchTimeout), this.$filter.find(".multiselect-search").val(""), a("li", this.$ul).show().removeClass("multiselect-filter-hidden"), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups() }, this)), this.$filter.find(".input-group").append(c) } this.$ul.prepend(this.$filter), this.$filter.val(this.query).on("click", function (a) { a.stopPropagation() }).on("input keydown", a.proxy(function (b) { 13 === b.which && b.preventDefault(), clearTimeout(this.searchTimeout), this.searchTimeout = this.asyncFunction(a.proxy(function () { if (this.query !== b.target.value) { this.query = b.target.value; var c, d; a.each(a("li", this.$ul), a.proxy(function (b, e) { var f = a("input", e).length > 0 ? a("input", e).val() : "", g = a("label", e).text(), h = ""; if ("text" === this.options.filterBehavior ? h = g : "value" === this.options.filterBehavior ? h = f : "both" === this.options.filterBehavior && (h = g + "\n" + f), f !== this.options.selectAllValue && g) { var i = !1; if (this.options.enableCaseInsensitiveFiltering && (h = h.toLowerCase(), this.query = this.query.toLowerCase()), this.options.enableFullValueFiltering && "both" !== this.options.filterBehavior) { var j = h.trim().substring(0, this.query.length); this.query.indexOf(j) > -1 && (i = !0) } else h.indexOf(this.query) > -1 && (i = !0); a(e).toggle(i).toggleClass("multiselect-filter-hidden", !i), a(e).hasClass("multiselect-group") ? (c = e, d = i) : (i && a(c).show().removeClass("multiselect-filter-hidden"), !i && d && a(e).show().removeClass("multiselect-filter-hidden")) } }, this)) } this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), this.options.onFiltering(b.target) }, this), 300, this) }, this)) } } }, destroy: function () { this.$container.remove(), this.$select.show(), this.$select.prop("disabled", this.options.wasDisabled), this.$select.data("multiselect", null) }, refresh: function () { var b = a.map(a("li input", this.$ul), a); a("option", this.$select).each(a.proxy(function (c, d) { for (var g, e = a(d), f = e.val(), h = b.length; 0 < h--;) if (f === (g = b[h]).val()) { e.is(":selected") ? (g.prop("checked", !0), this.options.selectedClass && g.closest("li").addClass(this.options.selectedClass)) : (g.prop("checked", !1), this.options.selectedClass && g.closest("li").removeClass(this.options.selectedClass)), e.is(":disabled") ? g.attr("disabled", "disabled").prop("disabled", !0).closest("li").addClass("disabled") : g.prop("disabled", !1).closest("li").removeClass("disabled"); break } }, this)), this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups() }, select: function (b, c) { a.isArray(b) || (b = [b]); for (var d = 0; d < b.length; d++) { var e = b[d]; if (null !== e && void 0 !== e) { var f = this.getOptionByValue(e), g = this.getInputByValue(e); void 0 !== f && void 0 !== g && (this.options.multiple || this.deselectAll(!1), this.options.selectedClass && g.closest("li").addClass(this.options.selectedClass), g.prop("checked", !0), f.prop("selected", !0), c && this.options.onChange(f, !0)) } } this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups() }, clearSelection: function () { this.deselectAll(!1), this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups() }, deselect: function (b, c) { a.isArray(b) || (b = [b]); for (var d = 0; d < b.length; d++) { var e = b[d]; if (null !== e && void 0 !== e) { var f = this.getOptionByValue(e), g = this.getInputByValue(e); void 0 !== f && void 0 !== g && (this.options.selectedClass && g.closest("li").removeClass(this.options.selectedClass), g.prop("checked", !1), f.prop("selected", !1), c && this.options.onChange(f, !1)) } } this.updateButtonText(), this.updateSelectAll(), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups() }, selectAll: function (b, c) { var b = "undefined" == typeof b || b, d = a("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul), e = a("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(":visible"); b ? (a("input:enabled", e).prop("checked", !0), e.addClass(this.options.selectedClass), a("input:enabled", e).each(a.proxy(function (b, c) { var d = a(c).val(), e = this.getOptionByValue(d); a(e).prop("selected", !0) }, this))) : (a("input:enabled", d).prop("checked", !0), d.addClass(this.options.selectedClass), a("input:enabled", d).each(a.proxy(function (b, c) { var d = a(c).val(), e = this.getOptionByValue(d); a(e).prop("selected", !0) }, this))), a('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop("checked", !0), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), c && this.options.onSelectAll() }, deselectAll: function (b, c) { var b = "undefined" == typeof b || b, d = a("li:not(.divider):not(.disabled):not(.multiselect-group)", this.$ul), e = a("li:not(.divider):not(.disabled):not(.multiselect-group):not(.multiselect-filter-hidden):not(.multiselect-collapisble-hidden)", this.$ul).filter(":visible"); b ? (a('input[type="checkbox"]:enabled', e).prop("checked", !1), e.removeClass(this.options.selectedClass), a('input[type="checkbox"]:enabled', e).each(a.proxy(function (b, c) { var d = a(c).val(), e = this.getOptionByValue(d); a(e).prop("selected", !1) }, this))) : (a('input[type="checkbox"]:enabled', d).prop("checked", !1), d.removeClass(this.options.selectedClass), a('input[type="checkbox"]:enabled', d).each(a.proxy(function (b, c) { var d = a(c).val(), e = this.getOptionByValue(d); a(e).prop("selected", !1) }, this))), a('li input[value="' + this.options.selectAllValue + '"]', this.$ul).prop("checked", !1), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), c && this.options.onDeselectAll() }, rebuild: function () { this.$ul.html(""), this.options.multiple = "multiple" === this.$select.attr("multiple"), this.buildSelectAll(), this.buildDropdownOptions(), this.buildFilter(), this.updateButtonText(), this.updateSelectAll(!0), this.options.enableClickableOptGroups && this.options.multiple && this.updateOptGroups(), this.options.disableIfEmpty && a("option", this.$select).length <= 0 ? this.disable() : this.enable(), this.options.dropRight && this.$ul.addClass("pull-right") }, dataprovider: function (c) { var d = 0, e = this.$select.empty(); a.each(c, function (c, f) { var g; if (a.isArray(f.children)) d++, g = a("<optgroup/>").attr({ label: f.label || "Group " + d, disabled: !!f.disabled }), b(f.children, function (b) { var c = { value: b.value, label: b.label || b.value, title: b.title, selected: !!b.selected, disabled: !!b.disabled }; for (var d in b.attributes) c["data-" + d] = b.attributes[d]; g.append(a("<option/>").attr(c)) }); else { var h = { value: f.value, label: f.label || f.value, title: f.title, class: f.class, selected: !!f.selected, disabled: !!f.disabled }; for (var i in f.attributes) h["data-" + i] = f.attributes[i]; g = a("<option/>").attr(h), g.text(f.label || f.value) } e.append(g) }), this.rebuild() }, enable: function () { this.$select.prop("disabled", !1), this.$button.prop("disabled", !1).removeClass("disabled") }, disable: function () { this.$select.prop("disabled", !0), this.$button.prop("disabled", !0).addClass("disabled") }, setOptions: function (a) { this.options = this.mergeOptions(a) }, mergeOptions: function (b) { return a.extend(!0, {}, this.defaults, this.options, b) }, hasSelectAll: function () { return a("li.multiselect-all", this.$ul).length > 0 }, updateOptGroups: function () { var b = a("li.multiselect-group", this.$ul), c = this.options.selectedClass; b.each(function () { var b = a(this).nextUntil("li.multiselect-group").not(".multiselect-filter-hidden").not(".disabled"), d = !0; b.each(function () { var b = a("input", this); b.prop("checked") || (d = !1) }), c && (d ? a(this).addClass(c) : a(this).removeClass(c)), a("input", this).prop("checked", d) }) }, updateSelectAll: function (b) { if (this.hasSelectAll()) { var c = a("li:not(.multiselect-item):not(.multiselect-filter-hidden):not(.multiselect-group):not(.disabled) input:enabled", this.$ul), d = c.length, e = c.filter(":checked").length, f = a("li.multiselect-all", this.$ul), g = f.find("input"); e > 0 && e === d ? (g.prop("checked", !0), f.addClass(this.options.selectedClass)) : (g.prop("checked", !1), f.removeClass(this.options.selectedClass)) } }, updateButtonText: function () { var b = this.getSelected(); this.options.enableHTML ? a(".multiselect .multiselect-selected-text", this.$container).html(this.options.buttonText(b, this.$select)) : a(".multiselect .multiselect-selected-text", this.$container).text(this.options.buttonText(b, this.$select)), a(".multiselect", this.$container).attr("title", this.options.buttonTitle(b, this.$select)) }, getSelected: function () { return a("option", this.$select).filter(":selected") }, getOptionByValue: function (b) { for (var c = a("option", this.$select), d = b.toString(), e = 0; e < c.length; e += 1) { var f = c[e]; if (f.value === d) return a(f) } }, getInputByValue: function (b) { for (var c = a("li input:not(.multiselect-search)", this.$ul), d = b.toString(), e = 0; e < c.length; e += 1) { var f = c[e]; if (f.value === d) return a(f) } }, updateOriginalOptions: function () { this.originalOptions = this.$select.clone()[0].options }, asyncFunction: function (a, b, c) { var d = Array.prototype.slice.call(arguments, 3); return setTimeout(function () { a.apply(c || window, d) }, b) }, setAllSelectedText: function (a) { this.options.allSelectedText = a, this.updateButtonText() } }, a.fn.multiselect = function (b, d, e) { return this.each(function () { var f = a(this).data("multiselect"), g = "object" == typeof b && b; f || (f = new c(this, g), a(this).data("multiselect", f)), "string" == typeof b && (f[b](d, e), "destroy" === b && a(this).data("multiselect", !1)) }) }, a.fn.multiselect.Constructor = c, a(function () { a("select[data-role=multiselect]").multiselect() }) }(window.jQuery);