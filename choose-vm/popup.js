function redirect(e)
{
    let form = e.target;

    let vmname = form["vmname"].value;

    if (vmname == null || vmname == "")
	alert("VM name cannot be empty!");
    
    browser.runtime.sendMessage({"vmname": vmname, "url": url});
    e.preventDefault();
    window.close();
}

document.getElementById("urlForm").addEventListener("submit", redirect);
let url = (new URL(document.location.href)).searchParams.get("url");
document.getElementById("url").textContent = "URL: " + url;
