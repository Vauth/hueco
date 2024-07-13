"use strict";

/**
 * https://github.com/vauth/hueco
 */
document.addEventListener('contextmenu', event => event.preventDefault());
document.cookie = "message=We are watching you.";

document.addEventListener('keydown', function(event) {
    const urlParams = new URLSearchParams(window.location.search);
    let modeList = ["cat", "uwu", "pro", "lux"]; // Upload mp3 to ../audio and add audio name to list
    if ((event.key || event.key == 'Enter') && urlParams.has('mode') && (modeList.includes(urlParams.get('mode')))) {
        var audio = new Audio('../audio/' + urlParams.get('mode') + '.mp3');
        audio.play();
    }
});

var ParamHandler = (function () {
    const urlParams = new URLSearchParams(window.location.search);
    if(urlParams.has('q')) {
        let isq = urlParams.get('q');
        if (isq == "me"){location.replace('https://feelded.t.me')}
        if (isq == "help"){alert('Type "help" to get list of commands.')}
    }
    if(urlParams.has('alert')) {
        let alertmsg = urlParams.get('alert');
        alert(alertmsg)
    }
})();

var configs = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
        general_help: "",
        ls_help: "List information about the files and folders (the current directory by default).",
        cat_help: "Read FILE(s) content and print it to the standard output (screen).",
        whoami_help: "Print the user name associated with the current effective user ID and more info.",
        date_help: "Print the system date and time.",
        help_help: "Print this menu.",
        clear_help: "Clear the terminal screen.",
        reboot_help: "Reboot the system.",
        cd_help: "Change the current working directory.",
        mv_help: "Move (rename) files.",
        rm_help: "Remove files or directories.",
        rmdir_help: "Remove directory, this command will only work if the folders are empty.",
        touch_help: "Change file timestamps. If the file doesn't exist, it's created an empty one.",
        sudo_help: "Execute a command as the superuser.",
        welcome:"",
        internet_explorer_warning: "NOTE: I see you're using internet explorer, this website won't work properly.",
        welcome_file_name: "welcome_message.txt",
        invalid_command_message: "<value>: command not found.",
        reboot_message: "Preparing to reboot...\nRebooting...\n",
        permission_denied_message: "Unable to '<value>', permission denied.",
        sudo_message: "Unable to sudo using a web client.",
        usage: "Usage",
        file: "file",
        file_not_found: "File '<value>' not found.",
        username: "Username",
        hostname: "Host",
        platform: "Platform",
        accesible_cores: "Accessible cores",
        language: "Language",
        value_token: "<value>",
        host: window.location.hostname, // "hueco.link" => Replace this with your host
        user: "root",
        is_root: true,
        type_delay: 2
    };
    return {
        getInstance: function (options) {
            instance === void 0 && (instance = new Singleton(options));
            return instance;
        }
    };
})();

/**
 * Your files here
 */
var files = (function () {
    var instance;
    var Singleton = function (options) {
        var options = options || Singleton.defaultOptions;
        for (var key in Singleton.defaultOptions) {
            this[key] = options[key] || Singleton.defaultOptions[key];
        }
    };
    Singleton.defaultOptions = {
    	"welcome.txt":"Get out.",
    	"config.py":"class Production(Config): LOGGER = True",
    	".cache":"None",
	"pypi.whl":"https://pypi.org/user/ivuxy",
	"ascii.txt":"░░░░░░░░░░░░░░░░░░░░░\n░░██████░░██████░░██░\n░██░░░░██░██░░░██░██░\n░██░░░░██░██░░░██░██░\n░██░░░░██░██░░░██░██░\n░░██████░░██████░░██░\n░░░░░░░░░░░░░░░░░░░░░",
        "README.md": "PyGeek, GUI, Web development, Automation, ML, Data integration, BB & etc.",
        "mail.txt": "ivuxey@gmail.com",
        "telegram.txt": "https://feelded.t.me",
	"music.txt": "https://t.me/+OpbNeduAS0cwMmY8",
        "github.txt":"https://github.com/vauth",
	"cloud.txt":"https://index.ivuxy.workers.dev",
    };
    return {
        getInstance: function (options) {
            instance === void 0 && (instance = new Singleton(options));
            return instance;
        }
    };
})();

var main = (function () {

    /**
     * Aux functions
     */
    var isUsingIE = window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);

    var ignoreEvent = function (event) {
        event.preventDefault();
        event.stopPropagation();
    };
    
    var scrollToBottom = function () {
        window.scrollTo(0, document.body.scrollHeight);
    };
    
    var isURL = function (str) {
        return (str.startsWith("http") || str.startsWith("www")) && str.indexOf(" ") === -1 && str.indexOf("\n") === -1;
    };
    
    /**
     * Model
     */
    var InvalidArgumentException = function (message) {
        this.message = message;
        // Use V8's native method if available, otherwise fallback
        if ("captureStackTrace" in Error) {
            Error.captureStackTrace(this, InvalidArgumentException);
        } else {
            this.stack = (new Error()).stack;
        }
    };
    // Extends Error
    InvalidArgumentException.prototype = Object.create(Error.prototype);
    InvalidArgumentException.prototype.name = "InvalidArgumentException";
    InvalidArgumentException.prototype.constructor = InvalidArgumentException;

    var cmds = {
        LS: { value: "ls", help: configs.getInstance().ls_help },
        CAT: { value: "cat", help: configs.getInstance().cat_help },
        WHOAMI: { value: "whoami", help: configs.getInstance().whoami_help },
        IP: { value:"ip", help:"Get current ip address."},
		FCIP: { value:"fcip", help:"Fresh cloudflare IP generator ABAN."},
		SOMNIUM: { value:"somnium", help:"Create beautiful artwork using the power of AI."},
		V2RAY: { value:"v2ray", help:"Get alive v2ray configs (VM, VL, TR, SS)."},
        HOSTNAME: { value:"hostname", help:"This command can get or set the host name or the NIS domain name."},
		SLYP: { value:"slyp", help:"Make spotify lyrics poster."},
		MATRIX: { value:"matrix", help:"This command runs matrix rain animation."},
		DORK: { value:"dork", help:"This command leads you to dorks cheatsheet JSON."},
		VPN: { value:"vpn", help:"Download latest version of Vox VPN (Desktop)."},
		DNS: { value:"dns", help:" Lookup DNS records for a hostname, domain name, or IP address on the public Internet."},
		DOMIT: { value: "dom", help: "Take control of document/browser object model (DOM/BOM)."},
        DATE: { value: "date", help: configs.getInstance().date_help },
        HELP: { value: "help", help: configs.getInstance().help_help },
		ECHOIT: { value: "echo", help: "Output the strings that are passed to it as arguments."},
        CLEAR: { value: "clear", help: configs.getInstance().clear_help },
        REBOOT: { value: "reboot", help: configs.getInstance().reboot_help },
		UUID: { value: "uuid", help: "Generate version-4 UUIDs according to RFC 4122 instantly."},
        CD: { value: "cd", help: configs.getInstance().cd_help },
        MV: { value: "mv", help: configs.getInstance().mv_help },
        RM: { value: "rm", help: configs.getInstance().rm_help },
        RMDIR: { value: "rmdir", help: configs.getInstance().rmdir_help },
        TOUCH: { value: "touch", help: configs.getInstance().touch_help },
        SUDO: { value: "sudo", help: configs.getInstance().sudo_help }
    };

    var Terminal = function (prompt, cmdLine, output, sidenav, profilePic, user, host, root, outputTimer) {
        if (!(prompt instanceof Node) || prompt.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + prompt + " for argument 'prompt'.");
        }
        if (!(cmdLine instanceof Node) || cmdLine.nodeName.toUpperCase() !== "INPUT") {
            throw new InvalidArgumentException("Invalid value " + cmdLine + " for argument 'cmdLine'.");
        }
        if (!(output instanceof Node) || output.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        if (!(sidenav instanceof Node) || sidenav.nodeName.toUpperCase() !== "DIV") {
            throw new InvalidArgumentException("Invalid value " + sidenav + " for argument 'sidenav'.");
        }
        if (!(profilePic instanceof Node) || profilePic.nodeName.toUpperCase() !== "IMG") {
            throw new InvalidArgumentException("Invalid value " + profilePic + " for argument 'profilePic'.");
        }
        (typeof user === "string" && typeof host === "string") && (this.completePrompt = user + "@" + host + ":~" + (root ? "#" : "$"));
        this.profilePic = profilePic;
        this.prompt = prompt;
        this.cmdLine = cmdLine;
        this.output = output;
        this.sidenav = sidenav;
        this.sidenavOpen = false;
        this.sidenavElements = [];
        this.typeSimulator = new TypeSimulator(outputTimer, output);
    };

    Terminal.prototype.type = function (text, callback) {
        this.typeSimulator.type(text, callback);
    };

    Terminal.prototype.exec = function () {
        var command = this.cmdLine.value;
        this.cmdLine.value = "";
        this.prompt.textContent = "";
        this.output.innerHTML += "<span class=\"prompt-color\">" + this.completePrompt + "</span> " + command + "<br/>";
    };

    Terminal.prototype.init = function () {
        this.sidenav.addEventListener("click", ignoreEvent);
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
        this.prepareSideNav();
        this.lock(); // Need to lock here since the sidenav elements were just added
        document.body.addEventListener("click", function (event) {
            if (this.sidenavOpen) {
                this.handleSidenav(event);
            }
            this.focus();
        }.bind(this));
        this.cmdLine.addEventListener("keydown", function (event) {
            if (event.which === 13 || event.keyCode === 13) {
                this.handleCmd();
                ignoreEvent(event);
            } else if (event.which === 9 || event.keyCode === 9) {
                this.handleFill();
                ignoreEvent(event);
            }
        }.bind(this));
        this.reset();
    };

    Terminal.makeElementDisappear = function (element) {
        element.style.opacity = 0;
        element.style.transform = "translateX(-300px)";
    };

    Terminal.makeElementAppear = function (element) {
        element.style.opacity = 1;
        element.style.transform = "translateX(0)";
    };

    Terminal.prototype.prepareSideNav = function () {
        var capFirst = (function () {
            return function (string) {
                return string.charAt(0).toUpperCase() + string.slice(1);
            }
        })();
        for (var file in files.getInstance()) {
            var element = document.createElement("button");
            Terminal.makeElementDisappear(element);
            element.onclick = function (file, event) {
                this.handleSidenav(event);
                this.cmdLine.value = "cat " + file + " ";
                this.handleCmd();
            }.bind(this, file);
            element.appendChild(document.createTextNode(capFirst(file.replace(/\.[^/.]+$/, "").replace(/_/g, " "))));
            this.sidenav.appendChild(element);
            this.sidenavElements.push(element);
        }
        // Shouldn't use document.getElementById but Terminal is already using loads of params
        document.getElementById("sidenavBtn").addEventListener("click", this.handleSidenav.bind(this));
    };

    Terminal.prototype.handleSidenav = function (event) {
        if (this.sidenavOpen) {
            this.profilePic.style.opacity = 0;
            this.sidenavElements.forEach(Terminal.makeElementDisappear);
            this.sidenav.style.width = "50px";
            document.getElementById("sidenavBtn").innerHTML = "&#9776;";
            this.sidenavOpen = false;
        } else {
            this.sidenav.style.width = "300px";
            this.sidenavElements.forEach(Terminal.makeElementAppear);
            document.getElementById("sidenavBtn").innerHTML = "&times;";
            this.profilePic.style.opacity = 1;
            this.sidenavOpen = true;
        }
        document.getElementById("sidenavBtn").blur();
        ignoreEvent(event);
    };

    Terminal.prototype.lock = function () {
        this.exec();
        this.cmdLine.blur();
        this.cmdLine.disabled = true;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = true;
        });
    };

    Terminal.prototype.unlock = function () {
        this.cmdLine.disabled = false;
        this.prompt.textContent = this.completePrompt;
        this.sidenavElements.forEach(function (elem) {
            elem.disabled = false;
        });
        scrollToBottom();
        this.focus();
    };

    Terminal.prototype.handleFill = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
        if ((cmdComponents.length <= 1) || (cmdComponents.length === 2 && cmdComponents[0] === cmds.CAT.value)) {
            this.lock();
            var possibilities = [];
            if (cmdComponents[0].toLowerCase() === cmds.CAT.value) {
                if (cmdComponents.length === 1) {
                    cmdComponents[1] = "";
                }
                if (configs.getInstance().welcome_file_name.startsWith(cmdComponents[1].toLowerCase())) {
                    possibilities.push(cmds.CAT.value + " " + configs.getInstance().welcome_file_name);
                }
                for (var file in files.getInstance()) {
                    if (file.startsWith(cmdComponents[1].toLowerCase())) {
                        possibilities.push(cmds.CAT.value + " " + file);
                    }
                }
            } else {
                for (var command in cmds) {
                    if (cmds[command].value.startsWith(cmdComponents[0].toLowerCase())) {
                        possibilities.push(cmds[command].value);
                    }
                }
            }
            if (possibilities.length === 1) {
                this.cmdLine.value = possibilities[0] + " ";
                this.unlock();
            } else if (possibilities.length > 1) {
                this.type(possibilities.join("\n"), function () {
                    this.cmdLine.value = cmdComponents.join(" ");
                    this.unlock();
                }.bind(this));
            } else {
                this.cmdLine.value = cmdComponents.join(" ");
                this.unlock();
            }
        }
    };

    Terminal.prototype.handleCmd = function () {
        var cmdComponents = this.cmdLine.value.trim().split(" ");
        this.lock();
        switch (cmdComponents[0]) {
            case cmds.CAT.value:
                this.cat(cmdComponents);
                break;
	    	case cmds.ECHOIT.value:
                this.echoit(cmdComponents);
                break;
	    	case cmds.DOMIT.value:
                this.domit(cmdComponents);
                break;
	    	case cmds.DNS.value:
                this.dns(cmdComponents);
                break;
            case cmds.LS.value:
                this.ls();
                break;
	    	case cmds.UUID.value:
                this.uuid();
                break;
            case cmds.WHOAMI.value:
                this.whoami();
                break;
            case cmds.DATE.value:
                this.date();
                break;
            case cmds.HELP.value:
                this.help();
                break;
            case cmds.CLEAR.value:
                this.clear();
                break;
            case cmds.REBOOT.value:
                this.reboot();
                break;
            case cmds.IP.value:
                this.ip();
                break;
	    	case cmds.MATRIX.value:
                this.matrix();
                break;
	    	case cmds.SOMNIUM.value:
                this.somnium();
                break;
	    	case cmds.DORK.value:
                this.dorker();
                break;
	    	case cmds.FCIP.value:
                this.fcip();
                break;
	    	case cmds.V2RAY.value:
                this.v2ray();
                break;
	    	case cmds.SLYP.value:
                this.slyp();
                break;
	    	case cmds.VPN.value:
                this.vpner();
                break;
            case cmds.HOSTNAME.value:
                this.hostname();
                break;
            case cmds.CD.value:
            case cmds.MV.value:
            case cmds.RMDIR.value:
            case cmds.RM.value:
            case cmds.TOUCH.value:
                this.permissionDenied(cmdComponents);
                break;
            case cmds.SUDO.value:
                this.sudo();
                break;
            case "":
            	this.nothing();
            	break;
            default:
                this.invalidCommand(cmdComponents);
                break;
        };
    };

    Terminal.prototype.cat = function (cmdComponents) {
        var result;
        if (cmdComponents.length <= 1) {
            result = configs.getInstance().usage + ": " + cmds.CAT.value + " <" + configs.getInstance().file + ">";
        } else if (!cmdComponents[1] || (!cmdComponents[1] === configs.getInstance().welcome_file_name || !files.getInstance().hasOwnProperty(cmdComponents[1]))) {
            result = configs.getInstance().file_not_found.replace(configs.getInstance().value_token, cmdComponents[1]);
        } else {
            result = cmdComponents[1] === configs.getInstance().welcome_file_name ? configs.getInstance().welcome : files.getInstance()[cmdComponents[1]];
        }
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.echoit = function (cmdComponents) {
        if (cmdComponents.length <= 1) {
            this.type("Usage: echo <string>", this.unlock.bind(this));
        }
        else {
            this.type(cmdComponents.slice(1).join(' '), this.unlock.bind(this));
        }
    };

    Terminal.prototype.domit = function (cmdComponents) {
        if (cmdComponents.length <= 1) {
            this.type("Usage: dom <code>", this.unlock.bind(this));
        }
        else {
            try {var result = JSON.stringify(eval(cmdComponents.slice(1).join(' ')));} catch(error) {var result = error.toString()}
            if (result) {
                this.type(result, this.unlock.bind(this));
            }
            else {
                this.type("None", this.unlock.bind(this));
            }
        }
    };

    Terminal.prototype.dns = function (cmdComponents) {
        let that = this; 
        if (cmdComponents.length > 1) {
            $.getJSON("https://networkcalc.com/api/dns/lookup/"+cmdComponents.slice(1).join(' '), function(e) {
                that.type(JSON.stringify(e.records), that.unlock.bind(that));
            })
            .fail(function(error) {
                that.type(JSON.stringify(error.statusText), that.unlock.bind(that));
            });
        }
        else {
            this.type("Usage: dns <host>", this.unlock.bind(this));
        }
    };
	
    Terminal.prototype.ls = function () {
        var result = "";
        for (var file in files.getInstance()) {
            result += file + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.sudo = function () {
        this.type(configs.getInstance().sudo_message, this.unlock.bind(this));
    }
    
    Terminal.prototype.ip = function () {
        let that = this; 
        $.getJSON("https://api.ipify.org/?format=json", function(e) {
            that.type(e.ip, that.unlock.bind(that));
        })
        .fail(function(error) {
            that.type(error.toString(), that.unlock.bind(that));
        });
    };
    
    Terminal.prototype.hostname = function () {
        this.type(configs.getInstance().host, this.unlock.bind(this));
    };
            
    Terminal.prototype.whoami = function (cmdComponents) {
        var result = configs.getInstance().username + ": " + configs.getInstance().user + "\n" + configs.getInstance().hostname + ": " + configs.getInstance().host + "\n" + configs.getInstance().platform + ": " + navigator.platform + "\n" + configs.getInstance().accesible_cores + ": " + navigator.hardwareConcurrency + "\n" + configs.getInstance().language + ": " + navigator.language;
        this.type(result, this.unlock.bind(this));
    };

    Terminal.prototype.date = function (cmdComponents) {
        this.type(new Date().toString(), this.unlock.bind(this));
    };

	Terminal.prototype.nothing = function (cmdComponents) {
        this.type("", this.unlock.bind(this));
    };

    Terminal.prototype.matrix = function (cmdComponents) {
	location.replace(`https://${configs.getInstance().host}/matrix`)
        this.type("Running...", this.unlock.bind(this));
    };

    Terminal.prototype.v2ray = function (cmdComponents) {
	location.replace(`https://${configs.getInstance().host}/v.txt`)
        this.type("Running...", this.unlock.bind(this));
    };
	
    Terminal.prototype.slyp = function (cmdComponents) {
	this.type("Running...", this.unlock.bind(this));
	window.open(`https://${configs.getInstance().host}/slyp`)
    };	
    
    Terminal.prototype.dorker = function (cmdComponents) {
	location.replace(`https://${configs.getInstance().host}/dork.json`)
        this.type("Running...", this.unlock.bind(this));
    };
	
    Terminal.prototype.fcip = function (cmdComponents) {
	location.replace(`https://${configs.getInstance().host}/fcip`)
        this.type("Running...", this.unlock.bind(this));
    };

    Terminal.prototype.somnium = function (cmdComponents) {
	location.replace('https://ivuxy-somnium.hf.space')
        this.type("Running...", this.unlock.bind(this));
    };
	
    Terminal.prototype.vpner = function (cmdComponents) {
	location.replace('https://github.com/Vauth/Vox/releases')
        this.type("Running...", this.unlock.bind(this));
    };

    Terminal.prototype.uuid = function (cmdComponents) {
        function generateUUID() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0,
                    v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
        this.type(generateUUID(), this.unlock.bind(this));
    };
	
    Terminal.prototype.help = function () {
        var result = configs.getInstance().general_help + "\n\n";
        for (var cmd in cmds) {
            result += cmds[cmd].value + " - " + cmds[cmd].help + "\n";
        }
        this.type(result.trim(), this.unlock.bind(this));
    };

    Terminal.prototype.clear = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        this.prompt.textContent = this.completePrompt;
        this.unlock();
    };

    Terminal.prototype.reboot = function () {
        this.type(configs.getInstance().reboot_message, this.reset.bind(this));
    };

    Terminal.prototype.reset = function () {
        this.output.textContent = "";
        this.prompt.textContent = "";
        this.unlock();
    };

    Terminal.prototype.permissionDenied = function (cmdComponents) {
        this.type(configs.getInstance().permission_denied_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.invalidCommand = function (cmdComponents) {
        this.type(configs.getInstance().invalid_command_message.replace(configs.getInstance().value_token, cmdComponents[0]), this.unlock.bind(this));
    };

    Terminal.prototype.focus = function () {
        this.cmdLine.focus();
    };

    var TypeSimulator = function (timer, output) {
        var timer = parseInt(timer);
        if (timer === Number.NaN || timer < 0) {
            throw new InvalidArgumentException("Invalid value " + timer + " for argument 'timer'.");
        }
        if (!(output instanceof Node)) {
            throw new InvalidArgumentException("Invalid value " + output + " for argument 'output'.");
        }
        this.timer = timer;
        this.output = output;
    };

    TypeSimulator.prototype.type = function (text, callback) {
        if (isURL(text)) {
            window.open(text);
        }
        var i = 0;
        var output = this.output;
        var timer = this.timer;
        var skipped = false;
        var skip = function () {
            skipped = true;
        }.bind(this);
        document.addEventListener("dblclick", skip);
        (function typer() {
            if (i < text.length) {
                var char = text.charAt(i);
                var isNewLine = char === "\n";
                output.innerHTML += isNewLine ? "<br/>" : char;
                i++;
                if (!skipped) {
                    setTimeout(typer, isNewLine ? timer * 2 : timer);
                } else {
                    output.innerHTML += (text.substring(i).replace(new RegExp("\n", 'g'), "<br/>")) + "<br/>";
                    document.removeEventListener("dblclick", skip);
                    callback();
                }
            } else if (callback) {
                output.innerHTML += "<br/>";
                document.removeEventListener("dblclick", skip);
                callback();
            }
            scrollToBottom();
        })();
    };

    return {
        listener: function () {
            new Terminal(
                document.getElementById("prompt"),
                document.getElementById("cmdline"),
                document.getElementById("output"),
                document.getElementById("sidenav"),
                document.getElementById("profilePic"),
                configs.getInstance().user,
                configs.getInstance().host,
                configs.getInstance().is_root,
                configs.getInstance().type_delay
            ).init();
        }
    };
})();

window.onload = main.listener;
