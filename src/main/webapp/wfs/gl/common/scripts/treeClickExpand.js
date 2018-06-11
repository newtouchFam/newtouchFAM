
function onClickExpand(node){
	if(!node.isExpanded() && !node.isLeaf()){
		node.expand();
	} else if (node.isExpanded()){
		node.collapse();
	}
}