import { App, Gtk } from "astal/gtk3"
import { icon } from "src/lib/utils"
import Apps from "gi://AstalApps"
import { Variable } from "astal"
import Separator from "../shared/Separator"



export default function AppLauncher() {
    function AppItem({ app }: Apps.Application) {
        const Title = () => <label
            className="title"
            label={app.name}
            hexpand
            xalign={0}
            valign={Gtk.Align.CENTER}
        //truncate: "end",
        />
        const Description = () => <label
            className="description"
            label={app.description || ""}
            hexpand
            wrap
            maxWidthChars={10}
            xalign={0}
            valign={Gtk.Align.CENTER}
            justify={Gtk.Justification.LEFT}
        />
        const AppIcon = () => <icon
            className="appIcon"
            icon={icon(app.iconName)}
        />
        const TextBox = () => <box
            vertical
            valign={Gtk.Align.CENTER}
        >
            <Title />
            <Description />
        </box>

        return <revealer attribute={app}>
            <button
                className="app-item"
                onClicked={() => {
                    App.get_window("launcher")!.hide(); app.launch()
                }}>
                <box vertical>
                    <Separator />
                    <box>
                        <AppIcon />
                        <TextBox />
                    </box>
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
