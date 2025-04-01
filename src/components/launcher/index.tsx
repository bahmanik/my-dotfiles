import options from 'src/options';
import PopupWindow from '../shared/PopUp'
import { bind } from 'astal';
import { RevealerTransitionMap } from 'src/lib/constants/options.js';

const { transition } = options.menus;

export default (): JSX.Element => {
	return (
		<PopupWindow
			name={'launcher'}
			transition={bind(transition).as((transition) => RevealerTransitionMap[transition])}
			className="launcher"
		>
			<label label={"salam as launcher"} />
		</PopupWindow>
	);
};

