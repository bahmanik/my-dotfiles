import options from "../../options"
import { App } from 'astal/gtk3';
import { ButtonProps } from "types/widgets/button"
import { toggle_window } from "../../lib/utils";

type PanelButtonProps = ButtonProps & {
    window?: string,
    flat?: boolean
}

export default ({
    window = "",
    flat,
    child,
    setup,
    ...rest
}: PanelButtonProps) => <button
        child={child}
        on_clicked={() => { toggle_window(window) }}
        hpack={"center"}
        vpack={"center"}
        setup={self => {
            self.toggleClassName("panel-button")
            self.toggleClassName(window)

            self.hook(options.bar.flatButtons, () => {
                self.toggleClassName("flat", flat ?? options.bar.flatButtons.value)
            })

            App.connect('window-toggled', (app) => {
                if (app.get_window(window)?.is_visible()) { self.toggleClassName("active") }
                else { self.toggleClassName("active", false) }
            })

            if (setup)
                setup(self)
        }}
        {...rest}
    />

