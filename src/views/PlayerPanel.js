
import Cancelable from '@enact/ui/Cancelable'
import PropTypes from 'prop-types'
import Player from '../components/Player'


const PlayerPanelBase = ({...rest}) => {
    delete rest.hideChildren
    return (
        <Player {...rest} />
    )
}

Player.propTypes = {
    backHome: PropTypes.func,
}

const handleCancel = (ev, props) => {
    ev.stopPropagation()
    props.backHome()
}

const PlayerPanel = Cancelable(
    { modal: true, onCancel: handleCancel },
    PlayerPanelBase
)

export default PlayerPanel
