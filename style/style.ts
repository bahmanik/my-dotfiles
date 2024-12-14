import { App } from "astal/gtk3"
import GLib from "gi://GLib?version=2.0"
import { type Opt } from "lib/option"
import options from "../options"
import { dependencies, bash, ensureDirectory } from "../lib/utils"
import { monitorFile, writeFileAsync } from "astal/file"

const deps = [
    "font",
    "theme",
    "bar.corners",
    "bar.flatButtons",
    "bar.position",
    "bar.battery.charging",
    "bar.battery.blocks",
]

const {
    dark,
    light,
    blur,
    scheme,
    padding,
    spacing,
    radius,
    shadows,
    widget,
    border,
} = options.theme

const popoverPaddingMultiplier = 1.6
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const t = (dark: Opt<any>, light: Opt<any>) => scheme.get() === "dark"
    ? `${dark.get()}` : `${light.get()}`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const $ = (name: string, value: string | Opt<any>) => `$${name}: ${value};`

const variables = () => [
    $("bg", blur.get() ? `transparentize(${t(dark.bg, light.bg)}, ${blur.get() / 100})` : t(dark.bg, light.bg)),
    $("fg", t(dark.fg, light.fg)),

    $("primary-bg", t(dark.primary.bg, light.primary.bg)),
    $("primary-fg", t(dark.primary.fg, light.primary.fg)),

    $("error-bg", t(dark.error.bg, light.error.bg)),
    $("error-fg", t(dark.error.fg, light.error.fg)),

    $("scheme", scheme.get()),
    $("padding", `${padding.get()}pt`),
    $("spacing", `${spacing.get()}pt`),
    $("radius", `${radius.get()}pt`),
    $("transition", `${options.transition.get()}ms`),

    $("shadows", `${shadows.get()}`),

    $("widget-bg", `transparentize(${t(dark.widget, light.widget)}, ${widget.opacity.get() / 100})`),
    //$("widget-bg", `color.adjust(${t(dark.widget, light.widget)}, $alpha:${widget.opacity.get() / 100})`),

    $("hover-bg", `transparentize(${t(dark.widget, light.widget)}, ${(widget.opacity.get() * .9) / 100})`),
    $("hover-fg", `lighten(${t(dark.fg, light.fg)}, 8%)`),

    $("border-width", `${border.width.get()}pt`),

    $("border-color", `transparentize(${t(dark.border, light.border)}, ${border.opacity.get() / 100})`),
    $("border", "$border-width solid $border-color"),

    $("active-gradient", `linear - gradient(to right, ${t(dark.primary.bg, light.primary.bg)}, darken(${t(dark.primary.bg, light.primary.bg)}, 4%))`),
    $("shadow-color", scheme.get() === "dark" ? "rgba(0,0,0,.6)" : "rgba(0,0,0,.4)"),

    $("popover-border-color", `transparentize(${t(dark.border, light.border)}, ${Math.max(((border.opacity.get() - 1) / 100), 0)})`),
    $("popover-padding", `$padding * ${popoverPaddingMultiplier} `),
    $("popover-radius", radius.get() === 0 ? "0" : "$radius + $popover-padding"),

    $("font-size", `${options.font.size.get()}pt`),
    $("font-name", options.font.name.get()),

    // etc
    $("charging-bg", options.bar.battery.charging.get()),
    $("bar-battery-blocks", options.bar.battery.blocks.get()),
    $("bar-position", options.bar.position.get()),
    $("hyprland-gaps-multiplier", options.hyprland.gaps.get()),
    $("screen-corner-multiplier", `${options.bar.corners.get() * 0.01} `),
]

async function resetCss() {
    const TMP = `${GLib.get_tmp_dir()}/asztal`
    ensureDirectory(TMP)
    if (!dependencies("sass", "fd"))
        return

    try {
        const vars = `${TMP}/variables.scss`
        const css = `${TMP}/main.css`
        const scss = `${TMP}/main.scss`

        const fd = await bash(`fd ".scss" ${SRC}/style`)
        const files = fd.split(/\s+/)
        const imports = [vars, ...files].map(f => `@import '${f}';`)

        await writeFileAsync(vars, variables().join("\n"))
        await writeFileAsync(scss, imports.join("\n"))
        await bash(`sass ${scss} ${css}`)
        files.map(file => { monitorFile(file, resetCss) })

        App.apply_css(css, true)
    } catch (error) {
        error instanceof Error
            ? print(error)
            : console.error(error)
    }
}

options.handler(deps, resetCss)
await resetCss()
