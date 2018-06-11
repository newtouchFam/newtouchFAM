Ext.ux.TreeCheckNodeUI = function()
{
	this.checkModel = "multiple";
	this.onlyLeafCheckable = false;
	Ext.ux.TreeCheckNodeUI.superclass.constructor.apply(this, arguments)
};
Ext.extend(Ext.ux.TreeCheckNodeUI, Ext.tree.TreeNodeUI, {
	renderElements: function(D, I, H, J)
	{
		var K = D.getOwnerTree();
		this.checkModel = K.checkModel || this.checkModel;
		this.onlyLeafCheckable = K.onlyLeafCheckable || false;
		this.indentMarkup = D.parentNode
				? D.parentNode.ui.getChildIndent()
				: "";
		var E = (!this.onlyLeafCheckable || I.leaf);
		var B = I.href ? I.href : Ext.isGecko ? "" : "#";
		var C = [
				'<li class="x-tree-node"><div ext:tree-node-id="',
				D.id,
				'" class="x-tree-node-el x-tree-node-leaf x-unselectable ',
				I.cls,
				'" unselectable="on">',
				'<span class="x-tree-node-indent">',
				this.indentMarkup,
				"</span>",
				'<img src="',
				this.emptyIcon,
				'" class="x-tree-ec-icon x-tree-elbow" />',
				'<img src="',
				I.icon || this.emptyIcon,
				'" class="x-tree-node-icon',
				(I.icon ? " x-tree-node-inline-icon" : ""),
				(I.iconCls ? " " + I.iconCls : ""),
				'" unselectable="on" />',
				E
						? ('<input class="x-tree-node-cb" type="checkbox" ' + (I.checked
								? 'checked="checked" />'
								: "/>"))
						: "",
				'<a hidefocus="on" class="x-tree-node-anchor" href="', B,
				'" tabIndex="1" ',
				I.hrefTarget ? ' target="' + I.hrefTarget + '"' : "",
				'><span unselectable="on">', D.text, "</span></a></div>",
				'<ul class="x-tree-node-ct" style="display:none;"></ul>',
				"</li>"].join("");
		var A;
		if (J !== true && D.nextSibling && (A = D.nextSibling.ui.getEl()))
		{
			this.wrap = Ext.DomHelper.insertHtml("beforeBegin", A, C)
		}
		else
		{
			this.wrap = Ext.DomHelper.insertHtml("beforeEnd", H, C)
		}
		this.elNode = this.wrap.childNodes[0];
		this.ctNode = this.wrap.childNodes[1];
		var G = this.elNode.childNodes;
		this.indentNode = G[0];
		this.ecNode = G[1];
		this.iconNode = G[2];
		var F = 3;
		if (E)
		{
			this.checkbox = G[3];
			Ext.fly(this.checkbox).on("click",
					this.check.createDelegate(this, [null]));
			F++
		}
		this.anchor = G[F];
		this.textNode = G[F].firstChild
	},
	check: function(F)
	{
		var G = this.node;
		var C;
		C = G.getOwnerTree();
		this.checkModel = C.checkModel || this.checkModel;
		if (!G.disabled||!G.leaf)
		{
			if (F === null)
			{
				F = this.checkbox.checked
			}
			else
			{
				this.checkbox.checked = F
			}
			G.attributes.checked = F;
			C.fireEvent("check", G, F);
		}
		else
		{
			if (F === null)
			{
				if (!Ext.isEmpty(G.parentNode))
				{
					F = G.parentNode.attributes.checked;
				}
				else
				{
					F = false;
				}
			}
			this.checkbox.checked = false;
			G.attributes.checked = false;
			if (!G.expanded && !G.childrenRendered)
			{
				C.expand(false, false, this.childCheck);
			}
			else
			{
				this.childCheck(G, false);
			}
		}
		if (this.checkModel == "single")
		{
			var B = C.getChecked();
			for (var D = 0; D < B.length; D++)
			{
				var E = B[D];
				if (E.id != G.id)
				{
					E.getUI().checkbox.checked = false;
					E.attributes.checked = false;
					if(!C.disabled){
					C.fireEvent("check", E, false)
					}
				}
			}
		}
		else
		{
			if (!this.onlyLeafCheckable)
			{
				if (this.checkModel == "cascade"
						|| this.checkModel == "parentCascade")
				{
					var A = G.parentNode;
					if (A !== null)
					{
						this.parentCheck(A, F)
					}
				}
				if (this.checkModel == "cascade"
						|| this.checkModel == "childCascade")
				{
					if (!G.expanded && !G.childrenRendered)
					{

						G.expand(false, false, this.childCheck);
					}
					else
					{
						this.childCheck(G, false);
					}
				}
			}
		}
	},
	checkDisable: function(G)
	{
		C = G.getOwnerTree();
		if (G.disabled)
		{
			G.getUI().checkbox.checked = false;
			G.attributes.checked = false;
		}
		this.childCheckDisable(G);
	},
	childCheckDisable: function(D)
	{
		var A = D.attributes;
		if (!A.leaf)
		{
			var C = D.childNodes;
			var E;
			for (var B = 0; B < C.length; B++)
			{
				checkDisable(B);
			}
		}
	},
	childExpand: function(D)
	{

		var A = D.attributes;
		if (!A.leaf)
		{
			var C = D.childNodes;
			var E;
			for (var B = 0; B < C.length; B++)
			{
				E = C[B].getUI();

				E.check(A.checked);
			}
		}
	},
	childCheck: function(D)
	{
		var flag = D.disabled;
		var A = D.attributes;
		var F  = A.checked;
		if (F === null)
			{
				F = this.checkbox.checked
			}
		if (!A.leaf)
		{
			var C = D.childNodes;
			var E;
			for (var B = 0; B < C.length; B++)
			{	if(!C[B].disabled||!C[B].leaf){
					E = C[B].getUI();
					if (E.checkbox.checked ^ F)
					{
						E.check(A.checked);
					}
				}
				else{
					C[B].enable();
					var state = C[B].parentNode.attributes.checked;
					E = C[B].getUI();
					E.check(state);
					C[B].getOwnerTree().fireEvent("check", C[B], state);
					C[B].getUI().checkbox.checked = false;
					C[B].attributes.checked = false;
					C[B].disable();
				}
			}
		}
	},
	parentCheck: function(C, B)
	{
		var D = C.getUI().checkbox;
		if (typeof D == "undefined")
		{
			return
		}
		if (!(B ^ D.checked))
		{
			return
		}
		if (!B && this.childHasChecked(C))
		{
			return
		}
		D.checked = B;
		C.attributes.checked = B;
		C.getOwnerTree().fireEvent("check", C, B);
		var A = C.parentNode;
		if (A !== null)
		{
			this.parentCheck(A, B)
		}
	},
	childHasChecked: function(B)
	{
		var C = B.childNodes;
		if (C || C.length > 0)
		{
			for (var A = 0; A < C.length; A++)
			{
				if (C[A].getUI().checkbox.checked)
				{
					return true
				}
			}
		}
		return false
	},
	toggleCheck: function(C)
	{
		var A = this.checkbox;
		if (A)
		{
			var B = (C === undefined ? !A.checked : C);
			this.check(B)
		}
	}
});