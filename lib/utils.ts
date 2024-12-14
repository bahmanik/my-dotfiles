import { exec, execAsync } from "astal/process"
import { Gio } from 'astal/file';
import { GLib } from 'astal/gobject';

export function ensureDirectory(path: string): void {
    if (!GLib.file_test(path, GLib.FileTest.EXISTS)) Gio.File.new_for_path(path).make_directory_with_parents(null);
}

export function toggle_window(name: string) {
    execAsync(`ags toggle ${name}`)
}

export function dependencies(...bins: string[]) {
    const missing = bins.filter(bin => { try { exec(`which ${bin}`) } catch { return true } })

    if (missing.length > 0) {
        console.warn(Error(`missing dependencies: ${missing.join(", ")}`))
        //Utils.notify(`missing dependencies: ${missing.join(", ")}`)
    }
    return missing.length === 0
}

export async function bash(strings: TemplateStringsArray | string, ...values: unknown[]) {
    const cmd = typeof strings === "string" ? strings : strings
        .flatMap((str, i) => str + `${values[i] ?? ""}`)
        .join("")

    return execAsync(["bash", "-c", cmd]).catch(err => {
        console.error(cmd, err)
        return ""
    })
}

