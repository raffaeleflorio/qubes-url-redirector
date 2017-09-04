const url = (new URL(document.location.href)).searchParams.get("url");


function redirect(e)
{
    const form = e.target;

    const vmname = form["vmname"].value;

    if (vmname == null || vmname == "")
	alert("VM name cannot be empty!");
    
    browser.extension.getBackgroundPage().openurl(vmname, url);
    e.preventDefault();
    window.close();
}

document.getElementById("urlForm").addEventListener("submit", redirect);
document.getElementById("url").textContent = "URL: " + url;
