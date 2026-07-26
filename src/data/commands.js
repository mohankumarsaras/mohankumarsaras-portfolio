/**
 * commands.js
 * -----------
 * Full Ubuntu 20+ command emulator with virtual filesystem.
 * Supports: ls, cd, pwd, cat, mkdir, touch, rm, rmdir, cp, mv,
 *           whoami, hostname, uname, uptime, date, echo, head, tail,
 *           grep, wc, df, free, ps, top, id, env, export, alias,
 *           history, man, sudo, apt, neofetch, clear, help, exit, tree
 */

import { profile } from "./profile";
import { createFilesystem, resolvePath, normalizePath, displayPath } from "./filesystem";

const line = (text = "", variant = "default") => ({ text, variant });
const blank = () => line("");

// ---- Shared mutable state (singleton per session) ----
let fs = createFilesystem();
let cwd = "/home/guest";
const homeDir = "/home/guest";
const envVars = {
  HOME: homeDir,
  USER: "guest",
  HOSTNAME: "portfolio-server",
  SHELL: "/bin/bash",
  PATH: "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
  TERM: "xterm-256color",
  LANG: "en_US.UTF-8",
  PWD: cwd,
  EDITOR: "nano",
};
const aliases = { ll: "ls -la", la: "ls -A", l: "ls -CF" };
let commandHistoryList = [];

/** Reset state (e.g. on terminal remount) */
export function resetTerminalState() {
  fs = createFilesystem();
  cwd = homeDir;
  envVars.PWD = cwd;
  commandHistoryList = [];
}

/** Get current working directory for prompt display */
export function getCwd() {
  return displayPath(cwd, homeDir);
}

/** Set initial working directory directly */
export function setInitialCwd(pathStr) {
  const target = normalizePath(homeDir, pathStr, homeDir);
  const node = resolvePath(fs, target);
  if (node && node.type === "dir") {
    cwd = target;
    envVars.PWD = cwd;
  }
}

/** Get autocomplete suggestions */
export function getCompletions(input) {
  if (!input) return input;
  const parts = input.split(/\s+/);
  
  if (parts.length === 1) {
    const cmd = parts[0];
    const matches = Object.keys(commands).filter(c => c.startsWith(cmd));
    if (matches.length === 1) return matches[0] + " ";
    return input;
  }
  
  const lastPart = parts[parts.length - 1];
  const node = resolvePath(fs, cwd);
  if (!node || node.type !== "dir") return input;
  
  const matches = Object.keys(node.children).filter(c => c.startsWith(lastPart));
  if (matches.length === 1) {
    parts[parts.length - 1] = matches[0];
    const childNode = node.children[matches[0]];
    return parts.join(" ") + (childNode.type === "dir" ? "/" : "");
  }
  
  return input;
}

// ---- Command implementations ----

function cmdLs(args) {
  let showAll = false;
  let showLong = false;
  const paths = [];
  for (const a of args) {
    if (a === "-a" || a === "-A") showAll = true;
    else if (a === "-l") showLong = true;
    else if (a === "-la" || a === "-al" || a === "-lA") { showAll = true; showLong = true; }
    else paths.push(a);
  }
  const target = normalizePath(cwd, paths[0] || "", homeDir);
  const node = resolvePath(fs, target);
  if (!node) return [line(`ls: cannot access '${paths[0] || "."}': No such file or directory`, "error")];
  if (node.type === "file") return [line(paths[0])];

  let entries = Object.keys(node.children);
  if (showAll) entries = [".", "..", ...entries];
  else entries = entries.filter((e) => !e.startsWith("."));
  if (entries.length === 0) return [];

  if (showLong) {
    const out = [line(`total ${entries.length}`, "dim")];
    for (const name of entries) {
      if (name === "." || name === "..") {
        out.push(line(`drwxr-xr-x  2 guest guest 4096 Jun 22 12:00 ${name}`, "accent"));
        continue;
      }
      const child = node.children[name];
      if (child.type === "dir") {
        const count = Object.keys(child.children).length + 2;
        out.push(line(`drwxr-xr-x  ${count} guest guest 4096 Jun 22 12:00 ${name}`, "accent"));
      } else {
        const size = (child.content || "").length;
        out.push(line(`-rw-r--r--  1 guest guest ${String(size).padStart(4)} Jun 22 12:00 ${name}`));
      }
    }
    return out;
  }

  // Color directories
  const parts = entries.map((name) => {
    if (name === "." || name === "..") return { name, isDir: true };
    const child = node.children[name];
    return { name, isDir: child?.type === "dir" };
  });
  const formatted = parts.map((p) => p.isDir ? `${p.name}/` : p.name);
  return [line(formatted.join("  "))];
}

function cmdCd(args) {
  const target = normalizePath(cwd, args[0] || "", homeDir);
  const node = resolvePath(fs, target);
  if (!node) return [line(`bash: cd: ${args[0]}: No such file or directory`, "error")];
  if (node.type !== "dir") return [line(`bash: cd: ${args[0]}: Not a directory`, "error")];
  cwd = target;
  envVars.PWD = cwd;
  return [];
}

function cmdPwd() {
  return [line(cwd)];
}

function cmdCat(args) {
  if (args.length === 0) return [line("cat: missing file operand", "error")];
  const out = [];
  for (const file of args) {
    if (file === "resume.pdf" || file.endsWith("/resume.pdf")) {
      const a = document.createElement("a");
      a.href = "/resume.pdf";
      a.download = "resume.pdf";
      a.click();
      out.push(line(`Downloading ${file}...`, "dim"));
      continue;
    }
    const target = normalizePath(cwd, file, homeDir);
    const node = resolvePath(fs, target);
    if (!node) { out.push(line(`cat: ${file}: No such file or directory`, "error")); continue; }
    if (node.type === "dir") { out.push(line(`cat: ${file}: Is a directory`, "error")); continue; }
    (node.content || "").split("\n").forEach((l) => out.push(line(l)));
  }
  return out;
}

function cmdMkdir(args) {
  if (args.length === 0) return [line("mkdir: missing operand", "error")];
  const out = [];
  for (const dir of args) {
    const target = normalizePath(cwd, dir, homeDir);
    const parentPath = target.substring(0, target.lastIndexOf("/")) || "/";
    const dirName = target.split("/").pop();
    const parent = resolvePath(fs, parentPath);
    if (!parent || parent.type !== "dir") { out.push(line(`mkdir: cannot create directory '${dir}': No such file or directory`, "error")); continue; }
    if (parent.children[dirName]) { out.push(line(`mkdir: cannot create directory '${dir}': File exists`, "error")); continue; }
    parent.children[dirName] = { type: "dir", children: {} };
  }
  return out;
}

function cmdTouch(args) {
  if (args.length === 0) return [line("touch: missing file operand", "error")];
  for (const file of args) {
    const target = normalizePath(cwd, file, homeDir);
    const parentPath = target.substring(0, target.lastIndexOf("/")) || "/";
    const fileName = target.split("/").pop();
    const parent = resolvePath(fs, parentPath);
    if (!parent || parent.type !== "dir") continue;
    if (!parent.children[fileName]) {
      parent.children[fileName] = { type: "file", content: "" };
    }
  }
  return [];
}

function cmdRm(args) {
  const recursive = args.includes("-r") || args.includes("-rf") || args.includes("-R");
  const files = args.filter((a) => !a.startsWith("-"));
  if (files.length === 0) return [line("rm: missing operand", "error")];

  if (recursive && files.includes("/")) {
    return [
      line("rm: it is dangerous to operate recursively on '/'", "error"),
      line("rm: use --no-preserve-root to override this failsafe", "dim"),
      line("Nice try deleting my portfolio though! 🕵️‍♂️", "accent")
    ];
  }

  const out = [];
  for (const file of files) {
    const target = normalizePath(cwd, file, homeDir);
    const parentPath = target.substring(0, target.lastIndexOf("/")) || "/";
    const name = target.split("/").pop();
    const parent = resolvePath(fs, parentPath);
    if (!parent || !parent.children[name]) { out.push(line(`rm: cannot remove '${file}': No such file or directory`, "error")); continue; }
    if (parent.children[name].type === "dir" && !recursive) { out.push(line(`rm: cannot remove '${file}': Is a directory`, "error")); continue; }
    delete parent.children[name];
  }
  return out;
}

function cmdRmdir(args) {
  if (args.length === 0) return [line("rmdir: missing operand", "error")];
  const out = [];
  for (const dir of args) {
    const target = normalizePath(cwd, dir, homeDir);
    const parentPath = target.substring(0, target.lastIndexOf("/")) || "/";
    const name = target.split("/").pop();
    const parent = resolvePath(fs, parentPath);
    if (!parent || !parent.children[name]) { out.push(line(`rmdir: failed to remove '${dir}': No such file or directory`, "error")); continue; }
    if (parent.children[name].type !== "dir") { out.push(line(`rmdir: failed to remove '${dir}': Not a directory`, "error")); continue; }
    if (Object.keys(parent.children[name].children).length > 0) { out.push(line(`rmdir: failed to remove '${dir}': Directory not empty`, "error")); continue; }
    delete parent.children[name];
  }
  return out;
}

function cmdEcho(args) {
  const text = args.join(" ");
  // Handle env var expansion
  const expanded = text.replace(/\$(\w+)/g, (_, v) => envVars[v] || "");
  return [line(expanded)];
}

function cmdWhoami() { return [line("guest")]; }
function cmdHostname() { return [line("portfolio-server")]; }
function cmdId() { return [line("uid=1001(guest) gid=1001(guest) groups=1001(guest),27(sudo)")]; }

function cmdUname(args) {
  const flag = args[0] || "";
  if (flag === "-a") return [line("Linux portfolio-server 5.4.0-42-generic #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020 x86_64 x86_64 x86_64 GNU/Linux")];
  if (flag === "-r") return [line("5.4.0-42-generic")];
  if (flag === "-n") return [line("portfolio-server")];
  if (flag === "-m") return [line("x86_64")];
  return [line("Linux")];
}

function cmdDate() {
  return [line(new Date().toString())];
}

function cmdUptime() {
  const secs = Math.floor(performance.now() / 1000);
  const hrs = Math.floor(secs / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  return [line(` ${new Date().toLocaleTimeString()} up ${hrs}:${String(mins).padStart(2, "0")},  1 user,  load average: 0.08, 0.03, 0.01`)];
}

function cmdDf(args) {
  const human = args.includes("-h");
  const out = [line("Filesystem      Size  Used Avail Use% Mounted on")];
  if (human) {
    out.push(line("/dev/xvda1       50G   12G   36G  25% /"));
    out.push(line("tmpfs           7.8G     0  7.8G   0% /dev/shm"));
    out.push(line("/dev/xvdb       100G   24G   72G  25% /home"));
  } else {
    out.push(line("/dev/xvda1    52428800 12582912 37748736  25% /"));
    out.push(line("tmpfs          8192000        0  8192000   0% /dev/shm"));
    out.push(line("/dev/xvdb   104857600 25165824 75497472  25% /home"));
  }
  return out;
}

function cmdFree(args) {
  const human = args.includes("-h");
  const out = [line("              total        used        free      shared  buff/cache   available")];
  if (human) {
    out.push(line("Mem:          15Gi       2.1Gi        12Gi        64Mi       1.5Gi        13Gi"));
    out.push(line("Swap:        2.0Gi          0B       2.0Gi"));
  } else {
    out.push(line("Mem:       16384000     2201600    13107200       65536     1572864    14417920"));
    out.push(line("Swap:       2097152           0     2097152"));
  }
  return out;
}

function cmdPs(args) {
  const all = args.includes("aux") || args.includes("-ef") || args.includes("-e");
  const out = [line(all ? "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND" : "  PID TTY          TIME CMD")];
  if (all) {
    out.push(line("root         1  0.0  0.1 169344 11200 ?        Ss   12:00   0:02 /sbin/init"));
    out.push(line("root         2  0.0  0.0      0     0 ?        S    12:00   0:00 [kthreadd]"));
    out.push(line("root       123  0.0  0.2  72296 16384 ?        Ss   12:00   0:00 /usr/sbin/sshd -D"));
    out.push(line("www-data   456  0.0  0.3 142080 24576 ?        S    12:01   0:01 nginx: worker process"));
    out.push(line("guest     1001  0.0  0.1  21468  8192 pts/0    Ss   12:05   0:00 -bash"));
    out.push(line("guest     1042  0.0  0.0  38376  3456 pts/0    R+   12:10   0:00 ps aux"));
  } else {
    out.push(line(" 1001 pts/0    00:00:00 bash"));
    out.push(line(" 1042 pts/0    00:00:00 ps"));
  }
  return out;
}

function cmdTop() {
  const now = new Date().toLocaleTimeString();
  return [
    line(`top - ${now} up 0:05,  1 user,  load average: 0.08, 0.03, 0.01`),
    line("Tasks:   6 total,   1 running,   5 sleeping,   0 stopped,   0 zombie"),
    line("%Cpu(s):  2.4 us,  0.8 sy,  0.0 ni, 96.5 id,  0.2 wa,  0.0 hi,  0.1 si"),
    line("MiB Mem :  16000.0 total,  12845.3 free,   2150.4 used,   1004.3 buff/cache"),
    line("MiB Swap:   2048.0 total,   2048.0 free,      0.0 used.  13900.0 avail Mem"),
    blank(),
    line("  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND", "dim"),
    line("    1 root      20   0  169344  11200   8320 S   0.0   0.1   0:02.34 systemd"),
    line("  123 root      20   0   72296  16384  14080 S   0.0   0.2   0:00.45 sshd"),
    line("  456 www-data  20   0  142080  24576  18432 S   0.3   0.3   0:01.23 nginx"),
    line(" 1001 guest     20   0   21468   8192   6912 S   0.0   0.1   0:00.08 bash"),
    line(" 1042 guest     20   0   38376   3456   3072 R   0.0   0.0   0:00.00 top"),
  ];
}

function cmdHead(args) {
  let n = 10;
  const files = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n" && args[i + 1]) { n = parseInt(args[++i], 10); }
    else files.push(args[i]);
  }
  if (files.length === 0) return [line("head: missing file operand", "error")];
  const target = normalizePath(cwd, files[0], homeDir);
  const node = resolvePath(fs, target);
  if (!node) return [line(`head: cannot open '${files[0]}' for reading: No such file or directory`, "error")];
  if (node.type === "dir") return [line(`head: error reading '${files[0]}': Is a directory`, "error")];
  return (node.content || "").split("\n").slice(0, n).map((l) => line(l));
}

function cmdTail(args) {
  let n = 10;
  const files = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === "-n" && args[i + 1]) { n = parseInt(args[++i], 10); }
    else files.push(args[i]);
  }
  if (files.length === 0) return [line("tail: missing file operand", "error")];
  const target = normalizePath(cwd, files[0], homeDir);
  const node = resolvePath(fs, target);
  if (!node) return [line(`tail: cannot open '${files[0]}' for reading: No such file or directory`, "error")];
  if (node.type === "dir") return [line(`tail: error reading '${files[0]}': Is a directory`, "error")];
  const lines = (node.content || "").split("\n");
  return lines.slice(-n).map((l) => line(l));
}

function cmdGrep(args) {
  if (args.length < 1) return [line("Usage: grep PATTERN [FILE]", "error")];
  const pattern = args[0];
  let content = "";
  if (args._stdin !== undefined) {
    content = args._stdin;
  } else if (args[1]) {
    const file = args[1];
    const target = normalizePath(cwd, file, homeDir);
    const node = resolvePath(fs, target);
    if (!node) return [line(`grep: ${file}: No such file or directory`, "error")];
    if (node.type === "dir") return [line(`grep: ${file}: Is a directory`, "error")];
    content = node.content || "";
  } else {
    return [line("Usage: grep PATTERN [FILE]", "error")];
  }
  const matches = content.split("\\n").filter((l) => l.toLowerCase().includes(pattern.toLowerCase()));
  if (matches.length === 0) return [];
  return matches.map((l) => line(l));
}

function cmdWc(args) {
  const out = [];
  const files = args.filter((a) => !a.startsWith("-"));
  if (args._stdin !== undefined) {
    const content = args._stdin;
    const lines = content === "" ? 0 : content.split("\\n").length;
    const words = content.split(/\\s+/).filter(Boolean).length;
    const chars = content.length;
    return [line(`  ${lines}   ${words}  ${chars}`)];
  }
  
  if (files.length === 0) return [line("wc: missing file operand", "error")];
  for (const file of files) {
    const target = normalizePath(cwd, file, homeDir);
    const node = resolvePath(fs, target);
    if (!node || node.type === "dir") { out.push(line(`wc: ${file}: No such file or directory`, "error")); continue; }
    const content = node.content || "";
    const lines = content === "" ? 0 : content.split("\\n").length;
    const words = content.split(/\\s+/).filter(Boolean).length;
    const chars = content.length;
    out.push(line(`  ${lines}   ${words}  ${chars} ${file}`));
  }
  return out;
}

function cmdEnv() {
  return Object.entries(envVars).map(([k, v]) => line(`${k}=${v}`));
}

function cmdExport(args) {
  for (const arg of args) {
    const [key, ...rest] = arg.split("=");
    if (key && rest.length > 0) {
      envVars[key] = rest.join("=");
    }
  }
  return [];
}

function cmdAlias(args) {
  if (args.length === 0) {
    return Object.entries(aliases).map(([k, v]) => line(`alias ${k}='${v}'`));
  }
  for (const arg of args) {
    const eqIdx = arg.indexOf("=");
    if (eqIdx > 0) {
      aliases[arg.substring(0, eqIdx)] = arg.substring(eqIdx + 1).replace(/^['"]|['"]$/g, "");
    }
  }
  return [];
}

function cmdHistory() {
  return commandHistoryList.map((cmd, i) => line(`  ${String(i + 1).padStart(4)}  ${cmd}`));
}

function cmdMan(args) {
  if (args.length === 0) return [line("What manual page do you want?", "error")];
  const cmd = args[0];
  const manPages = {
    ls: "ls - list directory contents\n\nSYNOPSIS: ls [OPTION]... [FILE]...\n\nOPTIONS:\n  -a     do not ignore entries starting with .\n  -l     use a long listing format\n  -la    combination of -l and -a",
    cd: "cd - change the working directory\n\nSYNOPSIS: cd [dir]\n\nDESCRIPTION:\n  Change the current directory to dir. The default dir is HOME.",
    cat: "cat - concatenate files and print on the standard output\n\nSYNOPSIS: cat [FILE]...",
    pwd: "pwd - print name of current working directory",
    mkdir: "mkdir - make directories\n\nSYNOPSIS: mkdir [DIRECTORY]...",
    touch: "touch - change file timestamps / create empty files\n\nSYNOPSIS: touch [FILE]...",
    rm: "rm - remove files or directories\n\nSYNOPSIS: rm [OPTION]... FILE...\n\nOPTIONS:\n  -r, -R    remove directories and their contents recursively",
    grep: "grep - print lines matching a pattern\n\nSYNOPSIS: grep PATTERN FILE",
    echo: "echo - display a line of text\n\nSYNOPSIS: echo [STRING]...",
  };
  const page = manPages[cmd];
  if (!page) return [line(`No manual entry for ${cmd}`, "error")];
  return page.split("\n").map((l) => line(l));
}

function cmdNeofetch() {
  const userName = profile.name.split(" ")[0].toLowerCase();
  return [
    line("            .-/+oossssoo+/-.            ", "accent"),
    line("        `:+ssssssssssssssssss+:`         ", "accent"),
    line("      -+ssssssssssssssssssyyssss+-       ", "accent"),
    line("    .ossssssssssssssssss" + "dMMMNy" + "sssso.     ", "accent"),
    line("   /sssssssssss" + "hdmmNNmmyNMMMMh" + "ssssss/    ", "accent"),
    line("  +sssssssss" + "hm" + "yd" + "MMMMMMMNddddy" + "ssssssss+   ", "accent"),
    line(" /ssssssss" + "hNMMM" + "yh" + "hyyyyhmNMMMNh" + "ssssssss/  ", "accent"),
    line(".ssssssss" + "dMMMNh" + "ssssssssss" + "hNMMMd" + "ssssssss. ", "accent"),
    line("+ssss" + "hhhyNMMNy" + "ssssssssssss" + "yNMMMy" + "sssssss+ ", "accent"),
    line("oss" + "yNMMMNyMMh" + "ssssssssssssss" + "hmmmh" + "ssssssso ", "accent"),
    line("oss" + "yNMMMNyMMh" + "sssssssssssssssmh" + "ssssssssssso ", "accent"),
    line("+ssss" + "hhhyNMMNy" + "ssssssssssssss" + "yNMMMy" + "sssssss+ ", "accent"),
    line(".ssssssss" + "dMMMNh" + "ssssssssss" + "hNMMMd" + "ssssssss. ", "accent"),
    line(" /ssssssss" + "hNMMM" + "yh" + "hyyyyhdNMMMNh" + "ssssssss/  ", "accent"),
    line("  +sssssssss" + "dm" + "yd" + "MMMMMMMMddddy" + "ssssssss+   ", "accent"),
    line("   /sssssssssss" + "hdmNNNNmyNMMMMh" + "ssssss/    ", "accent"),
    line("    .ossssssssssssssssss" + "dMMMNy" + "sssso.     ", "accent"),
    line("      -+sssssssssssssssss" + "yyy" + "ssss+-       ", "accent"),
    line("        `:+ssssssssssssssssss+:`         ", "accent"),
    line("            .-/+oossssoo+/-.             ", "accent"),
    blank(),
    line(`  guest@portfolio-server`, "accent"),
    line(`  -------------------------`, "dim"),
    line(`  OS: Ubuntu 20.04.6 LTS x86_64`),
    line(`  Host: EC2 t3.medium`),
    line(`  Kernel: 5.4.0-42-generic`),
    line(`  Uptime: ${Math.floor(performance.now() / 60000)} mins`),
    line(`  Packages: 1247 (dpkg)`),
    line(`  Shell: bash 5.0.17`),
    line(`  Terminal: xterm-256color`),
    line(`  CPU: Intel Xeon E5-2686 v4 (4) @ 2.30GHz`),
    line(`  Memory: 2150MiB / 16000MiB`),
  ];
}

function cmdSudo(args) {
  if (args.length === 0) return [line("usage: sudo <command>", "error")];
  return [
    line("[sudo] password for guest: ", "dim"),
    line(`Sorry, user guest is not allowed to execute '${args.join(" ")}' as root on this server.`, "error"),
    line("This incident will be reported. 🚨", "error"),
  ];
}

function cmdApt(args) {
  if (args.length === 0) return [line("Usage: apt [options] command", "error")];
  const sub = args[0];
  if (sub === "update") {
    return [
      line("Hit:1 http://archive.ubuntu.com/ubuntu focal InRelease"),
      line("Hit:2 http://archive.ubuntu.com/ubuntu focal-updates InRelease"),
      line("Hit:3 http://security.ubuntu.com/ubuntu focal-security InRelease"),
      line("Reading package lists... Done", "accent"),
      line("All packages are up to date."),
    ];
  }
  if (sub === "install") {
    return [line("E: Could not open lock file /var/lib/dpkg/lock-frontend - open (13: Permission denied)", "error")];
  }
  if (sub === "list" && args[1] === "--installed") {
    return [
      line("bash/focal,now 5.0-6ubuntu1.2 amd64 [installed]"),
      line("curl/focal-updates,now 7.68.0-1ubuntu2.18 amd64 [installed]"),
      line("docker-ce/focal,now 5:20.10.21~3-0~ubuntu-focal amd64 [installed]"),
      line("git/focal-updates,now 1:2.25.1-1ubuntu3.10 amd64 [installed]"),
      line("nginx/focal-updates,now 1.18.0-0ubuntu1.4 amd64 [installed]"),
      line("openssh-server/focal-updates,now 1:8.2p1-4ubuntu0.7 amd64 [installed]"),
      line("python3/focal,now 3.8.2-0ubuntu2 amd64 [installed]"),
      line("terraform/focal,now 1.5.7 amd64 [installed]"),
      line("kubectl/focal,now 1.27.4-00 amd64 [installed]"),
    ];
  }
  return [line(`E: Invalid operation ${sub}`, "error")];
}

function cmdTree(args) {
  const target = normalizePath(cwd, args[0] || "", homeDir);
  const node = resolvePath(fs, target);
  if (!node) return [line(`${args[0] || "."}: [error opening dir]`, "error")];
  if (node.type !== "dir") return [line(args[0] || ".")];

  const out = [line(displayPath(target, homeDir))];
  let dirCount = 0;
  let fileCount = 0;

  function walk(n, prefix) {
    const entries = Object.keys(n.children).sort();
    entries.forEach((name, i) => {
      const isLast = i === entries.length - 1;
      const connector = isLast ? "└── " : "├── ";
      const child = n.children[name];
      if (child.type === "dir") {
        dirCount++;
        out.push(line(`${prefix}${connector}${name}`, "accent"));
        walk(child, prefix + (isLast ? "    " : "│   "));
      } else {
        fileCount++;
        out.push(line(`${prefix}${connector}${name}`));
      }
    });
  }
  walk(node, "");
  out.push(blank());
  out.push(line(`${dirCount} directories, ${fileCount} files`, "dim"));
  return out;
}

function cmdCp(args) {
  if (args.length < 2) return [line("cp: missing file operand", "error")];
  const src = normalizePath(cwd, args[0], homeDir);
  const dest = normalizePath(cwd, args[1], homeDir);
  const srcNode = resolvePath(fs, src);
  if (!srcNode) return [line(`cp: cannot stat '${args[0]}': No such file or directory`, "error")];
  if (srcNode.type === "dir") return [line(`cp: -r not specified; omitting directory '${args[0]}'`, "error")];

  const destNode = resolvePath(fs, dest);
  if (destNode && destNode.type === "dir") {
    const fileName = src.split("/").pop();
    destNode.children[fileName] = { type: "file", content: srcNode.content };
  } else {
    const parentPath = dest.substring(0, dest.lastIndexOf("/")) || "/";
    const fileName = dest.split("/").pop();
    const parent = resolvePath(fs, parentPath);
    if (!parent || parent.type !== "dir") return [line(`cp: cannot create '${args[1]}': No such file or directory`, "error")];
    parent.children[fileName] = { type: "file", content: srcNode.content };
  }
  return [];
}

function cmdMv(args) {
  if (args.length < 2) return [line("mv: missing file operand", "error")];
  const result = cmdCp(args);
  if (result.length > 0 && result[0].variant === "error") return result;
  // Remove source
  const src = normalizePath(cwd, args[0], homeDir);
  const parentPath = src.substring(0, src.lastIndexOf("/")) || "/";
  const name = src.split("/").pop();
  const parent = resolvePath(fs, parentPath);
  if (parent) delete parent.children[name];
  return [];
}

function cmdChmod() { return [line("chmod: changing permissions of simulated files is not supported", "dim")]; }
function cmdChown() { return [line("chown: changing ownership of simulated files is not supported", "dim")]; }
function cmdCurl() { return [line("curl: (6) Could not resolve host. This is a simulated terminal.", "error")]; }
function cmdWget() { return [line("wget: unable to resolve host address. This is a simulated terminal.", "error")]; }
function cmdSsh() { return [line("ssh: connect to host: Connection refused. This is a simulated terminal.", "error")]; }
function cmdPing() { return [line("ping: simulated — 64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms", "dim")]; }
function cmdIfconfig() {
  return [
    line("eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 9001"),
    line("        inet 172.31.16.42  netmask 255.255.240.0  broadcast 172.31.31.255"),
    line("        inet6 fe80::4a:c3ff:fe12:3456  prefixlen 64  scopeid 0x20<link>"),
    line("        ether 02:4a:c3:12:34:56  txqueuelen 1000  (Ethernet)"),
    blank(),
    line("lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536"),
    line("        inet 127.0.0.1  netmask 255.0.0.0"),
    line("        inet6 ::1  prefixlen 128  scopeid 0x10<host>"),
  ];
}
function cmdIp(args) {
  if (args[0] === "addr" || args[0] === "a") return cmdIfconfig();
  return [line("Usage: ip [ addr | link | route ]", "dim")];
}

function cmdWhich(args) {
  if (args.length === 0) return [];
  const bins = { ls: "/usr/bin/ls", cat: "/usr/bin/cat", grep: "/usr/bin/grep", bash: "/usr/bin/bash", python3: "/usr/bin/python3", node: "/usr/bin/node", docker: "/usr/bin/docker", kubectl: "/usr/local/bin/kubectl", terraform: "/usr/local/bin/terraform", git: "/usr/bin/git" };
  const cmd = args[0];
  return [line(bins[cmd] || `${cmd} not found`)];
}

function cmdClear() { return { clear: true }; }

function cmdHelp() {
  return [
    line("Available commands:", "heading"),
    blank(),
    line("  Navigation & Files", "accent"),
    line("    ls [path]          List directory contents"),
    line("    cd <path>          Change directory"),
    line("    pwd                Print working directory"),
    line("    cat <file>         Display file contents"),
    line("    head <file>        Show first 10 lines"),
    line("    tail <file>        Show last 10 lines"),
    line("    tree [path]        Show directory tree"),
    line("    grep PAT <file>    Search file for pattern"),
    line("    wc <file>          Count lines/words/chars"),
    blank(),
    line("  File Operations", "accent"),
    line("    touch <file>       Create empty file"),
    line("    mkdir <dir>        Create directory"),
    line("    rm [-r] <path>     Remove file/directory"),
    line("    rmdir <dir>        Remove empty directory"),
    line("    cp <src> <dest>    Copy file"),
    line("    mv <src> <dest>    Move/rename file"),
    blank(),
    line("  System Info", "accent"),
    line("    whoami             Current user"),
    line("    hostname           System hostname"),
    line("    uname [-a]         System information"),
    line("    id                 User/group IDs"),
    line("    uptime             System uptime"),
    line("    date               Current date/time"),
    line("    df [-h]            Disk usage"),
    line("    free [-h]          Memory usage"),
    line("    ps [aux]           Process list"),
    line("    top                Process monitor"),
    line("    neofetch           System info display"),
    line("    ifconfig           Network interfaces"),
    blank(),
    line("  Environment", "accent"),
    line("    echo <text>        Print text ($VAR expansion)"),
    line("    env                Environment variables"),
    line("    export K=V         Set environment variable"),
    line("    alias [name=cmd]   Manage aliases"),
    line("    which <cmd>        Locate command"),
    line("    history            Command history"),
    line("    man <cmd>          Manual pages"),
    blank(),
    line("  Other", "accent"),
    line("    sudo <cmd>         Run as superuser"),
    line("    apt <subcmd>       Package manager"),
    line("    clear              Clear screen"),
    line("    exit               Close terminal"),
    line("    help               This help message"),
    blank(),
    line("Tip: Try 'ls ~/experience' or 'cat ~/about.txt'", "dim"),
  ];
}

// ---- Command registry ----

const commands = {
  ls: cmdLs, cd: cmdCd, pwd: cmdPwd, cat: cmdCat, mkdir: cmdMkdir,
  touch: cmdTouch, rm: cmdRm, rmdir: cmdRmdir, echo: cmdEcho,
  whoami: cmdWhoami, hostname: cmdHostname, id: cmdId, uname: cmdUname,
  date: cmdDate, uptime: cmdUptime, df: cmdDf, free: cmdFree,
  ps: cmdPs, top: cmdTop, head: cmdHead, tail: cmdTail, grep: cmdGrep,
  wc: cmdWc, env: cmdEnv, export: cmdExport, alias: cmdAlias,
  history: cmdHistory, man: cmdMan, neofetch: cmdNeofetch, sudo: cmdSudo,
  apt: cmdApt, "apt-get": cmdApt, tree: cmdTree, cp: cmdCp, mv: cmdMv,
  chmod: cmdChmod, chown: cmdChown, curl: cmdCurl, wget: cmdWget,
  ssh: cmdSsh, ping: cmdPing, ifconfig: cmdIfconfig, ip: cmdIp,
  which: cmdWhich, clear: cmdClear, help: cmdHelp,
  // Convenience aliases from old portfolio commands
  about: (args) => cmdCat(["~/about.txt"]),
  skills: (args) => cmdTree(["~/skills"]),
  experience: (args) => cmdTree(["~/experience"]),
  projects: (args) => cmdTree(["~/projects"]),
  certifications: (args) => cmdCat(["~/skills/certifications.md"]),
  education: (args) => cmdLs(["-l", "~/education"]),
  contact: (args) => cmdCat(["~/contact.md"]),
};

function tokenize(input) {
  const tokens = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;
  let escapeNext = false;
  
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (escapeNext) {
      current += char;
      escapeNext = false;
      continue;
    }
    if (char === '\\\\' && !inSingle) {
      escapeNext = true;
      continue;
    }
    if (char === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (char === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (char === ' ' && !inSingle && !inDouble) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    // Also split on operators if not quoted
    if ((char === ';' || char === '|' || char === '>' || char === '&') && !inSingle && !inDouble) {
      if (current.length > 0) {
        tokens.push(current);
        current = '';
      }
      // handle >> and &&
      if ((char === '>' || char === '&') && input[i+1] === char) {
        tokens.push(char + char);
        i++;
      } else if (char === '&') {
        tokens.push(char); // background process, unsupported but parsed
      } else {
        tokens.push(char);
      }
      continue;
    }
    current += char;
  }
  if (current.length > 0) {
    tokens.push(current);
  }
  return tokens;
}

function parsePipelines(tokens) {
  const pipelines = [];
  let currentPipeline = [];
  let currentCmd = [];
  
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === ';' || token === '&&') {
      if (currentCmd.length > 0) currentPipeline.push(currentCmd);
      if (currentPipeline.length > 0) pipelines.push({ cmds: currentPipeline, type: token });
      currentPipeline = [];
      currentCmd = [];
    } else if (token === '|') {
      if (currentCmd.length > 0) currentPipeline.push(currentCmd);
      currentCmd = [];
    } else {
      currentCmd.push(token);
    }
  }
  if (currentCmd.length > 0) currentPipeline.push(currentCmd);
  if (currentPipeline.length > 0) pipelines.push({ cmds: currentPipeline, type: 'end' });
  return pipelines;
}

export function runCommand(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  commandHistoryList.push(trimmed);

  const tokens = tokenize(trimmed);
  const pipelines = parsePipelines(tokens);
  
  const allOutput = [];
  let lastExitCode = 0;

  for (const pipeline of pipelines) {
    // If it's && and previous failed, skip
    if (pipeline.type === '&&' && lastExitCode !== 0) {
      // wait, the type '&&' means the NEXT pipeline depends on this one.
      // So if this pipeline fails, we skip the next one.
      // We handle it by evaluating this pipeline first.
    }
    
    // Evaluate pipeline
    let pipeData = []; // lines passed between commands
    let clearTerminal = false;

    for (let i = 0; i < pipeline.cmds.length; i++) {
      let cmdTokens = pipeline.cmds[i];
      
      // Extract redirection
      let redirectOut = null;
      let redirectAppend = false;
      const cleanTokens = [];
      for (let j = 0; j < cmdTokens.length; j++) {
        if (cmdTokens[j] === '>' || cmdTokens[j] === '>>') {
          redirectAppend = (cmdTokens[j] === '>>');
          redirectOut = cmdTokens[j+1];
          j++; // skip filename
        } else {
          cleanTokens.push(cmdTokens[j]);
        }
      }
      
      // Alias resolution
      let firstWord = cleanTokens[0];
      if (aliases[firstWord]) {
        const aliasTokens = tokenize(aliases[firstWord]);
        cleanTokens.splice(0, 1, ...aliasTokens);
      }
      
      const cmd = cleanTokens[0]?.toLowerCase();
      const args = cleanTokens.slice(1);
      
      // If we have pipeData from previous, we can append it as arguments or handle specially.
      // We'll pass it to handlers that support it via a context object, but for now we append as an arg if they accept stdin via args (hacky but works for some like grep).
      // A better way is to pass { stdin: pipeData }.
      
      const handler = commands[cmd];
      let result;
      if (!handler) {
        result = [line(`bash: ${cleanTokens[0]}: command not found`, "error")];
        lastExitCode = 127;
      } else {
        // We augment args with pipeData if needed, or pass it directly.
        // For simplicity, we just pass stdin to grep if it needs it.
        if (cmd === 'grep' && pipeData.length > 0) {
          args._stdin = pipeData.map(l => l.text).join('\\n');
        } else if (cmd === 'wc' && pipeData.length > 0) {
          args._stdin = pipeData.map(l => l.text).join('\\n');
        }
        
        result = handler(args);
        lastExitCode = 0;
      }
      
      if (result && result.clear) {
        clearTerminal = true;
        result = [];
      }
      
      // Output redirection
      if (redirectOut) {
        const target = normalizePath(cwd, redirectOut, homeDir);
        const parentPath = target.substring(0, target.lastIndexOf("/")) || "/";
        const fileName = target.split("/").pop();
        const parent = resolvePath(fs, parentPath);
        if (parent && parent.type === 'dir') {
          const content = result.map(l => l.text).join('\\n');
          if (redirectAppend && parent.children[fileName]) {
            parent.children[fileName].content += '\\n' + content;
          } else {
            parent.children[fileName] = { type: "file", content: content };
          }
        } else {
          allOutput.push(line(`bash: ${redirectOut}: No such file or directory`, "error"));
        }
        pipeData = []; // consumed by redirect
      } else if (i < pipeline.cmds.length - 1) {
        pipeData = result; // passed to next command in pipeline
      } else {
        // Last command in pipeline, output to terminal
        if (Array.isArray(result)) allOutput.push(...result);
      }
    }
    
    if (clearTerminal) return { clear: true };
    
    if (pipeline.type === '&&' && lastExitCode !== 0) {
      break; // stop executing further pipelines
    }
  }

  return allOutput;
}
