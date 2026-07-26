import OutputLine from "./OutputLine";
import { profile } from "../data/profile";

const BOOT_LINES = [
  { text: "Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-42-generic x86_64)", variant: "default" },
  { text: "", variant: "default" },
  { text: " * Documentation:  https://help.ubuntu.com", variant: "dim" },
  { text: " * Management:     https://landscape.canonical.com", variant: "dim" },
  { text: " * Support:        https://ubuntu.com/advantage", variant: "dim" },
  { text: "", variant: "default" },
  { text: "  System information as of " + new Date().toString(), variant: "dim" },
  { text: "", variant: "default" },
  { text: "  System load:  0.08               Processes:           124", variant: "default" },
  { text: "  Usage of /:   25.0% of 49.12GB   Users logged in:     1", variant: "default" },
  { text: "  Memory usage: 13%                IPv4 address for eth0: 172.31.16.42", variant: "default" },
  { text: "  Swap usage:   0%", variant: "default" },
  { text: "", variant: "default" },
  { text: "0 updates can be applied immediately.", variant: "default" },
  { text: "", variant: "default" },
  { text: `Last login: ${new Date(Date.now() - 3600000).toString().slice(0, 24)} from 10.0.0.1`, variant: "dim" },
  { text: "", variant: "default" },
  { text: `  ╔══════════════════════════════════════════════════╗`, variant: "accent" },
  { text: `  ║  ${profile.name}'s Portfolio Server              ║`, variant: "accent" },
  { text: `  ║  Type 'help' for commands or 'neofetch' to start ║`, variant: "accent" },
  { text: `  ╚══════════════════════════════════════════════════╝`, variant: "accent" },
  { text: "", variant: "default" },
];

export default function BootMessage() {
  return (
    <div>
      {BOOT_LINES.map((l, i) => (
        <OutputLine key={i} text={l.text} variant={l.variant} />
      ))}
    </div>
  );
}
