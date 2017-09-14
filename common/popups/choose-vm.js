const url = (new URL(document.location.href)).searchParams.get("url");


function redirect(e)
{
    const form = e.target;

    const vmname = form["vmname"].value;

    if (!vmname || vmname == "") {
	alert("VM name cannot be empty!");
    } else {
	browser.extension.getBackgroundPage().openurl(vmname, url);
	window.close();
    }

    e.preventDefault();
}

document.getElementById("urlForm").addEventListener("submit", redirect);
document.getElementById("url").textContent = "URL: " + url;
