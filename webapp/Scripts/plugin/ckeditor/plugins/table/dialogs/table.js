﻿/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ckeditor.com/license
*/
(function () {
  function r(a) {
    for (var e = 0, l = 0, k = 0, m, g = a.$.rows.length; k < g; k++) {
      m = a.$.rows[k];
      for (var d = (e = 0), c, b = m.cells.length; d < b; d++)
        (c = m.cells[d]), (e += c.colSpan);
      e > l && (l = e);
    }
    return l;
  }
  function o(a) {
    return function () {
      var e = this.getValue(),
        e = !!(CKEDITOR.dialog.validate.integer()(e) && 0 < e);
      e || (alert(a), this.select());
      return e;
    };
  }
  function n(a, e) {
    var l = function (g) {
        return new CKEDITOR.dom.element(g, a.document);
      },
      n = a.editable(),
      m = a.plugins.dialogadvtab;
    return {
      title: a.lang.table.title,
      minWidth: 310,
      minHeight: CKEDITOR.env.ie ? 310 : 280,
      onLoad: function () {
        var g = this,
          a = g.getContentElement("advanced", "advStyles");
        if (a)
          a.on("change", function () {
            var a = this.getStyle("width", ""),
              b = g.getContentElement("info", "txtWidth");
            b && b.setValue(a, !0);
            a = this.getStyle("height", "");
            (b = g.getContentElement("info", "txtHeight")) && b.setValue(a, !0);
          });
      },
      onShow: function () {
        var g = a.getSelection(),
          d = g.getRanges(),
          c,
          b = this.getContentElement("info", "txtRows"),
          h = this.getContentElement("info", "txtCols"),
          p = this.getContentElement("info", "txtWidth"),
          f = this.getContentElement("info", "txtHeight");
        "tableProperties" == e &&
          ((g = g.getSelectedElement()) && g.is("table")
            ? (c = g)
            : 0 < d.length &&
              (CKEDITOR.env.webkit && d[0].shrink(CKEDITOR.NODE_ELEMENT),
              (c = a
                .elementPath(d[0].getCommonAncestor(!0))
                .contains("table", 1))),
          (this._.selectedElement = c));
        c
          ? (this.setupContent(c), b && b.disable(), h && h.disable())
          : (b && b.enable(), h && h.enable());
        p && p.onChange();
        f && f.onChange();
      },
      onOk: function () {
        var g = a.getSelection(),
          d = this._.selectedElement && g.createBookmarks(),
          c = this._.selectedElement || l("table"),
          b = {};
        this.commitContent(b, c);
        if (b.info) {
          b = b.info;
          if (!this._.selectedElement)
            for (
              var h = c.append(l("tbody")),
                e = parseInt(b.txtRows, 10) || 0,
                f = parseInt(b.txtCols, 10) || 0,
                i = 0;
              i < e;
              i++
            )
              for (var j = h.append(l("tr")), k = 0; k < f; k++) {
                var m = j.append(l("td"));
                CKEDITOR.env.ie || m.append(l("br"));
              }
          e = b.selHeaders;
          if (!c.$.tHead && ("row" == e || "both" == e)) {
            j = new CKEDITOR.dom.element(c.$.createTHead());
            h = c.getElementsByTag("tbody").getItem(0);
            h = h.getElementsByTag("tr").getItem(0);
            for (i = 0; i < h.getChildCount(); i++)
              (f = h.getChild(i)),
                f.type == CKEDITOR.NODE_ELEMENT &&
                  !f.data("cke-bookmark") &&
                  (f.renameNode("th"), f.setAttribute("scope", "col"));
            j.append(h.remove());
          }
          if (null !== c.$.tHead && !("row" == e || "both" == e)) {
            j = new CKEDITOR.dom.element(c.$.tHead);
            h = c.getElementsByTag("tbody").getItem(0);
            for (k = h.getFirst(); 0 < j.getChildCount(); ) {
              h = j.getFirst();
              for (i = 0; i < h.getChildCount(); i++)
                (f = h.getChild(i)),
                  f.type == CKEDITOR.NODE_ELEMENT &&
                    (f.renameNode("td"), f.removeAttribute("scope"));
              h.insertBefore(k);
            }
            j.remove();
          }
          if (!this.hasColumnHeaders && ("col" == e || "both" == e))
            for (j = 0; j < c.$.rows.length; j++)
              (f = new CKEDITOR.dom.element(c.$.rows[j].cells[0])),
                f.renameNode("th"),
                f.setAttribute("scope", "row");
          if (this.hasColumnHeaders && !("col" == e || "both" == e))
            for (i = 0; i < c.$.rows.length; i++)
              (j = new CKEDITOR.dom.element(c.$.rows[i])),
                "tbody" == j.getParent().getName() &&
                  ((f = new CKEDITOR.dom.element(j.$.cells[0])),
                  f.renameNode("td"),
                  f.removeAttribute("scope"));
          b.txtHeight
            ? c.setStyle("height", b.txtHeight)
            : c.removeStyle("height");
          b.txtWidth ? c.setStyle("width", b.txtWidth) : c.removeStyle("width");
          c.getAttribute("style") || c.removeAttribute("style");
        }
        if (this._.selectedElement)
          try {
            g.selectBookmarks(d);
          } catch (n) {}
        else
          a.insertElement(c),
            setTimeout(function () {
              var g = new CKEDITOR.dom.element(c.$.rows[0].cells[0]),
                b = a.createRange();
              b.moveToPosition(g, CKEDITOR.POSITION_AFTER_START);
              b.select();
            }, 0);
      },
      contents: [
        {
          id: "info",
          label: a.lang.table.title,
          elements: [
            {
              type: "hbox",
              widths: [null, null],
              styles: ["vertical-align:top"],
              children: [
                {
                  type: "vbox",
                  padding: 0,
                  children: [
                    {
                      type: "text",
                      id: "txtRows",
                      default: 3,
                      label: a.lang.table.rows,
                      required: !0,
                      controlStyle: "width:5em",
                      validate: o(a.lang.table.invalidRows),
                      setup: function (a) {
                        this.setValue(a.$.rows.length);
                      },
                      commit: k,
                    },
                    {
                      type: "text",
                      id: "txtCols",
                      default: 2,
                      label: a.lang.table.columns,
                      required: !0,
                      controlStyle: "width:5em",
                      validate: o(a.lang.table.invalidCols),
                      setup: function (a) {
                        this.setValue(r(a));
                      },
                      commit: k,
                    },
                    { type: "html", html: "&nbsp;" },
                    {
                      type: "select",
                      id: "selHeaders",
                      requiredContent: "th",
                      default: "",
                      label: a.lang.table.headers,
                      items: [
                        [a.lang.table.headersNone, ""],
                        [a.lang.table.headersRow, "row"],
                        [a.lang.table.headersColumn, "col"],
                        [a.lang.table.headersBoth, "both"],
                      ],
                      setup: function (a) {
                        var d = this.getDialog();
                        d.hasColumnHeaders = !0;
                        for (var c = 0; c < a.$.rows.length; c++) {
                          var b = a.$.rows[c].cells[0];
                          if (b && "th" != b.nodeName.toLowerCase()) {
                            d.hasColumnHeaders = !1;
                            break;
                          }
                        }
                        null !== a.$.tHead
                          ? this.setValue(d.hasColumnHeaders ? "both" : "row")
                          : this.setValue(d.hasColumnHeaders ? "col" : "");
                      },
                      commit: k,
                    },
                    {
                      type: "text",
                      id: "txtBorder",
                      requiredContent: "table[border]",
                      default: a.filter.check("table[border]") ? 1 : 0,
                      label: a.lang.table.border,
                      controlStyle: "width:3em",
                      validate: CKEDITOR.dialog.validate.number(
                        a.lang.table.invalidBorder
                      ),
                      setup: function (a) {
                        this.setValue(a.getAttribute("border") || "");
                      },
                      commit: function (a, d) {
                        this.getValue()
                          ? d.setAttribute("border", this.getValue())
                          : d.removeAttribute("border");
                      },
                    },
                    {
                      id: "cmbAlign",
                      type: "select",
                      requiredContent: "table[align]",
                      default: "",
                      label: a.lang.common.align,
                      items: [
                        [a.lang.common.notSet, ""],
                        [a.lang.common.alignLeft, "left"],
                        [a.lang.common.alignCenter, "center"],
                        [a.lang.common.alignRight, "right"],
                      ],
                      setup: function (a) {
                        this.setValue(a.getAttribute("align") || "");
                      },
                      commit: function (a, d) {
                        this.getValue()
                          ? d.setAttribute("align", this.getValue())
                          : d.removeAttribute("align");
                      },
                    },
                  ],
                },
                {
                  type: "vbox",
                  padding: 0,
                  children: [
                    {
                      type: "hbox",
                      widths: ["5em"],
                      children: [
                        {
                          type: "text",
                          id: "txtWidth",
                          requiredContent: "table{width}",
                          controlStyle: "width:5em",
                          label: a.lang.common.width,
                          title: a.lang.common.cssLengthTooltip,
                          default: a.filter.check("table{width}")
                            ? 500 > n.getSize("width")
                              ? "100%"
                              : 500
                            : 0,
                          getValue: q,
                          validate: CKEDITOR.dialog.validate.cssLength(
                            a.lang.common.invalidCssLength.replace(
                              "%1",
                              a.lang.common.width
                            )
                          ),
                          onChange: function () {
                            var a = this.getDialog().getContentElement(
                              "advanced",
                              "advStyles"
                            );
                            a && a.updateStyle("width", this.getValue());
                          },
                          setup: function (a) {
                            this.setValue(a.getStyle("width"));
                          },
                          commit: k,
                        },
                      ],
                    },
                    {
                      type: "hbox",
                      widths: ["5em"],
                      children: [
                        {
                          type: "text",
                          id: "txtHeight",
                          requiredContent: "table{height}",
                          controlStyle: "width:5em",
                          label: a.lang.common.height,
                          title: a.lang.common.cssLengthTooltip,
                          default: "",
                          getValue: q,
                          validate: CKEDITOR.dialog.validate.cssLength(
                            a.lang.common.invalidCssLength.replace(
                              "%1",
                              a.lang.common.height
                            )
                          ),
                          onChange: function () {
                            var a = this.getDialog().getContentElement(
                              "advanced",
                              "advStyles"
                            );
                            a && a.updateStyle("height", this.getValue());
                          },
                          setup: function (a) {
                            (a = a.getStyle("height")) && this.setValue(a);
                          },
                          commit: k,
                        },
                      ],
                    },
                    { type: "html", html: "&nbsp;" },
                    {
                      type: "text",
                      id: "txtCellSpace",
                      requiredContent: "table[cellspacing]",
                      controlStyle: "width:3em",
                      label: a.lang.table.cellSpace,
                      default: a.filter.check("table[cellspacing]") ? 1 : 0,
                      validate: CKEDITOR.dialog.validate.number(
                        a.lang.table.invalidCellSpacing
                      ),
                      setup: function (a) {
                        this.setValue(a.getAttribute("cellSpacing") || "");
                      },
                      commit: function (a, d) {
                        this.getValue()
                          ? d.setAttribute("cellSpacing", this.getValue())
                          : d.removeAttribute("cellSpacing");
                      },
                    },
                    {
                      type: "text",
                      id: "txtCellPad",
                      requiredContent: "table[cellpadding]",
                      controlStyle: "width:3em",
                      label: a.lang.table.cellPad,
                      default: a.filter.check("table[cellpadding]") ? 1 : 0,
                      validate: CKEDITOR.dialog.validate.number(
                        a.lang.table.invalidCellPadding
                      ),
                      setup: function (a) {
                        this.setValue(a.getAttribute("cellPadding") || "");
                      },
                      commit: function (a, d) {
                        this.getValue()
                          ? d.setAttribute("cellPadding", this.getValue())
                          : d.removeAttribute("cellPadding");
                      },
                    },
                  ],
                },
              ],
            },
            { type: "html", align: "right", html: "" },
            {
              type: "vbox",
              padding: 0,
              children: [
                {
                  type: "text",
                  id: "txtCaption",
                  requiredContent: "caption",
                  label: a.lang.table.caption,
                  setup: function (a) {
                    this.enable();
                    a = a.getElementsByTag("caption");
                    if (0 < a.count()) {
                      var a = a.getItem(0),
                        d = a.getFirst(
                          CKEDITOR.dom.walker.nodeType(CKEDITOR.NODE_ELEMENT)
                        );
                      d && !d.equals(a.getBogus())
                        ? (this.disable(), this.setValue(a.getText()))
                        : ((a = CKEDITOR.tools.trim(a.getText())),
                          this.setValue(a));
                    }
                  },
                  commit: function (e, d) {
                    if (this.isEnabled()) {
                      var c = this.getValue(),
                        b = d.getElementsByTag("caption");
                      if (c)
                        0 < b.count()
                          ? ((b = b.getItem(0)), b.setHtml(""))
                          : ((b = new CKEDITOR.dom.element(
                              "caption",
                              a.document
                            )),
                            d.getChildCount()
                              ? b.insertBefore(d.getFirst())
                              : b.appendTo(d)),
                          b.append(new CKEDITOR.dom.text(c, a.document));
                      else if (0 < b.count())
                        for (c = b.count() - 1; 0 <= c; c--)
                          b.getItem(c).remove();
                    }
                  },
                },
                {
                  type: "text",
                  id: "txtSummary",
                  requiredContent: "table[summary]",
                  label: a.lang.table.summary,
                  setup: function (a) {
                    this.setValue(a.getAttribute("summary") || "");
                  },
                  commit: function (a, d) {
                    this.getValue()
                      ? d.setAttribute("summary", this.getValue())
                      : d.removeAttribute("summary");
                  },
                },
              ],
            },
          ],
        },
        m && m.createAdvancedTab(a, null, "table"),
      ],
    };
  }
  var q = CKEDITOR.tools.cssLength,
    k = function (a) {
      var e = this.id;
      a.info || (a.info = {});
      a.info[e] = this.getValue();
    };
  CKEDITOR.dialog.add("table", function (a) {
    return n(a, "table");
  });
  CKEDITOR.dialog.add("tableProperties", function (a) {
    return n(a, "tableProperties");
  });
})();
