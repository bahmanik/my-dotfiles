import { Variable } from "../../../../../../usr/share/astal/gjs"
import { App } from "astal/gtk3"
import icon, { icons } from "../../icons/icons"
import Apps from "gi://AstalApps"
import options from "../../options"



export default function AppLauncher() {
    function AppItem({ app }: Apps.Application) {
        const title = <label
            class_name="title"
            label={app.name}
            hexpand
            xalign={0}
        //vpack: "center",
        //truncate: "end",
        />
        const description = <label
            class_name="description"
            label={app.description || ""}
            hexpand
        //wrap
        //max_width_chars: 30,
        //xalign: 0,
        //justification: "left",
        //vpack: "center",
        />
        const appicon = <icon
            icon={icon(app.iconName, icons.fallback.executable)}
        //size= iconSize.bind()
        />
        const TextBox = <box
            vertical
        //vpack: "center",
        >
            {app.description ? [title, description] : title}
        </box>

        return <revealer attribute={app}>
            <button
                class_name="app-item"
                on_clicked={() => {
                    App.get_window("launcher")!.hide(); app.launch()
                }}>
                <box>
                    {[appicon, TextBox]}
                </box>
            </button>
        </revealer>
    }

    const apps = new Apps.Apps()
    const applist = Variable(apps.exact_query(""))
    let first: Apps.Application

    const list = <box vertical>
        {applist(apps => apps.map((app: Apps.Application) => <AppItem app={app} />))}
    </box>

    function filter(text: string | null) {
        first = apps.fuzzy_query(text || "")[0]
        console.log(first.name)
        let i = 0
        list.children.map(reveal => {
            if (text && i <= 5 && reveal.attribute.exact_match(text).name) {
                reveal.revealChild = true
                i++
            }
            else {
                reveal.revealChild = false
            }
        })
    }

    function launchFirst() {
        first.launch()
    }
    return Object.assign(list, { filter, launchFirst })
}
