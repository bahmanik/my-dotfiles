import { opt, mkOptions } from "./lib/option"
import GLib from "gi://GLib?version=2.0"


const OPTIONS = `${GLib.get_user_cache_dir()}/ags2/options.json`
const mkOptionsArg = {
    autotheme: opt(false),

    theme: {
        dark: {
            primary: {
                bg: opt("#51a4e7"),
                fg: opt("#141414"),
            },
            error: {
                bg: opt("#e55f86"),
                fg: opt("#141414"),
            },
            bg: opt("#171717"),
            fg: opt("#eeeeee"),
            widget: opt("#eeeeee"),
            border: opt("#eeeeee"),
        },
        light: {
            primary: {
                bg: opt("#426ede"),
                fg: opt("#eeeeee"),
            },
            error: {
                bg: opt("#b13558"),
                fg: opt("#eeeeee"),
            },
            bg: opt("#fffffa"),
            fg: opt("#080808"),
            widget: opt("#080808"),
            border: opt("#080808"),
        },

        blur: opt(0),
        scheme: opt<"dark" | "light">("dark"),
        widget: { opacity: opt(94) },
        border: {
            width: opt(1),
            opacity: opt(96),
        },

        shadows: opt(true),
        padding: opt(7),
        spacing: opt(12),
        radius: opt(11),
    },

    transition: opt(200),

    font: {
        size: opt(13),
        name: opt("Ubuntu Nerd Font"),
    },

    bar: {
        flatButtons: opt(true),
        position: opt<"top" | "bottom" | "left" | "right">("top"),
        pattern: opt(false),
        pattern_size: opt(100),
        corners: opt(50),
        transparent: opt(false),
        iconSize: opt(0),
        monochrome: opt(true),
        launcher: {
            icon: {
                colored: opt(true),
            },
            label: {
                colored: opt(false),
                label: opt(" Applications"),
            },
        },
        date: {
            format: opt("%H:%M - %A %e."),
        },
        battery: {
            bar: opt<"hidden" | "regular" | "whole">("regular"),
            charging: opt("#00D787"),
            percentage: opt(true),
            blocks: opt(7),
            width: opt(50),
            low: opt(30),
        },
        workspaces: {
            workspaces: opt(7),
        },
        taskbar: {
            exclusive: opt(false),
        },
        messages: {
            action: opt(() => App.toggleWindow("datemenu")),
        },
        systray: {
            ignore: opt([
                "KDE Connect Indicator",
                "spotify-client",
            ]),
        },
        media: {
            monochrome: opt(true),
            preferred: opt("spotify"),
            direction: opt<"left" | "right">("right"),
            format: opt("{artists} - {title}"),
            length: opt(40),
        },
        powermenu: {
            monochrome: opt(false),
            action: opt(() => App.toggleWindow("powermenu")),
        },
    },

    launcher: {
        width: opt(0),
        margin: opt(80),
        nix: {
            pkgs: opt("nixpkgs/nixos-unstable"),
            max: opt(8),
        },
        sh: {
            max: opt(16),
        },
        apps: {
            iconSize: opt(62),
            max: opt(6),
            favorites: opt([
                [
                    "firefox",
                    "kitty",
                    "org.gnome.Nautilus",
                    "org.gnome.Calendar",
                    "spotify",
                ],
            ]),
        },
    },

    overview: {
        scale: opt(9),
        workspaces: opt(7),
        monochromeIcon: opt(true),
    },

    powermenu: {
        sleep: opt("systemctl suspend"),
        reboot: opt("systemctl reboot"),
        logout: opt("pkill Hyprland"),
        shutdown: opt("shutdown now"),
        layout: opt<"line" | "box">("line"),
        labels: opt(true),
    },

    quicksettings: {
        avatar: {
            size: opt(70),
        },
        width: opt(380),
        position: opt<"start" | "center" | "end">("start"),
        networkSettings: opt("gtk-launch gnome-control-center"),
        media: {
            monochromeIcon: opt(true),
            coverSize: opt(100),
        },
    },

    datemenu: {
        position: opt<"start" | "center" | "end">("center"),
        weather: {
            interval: opt(60_000),
            unit: opt<"metric" | "imperial" | "standard">("metric"),
        },
    },

    osd: {
        progress: {
            vertical: opt(true),
            pack: {
                h: opt<"start" | "center" | "end">("end"),
                v: opt<"start" | "center" | "end">("center"),
            },
        },
        microphone: {
            pack: {
                h: opt<"start" | "center" | "end">("center"),
                v: opt<"start" | "center" | "end">("end"),
            },
        },
    },

    notifications: {
        position: opt<Array<"top" | "bottom" | "left" | "right">>(["top", "right"]),
        blacklist: opt(["Spotify"]),
        width: opt(440),
    },

    hyprland: {
        gaps: opt(2.4),
        inactiveBorder: opt("#282828"),
        gapsWhenOnly: opt(false),
    },
}

const options = mkOptions(OPTIONS, mkOptionsArg)
export default options
