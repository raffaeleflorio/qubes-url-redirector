/*
 * Copyright (C) 2017 Raffaele Florio <raffaeleflorio@protonmail.com>
 *
 * This file is part of qubes-url-redirector.
 *
 * qubes-url-redirector is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * qubes-url-redirector is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with qubes-url-redirector.  If not, see <http://www.gnu.org/licenses/>.
*/

const url = (new URL(document.location.href)).searchParams.get("url");


function redirect(e)
{
    const form = e.target;

    const vmname = form["vmname"].value;

    if (!vmname) {
	alert("VM name cannot be empty!");
    } else {
	browser.extension.getBackgroundPage().getQur().native.openurl(vmname, url);
	window.close();
    }

    e.preventDefault();
}

document.getElementById("urlForm").addEventListener("submit", redirect);
document.getElementById("url").textContent = "URL: " + url;
