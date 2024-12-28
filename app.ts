import { App } from "astal/gtk3"
import Bar from "./widget/bar/Bar"
import taskMenu from "./widget/taskMenu/taskmenu"
import launcher from "./widget/launcher/launcher"
import "./icons/icons"
import "./lib/global"
import CountDown from "./widget/countDown/CountDown"
import { test } from "./widget/test"

App.start({
    icons: `${SRC}/assets`,
    requestHandler(request, res) {
        print(request)
        res("ok")
    },
    main: () => {
        App.get_monitors().map(Bar)
        taskMenu().catch(error => { print(error) })
        CountDown()
        launcher()
        test()
    }
})
