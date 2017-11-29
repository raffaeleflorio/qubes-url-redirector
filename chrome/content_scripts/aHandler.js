/* TODO:
 * FASTER check whitelisted URL
 */

(() => {
    const aHandler = (node) => {
	const config = {subtree: false, childList: false, attributes: true};

	const setTarget = (node) => {
	    if (node.href.indexOf(window.location.href) !== 0)
		node.target = "_blank";

	    node.target = "_blank";

	    /* disabled for performance reason */
	    // browser.runtime.sendMessage({msg: "isWhitelisted", url: node.href})
	    // 	.then((response) => {
	    // 	    if (response.result === false)
	    // 		node.target = "_blank";
	    // 	})
	    // 	.catch (() => node.target = "_blank");
	};

	const mutHandler = (mutations, observer) => {
	    const a = mutations[0].target;
	    observer.disconnect();
	    setTarget(a);
	    observer.observe(a, config);
	};

	setTarget(node);
	(new MutationObserver(mutHandler)).observe(node, config);
    };

    const anchors = Array.from(document.getElementsByTagName("a"));
    anchors.forEach((a) => aHandler(a));

    const documentObserver = new MutationObserver((mutations) => {
	mutations.forEach((m) => {
	    const nodes = Array.from(m.addedNodes);
	    nodes.forEach((n) => {
		if (n.nodeName === "A")
		    aHandler(n);
	    });
	});
    });
})();
