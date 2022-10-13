
import Cancelable from '@enact/ui/Cancelable'
import PropTypes from 'prop-types'
import Player from '../components/Player'


const PlayerPanelBase = ({...rest}) => {
    delete rest.hideChildren
    delete rest.changePanel
    return (
        <Player {...rest} />
    )
}

Player.propTypes = {
    changePanel: PropTypes.func,
}

const handleCancel = (ev, props) => {
    ev.stopPropagation()
    props.changePanel({})
}

const PlayerPanel = Cancelable(
    { modal: true, onCancel: handleCancel },
    PlayerPanelBase
)

export default PlayerPanel
