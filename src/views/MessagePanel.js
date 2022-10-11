
import { Panel } from '@enact/moonstone/Panels'
import BodyText from '@enact/moonstone/BodyText'
import PropTypes from 'prop-types'


const MessagePanel = ({ message, ...rest }) => {

    return (
        <Panel {...rest}>
            <BodyText>{message}</BodyText>
        </Panel>
    )
}

MessagePanel.propTypes = {
    message: PropTypes.string,
}

export default MessagePanel
