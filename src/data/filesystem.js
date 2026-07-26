/**
 * filesystem.js
 * -------------
 * Virtual Ubuntu 20+ filesystem.
 * Directories contain children objects, files contain string content.
 * Profile data is populated from profile.js to make `cat` work naturally.
 */

import { profile } from "./profile";

// Helper functions for dynamic content generation
function getAboutContent() {
  return [
    `Name:     ${profile.name}`,
    `Title:    ${profile.title}`,
    `Location: ${profile.location}`,
    ``,
    profile.summary,
  ].join("\n");
}

function getContactContent() {
  return [
    `# Contact Information`,
    ``,
    `- Email:    ${profile.email}`,
    `- Phone:    ${profile.phone}`,
    `- LinkedIn: [Profile](${profile.linkedin})`,
    `- GitHub:   [Profile](${profile.github})`,
  ].join("\n");
}

function buildExperienceNodes() {
  const expNodes = {};
  profile.experience.forEach((job) => {
    // Sanitize company name for directory
    const dirName = job.slug || job.company.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "");
    expNodes[dirName] = {
      type: "dir",
      children: {
        "role.txt": { type: "file", content: [job.role, job.duration, job.experience].filter(Boolean).join("\n") },
        "project.txt": { type: "file", content: [job.project, job.client && `Client: ${job.client}`].filter(Boolean).join("\n") },
        "technologies.txt": { type: "file", content: (job.technologies || []).join("\n") },
        "responsibilities.md": { type: "file", content: job.highlights.map(h => `- ${h}`).join("\n") },
        "impact.md": { type: "file", content: job.highlights.map(h => `- ${h}`).join("\n") }
      }
    };
  });
  return expNodes;
}

function buildProjectNodes() {
  const projNodes = {};
  profile.projects.forEach((proj) => {
    const dirName = proj.slug || proj.name.toLowerCase().replace(/[^a-z0-9]/g, "-");
    projNodes[dirName] = {
      type: "dir",
      children: {
        "README.md": { type: "file", content: [
          `# ${proj.name}`,
          "",
          proj.description,
          proj.organization && `Organization: ${proj.organization}`,
          proj.client && `Client: ${proj.client}`,
          proj.category && `Category: ${proj.category}`,
          proj.link && `Link: ${proj.link}`,
        ].filter(Boolean).join("\n") },
        "stack.txt": { type: "file", content: proj.stack.join("\n") },
        "highlights.md": { type: "file", content: (proj.highlights || []).map(h => `- ${h}`).join("\n") }
      }
    };
  });
  return projNodes;
}

function buildSkillsNodes() {
  const skillNodes = {};
  const getCat = (name) => profile.skills.find(s => s.category === name)?.items || [];
  
  skillNodes["programming_languages.md"] = {
    type: "file",
    content: getCat("Scripting & Languages").map(i => `- ${i}`).join("\n")
  };
  skillNodes["aws_services.md"] = {
    type: "file",
    content: getCat("Cloud Platforms").map(i => `- ${i}`).join("\n")
  };
  skillNodes["devops_tools.md"] = {
    type: "file",
    content: [
      ...getCat("CI/CD & Automation"),
      ...getCat("Infrastructure as Code"),
      ...getCat("Containers & Orchestration")
    ].map(i => `- ${i}`).join("\n")
  };
  skillNodes["certifications.md"] = {
    type: "file",
    content: profile.certifications.map(c => `- ${c}`).join("\n")
  };
  return skillNodes;
}

function buildEducationNodes() {
  const edNodes = {};
  if (profile.education.length > 0) {
    const ed = profile.education[0];
    edNodes["degree.txt"] = {
      type: "file",
      content: `${ed.degree}\n${ed.institution}\n${ed.duration}`
    };
  }
  return edNodes;
}

function readmeContent() {
  return [
    `# ${profile.name} — ${profile.title}`,
    ``,
    `Welcome to my interactive terminal portfolio!`,
    ``,
    `Navigate the filesystem to explore my background:`,
    ``,
    `  ~/about.txt`,
    `  ~/contact.md`,
    `  ~/experience/`,
    `  ~/projects/`,
    `  ~/skills/`,
    `  ~/education/`,
    ``,
    `Try commands like: ls, cd, cat, pwd, whoami, neofetch`,
  ].join("\n");
}

// Build the full filesystem tree
export function createFilesystem() {
  return {
    "/": {
      type: "dir",
      children: {
        bin: {
          type: "dir",
          children: {
            bash: { type: "file", content: "#!/bin/bash\n# GNU Bash 5.0" },
            ls: { type: "file", content: "ELF binary — /bin/ls" },
            cat: { type: "file", content: "ELF binary — /bin/cat" },
            grep: { type: "file", content: "ELF binary — /bin/grep" },
            echo: { type: "file", content: "ELF binary — /bin/echo" },
          },
        },
        boot: { type: "dir", children: { "vmlinuz-5.4.0-42-generic": { type: "file", content: "Linux kernel image" } } },
        dev: { type: "dir", children: { null: { type: "file", content: "" }, zero: { type: "file", content: "" }, tty: { type: "file", content: "" } } },
        etc: {
          type: "dir",
          children: {
            hostname: { type: "file", content: "portfolio-server" },
            passwd: {
              type: "file",
              content: [
                "root:x:0:0:root:/root:/bin/bash",
                "daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin",
                "www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin",
                `${profile.name.split(" ")[0].toLowerCase()}:x:1000:1000:${profile.name}:/home/${profile.name.split(" ")[0].toLowerCase()}:/bin/bash`,
                "guest:x:1001:1001:Guest User:/home/guest:/bin/bash",
              ].join("\n"),
            },
            "os-release": {
              type: "file",
              content: [
                'NAME="Ubuntu"',
                'VERSION="20.04.6 LTS (Focal Fossa)"',
                'ID=ubuntu',
                'ID_LIKE=debian',
                'PRETTY_NAME="Ubuntu 20.04.6 LTS"',
                'VERSION_ID="20.04"',
                'HOME_URL="https://www.ubuntu.com/"',
              ].join("\n"),
            },
            apt: { type: "dir", children: { "sources.list": { type: "file", content: "deb http://archive.ubuntu.com/ubuntu focal main restricted" } } },
            ssh: { type: "dir", children: { "sshd_config": { type: "file", content: "Port 22\nPermitRootLogin no\nPasswordAuthentication yes" } } },
          },
        },
        home: {
          type: "dir",
          children: {
            guest: {
              type: "dir",
              children: {
                "README.md": { type: "file", content: readmeContent() },
                ".bashrc": {
                  type: "file",
                  content: [
                    "# ~/.bashrc: executed by bash(1) for non-login shells.",
                    "export PS1='\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '",
                    "alias ll='ls -la'",
                    "alias la='ls -A'",
                    "export PATH=$PATH:/usr/local/bin",
                  ].join("\n"),
                },
                ".bash_history": {
                  type: "file",
                  content: ["neofetch", "cat README.md", "ls -la", "cat about.txt"].join("\n"),
                },
                ".config": {
                  type: "dir",
                  children: {
                    neofetch: {
                      type: "dir",
                      children: {
                        "config.conf": { type: "file", content: "# Neofetch config file\nprint_info() {\n    info title\n    info underline\n    info \"OS\" distro\n    info \"Host\" model\n    info \"Kernel\" kernel\n    info \"Uptime\" uptime\n    info \"Packages\" packages\n    info \"Shell\" shell\n    info \"Resolution\" resolution\n    info \"DE\" de\n    info \"WM\" wm\n    info \"WM Theme\" wm_theme\n    info \"Theme\" theme\n    info \"Icons\" icons\n    info \"Terminal\" term\n    info \"Terminal Font\" term_font\n    info \"CPU\" cpu\n    info \"GPU\" gpu\n    info \"Memory\" memory\n}" }
                      }
                    }
                  }
                },
                "about.txt": { type: "file", content: getAboutContent() },
                "contact.md": { type: "file", content: getContactContent() },
                "resume.pdf": { type: "file", content: "PDF Binary Data... [TODO: Replace with actual PDF blob or download link.]" },
                experience: {
                  type: "dir",
                  children: buildExperienceNodes(),
                },
                projects: {
                  type: "dir",
                  children: buildProjectNodes(),
                },
                skills: {
                  type: "dir",
                  children: buildSkillsNodes(),
                },
                education: {
                  type: "dir",
                  children: buildEducationNodes(),
                },
                Documents: { type: "dir", children: {} },
                Downloads: { type: "dir", children: {} },
                Desktop: { type: "dir", children: {} },
              },
            },
          },
        },
        opt: { type: "dir", children: {} },
        proc: {
          type: "dir",
          children: {
            cpuinfo: {
              type: "file",
              content: [
                "processor\t: 0",
                "vendor_id\t: GenuineIntel",
                "cpu family\t: 6",
                "model name\t: Intel(R) Xeon(R) CPU E5-2686 v4 @ 2.30GHz",
                "cpu MHz\t\t: 2300.000",
                "cache size\t: 46080 KB",
                "cpu cores\t: 4",
              ].join("\n"),
            },
            meminfo: {
              type: "file",
              content: [
                "MemTotal:       16384000 kB",
                "MemFree:        12845312 kB",
                "MemAvailable:   14228480 kB",
                "Buffers:          524288 kB",
                "Cached:          1048576 kB",
                "SwapTotal:       2097152 kB",
                "SwapFree:        2097152 kB",
              ].join("\n"),
            },
            version: {
              type: "file",
              content: "Linux version 5.4.0-42-generic (buildd@lgw01-amd64-038) (gcc version 9.3.0 (Ubuntu 9.3.0-17ubuntu1~20.04)) #46-Ubuntu SMP Fri Jul 10 00:24:02 UTC 2020",
            },
            uptime: { type: "file", content: "345672.45 2763840.20" },
          },
        },
        root: { type: "dir", children: { ".bashrc": { type: "file", content: "# root bashrc" } } },
        run: { type: "dir", children: {} },
        srv: { type: "dir", children: {} },
        sys: { type: "dir", children: {} },
        tmp: { type: "dir", children: {} },
        usr: {
          type: "dir",
          children: {
            bin: { type: "dir", children: {} },
            lib: { type: "dir", children: {} },
            local: { type: "dir", children: { bin: { type: "dir", children: {} } } },
            share: { type: "dir", children: {} },
          },
        },
        var: {
          type: "dir",
          children: {
            log: {
              type: "dir",
              children: {
                "syslog": {
                  type: "file",
                  content: [
                    "Jun 22 12:00:01 portfolio-server CRON[1234]: (root) CMD (test -x /usr/sbin/anacron)",
                    "Jun 22 12:05:22 portfolio-server systemd[1]: Started Session 42 of user guest.",
                    "Jun 22 12:05:23 portfolio-server sshd[5678]: Accepted publickey for guest from 10.0.0.1",
                    "Jun 22 12:10:00 portfolio-server kernel: [  345.678] EXT4-fs (xvda1): mounted filesystem",
                  ].join("\n"),
                },
                "auth.log": {
                  type: "file",
                  content: [
                    "Jun 22 11:55:01 portfolio-server sshd[1234]: Server listening on 0.0.0.0 port 22.",
                    "Jun 22 12:05:23 portfolio-server sshd[5678]: Accepted publickey for guest from 10.0.0.1 port 54321 ssh2",
                  ].join("\n"),
                },
                "kern.log": { type: "file", content: "Jun 22 12:00:00 portfolio-server kernel: [    0.000000] Linux version 5.4.0-42-generic" },
              },
            },
            www: { type: "dir", children: { html: { type: "dir", children: { "index.html": { type: "file", content: "<html><body>Welcome</body></html>" } } } } },
          },
        },
      },
    },
  };
}

// ---- Filesystem navigation helpers ----

/**
 * Resolve an absolute path string to the node in the tree.
 * Returns null if path doesn't exist.
 */
export function resolvePath(fs, absPath) {
  if (absPath === "/") return fs["/"];
  const parts = absPath.split("/").filter(Boolean);
  let node = fs["/"];
  for (const part of parts) {
    if (!node || node.type !== "dir" || !node.children[part]) return null;
    node = node.children[part];
  }
  return node;
}

/**
 * Normalize a path: resolve \`.\`, \`..\`, double slashes, and \`~\` (home).
 * cwd must be an absolute path.
 */
export function normalizePath(cwd, inputPath, homeDir = "/home/guest") {
  let target = inputPath;
  // Handle ~ expansion
  if (target === "~" || target === "") return homeDir;
  if (target.startsWith("~/")) target = homeDir + target.slice(1);
  // Handle relative vs absolute
  if (!target.startsWith("/")) {
    target = cwd + (cwd.endsWith("/") ? "" : "/") + target;
  }
  // Resolve . and ..
  const parts = target.split("/").filter(Boolean);
  const resolved = [];
  for (const p of parts) {
    if (p === ".") continue;
    if (p === "..") {
      resolved.pop();
    } else {
      resolved.push(p);
    }
  }
  return "/" + resolved.join("/");
}

/**
 * Pretty-display path with ~ for home.
 */
export function displayPath(absPath, homeDir = "/home/guest") {
  if (absPath === homeDir) return "~";
  if (absPath.startsWith(homeDir + "/")) return "~" + absPath.slice(homeDir.length);
  return absPath;
}
