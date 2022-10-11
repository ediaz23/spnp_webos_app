
import kind from '@enact/core/kind'
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator'
import PropTypes from 'prop-types'

import MainPanel from '../views/MainPanel'
import './attachErrorHandler'
import css from './App.module.less';


const App = kind({
    name: 'App',

    styles: {
        css,
        className: 'app'
    },

    propTypes: {
        path: PropTypes.string
    },

    defaultProps: {
        path: '/home'
    },

    render: ({ path, ...rest }) => {
        return (
            <MainPanel title="Media"
                titleBelow="Select Storage" {...rest} />
        )
    }
});

export default MoonstoneDecorator(App);
