import options from 'src/options';
import PopupWindow from '../shared/PopUp'
import Apps from "gi://AstalApps"
import { icon } from "src/lib/utils"
import { App } from "astal/gtk3"
import AppLauncher from "./AppLauncher"
import { bind, Variable } from 'astal';
import { Gtk } from 'astal/gtk3';
import Separator from '../shared/Separator';

export default (): JSX.Element => {
	const revealChild = Variable(true)
	const apps = new Apps.Apps()
	const Applauncher = AppLauncher()

	const favoritesNames = bind(options.launcher.apps.favorites)

	const Favorites = () => (
		<revealer hexpand halign={Gtk.Align.FILL} reveal_child={bind(revealChild)}>
			<box vertical>
				<Separator />
				<box halign={Gtk.Align.FILL} hexpand>
					{favoritesNames.as(fl => {
						const favoriteApps = fl.map(f => apps.fuzzy_query(f)[0]).filter(f => f)
						return favoriteApps.map((app: Apps.Application) => <button
							halign={Gtk.Align.CENTER}
							hexpand
							onClicked={() => { App.get_window("launcher")!.hide(); app.launch() }}>
							<box className="test" hexpand>
								<icon className="favoritesIcon" icon={icon(app.icon_name)} />
							</box>
						</button>
						)
					})}
				</box >
			</box>
		</revealer >
	)

	const Entry = () => <entry
		hexpand
		onActivate={({ text }: { text: string }) => {
			if (text?.startsWith(":nx")) { }
			else if (text?.startsWith(":sh")) { }
			else Applauncher.launchFirst()
			App.get_window("launcher")!.hide()
		}}

		onChanged={({ text }: { text: string }) => {
			text ||= ""
			revealChild.set(text === "")
			if (text?.startsWith(":nx")) { }
			else { }
			if (text?.startsWith(":sh")) { }
			else { }
			if (!text?.startsWith(":")) {
				Applauncher.filter(text)
			}
		}}

		setup={self => {
			App.connect('window-toggled', () => {
				self.grab_focus()
				self.text = ""
			});
		}}
	/>

	return (
		<PopupWindow layout="top" marginTop={100} name="launcher">
			<box vertical className="launcher">
				<Entry />
				<Favorites />
				{Applauncher}
			</box>
		</PopupWindow>
	);
};

