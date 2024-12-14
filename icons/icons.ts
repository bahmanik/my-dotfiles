import { GLib } from "astal"
import { Gtk } from "astal/gtk3"

const substitutes = {
    "transmission-gtk": "transmission",
    "blueberry.py": "blueberry",
    "Caprine": "facebook-messenger",
    "com.raggesilver.BlackBox-symbolic": "terminal-symbolic",
    "org.wezfurlong.wezterm-symbolic": "terminal-symbolic",
    "audio-headset-bluetooth": "audio-headphones-symbolic",
    "audio-card-analog-usb": "audio-speakers-symbolic",
    "audio-card-analog-pci": "audio-card-symbolic",
    "preferences-system": "emblem-system-symbolic",
    "com.github.Aylur.ags-symbolic": "controls-symbolic",
    "com.github.Aylur.ags": "controls-symbolic",
    "kitty-symbolic": "kitty-jap",
    "org.kde.dolphin-symbolic": "dolphine-jap",
    "visual-studio-code-symbolic": "code-jap",
    "firefox-symbolic": "fox-jap",
}
export const icons = {
    missing: "image-missing-symbolic",
    nix: {
        nix: "nix-snowflake-symbolic",
    },
    app: {
        terminal: "terminal-symbolic",
    },
    fallback: {
        executable: "application-x-executable",
        notification: "dialog-information-symbolic",
        video: "video-x-generic-symbolic",
        audio: "audio-x-generic-symbolic",
    },
    ui: {
        plus: "plus",
        close: "window-close-symbolic",
        colorpicker: "color-select-symbolic",
        info: "info-symbolic",
        link: "external-link-symbolic",
        lock: "system-lock-screen-symbolic",
        menu: "open-menu-symbolic",
        refresh: "view-refresh-symbolic",
        search: "system-search-symbolic",
        settings: "emblem-system-symbolic",
        themes: "preferences-desktop-theme-symbolic",
        tick: "object-select-symbolic",
        time: "hourglass-symbolic",
        toolbars: "toolbars-symbolic",
        warning: "dialog-warning-symbolic",
        avatar: "avatar-default-symbolic",
        theme: "theme",
        tree: "tree-jap",
        arrow_u: "arrow-u",
        arrow: {
            right: "pan-end-symbolic",
            left: "pan-start-symbolic",
            down: "pan-down-symbolic",
            up: "pan-up-symbolic",
        },
    },
    audio: {
        mic: {
            muted: "microphone-disabled-symbolic",
            low: "microphone-sensitivity-low-symbolic",
            medium: "microphone-sensitivity-medium-symbolic",
            high: "microphone-sensitivity-high-symbolic",
        },
        volume: {
            muted: "audio-volume-muted-symbolic",
            low: "audio-volume-low-symbolic",
            medium: "audio-volume-medium-symbolic",
            high: "audio-volume-high-symbolic",
            overamplified: "audio-volume-overamplified-symbolic",
        },
        type: {
            headset: "audio-headphones-symbolic",
            speaker: "audio-speakers-symbolic",
            card: "audio-card-symbolic",
        },
        mixer: "mixer-symbolic",
    },
    powerprofile: {
        balanced: "power-profile-balanced-symbolic",
        "power-saver": "power-profile-power-saver-symbolic",
        performance: "power-profile-performance-symbolic",
    },
    asusctl: {
        profile: {
            Balanced: "power-profile-balanced-symbolic",
            Quiet: "power-profile-power-saver-symbolic",
            Performance: "power-profile-performance-symbolic",
        },
        mode: {
            Integrated: "processor-symbolic",
            Hybrid: "controller-symbolic",
        },
    },
    battery: {
        charging: "battery-flash-symbolic",
        warning: "battery-empty-symbolic",
    },
    bluetooth: {
        enabled: "bluetooth-active-symbolic",
        disabled: "bluetooth-disabled-symbolic",
    },
    brightness: {
        indicator: "display-brightness-symbolic",
        keyboard: "keyboard-brightness-symbolic",
        screen: "display-brightness-symbolic",
    },
    powermenu: {
        sleep: "weather-clear-night-symbolic",
        reboot: "system-reboot-symbolic",
        logout: "system-log-out-symbolic",
        shutdown: "system-shutdown-symbolic",
    },
    recorder: {
        recording: "media-record-symbolic",
    },
    notifications: {
        noisy: "org.gnome.Settings-notifications-symbolic",
        silent: "notifications-disabled-symbolic",
        message: "chat-bubbles-symbolic",
    },
    trash: {
        full: "user-trash-full-symbolic",
        empty: "user-trash-symbolic",
    },
    mpris: {
        shuffle: {
            enabled: "media-playlist-shuffle-symbolic",
            disabled: "media-playlist-consecutive-symbolic",
        },
        loop: {
            none: "media-playlist-repeat-symbolic",
            track: "media-playlist-repeat-song-symbolic",
            playlist: "media-playlist-repeat-symbolic",
        },
        playing: "media-playback-pause-symbolic",
        paused: "media-playback-start-symbolic",
        stopped: "media-playback-start-symbolic",
        prev: "media-skip-backward-symbolic",
        next: "media-skip-forward-symbolic",
    },
    system: {
        cpu: "org.gnome.SystemMonitor-symbolic",
        ram: "drive-harddisk-solidstate-symbolic",
        temp: "temperature-symbolic",
    },
    color: {
        dark: "dark-mode-symbolic",
        light: "light-mode-symbolic",
    },
}

function lookUpIcon(name?: string, size = 16): Gtk.IconInfo | null {
    if (!name) return null;

    return Gtk.IconTheme.get_default().lookup_icon(name, size, Gtk.IconLookupFlags.USE_BUILTIN)
}

export default function icon(name: string | null, fallback = icons.missing): string {
    const validateSubstitute = (name: string): name is keyof typeof substitutes => name in substitutes

    if (!name) return fallback || ''

    if (GLib.file_test(name, GLib.FileTest.EXISTS)) return name;

    let icon: string = name

    if (validateSubstitute(name)) {
        icon = substitutes[name]
    }

    if (lookUpIcon(icon)) return icon

    print(`no icon substitute "${icon}" for "${name}", fallback: "${fallback}"`)
    return fallback
}

